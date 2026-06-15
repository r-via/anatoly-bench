# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 92% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight selection algorithm as pickFromWeighted. Both compute total weight via reduce, generate uniform random draw, iterate with accumulating weights, and return first match or fallback to last item. Differences are only variable naming (totalWeight/total, roll/r, cumulative/acc) and type specificity (generic T vs Symbol).
- **Correction [NEEDS_FIX]**: Math.random() is non-certifiable for regulated gaming RNG; the cumulative-weight algorithm itself is correct (per prior deliberation), but the entropy source violates gaming-industry requirements.
- **Overengineering [LEAN]**: Standard cumulative-weight algorithm with a single generic type parameter. The generic is necessary and minimal; the loop is the canonical O(n) implementation. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Function has critical edge cases untested: single-item arrays, zero weights, negative weights, mismatched array lengths, floating-point precision, and boundary behavior when roll equals cumulative. Called by src/engine.ts, making this a gap in core engine coverage.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, lacks @returns documentation, and does not document edge cases (e.g., empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — Reclassified from NEEDS_FIX to OK on correction axis. src/rng.ts:5-16 is algorithmically identical to src/reels.ts:30-41 (`pickFromWeighted`) — same cumulative-weight algorithm, differing only in variable names and generic vs specialized typing. Duplication is real and confirmed. However, `weightedPick` itself produces correct results; the function is not broken. Duplication is a refactoring concern, not a correctness defect. The `correction` axis should reflect whether the code computes wrong values, which it does not. Both functions work correctly. The deduplication recommendation belongs on a `duplication` axis, not `correction`.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 92% identical logic — both implement cumulative-weight random selection

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights parameters are not readonly; the function never mutates them. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block present but lacks @param, @returns, and @throws tags for the single exported function. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Math.random() is a non-cryptographic PRNG unsuitable for regulated gambling. Project is a slot-machine engine (jackpot.ts, freespin.ts, paytable.ts, reels.ts, wild.ts; README specifies RTP 95%, progressive jackpot, scatter bonuses). Regulated gaming RNG must satisfy statistical certification standards (e.g., GLI-11, BMM). The function's own JSDoc claims it is 'suitable for gaming RNG applications', directly contradicting this choice. Domain: regulated casino/slot-machine. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded with no injection point; deterministic tests of boundary probability paths (e.g., jackpot boundary roll) require module mocking rather than straightforward parameterisation. [L7] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Three gaming-context guards are absent: (1) no check for empty items — returns items[items.length - 1] which is undefined at runtime but typed T; (2) no check that items.length === weights.length — silent misbehaviour under mismatch; (3) no check that all weights are non-negative — negative weight corrupts the cumulative distribution. These are critical correctness guards for a payline/symbol resolver in a regulated slot engine. [L5-L15] |

### Suggestions

- Inject the RNG as a parameter to satisfy regulatory requirements (certifiable RNG source) and enable deterministic unit tests.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number
  ): T {
    const roll = rng() * totalWeight;
  ```
- Add input guards to prevent silent undefined return and distribution corruption.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items/weights length mismatch');
    if (weights.some(w => w < 0)) throw new RangeError('weightedPick: weights must be non-negative');
  ```
- Expand JSDoc with @param, @returns, and @throws tags.
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Selects a random element from items using cumulative-weight sampling.
   * @param items - Non-empty candidate array.
   * @param weights - Non-negative weights parallel to items.
   * @param rng - Certified uniform random source in [0, 1).
   * @returns The selected item.
   * @throws {RangeError} If arrays are empty, mismatched in length, or contain negative weights.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a cryptographic PRNG (e.g., crypto.getRandomValues-based) or a certified RNG service to satisfy regulated-gaming auditability and statistical-independence requirements. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
