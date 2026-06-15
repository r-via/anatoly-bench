# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 92% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 93% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 75% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 72% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used in pickFromWeighted call (L47) and returned by getReelSymbols (L53)
- **Duplication [UNIQUE]**: Constant symbol array with no similar declarations found
- **Correction [OK]**: Array of 8 slot symbols; order matches ReelWeightConfig fields and weightsToArray output.
- **Overengineering [LEAN]**: Simple constant array of 8 symbol names.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; name is clear, but no comment explaining the canonical symbol ordering (which matters for index alignment with weight arrays).

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times in REEL_WEIGHTS initialization (L24–L28)
- **Duplication [UNIQUE]**: Weight configuration constant with no similar definitions found
- **Correction [NEEDS_FIX]**: DIAMOND weight=30 (P=0.25 per cell) produces DIAMOND-alone expected payout of ~229% per line bet, making total RTP >> 100%; directly violates the arbitrated 95% RTP target.
- **Overengineering [ACCEPTABLE]**: Object literal using ReelWeightConfig. Slightly over-structured given the interface issue, but readable as a named config block. Acceptable on its own.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Specific numeric values carry semantics (total=120, relative probabilities) that are non-obvious without comment. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug. DEFAULT_WEIGHTS (reels.ts:12-15) defines valid numeric weights summing to 120. The weighted selection algorithm in pickFromWeighted (reels.ts:31) normalizes by total weight via `wts.reduce((s, w) => s + w, 0)`, so non-100 sums are correct by design. The constant is used exactly 5 times at L23-27 to build REEL_WEIGHTS. The escalation detail itself confirms USED and UNIQUE — no defect evidence was provided. The NEEDS_FIX label on the correction axis is unsupported.)

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel (L45) and getReelWeights (L57)
- **Duplication [UNIQUE]**: Reel weight matrix constant with no similar declarations found
- **Correction [OK]**: Correctly builds 5 weight arrays from DEFAULT_WEIGHTS; weight-value bug is in DEFAULT_WEIGHTS (rule 10).
- **Overengineering [OVER]**: Five identical calls to weightsToArray(DEFAULT_WEIGHTS) when all reels share the same weights. `Array.from({length:5}, () => [...DEFAULT_WEIGHTS])` or even a single shared array would be simpler. The indirection through weightsToArray compounds the ReelWeightConfig overengineering.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported, but the design choice (all 5 reels share identical weights) is non-obvious and worth a note.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel loop (L47) to select weighted random symbols
- **Duplication [DUPLICATE]**: 98% identical weighted selection algorithm — only variable names and type specificity differ
- **Correction [NEEDS_FIX]**: Uses Math.random(), which is not a certifiable RNG for regulated gaming; casino/slot domain is unambiguous from symbol vocabulary, paytable, and RTP target.
- **Overengineering [LEAN]**: Standard weighted-random selection. Linear scan is appropriate for 8 items; no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. This stochastic function has critical edge cases (zero-weight items, single-item list, boundary rounding) that need deterministic seeding tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper ~10 lines. Algorithm (weighted random selection with last-item fallback) has non-trivial edge-case behavior, but private-helper leniency applies. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug. pickFromWeighted (reels.ts:30-41) correctly implements cumulative-weight random selection: sums weights (L31), draws uniform random in [0, total) (L32), iterates with accumulator (L33-38), returns fallback (L40). It IS algorithmically identical to weightedPick in rng.ts:5-16 (confirmed: same reduce→random→accumulate→fallback pattern, only variable names differ), but duplication belongs on the duplication axis, not the correction axis. This is the live RNG path: engine.ts:128 → factories.ts:12 spinReel(i) → reels.ts:47 pickFromWeighted(). Function produces correct weighted random output.)

