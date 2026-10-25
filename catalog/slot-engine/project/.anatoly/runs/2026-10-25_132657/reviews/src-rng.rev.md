# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 95% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight algorithm: compute total, scale Math.random(), accumulate per item, return last as fallback. Differs only in generic type parameter vs concrete Symbol[] and local variable names. pickFromWeighted is a private, type-narrowed copy of the same logic.
- **Correction [OK]**: Cumulative-weight algorithm is correct. The fallback return on L16 handles floating-point edge cases where roll equals totalWeight exactly. No correctness defects.
- **Overengineering [LEAN]**: Standard O(n) cumulative-weight algorithm. Generic <T> is justified for a reusable utility. No unnecessary abstractions.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~98% identical logic — same reduce-sum, same scaled random draw, same accumulator loop, same fallback return

## Best Practices — 5.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both `items: T[]` and `weights: number[]` are read-only within the function body but declared as mutable arrays. Should be `readonly T[]` and `readonly number[]`. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from project path (`slot-engine`), vocabulary in sibling files (`reels.ts`, `jackpot.ts`, `paytable.ts`, `freespin.ts`, `wild.ts`), and the JSDoc itself ('suitable for gaming RNG applications'). `Math.random()` is a non-cryptographic PRNG — predictable, not independently auditable, and not certifiable under gaming-RNG regulations (GLI, BMM, iTech Labs). Any jurisdiction requiring certified RNG will reject this implementation. [L8] |
| 15 | Testability | FAIL | MEDIUM | `Math.random()` is hard-wired inside the function with no injection seam. Deterministic unit tests require mocking the global, which is fragile. No pure core is exposed (the roll is generated internally, not passed in). [L8] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG utility has no guard for: (1) empty `items` array — returns `undefined` typed as `T`; (2) `items.length !== weights.length` mismatch — silently returns last item. Both are silent failures in a regulated spin path. [L5-L15] |

### Suggestions

- Inject the random source so the function is testable and swappable for a certified CSPRNG
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random
  ): T {
    if (items.length === 0) throw new Error('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new Error('weightedPick: items/weights length mismatch');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  ```
- Use `readonly` on both array parameters to signal non-mutation and enable stricter callers
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Replace Math.random() with a certified CSPRNG for regulated gaming (e.g. crypto.getRandomValues-based uniform draw)
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  // Use a certified CSPRNG supplier injected via the `rng` parameter above.
  // Example: import { secureRandom } from './crypto-rng'; and pass it at call site.
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
