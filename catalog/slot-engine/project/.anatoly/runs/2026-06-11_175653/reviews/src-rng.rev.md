# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is identical to pickFromWeighted in src/reels.ts: same reduce for total, same Math.random() * total roll, same accumulator loop with early return, same last-item fallback. Only differences are variable names and the generic <T> type parameter vs hard-coded Symbol type. Both implement the same cumulative-weight algorithm with no behavioral divergence.
- **Correction [OK]**: Excluded per prior deliberation: algorithmically correct cumulative-weight sampler; prior NEEDS_FIX overturned as false positive.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a single generic type parameter. The generic is justified — the caller passes typed symbol arrays. No unnecessary abstractions or patterns.
- **Tests [NONE]**: No test file exists. Critical RNG utility consumed by core slot machine spin logic — missing coverage for: uniform distribution validation, single-item arrays, mismatched array lengths, zero/negative weights, last-item fallback path (L15), and boundary roll values at cumulative weight thresholds.
- **PARTIAL [PARTIAL]**: Block comment describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, mismatched lengths, zero-weight items, or the fallback return of the last item).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight algorithm, same structure, only variable names and type parameter differ

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both parameters are mutated nowhere inside the function but are not typed as readonly. Use `readonly T[]` and `readonly number[]` to express the non-mutating contract. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block present but missing @param and @returns tags, leaving the items/weights contract undocumented for tooling consumers. [L1-L4] |
| 12 | Async/Promises/Error handling | WARN | MEDIUM | Empty items array causes items[items.length - 1] to return undefined while the return type claims T. No guard against empty input. [L14-L15] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by project files (engine.ts, freespin.ts, jackpot.ts, paytable.ts, reels.ts) and the consumer in src/engine.ts spinning reels. Math.random() is a non-cryptographic PRNG (V8 xorshift128+) and is not certifiable for regulated gaming RNG under any major jurisdiction (GLI, BMM, eCOGRA). Replace with crypto.getRandomValues() or a certified CSPRNG library. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded, making deterministic unit testing impossible. Accepting an optional `rng: () => number` parameter would allow seeded or mock RNG injection. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | No length-parity guard between items and weights. A mismatch (weights.length < items.length) silently returns the wrong symbol with skewed probability. Add: `if (items.length !== weights.length \|\| items.length === 0) throw new RangeError(...)`. [L5-L6] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() for certifiable regulated-gaming RNG
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x100000000) * totalWeight;
  ```
- Inject the RNG function to enable deterministic testing
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = cryptoRandom,
  ): T {
  ```
- Guard against empty or mismatched inputs and use readonly params
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0 || items.length !== weights.length) {
      throw new RangeError(`weightedPick: items.length (${items.length}) must equal weights.length (${weights.length}) and be > 0`);
    }
  ```
- Add @param and @returns JSDoc tags
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
   * @param items - Array of items to select from.
   * @param weights - Parallel non-negative weights; must be the same length as items.
   * @returns A single item sampled proportionally to its weight.
   * @throws {RangeError} When arrays are empty or have mismatched lengths.
   */
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
