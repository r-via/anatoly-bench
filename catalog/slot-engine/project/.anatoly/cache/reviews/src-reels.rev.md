# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | OVER | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | NEEDS_FIX | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used at line 47 in pickFromWeighted call within spinReel
- **Duplication [UNIQUE]**: No similar symbol arrays found in semantic search
- **Correction [OK]**: Eight symbols declared; order matches weightsToArray and DEFAULT_WEIGHTS.
- **Overengineering [LEAN]**: Simple typed array of the 8 game symbols. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Array contents (order and membership) are never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master list of reel symbols) is not obvious from the name alone.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type annotation for DEFAULT_WEIGHTS (line 12) and weightsToArray parameter (line 17)
- **Duplication [UNIQUE]**: No similar type definitions found in semantic search
- **Correction [OK]**: All eight symbol fields present; structurally consistent with SYMBOLS array.
- **Overengineering [OVER]**: Named interface mirroring SYMBOLS exactly, creating a parallel structure that must be kept in sync. Its sole consumer (DEFAULT_WEIGHTS) is immediately passed to weightsToArray which discards the named access and returns number[]. A plain number[] with a comment, or Record<Symbol, number>, achieves the same readability without the indirection layer.
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface: field names map 1-to-1 with Symbol values and their type (number weight) is unambiguous.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times in REEL_WEIGHTS initialization (lines 23-27)
- **Duplication [UNIQUE]**: No similar weight configuration found in semantic search
- **Correction [OK]**: Sum = 25+25+15+10+5+30+5+5 = 120; matches documented total in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Overengineering [LEAN]**: Straightforward config constant. Readability is good; the named fields are its only value.
- **Tests [NONE]**: No test file exists. Weight values are never asserted, though they directly affect payout distribution.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing context: what unit the weights are in, that they sum to 120, or that all five reels share this config.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to populate REEL_WEIGHTS array (lines 23-27)
- **Duplication [UNIQUE]**: No similar functions found in semantic search
- **Correction [OK]**: Emits weights in the same order as SYMBOLS; no correctness issues.
- **Overengineering [OVER]**: Exists solely to convert ReelWeightConfig back to number[]. It is an artifact of the ReelWeightConfig design decision: if weights were stored directly as number[], this function is unnecessary. The entire roundtrip (named object → array) adds a layer with no runtime benefit.
- **Tests [NONE]**: No test file exists. Output order relative to SYMBOLS array is untested; a mismatch would silently corrupt all probability calculations.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper but its ordering contract (must match SYMBOLS order) is a non-obvious invariant worth documenting.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed at line 44 in spinReel function to retrieve weights by reelIndex
- **Duplication [UNIQUE]**: No similar weight matrices found in semantic search
- **Correction [OK]**: Five reels each initialized with DEFAULT_WEIGHTS; consistent with documentation.
- **Overengineering [OVER]**: Five identical arrays allocated by calling weightsToArray(DEFAULT_WEIGHTS) five times. Per .anatoly/docs/04-API-Reference/02-Configuration-Schema.md and .anatoly/docs/01-Getting-Started/03-Configuration.md, all five reels share the same weight distribution. A single shared array (or Array(5).fill(…)) would be semantically accurate; the current structure implies per-reel weight customization that is neither used nor documented.
- **Tests [NONE]**: No test file exists. Shape (5 reels × 8 weights) and correct delegation to weightsToArray are never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The fact that all five reels share identical weights is a significant design decision not conveyed by the name.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called at line 47 within spinReel to select symbols with weighted probabilities
- **Duplication [DUPLICATE]**: Identical weighted random selection algorithm as weightedPick in src/rng.ts (RAG score 0.826). Both compute weight sum, generate random roll, accumulate weights in loop, return matching item with identical fallback logic.
- **Correction [NEEDS_FIX]**: Uses Math.random(), which is not a certifiable PRNG for regulated casino/slot-machine gaming.
- **Overengineering [LEAN]**: Standard O(n) weighted random selection. Clean, generic, does one thing.
- **Tests [NONE]**: No test file exists. Critical probability logic (boundary at r==acc, zero-weight items, single-item list, total-weight edge) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: description of the weighted-random algorithm, parameter semantics (items and wts must be same length), and return behavior when weights sum to zero.

