# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 91% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight random selection algorithm (RAG 0.819); differs only in type parameters and variable naming
- **Correction [NEEDS_FIX]**: Two independent defects: Math.random() is non-certifiable for regulated gaming RNG; empty items array silently returns undefined, violating return type T.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm. Generic T is justified — the function is genuinely type-agnostic and used with symbol arrays. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, negative weights, single-item arrays, and boundary roll values (roll === cumulative). The fallback return on L15 (guards floating-point overshoot) is also untested. Used by src/engine.ts, making this a production risk.
- **DOCUMENTED [DOCUMENTED]**: JSDoc describes purpose, algorithm (cumulative-weight with uniform random draw), and use-case context (gaming RNG). Generic type parameter T and parameters items/weights are self-explanatory; no return description is strictly needed given the clear signature. (deliberated: reclassified: correction: NEEDS_FIX → OK — src/rng.ts:5-16 is algorithmically correct — identical logic to pickFromWeighted (cumulative-weight selection with fallback). The NEEDS_FIX claim at 89% confidence is based on duplication, not a correctness bug. Moreover, weightedPick is effectively dead code: imported in engine.ts:2, registered in container at engine.ts:30, resolved at engine.ts:120 as `const rng`, but `rng` is never invoked — reels are built via factory.buildReels(5,3) → spinReel(i) → pickFromWeighted (confirmed via src/factories.ts:12 and grep showing no `rng(` calls in engine.ts). Duplication and dead-code concerns belong on duplication/utility axes, not correction.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — Identical weighted random selection logic; differs only in type parameters (generic T vs Symbol) and variable names

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are not mutated inside the function but are typed as mutable arrays. Should be `readonly T[]` and `readonly number[]`. [L5] |
| 13 | Security | FAIL | CRITICAL | Domain inferred as regulated slot-machine gaming from project symbols (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER, jackpot, free spins, paylines, RTP 95%) confirmed in `.anatoly/state/internal-docs/04-API-Reference/02-Configuration-Schema.md`. `Math.random()` is a non-cryptographic, non-certifiable PRNG; its output is predictable and not acceptable for regulated gaming RNG. Certified implementations require `crypto.getRandomValues()` or a hardware-backed RNG source. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly, making the function non-deterministic and untestable without patching the global. Inject an `rng: () => number` parameter (defaulting to `Math.random`) to allow seeded/deterministic testing. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG utility performs no defensive validation: (1) empty `items` array causes `items[items.length - 1]` to return `undefined` at runtime despite the return type `T`; (2) `items.length !== weights.length` is silently tolerated. Both conditions should throw at the call site. |

### Suggestions

- Mark array params readonly — they are never mutated
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Inject the RNG source for testability and to decouple from Math.random()
  ```typescript
  // Before
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const roll = rng() * totalWeight;
  ```
- Replace Math.random() with crypto.getRandomValues() for gaming-certifiable RNG
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x1_0000_0000) * totalWeight;
  ```
- Add defensive guards for empty array and length mismatch
  ```typescript
  // Before
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have the same length');
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add an early throw (or type-level NonEmptyArray constraint) when items.length === 0 to prevent a silent undefined return that violates the declared return type T. [L6]

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues (or equivalent CSPRNG) to produce certifiable randomness required for regulated gaming RNG. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
