# Anatoly Bench Score — slot-engine

**Run:** `2026-05-18_154156` · Anatoly v0.9.6 (`3c119a2-dirty`) · project main @ `7dc4cc6`
**Duration:** 11m 37s · **Cost:** $6.09 · **Tokens:** 230 in / 185K out

**Global F1:** 57.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 33.3% | 28.6% | 40.0% | 2 | 3 | 5 | 15m 48s | $1.84 | 59K |
| utility | ✓ | 76.9% | 71.4% | 83.3% | 5 | 1 | 2 | 1m 27s | $0.10 | 13K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 39s | $0.11 | 14K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 3m 22s | $0.58 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 25s | $0.28 | 3K |
| best-practices | ✓ | 46.2% | 60.0% | 37.5% | 3 | 5 | 2 | 19m 49s | $2.32 | 79K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 8s | $0.39 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 16s | $0.47 | 6K |

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

## False positives (9)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:44 (spinReel) — _REEL_WEIGHTS[reelIndex] returns undefined for reelIndex ∉ [0, 4]. undefined is passed as wts to pickFromWeighted, where wts.reduce() throws TypeError at runtime._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] is undefined for reelIndex ∉ [0, 4]; TypeScript return type number[] does not include undefined, so callers relying on the declared type silently receive undefined._
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Inferred slot-machine domain from reel/payline/jackpot/DIAMOND/SEVEN/SCATTER vocabulary and RTP-95% target in README. `Math.random()` (V8 xorshift128+) is non-deterministically seeded and non-auditabl…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type alias with 0 runtime importers and 0 type-only importers_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/events.ts — _JSDoc on public exports_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. Constant directly affects payout calculations but is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Trivial constant but still uncovered._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior and type-unsafe cast are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions are untested; incorrect row indices would silently corrupt all win evaluations._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical logic (WILD substitution, leading WILD fallback, SCATTER guard, run counting) has no coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier formula (exponential bonus) and null-propagation from checkLine are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. House-edge application, minimum-bet floor addition, and Math.ceil rounding are all untested. Exported and business-critical._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Array contents and ordering are untested, yet symbol order implicitly couples to REEL_WEIGHTS index alignment._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values (e.g. DIAMOND=30 highest, SEVEN/WILD/SCATTER=5) are untested and silently affect RTP/odds._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file. Order of array elements must match SYMBOLS order exactly; this coupling is never verified._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Five identical reel weight arrays are assumed; homogeneity and length (5 reels × 8 symbols) are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Critical gambling logic: distribution correctness, boundary at r===acc, and fallback return are all untested. Math.random seeding is not mocked anywhere._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts making it a critical code path. Return length (3 rows), valid symbol membership, and out-of-bounds reelIndex behavior are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; returned array identity and contents are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently — untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant; coverage only via getPayMultiplier tests, which also don't exist._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Used by engine.ts and legacy.ts — critical business logic (payout calculation) with zero test coverage._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, so untested pass-through behavior in a critical path._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical behaviors untested: on() accumulating multiple handlers, off() removing only the target handler, emit() invoking all handlers with args, emit() on unknown event, off() on…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant string used as an event key in src/engine.ts; its integration with SpinEventEmitter.emit/on is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` (a critical path), but neither happy path (correct reel count, correct shape) nor edge cases (reelCount=0, rowCount ignored) are tested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts with no coverage for empty reels, no scatters, single scatter, or multiple scatters across columns._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches uncovered: initial activation (scatters>=3), retrigger while active, decrement while active, and deactivation at remaining<=0._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item arrays, negative weights, and boundary roll == cumulative. Called by src/engin…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical business logic (jackpot payout trigger) used by src/engine.ts has zero coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, single reel), or…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block describing purpose and house-edge intent, but no @param tags for lineWins or bet, no @returns tag, and the RTP claim ("~95%") is contradicted by the code adding HOUSE_EDGE on top of …_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported with no JSDoc. Missing: valid range for reelIndex (0–4), that it returns exactly 3 symbols per call, and that each symbol is drawn independently._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported with no JSDoc. Name is clear but return value is a mutable reference to the internal SYMBOLS array — a potentially important side-effect not documented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported with no JSDoc. Valid reelIndex range (0–4), the meaning of each element in the returned array, and whether it is a live reference are all undocumented. (deliberated: confirmed — Confirmed. sr…_
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing @param descriptions for symbol and count, no @returns explaining that the multiplier is applied to lineBet (not raw bet), and no note that counts < 3 or > 5 return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with a single abstract method; purpose, extension contract, and usage pattern are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through behavior of adjustPayout is not described._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its methods (on, off, emit). Public API with non-trivial behavior (listener deduplication via filter, silent no-op on missing event in off/emit) deserves at minimum cla…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. As a public event-name constant consumed by external callers, it should document when it is emitted and what payload to expect._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. The concrete implementation silently ignores _rowCount, which is a non-obvious behavioral contract that warrants documentation. buildReels also lacks @param/@returns annotations._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, the shape of the input grid, and the return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. The trigger threshold (≥3 scatters), initial award (10 spins), retrigger behavior (+10), and decrement-on-spin logic are all undocumented. State mutation side-effects are not noted._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, missing @returns, and no mention of edge cases (empty arrays, mismatched lengths, negative weights). (del…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols), parameter shape, and return value semantics._

