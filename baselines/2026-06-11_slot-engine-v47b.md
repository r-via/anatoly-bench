# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_095206` · Anatoly v0.9.6 (`9255a96-dirty`) · project main @ `7dc4cc6`
**Duration:** 10m 19s · **Cost:** $2.94 · **Tokens:** 177 in / 141K out

**Global F1:** 75.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 60.0% | 42.9% | 100.0% | 3 | 0 | 4 | 12m 39s | $0.75 | 45K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 1m 2s | $0.08 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 14s | $0.10 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 9s | $0.19 | 9K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 10s | $0.10 | 3K |
| best-practices | ✓ | 72.7% | 80.0% | 66.7% | 4 | 2 | 1 | 18m 34s | $1.06 | 68K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 56s | $0.14 | 6K |
| _refinement_ | — | — | — | — | — | — | — | 2m 42s | $0.43 | 8K |

## Misses (9)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (2)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (47)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (30)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE affects payout computation but is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior, type-safety gaps, and missing-key behavior are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions drive all win evaluation; correctness is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-lead resolution, SCATTER short-circuit, run counting, and minimum-run threshold (3) are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-count multiplier formula and payout calculation are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. House-edge application, flat bet bonus, zero-win path, and Math.ceil rounding are untested. Exported and used by spin; critical business logic._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists. Input validation (invalid bet throws, >100 warns), reel construction, payline evaluation, scatter/free-spin wiring, jackpot detection, and event emission are all untested. Primary…_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Array content and ordering are untested despite being critical to weighted selection alignment._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Default weight values (sum, individual entries) are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file. Ordering of returned array relative to SYMBOLS array is untested — a mismatch would silently corrupt probability distribution._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Shape (5 reels, 8 weights each) and values are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probability logic is entirely untested: boundary conditions (r == 0, r just below total), uniform weights, single-item list, and the fallback return on the last item are all uncover…_
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Called by src/factories.ts; return shape (array of 3 Symbols), valid symbol membership, and out-of-range reelIndex behavior are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Used by src/engine.ts; returned reference equality (mutability hazard) and array contents are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Used by src/engine.ts; out-of-range reelIndex (returns undefined) and returned array mutability are untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. PAY_TABLE drives all payout calculations; zero coverage._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts — a critical payout path with no direct tests. Edge cases (unknown symbol, count < 3, count > 5, each valid count 3/4/5 per symbol) are…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file exists. Used by src/engine.ts, making untested identity-passthrough behavior a risk for downstream engine tests._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical class used by src/engine.ts with on/off/emit methods — none are tested. Missing coverage for: multiple handlers, handler removal, emit with args, emit with no registered …_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. String constant imported by src/engine.ts; no tests verify it is used correctly as an event name._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract base class with no runtime behavior beyond interface contract, but the contract itself is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Concrete implementation used by src/engine.ts — buildReels loop logic and spinReel delegation are completely untested, including edge cases like reelCount=0 or varying rowCount._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. No coverage for scatter counting across reels, empty reels, zero scatters, or mixed symbol grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. All branches untested: initial activation (scatters>=3), retrigger while active, decrement, and deactivation on remaining<=0._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, all-zero weights, single-item input, and boundary roll == cumulative. Called by src/engine…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic called by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), under-threshold, and empty reel cases all untested._

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _No JSDoc. Exported public type with no description of valid range or usage semantics._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent, but omits @param for both lineWins and bet, omits @returns, and does not explain the unconditional bet*0.01 floor or the Math.ceil rounding behavior._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _No JSDoc on the primary exported function. Bet validation rules, thrown string error, emitter side-effect, and SpinResult structure are all undocumented. (deliberated: confirmed — Confirmed multiple c…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), explanation that it returns 3 symbols (one column), and that each cell is sampled independently._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API. No JSDoc. No description of return value ordering or whether the array is a copy or a live reference._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), explanation that the returned array maps 1-to-1 with getReelSymbols(), and whether mutations to the result affect internal state._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc. Missing: description of `count` valid range (3–5), that WILD/SCATTER return 0, and that the return is a dimensionless multiplier applied to lineBet._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, intended use, and the contract of `adjustPayout` are not described._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc. It is not clear that this is a passthrough/identity strategy — the name alone does not convey that payouts are returned unchanged._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Purpose, event model, and method parameters/return values are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc explaining when this event is emitted or what payload (if any) it carries._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Purpose, contract, and intended extension pattern are not described._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or its buildReels method. Parameters reelCount/_rowCount, return value shape, and the ignored _rowCount are unexplained._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter semantics (grid dimensions, symbol type), and return value meaning._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Missing description of the three state-transition branches, mutation side-effect on `state`, and parameter semantics for `scatters` threshold._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, missing @returns, and no mention of edge cases (empty arrays, mismatched lengths, zero/negative weights).…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. The function name hints at purpose but non-obvious details are undocumented: the DIAMOND-counting mechanic, the hardcoded threshold of 4, and that detection spans the full grid (not …_

