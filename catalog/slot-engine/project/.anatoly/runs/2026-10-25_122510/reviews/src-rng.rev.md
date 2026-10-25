# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Line-for-line identical algorithm (total weight, random roll, cumulative scan, last-item fallback) with only variable names differing. Interchangeable generic version of the reels.ts helper.
- **Correction [OK]**: Cumulative-weight pick is correct: roll in [0,total), strict `<` gives proportional probabilities, and the fallback to the last item covers floating-point edge cases. Math.random is a compliance concern for best-practices, not correction. Empty or mismatched inputs are hypothetical caller misuse.
- **Overengineering [LEAN]**: Minimal cumulative-weight pick: one reduce, one loop, and a fallback for float edge cases. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~100% identical logic — cumulative-weight random pick with last-item fallback

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights are mutable arrays; use readonly T[] and readonly number[]. [L5] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | No input validation. Empty items returns undefined typed as T. Mismatched lengths give NaN or undefined weights. Negative, NaN or zero total weight is not rejected. Invalid input silently returns garbage instead of throwing an Error. [L5-L16] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain inferred from slot-engine structure (reels, paytable, jackpot, freespin, wild) and the 'gaming RNG' doc comment. Math.random() is not a certifiable RNG for regulated gaming. Use crypto.getRandomValues or crypto.randomInt, or a certified RNG. [L7] |
| 15 | Testability | WARN | MEDIUM | Hard-wired Math.random() makes the function non-deterministic and untestable. Inject an RNG function parameter. [L7] |

### Suggestions

- Use a cryptographically secure, injectable RNG; validate inputs; use readonly params.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rand: () => number = secureRandom,
  ): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new Error('items and weights must be non-empty and equal length');
    }
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (!(totalWeight > 0)) throw new Error('total weight must be positive');
    const roll = rand() * totalWeight;
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
