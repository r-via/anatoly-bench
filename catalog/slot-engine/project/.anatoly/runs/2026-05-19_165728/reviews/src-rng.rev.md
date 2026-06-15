# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical weighted random selection via cumulative-weight iteration. Both compute total weight, generate random value between 0 and total, iterate with running sum, return on match, fallback to last item. Differences: variable names (totalWeight/total, roll/r, cumulative/acc), generic vs specific typing.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG (industry convention for gaming/casino domain inferred from slot-machine vocabulary throughout the project docs).
- **Overengineering [LEAN]**: Standard cumulative-weight sampling. The generic type parameter is appropriate given the documented usage (items can be Symbol strings or any other type). No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, boundary roll exactlyequal to cumulative weight, and non-uniform weight distributions.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param and @returns tags. No documentation of edge cases: empty arrays, mismatched array lengths, zero/negative weights, or why the last item is returned as fallback. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. weightedPick (rng.ts:5-16) is algorithmically correct: it computes total weight, draws uniform random, iterates with cumulative sum, returns on match, and has a floating-point fallback at line 15. The duplicate pickFromWeighted (reels.ts:30-41) uses identical logic with different variable names (total/r/acc vs totalWeight/roll/cumulative) and concrete Symbol type instead of generic T. Duplication is real but belongs on the duplication axis — it does not constitute a correctness defect in weightedPick itself. The function produces correct weighted random selections.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical logic — both implement cumulative-weight algorithm for random selection

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items: T[]` and `weights: number[]` are never mutated but lack `readonly`. Should be `readonly T[]` and `readonly number[]`. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc comment exists but omits `@param items`, `@param weights`, and `@returns` tags on the sole public export. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated-gaming domain inferred from: JSDoc 'suitable for gaming RNG applications', EngineContainer registering `weightedPick` as the engine RNG, README specifying 95% RTP, and vocabulary throughout the project (jackpot, reels, wilds, scatters). `Math.random()` is a non-seeded, non-cryptographic PRNG and is not certifiable for regulated gaming RNG under any major jurisdiction (GLI, BMM, eCOGRA). A compliant implementation requires `crypto.getRandomValues()` or a certified hardware-backed source. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded with no RNG injection point. Deterministic unit tests require module-level mocking. Accepting an optional `rng: () => number = Math.random` parameter would enable full determinism in tests without breaking callers. [L5-L15] |

### Suggestions

- Make array parameters readonly to signal non-mutation and satisfy rule 5.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Replace Math.random() with crypto.getRandomValues() for regulated gaming compliance (rule 13).
  - Before: `const roll = Math.random() * totalWeight;`
  - After: `const roll = (crypto.getRandomValues(new Uint32Array(1))[0] / 0x1_0000_0000) * totalWeight;`
- Inject the RNG source for testability (rule 15). Default keeps backward compatibility.
  ```typescript
  // Before
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 0x1_0000_0000,
  ): T {
  ```
- Add @param and @returns JSDoc tags for the public export (rule 9).
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Weighted random pick utility for gaming RNG applications.
   * Draws one item using a cumulative-weight uniform distribution.
   * @param items - Array of items to pick from.
   * @param weights - Parallel array of non-negative weights; must be the same length as `items`.
   * @param rng - Random source returning a value in [0, 1). Defaults to crypto.getRandomValues.
   * @returns The selected item.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a certifiable RNG source (e.g. crypto.getRandomValues) required for regulated gaming applications. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
