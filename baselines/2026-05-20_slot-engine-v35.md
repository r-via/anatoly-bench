# Anatoly Bench Score — slot-engine

**Run:** `2026-05-20_090415` · Anatoly v0.9.6 (`8b87079-dirty`) · project main @ `7dc4cc6`
**Duration:** 21m 38s · **Cost:** $6.04 · **Tokens:** 230 in / 134K out

**Global F1:** 70.4%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 61.5% | 57.1% | 66.7% | 4 | 2 | 3 | 8m 56s | $0.74 | 33K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 50s | $0.05 | 6K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 12s | $0.07 | 10K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 3m 31s | $0.36 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 10s | $0.18 | 3K |
| best-practices | ✓ | 71.4% | 100.0% | 55.6% | 5 | 4 | 0 | 17m 41s | $1.19 | 65K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 18s | $0.26 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 35s | $0.47 | 8K |

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

## False positives (7)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:25 (EngineContainer) — _Map.get() returns undefined for unknown keys; the 'as T' cast drops that signal. Any caller with an unregistered key receives undefined typed as T and crashes on first use (e.g. calling it as a functi…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:56 (getReelWeights) — _No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for indices outside 0–4, silently returning undefined while TypeScript types the return as number[]; callers relying on the type will…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type alias with 0 runtime importers and 0 type-only importers_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Context-adapted rules_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects computePayout output but is never verified._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false; branch it guards is dead in production and untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve type-casting behavior and missing-key silent undefined return are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions are structural inputs to evaluateLine and spin; correctness never verified._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical logic: WILD-as-lead substitution, SCATTER early return, run-length cutoff at 3 — all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-count exponential multiplier formula and null propagation from checkLine are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Exported public function: house-edge application, minimum bet bonus, Math.ceil rounding, and zero-win path all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Critical probabilistic logic (weighted random selection, boundary at r==total, fallback last item) is entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts; produces 3-symbol columns driving game state. No coverage of invalid reelIndex or output length guarantees._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; trivial accessor but untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; undefined behavior for out-of-range reelIndex is untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Called by src/engine.ts and src/legacy.ts — critical payout logic with no coverage for count boundaries (2, 3, 4, 5, 6), unknown symbols, or WILD/SCATTER inputs._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts but adjustPayout (identity function) is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical class used by src/engine.ts with on/off/emit methods — none are tested. Missing: multiple listeners, off() deregistration, emit with no listeners, emit argument propagati…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant imported by src/engine.ts but never exercised in any test._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Used by src/engine.ts but zero test coverage for scatter counting logic._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. Critical state machine with 4 branches (activate, retrigger, decrement, deactivate) — all untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Used by src/engine.ts (critical path), but buildReels — including loop logic, reelCount/rowCount handling, and spinReel integration — has zero test coverage._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic (jackpot detection) imported by src/engine.ts has zero coverage — no happy path, edge cases (empty reels, exactly 4 diamonds, 3 diamonds), or boundary tests._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file found. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, and boundary roll values (roll === cumulative)._

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc describing purpose and RTP intent, but omits @param descriptions for lineWins and bet, omits @returns, and does not document the unconditional bet*0.01 floor or the incorrect HOUSE_EDGE di…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: reelIndex valid range (0–4), that the return is always a 3-element column, and that selection is independent per row._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of what is returned or its significance as the canonical ordered symbol list._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: reelIndex valid range (0–4), that the returned array is ordered to match getReelSymbols(), and that it is a direct reference (not a copy)._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public function with no JSDoc. Missing: what 'count' represents (run length), valid input range, that WILD/SCATTER and count < 3 return 0, and that the return value is a bet multiplier._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc. Abstract base class with no description of its role in the payout pipeline, what implementors must guarantee, or extension contract for `adjustPayout`._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc. 'Default' is ambiguous without a comment stating this is an identity pass-through that leaves `SpinResult` unchanged._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Public API lacks parameter/return/behavior documentation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. The string value 'spin:done' is visible but the intended semantics (when it fires, what args are passed) are not documented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, the grid traversal behavior, and the return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. The state-transition logic (activate on ≥3 scatters, retrigger adds 10, decrement and deactivate) is non-trivial and entirely undocumented. Missing @param descriptions and mutation s…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or its buildReels method. Notable behavior — rowCount is silently ignored, each reel always yields 3 rows via spinReel() — is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing description of jackpot logic, the DIAMOND counting mechanic, the hardcoded threshold of 4, and what the boolean return value signifies._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes the algorithm and general purpose, but omits @param descriptions (no explanation of what happens when weights.length !== items.length, or when weights contain negative/zero values), no…_

