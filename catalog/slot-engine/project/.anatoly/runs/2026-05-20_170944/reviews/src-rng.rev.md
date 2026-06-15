# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm to pickFromWeighted in src/reels.ts. Both accumulate weights via reduce, generate a random roll, iterate with accumulator to find weighted pick, and return fallback item. Only differences are variable naming (totalWeight/total, roll/r, cumulative/acc) and type genericity (T vs Symbol-specific).
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; algorithm logic is otherwise correct.
- **Overengineering [LEAN]**: Standard cumulative-weight selection algorithm. Generic type parameter T is appropriate for reuse across symbol arrays and any other weighted collections. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weight boundary (roll == cumulative), and uniform distribution validation. Used by src/engine.ts, making this a gap in core game logic coverage.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what `items` and `weights` represent, no constraint that arrays must be same length or weights must be positive), and no @returns tag describing what is returned or edge-case behavior when all weights are zero. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug in the function itself. weightedPick (rng.ts:5-16) is a correct generic weighted random selection implementation. The duplication with pickFromWeighted is real but belongs on the duplication axis. Critically: engine.ts:120 resolves weightedPick from the container as `rng`, but this resolved variable is never called — the actual spin path uses pickFromWeighted via factory.buildReels → spinReel. This is dead-at-runtime registration (architectural concern), not a correctness bug. The function works correctly when called.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 100% algorithmic identity — same cumulative-weight selection with uniform random draw; weightedPick is generic variant

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters items and weights are mutated by nothing inside the function but are typed as mutable arrays. Callers gain no guarantee the function won't mutate them. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by src/paytable.ts, src/freespin.ts, src/jackpot.ts, DIAMOND/SEVEN/BAR/WILD/SCATTER symbols, and the 95% RTP target. Math.random() is a non-cryptographic PRNG (V8 xorshift128+) that is not certifiable under any major gaming jurisdiction (GLI, BMM, iTech). Regulated RNG must use a CSPRNG — crypto.getRandomValues() or the Web Crypto API — seeded per-spin with verified entropy. Using Math.random() here exposes the operator to regulatory non-compliance and predictability attacks. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is called directly with no injection point. Tests must either mock globals or accept non-determinism. An optional rng parameter (defaulting to Math.random) would enable deterministic unit tests. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Utility function lacks defensive guards: (1) items.length !== weights.length is silently tolerated — the shorter array wins, producing skewed or undefined results; (2) empty items array returns items[items.length - 1] = items[-1] = undefined, typed as T — a silent lie to the type system. [L5-L15] |

### Suggestions

- Replace Math.random() with a CSPRNG and accept an injectable rng parameter for testability.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: ReadonlyArray<T>,
    weights: ReadonlyArray<number>,
    rng: () => number = () => {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] / 0x1_0000_0000;
    }
  ): T {
    const roll = rng() * totalWeight;
  ```
- Guard against mismatched or empty arrays to prevent silent undefined returns.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
  ```
- Use ReadonlyArray for both parameters to signal non-mutation at the call site.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {`

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a CSPRNG source (e.g. crypto.getRandomValues on a Uint32Array, normalised to [0,1)) to make weightedPick certifiable for regulated gaming use. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
