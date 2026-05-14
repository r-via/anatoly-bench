# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm: cumulative-weight weighted selection via reduce and iterative accumulation. Variable names differ (totalWeight/total, roll/r, cumulative/acc), and weightedPick uses generics vs pickFromWeighted's Symbol type, but logic is 100% equivalent. Semantic score 0.837 exceeds threshold with matching behavior.
- **Correction [NEEDS_FIX]**: Two independent correctness defects: non-certifiable PRNG for declared gaming use-case, and silent undefined return on empty input.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a single generic type parameter justified by reuse across typed symbol arrays. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical gaming RNG logic with zero coverage: uniform distribution correctness, boundary behavior (roll == cumulative), zero/negative weights, mismatched array lengths, single-item input, and fallback to last element all untested. Called by src/engine.ts, making this a high-impact gap.
- **PARTIAL [PARTIAL]**: JSDoc describes the function's purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negative weights). (deliberated: confirmed — Confirmed duplicate: weightedPick (rng.ts:5-16) is 100% algorithmically identical to pickFromWeighted (reels.ts:30-41). weightedPick is imported by engine.ts:2, registered in DI container at engine.ts:30, resolved at engine.ts:120, but the resolved `rng` variable is never used. The actual RNG path is: factory.buildReels → spinReel → pickFromWeighted, completely bypassing the DI-registered weightedPick. This is a real latent bug: swapping the RNG in the container would have no effect on reel generation. Confidence bumped slightly as the DI bypass is conclusively verified.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 97% identical logic — both implement cumulative-weight random selection using reduce, random draw, and iterative accumulation with identical fallback. Only differences are generic vs specific type and variable naming conventions.

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are not marked `readonly`. The function never mutates them; callers should be protected from accidental mutation assumptions. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | A JSDoc block exists on `weightedPick` but omits `@param` and `@returns` tags. Public API documentation is incomplete. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Regulated gaming/casino domain inferred from internal docs (.anatoly/state/internal-docs): reels, WILD, SCATTER, jackpot, paytable, freespin vocabulary. The JSDoc on this file explicitly states 'suitable for gaming RNG applications'. `Math.random()` is a non-cryptographic PRNG that is not certifiable for regulated gambling — its seed is runtime-controlled, statistically predictable, and fails certification requirements (GLI, BMM, eCOGRA). A certifiable source (e.g., `crypto.getRandomValues()`) is required. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly, making the function non-deterministic and untestable without global monkey-patching. A `randomFn` parameter with a default would enable pure, reproducible unit tests. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | No guard against empty `items`: `items[items.length - 1]` returns `undefined` when `items.length === 0`, silently violating the `T` return type. No validation that `items.length === weights.length`; mismatched arrays produce silent incorrect results. [L14] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() for certifiable gaming RNG.
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const roll = (array[0] / 0x100000000) * totalWeight;
  ```
- Inject the random function to enable deterministic testing.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    randomFn: () => number = secureRandom,
  ): T {
  ```
- Mark array parameters readonly to prevent accidental mutation assumptions.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Add input validation and complete JSDoc tags.
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   * @param items - Non-empty array of items to pick from.
   * @param weights - Positive weights parallel to `items`.
   * @param randomFn - Uniform [0, 1) random source; defaults to `secureRandom`.
   * @returns The selected item.
   * @throws {RangeError} When `items` is empty or lengths mismatch.
   */
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new RangeError('items must not be empty');
    if (items.length !== weights.length) throw new RangeError('items and weights must have the same length');
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a guard at function entry: if items.length === 0 throw an error (or return a typed sentinel) rather than returning undefined as T. [L15]

### Refactors

- **[correction · high · large]** Replace Math.random() with a certifiable, cryptographically-secure RNG (e.g. crypto.getRandomValues) to meet regulated gaming requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
