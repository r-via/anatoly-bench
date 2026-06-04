# Anatoly Bench Score — slot-engine

**Run:** `2026-06-04_164329` · Anatoly v0.9.6 (`c6e9596-dirty`) · project main @ `7dc4cc6`
**Duration:** 11m 20s · **Cost:** $3.18 · **Tokens:** 177 in / 152K out

**Global F1:** 74.6%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 61.5% | 57.1% | 66.7% | 4 | 2 | 3 | 15m 30s | $0.89 | 55K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 53s | $0.09 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 12s | $0.09 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 29s | $0.22 | 11K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 8s | $0.13 | 3K |
| best-practices | ✓ | 66.7% | 80.0% | 57.1% | 4 | 3 | 1 | 18m 28s | $1.05 | 66K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 4s | $0.15 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 39s | $0.46 | 8K |

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

## False positives (5)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/paytable.ts:11 (PAY_TABLE) — _WILD on one payline)=(35/120)^5≈0.002111; payout=1000×lineBet=1000×(bet/10)=100×bet; E[return, 10 paylines]=10×0.002111×100×bet=2.111×bet → implied RTP ≥211% from this combo alone (lower bound: wild b…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Inferred slot-machine domain from CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER vocabulary in reference docs and the file's own JSDoc ('suitable for gaming RNG applications'). Math.random() is a no…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_

## Unscored findings (46)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (30)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE affects computePayout output and is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior and type-cast safety are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton with registered dependencies is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline coordinate correctness is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-leading logic, SCATTER early-return, run threshold, and mixed-symbol break are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding formula and null-return path are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Comment claims house edge reduces RTP to ~95% but code multiplies by (1 + HOUSE_EDGE) — inflating rather than reducing — plus unconditional bet*0.01 bonus. None of this is tested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists. Primary exported function used by src/index.ts has zero coverage: invalid-bet validation, free spin triggering, jackpot path, wild multiplier accumulation, and strategy.adjustPayo…_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. This function has non-trivial weighted-random logic (boundary at r < acc, fallback to last item) that critically needs edge-case coverage: zero-weight entries, single-item list, r…_
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Used by src/factories.ts; missing tests for valid reel index, out-of-bounds index (REEL_WEIGHTS[reelIndex] would be undefined), and that exactly 3 symbols are returned._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Used by src/engine.ts; no coverage of returned array identity or contents._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Used by src/engine.ts; no coverage of valid index, out-of-bounds index, or returned array contents._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Module-private but drives all payout logic — untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout path with zero test coverage. Missing: valid symbol+count combos, unknown symbol returns 0, count < 3 returns 0, coun…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, so its identity transform (pass-through payout) is untested despite being on a critical path._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Core class used by src/engine.ts with on/off/emit methods — none are tested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant used by src/engine.ts as an event key; not validated in any test._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Abstract class with no test file. No tests exist for any subclass behavior contract._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. buildReels is imported by src/engine.ts (critical path) but has zero test coverage — happy path, reel count, row count ignored behavior, and spinReel integration are all untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Used by engine.ts — needs tests for empty reels, no scatters, partial scatter counts, and full grid scatters._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. Critical state machine with 4 branches (activate, retrigger, decrement, deactivate) — all untested._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic (jackpot detection) used by src/engine.ts has zero coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, single reel), or boundary …_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched weights/items length, all-zero weights, single-item arrays, and boundary roll == cumulative. Called by src/engine.ts, making…_

### documentation (16)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _No JSDoc. Exported type alias with no constraints or usage notes documented._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent but omits @param for lineWins and bet, no @returns, and does not document the unconditional floor addition (bet * 0.01) or the use of Math.ceil. (delibera…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), meaning of return value (3-element column of symbols, one per row), and that sampling is independent per cell._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No explanation of the return value order or that it is the canonical symbol ordering used for weight-array indexing._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that the returned array aligns positionally with getReelSymbols(), and that values are read-only._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported function with no JSDoc. Missing: description of purpose, @param docs for symbol and count, @returns explanation, and note that WILD/SCATTER return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, usage pattern, and the contract of adjustPayout are not described._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on class or method. The pass-through behavior of adjustPayout is non-obvious without documentation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). None of the parameters, return values, or behavioral constraints (e.g. duplicate handler behavior, emit-while-iterating safety) are …_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment explaining when this event is emitted or what args it carries._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Purpose of the abstract factory, the contract of buildReels, and the meaning of reelCount/rowCount parameters are not described._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment on the class or its buildReels override. The _rowCount parameter is silently ignored — a notable behavior with no explanation._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter docs for `reels`, and return value explanation._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-trivial state machine with three distinct branches (activate, retrigger, decrement/deactivate) — the mutation semantics and threshold logic (≥3 scatters) are not described anywhe…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _Exported public function with no JSDoc. Missing description of jackpot trigger logic (≥4 DIAMOND symbols across the full grid), parameter shape, and return semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _Has a JSDoc block describing purpose and algorithm, but missing @param descriptions for `items` and `weights`, missing @returns, and no documentation of edge cases (e.g., empty arrays, negative weight…_

