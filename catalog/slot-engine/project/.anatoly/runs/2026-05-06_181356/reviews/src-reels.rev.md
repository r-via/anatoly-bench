# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 80% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 80% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 78% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used locally in pickFromWeighted function call at line 45 within spinReel
- **Duplication [UNIQUE]**: Simple constant array of symbol strings. No similar functions found.
- **Correction [OK]**: All eight documented symbols present in consistent order.
- **Overengineering [LEAN]**: Simple, flat constant enumerating the eight symbols. No abstraction.
- **Tests [NONE]**: No test file exists. Constant defines the full symbol set used throughout the game engine.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported, so low severity, but no comment explains the role of this master list or whether order matters for weight alignment.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times in REEL_WEIGHTS initialization at lines 24-28
- **Duplication [UNIQUE]**: Configuration constant. No duplicates found.
- **Correction [OK]**: Weights match documented values exactly; sum = 120 as specified in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Overengineering [LEAN]**: Named-key object is the clearest way to author static weights; values match the documented distribution.
- **Tests [NONE]**: No test file. Weights directly influence payout probabilities — critical business logic with zero coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The fact that these are relative (not absolute) weights and that all five reels share this profile is non-obvious and undocumented.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel at line 44 and getReelWeights at line 57
- **Duplication [UNIQUE]**: Precomputed weight matrix constant. No duplicates.
- **Correction [OK]**: Five reels initialised with DEFAULT_WEIGHTS; matches documented configuration.
- **Overengineering [OVER]**: Per-reel weight matrix implies per-reel customisation that doesn't exist. Docs (.anatoly/docs/02-Architecture/02-Core-Concepts.md, .anatoly/docs/04-API-Reference/02-Configuration-Schema.md) confirm all five reels share identical weights; a single shared array suffices.
- **Tests [NONE]**: No test file. Five-reel weight matrix drives all spin outcomes; no verification that weights are non-empty or correctly shaped.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No indication that index maps to reel position or that all five reels intentionally share identical weights.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel loop at line 45 to select symbols
- **Duplication [DUPLICATE]**: Weighted random selection using accumulation algorithm. Identical logic to weightedPick in src/rng.ts: same loop structure, accumulation logic, and return behavior. Only difference is non-generic type (Symbol) vs generic.
- **Correction [OK]**: Algorithm correct per prior deliberation review (known false positive on correction axis).
- **Overengineering [LEAN]**: Standard O(n) weighted-random algorithm, minimal and correct.
- **Tests [NONE]**: No test file. Core probabilistic selection logic with an off-by-one risk at boundary (r == total falls through to last item). Edge cases like all-zero weights or single-item arrays untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper under 15 lines. Behavior is inferable, but the fallback on the last element (loop exhaustion guard) is an implicit contract worth noting.

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical — same weighted random selection algorithm with identical loop logic and fallback return

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts per import analysis
- **Duplication [UNIQUE]**: Generates random symbol column for a reel. RAG match getReelWeights (0.702) is misleading; spinReel performs spinning logic with weighted picks while getReelWeights is an accessor.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; out-of-range index yields undefined weights, causing a TypeError inside pickFromWeighted.
- **Overengineering [LEAN]**: Straightforward loop that builds a 3-row column. Own code is simple.
- **Tests [NONE]**: No test file. Imported by src/factories.ts — a factory-level consumer — yet no tests verify it returns exactly 3 symbols, handles valid reelIndex range, or rejects out-of-bounds indices.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of reelIndex range (0–4), that it returns a 3-row column, and that each row is independently sampled.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts per import analysis
- **Duplication [UNIQUE]**: Trivial accessor function. No duplicates.
- **Correction [OK]**: Returns module-internal SYMBOLS array; no correctness issues.
- **Overengineering [LEAN]**: Trivial accessor exposing the symbol list.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; no tests confirm the returned array matches expected symbols or is immutable.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. Name is clear but docs should note this returns the same ordered array used for weight indexing.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts per import analysis
- **Duplication [UNIQUE]**: Trivial accessor function. No duplicates.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; returns undefined typed as number[] for any index outside [0, 4].
- **Overengineering [LEAN]**: Trivial accessor; single-line body.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; no tests verify correct weights are returned per reelIndex or that invalid indices are handled.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. Missing: valid range for reelIndex, that returned array order corresponds to getReelSymbols() order, and behavior on out-of-range index.

