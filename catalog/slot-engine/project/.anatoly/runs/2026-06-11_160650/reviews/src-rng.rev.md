# Review: `src/rng.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| weightedPick | function | yes | OK | LEAN | USED | DUPLICATE | NONE | 95% |

### Details

#### `weightedPick` (L5–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [DUPLICATE]**: Identical algorithm: both compute total weight via reduce, draw Math.random() * total, accumulate per-index weights, and return on first overshoot with a fallback to the last element. Only differences are variable names and that weightedPick is generic (T) while pickFromWeighted is locked to Symbol[]. The generic form could directly replace the domain-specific one via weightedPick<Symbol>.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG; slot-machine domain confirmed by reel/payline/jackpot/RTP vocabulary in the consumer (src/engine.ts) and the file's own JSDoc.
- **Overengineering [LEAN]**: Standard cumulative-weight alias sampling — minimal, correct, and generic without being gratuitously abstract. The generic type parameter T is appropriate for a reusable utility consumed by the engine.
- **Tests [NONE]**: No test file exists. Critical gaming RNG function used in slot machine spin logic lacks any coverage: zero distribution validation, no edge case testing (single item, all-zero weights, mismatched array lengths, negative weights), and no seeded randomness verification for the off-by-one boundary where roll == cumulative.
- **PARTIAL [PARTIAL]**: Block-level JSDoc describes the algorithm and use case, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g. empty arrays, mismatched array lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. src/rng.ts:5-16 is algorithmically correct — same cumulative-weight sampling as pickFromWeighted. The duplication is real but belongs on the duplication axis, not correction. Additionally, weightedPick is imported at engine.ts:2 and registered in the IoC container at engine.ts:30, resolved at engine.ts:120, but never actually called in spin() — the reel generation goes through factory.buildReels() (engine.ts:128) → spinReel() (factories.ts:12) → pickFromWeighted() (reels.ts:47). This makes weightedPick effectively dead code in the spin path, which is a utility/overengineering concern, not a correctness defect.)

> **Duplicate of** `src/reels.ts:pickFromWeighted` — ~95% identical logic — same cumulative-weight random selection with only renamed locals and a concrete type instead of a generic

## Best Practices — 5.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Parameters `items: T[]` and `weights: number[]` are mutable array types. Neither is mutated inside the function; they should be `readonly T[]` and `readonly number[]`. [L5] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated-gaming domain confirmed by reference docs (pay table, CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND symbols, free spins, jackpot, 95% RTP target, src/jackpot.ts, src/freespin.ts). `Math.random()` is a non-seeded PRNG unsuitable for certified gaming RNG: it is not cryptographically secure, its output distribution cannot be independently audited, and using it violates certification requirements (e.g., GLI-11, BMM, eCOGRA). The JSDoc comment 'suitable for gaming RNG applications' reinforces the intent while using a non-compliant source. Replace with a CSPRNG (e.g., `crypto.getRandomValues`) or a certified RNG library. [L7] |
| 15 | Testability | WARN | MEDIUM | `Math.random()` is hardcoded, making deterministic unit tests impossible without global monkey-patching. An injectable `rng: () => number` parameter with a default of `Math.random` would allow fully deterministic test coverage. [L5-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | No guard against empty `items` or `items.length !== weights.length`. When `items` is empty, `items[items.length - 1]` returns `undefined` silently, violating the `T` return type. In a gaming context where RNG drives payouts, a silent wrong return has direct monetary impact. [L14] |

### Suggestions

- Replace Math.random() with a CSPRNG-backed draw to satisfy regulated gaming RNG requirements, and inject the RNG for testability.
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
    if (items.length === 0) throw new RangeError('items must be non-empty');
    if (items.length !== weights.length) throw new RangeError('items and weights must have equal length');
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const roll = rng() * totalWeight;
  
  /** Returns a uniform random float in [0, 1) using the Web Crypto API. */
  function cryptoRandom(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] / 0x1_0000_0000;
  }
  ```
- Mark array parameters readonly to express non-mutation intent.
  - Before: `export function weightedPick<T>(items: T[], weights: number[]): T {`
  - After: `export function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {`

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a crypto.getRandomValues-based uniform draw. Use rejection sampling on a Uint32 to avoid modulo bias. This is required for regulated gaming certification (GLI-11 / BMM / iTech standards prohibit non-cryptographic PRNGs). [L7]

### Refactors

- **[duplication · high · small]** Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]

### Hygiene

- **[documentation · low · trivial]** Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
