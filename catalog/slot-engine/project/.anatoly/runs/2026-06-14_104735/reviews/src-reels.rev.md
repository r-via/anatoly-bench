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
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 95% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by pickFromWeighted call in spinReel and returned directly by getReelSymbols.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Eight-element tuple matches ReelWeightConfig and weightsToArray ordering exactly.
- **Overengineering [LEAN]**: Plain array of string literals; minimal and appropriate.
- **Tests [NONE]**: No test file exists. Transitive coverage via spinReel/getReelSymbols is moot since those exported callers are also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose as the master symbol registry for weighted selection is not stated.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS (L12) and the cfg parameter of weightsToArray (L17).
- **Duplication [UNIQUE]**: No similar interface found in RAG results.
- **Correction [OK]**: Interface fields align with SYMBOLS array order and weightsToArray extraction.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; types require no tests.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface: name conveys 'reel weight config', fields exactly match symbol names with number types. No complex semantics that require additional explanation.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times to populate REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Weights sum to 120 and match reference documentation exactly.
- **Overengineering [LEAN]**: Simple data declaration; complexity comes from the surrounding interface, not this constant.
- **Tests [NONE]**: No test file. Constant drives all reel probability distributions but is never directly verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Numeric values carry no explanation of what they represent (relative weights summing to 120) or how they affect symbol probability.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times in REEL_WEIGHTS initializer to convert DEFAULT_WEIGHTS into number arrays.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Extraction order matches SYMBOLS array order; no logic errors.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file. Mapping order is critical (determines per-symbol probability) but untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported 4-line helper with a clear name. Tolerable absence, but ordering contract (must match SYMBOLS order) is implicit and undocumented.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and returned by getReelWeights (L57), both of which have external consumers.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Five reels each correctly initialized from DEFAULT_WEIGHTS via weightsToArray.
- **Overengineering [ACCEPTABLE]**: Five identical entries could be Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)), but per-reel slots are a legitimate slot-machine extensibility point. Minor verbosity, not a design problem.
- **Tests [NONE]**: No test file. Transitive coverage requires spinReel/getReelWeights to be tested, which they are not.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The structure (5 reels sharing identical weights), valid index range (0–4), and immutability at runtime are all undocumented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel loop (L47) to select each symbol according to reel weights.
- **Duplication [DUPLICATE]**: Identical weighted-random-selection algorithm: accumulate total, pick random in [0,total), iterate accumulating per-item weight, return item when roll < cumulative. Only differences are variable names and the type parameter — this is Symbol-typed while weightedPick<T> is generic. Logic is fully interchangeable.
- **Correction [NEEDS_FIX]**: Uses Math.random(), which is not a certifiable RNG for regulated gaming software.
- **Overengineering [LEAN]**: Textbook weighted random selection; linear scan with accumulator is appropriate for 8 symbols.
- **Tests [NONE]**: No test file. Core probability logic with boundary conditions (r exactly at acc boundary, single-item list, zero-weight items) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported helper with a descriptive name. Tolerable, but the fallback behavior (returns last item on floating-point edge) is a non-obvious contract. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 correctly implements cumulative-weight sampling. Called at L47 inside spinReel to draw symbols. The algorithm is correct: reduce weights to total, scale Math.random(), accumulate per-item weight, return on threshold cross, fallback to last item. The finding's evidence is about duplication with src/rng.ts:weightedPick — that duplication is real but belongs on the duplication axis, not correction. Duplication is not a correctness defect; the code produces correct results.)

