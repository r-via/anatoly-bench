# Anatoly Bench Score — slot-engine

**Run:** `2026-05-15_213734` · Anatoly v0.9.6 (`35419cc-dirty`) · project main @ `7dc4cc6`
**Duration:** 11m 58s · **Cost:** $6.34 · **Tokens:** 230 in / 189K out

**Global F1:** 58.3%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 36.4% | 28.6% | 50.0% | 2 | 2 | 5 | 13m 51s | $1.73 | 55K |
| utility | ✓ | 76.9% | 71.4% | 83.3% | 5 | 1 | 2 | 1m 12s | $0.08 | 13K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 2m 7s | $0.11 | 18K |
| overengineering | ✓ | 57.1% | 50.0% | 66.7% | 2 | 1 | 2 | 3m 49s | $0.61 | 11K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 18s | $0.28 | 4K |
| best-practices | ✓ | 54.5% | 60.0% | 50.0% | 3 | 3 | 2 | 21m 14s | $2.38 | 81K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 4s | $0.39 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 36s | $0.48 | 8K |

## Misses (13)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-RTP** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (wrong-sign-on-house-edge)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-WILD-HELPER** — src/wild.ts (applyWildBonus) — expected verdict `DEAD` (dead-helper-superseded-by-inline)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (7)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:115 (spin) — _`throw "invalid bet"` throws a primitive string. Any catch block testing `err instanceof Error` silently falls through; `err.message` is undefined. Replace with `throw new Error("invalid bet")`._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] returns undefined for any out-of-range index, violating the declared number[] return type and allowing callers to proceed with an undefined array reference._
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with 0 importers across the codebase_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical rows produced by calling weightsToArray(DEFAULT_WEIGHTS) five times. All reels share the same weights (confirmed by reference docs), so storing a 2-D array of duplicates adds indirectio…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_

## Unscored findings (43)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math and its 0.05 value is never validated by any test._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Trivial constant but its conditional branch in spin() is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve round-trip, missing-key behavior, and type-unsafe cast are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline shape (10 lines × 5 columns, values 0–2) is never validated._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-lead resolution, SCATTER short-circuit, run-length counting, and run < 3 rejection are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-multiplier exponential bonus, no-win null return, and lineBet scaling are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. House-edge application, 1% base-bet floor, Math.ceil rounding, and zero-wins path are all untested. Exported and business-critical._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Array contents and ordering are never verified._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values are never asserted and sum (120) is never validated._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Number of reels (5) and per-reel weight arrays are never verified._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Weighted distribution logic, boundary condition (r exactly at boundary), and fallback return are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Used by src/factories.ts; column length (3), valid symbol membership, and invalid reelIndex behavior are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Used by src/engine.ts; returned array identity and contents never asserted._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Used by src/engine.ts; out-of-range reelIndex returning undefined is never caught._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant, but its correctness (payout values per symbol tier) is entirely untested via getPayMultiplier._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file. Imported by src/engine.ts and src/legacy.ts — critical payout path. Missing coverage of valid counts (3/4/5), unknown symbols returning 0, and invalid counts (1, 2, 6+)._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file. No tests verify the contract or subclass behavior._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, making this a critical path — identity passthrough behavior is untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Missing coverage for: empty reels, no scatters, single scatter, multiple scatters across columns, scatters in same column._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger during active spins, countdown decrement, deactivation at 0, inactive state with <3 scatters._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical methods on()/off()/emit() are untested — including edge cases like emitting with no listeners, removing a handler mid-loop, multiple handlers for the same event, and dupl…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is a string sentinel used by src/engine.ts; no tests verify it is emitted at the correct lifecycle point._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — neither happy path nor edge cases (zero reelCount, large values, reel shape) are tested._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, negative weights, single-item arrays, and boundary roll values (roll === cumulative). The …_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), edge cases (empty reels, fewer than 4 diamonds) all unte…_

### documentation (14)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes the house-edge application and ~95% RTP target, but omits @param for lineWins and bet (bet is typed as any), @returns, and the unconditional bet×0.01 floor added regardless of wins._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), return shape (3-element column), and that symbols are drawn independently per row._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of what the returned array represents or its ordering significance._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range, that the returned array indices correspond to SYMBOLS order, and whether the array is a copy or a live reference._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing description of the multiplier semantics, what `count` values are valid, what the multiplier is applied to (lineBet), and that out-of-range counts return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with a single abstract method — purpose, extension contract, and intended usage pattern are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through behavior is not obvious from the name alone; a brief doc explaining the identity transform and its role as the default engine strategy is absent._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what counts as a scatter, the grid traversal logic, and the return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-obvious state machine logic (trigger threshold, initial award of 10, retrigger +10, decrement-to-deactivate) requires documentation. Parameters and side-effect mutation of state …_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its methods (on, off, emit). Public API with non-trivial lifecycle semantics (per-spin instantiation, listener management) warrants at minimum class-level and method-le…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. As a public event-name constant, it should document what triggers this event and what arguments are passed to handlers._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or buildReels override. Missing explanation of why _rowCount is ignored, what spinReel does per reel index, and the shape of the returned Symbol[][]._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of purpose, parameter shape (2D reel array), return semantics, and the ≥4 DIAMOND threshold rule._

