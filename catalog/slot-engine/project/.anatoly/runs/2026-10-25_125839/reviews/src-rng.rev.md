# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Line-for-line identical logic to pickFromWeighted: sums weights, draws Math.random()*total, walks cumulative weights, falls back to last item. Only naming and generic typing (T vs Symbol) differ; weightedPick is a drop-in replacement.
- **Correction [OK]**: Cumulative-weight selection is correct. `roll` is in [0, total), and cumulative is summed in the same order as `totalWeight`, so the loop always selects an item. The last-item fallback only guards float edge cases. `Math.random()` is a compliance choice (best-practices axis), not a wrong result. Empty or mismatched inputs are hypothetical caller misuse, and no visible caller shows them.
- **Overengineering [LEAN]**: Minimal cumulative-weight pick: one reduce, one loop, fallback return for float edge. No unnecessary abstraction; a single-use, appropriately simple implementation.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~100% identical algorithm — cumulative-weight random pick with last-item fallback

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` are mutable arrays; should be `readonly T[]` and `readonly number[]` since they are never mutated. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc exists but has no @param, @returns or @throws. It claims suitability for gaming RNG, which is misleading given the implementation. |
| 12 | Async/Promises/Error handling | FAIL | HIGH | No input validation. Empty `items` returns `items[-1]` (undefined) typed as `T`. A length mismatch between `items` and `weights` gives `NaN` cumulative (undefined weight), so the function silently returns the last item. Negative weights, NaN weights or a zero total are also unchecked. The function should throw an `Error` on invalid input instead of returning silently wrong results. [L5-L16] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain inferred from the slot-engine structure (reels, paytable, jackpot, freespin, wild, spin) and the JSDoc 'suitable for gaming RNG applications'. `Math.random()` is not a certifiable CSPRNG for regulated gaming and is not cryptographically secure or auditable. It also cannot be seeded for reproducible audits. Use `crypto.getRandomValues` or `crypto.randomInt` with rejection sampling, or an injectable certified RNG. [L7] |
| 15 | Testability | WARN | MEDIUM | Hard-coded `Math.random()` prevents deterministic testing and RNG injection. Accept an optional `rng: () => number` parameter. [L7] |

### Suggestions

- Use a cryptographically secure RNG, injectable for tests and certification, and validate inputs
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = secureRandom,
  ): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new Error('items and weights must be non-empty and equal in length');
    }
    if (weights.some((w) => !Number.isFinite(w) || w < 0)) {
      throw new Error('weights must be finite and non-negative');
    }
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) throw new Error('total weight must be positive');
    const roll = rng() * totalWeight;
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
