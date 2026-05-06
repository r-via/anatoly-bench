# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 88% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm. Both weightedPick and pickFromWeighted implement the same logic: calculate total weight, generate random roll, iterate through cumulative weights, and return matching item. Differences are cosmetic (variable names: totalWeight/total, roll/r, cumulative/acc) and type specificity (generic T vs concrete Symbol). pickFromWeighted is a non-generic specialization of the same algorithm.
- **Correction [NEEDS_FIX]**: Three independent correctness defects: non-certifiable RNG for gaming domain, unchecked empty-array crash, and mismatched-length NaN propagation.
- **Overengineering [LEAN]**: Minimal, focused implementation of a well-known cumulative-weight algorithm. The generic type parameter <T> is appropriate and not speculative — it makes the utility genuinely reusable without any added complexity. Logic is straightforward: one reduce, one loop, no unnecessary abstraction layers.
- **Tests [NONE]**: No test file exists for this source file. The function has multiple important behaviors that need coverage: happy path weighted selection, edge cases like single-item arrays, zero-weight items, boundary roll values (roll === 0, roll just below cumulative threshold), and the fallback return on L15. It is used in src/engine.ts making it a critical path with zero test coverage.
- **PARTIAL [PARTIAL]**: The function has a JSDoc comment that describes its general purpose and algorithm, but it is missing @param descriptions for 'items' and 'weights' (e.g., constraints like weights.length must equal items.length, or that weights should be non-negative), a @returns tag describing what is returned, a @template tag for the generic type parameter T, and any edge-case behavior (e.g., what happens when items/weights are empty). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/rng.ts:5-16 is algorithmically correct — identical logic to pickFromWeighted with only cosmetic differences (variable names: totalWeight/roll/cumulative vs total/r/acc; generic T vs concrete Symbol). It IS imported by src/engine.ts:2 and registered in the DI container at engine.ts:30, but critically, after being resolved at engine.ts:120 (`const rng = container.resolve<typeof weightedPick>('rng')`), the `rng` variable is never actually called — the factory at factories.ts:12 calls spinReel() which uses pickFromWeighted instead. So weightedPick is effectively dead code in the runtime spin path. However, this is an engine.ts wiring issue, not a bug in weightedPick itself. The function works correctly when called. The finding conflates duplication (valid concern, belongs on duplication axis) with correction (no bug present). The proper fix is to refactor reels.ts to import and use weightedPick, eliminating pickFromWeighted — this would have zero behavioral impact since the algorithms are identical.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 100% identical logic and behavior — both implement cumulative-weight random selection with the same control flow and return semantics

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `items` and `weights` parameters are mutable arrays. The function never mutates them, so they should be typed as `readonly T[]` and `readonly number[]` to prevent accidental mutation inside the function and to communicate the contract to callers. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | A JSDoc block is present and is correctly associated with `weightedPick`, but it is incomplete: it is missing `@param items`, `@param weights`, `@returns`, and `@throws` (or a note about the empty-array edge case). Tooling-generated documentation will be sparse. [L1-L4] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async code is present, but synchronous error-handling is missing: (1) when `items` is empty, `items[items.length - 1]` evaluates to `undefined`, which is silently returned typed as `T` — a soundness hole. (2) No guard against `items.length !== weights.length`. These are undeclared preconditions that can cause silent, hard-to-debug incorrect results in production gaming sessions. [L7-L15] |
| 13 | Security | FAIL | CRITICAL | GAMBLING/CASINO DOMAIN INFERRED: the project contains `jackpot.ts`, `reels.ts`, `freespin.ts`, `paytable.ts`, and `wild.ts` — unambiguous slot-machine vocabulary. The file's own JSDoc states 'suitable for gaming RNG applications'. `Math.random()` is a non-cryptographic PRNG (typically an xorshift or LCG variant implemented by the JS engine). It is NOT certifiable for regulated gaming jurisdictions (GLI, BMM, eCOGRA, etc.), is statistically predictable with a few hundred samples, and cannot be audited or seeded for fairness verification. This is a regulatory-compliance CRITICAL security violation for the inferred domain. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly inside the function, making it non-deterministic and impossible to test with reproducible fixtures. A standard dependency-injection pattern — accepting a `rng: () => number` parameter defaulting to `Math.random` — would allow unit tests to pass a seeded or mocked RNG without monkey-patching globals. [L5-L7] |
| 17 | Context-adapted rules (gaming) | WARN | MEDIUM | Beyond the PRNG certification issue (Rule 13), two gaming-specific concerns remain: (1) The floating-point fallback `return items[items.length - 1]` subtly gives the last item slightly more probability mass than declared (the roll can equal totalWeight when floating-point rounding reaches exactly 1.0 * totalWeight), which is a fairness violation. (2) No input validation rejects negative weights, zero totalWeight, or mismatched array lengths — all of which produce incorrect outcome distributions silently rather than failing loudly. |

### Suggestions

- Use a injectable RNG parameter instead of hard-coding Math.random(), enabling deterministic tests and certifiable-RNG substitution in production.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const roll = rng() * totalWeight;
  ```
- Add input validation guards to fail loudly on empty arrays, mismatched lengths, non-positive weights, and zero total weight.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = Math.random): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
    if (weights.some(w => w < 0)) throw new RangeError('weightedPick: weights must be non-negative');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) throw new RangeError('weightedPick: total weight must be positive');
  ```
- Replace Math.random() with a certifiable CSPRNG for regulated gaming use (e.g. crypto.getRandomValues).
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  // Inject a certified RNG; example using Web Crypto as a uniform [0,1) draw:
  function cryptoRandom(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / (0xFFFFFFFF + 1);
  }
  // Pass cryptoRandom as the rng argument in production.
  ```
- Add full @param and @returns JSDoc tags to the exported function.
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Selects one item from `items` with probability proportional to its corresponding weight.
   *
   * @param items - Non-empty array of candidate values.
   * @param weights - Parallel array of non-negative weights; must have the same length as `items`.
   * @param rng - Optional uniform random source in [0, 1). Defaults to `Math.random`.
   * @returns The selected item.
   * @throws {RangeError} If `items` is empty, lengths differ, any weight is negative, or total weight is zero.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a guard at function entry: throw (or return a typed sentinel) when items.length === 0 to prevent the undefined-typed-as-T return. [L15]
- **[correction · medium · small]** Validate that items.length === weights.length at function entry and throw if they differ, preventing NaN propagation that silently biases all picks toward the last item. [L9]

### Refactors

- **[correction · high · large]** Replace Math.random() with a cryptographically secure or certified RNG source (e.g., crypto.getRandomValues()) to meet regulated gaming RNG requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
