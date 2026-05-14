# Anatoly Bench Score — slot-engine

**Run:** `2026-05-06_113334` · project main @ `b15455b`
**Duration:** 8m 51s · **Cost:** $6.45 · **Tokens:** 270 in / 191K out

**Global F1:** 63.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 42.9% | 42.9% | 42.9% | 3 | 4 | 4 |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 57.1% | 50.0% | 66.7% | 2 | 1 | 2 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 66.7% | 80.0% | 57.1% | 4 | 3 | 1 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (10)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (9)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:53 (getReelSymbols) — _Should return [...SYMBOLS] (a shallow copy) to prevent external mutation of the internal symbol roster that pickFromWeighted depends on for correct positional indexing._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] is undefined for out-of-range indices; the return type is declared number[], so callers receive undefined with no type error, producing silent downstream NaN arithmetic._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _Returns a direct reference to the live REEL_WEIGHTS[reelIndex] sub-array. A caller doing getReelWeights(0)[5] = 9999 permanently raises DIAMOND weight for reel 0, biasing all future spins without any …_
- **[correction] `NEEDS_FIX`** — src/events.ts:19 (SpinEventEmitter) — _Array.prototype[Symbol.iterator] tracks the current index against the live array length. If any handler calls on() for the same event, handlers.push() extends the array in-place and the for-of loop wi…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Creates five separate, identical arrays by calling `weightsToArray(DEFAULT_WEIGHTS)` five times. The Configuration Schema doc (`.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`) explicitly s…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (45)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout calculations and is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. EngineContainer register/resolve logic is untested, including type-unsafe resolve behavior._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions are critical to win evaluation but have no tests verifying correctness._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Complex WILD/SCATTER handling logic, run detection, and edge cases (all WILDs, leading WILD, short runs) are entirely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild count multiplier math and payout calculation branches are entirely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Exported function with house edge application, minimum bet bonus, and Math.ceil rounding is entirely untested. The comment claims RTP ~95% but the logic actually adds the house ed…_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file found for this module. SYMBOLS constant is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists. DEFAULT_WEIGHTS values (e.g. ensuring weights sum correctly or individual symbol weights) are completely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. REEL_WEIGHTS structure (5 reels, each with correct weights) is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file found. This is a core probabilistic selection function with edge cases (boundary r values, single-item lists, total weight computation) — all completely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file found. spinReel is imported by src/factories.ts (a critical path) but has zero test coverage — happy path, invalid reelIndex, and output length/shape are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file found. getReelSymbols is imported by src/engine.ts but is entirely untested, including the returned array contents and length._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file found. getReelWeights is imported by src/engine.ts but is entirely untested, including boundary behavior for invalid reelIndex values._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file found. PAY_TABLE is a module-private constant but its correctness (payout values for all 6 symbols across 3 count tiers) is never validated by any test._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. This function is imported by two callers (engine.ts, legacy.ts) making it a critical business-logic path. Edge cases like unknown symbols, count < 3, count === 3/4/5, and count > …_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found. No tests exist for this symbol or its contract._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. DefaultStrategy is imported by src/engine.ts, making it a critical code path, but there are zero tests verifying that adjustPayout returns the result unchanged (identity behavior)._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. While this is a simple string constant, its role as the canonical event name used by src/engine.ts means no test verifies it is correctly passed to emit/on calls in integration sce…_
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. buildReels is imported by src/engine.ts (critical game engine path) and has untested behavior: reel count loop, spinReel delegation per index, and the _rowCount parameter being sil…_
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. detectScatters is used by the core engine and has no test coverage for happy path (multiple scatters), edge cases (empty reels, no scatters, single scatter), or boundary conditions…_
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. handleFreeSpins is used by the core engine and has no test coverage for any of its branches: initial activation (scatters >= 3), re-trigger while active, decrement while active, or…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found for this source file. The function is imported by src/engine.ts indicating it is part of a critical business path (jackpot determination), yet there are no tests covering the happy …_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists for this source file. The function has multiple important behaviors that need coverage: happy path weighted selection, edge cases like single-item arrays, zero-weight items, bounda…_

### documentation (16)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block describing general purpose and house-edge intent, but lacks @param tags for lineWins and bet, lacks a @returns description, and the description is misleading — it claims 95% RTP but …_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:7 (ReelWeightConfig) — _Auto-resolved: type cannot be over-engineered_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _No JSDoc comment. This is a public exported function with no documentation explaining the 'reelIndex' parameter (valid range, what 'reel' means), the hardcoded row count of 3, or the structure and sem…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _No JSDoc comment. Public exported getter with no documentation. While simple, it is part of the public API and should at minimum describe what the returned array represents and that it is the canonica…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _No JSDoc comment. Public exported function with no documentation for the 'reelIndex' parameter (valid range, zero-based index) or the meaning and structure of the returned number[] (parallel to getRee…_
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported function with no JSDoc/TSDoc comment. Missing documentation for both parameters (what 'count' valid range is, what happens outside 3–5), the return value meaning (multiplier applied to what b…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc/TSDoc comment present. As the public abstract base class defining the extension contract for payout adjustment, it warrants at minimum a description of its purpose, the strategy pattern inten…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc/TSDoc comment present. While the pass-through behavior is inferrable from the implementation, there is no documentation clarifying that this is the no-op/identity strategy intended as the bas…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _Exported constant with no JSDoc. The bare string value 'spin:done' and name give only a rough hint; there is no documentation explaining when this event is emitted, what payload accompanies it, or why…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc/TSDoc comment on either the class or its buildReels method. The prefixed _rowCount parameter signals a notable behavioral divergence from the parent contract (rowCount is silently ignored; re…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc/TSDoc comment present. As an exported public function, it should document its parameter (`reels` — a 2-D grid of symbols), the traversal strategy (full grid, not payline-restricted), and the …_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc/TSDoc comment present. As an exported public function with non-trivial branching logic (initial trigger, retrigger, decrement, deactivation), it should document the `state` mutation side-effe…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment is present above or within the function. The function has non-trivial semantics (counts DIAMOND symbols across a 2D reel array, triggers jackpot at >= 4) that warrant documentat…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _The function has a JSDoc comment that describes its general purpose and algorithm, but it is missing @param descriptions for 'items' and 'weights' (e.g., constraints like weights.length must equal ite…_

