# Review: `src/rng.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | - | 93% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical cumulative-weight algorithm. Both functions compute total weight, generate random roll, accumulate weights in loop, and return matching item. Variable names differ (totalWeight vs total, roll vs r, cumulative vs acc) but implementation is semantically equivalent. Generic type T vs specific Symbol type is implementation detail, not semantic difference.
- **Correction [NEEDS_FIX]**: Two independent correctness defects: non-certifiable RNG source for a regulated gaming context, and missing guard for empty input that silently returns `undefined` typed as `T`.
- **Overengineering [LEAN]**: Minimal, textbook cumulative-weight algorithm. The single generic <T> is justified for a shared utility reused across reel symbol arrays of different types. No unnecessary abstractions, no factory/strategy patterns, no configuration objects — just a tight O(n) loop with a floating-point fallback guard on the last element. (deliberated: confirmed — Confirmed NEEDS_FIX — duplication verified. src/rng.ts:5-16 (weightedPick) and src/reels.ts:30-41 (pickFromWeighted) implement the identical cumulative-weight algorithm: sum weights via reduce, generate Math.random() * total, iterate with accumulator, return fallback last element. Only differences are variable names and generic vs concrete typing. Critically, weightedPick is imported (engine.ts:2), registered in the DI container (engine.ts:30), and resolved (engine.ts:120), but NEVER invoked at runtime. The private duplicate pickFromWeighted (reels.ts:47) is the actual runtime RNG, called via spinReel → StandardReelBuilderFactory.buildReels. The 'official' RNG module is dead code.)
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical logic — both implement weighted random selection using cumulative weight approach with identical control flow

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both `items` and `weights` parameters are never mutated inside the function body but are typed as mutable arrays. They should carry `readonly` modifiers to communicate intent and prevent accidental mutation at call sites. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | A file-level JSDoc comment exists, but the exported function `weightedPick` itself has no attached JSDoc block with @param or @returns tags. Consumers inspecting the symbol in an IDE will see no inline documentation. [L5] |
| 12 | Async/Promises/Error handling | WARN | HIGH | Synchronous function, so no async/Promise concerns. However, there is no guard against mismatched array lengths or an empty `items` array. When `items.length === 0`, the fallback `items[items.length - 1]` returns `undefined` typed as `T`, silently violating the return type contract at runtime. [L14] |
| 13 | Security | FAIL | CRITICAL | Slot-machine gambling domain conclusively inferred from Internal Reference Documentation (.anatoly/docs/): reels with symbols CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER, a calibrated RTP target of 95 %, jackpot system, and Monte Carlo RTP verification. The file's own JSDoc confirms 'gaming RNG applications'. `Math.random()` is backed by a non-cryptographically-secure PRNG (V8 xorshift128+), which cannot be certified for regulated gaming jurisdictions, cannot be seeded for audit/replay, and produces a statistically biased distribution under repeated use. Regulated gaming RNG must use a certified CSPRNG (e.g., `crypto.getRandomValues`) or a hardware RNG. This is a direct compliance and fairness violation. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly inside the function with no injection point, making deterministic unit testing impossible without global mock patching. Accepting a `rng: () => number` parameter (defaulting to Math.random) would allow fully deterministic tests and seeded reproducibility. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | For a gaming RNG module, industry best practice requires: (1) an injectable/seedable random source for audit and replay, (2) input validation ensuring weights.length === items.length, and (3) an explicit RNG strategy interface so the implementation can be swapped for a certified CSPRNG without changing call sites. None of these are present. The function exposes no RNG abstraction boundary, tightly coupling all callers to Math.random. |

### Suggestions

- Replace Math.random() with an injectable rng parameter defaulting to crypto.getRandomValues-backed source, enabling both certification compliance and deterministic testing.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  const cryptoRng = (): number => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  };
  
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = cryptoRng,
  ): T {
    if (items.length === 0) throw new RangeError('items must not be empty');
    if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  ```
- Add readonly modifiers to parameters that are never mutated.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Add per-function JSDoc with @param and @returns tags for IDE consumers.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  /**
   * Selects a random element from `items` proportional to the corresponding `weights`.
   * @param items - The candidate items to pick from.
   * @param weights - Non-negative relative weights parallel to `items`.
   * @param rng - Optional uniform [0,1) random source; defaults to a CSPRNG.
   * @returns The selected item.
   */
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng?: () => number): T {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a guard at the top of weightedPick that throws (or returns a typed error) when `items` is empty, preventing silent return of `undefined` typed as `T`. [L13]

### Refactors

- **[correction · high · large]** Replace `Math.random()` with a certifiable CSPRNG (e.g., crypto.getRandomValues or a seeded, auditable PRNG) to meet regulated gaming certification requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
