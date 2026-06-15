# Anatoly Bench Score — slot-engine

**Run:** `2026-05-18_143526` · Anatoly v0.9.6 (`3b27b7b-dirty`) · project main @ `7dc4cc6`
**Duration:** 13m 32s · **Cost:** $6.32 · **Tokens:** 230 in / 194K out

**Global F1:** 71.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 61.5% | 57.1% | 66.7% | 4 | 2 | 3 | 13m 54s | $1.62 | 51K |
| utility | ✓ | 76.9% | 71.4% | 83.3% | 5 | 1 | 2 | 43s | $0.07 | 6K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 2m 15s | $0.12 | 21K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 4m 12s | $0.65 | 13K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 7s | $0.28 | 3K |
| best-practices | ✓ | 66.7% | 100.0% | 50.0% | 5 | 5 | 0 | 21m 13s | $2.67 | 93K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 10s | $0.42 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 2m 46s | $0.50 | 9K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-WILD-HELPER** — src/wild.ts (applyWildBonus) — expected verdict `DEAD` (dead-helper-superseded-by-inline)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:44 (spinReel) — _REEL_WEIGHTS[reelIndex] returns undefined for reelIndex < 0 or >= 5. undefined is then passed to pickFromWeighted where wts.reduce(...) throws TypeError: Cannot read properties of undefined. Exported …_
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] is undefined for reelIndex < 0 or >= 5. TypeScript declares the return as number[] but callers receive undefined, breaking any downstream numeric operations without a compiler …_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type alias, 0 importers in codebase_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math and is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false, but its conditional branch is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior and type-unsafe cast are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton registration is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions drive win evaluation and are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD leading, SCATTER short-circuit, run length threshold (>=3), and mixed-WILD sequences are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null-result path are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. House-edge application (only when total>0), flat +1% bet bonus, and Math.ceil rounding are untested. Note: comment claims 95% RTP but HOUSE_EDGE inflates wins, which is the opposi…_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Constant defines the full symbol set used by engine and reels — no coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists. Weight values directly affect game odds — correctness and sum are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists. Ordering of array elements is critical for correct symbol-to-weight mapping; untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. Five-reel weight matrix drives all spin probabilities; untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Core probability logic — boundary conditions (r == acc), single-item lists, zero-weight items, and statistical distribution are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts; always returns 3-symbol column, out-of-bounds reelIndex, and distribution correctness are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts; identity and immutability of returned array untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; valid and invalid reelIndex handling untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Internal constant driving all payout logic; no tests validate the payout values for any symbol._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by engine.ts and legacy.ts — critical payout path. Missing tests for all count branches (3/4/5), unknown symbol returning 0, and count < 3 returning 0._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, making untested pass-through behavior a coverage gap in a critical path._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical paths untested: on/off/emit interactions, multiple listeners, handler removal idempotency, emit with no listeners, argument forwarding, and duplicate handler registration…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant string used as an event key in src/engine.ts; no tests verify its value or usage contract._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` (a critical path), yet no tests verify reel count, row count handling, or `spinReel` integration behavior._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Used by engine.ts; no coverage for empty reels, single scatter, exactly 3 scatters, or non-scatter symbols._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. Used by engine.ts; all branches untested: initial activation (scatters>=3), retrigger, decrement, deactivation on remaining<=0._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, fewer than 4 diamonds)._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item arrays, weight boundary conditions (roll == cumulative). Called by src/engine.ts, ma…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a two-line JSDoc but omits @param and @returns. The description says house edge 'maintains ~95% RTP' yet the code multiplies payout by (1 + HOUSE_EDGE), inflating rather than deducting, making the…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported with no JSDoc. Valid reelIndex range (0–4), always-3-row output, and weighted sampling behavior are all undocumented. (deliberated: confirmed — Confirmed. reels.ts:44 accesses REEL_WEIGHTS[re…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported with no JSDoc. No description of what the returned array represents or that it is the master symbol roster shared across all reels._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported with no JSDoc. Valid reelIndex range and the meaning/unit of the returned numbers are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing description of what the multiplier is applied to, what valid values of `count` are, and what 0 return means (no win vs. unknown symbol)._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with non-obvious contract (strategy pattern, post-processes SpinResult) warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through identity behavior is not obvious from the name alone; a one-liner describing the no-op contract would suffice._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its methods (on, off, emit). Public API with non-trivial lifecycle semantics (per-spin instantiation) has zero inline documentation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. Should document when this event is emitted and what payload is passed to handlers._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on the class or its `buildReels` method. Missing explanation of why `_rowCount` is ignored, what `spinReel` does per reel index, and what the returned 2-D array represents._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Function purpose (count SCATTER symbols across entire grid), parameter shape, and return value semantics are not described._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Critical state-mutation logic — trigger threshold (≥3 scatters), initial award (10 spins), retrigger (+10), and decrement-to-deactivate behavior — is entirely undocumented._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols), parameter shape (2D array of Symbol), and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negati…_

