# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 88% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | NEEDS_FIX | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | OK | LEAN | LOW_VALUE | UNIQUE | NONE | 85% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | LOW_VALUE | UNIQUE | NONE | 85% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Internal constant used by getReelSymbols (L53) and pickFromWeighted (L47); core symbol definitions
- **Duplication [UNIQUE]**: Constant array of symbol strings with no similar definitions found
- **Correction [OK]**: Array of 8 symbols matches all fields in ReelWeightConfig and the order used in weightsToArray.
- **Overengineering [LEAN]**: Simple constant array of all symbol names. No abstraction needed beyond this.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master symbol list used for reel picks) is not obvious from declaration alone.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Used 5 times initializing REEL_WEIGHTS (L23–L27); primary weight configuration
- **Duplication [UNIQUE]**: Configuration object defining default reel weights with no similar constants
- **Correction [OK]**: Weight values are structurally valid. RTP impact cannot be verified without the paytable, so no numerical finding is emitted per Rule 13 (forward derivation requires paytable constants not present in this file).
- **Overengineering [LEAN]**: Simple object literal; complexity belongs to ReelWeightConfig, not the value itself.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The weight values (e.g. DIAMOND: 30 vs SEVEN: 5) encode payout probability design decisions that warrant documentation.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Used by spinReel (L44) and getReelWeights (L57); stores weighted symbol distributions per reel
- **Duplication [UNIQUE]**: Constant array of weight arrays initialized from default configuration
- **Correction [OK]**: Five reels, each initialised with DEFAULT_WEIGHTS via weightsToArray. Structurally correct.
- **Overengineering [ACCEPTABLE]**: All 5 reels currently share identical weights, but storing per-reel weight arrays is a natural slot-machine design that costs little and enables per-reel tuning for RTP adjustments (README targets 95% RTP). Slight redundancy is justified.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 5-reel structure and the fact that all reels share DEFAULT_WEIGHTS (uniform distribution) is not explained.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called by spinReel (L47); implements weighted random selection core logic
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm to weightedPick in src/rng.ts — same reduce-accumulate-iterate pattern with matching logic
- **Correction [NEEDS_FIX]**: Weighted-selection logic is correct, but Math.random() is a non-certifiable PRNG for regulated gaming RNG.
- **Overengineering [LEAN]**: Standard O(n) weighted-random pick; minimal and correct for 8-symbol reels.
- **Tests [NONE]**: No test file exists; weighted-selection logic has edge cases (boundary r==total, single item, zero-weight entries) that are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Core weighted-random-selection algorithm; missing @param descriptions, @returns, and a note on the fallback to last item when floating-point rounding causes r >= total.

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both reduce weights, multiply Math.random by total, iterate accumulating weights until threshold crossed, fallback to last item

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported, runtime-imported by src/factories.ts per pre-computed data
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; an out-of-range value yields undefined weights, causing a TypeError in pickFromWeighted.
- **Overengineering [LEAN]**: Straightforward: index into REEL_WEIGHTS, fill 3 rows. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists; imported by src/factories.ts making it a critical code path with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing @param reelIndex (valid range 0–4), @returns (3-symbol column array), and behavior on out-of-range index.

#### `getReelSymbols` (L52–L54)

- **Utility [LOW_VALUE]**: Trivial identity getter returning SYMBOLS; runtime-imported by src/engine.ts but provides no logic
- **Duplication [UNIQUE]**: Trivial getter function with no duplicates
- **Correction [OK]**: Returns the internal SYMBOLS reference; no correctness bug (mutation by callers is a separate concern outside this axis).
- **Overengineering [LEAN]**: Single-line accessor exposing SYMBOLS for external consumers.
- **Tests [NONE]**: No test file exists; imported by src/engine.ts with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing @returns description and note that the returned array is the live internal reference.

#### `getReelWeights` (L56–L58)

