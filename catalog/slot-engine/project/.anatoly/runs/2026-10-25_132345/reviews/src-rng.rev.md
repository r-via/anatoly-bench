# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 86% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Line-for-line identical algorithm to pickFromWeighted (sum weights, Math.random roll, cumulative scan, fallback to last item). Only variable names and generic T vs Symbol differ; interchangeable. pickFromWeighted should reuse weightedPick.
- **Correction [NEEDS_FIX]**: Missing input validation: weights/items length mismatch, empty arrays, negative or NaN weights are not guarded. Empty items returns undefined typed as T; shorter weights yields NaN cumulative so the loop never matches and a fallback item is returned silently; all-zero weights always return the last item.
- **Overengineering [LEAN]**: Minimal cumulative-weight pick: one reduce, one loop, fallback return for float edge case. Single live consumer; no unnecessary abstraction. (deliberated: reclassified: correction: NEEDS_FIX → OK — Dismissed. src/rng.ts:5-16 is a standard cumulative-weight pick and is correct for well-formed input (same lengths, positive weights). Math.random() < 1 means `roll < totalWeight`, so the loop returns inside its bounds, and the line-15 fallback only handles floating-point edge cases. It also has no runtime effect: it is registered at engine.ts:30 and resolved into `rng` at engine.ts:120, but grep shows `rng` is never called. Reels are drawn by reels.ts pickFromWeighted. The duplication and input-validation concerns belong to the duplication and best_practices axes, not to a correctness defect.)
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~100% identical logic — cumulative-weight random pick with last-item fallback

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` are mutable arrays; should be `readonly T[]` and `readonly number[]` since the function never mutates them. [L5] |
| 8 | ESLint compliance | FAIL | HIGH | Unchecked indexed access (`weights[i]`, `items[i]`) can yield `undefined`, and `cumulative += undefined` gives NaN when weights is shorter than items. `items[items.length - 1]` returns `undefined` typed as T for an empty array. Typed as T, so this hides a runtime bug under strict lint rules (noUncheckedIndexedAccess). [L8-L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc exists but lacks @param/@returns/@throws, and it claims suitability for gaming RNG, which is misleading given the implementation. [L1-L4] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | No input validation: empty `items`, mismatched lengths, negative/NaN/zero total weights are not handled. The function silently returns `undefined` (typed as T) or a wrong item instead of throwing an Error. The consumer `spin` does not guard against this. [L5-L16] |
| 13 | Security | FAIL | CRITICAL | Gaming/slot-machine domain inferred from the reels/paytable/jackpot/freespin files and the doc comment ('suitable for gaming RNG applications'). `Math.random()` is not a CSPRNG and is not certifiable for regulated gaming RNG. Use `crypto.getRandomValues`/`crypto.randomInt`, or an injected certified RNG source. [L6] |
| 15 | Testability | WARN | MEDIUM | `Math.random` is hard-wired with no injection point for an RNG. A pure core exists, but tests need to mock the global. [L6] |
| 17 | Context-adapted rules | WARN | MEDIUM | A utility should accept an injectable RNG (`rng: () => number`) and validate its inputs. A pairing of `items` and `weights` as a single array of `{item, weight}` objects would remove the length-mismatch hazard. [L5-L16] |

### Suggestions

- Use an injectable, cryptographically secure RNG, validate inputs, and mark params readonly
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
      throw new RangeError('items and weights must be non-empty and equal length');
    }
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (!(totalWeight > 0)) throw new RangeError('total weight must be positive');
    const roll = random() * totalWeight;
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[correction · low · trivial]** Validate inputs at the start: throw if items is empty, if items.length !== weights.length, if any weight is negative or non-finite, or if totalWeight <= 0, instead of silently returning the last item. [L5]
