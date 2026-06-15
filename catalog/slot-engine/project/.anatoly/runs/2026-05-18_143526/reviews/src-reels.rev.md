# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | ACCEPTABLE | USED | UNIQUE | GOOD | 85% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | NEEDS_FIX | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 75% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 72% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted call (L40) and returned by getReelSymbols (L54)
- **Duplication [UNIQUE]**: Array constant with slot symbol names. No similar symbol arrays found.
- **Correction [OK]**: Array matches the 8-symbol set used throughout the codebase; order is consistent with weightsToArray and ReelWeightConfig.
- **Overengineering [LEAN]**: Simple constant array of 8 symbol names. No abstraction needed.
- **Tests [NONE]**: No test file exists. Constant defines the full symbol set used by engine and reels — no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported; internal module constant. Name is clear but tolerated at lower confidence.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS (L12) and weightsToArray parameter (L17)
- **Duplication [UNIQUE]**: Type definition mapping symbols to numeric weights. No duplicate type definitions found.
- **Correction [OK]**: Interface matches the reference documentation exactly.
- **Overengineering [ACCEPTABLE]**: Explicit named interface instead of `Record<Symbol, number>` adds verbosity and requires the weightsToArray bridge, but the interface is explicitly documented in the reference schema and forms a clear config contract.
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: All fields are symbol names mapped to numeric weights — self-descriptive interface requiring no additional prose.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Referenced 5 times in weightsToArray calls to initialize REEL_WEIGHTS (L23-L27)
- **Duplication [UNIQUE]**: Configuration constant initializing default weight values. No similar constants found.
- **Correction [OK]**: Weights sum to 120 and per-symbol values match the reference documentation table exactly.
- **Overengineering [LEAN]**: Plain object literal satisfying ReelWeightConfig. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. Weight values directly affect game odds — correctness and sum are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported. Name implies defaults, but nothing documents what these numeric values represent (relative probabilities) or their total (120).

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times to populate REEL_WEIGHTS array (L23-L27)
- **Duplication [UNIQUE]**: Utility converting ReelWeightConfig object to number array. No similar functions found.
- **Correction [OK]**: Emission order matches SYMBOLS array (CHERRY→LEMON→BELL→BAR→SEVEN→DIAMOND→WILD→SCATTER); no ordering mismatch.
- **Overengineering [ACCEPTABLE]**: Exists solely to bridge ReelWeightConfig to number[]; would be unnecessary if weights were stored as Record<Symbol, number> and derived via SYMBOLS.map(). Mild coupling — must stay in sync with SYMBOLS order manually — but it's a short, single-purpose function justified by the documented config shape.
- **Tests [NONE]**: No test file exists. Ordering of array elements is critical for correct symbol-to-weight mapping; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, <10 lines, not exported. Name is clear; leniency applied per private-helper rule.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Referenced in spinReel (L44) and getReelWeights (L57)
- **Duplication [UNIQUE]**: 2D array initializing weights for 5 reels. No duplicate weight arrays found.
- **Correction [OK]**: Five reels each using DEFAULT_WEIGHTS, consistent with reference docs.
- **Overengineering [LEAN]**: Five explicit weightsToArray calls create five independent arrays (not aliased references), which is the correct safe choice. Verbosity clearly communicates the 5-reel structure.
- **Tests [NONE]**: No test file exists. Five-reel weight matrix drives all spin probabilities; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported. Nothing documents that all five reels share identical weights or that the outer array is indexed by reel position 0–4.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel loop (L40) to select symbols
- **Duplication [DUPLICATE]**: Weighted random selection via cumulative probability accumulation. Code logic is identical to weightedPick in src/rng.ts; differs only in type specificity (Symbol vs generic T) and variable naming.
- **Correction [NEEDS_FIX]**: Uses Math.random() — not certifiable for regulated gaming RNG. Cumulative-weight algorithm is otherwise correct.
- **Overengineering [LEAN]**: Standard cumulative-weight sampling loop. Correct algorithm, minimal implementation.
- **Tests [NONE]**: No test file exists. Core probability logic — boundary conditions (r == acc), single-item lists, zero-weight items, and statistical distribution are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, internal. Cumulative-weight sampling algorithm has no description. Slightly over 10 lines but still an internal helper; leniency applied.

