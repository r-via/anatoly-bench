# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 82% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight algorithm as pickFromWeighted in src/reels.ts; differences only in type generics and variable naming.
- **Correction [OK]**: Cumulative-weight selection is correct and bias-free; Math.random() usage is explicitly sanctioned by ADR-6. Fallback to last item handles floating-point edge cases where roll equals totalWeight.
- **Overengineering [LEAN]**: O(n) cumulative-weight walk with a single generic type parameter. ADR-6 explicitly documents the no-seed, no-pluggable-PRNG decision. Implementation is minimal for the stated purpose.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weights summing to zero, and boundary behavior of the final fallback return.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions (no docs for `items` or `weights`), no @returns tag, and no mention of edge cases (empty arrays, negative/zero weights, mismatched array lengths).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — Identical logic — both compute weighted random selection via cumulative approach

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` parameters are never mutated but declared as mutable arrays. Should be `readonly T[]` and `readonly number[]`. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block is present but omits `@param`, `@returns`, and `@template` tags. A public generic utility in a gaming engine warrants full parameter documentation. [L1-L4] |
| 13 | Security | WARN | CRITICAL | Slot-machine/gaming domain inferred from file header ('suitable for gaming RNG applications'), paytable/house-edge/RTP vocabulary in project docs, and ADR-6. `Math.random()` is not certifiable for regulated gaming RNG. ADR-6 (.anatoly/state/internal-docs/02-Architecture/04-Design-Decisions.md) explicitly acknowledges this as an accepted trade-off for a 'library-level simulation that does not require cryptographic fairness'. Flagged as WARN (not FAIL) because the maintainer has documented and accepted the limitation. Any deployment beyond internal simulation into a regulated gambling context must substitute a CSRNG. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly with no injection point on the function signature. Deterministic testing requires container-level substitution (ADR-6), not a call-site mock. Accepting an optional `rng` parameter would make unit tests trivial without breaking callers. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming utility with no input guards: (1) empty `items` array causes `items[items.length - 1]` to return `undefined` typed as `T`; (2) mismatched `items`/`weights` lengths silently produce wrong distributions; (3) negative weights corrupt the cumulative walk. All three conditions are reachable from internal callers. [L5-L15] |

### Suggestions

- Mark input arrays `readonly` — they are never mutated
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Inject PRNG for deterministic testing without container wiring
  ```typescript
  // Before
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const roll = rng() * totalWeight;
  ```
- Add guard for empty / mismatched inputs and expand JSDoc
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  /**
   * Selects one element from `items` with probability proportional to its weight.
   * Uses a cumulative-weight walk on a single uniform draw.
   *
   * @template T - Element type
   * @param items - Non-empty array of candidates
   * @param weights - Positive weights, same length as `items`
   * @param rng - Uniform [0, 1) PRNG; defaults to `Math.random`
   * @returns The selected element
   * @throws {RangeError} if `items` is empty or lengths mismatch
   */
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new RangeError(`weightedPick: items.length (${items.length}) must equal weights.length (${weights.length}) and be > 0`);
    }
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
