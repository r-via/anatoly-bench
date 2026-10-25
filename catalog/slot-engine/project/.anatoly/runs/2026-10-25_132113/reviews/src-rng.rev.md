# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is identical to pickFromWeighted: sum weights, draw Math.random()*total, walk cumulative weights, return the first item where roll < cumulative, fall back to the last item. Only the names and the generic vs Symbol typing differ. They are interchangeable, and weightedPick is the generic form.
- **Correction [OK]**: The cumulative-weight selection is correct: roll is uniform in [0,total) and the first index with roll < cumulative is picked, so each item is chosen in proportion to its weight. The final fallback only covers floating-point edge cases. Using Math.random() is a compliance choice for the best-practices axis, not a wrong result. Empty or mismatched inputs are not guarded, but no visible caller passes them and no contract requires a guard.
- **Overengineering [LEAN]**: Minimal cumulative-weight pick: one reduce, one loop, fallback to last item. No unnecessary abstraction; standard algorithm.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~100% identical algorithm (cumulative weighted random pick); differs only in variable names and Symbol-typed vs generic signature

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Inputs `items: T[]` and `weights: number[]` are never mutated but are not declared `readonly T[]` / `readonly number[]`. [L5] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No validation of inputs. An empty `items` returns `undefined` typed as T. Mismatched `weights` length yields NaN cumulative values. Negative or zero total weight falls through silently to the last item. The function should throw an Error on invalid input. [L5-L16] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain inferred from the slot-engine layout (reels, paytable, jackpot, freespin, wild) and the 'gaming RNG' doc comment. Math.random() is a non-cryptographic PRNG and is not certifiable for regulated gaming RNG. Use crypto.getRandomValues / crypto.randomInt, or an injected certified RNG source. [L7] |
| 15 | Testability | FAIL | MEDIUM | Math.random() is hard-wired with no injection point, and there is no pure core that takes the roll as a parameter. Deterministic tests and RNG certification replay are impossible. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | For a utility used in gaming, the function lacks input guards. It also silently returns the last item on float rounding or edge cases instead of failing explicitly. [L14-L15] |

### Suggestions

- Use a CSPRNG and inject the random source. Validate inputs and use readonly arrays.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: () => number = secureRandom, // e.g. crypto.getRandomValues-based [0,1)
  ): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new Error('items and weights must be non-empty and equal length');
    }
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (!(totalWeight > 0)) throw new Error('total weight must be positive');
    const roll = random() * totalWeight;
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
