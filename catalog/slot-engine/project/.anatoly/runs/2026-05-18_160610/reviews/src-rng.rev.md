# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 90% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm to pickFromWeighted in src/reels.ts. Both implement cumulative-weight random selection with same control flow: reduce total weight, generate uniform random draw, iterate accumulating weights until threshold exceeded, return last item as fallback. Differ only in generics (T vs Symbol), variable names (totalWeight/roll/cumulative vs total/r/acc), and export status.
- **Correction [NEEDS_FIX]**: Two independent defects: non-certifiable RNG for regulated gaming domain; empty-array path returns undefined typed as T.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a single generic type parameter justified by reuse across typed symbol arrays. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, boundary roll values (roll === cumulative), and distribution uniformity. Used by src/engine.ts, making untested coverage a real risk.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what happens when items/weights arrays differ in length, or when weights are empty/zero), and no @returns tag. (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified rng.ts:5-16. The generic weighted selection algorithm is correct: reduce total, uniform draw in [0, total), cumulative accumulation, last-item fallback. The NEEDS_FIX label was justified solely by duplication with pickFromWeighted (reels.ts:30-41) — not by any logical or behavioral defect. Both implementations produce identical correct results. Notably, weightedPick is imported and registered in engine.ts:2,30 but the resolved container value (engine.ts:120) is never used in the spin path — reels are built via StandardReelBuilderFactory→spinReel→pickFromWeighted. This is an architectural concern, not a correctness defect in weightedPick itself.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% code identity — same weighted selection algorithm with parameter/variable name variations only

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are read-only in practice but not declared as such. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | File-level JSDoc exists but the exported function `weightedPick` has no `@param` or `@returns` tags. Callers cannot infer the `items`/`weights` length-parity contract from docs alone. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by project structure (reels.ts, paytable.ts, jackpot.ts, freespin.ts) and reference docs (reel symbols, pay table, 95% RTP target). `Math.random()` is a non-cryptographic PRNG seeded by the JS engine; it is NOT certifiable for regulated gaming RNG. Gaming jurisdictions (GLI, BMM, eCOGRA) require a certified CSPRNG (e.g., `crypto.getRandomValues`). Using `Math.random()` exposes monetary outcomes to prediction and exploitation. The JSDoc even names this 'gaming RNG applications', underscoring the compliance gap. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded inside the function with no injection point. Deterministic unit tests require global mocking (e.g., `vi.spyOn(Math, 'random')`). Accepting a `rng: () => number` parameter would enable pure, dependency-injected tests. [L5-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | For a gaming RNG utility: (1) no guard against empty arrays — `items[-1]` returns `undefined` silently, breaking the `T` return type contract; (2) no guard against length mismatch between `items` and `weights`; (3) no guard against `totalWeight === 0` (NaN roll). These invariants are critical when monetary outcomes depend on correct selection. [L5-L15] |

### Suggestions

- Replace Math.random() with a CSPRNG for regulated gaming compliance
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x1_0000_0000) * totalWeight;
  ```
- Add a rng parameter for dependency injection and testability
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = () => { const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] / 0x1_0000_0000; }
  ): T {
  ```
- Mark array parameters readonly and add input guards
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0 || items.length !== weights.length) throw new RangeError('items and weights must be non-empty and equal length');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) throw new RangeError('weights must sum to a positive value');
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
   * @param items - Non-empty array of candidates to pick from.
   * @param weights - Parallel positive-weight array; must match `items` length.
   * @returns The selected item.
   * @throws {RangeError} If arrays are empty, mismatched, or weights sum to zero.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Guard against empty items/weights arrays: throw or return a typed sentinel rather than silently returning undefined. [L15]

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues()-based uniform draw to produce a certifiable, auditable RNG suitable for the regulated gaming domain. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