> **Duplicate of** `src/rng.ts:weightedPick` — Identical algorithm: reduce weights to total, generate random value, iterate accumulating until threshold, return fallback. Both implement standard weighted selection.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Spins a reel by selecting 3 symbols weighted by configured probabilities. No similar functions found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; an out-of-range value yields undefined weights, causing TypeError in pickFromWeighted.
- **Overengineering [LEAN]**: Simple loop drawing 3 symbols per reel column. Straightforward.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts; always returns 3-symbol column, out-of-bounds reelIndex, and distribution correctness are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. Valid reelIndex range (0–4), always-3-row output, and weighted sampling behavior are all undocumented. (deliberated: confirmed — Confirmed. reels.ts:44 accesses REEL_WEIGHTS[reelIndex] with no bounds check. REEL_WEIGHTS has 5 elements (reels.ts:22-28). Out-of-range index yields undefined, causing TypeError at pickFromWeighted's wts.reduce() (reels.ts:31). Sole runtime caller factories.ts:12 always passes valid indices 0-4, so blast radius is limited to hypothetical misuse of the public API. Defect is real but low-impact in current codebase.)

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning SYMBOLS constant. No duplicate accessors found.
- **Correction [OK]**: Returns the shared SYMBOLS array; no correctness issues.
- **Overengineering [LEAN]**: Trivial accessor exposing SYMBOLS array.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; identity and immutability of returned array untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. No description of what the returned array represents or that it is the master symbol roster shared across all reels.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning weight array for reel index. No duplicate accessors found.
- **Correction [NEEDS_FIX]**: Returns undefined for out-of-range reelIndex, violating the declared number[] return type.
- **Overengineering [LEAN]**: Trivial accessor exposing a reel's weight array.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; valid and invalid reelIndex handling untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. Valid reelIndex range and the meaning/unit of the returned numbers are undocumented.

## Best Practices — 3.75/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all eight Symbol members. Since Symbol from ./types.js is a string-union, Record<Symbol, number> would enforce completeness at the type level and eliminate the need to maintain a parallel property list. [L7-L10] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS (L3), DEFAULT_WEIGHTS (L12), and REEL_WEIGHTS (L22) are module-level constants with no readonly annotations. getReelSymbols() and getReelWeights() return live mutable array references, allowing callers to silently corrupt internal state. [L3-L5, L12-L15, L22-L28, L52-L54, L56-L58] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. spinReel's reelIndex contract ([0,4]) and return shape (3-element column) are non-obvious and undocumented. [L43, L52, L56] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights perform no bounds check on reelIndex. REEL_WEIGHTS[reelIndex] returns undefined for any index outside [0,4]; pickFromWeighted then throws TypeError at wts.reduce() with no error boundary. [L43-L50, L56-L58] |
| 13 | Security | FAIL | CRITICAL | Math.random() drives symbol selection in a slot-machine domain (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER reel weights). Math.random() is not a certifiable PRNG under any gaming regulation (GLI-11, BMM, eCOGRA). The project already contains src/rng.ts, indicating a dedicated RNG pipeline exists; reels.ts bypasses it entirely. [L32] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted calls Math.random() with no injection point, making deterministic unit tests impossible without monkey-patching. Accepting an rng parameter (or a () => number callback) would decouple the function from global state. [L30-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS and SYMBOLS would benefit from the satisfies operator to validate shape at compile time while preserving literal types. SYMBOLS as const satisfies readonly Symbol[] would also narrow element types. [L3-L5, L12-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gaming domain convention: all random draws must flow through the auditable RNG pipeline (src/rng.ts). Ad-hoc Math.random() in a domain module bypasses traceability and makes outcome audit impossible, even independent of certification concerns already flagged in rule 13. [L32] |

### Suggestions

- Inject an RNG function into pickFromWeighted (and by extension spinReel) to use src/rng.ts and enable deterministic tests.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], random: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = random() * total;
  ```
- Guard against out-of-bounds reelIndex in spinReel and getReelWeights.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length})`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Annotate module-level constants as readonly and return readonly types from getters.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...];
  export function getReelSymbols(): Symbol[] { return SYMBOLS; }
  export function getReelWeights(reelIndex: number): number[] { return REEL_WEIGHTS[reelIndex]; }
  // After
  const SYMBOLS: readonly Symbol[] = [...];
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
  export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }
  export function getReelWeights(reelIndex: number): readonly number[] { return REEL_WEIGHTS[reelIndex]; }
  ```
- Replace manual interface with Record utility type so adding a new Symbol automatically requires a weight entry.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Use satisfies for DEFAULT_WEIGHTS to preserve literal types while still validating shape.
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

### Quick Wins

- **[correction · medium · small]** Add a bounds check in spinReel (and getReelWeights) to throw a descriptive error when reelIndex is outside [0, REEL_WEIGHTS.length). [L44]
- **[correction · medium · small]** Fix getReelWeights return type or add guard so it never silently returns undefined for invalid reelIndex. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a certifiable, cryptographically secure RNG (e.g. crypto.getRandomValues) to comply with regulated gaming RNG requirements. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
