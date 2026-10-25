# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 88% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Line-for-line identical logic to pickFromWeighted: sum weights, draw Math.random()*total, walk cumulative sum, return the first item whose cumulative weight exceeds the roll, fall back to last item. Only differences are variable names and generic T vs Symbol. weightedPick is the generic form, so pickFromWeighted can be replaced by it.
- **Correction [OK]**: The cumulative-weight selection is correct. `Math.random()` is in [0,1), so `roll` is in [0,total) and the `roll < cumulative` check gives each item a probability proportional to its weight. The final fallback only covers floating-point rounding. `Math.random()` as an RNG is a best-practices concern, not a correction defect. Empty-input and length-mismatch cases would need a caller to pass bad input, and none is visible.
- **Overengineering [LEAN]**: Minimal cumulative-weight pick: one reduce, one loop, fallback for float edge. No unnecessary abstraction; single live consumer.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~100% identical algorithm (cumulative-weight random pick); differs only in variable names and generic typing

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` are read-only in practice but typed as mutable arrays; use `readonly T[]` and `readonly number[]`. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc exists but has no @param/@returns. It does not state the weights contract (non-negative, same length as items, positive sum) or the empty-array behavior. It also claims the function is 'suitable for gaming RNG', which is false because it uses Math.random(). [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain inferred from the slot engine files (jackpot.ts, reels.ts, paytable.ts, freespin.ts) and the JSDoc 'gaming RNG applications'. `Math.random()` is not a certifiable or cryptographically secure RNG for regulated gaming, so outcomes are predictable. Use `crypto.getRandomValues` or `crypto.randomInt` with an injectable source. [L7] |
| 15 | Testability | WARN | MEDIUM | The RNG source is hard-wired, so tests cannot make draws deterministic. The core could accept an injectable `random: () => number`. See rule 13, which already carries the FAIL for the same line. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | No validation that `items.length === weights.length`, that weights are non-negative and finite, or that `items` is non-empty. An empty array returns `undefined` typed as `T`. A zero or negative total weight silently returns the last item. NaN weights make every comparison false, so the fallback is returned. [L5-L16] |

### Suggestions

- Use a cryptographically secure, injectable RNG source and validate inputs
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32,
  ): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new RangeError('items and weights must be non-empty and of equal length');
    }
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (!(totalWeight > 0)) throw new RangeError('total weight must be positive');
    const roll = random() * totalWeight;
  ```
- Correct the JSDoc to document the contract and drop the misleading claim
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   */
  // After
  /**
   * Picks one item with probability proportional to its weight.
   * @param items Non-empty list of candidates.
   * @param weights Non-negative finite weights, same length as `items`, with a positive sum.
   * @param random Uniform source in [0, 1); injectable for deterministic tests.
   * @returns The selected item.
   */
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
