# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 95% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 92% |
| weightsToArray | function | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 90% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced locally in pickFromWeighted call (line 37)
- **Duplication [UNIQUE]**: Constant symbol array. No similar definitions found in RAG results.
- **Correction [OK]**: Eight symbols defined in the same order used by weightsToArray and pickFromWeighted; no correctness issues.
- **Overengineering [LEAN]**: Simple string-literal array; no abstraction.
- **Tests [NONE]**: No test file exists. This constant defines the full symbol universe; its contents are never validated.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master symbol list used to index reel weights) is not obvious from the name alone.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Type used for DEFAULT_WEIGHTS and weightsToArray parameter
- **Duplication [UNIQUE]**: Type interface defining weight configuration. No similar type definitions found.
- **Correction [OK]**: Interface fields match SYMBOLS order and count exactly.
- **Overengineering [LEAN]**: Explicitly defined in the API reference schema (02-Configuration-Schema.md). Named fields provide type safety for the weight config.
- **Tests [GOOD]**: Interface with no runtime behavior; no tests needed.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface: field names match symbol names exactly and types are number. No complex semantics requiring additional explanation.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Referenced in REEL_WEIGHTS initialization (lines 24-28)
- **Duplication [UNIQUE]**: Constant with specific weight values. No similar constants found.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 (P=25%) combined with the documented 1000× 5-match payout yields ~97.7% RTP from 5-DIAMOND alone across 10 paylines; total DIAMOND contribution ~230% of bet, violating the arbitrated 95% RTP target.
- **Overengineering [LEAN]**: Flat object literal matching the documented default weights table.
- **Tests [NONE]**: No test file. Weight values (e.g. sum, individual entries) are never asserted.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Relative frequencies and total weight (120) are non-obvious and undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified reels.ts:12-15. Weights sum to 120: CHERRY(25)+LEMON(25)+BELL(15)+BAR(10)+SEVEN(5)+DIAMOND(30)+WILD(5)+SCATTER(5). Internal docs confirm these exact probabilities are intentional (DIAMOND≈25%, SEVEN/WILD/SCATTER≈4.2%). weightsToArray (reels.ts:17-20) creates independent number[] copies, so REEL_WEIGHTS (reels.ts:22-28) is not affected by any hypothetical mutation of DEFAULT_WEIGHTS. The refinement cache itself concludes 'No behavioral bug exists.' Mutability is a best_practices/immutability concern, not a correction defect.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times during REEL_WEIGHTS initialization
- **Duplication [UNIQUE]**: Helper to convert weight config to array. No similar functions found.
- **Correction [OK]**: Extracts cfg fields in the same order as SYMBOLS; mapping is correct.
- **Overengineering [ACCEPTABLE]**: Bridges ReelWeightConfig to an ordered number[] that must mirror SYMBOLS order — implicit coupling. Could use SYMBOLS.map(s => cfg[s]) to remove the ordering dependency, but the function itself is minimal and not overengineered.
- **Tests [NONE]**: No test file. Order and completeness of the returned array (8 elements, correct mapping) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper; ordering contract (must match SYMBOLS index order) is a non-obvious constraint that warrants a comment.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel (line 44) and getReelWeights (line 57)
- **Duplication [UNIQUE]**: Reel weight table constant. No similar constants found.
- **Correction [OK]**: Correctly applies DEFAULT_WEIGHTS to all five reels; shape matches the 5-reel architecture.
- **Overengineering [ACCEPTABLE]**: Five identical arrays (all DEFAULT_WEIGHTS) enable future per-reel customization and are explicitly documented in 02-Configuration-Schema.md. spinReel could reference a single array, but the 2D structure is an intentional documented design choice.
- **Tests [NONE]**: No test file. Shape (5 reels × 8 weights) and per-reel values are never validated.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Shape ([5][3] columns × weight arrays) and the fact all five reels share identical weights are undocumented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel function (line 37)
- **Duplication [DUPLICATE]**: Weighted random selection algorithm. Identical logic to weightedPick: same total calculation, same random roll, same cumulative accumulation loop, same fallback.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG source; regulated slot-machine gaming mandates an auditable, certifiable random source.
- **Overengineering [LEAN]**: Standard cumulative-weight sampling loop; no unnecessary abstraction.
- **Tests [NONE]**: No test file. Critical probability logic — boundary conditions (r==0, r at exact boundary, r just below total), fallback return, and distribution skew are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Algorithm (cumulative-weight sampling), parameter semantics, edge-case fallback on the last element, and the requirement that items.length === wts.length are all undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified reels.ts:30-41. The algorithm is correct: cumulative-weight selection with proper total calculation, uniform random draw, and last-item fallback. The finding's evidence is about duplication with weightedPick (rng.ts:5-16), not about a logic error. Duplication is a code quality concern that belongs on the duplication axis, not the correction axis. The function produces correct weighted random selections every time.)

