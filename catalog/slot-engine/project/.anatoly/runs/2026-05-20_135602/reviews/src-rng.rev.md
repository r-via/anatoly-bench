# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 88% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm. Both functions use cumulative weight accumulation, uniform random draw, and identical fallback logic. Only differences are generic type parameter and variable naming.
- **Correction [NEEDS_FIX]**: Two independent correctness defects: non-certifiable RNG for regulated gaming domain, and silent undefined return on empty input.
- **Overengineering [LEAN]**: Standard cumulative-weight linear scan. Generic T parameter is appropriate for reuse across symbol types. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item lists, and boundary roll exactly at cumulative threshold. Called by src/engine.ts, making this a production risk.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what `items` and `weights` represent, no constraint that arrays must be same length or weights non-negative), and no @returns tag explaining the selected item. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Verified rng.ts:5-16: identical algorithm to pickFromWeighted, equally correct. Two claimed defects: (1) Non-certifiable RNG — security/compliance concern, not algorithmic correctness. Math.random() produces a valid uniform distribution for the weighted selection algorithm. (2) Silent undefined on empty input — calling weightedPick([], []) returns items[-1]=undefined typed as T (rng.ts:15). This IS a real edge case, but no caller in the codebase passes empty arrays: the only import is engine.ts:2, registered at engine.ts:30, resolved at engine.ts:120, and the resolved rng variable is never actually called at runtime (reels are built via factory.buildReels→spinReel→pickFromWeighted path at factories.ts:12). The function is effectively dead code in the current call graph. Defensive input validation is hardening, not correction of an existing defect. Per investigation rules: only actual defects (crashes, data loss, security breaches) warrant NEEDS_FIX — no current code path triggers the empty-input issue.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical algorithm — both compute cumulative weights and select via uniform random draw

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights are not mutated inside the function but are typed as mutable arrays. Both should be readonly. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | File-level prose JSDoc exists but weightedPick lacks @param and @returns tags. Edge-case behavior (empty array, mismatched lengths) is undocumented. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed from file's own JSDoc ('suitable for gaming RNG applications') and project docs (reels, CHERRY/SEVEN/DIAMOND symbols, jackpot, paytable, 95% RTP target). Math.random() is a non-cryptographic PRNG seeded by the JS runtime; it is not certifiable for regulated gaming RNG. Jurisdictional gaming regulations (e.g., GLI-11, BMM, iTech Labs) require hardware-backed or cryptographically secure RNGs. Using Math.random() here makes the engine non-compliant and potentially fraudulent under regulated gambling law. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is called directly. Deterministic testing requires global monkey-patching rather than clean dependency injection. Accepting a rng: () => number parameter would make the function purely deterministic under test. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Utility function lacks defensive guards: (1) items.length !== weights.length is silently accepted, producing incorrect probability distribution; (2) empty items array returns undefined cast as T. A robust gaming utility must validate these preconditions. [L5-L15] |

### Suggestions

- Replace Math.random() with a CSPRNG-backed draw. For regulated gaming, use crypto.getRandomValues() to produce a uniform float.
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x1_0000_0000) * totalWeight;
  ```
- Inject RNG as a parameter for deterministic testing.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = () => {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] / 0x1_0000_0000;
    },
  ): T {
  ```
- Add precondition guards for mismatched lengths and empty arrays, and mark parameters readonly.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
  ```
- Add @param and @returns JSDoc tags to document the contract of the public export.
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
   *
   * @param items - Non-empty array of candidate values.
   * @param weights - Parallel array of non-negative weights (must equal items.length).
   * @param rng - Optional RNG source; defaults to crypto.getRandomValues()-backed draw.
   * @returns A randomly selected item proportional to its weight.
   * @throws {RangeError} If items is empty or lengths differ.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Guard against empty `items` array: throw an error (or return a typed sentinel) rather than silently returning `undefined` cast as `T`. [L15]

### Refactors

- **[correction · high · large]** Replace Math.random() with a certifiable RNG source suitable for regulated gaming (e.g. a seeded, auditable PRNG or CSPRNG). Math.random() is not acceptable for certified slot-machine RNG. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
