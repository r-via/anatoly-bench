# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm to pickFromWeighted. Both compute total weight, generate random draw, accumulate weights in loop, and return item when accumulated weight exceeds random value. Variable names differ (totalWeight vs total, roll vs r, cumulative vs acc) and weightedPick is generic while pickFromWeighted is Symbol-specific, but semantic behavior is equivalent.
- **Correction [NEEDS_FIX]**: Two independent defects: Math.random() is non-certifiable for regulated gaming RNG; empty-array fallback silently returns undefined typed as T.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm; generic <T> is justified for a reusable RNG utility. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: zero-weight items, single-item arrays, mismatched items/weights lengths, negative weights, all-equal weights distribution, and the fallback return on L15. Used by src/engine.ts, making this a production risk.
- **PARTIAL [PARTIAL]**: File-level JSDoc describes purpose and algorithm, but the function itself lacks per-parameter docs (@param items, @param weights), a @returns tag, and does not document edge cases (e.g. empty arrays, negative weights, mismatched array lengths).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — 95% identical logic — both implement cumulative-weight selection algorithm with same control flow

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Array parameters `items` and `weights` are mutable. Callers cannot tell the function won't mutate them. Should be `readonly T[]` and `readonly number[]`. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/casino domain inferred from README invariants: SpinResult, scatter bonuses, free spins, progressive jackpot, 95% RTP. `Math.random()` is a non-cryptographic PRNG (xorshift128+ in V8) and is not certifiable for regulated gaming. Regulatory bodies (GLI, BMM, iTech Labs) require a tested, certified RNG — not the browser/engine PRNG. Any certified audit would reject this function outright. [L7] |
| 15 | Testability | FAIL | MEDIUM | `Math.random()` is hardcoded, making deterministic unit tests impossible without global monkey-patching. An injectable `rng: () => number` parameter would allow seeded testing. [L5-L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming utility lacks defensive guards: (a) no check that `items.length === weights.length`, (b) no check for empty arrays (returns `undefined` typed as `T`), (c) no check for negative/zero weights which would corrupt cumulative distribution. These silent failures are particularly dangerous in a certified RTP-sensitive engine. [L5-L15] |

### Suggestions

- Replace Math.random() with an injectable RNG parameter to enable deterministic tests and allow substituting a certified PRNG.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  ```
- Add input validation guards for mismatched lengths, empty arrays, and non-positive weights.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[], rng: () => number = Math.random): T {
    if (items.length === 0) throw new RangeError('weightedPick: items must be non-empty');
    if (items.length !== weights.length) throw new RangeError('weightedPick: items and weights must have equal length');
    if (weights.some(w => w <= 0)) throw new RangeError('weightedPick: all weights must be positive');
  ```
- Use a certified PRNG (e.g. a seeded AES-CTR or WELL512 implementation auditable under GLI-11) instead of Math.random() for regulated gaming compliance.
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  // inject a certifiable RNG: e.g. CertifiedRng.nextFloat() from your compliance library
  const roll = rng() * totalWeight;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add an early guard (throw or return a typed sentinel) when items.length === 0 to prevent the undefined-as-T return from the fallback path. [L15]

### Refactors

- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues (or an equivalent certified/seeded CSPRNG) to satisfy regulated gaming RNG requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
