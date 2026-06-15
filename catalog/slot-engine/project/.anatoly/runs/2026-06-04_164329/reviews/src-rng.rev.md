# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is character-for-character equivalent to pickFromWeighted: both reduce weights to a total, draw Math.random()*total, accumulate in a loop, and fall back to the last item. Only superficial differences: variable names (totalWeight/roll/cumulative vs total/r/acc), parameter name (weights vs wts), and a generic type parameter vs concrete Symbol[] type. The generic form makes weightedPick strictly more general but functionally interchangeable for Symbol[] inputs.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a certified-gaming context; the weighted-selection algorithm itself is logically correct.
- **Overengineering [LEAN]**: Standard cumulative-weight alias sampling. Generic type parameter T is justified — the function is a reusable utility. Linear scan is appropriate for small weight arrays (8 symbols). No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched weights/items length, all-zero weights, single-item arrays, and boundary roll == cumulative. Called by src/engine.ts, making this a production risk.
- **PARTIAL [PARTIAL]**: Has a JSDoc block describing purpose and algorithm, but missing @param descriptions for `items` and `weights`, missing @returns, and no documentation of edge cases (e.g., empty arrays, negative weights, mismatched array lengths).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~97% identical logic — same cumulative-weight algorithm, same loop structure, same fallback, differing only in variable names and type annotation

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Neither parameter is declared readonly. The function never mutates them, so both should be ReadonlyArray. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block exists but omits @param and @returns tags, leaving type semantics undocumented for consumers. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reels/paytable/jackpot/scatter/RTP vocabulary across the project and confirmed by the JSDoc comment ('gaming RNG applications'). Math.random() is a non-cryptographic PRNG (xorshift128+ in V8) that is not certifiable for regulated gaming RNG under GLI-11, BMM, or equivalent standards. Its output is statistically predictable given internal state, violating both certification requirements and player fairness guarantees. Must be replaced with a CSPRNG (e.g. crypto.getRandomValues()) or a certified RNG library. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded, making the function non-deterministic and untestable without monkey-patching. An injected rng parameter (defaulting to Math.random) would allow deterministic unit tests. [L5-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming critical-path function has no input guards: (1) items.length === 0 returns undefined typed as T (silent type lie); (2) items.length !== weights.length is silently mishandled. A regulated gaming engine must fail loudly on invalid inputs rather than returning a garbage result. [L5-L15] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() to satisfy regulated gaming RNG requirements and fix the critical security violation.
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const roll = (array[0] / 0x100000000) * totalWeight;
  ```
- Inject the RNG as a parameter to make the function deterministically testable.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: ReadonlyArray<T>,
    weights: ReadonlyArray<number>,
    rng: () => number = defaultCryptoRng,
  ): T {
  ```
- Add input guards to prevent silent failures on empty or mismatched arrays.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {
    if (items.length === 0) throw new RangeError('weightedPick: items array must not be empty');
    if (items.length !== weights.length) throw new RangeError(`weightedPick: items (${items.length}) and weights (${weights.length}) length mismatch`);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  ```
- Add @param and @returns JSDoc tags to the exported function.
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   * @param items - Candidate values to pick from.
   * @param weights - Non-negative weights parallel to `items`; higher weight increases probability.
   * @returns A randomly selected item proportional to its weight.
   * @throws {RangeError} If arrays are empty or have mismatched lengths.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with crypto.getRandomValues()-based uniform draw to satisfy gaming-lab certifiability requirements (GLI-11, BMM, iTech). Pattern: const buf = new Uint32Array(1); crypto.getRandomValues(buf); const roll = (buf[0] / 0x100000000) * totalWeight; [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