> **Duplicate of** `src/rng.ts:weightedPick` — 100% matching algorithm — both perform weighted random selection via cumulative probability with identical control flow

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported, runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Reel spinning function. No similar functions found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for indices outside 0–4, causing a crash inside pickFromWeighted at wts.reduce().
- **Overengineering [LEAN]**: Straightforward 3-row draw loop delegating to pickFromWeighted.
- **Tests [NONE]**: No test file. Imported by src/factories.ts making it a critical path; column length (3), valid symbol membership, and out-of-range reelIndex behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Valid range of reelIndex, returned array length (always 3), and sampling strategy are undocumented.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter for symbol list. No duplication detected.
- **Correction [OK]**: Returns module-level SYMBOLS array; no correctness issues.
- **Overengineering [LEAN]**: Trivial accessor.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; returned array identity and contents are never asserted.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Returns the shared SYMBOLS array by reference; mutation risk and ordering guarantee are undocumented.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter for reel weights. No duplication detected.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; returns undefined (typed as number[]) for out-of-range indices, breaking any caller that indexes or iterates the result.
- **Overengineering [LEAN]**: Trivial accessor.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; out-of-range index and correct per-reel weight array are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Valid reelIndex range and the fact the returned array is a live reference (not a copy) are undocumented.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 Symbol literals. Since Symbol is a union type alias, Record<Symbol, number> captures the same shape with compile-time exhaustiveness. [L9-L12] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable. getReelWeights returns the live internal number[] reference, allowing callers to mutate RNG weights silently — a game-integrity risk. Internal docs (02-Architecture/03-Data-Flow.md) specify the reel output as ReadonlyArray. [L3-L27] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. spinReel's reelIndex parameter semantics and return shape are undocumented. [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel performs no bounds check on reelIndex. REEL_WEIGHTS[outOfBoundsIndex] returns undefined; pickFromWeighted then crashes on wts.reduce(). The valid range [0, 4] is implicit and unenforced. [L44-L50] |
| 13 | Security | FAIL | CRITICAL | Math.random() is a non-cryptographic, statistically unverifiable PRNG not certifiable for regulated gambling software. Domain confirmed: slot machine with CHERRY/SEVEN/BAR/WILD/SCATTER symbols, 10-payline engine, and 95% RTP target (README arbitrated intent). The project includes src/rng.ts — a dedicated RNG module — but pickFromWeighted bypasses it entirely and calls Math.random() directly. [L34-L35] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded inside pickFromWeighted with no RNG injection point. Unit tests cannot seed or control the draw, making deterministic distribution tests impossible without monkey-patching. [L33-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS and DEFAULT_WEIGHTS are module-level constants that would benefit from `as const` (narrows literal types) and `satisfies ReelWeightConfig` (compile-time exhaustiveness without widening). Neither is used. [L3-L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights returns REEL_WEIGHTS[reelIndex] directly — a live reference to internal mutable state. In gambling code, uncontrolled mutation of RNG weight tables is a game integrity and audit risk. A defensive copy or ReadonlyArray return type is required. [L56-L58] |

### Suggestions

- Replace Math.random() with the project's dedicated RNG module and inject it for testability
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
- Use as const and readonly to lock down module-level constants
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  // After
  const SYMBOLS = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ] as const satisfies readonly Symbol[];
  const DEFAULT_WEIGHTS = { ... } as const satisfies ReelWeightConfig;
  ```
- Replace ReelWeightConfig interface with Record utility type for compile-time exhaustiveness
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Return a readonly copy from getReelWeights to prevent external mutation of live weight tables
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    const weights = REEL_WEIGHTS[reelIndex];
    if (!weights) throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
    return weights;
  }
  ```
- Add bounds guard to spinReel to prevent undefined weights crash
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
    if (!weights) throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with crypto.getRandomValues or another certifiable RNG to meet regulated gaming correctness requirements. [L33]
- **[correction · medium · small]** Add bounds guard in spinReel: throw or return early when reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length. [L44]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to ~5 (or equivalently reduce paytable multipliers in paytable.ts) to align total RTP with the arbitrated 95% target; current weight alone drives DIAMOND-only RTP to ~230% of bet. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Add bounds guard in getReelWeights to prevent returning undefined for out-of-range reelIndex. [L57]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
