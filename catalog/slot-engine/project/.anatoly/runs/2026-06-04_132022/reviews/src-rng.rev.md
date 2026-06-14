# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm to pickFromWeighted in src/reels.ts: both reduce weights to total, draw Math.random() * total, accumulate in a loop, and fall back to the last item. weightedPick is the generic (<T>) form of the same logic; the only differences are variable names and the type parameter. The functions are fully interchangeable for any Symbol[] call site.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG for regulated gaming — the function's own JSDoc claims suitability for gaming RNG applications.
- **Overengineering [LEAN]**: Standard cumulative-weight algorithm for weighted random selection. Generic type parameter T is justified — the function is consumed for symbol picking but the signature is appropriately reusable. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Symbol is imported by src/engine.ts (critical game engine path) with zero coverage of happy path, edge cases (empty arrays, single item, zero weights, negative weights, mismatched array lengths), or boundary behavior (roll landing exactly on cumulative boundary).
- **PARTIAL [PARTIAL]**: JSDoc describes the function's purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, negative weights, weights/items length mismatch).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~97% identical logic — same cumulative-weight loop, same fallback, same random draw; weightedPick adds a generic type parameter but implements no distinct behavior

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Neither `items` nor `weights` parameter is mutated, yet both are declared as mutable arrays. They should be `readonly T[]` and `readonly number[]`. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block is present but lacks `@param` and `@returns` tags for the public export `weightedPick`. [L1-L4] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async code, but the function makes no defensive checks: (1) if `items` is empty, `items[items.length - 1]` evaluates to `undefined`, silently violating the declared return type `T`; (2) if `items.length !== weights.length`, behavior is undefined. Neither condition is guarded or throws. [L5-L15] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by project docs (reels, paytable, SCATTER/WILD/DIAMOND symbols, jackpot, free spins, 95% RTP) and JSDoc annotation 'gaming RNG applications'. `Math.random()` is a non-cryptographic PRNG seeded by the JS engine; it is not certifiable under regulated gaming standards (GLI-11, BMM, iTech Labs). Any production use of this function to drive real-money outcomes constitutes a compliance failure. Replace with a CSPRNG (e.g. `crypto.getRandomValues`) or a certified hardware RNG feed. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded, making deterministic unit testing impossible without global mocking. Inject an `rng: () => number` parameter (defaulting to `Math.random`) to enable seeded tests. [L5] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming utility lacks a `items.length === weights.length` assertion. Mismatched arrays produce silent incorrect probability distributions — a critical correctness hazard in a certified RNG path. Add a guard: `if (items.length !== weights.length) throw new Error('items/weights length mismatch')`. [L5-L6] |

### Suggestions

- Inject the RNG function and add readonly parameters for testability and immutability
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
    if (items.length !== weights.length || items.length === 0) {
      throw new Error(`weightedPick: items (${items.length}) and weights (${weights.length}) must be non-empty and equal length`);
    }
    const roll = rng() * totalWeight;
  ```
- Replace Math.random() with a CSPRNG for certified gaming compliance
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x1_0000_0000) * totalWeight;
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
   *
   * @param items - Candidate values to pick from.
   * @param weights - Corresponding non-negative weights (must match `items` length).
   * @param rng - Optional RNG source; defaults to `Math.random`. Inject a CSPRNG in production.
   * @returns The selected item.
   */
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a CSPRNG-based draw (e.g. crypto.getRandomValues with a BigInt or typed-array approach) so the RNG meets certifiable-gaming requirements stated in the JSDoc. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
