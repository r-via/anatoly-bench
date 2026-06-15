# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight algorithm as `pickFromWeighted`. Both iterate through items, accumulating weights until random roll falls below cumulative sum, with same fallback logic. `pickFromWeighted` (Symbol-specific) duplicates `weightedPick<T>` (generic).
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; a CSPRNG is required.
- **Overengineering [LEAN]**: Generic cumulative-weight linear scan is the canonical O(n) implementation for this problem size (8 symbols). The generic type parameter is justified — callers pass typed symbol enums. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item arrays, weight boundary conditions (roll == cumulative). Called by src/engine.ts, making coverage gaps production-relevant.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. Duplication with pickFromWeighted (reels.ts:30-41) is confirmed — identical algorithm. But weightedPick itself (rng.ts:5-16) is correct; it produces valid weighted random selections. The NEEDS_FIX is misattributed: the function has no bug. The real defect is in engine.ts where weightedPick is registered (line 30) and resolved (line 120) but the resolved 'rng' variable is never called — factory.buildReels bypasses the container entirely via spinReel→pickFromWeighted. This is a dead-code/integration design issue, not a correctness bug in weightedPick. Duplication belongs on the duplication axis, not correction.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 87% — identical algorithm, only differ in type specificity and variable naming

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights are never mutated inside the function; both should be readonly T[] and readonly number[]. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Module-level JSDoc present but lacks @param and @returns tags for the exported function. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by internal docs (pay tables, paylines, WILD/SCATTER, 95% RTP target). Math.random() is a non-cryptographic PRNG seeded by the JS runtime; it is not auditable, not certifiable, and not permissible under regulated gaming compliance (GLI-11, BMM, iTech Labs). Must be replaced with a certified, auditable RNG (e.g., crypto.getRandomValues() wrapped in a seedable PRNG that can be externally seeded and its state logged for audit). [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded; no RNG injection point. Deterministic unit tests require mocking the global, which is fragile. Accept an rng: () => number parameter defaulting to Math.random() to allow injection. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | No guard against items.length === 0 (returns items[-1] → undefined cast as T) or items.length !== weights.length (weights[i] becomes undefined, NaN propagates silently into cumulative). Both are silent data-integrity failures in a financial payout path. [L5-L16] |

### Suggestions

- Replace Math.random() with an injectable RNG for compliance and testability
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
    const roll = rng() * totalWeight;
  ```
- Add readonly to parameters and input-validation guards
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new RangeError(`weightedPick: items(${items.length}) and weights(${weights.length}) must be non-empty and equal length`);
    }
  ```
- Add @param and @returns to JSDoc
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Weighted random pick utility for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   * @param items - Non-empty array of candidate values.
   * @param weights - Positive weights parallel to items.
   * @param rng - Optional uniform random source in [0, 1); defaults to Math.random.
   * @returns The selected item.
   */
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a CSPRNG (e.g., crypto.getRandomValues() via a uniform-float helper) so the RNG is certifiable for regulated gaming. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
