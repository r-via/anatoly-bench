# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 68% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight random selection algorithm. Both functions compute total weight, generate uniform random draw, iterate and accumulate weights, returning the selected item. Variable names differ (totalWeight/roll/cumulative vs total/r/acc) but logic is 100% identical. The generic type in weightedPick vs specific Symbol type in pickFromWeighted does not affect semantic equivalence—functions are interchangeable.
- **Correction [NEEDS_FIX]**: Two independent defects: non-certifiable PRNG for declared gaming use case, and undefined return when items is empty.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm with a single generic type parameter justified by reuse across item types. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: zero-weight items, single-item arrays, mismatched array lengths, negative weights, all-equal weights distribution, and the fallback return on last element (floating-point rounding). Called by src/engine.ts, making this a risk in production game logic.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (e.g., empty arrays, negative weights, mismatched array lengths). (deliberated: confirmed — Two claimed defects at rng.ts:5-16. Defect 1 (Math.random() non-certifiable): same as pickFromWeighted — this is a compliance concern, not a correctness bug; reclassified. Defect 2 (empty items returns undefined): Confirmed real at rng.ts:15 — items[items.length - 1] with empty array yields items[-1] = undefined typed as T, a type-safety violation that could cause downstream runtime errors. However, no current caller passes empty arrays: engine.ts:30 registers it in the container, engine.ts:120 resolves it, but factory.buildReels (factories.ts:12) calls spinReel→pickFromWeighted instead, so weightedPick is never actually invoked. Confidence lowered from 85→68: one of two claimed defects is valid but unreachable in current code.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 100% identical implementation of weighted random selection algorithm

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items` and `weights` parameters are not marked `readonly`, allowing callers to pass mutable references with no indication the function won't mutate them. [L6] |
| 12 | Async/Promises/Error handling | WARN | HIGH | Empty `items` array causes the function to return `items[-1]` (i.e., `undefined`) typed as `T`. Mismatched `items`/`weights` lengths silently produce incorrect cumulative sums. Neither case throws or is documented. [L14] |
| 13 | Security | FAIL | CRITICAL | Regulated gaming domain inferred from project vocabulary: `jackpot.ts`, `reels.ts`, `paytable.ts`, `freespin.ts`, `wild.ts`, and the JSDoc phrase 'suitable for gaming RNG applications'. `Math.random()` is a non-cryptographic PRNG with no certifiable seed or audit trail and does not meet the requirements of regulated gaming RNG (e.g., GLI-11, BMM standards). Using it as the sole randomness source in a wagering context is a CRITICAL compliance violation. [L8] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly inside the function with no way to inject a seeded or mock RNG. Unit tests cannot produce deterministic outcomes without patching globals. [L8] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG context requires defensive guards: (1) `items.length !== weights.length` should throw; (2) zero-weight-sum should throw rather than produce NaN; (3) negative weights are silently accepted. These invariants are routine in certifiable RNG implementations. [L6-L15] |

### Suggestions

- Mark array parameters `readonly` to signal non-mutation intent
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Inject the RNG source for testability and certifiability
  ```typescript
  // Before
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const roll = rng() * totalWeight;
  ```
- Add defensive guards for empty arrays, mismatched lengths, and invalid weights
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = Math.random): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
    if (weights.some(w => w < 0)) throw new RangeError('weightedPick: weights must be non-negative');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) throw new RangeError('weightedPick: total weight must be > 0');
  ```
- Replace Math.random() with a certifiable CSPRNG for regulated gaming (e.g., Web Crypto API)
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  // Use a certifiable RNG; example with Web Crypto:
  const randomBytes = new Uint32Array(1);
  crypto.getRandomValues(randomBytes);
  const roll = (randomBytes[0] / 0x100000000) * totalWeight;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Guard against empty items array at the top of the function: if items.length === 0 throw a RangeError rather than returning undefined typed as T. [L15]

### Refactors

- **[correction · high · large]** Replace Math.random() with a CSPRNG (e.g. crypto.getRandomValues on a Uint32Array scaled to [0, totalWeight)) to satisfy certified gaming RNG requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
