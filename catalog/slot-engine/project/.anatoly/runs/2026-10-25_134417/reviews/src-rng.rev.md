# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 95% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is virtually identical to `pickFromWeighted` in src/reels.ts: both reduce weights to a total, draw `Math.random() * total`, accumulate in a loop with an early return when roll < cumulative, and fall back to the last item. The only differences are variable names (cosmetic) and that `weightedPick` is generic `<T>` while `pickFromWeighted` is hardcoded to `Symbol[]`. Same semantic contract — weighted random selection — making `pickFromWeighted` a non-generic private copy of this exported utility.
- **Correction [OK]**: Cumulative-weight algorithm is correct. The fallback return on L15 handles floating-point rounding where roll equals totalWeight exactly, returning the last item as intended.
- **Overengineering [LEAN]**: Classic O(n) cumulative-weight algorithm with a single justified generic. No unnecessary abstractions; the fallback on the last item handles floating-point edge cases correctly.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~97% identical logic — both compute cumulative-weight weighted pick with the same reduce/random/loop/fallback pattern; differ only in generic type parameter vs. concrete Symbol type

## Best Practices — 6/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are never mutated inside the function but are typed as mutable arrays. They should be `readonly T[]` and `readonly number[]`. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | The block comment sits at file scope, not attached to the function. `weightedPick` has no `@param` or `@returns` annotations; non-obvious constraints (e.g. `items.length === weights.length` precondition, behavior on empty input) are undocumented. [L1-L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from `reels.ts`, `paytable.ts`, `jackpot.ts`, `freespin.ts`, `wild.ts` in project structure, JSDoc annotation 'gaming RNG applications', and the consumer `spin()` described as 'Executes a complete slot machine spin'. `Math.random()` is a non-seeded, statistically unaudited PRNG — it is not certifiable for regulated gaming RNG under any major jurisdiction (GLI, BMM, eCOGRA). A cryptographically secure, auditable RNG source (e.g. `crypto.getRandomValues`) must be used instead. [L8] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardwired, making deterministic unit tests impossible without monkey-patching. Injecting an `rng: () => number` parameter (defaulting to `Math.random`) would enable seeded, reproducible tests. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG context: no guard on empty `items`/`weights` arrays or length mismatch. An empty `items` array causes `weightedPick` to return `undefined` silently (typed as `T`). A zero-length or all-zero `weights` array produces a `NaN` roll that always falls through to the last item, skewing the distribution. [L6-L14] |

### Suggestions

- Inject the RNG source so the function is testable and so the production path can swap in a certified PRNG
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const roll = rng() * totalWeight;
  ```
- Use `crypto.getRandomValues` as the certified RNG source for regulated gaming instead of `Math.random`
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x1_0000_0000) * totalWeight;
  ```
- Add input guards and attach JSDoc to the function itself
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  /**
   * Selects one item from `items` proportionally to its entry in `weights`.
   * @param items   Non-empty array of candidates.
   * @param weights Parallel positive weights; must satisfy `items.length === weights.length`.
   * @param rng     Uniform [0, 1) source; defaults to `Math.random`.
   * @throws {RangeError} When arrays are empty or lengths differ.
   */
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new RangeError(`weightedPick: items (${items.length}) and weights (${weights.length}) must be non-empty and equal length`);
    }
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
