# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 92% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, scale Math.random() by it, accumulate per-item weights in a loop with an early-return when roll < cumulative, and fall back to the last element. Only differences are variable names (totalWeight/roll/cumulative vs total/r/acc), the generic T vs concrete Symbol type, and export visibility. weightedPick<Symbol> is a direct drop-in for pickFromWeighted.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; slot-engine domain inferred from docstring, symbol names, and paytable docs.
- **Overengineering [LEAN]**: Minimal cumulative-weight scan with a single pass. Generic T is appropriate — the function is reusable by design and adds no ceremony. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Called by src/engine.ts, so this RNG utility is part of a critical game path. No coverage of uniform distribution, zero-weight items, single-item arrays, weight proportionality, or the fallback return on floating-point boundary cases.
- **DOCUMENTED [DOCUMENTED]**: Block-level JSDoc covers purpose, algorithm, and context. Parameters lack explicit @param/@returns tags, but the description is clear and the generic signature is self-explanatory. (deliberated: reclassified: correction: NEEDS_FIX → OK — rng.ts:5-16 is a correct cumulative-weight sampler. It IS duplicated by pickFromWeighted in reels.ts:30-41, but the function itself is correct. Additionally, weightedPick is imported and registered in engine.ts:2,30 and resolved at engine.ts:120, but never invoked — actual RNG flows through factory.buildReels → spinReel → pickFromWeighted. The duplication and unused-resolve are real code smells, but neither constitutes a correctness bug on the correction axis. Both implementations produce correct weighted random selections independently.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight algorithm, same fallback, same Math.random() scaling; differs only in variable names and type parameter

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 1 | Strict mode | WARN | HIGH | tsconfig.json not provided in context; strict mode cannot be confirmed from this file alone. |
| 5 | Immutability | WARN | MEDIUM | Parameters items and weights are not readonly. The function never mutates them; they should be declared readonly T[] and readonly number[]. [L5] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No guard for empty input: when items is [], the loop does not execute and items[items.length - 1] returns undefined at runtime, violating the declared return type T. [L14] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/regulated-gaming domain confirmed by project structure (engine.ts, reels.ts, jackpot.ts, freespin.ts, paytable.ts) and the function's own JSDoc ('suitable for gaming RNG applications'). Math.random() is a non-cryptographic PRNG seeded by the JS engine — it is not certifiable for regulated gaming RNG under GLI-11, UKGC, or equivalent standards. A CSPRNG (crypto.getRandomValues() or a certified hardware RNG adapter) is required. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is called directly with no injection point, making deterministic unit testing impossible. An optional rng parameter (defaulting to Math.random) would allow test-time seeding. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | No guard for items.length !== weights.length mismatch. Passing arrays of different lengths silently produces incorrect probability distributions — particularly dangerous in a gaming context where weight tables are separately maintained in src/reels.ts. [L5] |

### Suggestions

- Replace Math.random() with a CSPRNG-backed draw to satisfy regulated gaming certification requirements (GLI-11 / UKGC).
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const roll = (crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000) * totalWeight;`
- Inject the RNG function to enable deterministic testing.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: T[], weights: number[], rng: () => number = Math.random): T {`
- Add readonly to parameters and guard against empty/mismatched input.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a certifiable source of randomness (e.g., crypto.getRandomValues() producing a value in [0, totalWeight)) to meet regulated gaming RNG requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
