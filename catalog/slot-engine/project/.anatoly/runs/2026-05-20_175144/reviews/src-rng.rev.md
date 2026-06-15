# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | NEEDS_FIX | LEAN | USED | DUPLICATE | NONE | 85% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm: accumulate weights and return when random draw exceeds cumulative total. Generic type parameter differs from Symbol-specific implementation, but behavior is identical.
- **Correction [NEEDS_FIX]**: Uses Math.random() in a slot-machine engine; not certifiable for regulated gaming RNG.
- **Overengineering [LEAN]**: Standard cumulative-weight algorithm. Generic type parameter T is appropriate for reuse across symbol arrays. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item input, boundary roll equal to cumulative weight, and distribution uniformity. Called by src/engine.ts, making coverage gaps a real risk.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched lengths, negative weights).

> **Duplicate of** `src/reels.ts:pickFromWeighted` — Identical weighted selection algorithm—both accumulate weights and return item when random draw exceeds cumulative

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | items and weights are mutated-read-only input arrays; parameters should be readonly to prevent accidental mutation and signal intent. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated-gaming domain confirmed by pay table, reel symbols (CHERRY/DIAMOND/SEVEN/SCATTER/WILD), jackpot, and free-spin mechanics in project docs. Math.random() is a V8 Xorshift128+ PRNG — non-cryptographic, seedable, and not certifiable by any regulated gaming authority (GLI-19, BMM, eCOGRA). The JSDoc itself advertises this function as the gaming RNG entry point. Replace with crypto.getRandomValues() or a certified RNG provider. [L7] |
| 15 | Testability | FAIL | MEDIUM | Math.random() is hardcoded with no injection seam. The function is non-deterministic and cannot be unit-tested for specific outcomes (e.g. boundary weights, uniform distribution). Accepting an optional rng parameter fixes this. [L7] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG utility has no guard for items.length !== weights.length. A mismatch causes weights[i] to become undefined, silently producing NaN for cumulative and returning the last item regardless of weights. A slot engine calling this with mismatched arrays would never fail loudly. [L5-L15] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues() for a certifiable uniform draw, and accept an injectable rng for testability.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = cryptoRandom,
  ): T {
    if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  
  function cryptoRandom(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x100000000;
  }
  ```
- Mark parameters readonly to prevent accidental mutation and express intent.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a cryptographically secure or certifiable RNG source (e.g., crypto.getRandomValues / crypto.randomInt) — Math.random() is predictable and non-certifiable for regulated gaming. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
