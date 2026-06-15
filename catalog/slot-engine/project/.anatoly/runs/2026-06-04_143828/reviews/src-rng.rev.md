# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 92% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Logic is identical to pickFromWeighted in src/reels.ts: both sum weights, draw Math.random() * total, accumulate per-item and return on first overshoot, fallback to last item. Only differences are generic type parameter T vs concrete Symbol type and variable renaming (totalWeight/roll/cumulative vs total/r/acc).
- **Correction [NEEDS_FIX]**: Uses Math.random() which is not a certifiable RNG for regulated gaming software.
- **Overengineering [LEAN]**: Standard cumulative-weight random selection. Generic type parameter is appropriate for reuse across symbol types. No unnecessary abstraction.
- **Tests [NONE]**: No test file found. Critical gaming RNG utility used by src/engine.ts has zero test coverage — edge cases like empty arrays, mismatched array lengths, zero weights, single-item arrays, and distribution uniformity are all untested.
- **PARTIAL [PARTIAL]**: Block comment describes purpose and algorithm, but lacks @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/rng.ts:5-16 is algorithmically correct — same cumulative-weight sampling as pickFromWeighted. Duplication is real but is not a correction defect. Additionally, weightedPick is imported by engine.ts (L2), registered in the container (L30), and resolved (L120), but the resolved `rng` variable is never called — the factory path (spinReel → pickFromWeighted) is used instead. This makes weightedPick effectively dead at runtime, which is a utility concern, not a correction defect. The function itself is correct; it's just unused and duplicated.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight algorithm, same fallback, differs only in type parameter and variable names

## Best Practices — 6/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items` and `weights` are not marked `readonly`. The function never mutates them; readonly arrays should be declared. [L5] |
| 13 | Security | FAIL | CRITICAL | Regulated gaming/casino domain inferred from the slot-machine vocabulary throughout the reference docs (pay tables, CHERRY/SEVEN/DIAMOND symbols, jackpot, RTP 95%) and confirmed by the JSDoc itself: 'suitable for gaming RNG applications.' `Math.random()` is a non-cryptographic PRNG seeded by the JavaScript engine — it is not certifiable for regulated gaming RNG under GLI-11, BMM, or equivalent standards. A CSPRNG source (e.g. `crypto.getRandomValues`) must be used instead. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is called directly, making deterministic unit testing impossible without monkey-patching the global. Accepting a `random: () => number` parameter (defaulting to `Math.random`) would allow injection of a seeded PRNG in tests. [L7] |

### Suggestions

- Use readonly array parameters to express non-mutation intent and satisfy immutability rule.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`
- Replace Math.random() with a CSPRNG and accept an injectable random function for both compliance and testability.
  ```typescript
  // Before
  export function weightedPick<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
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
    random: () => number = cryptoRandom,
  ): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = random() * totalWeight;
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() with a CSPRNG source (e.g. crypto.getRandomValues() scaled to a float in [0,1)) to satisfy regulated gaming RNG certification requirements. [L7]
- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
