# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_175653` · Anatoly v0.9.6 (`006c9c1-dirty`) · project main @ `7dc4cc6`
**Duration:** 12m 21s · **Cost:** $3.65 · **Tokens:** 169 in / 147K out

**Global F1:** 78.3%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 66.7% | 57.1% | 80.0% | 4 | 1 | 3 | 15m 58s | $1.15 | 60K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 53s | $0.09 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 18s | $0.14 | 6K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 6s | $0.33 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 8s | $0.17 | 3K |
| best-practices | ✓ | 80.0% | 80.0% | 80.0% | 4 | 1 | 1 | 16m 0s | $1.07 | 58K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 56s | $0.23 | 6K |
| _refinement_ | — | — | — | — | — | — | — | 1m 34s | $0.29 | 5K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (2)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/paytable.ts:11 (PAY_TABLE) — _Forward: P(DIAMOND/cell) = 30/120 = 0.25; P(5-of-a-kind on one payline, pure DIAMOND, no WILDs) = 0.25^5 ≈ 0.000977; RTP contribution across 10 paylines = P × multiplier × (paylines × lineBet/bet) = 0…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_

## Unscored findings (48)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (31)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _Type alias with no test file present._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists; transitive coverage via computePayout is moot since computePayout itself has no tests._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists; spin (the only caller) is also untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file present; register/resolve behavior is never directly or indirectly verified by any test._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file; spin is the only caller and is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file; spin is the only caller and is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file; WILD/SCATTER logic, run-length counting, and minimum-run threshold are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file; wild-count multiplier logic and null-return path are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file; house-edge application (adds edge instead of reducing payout — likely a bug) and base-bet bonus are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file; bet validation, free-spin integration, jackpot path, wild-multiplier accumulation, and strategy adjustment are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Transitive coverage via spinReel/getReelSymbols, but those exports are also untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists; no transitive coverage from any tested caller._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists; private function with no tested callers._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists; transitive callers spinReel/getReelWeights are also untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Core weighted-random logic (boundary at r==total, fallback return) has zero test coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Exported and called by src/factories.ts but no tests cover its behavior or edge cases (invalid reelIndex, distribution correctness)._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Consumed by src/engine.ts spin() but no tests verify the returned symbol list._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Consumed by src/engine.ts spin() but no tests cover valid/invalid reelIndex or returned weight arrays._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists; sole caller getPayMultiplier is also untested, so no transitive coverage applies._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file found. Callers src/engine.ts and src/legacy.ts are not confirmed to have tests that exercise this symbol._
- **[tests] `UNCOVERED`** — src/events.ts:1 (EventHandler) — _No test file exists for this source file. Type alias has no runtime behavior, but transitive coverage via SpinEventEmitter is also absent._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file found. on/off/emit methods and multi-listener behavior, handler removal, and emit-with-args are untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. Constant is consumed by src/engine.ts but no tests verify its value or usage._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file exists. Used by the critical `spin` function in engine.ts — pass-through payout behavior is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime behavior beyond defining the interface, but still untested._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts (full slot machine spin logic), yet has zero direct tests — no coverage of correct reel count, row count igno…_
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Critical path: feeds scatter count into handleFreeSpins via spin(). Edge cases untested: empty reels, zero scatters, exactly 3 scatters, scatters in multiple columns._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches untested: initial activation (scatters>=3, inactive), retrigger (scatters>=3, active), decrement (active, scatters<3, remaining>0), and deactivation (remain…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic consumed by `spin` with no coverage of: exactly 4 diamonds (boundary true), 3 diamonds (boundary false), 0 diamonds, diamonds spread across multiple reels vs. …_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical RNG utility consumed by core slot machine spin logic — missing coverage for: uniform distribution validation, single-item arrays, mismatched array lengths, zero/negative …_

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _No JSDoc. Type alias lacks description of valid range or constraints (e.g. 1–100 integer)._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent but omits @param descriptions for `lineWins` and `bet` (typed `any`), omits @returns, and does not document the unconditional floor `bet * 0.01`._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _No JSDoc. Primary exported public API. Throw condition for invalid bet, side effects (emitter, free-spin state mutation), and return shape are entirely undocumented in-source. (deliberated: confirmed …_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Public export with no JSDoc. Valid reelIndex range (0–4), return shape (3-element column), and that each cell is sampled independently are all undocumented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Public export with no JSDoc. Returning the shared SYMBOLS array (mutable reference) rather than a copy is an undocumented contract detail._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Public export with no JSDoc. Valid reelIndex range (0–4), that the returned array is the live reference (no defensive copy), and the weight-sum semantics are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc. Missing: what 'count' represents, what the returned number means (base multiplier for lineBet calculation), and that WILD/SCATTER always return 0._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Class and all three public methods (on, off, emit) lack JSDoc. No description of purpose, event name conventions, or method parameters/return values._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _Exported constant has no JSDoc. The event name string value is self-evident but when/why this event is emitted (after a completed spin in engine.ts) is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, contract, and intended extension points are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on class or method. The pass-through behavior (no payout adjustment) is non-obvious from the name alone and warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc on the class or its abstract method `buildReels`. Purpose of `reelCount`/`rowCount` params and the shape of the returned `Symbol[][]` are undescribed._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on the class or its `buildReels` override. The silent discard of `_rowCount` and the delegation to `spinReel` are undocumented behavioural details that consumers cannot discover without readi…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of grid traversal logic, parameter shape (2D reel array), and return value (scatter count integer)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-obvious state machine with three distinct transitions (activate, retrigger, decrement/deactivate) and a mutation side-effect — all undocumented. Parameters and return void not de…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot condition (4+ DIAMONDs anywhere on grid), parameter shape, and return semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _Block comment describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, mismatched lengths, zero-weight item…_