- **Utility [LOW_VALUE]**: Trivial accessor returning array element; runtime-imported by src/engine.ts but adds no value
- **Duplication [UNIQUE]**: Trivial getter function with no duplicates
- **Correction [NEEDS_FIX]**: No bounds check; out-of-range reelIndex silently returns undefined despite the declared return type number[], propagating a type lie to callers.
- **Overengineering [LEAN]**: Single-line accessor; appropriate for exposing per-reel weight configuration.
- **Tests [NONE]**: No test file exists; imported by src/engine.ts with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing @param reelIndex, @returns, and note that the returned array is a live reference to the internal weight table.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates all 8 symbol fields, duplicating the `Symbol` union. `Record<Symbol, number>` would derive the shape from the union automatically and stay in sync if symbols are added. [L8-L12] |
| 5 | Immutability | FAIL | MEDIUM | `SYMBOLS` is a mutable `Symbol[]` (should be `readonly Symbol[]` or use `as const`). `DEFAULT_WEIGHTS` and `REEL_WEIGHTS` are also mutable. `getReelWeights()` returns a live mutable reference to an internal weight row, allowing callers to silently corrupt the RTP configuration. [L3-L25] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. `spinReel` in particular has a non-obvious contract: it returns a 3-element column, and out-of-range `reelIndex` silently produces `undefined` weights. [L42-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel(reelIndex)` and `getReelWeights(reelIndex)` perform no bounds check. `REEL_WEIGHTS[reelIndex]` returns `undefined` for any `reelIndex >= 5` or negative, causing `wts.reduce(...)` to throw at runtime. A guard (`if (reelIndex < 0 \|\| reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...)`) is missing. [L42-L50] |
| 13 | Security | FAIL | CRITICAL | Casino/slot-machine domain inferred from reel/symbol vocabulary (CHERRY, BAR, SEVEN, SCATTER, WILD), jackpot.ts, paytable.ts, freespin.ts, and the README's explicit 95% RTP target. `Math.random()` is a non-certifiable PRNG for regulated gambling: it is neither seeded with auditable entropy nor reproducible for game-audit replay. The project already contains `src/rng.ts`, which is ignored here. All spin outcomes must route through the certified RNG module. [L30-L39] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` and `spinReel` embed `Math.random()` directly with no injection point. Deterministic unit tests require mocking the global, which is fragile. Accepting an RNG function parameter (or using `src/rng.ts` via DI) would make outcomes reproducible in tests. [L29-L44] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS` is typed via annotation. Using `satisfies ReelWeightConfig` would preserve the literal types while still enforcing the shape. No use of `const` type parameters or `using`. [L14-L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | `getReelWeights()` returns a live mutable `number[]` reference. In a slot engine where per-reel weights directly determine RTP, external mutation of this array (intentional or accidental) corrupts the configured house edge with no safeguard. Return type should be `readonly number[]` and the returned value should be a copy or frozen reference. |

### Suggestions

- Replace Math.random() with the project's rng.ts module and inject it for testability
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Use Record<Symbol, number> to derive ReelWeightConfig from the Symbol union automatically
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark SYMBOLS and REEL_WEIGHTS as readonly to prevent accidental mutation
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [ ... ];
  const REEL_WEIGHTS: number[][] = [ ... ];
  // After
  const SYMBOLS: readonly Symbol[] = [ ... ] as const;
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];
  ```
- Return a readonly copy from getReelWeights to prevent external corruption of weight tables
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length)
      throw new RangeError(`reelIndex ${reelIndex} out of range`);
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Use satisfies for DEFAULT_WEIGHTS to preserve literal types while enforcing the config shape
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, ...}
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, ...} satisfies ReelWeightConfig;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a bounds check in spinReel: throw RangeError (or return early) when reelIndex is outside [0, REEL_WEIGHTS.length - 1] to prevent undefined being passed to pickFromWeighted. [L44]
- **[correction · medium · small]** Add a bounds check in getReelWeights: throw RangeError when reelIndex is out of range instead of silently returning undefined as number[]. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a certified/cryptographically-secure RNG (e.g. crypto.getRandomValues) suitable for regulated gaming. [L33]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- **[utility · low · trivial]** Consider removing low-value code: `getReelSymbols` (`getReelSymbols`) [L52-L54]
- **[utility · low · trivial]** Consider removing low-value code: `getReelWeights` (`getReelWeights`) [L56-L58]
