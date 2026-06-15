# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 87% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used in pickFromWeighted call at line 35
- **Duplication [UNIQUE]**: Constant array with no similar definitions found
- **Correction [OK]**: Array of 8 symbols; order matches weightsToArray and is consistent throughout the file.
- **Overengineering [LEAN]**: Plain constant array; nothing extraneous.
- **Tests [NONE]**: No test file exists. Constant defines the full symbol universe used by spinReel and getReelSymbols.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master symbol list used for reel picks) is not stated.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Used in REEL_WEIGHTS initialization (5 calls)
- **Duplication [UNIQUE]**: Configuration constant with no similar definitions found
- **Correction [OK]**: Weights sum to 120; RTP cannot be verified without the paytable constants (not in scope), so no derivable contradiction with the 95% target.
- **Overengineering [LEAN]**: Straightforward object literal; complexity is in the interface, not the constant.
- **Tests [NONE]**: No test file exists. Weight values directly influence RTP/payout math; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Does not explain that weights are relative (not percentages), nor why specific values were chosen (e.g. SEVEN/WILD/SCATTER rarity).

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Used in spinReel (L44) and getReelWeights (L57)
- **Duplication [UNIQUE]**: Array initialization constant with no similar definitions found
- **Correction [OK]**: weightsToArray is called five times, producing five independent 8-element arrays — no shared-reference aliasing issue.
- **Overengineering [ACCEPTABLE]**: Five identical weightsToArray calls are redundant today, but the per-reel array structure anticipates per-reel weight tuning, which is a normal slot-machine design concern. Minor; not flagged OVER.
- **Tests [NONE]**: No test file exists. Per-reel weight tables drive all spin outcomes.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Does not state that index corresponds to reel column, that all 5 reels share identical weights, or that this is the authoritative per-reel config.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel at line 37
- **Duplication [DUPLICATE]**: Identical weighted random selection logic: reduce weights to total, generate random value, accumulate until threshold, return item
- **Correction [OK]**: Excluded per project instructions (overturned false positive: algorithm is correct; Math.random() concern is compliance, not algorithmic correctness).
- **Overengineering [LEAN]**: Standard weighted-random selection. Generic parameters are warranted; implementation is minimal and correct.
- **Tests [NONE]**: No test file exists. Core sampling logic has edge cases: zero-weight items, r exactly at boundary, single-item list, weights summing to 0.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Algorithm (weighted random selection), assumption that wts.length === items.length, and the fallback on the last element are undocumented.

> **Duplicate of** `src/rng.ts:weightedPick` — 100% identical algorithm with different variable names and type specificity

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Excluded per project instructions (overturned false positive: bounds check omission has no active crash path given current callers).
- **Overengineering [LEAN]**: Three lines of straightforward logic; no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Called by src/factories.ts; out-of-bounds reelIndex would cause undefined weights passed to pickFromWeighted.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: @param reelIndex (valid range 0–4), @returns (3-symbol column array), behavior on out-of-range index.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function returning constant
- **Correction [OK]**: Returns direct reference to internal SYMBOLS array; no evidence of external mutation in the provided context.
- **Overengineering [LEAN]**: Thin encapsulation accessor; appropriate to avoid leaking the mutable module-level array.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts; returns mutable reference to SYMBOLS array.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Does not clarify that the returned array is the shared mutable reference to SYMBOLS.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function returning indexed array
- **Correction [OK]**: Returns direct reference to REEL_WEIGHTS[reelIndex]; same bounds-check caveat as spinReel (overturned); no evidence of callers mutating the returned array in the provided context.
- **Overengineering [LEAN]**: Same rationale as getReelSymbols; exposes read access without leaking internals.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts; returns mutable reference to inner REEL_WEIGHTS row, allowing external mutation.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: @param reelIndex valid range, @returns (direct reference to internal array — mutation risk), behavior on invalid index.

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates every Symbol key. Record<Symbol, number> would enforce exhaustiveness automatically when the Symbol union grows. [L9-L13] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS lack readonly / as const annotations. getReelWeights() returns the raw mutable inner array from REEL_WEIGHTS, allowing callers to silently alter game odds in place. [L3-L26] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights have no JSDoc. spinReel's valid reelIndex range (0–4) and return semantics are undocumented for consumers. [L43-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async code. spinReel and getReelWeights perform no bounds check on reelIndex; an out-of-range index yields undefined from REEL_WEIGHTS, causing a runtime throw inside pickFromWeighted's reduce call. [L43-L50] |
| 13 | Security | FAIL | CRITICAL | Gambling/casino domain confirmed by CHERRY/LEMON/BELL/BAR/SEVEN/WILD/SCATTER symbols plus jackpot.ts, freespin.ts, paytable.ts, rng.ts in the project. Math.random() is a non-cryptographic Xorshift-based PRNG; it is not certifiable under GLI-11/BMM/eCOGRA regulated-gaming RNG standards. The project already contains rng.ts, indicating an approved RNG abstraction exists and must be used here instead of Math.random(). [L33-L42] |
| 15 | Testability | FAIL | MEDIUM | pickFromWeighted and spinReel hardcode Math.random() with no injection point. Deterministic unit tests require global mocking. rng.ts signals the project provides a replaceable RNG; passing it as a parameter would make pickFromWeighted a pure function and eliminate the mocking requirement. [L30-L50] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use satisfies ReelWeightConfig for better literal-type preservation. SYMBOLS could be declared as const for Symbol literal inference. [L3-L16] |
| 17 | Context-adapted rules | FAIL | MEDIUM | getReelWeights() returns a direct reference to the internal REEL_WEIGHTS[reelIndex] mutable array. In casino/gambling software, external mutation of odds arrays is a game-integrity violation. Must return a copy or ReadonlyArray<number>. [L55-L57] |

### Suggestions

- Replace ReelWeightConfig with Record<Symbol, number> for automatic exhaustiveness enforcement.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants as readonly to prevent accidental mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  const DEFAULT_WEIGHTS = { CHERRY: 25, ... } as const satisfies ReelWeightConfig;
  const REEL_WEIGHTS: readonly (readonly number[])[] = [...]
  ```
- Inject RNG from rng.ts to eliminate Math.random() and enable pure-function testing.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(
    items: readonly Symbol[],
    wts: readonly number[],
    rng: () => number,
  ): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Return readonly array from getReelWeights to prevent external mutation of live odds.
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Add bounds guard to spinReel and getReelWeights to prevent silent undefined crashes.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length})`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```

## Actions

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
