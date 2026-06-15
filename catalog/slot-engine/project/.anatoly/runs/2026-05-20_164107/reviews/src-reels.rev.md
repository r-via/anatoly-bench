# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 82% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Non-exported internal symbol, referenced at line 37 in pickFromWeighted call within spinReel
- **Duplication [UNIQUE]**: Constant array of symbol names, no semantic duplicates found
- **Correction [OK]**: Eight symbols in correct order matching ReelWeightConfig and weightsToArray.
- **Overengineering [LEAN]**: Simple constant array of 8 symbol names.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported; self-descriptive name and content make purpose clear, but no comment explains the ordering significance or that this array is the canonical symbol registry.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Non-exported constant used in REEL_WEIGHTS initialization (lines 23-28, called 5 times)
- **Duplication [UNIQUE]**: Constant weight configuration object, no semantic duplicates found
- **Correction [OK]**: Sum = 120; values match documented distribution exactly.
- **Overengineering [ACCEPTABLE]**: Object literal is slightly verbose due to ReelWeightConfig, but readable as a named weight map. Complexity is mild and justified by legibility.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported. Name implies purpose, but no comment explains the weight sum (120), probability implications, or that all five reels share this distribution.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Non-exported constant accessed in spinReel (line 44) and getReelWeights (line 57)
- **Duplication [UNIQUE]**: Constant array initialization, no duplicates found
- **Correction [OK]**: Five reels, each initialised with weightsToArray(DEFAULT_WEIGHTS); matches documented configuration.
- **Overengineering [OVER]**: Five identical weightsToArray(DEFAULT_WEIGHTS) calls. Since all reels share the same weights, Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or a single shared array would be cleaner and make the identity explicit. The repetition obscures intent.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported. No comment explains that all five reels are intentionally identical or that this array is indexed by reel number (0–4).

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Non-exported utility function called in spinReel (line 37)
- **Duplication [DUPLICATE]**: Identical weighted selection algorithm to weightedPick — both accumulate weights and return item at matching random position
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG for regulated gambling software.
- **Overengineering [LEAN]**: Standard weighted random selection — minimal, correct, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. This is the most critical untested symbol: weighted random selection with boundary behavior (r < acc edge, fallback return) and Math.random dependency are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper with non-trivial weighted-random algorithm. Name conveys intent, but no JSDoc on parameters, return value, or edge-case behavior (fallback to last item on floating-point rounding). (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified reels.ts:30-41 — the function is algorithmically correct. It performs cumulative-weight selection identically to weightedPick (rng.ts:5-16), but duplication is not a correctness defect. pickFromWeighted is actively used at reels.ts:47 via spinReel → factories.ts:12 → engine.ts:128. No bug, no crash, no data loss. The NEEDS_FIX classification conflates the duplication axis with the correction axis. Both implementations produce identical results; replacing one with the other would cause zero behavioral change.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both compute weight total, generate random roll, accumulate weights, return matching item or fallback to last

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported function runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [NEEDS_FIX]**: Out-of-range reelIndex produces undefined weights, causing a TypeError crash inside pickFromWeighted.
- **Overengineering [LEAN]**: Straightforward: look up weights, draw 3 symbols, return column.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts, making this a critical untested export path.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: what reelIndex range is valid (0–4), that it returns 3 symbols (one per row), and that each cell is drawn independently.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported function runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function, no duplicates found
- **Correction [OK]**: Returns the live SYMBOLS array; callers could mutate it, but docs make no read-only promise for symbols and mutation risk is low given string-literal contents.
- **Overengineering [LEAN]**: Trivial accessor, appropriate for encapsulation.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of return value (canonical ordered symbol list used for weight indexing).

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported function runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function, no duplicates found
- **Correction [NEEDS_FIX]**: Returns a mutable reference to the internal weight array, violating the documented 'read-only at runtime' invariant; callers can silently corrupt all subsequent spins.
- **Overengineering [LEAN]**: Trivial accessor matching documented API contract.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex behavior (undefined return) is also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that returned array corresponds index-for-index to getReelSymbols(), and that it is read-only at runtime.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates all 8 symbol keys. `Record<Symbol, number>` (using the imported `Symbol` union) is DRY and auto-syncs with the type union. [L7-L10] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS` and `REEL_WEIGHTS` are mutable (`Symbol[]` / `number[][]`). `DEFAULT_WEIGHTS` is not `Readonly<ReelWeightConfig>`. `getReelSymbols` and `getReelWeights` return live mutable references, allowing callers to mutate module-level state. [L3, L12, L22, L52, L56] |
| 8 | ESLint compliance | WARN | HIGH | Single-character variable `r` at L32 violates `id-length`. Minor but flagged by standard ESLint configurations. [L32] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. `spinReel` in particular has a non-obvious side-effect: silent fallback to last symbol when `reelIndex` is out of bounds. [L43, L52, L56] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel(reelIndex)` and `getReelWeights(reelIndex)` perform no bounds check. `REEL_WEIGHTS[reelIndex]` is `undefined` for any index outside 0–4; passing `undefined` as `wts` to `pickFromWeighted` causes `wts.reduce` to throw a `TypeError` at runtime. [L43-L44, L56-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/payline/jackpot vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER symbols; `spinReel`; paytable/freespin/jackpot sibling files). `Math.random()` at L32 is a non-cryptographic PRNG seeded by the JS engine — it is not certifiable for regulated gaming RNG under GLI-11, BMM, or equivalent standards. Any jurisdiction requiring certified RNG mandates a CSPRNG (e.g. `crypto.getRandomValues`). [L32] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no RNG injection point. Deterministic testing requires monkey-patching `Math.random`, which is fragile. An injectable `rng: () => number` parameter (defaulting to `Math.random`) would make unit tests reliable. [L30, L32] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS satisfies ReelWeightConfig` would catch shape errors while preserving the literal type. `SYMBOLS` could use `as const` to narrow to a readonly tuple of string literals. [L3, L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | Regulated gambling context: beyond the CSPRNG issue (rule 13), `getReelWeights` exposes a mutable reference to the internal weight array. Reference docs state weights are read-only at runtime with no setter, but callers can silently mutate `REEL_WEIGHTS` through the returned array. Return `ReadonlyArray<number>` or a copy. [L56-L58] |

### Suggestions

- Replace Math.random() with an injectable CSPRNG for certified gaming RNG compliance
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(
    items: Symbol[],
    wts: number[],
    rng: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 0x1_0000_0000
  ): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Use Record<Symbol, number> and as const to eliminate manual enumeration and improve immutability
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } as const satisfies Record<Symbol, number>;
  ```
- Return ReadonlyArray to enforce the documented read-only-at-runtime contract
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Add bounds guard to spinReel to prevent silent TypeError on invalid reelIndex
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a bounds check in spinReel: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw a RangeError with a descriptive message instead of propagating a cryptic TypeError. [L44]
- **[correction · medium · small]** Return a shallow copy in getReelWeights (return [...REEL_WEIGHTS[reelIndex]]) to enforce the documented read-only contract and prevent external mutation of internal state. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() with a certifiable RNG (e.g. a seeded CSRNG from the Web Crypto API or a GLI-approved library) to meet regulated gaming requirements. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
