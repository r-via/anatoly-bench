# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 88% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm: both reduce weights to total, draw Math.random() * total, iterate accumulating weights, return when roll < cumulative threshold.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a regulated slot-machine context where certifiable RNG is required.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a single generic type parameter justified by reuse across symbol/weight tables. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weight boundary conditions (roll == cumulative), and distribution uniformity. Called by src/engine.ts, making this a production code path with zero test coverage.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but lacks @param descriptions (items, weights), @returns, error behavior for mismatched array lengths or all-zero weights, and @template T. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at rng.ts:5-16 is correct: identical cumulative-weight algorithm, properly generic with T. The NEEDS_FIX was based on duplication with pickFromWeighted in reels.ts:30-41 — confirmed identical logic. But duplication is not a correctness defect; both implementations produce correct results independently. Additionally, weightedPick is imported in engine.ts:2, registered at L30, resolved at L120 as `rng`, but `rng` is never actually called in the spin function — the actual reel generation goes through factories.ts→spinReel→pickFromWeighted. This makes the import/registration dead code in the integration, but weightedPick itself is correct. Reclassified correction to OK; duplication belongs on its own axis.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 100% identical logic — cumulative weight selection with same control flow, edge cases, and return behavior

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights are never mutated but lack readonly annotations, allowing accidental mutation at call sites. [L5] |
| 8 | ESLint compliance | WARN | HIGH | Two unsafe patterns: (1) items[items.length - 1] returns undefined when items.length === 0, violating the T return type contract with no guard. (2) items.length !== weights.length is unchecked — a missing weights[i] evaluates as NaN, silently corrupting cumulative. ESLint @typescript-eslint/no-non-null-assertion and no-unsafe-return would surface these. [L5-L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | JSDoc block is present but lacks @param and @returns tags. The exported function's parameter semantics (weight unit, positivity requirement) are undocumented. [L1-L4] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async code. However, empty-array input silently returns undefined-as-T, negative weights produce negative cumulative, and a length mismatch causes NaN propagation. In a hot gaming spin path these are silent data-corruption bugs, not recoverable errors. [L5-L15] |
| 13 | Security | FAIL | CRITICAL | Math.random() is used in a file whose own JSDoc states 'suitable for gaming RNG applications'. The project is a regulated slot-machine engine (jackpot.ts, freespin.ts, paytable.ts, reels.ts; README targets 95% RTP). Math.random() is non-cryptographic, non-auditable, and non-certifiable for regulated gaming. All jurisdictional gaming certifications (GLI, BMM, iTech) require a certified PRNG seeded from an entropy source — Math.random() fails this unconditionally. [L7] |
| 15 | Testability | WARN | MEDIUM | Math.random() is called directly with no injection point. Deterministic unit tests require monkey-patching global Math, which is fragile and non-parallelisable. An rng parameter would make the function a pure, easily testable transformation. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming-utility context requires: (1) input validation for empty arrays, length mismatch, and non-positive weights before any spin; (2) a certifiable RNG source. Neither is present. The fallthrough return on L14 masks the empty-array case in production. [L5-L15] |

### Suggestions

- Mark parameters readonly to express non-mutation intent
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Inject RNG as a parameter to enable certified PRNG in production and deterministic tests
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number,
  ): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  ```
- Add input guards to prevent silent undefined/NaN corruption in gaming paths
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number): T {
    if (items.length === 0) throw new Error('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new Error('weightedPick: items/weights length mismatch');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) throw new Error('weightedPick: total weight must be positive');
  ```
- Expand JSDoc with @param, @returns, and @throws tags
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
   * @param items - Candidate items; must be non-empty and length-matched to weights.
   * @param weights - Positive weights parallel to items; must sum to a positive value.
   * @param rng - Uniform random source on [0, 1); must be a certified PRNG in production.
   * @returns The selected item.
   * @throws {Error} If arrays are empty, mismatched, or total weight is non-positive.
   */
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues() or a certified CSPRNG. Math.random() is not certifiable for regulated gaming RNG; using it violates standard gaming-jurisdiction requirements and undermines the integrity of the documented 95% RTP target. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
