# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 90% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 72% |
| weightsToArray | function | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 82% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 80% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Passed as argument to pickFromWeighted at line 38
- **Duplication [UNIQUE]**: Constant array of symbol names. No similar functions found.
- **Correction [OK]**: Eight symbols match ReelWeightConfig and weightsToArray order exactly.
- **Overengineering [LEAN]**: Simple typed constant array listing all 8 symbols.
- **Tests [NONE]**: No test file exists. Array contents and ordering are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Not exported; tolerable, but a brief note on ordering (which maps to REEL_WEIGHTS indices) would prevent subtle bugs.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type annotation for weightsToArray parameter and DEFAULT_WEIGHTS constant
- **Duplication [UNIQUE]**: Type definition for reel weight configuration. No similar types found.
- **Correction [OK]**: Interface correctly mirrors the eight symbol constants.
- **Overengineering [LEAN]**: Explicit named-field interface mirrors the documented config schema exactly. `Record<Symbol, number>` would be equally valid but this is not excessive.
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: All eight fields are symbol names whose meaning is obvious from context. Self-descriptive interface needs no additional prose.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Argument to weightsToArray called 5 times in REEL_WEIGHTS initialization
- **Duplication [UNIQUE]**: Default weight configuration constant. No similar constants found.
- **Correction [NEEDS_FIX]**: DIAMOND weight=30 causes 5-DIAMOND alone to contribute ~97.7% RTP, violating the arbitrated 95% target. Forward: P(DIAMOND/cell)=30/120=0.25; P(5-DIAMOND/payline)=0.25^5≈0.000977; expected payout per payline as fraction of total bet (10×lineBet) = 0.000977×1000/10=9.77%; across 10 paylines = 97.7%. Backward: if 5-DIAMOND were the sole contributor and consumed the full 95% budget, per-payline budget=9.5%; (w/120)^5×100=9.5%→w≈29.6. Sanity: forward(29.6)≈91.6%—consistent, formula sound. At w=30, 5-DIAMOND alone exhausts the entire RTP budget; all other winning combos (3-DIAMOND, 4-DIAMOND, SEVEN, BAR, WILDs) push total RTP well above 100%, contradicting the arbitrated 95% target.
- **Overengineering [LEAN]**: Plain object satisfying ReelWeightConfig; values match documented defaults.
- **Tests [NONE]**: No test file exists. Weight values (sum, individual fields) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The numeric values carry implicit probability semantics (total=120, share per symbol) that are not explained anywhere inline. (deliberated: confirmed — Verified by cross-referencing reels.ts:12-15 weights with paytable.ts:5-12 payouts. DIAMOND has the highest weight (30/120 = 25% frequency) AND the highest payout multipliers (50/250/1000). For comparison, SEVEN has weight 5/120 = 4.2% but pays only 25/100/500. This inverted frequency-payout relationship violates fundamental slot math — high-paying symbols must be rare to control RTP. The DIAMOND weight appears misconfigured (possibly swapped with a low-value symbol like CHERRY at 25 or should be much lower). Increased confidence from 60→72 because the paytable cross-reference provides concrete mathematical evidence, but kept below 85 because no specification document exists to confirm intended values.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times at lines 23-27 to populate REEL_WEIGHTS array
- **Duplication [UNIQUE]**: Converts ReelWeightConfig object to number array. No similar functions found.
- **Correction [OK]**: Property extraction order matches SYMBOLS array order exactly.
- **Overengineering [ACCEPTABLE]**: Converts typed config to a positional number[] whose order must manually mirror SYMBOLS. Fragile if SYMBOLS is reordered, but `SYMBOLS.map(s => cfg[s])` would be cleaner. Not overengineered — needed to bridge the typed config to pickFromWeighted's indexed interface.
- **Tests [NONE]**: No test file exists. Ordering and completeness of output array are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, 4-line helper. Name is clear; lenient treatment applies, but the fixed ordering dependency on SYMBOLS is a silent contract worth noting.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed at line 45 in spinReel function
- **Duplication [UNIQUE]**: 2D array of per-reel weight distributions. No similar constants found.
- **Correction [OK]**: Five reels, each initialized from DEFAULT_WEIGHTS, matches documented configuration.
- **Overengineering [ACCEPTABLE]**: Creates 5 identical arrays from DEFAULT_WEIGHTS to support per-reel weight customization. Currently premature (all reels share the same weights), but spinReel(reelIndex) API and the documented architecture explicitly anticipate per-reel differentiation, justifying the structure.
- **Tests [NONE]**: No test file exists. Reel count (5) and per-reel weight arrays are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The fact that all five reels share identical weight tables is a meaningful design decision with no inline explanation.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called at line 38 within spinReel loop
- **Duplication [DUPLICATE]**: Identical logic to weightedPick: both use cumulative weight comparison with Math.random() for weighted selection. Only differences are variable naming (total/totalWeight, r/roll, acc/cumulative) and type signature (Symbol-specific vs generic).
- **Correction [NEEDS_FIX]**: Math.random() is a non-certifiable PRNG; regulated gambling/casino domain requires a certifiable RNG (inferred from reel/payline/jackpot/paytable vocabulary and arbitrated README context). Math.random() is implementation-defined, non-seedable, and non-auditable — disqualifying for regulated gaming RNG certification (industry convention).
- **Overengineering [LEAN]**: Standard cumulative-weight sampling; matches the documented algorithm exactly.
- **Tests [NONE]**: No test file exists. Critical probabilistic logic — distribution correctness, boundary (r == acc), single-item, and zero-weight cases all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, but the algorithm (cumulative-weight sampling, fallback to last element) has non-obvious edge-case behavior and no JSDoc describing params, return, or invariants. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Compared reels.ts:30-41 with rng.ts:5-16 line-by-line: identical algorithm (cumulative weight accumulation, Math.random() draw, threshold comparison, fallback to last item). Differences are only variable names (total/totalWeight, r/roll, acc/cumulative) and type signature (Symbol-specific vs generic T[]). The function is correct — it produces valid weighted random selections. The real issue is duplication: `weightedPick` is imported at engine.ts:2 and registered in the container at engine.ts:30, but the resolved `rng` at engine.ts:120 is never called. Reel generation flows through factory.buildReels() → spinReel() → pickFromWeighted() (reels.ts:47), bypassing the container entirely. This is a duplication/dead-code concern, not a correctness bug.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both perform weighted random selection via cumulative weight accumulation and threshold comparison

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported, runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Generates 3-symbol column for a reel using weighted selection. No similar functions found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex: REEL_WEIGHTS[reelIndex] returns undefined for any value outside [0,4], causing wts.reduce() to throw TypeError at runtime. The exported function accepts any number.
- **Overengineering [LEAN]**: Draws 3 symbols for a reel column using the indexed weight table. Minimal and clear.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts; column length (3), valid symbol membership, and out-of-bounds reelIndex are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc on reelIndex range (0–4), return shape (3-element column), or sampling strategy.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function returning SYMBOLS constant.
- **Correction [OK]**: Returns the module-level SYMBOLS array; no logic path can fail.
- **Overengineering [LEAN]**: Trivial accessor.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; return identity and array contents untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc; return value mutability and ordering semantics (mirrors REEL_WEIGHTS index mapping) are undocumented.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function returning reel weights by index.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex: returns undefined for indices outside [0,4], silently exposing an invalid value to callers rather than throwing or returning an empty array.
- **Overengineering [LEAN]**: Trivial accessor.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; correct index mapping and returned array contents untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc on valid reelIndex range, return array length, or relationship between indices and SYMBOLS order.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually lists all 8 symbol keys. `Record<Symbol, number>` would be more idiomatic and would automatically stay in sync with the `Symbol` union. [L9-L13] |
| 5 | Immutability | FAIL | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are all mutable. `getReelSymbols()` and `getReelWeights()` return live mutable references to module-level state, allowing callers to silently corrupt the weight tables between spins. [L3-L24, L57-L58] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) have no JSDoc. `spinReel` in particular has a non-obvious `reelIndex` contract (valid range 0–4) that should be documented. [L43, L50, L54] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `REEL_WEIGHTS[reelIndex]` returns `undefined` when `reelIndex >= 5`, but is typed as `number[]`. Passing `undefined` as `wts` to `pickFromWeighted` causes `wts.reduce(...)` to throw a runtime TypeError. No bounds guard exists. [L44] |
| 13 | Security | FAIL | CRITICAL | Gambling/casino domain confirmed: slot-machine symbols (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER), pay table, scatter free spins, progressive jackpot, 95% RTP target (README arbitrated intents). `Math.random()` is a non-cryptographic, non-certifiable PRNG — unusable for regulated gaming RNG. The project contains `src/rng.ts` specifically for this purpose, yet `reels.ts` bypasses it entirely and calls `Math.random()` directly at L34. [L34] |
| 14 | Performance | WARN | MEDIUM | `pickFromWeighted` recomputes `total` via `reduce` on every call. With 3 draws per reel × 5 reels = 15 calls per spin, the total (always 120) should be pre-computed and cached. [L33] |
| 15 | Testability | FAIL | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point. `spinReel` cannot be tested deterministically without global mocking. `src/rng.ts` exists as the project's RNG abstraction but is unused here, eliminating the natural seam for testing. [L34, L43-L48] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS satisfies ReelWeightConfig` with `as const` would give narrowed literal types and catch weight-key mismatches at compile time. Neither `satisfies` nor `as const` is used. [L15-L18] |
| 17 | Context-adapted rules | WARN | MEDIUM | `getReelWeights` returns the live `REEL_WEIGHTS[reelIndex]` array. Callers can mutate it (e.g., `getReelWeights(0)[0] = 999`), silently skewing all subsequent spins on reel 0. Should return a shallow copy or `ReadonlyArray<number>`. [L54-L56] |

