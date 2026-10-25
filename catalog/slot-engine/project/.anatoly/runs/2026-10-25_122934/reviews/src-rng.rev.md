# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 87% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Line-for-line identical logic to pickFromWeighted: sums weights, draws Math.random()*total, walks cumulative weights, falls back to last item. Only differences are variable names and generic T vs. Symbol typing, so the two are interchangeable.
- **Correction [NEEDS_FIX]**: No validation of weights/items; empty items, mismatched lengths, negative or NaN weights, or zero total weight yield wrong or undefined results instead of failing.
- **Overengineering [LEAN]**: Minimal cumulative-weight pick: one reduce, one loop, fallback return. No unnecessary abstraction; a hand-rolled version is appropriate for this trivial algorithm. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. The flagged problem is missing input validation (empty items, mismatched lengths, NaN or zero weights). That is hardening, not a defect anyone can observe. grep shows weightedPick is never called with arguments anywhere. It is only registered at src/engine.ts:30 and resolved into the unused local `rng` at engine.ts:120, so no runtime path can pass it bad input. Reels use pickFromWeighted (src/reels.ts:47) instead. With valid inputs the algorithm at src/rng.ts:6-15 is correct: roll in [0,total), cumulative scan, and a safe last-item fallback. The duplication and dead-wiring findings stay valid on their own axes, which are not under review here.)
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~100% identical algorithm — cumulative-weight random pick with last-item fallback; only naming and generic typing differ

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` are mutable arrays but are never mutated; should be `readonly T[]` and `readonly number[]`. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc exists but has no @param, @returns, or @throws. It also claims the function is 'suitable for gaming RNG applications', which is wrong because it uses Math.random(). [L1-L5] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | No input validation. Empty `items` returns `undefined` typed as T, because `items[-1]` is undefined. Mismatched lengths give NaN cumulative values, since `weights[i]` is undefined. Negative or NaN weights and a zero total weight are also unchecked. The silent fallback to the last item hides invalid input. The function should throw an Error (not a string, unlike the consumer `spin`) on invalid input. [L5-L16] |
| 13 | Security | FAIL | CRITICAL | Gaming/casino domain inferred from the slot-engine structure (reels, paytable, jackpot, freespin, wild) and the doc comment claiming 'gaming RNG applications'. `Math.random()` is a non-cryptographic, non-certifiable PRNG and is not acceptable for regulated gaming RNG. Use `crypto.getRandomValues` or `crypto.randomInt` (or an injected certified RNG). [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded, so the function is not deterministic and cannot be tested without mocking globals. Accept an injectable `rng: () => number` parameter. [L7] |

### Suggestions

- Use a CSPRNG, validate inputs, make the function pure and testable with an injectable RNG, and mark the inputs readonly
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  import { randomInt } from 'node:crypto';
  
  const defaultRandom = (): number => randomInt(0, 2 ** 48) / 2 ** 48;
  
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: () => number = defaultRandom,
  ): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new Error('items and weights must be non-empty and of equal length');
    }
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (!Number.isFinite(totalWeight) || totalWeight <= 0 || weights.some((w) => w < 0)) {
      throw new Error('weights must be non-negative with a positive finite sum');
    }
    const roll = random() * totalWeight;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Validate inputs: throw if items is empty, if weights.length !== items.length, if any weight is negative or non-finite, or if total weight <= 0. Do this instead of silently returning the last item or undefined. [L6]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