> **Duplicate of** `src/rng.ts:weightedPick` — 92% identical algorithm — weighted random selection via accumulation loop, matching logic flow and behavior

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported and runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found in semantic search
- **Correction [ERROR]**: No bounds check on reelIndex; out-of-range index yields undefined weights, crashing inside pickFromWeighted at wts.reduce.
- **Overengineering [LEAN]**: Simple loop calling pickFromWeighted three times. Minimal and correct.
- **Tests [NONE]**: No test file exists. Used by src/factories.ts; return shape (3-element Symbol array), valid reelIndex bounds, and out-of-range index behavior are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing: what reelIndex valid range is (0–4), that it returns exactly 3 symbols (one per row), and that results are independent per call.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter — no similar functions found
- **Correction [OK]**: Returns the SYMBOLS array reference; no correctness bug in context of evaluation.
- **Overengineering [LEAN]**: Trivial accessor. No abstraction overhead.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts; return value identity and immutability are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing: clarification that it returns the shared master symbol list and whether the array is mutable.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter — no similar functions found
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; returns undefined for out-of-range indices despite number[] return type, creating a silent type lie for callers.
- **Overengineering [LEAN]**: Trivial accessor returning the precomputed weight array for a reel index.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts; correct indexing and out-of-bounds behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing: valid range of reelIndex, that returned array is a direct reference (mutable), and weight semantics.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually duplicates all 8 symbol names. `Record<Symbol, number>` is more idiomatic and keeps the key set automatically in sync with the `Symbol` union. [L8-L12] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are module-level constants but typed as mutable arrays/objects. Callers (or `getReelWeights`) can mutate internal state through returned references. [L3-L26] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. `spinReel` in particular has a non-obvious contract (reelIndex 0–4, returns 3-element column). [L44-L58] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/casino domain confirmed by reel/payline/jackpot/WILD/SCATTER/freespin vocabulary and dedicated `src/rng.ts` module (`.anatoly/docs/01-Getting-Started/03-Configuration.md`). `Math.random()` is a non-cryptographic, non-certifiable PRNG and is not acceptable for regulated gaming RNG. The project already ships `src/rng.ts` — `pickFromWeighted` must delegate to that module, not call `Math.random()` directly. [L34] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` is a pure function over its declared parameters, but `Math.random()` is hardcoded inside it, making deterministic unit testing impossible without monkey-patching globals. Injecting an RNG function parameter would decouple it. [L30-L42] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SYMBOLS` should use `as const` to narrow to a tuple of literals. `DEFAULT_WEIGHTS` should use `satisfies ReelWeightConfig` to retain literal types while still validating shape. [L3-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | `getReelWeights` returns a direct mutable reference to the internal `REEL_WEIGHTS[reelIndex]` array, allowing callers to silently corrupt reel configuration. Should return a copy or `readonly number[]`. Additionally, `spinReel` performs no bounds check on `reelIndex` (valid range 0–4); an out-of-range index yields `undefined` weights, causing a runtime crash in `pickFromWeighted`. [L55-L57] |

### Suggestions

- Replace `Math.random()` with the project's own RNG module to satisfy regulated gaming compliance.
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { nextFloat } from './rng.js';
  const r = nextFloat() * total;
  ```
- Use `Record<Symbol, number>` to avoid manually mirroring the Symbol union in ReelWeightConfig.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants as deeply readonly and use `as const` / `satisfies` for stronger types.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = ["CHERRY", ...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };
  const REEL_WEIGHTS: number[][] = [...];
  // After
  const SYMBOLS = ["CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER"] as const satisfies readonly Symbol[];
  const DEFAULT_WEIGHTS = { CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10, SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5 } as const satisfies ReelWeightConfig;
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
  ```
- Inject RNG as a parameter to make `pickFromWeighted` purely deterministic for testing.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
    const r = rng() * total;
  ```
- Return a copy from `getReelWeights` to prevent external mutation of internal state.
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    return [...REEL_WEIGHTS[reelIndex]];
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a bounds check in getReelWeights or change the return type to number[] | undefined so callers are not silently handed undefined typed as number[]. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a certifiable, auditable RNG suitable for regulated slot-machine play (e.g., a CSPRNG or a certified gaming-grade PRNG). [L32]
- **[correction · high · large]** Add a bounds check in spinReel: validate reelIndex is in [0, REEL_WEIGHTS.length - 1] and throw a RangeError (or return a typed error) before accessing REEL_WEIGHTS[reelIndex]. [L44]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
