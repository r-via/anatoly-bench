# Anatoly Bench Score — slot-engine

**Run:** `2026-05-20_164107` · Anatoly v0.9.6 (`b90302b-dirty`) · project main @ `7dc4cc6`
**Duration:** 8m 54s · **Cost:** $3.57 · **Tokens:** 233 in / 146K out

**Global F1:** 70.2%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 66.7% | 57.1% | 80.0% | 4 | 1 | 3 | 10m 35s | $0.83 | 39K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 32s | $0.07 | 5K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 21s | $0.11 | 13K |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 | 2m 52s | $0.33 | 8K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 6s | $0.17 | 3K |
| best-practices | ✓ | 57.1% | 80.0% | 44.4% | 4 | 5 | 1 | 19m 5s | $1.27 | 70K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 18s | $0.26 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 2m 9s | $0.44 | 6K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _Reference docs state 'Weights are read-only at runtime — there is no setter.' Returning REEL_WEIGHTS[reelIndex] directly lets any caller do getReelWeights(0)[5] = 9999, which mutates the shared REEL_W…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical weightsToArray(DEFAULT_WEIGHTS) calls. Since all reels share the same weights, Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or a single shared array would be cleaner an…_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical edge cases untested: WILD-only runs, SCATTER early-exit, runs of exactly 2 (boundary), mixed WILD leading._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding logic (exponential boost) is entirely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Comment claims RTP ~95% but code applies HOUSE_EDGE as a boost (multiplies total by 1.05), inverting the intended house-edge direction — untested and unverified._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. This is the most critical untested symbol: weighted random selection with boundary behavior (r < acc edge, fallback return) and Math.random dependency are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts, making this a critical untested export path._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex behavior (undefined return) is also untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Function is imported by engine.ts and legacy.ts — critical path with no coverage for valid symbols, unknown symbols, or count boundary values (2, 3, 4, 5, 6)._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts but adjustPayout (identity return) has no coverage._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. `on`, `off`, and `emit` are untested — including edge cases like emitting with no listeners, removing a non-registered handler, multiple handlers for the same event, and handler a…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is used as an event name in `src/engine.ts` but its integration with `SpinEventEmitter.emit`/`on` is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is imported by `src/engine.ts` (critical path) but has zero test coverage — happy path, edge cases (reelCount=0, reelCount=1), and `spinReel` integration are all unte…_
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Function is used by engine.ts but has zero test coverage for scatter counting logic, empty reels, or multi-column inputs._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Critical state-mutation function with 4 branches (activation, retrigger, decrement, deactivation) used by engine.ts — all branches untested._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: mismatched array lengths, zero-weight items, single-item input, floating-point boundary where roll equals cumulative weight, and empty arrays. Called…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Function has clear edge cases to cover: exactly 4 diamonds (boundary), fewer than 4, more than 4, empty reels, diamonds spread across columns vs. concentrated. Used by src/engine.…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and RTP target but omits @param descriptions for lineWins and bet, does not document the unconditional `bet * 0.01` floor, and bet is typed `any` without explanation._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: what reelIndex range is valid (0–4), that it returns 3 symbols (one per row), and that each cell is drawn independently._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Missing: description of return value (canonical ordered symbol list used for weight indexing)._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that returned array corresponds index-for-index to getReelSymbols(), and that it is read-only at runtime._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc. Exported public API. Missing: parameter semantics for `count`, valid range of `count`, return value meaning, and that WILD/SCATTER return 0 (non-obvious edge case)._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. The abstract class and the contract of `adjustPayout` (what it receives, what it must return, when/why it is called) are not described anywhere inline._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. The identity/pass-through behaviour is implicit from the code but not documented for consumers of the public API._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage, and method parameters/return values are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. The event name string value is self-evident but the payload type and when this event fires are not documented._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. Key behavioral quirk — rowCount parameter is ignored, always producing 3 rows via spinReel() — is invisible without documentation._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. State mutation side-effects, the three-branch transition logic, retrigger behavior, and the meaning of the `scatters` threshold are all undocumented._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, missing @returns tag, and no mention of edge cases (e.g. mismatched array lengths, zero total weight, emp…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols across all reels), parameter docs for `reels`, and return value explanation._

