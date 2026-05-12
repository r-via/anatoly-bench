# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 85% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | NEEDS_FIX | LEAN | USED | DUPLICATE | WEAK | 62% |
| spinReel | function | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | NONE | 96% |
| getReelSymbols | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced on line 47 in pickFromWeighted call and returned on line 53 by getReelSymbols
- **Duplication [UNIQUE]**: Symbol array constant. No similar constants found.
- **Correction [OK]**: Eight symbols defined; order matches weightsToArray output order.
- **Overengineering [LEAN]**: Simple constant array of symbol names. No abstraction.
- **Tests [NONE]**: No test file exists. SYMBOLS array contents (8 slot symbols) are never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master symbol list used for reel picks) is not obvious from declaration alone.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times in REEL_WEIGHTS initialization (lines 24-28)
- **Duplication [UNIQUE]**: Weight configuration constant. No similar constants found.
- **Correction [OK]**: Weights sum to 120, matching documented totals.
- **Overengineering [ACCEPTABLE]**: Named object for weights is reasonable for readability and documentation. The internal docs confirm this is the intended configuration surface.
- **Tests [NONE]**: No test file. Weight values (sum=120, individual distributions) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing explanation that weights are relative (not percentages), what the total is, or that all five reels share this config.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (line 46) and returned by getReelWeights (line 58)
- **Duplication [UNIQUE]**: Array of weight distributions for five reels. No similar constants found.
- **Correction [OK]**: Five reels, each initialized correctly from DEFAULT_WEIGHTS.
- **Overengineering [OVER]**: Five identical calls to weightsToArray(DEFAULT_WEIGHTS) stored in a 2D array. Since all reels share the same weights (confirmed by internal docs), this could be a single weights array reused directly. The per-reel structure implies per-reel configurability that is never used.
- **Tests [NONE]**: No test file. Five-reel structure and per-reel weight arrays are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Implicit assumption that all five reels are identical and index corresponds to reel position is undocumented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel loop (line 47) to select weighted random symbols
- **Duplication [DUPLICATE]**: Weighted random selection via cumulative accumulation. Implementation is 95% identical to weightedPick in rng.ts.
- **Correction [NEEDS_FIX]**: Math.random() is non-certifiable RNG for a regulated slot-machine domain.
- **Overengineering [LEAN]**: Standard weighted random selection. Minimal, correct, and not reimplementing anything from a listed dependency.
- **Tests [NONE]**: No test file. Critical weighted-random logic—boundary conditions (r exactly at boundary, last-item fallback, zero-weight items) and distribution correctness are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Core weighted-random-selection algorithm; missing description of parameters, return value, and behaviour when weights sum to zero. (deliberated: confirmed — Confirmed: pickFromWeighted (reels.ts:30-41) is algorithmically identical to weightedPick (rng.ts:5-16). Both use Math.random(). The Math.random() concern is valid for a gaming engine but is project-wide — rng.ts:7 also uses Math.random(), so replacing pickFromWeighted with weightedPick wouldn't fix the RNG issue. The duplication itself is real and creates a DI bypass (engine.ts:120 resolves weightedPick but spinReel uses pickFromWeighted instead). Confidence stays low because the correction is about Math.random() suitability, which is systemic, not specific to this function.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both compute weighted random selection by accumulating weights until exceeding random threshold

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported; runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Generates 3 symbols for a reel using weighted selection. No similar functions found.
- **Correction [ERROR]**: No bounds check on reelIndex; out-of-range value yields undefined weights, crashing in pickFromWeighted at wts.reduce.
- **Overengineering [LEAN]**: Straightforward: look up weights by reel index, pick 3 symbols. Logic is simple and direct.
- **Tests [NONE]**: No test file. Imported by src/factories.ts; returns 3-symbol column per reel. Output length, valid symbol membership, and invalid reelIndex behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: what reelIndex range is valid, that it returns 3 symbols (one per row), and what happens for out-of-range index. (deliberated: reclassified: correction: ERROR → NEEDS_FIX — Missing bounds check confirmed: REEL_WEIGHTS has 5 entries (reels.ts:22-28), and spinReel(reels.ts:43-50) does not validate reelIndex. Out-of-bounds access yields undefined weights, crashing pickFromWeighted at wts.reduce (line 31). However, all current callers pass valid indices: factories.ts:12 loops i=0 to reelCount-1, and engine.ts:128 sets reelCount=5 (indices 0-4). No active crash path exists in current usage. Downgraded from ERROR to NEEDS_FIX: this is a missing input validation on a public API, not an active runtime error.)

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning symbol array. No similar functions found.
- **Correction [NEEDS_FIX]**: Returns direct reference to internal SYMBOLS array; callers can mutate it, corrupting symbol-to-weight mapping for all future spins.
- **Overengineering [LEAN]**: Thin accessor; reasonable for encapsulating the module constant.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; returned array identity and contents are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Purpose and return value are inferable but the ordering guarantee (must align with getReelWeights indices) is undocumented.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning weights for reel index. No similar functions found.
- **Correction [NEEDS_FIX]**: Two independent defects: missing bounds check returns undefined typed as number[], and the returned array is the live internal reference so callers can mutate actual reel weights.
- **Overengineering [LEAN]**: Thin accessor for per-reel weights. Useful for testing or display.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently—untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range, that returned array indices correspond to SYMBOLS order, and mutation warning (returns live array reference).

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 symbol keys. Record<Symbol, number> would stay in sync with the Symbol union automatically and remove the duplicated key list. [L9-L12] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all runtime-mutable. They should carry readonly / Readonly<T> / ReadonlyArray to prevent accidental mutation. [L3-L26] |
| 6 | Interface vs Type | WARN | MEDIUM | Symbol is imported as a `type` alias from types.ts, but ReelWeightConfig is defined as an `interface`. Given types.ts is the project's type home, defining a local interface is inconsistent with the apparent convention. [L9-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc comments. [L43-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel does not validate reelIndex bounds. REEL_WEIGHTS[reelIndex] returns undefined for index ≥ 5, causing a runtime crash in pickFromWeighted (wts.reduce on undefined). The public API surface accepts any number with no guard or throw. [L43-L49] |
| 13 | Security | FAIL | CRITICAL | Gambling/casino domain inferred from slot-machine vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER, reel weights). Math.random() is not cryptographically secure and is not certifiable for regulated gaming RNG. The project ships src/rng.ts — a dedicated RNG module — which is bypassed here in favour of direct Math.random() calls. [L33] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted hardcodes Math.random(), making deterministic tests impossible without monkey-patching. An injectable rng parameter would allow seeded unit tests and align with the project's rng.ts abstraction. [L29-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS should use the satisfies operator for type-checked inference. SYMBOLS lacks as const, losing its literal tuple type and widening to Symbol[]. [L3-L18] |
| 17 | Context-adapted rules | WARN | MEDIUM | The project exposes src/rng.ts for centralized RNG, but spinReel/pickFromWeighted bypass it entirely. For a slot-machine engine, all randomness must flow through the designated RNG module to support auditability, seed control, and compliance. [L29-L49] |

### Suggestions

- Replace manual ReelWeightConfig interface with Record<Symbol, number> to automatically stay in sync with the Symbol union.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Add readonly to all module-level constants to prevent accidental mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS: readonly Symbol[] = [...];
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = {...};
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...]
  ```
- Use satisfies for DEFAULT_WEIGHTS to get both compile-time type checking and inferred literal types.
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
- Inject an RNG function into pickFromWeighted to use src/rng.ts and enable deterministic testing.
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
- Guard spinReel against out-of-bounds reelIndex to prevent undefined dereference crash.
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

## Actions

### Quick Wins

- **[correction · medium · small]** Return a shallow copy in getReelWeights (e.g. [...REEL_WEIGHTS[reelIndex]]) and add a bounds guard to avoid returning undefined. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with crypto.getRandomValues() or another certifiable CSPRNG suitable for regulated gaming. [L32]
- **[correction · high · large]** Add bounds check in spinReel: throw or return an error if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length before accessing REEL_WEIGHTS[reelIndex]. [L44]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Return a shallow copy in getReelSymbols (e.g. [...SYMBOLS]) to prevent external mutation of the internal symbol table. [L53]
- **[overengineering · medium · small]** Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
