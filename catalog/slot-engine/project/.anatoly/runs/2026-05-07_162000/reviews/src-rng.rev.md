# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 93% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight algorithm: both calculate total, generate random roll, iterate with accumulation, return on threshold match, and fallback to last item. Only cosmetic differences: variable names (totalWeight/total, roll/r, cumulative/acc), generics vs specific type, export status.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG despite the JSDoc claiming suitability for gaming RNG applications.
- **Overengineering [LEAN]**: Standard cumulative-weight O(n) algorithm with a single generic type parameter justified by reuse across typed symbol arrays. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item input, boundary roll at exact cumulative threshold, and distribution uniformity. Used by src/engine.ts, making lack of coverage a production risk.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at rng.ts:5-16 is algorithmically correct — identical cumulative-weight logic to pickFromWeighted with proper generic typing and fallback at line 15. The NEEDS_FIX claim is based on duplication with reels.ts:pickFromWeighted, which belongs on the duplication axis, not correction. Furthermore, weightedPick is never invoked at runtime: imported at engine.ts:2, registered in container at engine.ts:30, resolved at engine.ts:120, but the rng variable is never called — StandardReelBuilderFactory.buildReels (factories.ts:9-15) delegates to spinReel which uses pickFromWeighted directly.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 100% identical logic — cumulative weight RNG with same control flow and edge-case handling

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights parameters are not marked readonly. The function never mutates them. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block is present but omits @param and @returns tags. Callers cannot rely on tooling for type-aware documentation. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Math.random() is used as the RNG source in a slot-machine / regulated gaming project. Domain inferred from reel-symbol vocabulary (WILD, SCATTER, jackpot, paytable, freespin) across .anatoly/docs/ and confirmed by the file's own JSDoc ('suitable for gaming RNG applications'). Math.random() is a non-cryptographic PRNG seeded by the JS engine with no certification path; regulated gaming jurisdictions require a certified, auditable RNG (e.g., CSPRNG via crypto.getRandomValues()). This is a compliance-critical violation. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is called directly, making weightedPick non-deterministic and untestable without monkey-patching. Accepting a random source via parameter or injection would enable pure, reproducible tests. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | weightedPick([], []) returns items[-1] === undefined, typed as T. No guard against empty input, so the return type promise is broken at runtime. A pre-condition check or a return type of T \| undefined would surface the contract correctly. [L14] |

### Suggestions

- Replace Math.random() with a CSPRNG source acceptable to regulated gaming auditors.
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x100000000) * totalWeight;
  ```
- Inject the random source to make the function deterministically testable.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    random: () => number = defaultSecureRandom,
  ): T {
  ```
- Add readonly to parameters and guard against empty input.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
  ```
- Expand JSDoc with @param and @returns tags.
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Selects one item from `items` using weighted probability.
   * @param items - Candidate values; must be non-empty.
   * @param weights - Non-negative relative weights parallel to `items`.
   * @returns The selected item.
   * @throws {RangeError} When `items` is empty.
   */
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues() (Web Crypto API) or a certified CSPRNG to make the RNG auditable for regulated gaming. Example: const arr = new Uint32Array(1); crypto.getRandomValues(arr); const roll = (arr[0] / 0xFFFFFFFF) * totalWeight; [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
