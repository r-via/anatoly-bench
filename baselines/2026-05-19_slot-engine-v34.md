# Anatoly Bench Score — slot-engine

**Run:** `2026-05-19_165728` · Anatoly v0.9.6 (`9be94c0-dirty`) · project main @ `7dc4cc6`
**Duration:** 12m 47s · **Cost:** $5.96 · **Tokens:** 230 in / 142K out

**Global F1:** 71.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 61.5% | 57.1% | 66.7% | 4 | 2 | 3 | 10m 12s | $0.83 | 40K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 1m 7s | $0.06 | 10K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 31s | $0.09 | 13K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 3m 29s | $0.36 | 11K |
| tests | — | — | — | — | 0 | 0 | 0 | 55s | $0.08 | 3K |
| best-practices | ✓ | 76.9% | 100.0% | 62.5% | 5 | 3 | 0 | 15m 27s | $1.10 | 60K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 55s | $0.24 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 1m 12s | $0.23 | 4K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (6)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _Out-of-bounds reelIndex returns undefined but the signature promises number[], causing downstream callers to receive undefined without a type error unless noUncheckedIndexedAccess is enabled._
- **[correction] `NEEDS_FIX`** — src/factories.ts:9 (StandardReelBuilderFactory) — _`rowCount` is discarded (`_rowCount`) and never forwarded to `spinReel(i)`. If `spinReel` returns a fixed-length strip, the concrete implementation silently violates the contract declared by the abstr…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type; 0 runtime importers, 0 type-only importers._
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Critical path: applies house edge incorrectly (adds edge instead of reducing, then adds flat 1% of bet), untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. This is the most critical untested function — probabilistic selection logic with boundary behavior (r exactly at accumulator boundary, zero-weight symbols) and a fallback return t…_
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts; untested out-of-range reelIndex would silently produce undefined weights._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. PAY_TABLE is internal but drives all payout logic tested indirectly through getPayMultiplier._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout path. Missing tests for all symbols, all count branches (3/4/5), unknown symbol returning 0, and count < 3 edge case._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Core event emitter used by src/engine.ts — on/off/emit logic, duplicate handler behavior, off with unknown event, emit with no listeners, and multi-arg propagation are all unteste…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant string used by src/engine.ts as an event name — no tests verify its value or usage._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Used by src/engine.ts, meaning buildReels() is a critical path: reel count, row count handling, and spinReel delegation are all untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Used by engine.ts but no coverage for empty reels, single scatter, exactly 3 scatters, or mixed symbol grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. Critical state-mutation logic with 4 distinct branches (activate, retrigger, decrement, deactivate) has zero test coverage._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic called by src/engine.ts has zero test coverage — no happy path, no edge cases (empty reels, fewer than 4 diamonds, exactly 4, nested structure variations)._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, boundary roll exactlyequal to cumulative weight, and non-uniform weight…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent, but omits @param for both parameters (notably bet typed as any), missing @returns, and does not document the unconditional bet*0.01 floor. (deliberated: …_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: description of purpose, explanation of reelIndex (valid range 0–4), and clarification that the returned Symbol[] represents 3 rows for that column._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No explanation of why callers would need the canonical symbol list or that order matches weight array indices._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: description of reelIndex parameter (valid range, what out-of-bounds returns), and what the returned number[] represents (ordered weights parallel to getReel…_
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported function with no JSDoc. Missing: param descriptions for symbol and count, return value semantics, behavior for out-of-range counts (below 3 or above 5 returns 0), and WILD/SCATTER handling._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Public API with non-trivial semantics (lazy listener array init, silent no-op on missing event in off/emit) has zero documentation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. Event name constant with no explanation of when it is emitted or what args handlers should expect._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on the class or its `buildReels` method. Parameters `reelCount` and `_rowCount` (notably ignored) are undocumented, and the return structure is not explained._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. State mutation side effects, the three transition branches, and the re-trigger behavior (adding 10 vs resetting) are non-obvious and undocumented._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. The function name hints at purpose but the threshold (>=4 diamonds), grid assumptions, and return semantics are not documented inline._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param and @returns tags. No documentation of edge cases: empty arrays, mismatched array lengths, zero/negative weights, or why the last item is returne…_