> **Duplicate of** `src/rng.ts:weightedPick` — ~95% identical logic — same reduce+random+accumulator loop and fallback return; pickFromWeighted is a non-generic, Symbol-typed copy of the generic weightedPick<T>

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Correctly builds a 3-row column per reel using pickFromWeighted; RNG defect is owned by pickFromWeighted (rule 10).
- **Overengineering [LEAN]**: Straightforward: look up weights, draw 3 symbols, return column.
- **Tests [NONE]**: No test file. Consumed by src/factories.ts for critical spin path; no tests for out-of-range reelIndex, column length, or symbol validity.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported. No JSDoc. Missing: valid range of reelIndex (0–4), meaning of the returned array (3 symbols top-to-bottom), and behavior on out-of-range index.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts; consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG.
- **Correction [OK]**: Returns SYMBOLS reference; no in-tree call site mutates it.
- **Overengineering [LEAN]**: Minimal accessor; used by engine.ts.
- **Tests [NONE]**: No test file. Used by spin() in engine.ts for symbol enumeration; return value never asserted.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported. No JSDoc. Returns the master symbol list; return value ordering and mutability are unstated.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts; consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG.
- **Correction [OK]**: Returns the weight sub-array for the requested reel index; consumers (src/engine.ts) only read it.
- **Overengineering [LEAN]**: Minimal accessor matching documented API; used by engine.ts.
- **Tests [NONE]**: No test file. Used by spin() in engine.ts; out-of-range reelIndex returns undefined with no guard, untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported. No JSDoc. Valid reelIndex range (0–4), returned array ordering relative to getReelSymbols(), and mutability of the result are all undocumented.

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates all 8 symbol keys. `Record<Symbol, number>` ties the config shape to the `Symbol` union and eliminates the risk of divergence when symbols are added or removed. [L7-L10] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are all mutable. `getReelWeights` returns a live reference to the internal array — any consumer can silently corrupt global reel state. All three constants should be `readonly` / `as const` and the return type should be `ReadonlyArray<number>`. [L3-L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spinReel`, `getReelSymbols`, and `getReelWeights` are all exported without JSDoc. Valid `reelIndex` range (0–4) and return contract are undocumented. [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel(reelIndex)` performs no bounds check. An out-of-range index yields `undefined` weights, causing `wts.reduce(...)` to throw a `TypeError` at runtime. A guard (`if (reelIndex < 0 \|\| reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...)`) is missing. [L43-L49] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by reel/symbol/paytable/jackpot/freespin vocabulary throughout the project. `Math.random()` is a non-cryptographic PRNG: it is not independently certifiable, can be seeded/predicted in some environments, and fails regulated gaming RNG audit requirements. Replace with `crypto.getRandomValues()` or a certified third-party RNG module. [L33] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` and `spinReel` call `Math.random()` directly. Deterministic unit tests require monkey-patching the global. Inject an RNG parameter (`rng: () => number = Math.random`) to enable seeded testing. [L30-L49] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS satisfies ReelWeightConfig` would catch missing or extra keys at compile time while preserving literal types. `SYMBOLS as const` enables exhaustiveness checks against the `Symbol` union. [L3-L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming utility best practice: `getReelWeights` must not expose a mutable reference to internal state. Return `[...REEL_WEIGHTS[reelIndex]]` or annotate the return as `ReadonlyArray<number>` to honor the documented read-only contract. [L55-L57] |

### Suggestions

- Replace ReelWeightConfig interface with Record<Symbol, number> to stay structurally coupled to the Symbol union.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark all module-level constants readonly / as const.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS = [
    "CHERRY","LEMON","BELL","BAR","SEVEN","DIAMOND","WILD","SCATTER",
  ] as const satisfies readonly Symbol[];
  const DEFAULT_WEIGHTS = { CHERRY:25,LEMON:25,BELL:15,BAR:10,SEVEN:5,DIAMOND:30,WILD:5,SCATTER:5 } satisfies ReelWeightConfig;
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...]
  ```
- Replace Math.random() with crypto.getRandomValues() for certifiable gaming RNG.
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const r = (buf[0] / 0x1_0000_0000) * total;
  ```
- Inject RNG to enable deterministic unit tests.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
  // After
  function pickFromWeighted(
    items: readonly Symbol[],
    wts: readonly number[],
    rng: () => number = Math.random,
  ): Symbol {
  ```
- Add bounds guard in spinReel and return a copy from getReelWeights.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a cryptographically secure or certified PRNG (e.g., crypto.getRandomValues / a seeded certified RNG). Math.random() cannot pass regulatory RNG audits for casino/gambling software. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
