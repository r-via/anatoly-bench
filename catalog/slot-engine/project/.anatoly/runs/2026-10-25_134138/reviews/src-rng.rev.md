# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 88% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Line-for-line identical logic to pickFromWeighted: sum weights, draw Math.random()*total, cumulative scan, fallback to last item. Only differences are variable names and the generic <T> vs concrete Symbol type; they are interchangeable.
- **Correction [OK]**: The cumulative-weight selection is correct. `roll` is in [0,total) and the loop sums in the same order as `reduce`, so a valid pick is always found. Zero-weight items are never selected, because `roll < cumulative` cannot first become true on an item that adds nothing. Using `Math.random()` is a best-practices matter, not a correctness defect, since the result is still a valid weighted draw. Empty or mismatched inputs are hypothetical caller misuse.
- **Overengineering [LEAN]**: Minimal cumulative-weight pick: one reduce, one loop, fallback return. No unnecessary abstraction; a hand-rolled version of a 10-line algorithm is appropriate.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~100% identical logic — cumulative-weight random pick with last-item fallback; only naming and generic typing differ

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` are read-only inputs but typed as mutable arrays. Use `readonly T[]` and `readonly number[]`. [L5] |
| 13 | Security | FAIL | CRITICAL | Gaming/slot-engine domain inferred from the file's own 'gaming RNG' doc, the reels/paytable/jackpot/freespin file names, and the consumer `spin`. Math.random() is not a cryptographically secure or certifiable PRNG, so it is not acceptable for regulated gaming RNG. Use crypto.getRandomValues or node:crypto randomInt, or inject a certified RNG. [L7] |
| 15 | Testability | WARN | MEDIUM | The RNG source is hard-wired, so tests cannot make the roll deterministic. Add an injectable `random: () => number` parameter. See rule 13. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | No guard for empty `items`, mismatched `weights` length, or negative or NaN weights. An empty array returns undefined typed as T, and a length mismatch adds undefined into `cumulative`, producing NaN. The fallback `items[items.length - 1]` hides these errors. [L5-L16] |

### Suggestions

- Use a secure, injectable RNG, validate inputs, and mark parameters readonly
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
      throw new RangeError('items and weights must be non-empty and of equal length');
    }
    // weights must be non-negative integers
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = random(totalWeight);
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
