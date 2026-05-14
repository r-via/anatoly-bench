# Anatoly Bench Score — slot-engine

**Run:** `2026-05-14_104251` · Anatoly v0.9.6 (`679bb69-dirty`) · project main @ `7dc4cc6`
**Duration:** 9m 48s · **Cost:** $5.63 · **Tokens:** 230 in / 172K out

**Global F1:** 67.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 52.6% | 71.4% | 41.7% | 5 | 7 | 2 | 11m 41s | $1.47 | 48K |
| utility | ✓ | 76.9% | 71.4% | 83.3% | 5 | 1 | 2 | 1m 15s | $0.11 | 11K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 39s | $0.13 | 15K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 11s | $0.51 | 11K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 6s | $0.30 | 3K |
| best-practices | ✓ | 57.1% | 80.0% | 44.4% | 4 | 5 | 1 | 19m 6s | $2.34 | 82K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 15s | $0.30 | 4K |
| _refinement_ | — | — | — | — | — | — | — | 3m 5s | $0.46 | 8K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-WILD-HELPER** — src/wild.ts (applyWildBonus) — expected verdict `DEAD` (dead-helper-superseded-by-inline)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (13)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:25 (EngineContainer) — _Map.get() returns undefined for unknown keys; casting that to T propagates undefined as a typed value, causing obscure runtime failures downstream instead of an immediate diagnostic error._
- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Math.ceil rounds payout UP, giving fractional-coin remainders to the player instead of the house. Slot-machine industry convention (inferred from reel/payline/jackpot/WILD vocabulary throughout this f…_
- **[correction] `NEEDS_FIX`** — src/engine.ts:115 (spin) — _throw "invalid bet" throws a string literal. String throws carry no stack trace and bypass instanceof Error guards; must be throw new Error("invalid bet")._
- **[correction] `NEEDS_FIX`** — src/engine.ts:122 (spin) — _reelsModule resolved from container but never referenced in the function body; factory.buildReels() does not receive it. The container registration is a dead stub and the actual reel configuration is …_
- **[correction] `NEEDS_FIX`** — src/reels.ts:53 (getReelSymbols) — _Returning SYMBOLS directly allows external code to mutate it (push, splice, index assignment). Mutations affect the items argument seen by every subsequent pickFromWeighted call inside spinReel. Shoul…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] returns undefined for out-of-range index, silently violating the declared return type number[]. Additionally, callers mutating the returned array directly mutate REEL_WEIGHTS[r…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:12 (StandardReelBuilderFactory) — _`spinReel(i)` ignores `_rowCount`. If `spinReel` supports a row-count argument (or if the returned reel must be sliced to `rowCount` symbols), the caller's intent is silently dropped, producing reels …_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type alias with zero runtime and zero type-only importers_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects RTP calculation in computePayout; its effect is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false; branch it guards is dead and untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve logic (including unsafe cast) has no coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions drive all win evaluation; correctness is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical logic for WILD substitution, SCATTER skip, run counting, and minimum-3 threshold has zero coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-count bonus formula (exponential multiplier) and null-return paths are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Exported function with house-edge application, base-bet bonus, and ceil rounding has no tests despite being a critical financial calculation._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS drives all reel outcomes; no coverage of its contents or ordering._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values directly affect payout math; sum, individual values, and proportions are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Five-reel structure and uniform weight application are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Critical weighted-random logic — boundary at r===acc, total=0 edge case, and last-item fallback are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts making it a critical path; 3-row column length, valid symbol membership, and out-of-range reelIndex are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; return identity and length are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; undefined return for invalid reelIndex and correct weight array identity are untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Pay table values are business-critical and untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic with count boundary cases (count<3, count=3,4,5, unknown symbol) all untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Core event emitter used by engine.ts — on/off/emit methods, handler deduplication, multi-listener dispatch, and removal logic are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant used in engine.ts but no tests verify it is emitted under the correct conditions._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` (critical path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, varying rowCount) are exercised._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts for scatter counting — missing tests for empty reels, single scatter, exactly 3, and mixed symbol grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches (activation, re-trigger, decrement, deactivation) are all untested. Used by engine.ts in a critical game-logic path._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic with no coverage — missing happy path (≥4 diamonds), boundary (exactly 4 vs 3), empty reels, and mixed-symbol cases. Called by src/engine.ts, making untested b…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weight boundary conditions (roll == cumulative), and distribution unifo…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent but omits: parameter types/descriptions, the unexplained `bet * 0.01` floor addition, return value description, and the fact that `bet` is typed `any`. (d…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: what reelIndex range is valid, that it returns 3 symbols (one per row), and that results are independently sampled._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of what the returned array represents or its ordering significance._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid range for reelIndex, what the returned numbers represent (unnormalized weights), and their correspondence to getReelSymbols() ordering._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing documentation for parameters (symbol, count), return value semantics (multiplier relative to what bet unit?), and the fact that counts outside {3,4,5} return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Public API lacks parameter descriptions, return info, and behavioral notes (e.g. silent no-op on off() with unknown handler)._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. Purpose and when this event is emitted are not described._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. Missing description of the standard build strategy, why _rowCount is ignored, and what spinReel produces per reel index. (deliberated: confirmed — Confirmed. factories.ts:9 accepts `…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. what constitutes a scatter, why counting matters)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. State mutation side-effects, threshold logic (>=3 scatters), spin award amount (10), and decrement/deactivation behavior are all undocumented. (deliberated: confirmed — Partially con…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot logic, explanation of the 4-diamond threshold, parameter shape (2D reel array), and boolean return semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but lacks @param descriptions (items, weights), @returns, error behavior for mismatched array lengths or all-zero weights, and @template T. (deliberated: reclassi…_

