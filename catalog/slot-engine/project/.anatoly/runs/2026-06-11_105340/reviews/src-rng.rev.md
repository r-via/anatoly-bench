# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 91% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, scale Math.random() by it, accumulate per-item weights in a loop, return on first item where roll < cumulative, and fall back to the last item. Only differences are variable names and that weightedPick uses a generic <T> instead of the concrete Symbol type. weightedPick is a generified version of the same algorithm — the two are interchangeable for any Symbol[] call site.
- **Correction [NEEDS_FIX]**: Uses `Math.random()` which is not certifiable for regulated gaming RNG. Domain inferred from JSDoc ('gaming RNG applications') and slot-engine project context (reels, paytable, jackpot, scatter, PRNG file named rng.ts). Industry rule: regulated gaming RNG must use a cryptographically secure source — `Math.random()` is implementation-defined, not entropy-auditable, and rejected by all major gaming test labs (GLI, BMM, eCOGRA).
- **Overengineering [LEAN]**: Standard cumulative-weight alias method. Generic type parameter is appropriate for reuse across symbol types. Linear scan is correct for small weight arrays (8 symbols). No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. No coverage for happy path, edge cases (empty arrays, mismatched lengths, zero/negative weights, single-item), or the fallback return on L15. Used by src/engine.ts, making this a gap in critical path coverage.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions (no documentation of what `items` or `weights` expect, e.g. length parity requirement, non-negative weights), no @returns tag, and no @throws or edge-case notes (e.g. empty array behavior). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. weightedPick (rng.ts:5-16) is algorithmically correct: same cumulative-weight sampling pattern, generic type parameter, proper fallback at L15. The NEEDS_FIX was based on duplication with pickFromWeighted — not a correctness defect. The function is imported in engine.ts:2 and registered in the container at L30, but never invoked during spin execution (the actual path goes through factories.ts → reels.ts:pickFromWeighted). Being unused in the runtime path is a dead-registration issue in spin's architecture, not a bug in weightedPick itself. The function would work correctly if called.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~97% identical logic — same cumulative-weight algorithm, same fallback, only variable names and type parameter differ

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items: T[]` and `weights: number[]` are never mutated but accept mutable arrays. Both should be `readonly T[]` and `readonly number[]`. [L5] |
| 12 | Async/Promises/Error handling | WARN | HIGH | Empty `items` array returns `undefined` typed as `T` (L15 fallback is `items[-1]`). Mismatched `items`/`weights` lengths silently produce NaN accumulation. Neither case is guarded. [L15] |
| 13 | Security | FAIL | CRITICAL | Regulated-gaming domain inferred from reel/jackpot/scatter/pay-table vocabulary throughout the reference documentation and the function's own JSDoc ('suitable for gaming RNG applications'). `Math.random()` is a non-cryptographic PRNG; it is not certifiable under regulated-gaming standards (e.g. GLI-11, BMM, iTech Labs). Replace with `crypto.getRandomValues()` or a certified CSPRNG. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hard-coded with no injection point. Deterministic unit tests and game-replay require monkey-patching the global. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming context: function advertises gaming suitability but lacks (a) RNG injection for replay/reproducibility, (b) guards for empty array and length mismatch, (c) @param/@returns JSDoc tags despite claiming domain suitability. [L5-L16] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() for regulated-gaming compliance
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x100000000) * totalWeight;
  ```
- Inject the RNG function for testability and game replay
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = secureRandom,
  ): T {
  ```
- Add readonly parameters and guard degenerate inputs
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights length mismatch');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `Math.random()` with `crypto.getRandomValues()` (e.g., `const buf = new Uint32Array(1); crypto.getRandomValues(buf); const roll = (buf[0] / 0x100000000) * totalWeight;`) to produce an auditable, certifiable entropy source required for regulated gaming RNG. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
