# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 90% |
| spinReel | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 92% |
| getReelSymbols | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 75% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Non-exported constant used locally in spinReel (L47) passed to pickFromWeighted
- **Duplication [UNIQUE]**: Symbol array constant. No similar definitions found in RAG results.
- **Correction [OK]**: 8-element array order matches ReelWeightConfig fields and weightsToArray output; no issues.
- **Overengineering [LEAN]**: Simple constant array of 8 symbol strings.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported; self-explanatory name, but no comment clarifying its role as the canonical symbol registry for all reels.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Non-exported constant used in REEL_WEIGHTS initialization (L23–27) called 5 times
- **Duplication [UNIQUE]**: Configuration object for default reel weights. No similar constants in RAG results.
- **Correction [OK]**: Weights sum to 120; matches documented distribution exactly.
- **Overengineering [ACCEPTABLE]**: Structured object makes per-symbol weights readable and self-documenting. Minor complexity cost is justified by clarity.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Raw numeric weights have no explanation of their scale, how they sum, or how to interpret probability from them.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Non-exported constant used in spinReel (L44) and exported getReelWeights (L57)
- **Duplication [UNIQUE]**: 2D array of reel weights initialized via weightsToArray. No duplicates found.
- **Correction [OK]**: Five reels each initialized with DEFAULT_WEIGHTS; matches documented configuration.
- **Overengineering [OVER]**: Five identical calls to weightsToArray(DEFAULT_WEIGHTS) produce five equal arrays. A single Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or just referencing one shared array would be cleaner. More fundamentally, the per-reel array structure exists to support differentiated weights, but all reels are identical, so the structure is premature generalization.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 5-reel structure and the implicit 0-based index contract are not explained.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Non-exported function called in spinReel (L47) to randomly select reel symbols
- **Duplication [DUPLICATE]**: Weighted random selection via cumulative sum and binary search. Identical algorithm and logic to weightedPick despite variable name differences (total→totalWeight, r→roll, acc→cumulative).
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG.
- **Overengineering [LEAN]**: Standard weighted random selection — minimal, correct, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical probabilistic logic — boundary conditions (r exactly at accumulator boundary, zero-weight entries, single-item list) and the fallback return are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, but longer than 10 lines and implements a non-trivial weighted RNG algorithm. No JSDoc on parameters or the fallback-to-last-element behavior. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 is algorithmically correct: cumulative-weight selection with proper fallback at L40. The NEEDS_FIX was driven by duplication with weightedPick (rng.ts:5-16), but duplication belongs on the duplication axis, not correction. Both functions use Math.random() — that's a project-wide design choice, not a bug unique to this function. No actual incorrect behavior or crash path exists with current callers (spinReel at L47 always passes valid SYMBOLS and weights arrays).)

