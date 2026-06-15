# Anatoly Bench Score — slot-engine

**Run:** `2026-05-12_192632` · Anatoly v0.9.6 (`69fff0e-dirty`) · project main @ `7dc4cc6`
**Duration:** 10m 40s · **Cost:** $5.66 · **Tokens:** 233 in / 155K out

**Global F1:** 71.4%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 52.6% | 71.4% | 41.7% | 5 | 7 | 2 | 9m 13s | $1.40 | 43K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 40s | $0.09 | 6K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 11s | $0.11 | 10K |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 | 3m 38s | $0.59 | 12K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 5s | $0.30 | 3K |
| best-practices | ✓ | 76.9% | 100.0% | 62.5% | 5 | 3 | 0 | 17m 42s | $2.20 | 75K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 39s | $0.40 | 5K |
| _refinement_ | — | — | — | — | — | — | — | 3m 42s | $0.58 | 11K |

## Misses (6)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (12)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:120 (spin) — _rng and reelsModule are resolved from the container but never called; factory.buildReels(5, 3) builds reels independently. The registered weightedPick RNG (L30) and reels module (L32) are entirely byp…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:44 (spinReel) — _REEL_WEIGHTS has indices 0–4. If reelIndex is negative or ≥ 5, REEL_WEIGHTS[reelIndex] is undefined. Passing undefined as wts to pickFromWeighted causes TypeError at wts.reduce() on L31._
- **[correction] `NEEDS_FIX`** — src/reels.ts:52 (getReelSymbols) — _Returns direct reference to internal SYMBOLS array; callers can mutate it, corrupting symbol-to-weight mapping for all future spins._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _No bounds check on reelIndex: REEL_WEIGHTS[reelIndex] returns undefined for reelIndex outside 0–4, violating the declared return type number[] and causing downstream crashes._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _Returns the live array reference from REEL_WEIGHTS; any mutation by the caller (e.g. getReelWeights(0)[0] = 0) permanently alters spin probabilities for that reel._
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Docstring declares function 'suitable for gaming RNG applications' but uses Math.random(), a non-cryptographic PRNG. Regulated gaming RNG must be certifiable (provably uniform, auditable seed); Math.r…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:15 (weightedPick) — _When items is empty (length 0), the loop never executes and the fallback evaluates items[-1] === undefined, silently returning undefined as T. Caller receives a typed value that is actually undefined,…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical calls to weightsToArray(DEFAULT_WEIGHTS) stored in a 2D array. Since all reels share the same weights (confirmed by internal docs), this could be a single weights array reused directly.…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout calculations but is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false so the debug branch is dead and untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve round-trip, missing-key behavior, and type-cast safety are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions (shape, row bounds) are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-lead resolution, SCATTER early-return, run-length cutoff at <3, and all-WILD cases are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-count multiplier formula, null propagation from checkLine, and payout arithmetic are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. House-edge application (note: comment says ~95% RTP but code adds HOUSE_EDGE making payout larger, not smaller), base-bet bonus, Math.ceil rounding, and empty-wins case are all un…_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS array contents (8 slot symbols) are never verified._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values (sum=120, individual distributions) are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Five-reel structure and per-reel weight arrays are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Critical weighted-random logic—boundary conditions (r exactly at boundary, last-item fallback, zero-weight items) and distribution correctness are entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts; returns 3-symbol column per reel. Output length, valid symbol membership, and invalid reelIndex behavior are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; returned array identity and contents are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently—untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private table backing getPayMultiplier; untested indirectly as well._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file. Imported by src/engine.ts and src/legacy.ts — a critical pay calculation path — with zero coverage. Missing: valid symbol/count combos (3/4/5), unknown symbol returning 0, count <3 retur…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, making untested pass-through behavior a gap in engine coverage._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant imported by src/engine.ts as an event key; no tests verify its value or usage contract._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. `buildReels` is called by `src/engine.ts` (a critical path), but neither happy path nor edge cases (reelCount=0, rowCount variations, spinReel output shape) are covered._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Missing coverage for: empty reels, no scatters, single scatter, multiple scatters across columns, and scatters within a single column._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Missing coverage for: initial activation (scatters>=3), retrigger during active state, decrement logic, boundary condition (remaining reaches 0), and inactive state with scatters<…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, fewer than 4 diamonds)…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical gaming RNG logic with zero coverage: uniform distribution correctness, boundary behavior (roll == cumulative), zero/negative weights, mismatched array lengths, single-ite…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block but omits @param for both lineWins and bet (typed as any), omits @returns, and the description states house edge maintains ~95% RTP while the implementation adds 5% to wins (increasi…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: what reelIndex range is valid, that it returns 3 symbols (one per row), and what happens for out-of-range index. (deliberated: reclassified: correction: ERR…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Purpose and return value are inferable but the ordering guarantee (must align with getReelWeights indices) is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range, that returned array indices correspond to SYMBOLS order, and mutation warning (returns live array reference)._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing @param descriptions, @returns explanation, and no note that WILD/SCATTER (or unknown symbols) return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc. Abstract class with a single abstract method; the extension contract, intended use, and subclassing pattern are not described inline._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc. Pass-through semantics are non-obvious without a comment explaining that this is the no-op baseline strategy._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. Purpose (event name emitted after every spin completes), expected payload type (SpinResult), and the typo-prevention rationale for exporting it as a constant are all absent._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc. Key details missing: delegation to spinReel(i), the fact that rowCount is intentionally unused (reel height fixed implicitly at 3), and that this is the default RNG-backed implementation._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. counts all SCATTER symbols across entire grid)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. State-mutation side effects, trigger threshold (scatters >= 3), initial award (10), retrigger logic, and decrement-to-deactivation behavior are all undocumented. (deliberated: confir…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing description of purpose, parameter (`reels`) shape/semantics, return value meaning, and the ≥4 DIAMOND threshold rule._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes the function's purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array…_

