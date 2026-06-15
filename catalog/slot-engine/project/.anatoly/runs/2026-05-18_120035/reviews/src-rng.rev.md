# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Implements identical weighted selection algorithm as pickFromWeighted. Both compute total weight via reduce, generate random draw in [0, total), accumulate weights in loop, and return item when roll < cumulative. Differences are superficial: variable names (totalWeight vs total, roll vs r, cumulative vs acc), parameter aliases (weights vs wts), and generic type parameter <T>. Core logic is 100% interchangeable.
- **Correction [NEEDS_FIX]**: Math.random() is a non-certifiable PRNG; JSDoc explicitly claims the function is 'suitable for gaming RNG applications', which is false for regulated gaming.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm, single responsibility, no unnecessary abstractions. Generic T parameter is justified for reuse across symbol types.
- **Tests [NONE]**: No test file exists. Critical gaming RNG utility used by src/engine.ts has zero coverage — missing tests for uniform distribution, single-item arrays, zero-weight items, mismatched array lengths, and the boundary condition where roll == cumulative.
- **PARTIAL [PARTIAL]**: JSDoc describes the function's purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, negative weights, or mismatched array lengths).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — Identical algorithm and logic; only structural differences are variable naming and generic typing

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items: T[] and weights: number[] are mutable array parameters; function does not modify them so they should be ReadonlyArray<T> and readonly number[]. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | File-level JSDoc exists but has no @param or @returns tags on the exported function. Callers get no inline documentation on what happens when items/weights are mismatched or empty. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Math.random() is a non-cryptographic PRNG (V8 xorshift128+), not certifiable for regulated gaming. The JSDoc explicitly states 'suitable for gaming RNG applications' and the project is a slot machine (pay tables, reel weights, symbols CHERRY/SEVEN/DIAMOND/WILD/SCATTER confirmed in reference docs). Regulated gambling jurisdictions (GLI, BMM, eCOGRA) require a certified CSPRNG. Math.random() output is predictable given internal state, enabling outcome prediction attacks. Replace with crypto.getRandomValues() or an auditable seeded CSPRNG. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is called directly, making the function non-deterministic. Tests must mock the global, which is brittle. Injecting a random source as a parameter (with Math.random as default) would enable fully deterministic unit tests. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | No input validation: if items is empty, items[items.length - 1] silently returns undefined (typed as T, a lie). If weights.length < items.length, cumulative accumulates NaN via undefined arithmetic, causing the fallback to always fire. For a gaming function where incorrect payouts have financial consequences, guard clauses are expected. [L5-L16] |

### Suggestions

- Use a CSPRNG instead of Math.random() for regulated gaming RNG
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x1_0000_0000) * totalWeight;
  ```
- Inject random source for testability and replace direct Math.random() call
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: ReadonlyArray<T>,
    weights: ReadonlyArray<number>,
    random: () => number = () => { const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] / 0x1_0000_0000; }
  ): T {
  ```
- Add guard clauses for empty or mismatched inputs
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: ReadonlyArray<T>, weights: ReadonlyArray<number>): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  ```
- Add @param and @returns JSDoc tags to the exported function
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
   * @param items - Candidate items to pick from.
   * @param weights - Positive weights parallel to items; higher weight = more frequent.
   * @returns The selected item.
   * @throws {RangeError} If items is empty or lengths mismatch.
   */
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues() (or equivalent CSPRNG) to make the RNG certifiable under regulated gaming standards (GLI-11, eCOGRA, BMM). Update the JSDoc to document the RNG source explicitly. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