> **Duplicate of** `src/rng.ts:weightedPick` — Identical logic: both sum weights, generate random threshold, accumulate and return item when threshold exceeded

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported; runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found in semantic search
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; any index outside 0–4 yields undefined for weights, causing a TypeError crash inside pickFromWeighted at wts.reduce.
- **Overengineering [LEAN]**: Straightforward: fetch weights for reel, pick 3 symbols, return column.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts, making it a critical path with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), meaning of returned Symbol[] (3-row column), and behavior on out-of-bounds index.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function with no similar patterns found
- **Correction [OK]**: Returns SYMBOLS directly; no logic errors.
- **Overengineering [LEAN]**: Trivial accessor exposing the SYMBOLS constant.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Name is clear, but no note that index order aligns with getReelWeights output — a critical coupling for callers.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function with no similar patterns found
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex (undefined returned as number[]) and returns a mutable reference to the internal weight array, contradicting the documented read-only invariant.
- **Overengineering [LEAN]**: Trivial accessor; justified as part of the public API documented in the reference docs.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. reelIndex valid range (0–4) and the fact that the returned array is shared (not a copy) are undocumented.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually lists every Symbol key. `Record<Symbol, number>` would be equivalent and DRY — additions to the Symbol union would be automatically covered. [L7-L11] |
| 5 | Immutability | FAIL | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` lack `readonly`/`as const`. `getReelWeights` returns a direct mutable reference to the internal `REEL_WEIGHTS[reelIndex]` array. The documentation contract states 'Weights are read-only at runtime — there is no setter', but callers can mutate via the returned reference: `getReelWeights(0)[0] = 999`. [L3-L26] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | None of the three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) have JSDoc comments describing parameters, return types, or side-effects. [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel` and `getReelWeights` perform no bounds-check on `reelIndex`. An out-of-range index yields `undefined` from `REEL_WEIGHTS[reelIndex]`; passing that to `wts.reduce(...)` inside `pickFromWeighted` throws `TypeError` at runtime with no guard. [L43-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/symbol/WILD/SCATTER vocabulary and project structure (src/engine.ts, src/jackpot.ts, src/freespin.ts). `Math.random()` is a non-cryptographic PRNG seeded from system entropy with no certified statistical properties — it is not certifiable for regulated gaming RNG under GLI, BMM, or equivalent testing lab standards. The project already contains `src/rng.ts`, a dedicated RNG module, yet `pickFromWeighted` calls `Math.random()` directly, bypassing it entirely. [L32] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point, making deterministic unit tests impossible without monkey-patching. An RNG parameter or injected `src/rng.ts` abstraction would allow seeded, reproducible test runs. [L31-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS` could use `satisfies ReelWeightConfig` to get type-checked literal inference while retaining the narrowed literal type. `SYMBOLS` could use `as const satisfies Symbol[]`. [L13-L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | `getReelWeights` and `getReelSymbols` return direct references to internal mutable arrays. In a slot engine where weight integrity is a regulatory concern, callers can silently alter payout distribution. Both should return a copy or typed `ReadonlyArray`. [L53-L58] |

### Suggestions

- Replace `Math.random()` with the project's dedicated `src/rng.ts` module and inject RNG as a parameter for testability.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: readonly number[], rng: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Mark module-level constants as deeply readonly and return copies from public accessors to enforce the 'read-only at runtime' contract.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const REEL_WEIGHTS: number[][] = [...];
  
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
    }
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Use `Record<Symbol, number>` for `ReelWeightConfig` and `satisfies` for `DEFAULT_WEIGHTS` to stay DRY and leverage TS 5.5+ narrowing.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } satisfies ReelWeightConfig;
  ```
- Add JSDoc to all three public exports.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spins a single reel and returns a 3-symbol column.
   * @param reelIndex - Reel index in [0, 4].
   * @throws {RangeError} if reelIndex is out of bounds.
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a bounds guard in spinReel: throw a RangeError (or return an error type) if reelIndex < 0 or reelIndex >= REEL_WEIGHTS.length. [L44]
- **[correction · medium · small]** Add bounds validation to getReelWeights and return a defensive copy or ReadonlyArray<number> to prevent callers from mutating internal reel state. [L57]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to the single-digit range (~3–6) so its per-payline expected payout is a small fraction of the 95% RTP target. At weight=30, DIAMOND alone contributes ~229% RTP, making the total impossible to cap at 100%, let alone 95%. [L13]
- **[correction · high · large]** Replace Math.random() with a certifiable CSPRNG (e.g., crypto.getRandomValues) to meet regulated gaming RNG requirements. [L33]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
