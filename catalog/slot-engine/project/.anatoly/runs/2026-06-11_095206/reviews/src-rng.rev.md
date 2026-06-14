# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 92% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm: sum weights, draw uniform random in [0,total), walk accumulating weights, return item on first roll < acc, fallback to last item. Only differences are variable names and that weightedPick is generic <T> while pickFromWeighted is fixed to Symbol[]. The generic type parameter does not change the semantic contract — both functions are interchangeable for any concrete type.
- **Correction [NEEDS_FIX]**: Uses Math.random() — not certifiable for regulated gaming RNG in a clearly slot-machine domain.
- **Overengineering [LEAN]**: Minimal cumulative-weight algorithm. Generic type parameter is appropriate given the gaming RNG use case. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, all-zero weights, single-item input, and boundary roll == cumulative. Called by src/engine.ts, making this a production code path with zero test coverage.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, missing @returns, and no mention of edge cases (empty arrays, mismatched lengths, zero/negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. rng.ts:5-16 implements standard cumulative-weight sampling correctly. The evaluator conflated duplication with a correctness defect. Additionally, while weightedPick is imported at engine.ts:2 and registered in the container at engine.ts:30, the resolved variable `rng` at engine.ts:120 is never called — reel generation flows through StandardReelBuilderFactory.buildReels (factories.ts:9-15) → spinReel (reels.ts:43) → pickFromWeighted (reels.ts:30). This makes weightedPick effectively unused via the container path, but that is a utility/dead-code concern, not a correctness bug in the function itself.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~97% identical logic — same cumulative-weight loop, same fallback, same Math.random() draw; differs only in variable names and generic vs concrete type parameter

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `items: T[]` and `weights: number[]` are never mutated but typed as mutable. Should be `readonly T[]` and `readonly number[]`. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/payline/jackpot/symbol vocabulary in project docs and src/ filenames (reels.ts, jackpot.ts, freespin.ts, paytable.ts). `Math.random()` is a non-cryptographically-secure PRNG: its internal state is observable, its output distribution is not statistically certified, and it does not satisfy regulated gaming RNG requirements (GLI-11, BMM, eCOGRA all mandate certified CSPRNGs such as AES-CTR DRBG or HMAC-DRBG per NIST SP 800-90A, or hardware RNG). This is a compliance failure in a regulated gaming context. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly with no injection point, making the function non-deterministic in tests. An optional `rng: () => number` parameter (defaulting to `Math.random`) would enable deterministic unit tests. [L5-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming RNG utility with no input guards: an empty `items` array causes `items[items.length - 1]` to return `undefined` typed as `T` (type-unsound silent failure); mismatched `items`/`weights` lengths propagate NaN through the cumulative sum. A production gaming primitive should throw on invalid inputs rather than silently corrupt game outcomes. [L5-L15] |

### Suggestions

- Replace Math.random() with crypto.getRandomValues for regulated gaming compliance
  ```typescript
  // Before
  const roll = Math.random() * totalWeight;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = (buf[0] / 0x1_0000_0000) * totalWeight;
  ```
- Accept an injectable RNG function to enable deterministic testing and swappable CSPRNG
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = Math.random() * totalWeight;
  // After
  export function weightedPick<T>(
    items: readonly T[],
    weights: readonly number[],
    rng: () => number = () => {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] / 0x1_0000_0000;
    },
  ): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  ```
- Add input guards to prevent type-unsound returns on empty or mismatched arrays
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
  // After
  export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
    if (items.length === 0) throw new Error('weightedPick: items must not be empty');
    if (items.length !== weights.length) throw new Error('weightedPick: items and weights length mismatch');
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a cryptographically secure random source (e.g. crypto.getRandomValues()) to produce a certifiable uniform draw required for regulated gaming RNG. [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