## Best Practices — 2/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually repeats all eight `Symbol` keys. `Record<Symbol, number>` eliminates duplication and keeps the shape in sync with the union automatically. [L7-L11] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are module-level constants but lack `readonly` annotations. `REEL_WEIGHTS` is `number[][]` instead of `readonly (readonly number[])[]`, allowing external mutation via `getReelWeights`. [L3-L25] |
| 6 | Interface vs Type | WARN | MEDIUM | `ReelWeightConfig` is declared as `interface`, but the project's `types.ts` uses `type` aliases exclusively (e.g. `type Symbol = ...`). Mixed convention within one project. |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. `spinReel` especially warrants documentation of the `reelIndex` valid range (0–4) and return shape. [L44-L57] |
| 12 | Async/Promises/Error handling | WARN | MEDIUM | `spinReel(reelIndex)` and `getReelWeights(reelIndex)` perform no bounds check. `REEL_WEIGHTS[reelIndex]` returns `undefined` for indices outside 0–4; `pickFromWeighted` would then throw `TypeError: Cannot read properties of undefined (reading 'reduce')`. Requires internal misuse, so MEDIUM severity. [L44-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by `.anatoly/docs/02-Architecture/02-Core-Concepts.md` (symbols: CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER; reels; spinReel). `Math.random()` is not a cryptographically secure or independently certifiable PRNG and is prohibited for regulated gambling RNG. The project ships `src/rng.ts` as a dedicated RNG module, which `reels.ts` ignores entirely, using `Math.random()` directly instead. [L30] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` is hardwired to `Math.random()` with no injectable RNG parameter, making deterministic unit testing impossible without monkey-patching globals. The presence of `src/rng.ts` suggests the project intended this to be abstracted. [L27-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SYMBOLS` and `DEFAULT_WEIGHTS` could use `satisfies` for narrower inference while keeping assignability. `SYMBOLS` as `const satisfies Symbol[]` would preserve tuple literal types. |
| 17 | Context-adapted rules | FAIL | MEDIUM | The project's own `src/rng.ts` abstraction is bypassed. In a regulated gambling engine, all random draws must flow through the auditable RNG layer — direct `Math.random()` calls in game logic violate this architectural invariant regardless of the security finding in rule 13. [L30] |

### Suggestions

- Replace Math.random() with the project's rng.ts abstraction and inject it for testability
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
- Use Record<Symbol, number> instead of hand-enumerating all keys in ReelWeightConfig
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants as readonly to prevent external mutation
  - Before: `const REEL_WEIGHTS: number[][] = [...]`
  - After: `const REEL_WEIGHTS: readonly (readonly number[])[] = [...]`
- Add bounds guard to spinReel and getReelWeights to prevent silent undefined access
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
- Add JSDoc to all three exported functions
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spins a single reel and returns 3 symbols for display.
   * @param reelIndex - Zero-based reel index (0–4).
   * @returns Array of 3 symbols drawn from the reel's weight distribution.
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Guard spinReel: validate reelIndex ∈ [0, REEL_WEIGHTS.length) and throw a RangeError before accessing REEL_WEIGHTS to prevent a downstream TypeError in pickFromWeighted. [L44]

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Guard getReelWeights: validate reelIndex ∈ [0, REEL_WEIGHTS.length) and throw a RangeError (or return undefined explicitly with a matching return type) for out-of-range values. [L57]
- **[overengineering · medium · small]** Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
