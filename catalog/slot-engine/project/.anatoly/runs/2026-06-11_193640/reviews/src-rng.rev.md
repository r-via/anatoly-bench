# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight algorithm: reduce total, draw Math.random()*total, accumulate per-item until threshold, fall back to last element. Only differences are variable names and that pickFromWeighted is locked to Symbol[] while weightedPick is generic. pickFromWeighted could be replaced by a call to weightedPick with no behavioral change.
- **Correction [OK]**: Excluded per known false positive: algorithm is correct cumulative-weight sampling; previous NEEDS_FIX overturned by deliberation.
- **Overengineering [LEAN]**: Minimal, correct implementation of weighted random selection. Generic type parameter is justified — consumed with different T types is plausible. Cumulative-weight loop is the standard O(n) approach; no unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical gaming RNG utility used by slot machine spin logic — missing tests for uniform distribution, zero-weight items, single-item arrays, negative/NaN weights, and boundary roll at exactly cumulative threshold (the off-by-one at `roll < cumulative` vs `roll <= cumulative`). The fallback `return items[items.length - 1]` on L15 is also untested.
- **PARTIAL [PARTIAL]**: JSDoc describes the purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (e.g., empty arrays, mismatched array lengths, or negative weights).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same reduce/random/accumulate/fallback pattern, differing only in variable names and type parameter

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are never mutated inside the function but are typed as mutable arrays. Prefer `readonly T[]` and `readonly number[]` to communicate this contract. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block exists but lacks `@param` and `@returns` tags for the public export. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Regulated-gaming domain confirmed: project contains `src/engine.ts`, `src/jackpot.ts`, `src/freespin.ts`, `src/reels.ts`, `src/paytable.ts`, documented pay tables and reel weights, and the function's own JSDoc states 'suitable for gaming RNG applications'. `Math.random()` is a non-cryptographic PRNG (V8 xorshift128+) that is not certifiable under any major gaming regulatory standard (GLI-11, BMM, eCOGRA). It must be replaced with `crypto.getRandomValues()` or a certified CSPRNG to satisfy regulatory audit requirements. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly, making the function non-deterministic and requiring global mocking in tests. Injecting a `rng: () => number` parameter would enable deterministic unit tests and also unblock a future CSPRNG swap. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG utilities require defensive input validation. No guard for: (a) `items.length !== weights.length` — silent wrong-index reads; (b) `totalWeight === 0` — produces `NaN` roll and falls through to `items[items.length - 1]` silently; (c) empty `items` — `items[items.length - 1]` returns `undefined` cast as `T`. [L6-L15] |

### Suggestions

- Replace Math.random() with a CSPRNG and inject the RNG for testability
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  function cryptoRandom(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x100000000;
  }
  
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = cryptoRandom,
  ): T {
    if (items.length === 0) throw new RangeError('items must be non-empty');
    if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) throw new RangeError('totalWeight must be positive');
    const roll = rng() * totalWeight;
  ```
- Add @param and @returns tags to JSDoc
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
   * @param items - Candidate items to select from.
   * @param weights - Parallel non-negative weights; must match `items` length.
   * @param rng - Optional RNG source; defaults to `crypto.getRandomValues`-based draw.
   * @returns The selected item.
   * @throws {RangeError} When arrays are empty, lengths differ, or total weight is non-positive.
   */
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
