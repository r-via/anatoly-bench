# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | ACCEPTABLE | USED | UNIQUE | GOOD | 85% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls (L48, L53) and returned by getReelSymbols (L53).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Array contains exactly 8 symbols matching ReelWeightConfig keys and documentation.
- **Overengineering [LEAN]**: Simple typed array of the eight symbol identifiers. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Array content and ordering are untested despite being critical to weighted selection alignment.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported module constant with no description of purpose or intended use.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as parameter type in weightsToArray (L17) and as type annotation for DEFAULT_WEIGHTS (L12).
- **Duplication [UNIQUE]**: No similar type definitions found in RAG results.
- **Correction [OK]**: Interface keys match SYMBOLS array order and DEFAULT_WEIGHTS definition.
- **Overengineering [ACCEPTABLE]**: Named fields per symbol are more readable than a raw number[] when a human edits weights. Single-use interface, but the readability and exhaustiveness guarantee justify it.
- **Tests [GOOD]**: Interface with no runtime behavior; no tests needed.
- **DOCUMENTED [DOCUMENTED]**: Non-exported interface with self-descriptive name and self-explanatory fields (symbol names mapped to numeric weights). No complex semantics requiring additional explanation.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Weights sum to 120 (25+25+15+10+5+30+5+5), matching the documented total in both reference docs.
- **Overengineering [LEAN]**: Plain object literal mapping each symbol to its weight. Minimal and clear.
- **Tests [NONE]**: No test file. Default weight values (sum, individual entries) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No description of what these defaults represent, their sum (120), or how they affect probability distribution.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to populate REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Emission order matches SYMBOLS array order; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file. Ordering of returned array relative to SYMBOLS array is untested — a mismatch would silently corrupt probability distribution.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported internal helper under 10 lines with a clear name. Tolerated per internal-helper leniency rule, but no JSDoc present.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Five reels all correctly initialized from DEFAULT_WEIGHTS via weightsToArray.
- **Overengineering [ACCEPTABLE]**: Five identical weight arrays. Redundant today (docs confirm all reels share the same distribution), but the per-index structure is justified by the exported getReelWeights(reelIndex) API, which implies per-reel override is a supported use case.
- **Tests [NONE]**: No test file. Shape (5 reels, 8 weights each) and values are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No description of the 5-reel structure, index mapping, or that all reels currently share DEFAULT_WEIGHTS.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel loop (L48) to select each symbol.
- **Duplication [DUPLICATE]**: Logic is ~95% identical to weightedPick in src/rng.ts: both sum weights, draw Math.random()*total, accumulate in a loop, and return items[items.length-1] as fallback. Only differences are variable names and that pickFromWeighted pins the type to Symbol[] while weightedPick is generic <T>. The functions are interchangeable for any Symbol[] call site.
- **Correction [NEEDS_FIX]**: Uses Math.random() — not certifiable for regulated gaming RNG (slot-machine domain inferred from reel/paytable/jackpot/SCATTER/WILD vocabulary and RTP target). The weighted-selection logic itself is mathematically correct; the fallback on L40 is unreachable but harmless.
- **Overengineering [LEAN]**: Textbook weighted-random selection. Correct single-pass algorithm, no unnecessary abstraction.
- **Tests [NONE]**: No test file. Core probability logic is entirely untested: boundary conditions (r == 0, r just below total), uniform weights, single-item list, and the fallback return on the last item are all uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported but non-trivial (weighted random sampling algorithm). No JSDoc explaining the algorithm, the contract that wts.length must equal items.length, or the fallback return on floating-point edge cases. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. Compared reels.ts:30-41 with rng.ts:5-16 line-by-line: both implement identical cumulative-weight sampling (sum weights, draw Math.random()*total, walk accumulating weights, return on first r < acc, fallback to last item). The duplication is factual — only differences are variable names and generic vs concrete type parameter. However, duplication is a maintenance concern belonging to the duplication axis, not a correctness defect. pickFromWeighted is algorithmically correct and correctly called at reels.ts:47 inside spinReel. No behavioral bug exists.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — same weighted-random algorithm, same fallback; pickFromWeighted is a non-generic, Symbol-typed copy of the generic weightedPick

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Loop logic and weight lookup are correct; RNG delegated to pickFromWeighted.
- **Overengineering [LEAN]**: Straightforward loop that fills a 3-row column using pickFromWeighted. Does exactly one thing.
- **Tests [NONE]**: No test file. Called by src/factories.ts; return shape (array of 3 Symbols), valid symbol membership, and out-of-range reelIndex behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), explanation that it returns 3 symbols (one column), and that each cell is sampled independently.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found in RAG results.
- **Correction [OK]**: Returns SYMBOLS reference; mutation risk is a Utility/style concern, not a correction defect per precision guard 1.
- **Overengineering [LEAN]**: Minimal accessor exposing the module-level SYMBOLS array.
- **Tests [NONE]**: No test file. Used by src/engine.ts; returned reference equality (mutability hazard) and array contents are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc. No description of return value ordering or whether the array is a copy or a live reference.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found in RAG results.
- **Correction [OK]**: Returns REEL_WEIGHTS[reelIndex] reference; out-of-range input would yield undefined but no concrete caller is shown passing an invalid index (precision guard 1).
- **Overengineering [LEAN]**: Minimal accessor exposing per-reel weight arrays.
- **Tests [NONE]**: No test file. Used by src/engine.ts; out-of-range reelIndex (returns undefined) and returned array mutability are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), explanation that the returned array maps 1-to-1 with getReelSymbols(), and whether mutations to the result affect internal state.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually mirrors the Symbol union. Record<Symbol, number> would be concise and auto-track Symbol additions. [L7-L11] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are mutable. getReelWeights returns number[] — callers can silently mutate the internal REEL_WEIGHTS array. Documentation explicitly states weights are read-only at runtime. [L3-L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. At minimum, spinReel should document the valid reelIndex range (0–4). [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights perform no bounds check on reelIndex (valid: 0–4). An out-of-bounds value yields undefined from REEL_WEIGHTS, causing an uncaught TypeError in .reduce() or .push() at runtime. [L43-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by symbol vocabulary (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER), paytable, free-spin, and jackpot references throughout the project. Math.random() is a non-cryptographic PRNG; it is not auditable or certifiable under regulated gaming standards (GLI-11, BMM, UKGC). The project includes src/rng.ts — a dedicated RNG module — which is not imported here. Using Math.random() in place of the project's RNG is a compliance gap. [L34] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted calls Math.random() directly with no injectable RNG parameter, making deterministic unit testing of reel outcomes impossible without monkey-patching Math. src/rng.ts exists and should be passed in or injected. [L31-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use the satisfies operator to get compile-time shape validation while preserving the literal type: `{ CHERRY: 25, ... } satisfies ReelWeightConfig`. [L13-L17] |

### Suggestions

- Replace Math.random() with the project's src/rng.ts and accept it as an injectable parameter for testability and compliance
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Use Record<Symbol, number> instead of manually mirroring the Symbol union
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Return ReadonlyArray from getReelWeights and mark module-level constants as readonly to honour the documented read-only contract
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const REEL_WEIGHTS: number[][] = [...];
  export function getReelWeights(reelIndex: number): number[] { ... }
  // After
  const SYMBOLS: readonly Symbol[] = [...];
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> { ... }
  ```
- Add reelIndex bounds guard to spinReel and getReelWeights
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
- Use satisfies for DEFAULT_WEIGHTS to get compile-time shape validation
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  };
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } satisfies ReelWeightConfig;
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a cryptographically-auditable RNG (e.g., crypto.getRandomValues() mapped to [0,1)) to satisfy regulated gaming RNG requirements (GLI-11 / eCOGRA equivalents). Math.random()'s implementation is non-deterministically seeded and non-auditable, which disqualifies it from certified slot-machine deployments. [L33]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
