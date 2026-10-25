# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | - | 95% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm to pickFromWeighted in src/reels.ts: both compute totalWeight via reduce, draw Math.random() * total, accumulate weights in a loop, and return the last item as fallback. Only differences are variable names and that weightedPick is generic <T> while pickFromWeighted is typed to Symbol[].
- **Correction [OK]**: Standard cumulative-weight selection algorithm is correct. `Math.random()` returns [0,1), so `roll` is always in [0,totalWeight). The fallback on line 16 correctly handles the rare floating-point case where no bucket matches. No in-tree evidence of empty-array or length-mismatch call paths from the known consumer (`spin` in src/engine.ts).
- **Overengineering [LEAN]**: Standard cumulative-weight algorithm with a single generic parameter. The `<T>` generic is appropriate for a shared utility. No unnecessary abstraction, no configuration layer, no class wrapping — just the minimal correct implementation of weighted random selection.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~98% identical logic — same cumulative-weight selection algorithm, same fallback, only variable names and type parameter differ

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items: T[]` and `weights: number[]` are mutated-read-only conceptually but not typed as readonly. Callers could pass mutable arrays that get unexpectedly aliased. [L6] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No guards for: (1) empty `items`/`weights` arrays — returns `items[-1]` which is `undefined` typed as `T`; (2) mismatched array lengths — `weights[i]` silently becomes `undefined` and corrupts `cumulative`; (3) non-positive `totalWeight` — when all weights are 0, `roll` is always 0 and the first item is always returned, silently defeating the caller's intent. [L6-L15] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from project structure (engine.ts, jackpot.ts, reels.ts, paytable.ts, freespin.ts, wild.ts) and JSDoc text 'suitable for gaming RNG applications'. `Math.random()` is not a CSPRNG: it is seeded from a predictable internal state, outputs a 64-bit IEEE float with only ~52 bits of entropy, and is not certifiable under any regulated gaming standard (GLI-11, BMM, iTech Labs). A determined observer can reconstruct the V8 XorShift128+ internal state from a short sequence of outputs and predict all future rolls, enabling outcome manipulation. [L8] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded; deterministic unit tests require global monkey-patching. An optional `rng: () => number` parameter would make the function purely injectable without breaking callers. [L6] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Regulated gaming context: the JSDoc claims the function is 'suitable for gaming RNG applications' but `Math.random()` is explicitly disqualified by every major gaming certification lab. The comment creates a false sense of compliance. The function must use a certified PRNG (e.g., `crypto.getRandomValues` seeding a cryptographic DRBG) before it can appear in a certified slot engine. [L1-L4] |

### Suggestions

- Accept an injectable rng function for testability and replace Math.random(). This also opens the door to a certified CSPRNG without changing callers.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = Math.random,
  ): T {
    const roll = rng() * totalWeight;
  ```
- Replace Math.random() with a CSPRNG for regulated gaming use
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(2);
  crypto.getRandomValues(buf);
  const roll = ((buf[0] * 2 ** 32 + buf[1]) / 2 ** 64) * totalWeight;
  ```
- Add input validation to prevent silent undefined returns
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new Error('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new Error('weightedPick: items and weights length mismatch');
    if (weights.some(w => w < 0)) throw new Error('weightedPick: weights must be non-negative');
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
