# Anatoly Bench Score — slot-engine

**Run:** `2026-06-14_143754` · Anatoly v0.9.6 (`94406c2-dirty`) · project main @ `7dc4cc6`
**Duration:** 12m 13s · **Cost:** $3.95 · **Tokens:** 171 in / 153K out

**Global F1:** 73.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 72.7% | 57.1% | 100.0% | 4 | 0 | 3 | 12m 29s | $0.97 | 48K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 45s | $0.09 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 16s | $0.14 | 6K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 4s | $0.34 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 14s | $0.18 | 3K |
| best-practices | ✓ | 50.0% | 60.0% | 42.9% | 3 | 4 | 2 | 20m 0s | $1.33 | 75K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 4s | $0.24 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 25s | $0.41 | 7K |

## Misses (9)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (4)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (48)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (31)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _Type alias with no test file present._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists; transitive coverage through computePayout is moot with zero tests._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists; no transitive coverage through spin._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file found; class is untested directly or indirectly._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file; no transitive coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file; no transitive coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file found._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file; no transitive coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file found. Critical payout logic — including the misapplied HOUSE_EDGE (inflates rather than reduces payout) and unconditional bet*0.01 floor — is completely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file found. Primary exported entry point imported by src/index.ts is entirely untested, including bet validation, wild multiplier logic, free spin handling, and jackpot detection._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Transitive coverage would require spinReel/getReelSymbols to be tested, but they are not._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists to verify weight values or their effect on symbol distribution._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists. Ordering of weights relative to SYMBOLS array is critical and untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. Transitive coverage would require spinReel/getReelWeights to be tested, but they are not._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Key edge cases untested: single-item array, all-zero weights, boundary rounding (r == acc), and statistical distribution correctness._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Used by src/factories.ts. Edge cases like out-of-range reelIndex (REEL_WEIGHTS[reelIndex] would be undefined) are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Consumed by spin() in src/engine.ts for core slot logic; symbol list integrity is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Consumed by spin() in src/engine.ts; out-of-range reelIndex returns undefined silently, untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Transitive coverage via getPayMultiplier would apply, but getPayMultiplier itself has no tests._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Consumed by spin() and computeLegacyPayout() in engine.ts and legacy.ts — no evidence those callers are tested either._
- **[tests] `UNCOVERED`** — src/events.ts:1 (EventHandler) — _No test file exists. Type alias has no runtime behavior, but transitive coverage via SpinEventEmitter is also absent._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file found. Critical behaviors untested: on/off/emit lifecycle, multiple handlers, handler removal, emit with no listeners, and args forwarding. Used by core engine.ts spin function._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. Constant used as event key in engine.ts spin function but no tests verify it is emitted or consumed correctly._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by the critical `spin` function in engine.ts — identity pass-through behavior is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime behavior beyond interface contract — but the factory pattern is untested entirely._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts (full slot machine spin logic), yet zero tests verify reel count, row count handling, or that `spinReel` is c…_
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Critical path: called by spin() in engine.ts on every spin. Missing tests for zero scatters, exactly 3 scatters, mixed reels, and empty reels._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches untested: initial activation (scatters>=3, inactive), re-trigger (scatters>=3, active), decrement with remaining>1, and deactivation on remaining<=0._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical RNG utility consumed by core spin logic with no coverage of edge cases: zero-weight items, single-item arrays, negative weights, weights summing to zero, or distribution …_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game-logic function consumed by the core spin engine with no coverage of the DIAMOND counting threshold (>=4), boundary cases (exactly 3 vs 4 diamonds), empty reels, or m…_

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Exported type alias with no JSDoc. 'Bet' does not convey constraints (integer-only, range 1–100) that are enforced in spin()._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and RTP intent, but omits @param for lineWins and bet, no @returns, and does not document the unconditional floor (bet * 0.01) or that HOUSE_EDGE inflates rather than reduces t…_
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _Primary exported function with no JSDoc. Missing @param bet (valid range, integer constraint), @returns SpinResult shape, @throws for invalid bet, and documentation of side effects (emitter, strategy …_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), meaning of the 3-element return array (one Symbol per row), and behavior on out-of-range index._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Name is descriptive but no comment on ordering or that the array is the canonical symbol registry used by weight arrays._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), correspondence between returned array indices and symbol order, and that weights are read-only at runtime._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: parameter descriptions, return semantics, and the key constraint that WILD/SCATTER return 0 (non-obvious caller behavior)._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). All three methods are exported public API and lack parameter/return/behavior documentation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. As a named event constant consumed externally by the spin engine, it should describe when this event is emitted and what args are passed._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, contract, and intended extension points are not described._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on class or method. `adjustPayout` returns the result unchanged — that passthrough behavior is non-obvious and warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc. Abstract factory contract for building reels is non-obvious: callers need to know what `reelCount`/`rowCount` mean, what the returned `Symbol[][]` shape represents, and why an abstract facto…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or `buildReels`. Notable behavior (ignores `_rowCount`, delegates to `spinReel` per reel index) is invisible to callers. Consumed by `spin()` in engine.ts, making its contract part o…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter type semantics, and return value meaning._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-obvious state machine logic (activate, retrigger, decrement/deactivate) with side-effect mutation of state warrants documentation of all three transition branches, parameters, an…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes the algorithm and use case, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, …_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Non-obvious behavior (counts DIAMOND symbols across entire grid, threshold of 4+) is not documented inline. The parameter type and return semantics are not explained._

