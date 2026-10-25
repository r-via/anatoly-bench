# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 88% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Line-for-line identical logic to pickFromWeighted: sum weights, random roll scaled by total, cumulative scan, fallback to last item. Only names and generic vs. Symbol typing differ; weightedPick is a drop-in replacement.
- **Correction [OK]**: Cumulative-weight selection is correct. roll is in [0, total), and the loop's final cumulative equals totalWeight, so the fallback return is unreachable for valid inputs. Math.random is a best-practices choice, not a correctness defect. Empty-array and mismatched-length inputs are hypothetical caller misuse.
- **Overengineering [LEAN]**: Minimal cumulative-weight pick: one reduce, one loop, fallback return. Non-generic-heavy; single generic T is appropriate. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~100% identical logic — cumulative-weight random pick with last-item fallback; only variable names and type parameterization differ

## Best Practices — 0/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` are mutable arrays that are only read. Use `readonly T[]` and `readonly number[]`. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc is present but has no @param, @returns or @throws tags. It also claims the function is suitable for gaming RNG, which is false (see rule 13). [L1-L4] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No input validation. Empty `items` returns `undefined` typed as T. Mismatched lengths give `NaN` or `undefined` weights. Negative or NaN weights are accepted. All of these fail silently instead of throwing an Error. [L5-L15] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain inferred from the slot-engine project (jackpot, paytable, reels, freespin files) and the doc comment 'suitable for gaming RNG'. `Math.random()` is not a CSPRNG and is not certifiable for regulated gaming RNG. Use `crypto.randomInt` or `crypto.getRandomValues` with rejection sampling. [L6] |
| 15 | Testability | WARN | MEDIUM | Hard-coded `Math.random()` prevents deterministic tests and RNG injection. Accept a `rng: () => number` parameter or an RNG interface. [L6] |
| 17 | Context-adapted rules | WARN | MEDIUM | Parallel `items` and `weights` arrays can drift out of sync. A single array of `{ item, weight }` entries would avoid that. |

### Suggestions

- Use a CSPRNG, inject the random source, validate inputs, and mark the parameters readonly
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  import { randomInt } from 'node:crypto';
  
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: (maxExclusive: number) => number = randomInt,
  ): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new Error('items and weights must be non-empty and the same length');
    }
    // integer weights assumed; reject negative or non-finite values
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = random(totalWeight);
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
