# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 88% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm to pickFromWeighted. Both compute cumulative weights, generate uniform random value, and select matching item via same loop logic. Differ only in variable naming and type generalization (generic T vs specialized Symbol).
- **Correction [NEEDS_FIX]**: Two independent correctness defects: non-certifiable RNG for a regulated gaming domain, and undefined return on empty input.
- **Overengineering [LEAN]**: Standard cumulative-weight selection algorithm. Generic type parameter is appropriate for reuse across symbol types. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical RNG logic used by src/engine.ts has zero coverage — no tests for uniform distribution, boundary roll (roll === cumulative), zero weights, single-item input, or weight normalization correctness.
- **DOCUMENTED [DOCUMENTED]**: JSDoc describes purpose, algorithm (cumulative-weight with uniform draw), and use-case context. Generic type parameter and parameter names are self-explanatory; no @param/@returns tags, but the prose fully conveys intent and behavior.

> **Duplicate of** `src/reels.ts:pickFromWeighted` — Semantic score 0.819. Same cumulative-weight random selection implementation—only variable naming differs.

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are never mutated but typed as mutable arrays. Should be `readonly T[]` and `readonly number[]`. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | File-level JSDoc exists but `weightedPick` has no `@param` or `@returns` tags. Public generic function warrants full parameter documentation. [L1-L4] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated-gaming domain confirmed by reference docs (PAY_TABLE, REEL_WEIGHTS, scatter bonuses, 95% RTP target, progressive jackpot). `Math.random()` uses V8's xorshift128+ PRNG, which is NOT cryptographically secure and is NOT certifiable for regulated gaming RNG. Certified gaming platforms require a CSP-approved CSPRNG (e.g. `crypto.getRandomValues`). The JSDoc claim that this is 'suitable for gaming RNG applications' is therefore false and dangerous. This is a compliance-critical violation. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded, making deterministic unit testing impossible without monkey-patching. A `rng: () => number` parameter with a default of `Math.random` would enable seeded/mocked tests. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG context requires defensive input validation: (1) `items.length !== weights.length` is never checked — a mismatch silently produces wrong picks; (2) empty `items` returns `undefined` typed as `T` instead of throwing. Both are silent failure modes in a payout-critical path. [L5-L15] |

### Suggestions

- Replace `Math.random()` with `crypto.getRandomValues` for certifiable gaming RNG, and inject the random source for testability.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  function cryptoRandom(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  }
  
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = cryptoRandom,
  ): T {
    if (items.length === 0) throw new RangeError('items must be non-empty');
    if (items.length !== weights.length) throw new RangeError('items and weights length mismatch');
    const roll = rng() * totalWeight;
  ```
- Mark array parameters readonly to enforce immutability at the call site.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Add @param and @returns JSDoc tags to the public export.
  ```typescript
  // Before
  /**
   * Weighted random pick utility, suitable for gaming RNG applications.
   * Uses a cumulative-weight approach with a uniform random draw.
   */
  // After
  /**
   * Selects one item from `items` proportionally to its corresponding `weights` entry.
   * @param items - Candidate items to pick from (must be non-empty).
   * @param weights - Positive numeric weights parallel to `items`.
   * @param rng - Optional random source; defaults to a CSPRNG wrapper.
   * @returns The selected item.
   * @throws {RangeError} If `items` is empty or lengths differ.
   */
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Guard against empty items/weights arrays at the top of the function; throw or return a typed sentinel rather than silently returning undefined. [L15]

### Refactors

- **[correction · high · large]** Replace Math.random() with a certifiable, auditable PRNG (e.g. a seeded Mersenne Twister or crypto.getRandomValues-based uniform draw) required for regulated gaming RNG. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