> **Duplicate of** `src/rng.ts:weightedPick` — 100% identical weighted selection algorithm — both compute cumulative weight sum and return item at matched index with same fallback logic

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported function imported by src/factories.ts at runtime
- **Duplication [UNIQUE]**: Generates 3-symbol column for a reel using weighted pick. No similar functions in RAG results.
- **Correction [ERROR]**: No bounds check on reelIndex; out-of-range access yields undefined weights, crashing pickFromWeighted.
- **Overengineering [LEAN]**: Straightforward: look up weights, fill 3-row column, return.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts; always returns 3 symbols per call — column length, valid symbol membership, and out-of-range reelIndex behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), return shape (3-element column), and independence of per-row picks. (deliberated: reclassified: correction: ERROR protected (confidence 92 < 95) — src/reels.ts:43-50. The missing bounds check on reelIndex is real — REEL_WEIGHTS[outOfRange] returns undefined, crashing pickFromWeighted at L31 (.reduce on undefined). However, ERROR implies actively broken code. The sole call site (src/factories.ts:12) iterates i=0..4, matching REEL_WEIGHTS' 5 entries (L22-28). No current execution path triggers the crash. This is a defensive programming gap on an exported function, warranting NEEDS_FIX (add a RangeError guard), not ERROR (no active defect in production).)

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported function imported by src/engine.ts at runtime
- **Duplication [UNIQUE]**: Trivial getter returning SYMBOLS array. No duplication found.
- **Correction [NEEDS_FIX]**: Returns a direct mutable reference to the internal SYMBOLS array; a caller mutating the returned array corrupts all subsequent spinReel and getReelSymbols calls. Return a shallow copy instead.
- **Overengineering [LEAN]**: Trivial accessor, justified by the module's public API contract.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; returns mutable reference to SYMBOLS — aliasing risk untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No description of return value order or its correspondence to getReelWeights indices.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported function imported by src/engine.ts at runtime
- **Duplication [UNIQUE]**: Trivial getter returning REEL_WEIGHTS by index. No duplication found.
- **Correction [NEEDS_FIX]**: Two independent defects: mutable return exposes internal state, and missing bounds check silently returns undefined.
- **Overengineering [LEAN]**: Trivial accessor exposing per-reel weights; matches documented API.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; out-of-range reelIndex returns undefined silently — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), return array length, and read-only semantics (no setter exists).

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` duplicates the `Symbol` union as explicit property keys. `Record<Symbol, number>` would be more maintainable and enforce key completeness automatically. [L8-L11] |
| 5 | Immutability | FAIL | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are mutable at runtime. `getReelWeights()` returns a direct reference to `REEL_WEIGHTS[reelIndex]`, allowing callers to silently mutate internal weight state. `getReelSymbols()` has the same problem. The reference docs explicitly state "Weights are read-only at runtime." [L3-L25] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. `spinReel` in particular has a non-obvious contract (expects `reelIndex` in 0–4). [L42-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel` and `getReelWeights` do no bounds-checking on `reelIndex`. An out-of-range index (e.g. 5 or -1) returns `undefined` for `weights`, which silently crashes inside `pickFromWeighted` when `.reduce` is called on `undefined`. |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/payline/jackpot/scatter/wild vocabulary throughout the project. `Math.random()` (V8 xorshift128+) is not cryptographically secure and is not certifiable under any regulated gaming standard (e.g. GLI-11, BMM, iTech). The project already contains `src/rng.ts`, which is the canonical RNG abstraction — `pickFromWeighted` bypasses it entirely and calls `Math.random()` directly. This is a compliance-level failure for a slot engine. [L32] |
| 15 | Testability | FAIL | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point, making deterministic unit tests impossible without global mocking. `src/rng.ts` exists in the project but is not used here. Passing an RNG function as a parameter would decouple the randomness source. [L30-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS` uses an explicit type annotation but could use `satisfies ReelWeightConfig` to preserve the literal type while still enforcing structural compatibility. `REEL_WEIGHTS` could similarly benefit from `as const satisfies` for compile-time read-only guarantees. [L13-L16] |
| 17 | Context-adapted rules (slot engine) | WARN | MEDIUM | `getReelWeights` returns a live mutable reference to the internal weight array. In a slot engine, silent external mutation of reel weights is a game-integrity risk — a caller can do `getReelWeights(0)[6] = 999` to skew WILD probability without going through any controlled setter. Should return a frozen copy or type as `readonly number[]`. [L55-L57] |

### Suggestions

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to avoid manually mirroring the union.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark all module-level constants as deeply readonly and return readonly views from exported getters.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
  const REEL_WEIGHTS: number[][] = [...];
  export function getReelWeights(reelIndex: number): number[] { return REEL_WEIGHTS[reelIndex]; }
  // After
  const SYMBOLS: readonly Symbol[] = Object.freeze([...]);
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = Object.freeze({...});
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = Object.freeze([...]);
  export function getReelWeights(reelIndex: number): readonly number[] { return REEL_WEIGHTS[reelIndex]; }
  ```
- Inject RNG from `src/rng.ts` instead of calling `Math.random()` directly, enabling deterministic tests and compliance with regulated-gaming RNG requirements.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
    const r = rng() * total;
  ```
- Add bounds guard in `spinReel` and `getReelWeights` to prevent silent undefined crashes on out-of-range reelIndex.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Add JSDoc to all three exported functions, including the valid reelIndex range.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spins a single reel and returns 3 symbols.
   * @param reelIndex - Reel column index in [0, 4].
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Return a copy in getReelWeights to prevent external mutation of internal reel state; add the same bounds guard. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a certifiable CSPRNG (e.g., Web Crypto getRandomValues) required for regulated gaming. [L32]
- **[correction · high · large]** Add bounds check in spinReel: throw RangeError if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length. [L44]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Return a copy in getReelSymbols to prevent callers from corrupting the internal SYMBOLS array. [L53]
- **[overengineering · medium · small]** Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