### Suggestions

- Mark all module-level constants readonly and use `as const` + `satisfies` to catch weight-key drift at compile time.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = ["CHERRY", ...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };
  const REEL_WEIGHTS: number[][] = [...];
  // After
  const SYMBOLS = ["CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER"] as const satisfies readonly Symbol[];
  const DEFAULT_WEIGHTS = { CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10, SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5 } as const satisfies ReelWeightConfig;
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  ```
- Inject an RNG function so `spinReel` is testable and certifiable, using `src/rng.ts` instead of `Math.random()`.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  type RngFn = () => number;
  
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: RngFn): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Guard out-of-bounds `reelIndex` in `spinReel` and return a readonly copy from `getReelWeights`.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number, rng: RngFn = Math.random): readonly Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
    if (!weights) throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);
  ```
- Use `Record<Symbol, number>` for `ReelWeightConfig` so it stays in sync with the `Symbol` union automatically.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Pre-compute total weight to avoid redundant `reduce` on every draw.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
  // After
  const TOTAL_WEIGHT = weightsToArray(DEFAULT_WEIGHTS).reduce((s, w) => s + w, 0);
  
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], total: number, rng: RngFn): Symbol {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add reelIndex bounds validation in spinReel (and getReelWeights) before accessing REEL_WEIGHTS; throw a RangeError or clamp the index to [0, REEL_WEIGHTS.length-1]. [L44]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to approximately 3–5 so that combined RTP across all pay combinations reaches ~95%. At w=30, 5-DIAMOND alone across 10 paylines contributes ~97.7% of total bet, leaving no budget for any other combination. [L14]
- **[correction · high · large]** Replace Math.random() with a certifiable, auditable PRNG (e.g., a seeded cryptographic PRNG or a jurisdiction-approved RNG library). Math.random() is not acceptable for regulated gaming RNG. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
