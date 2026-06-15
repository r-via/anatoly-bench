# Anatoly Bench Score — slot-engine

**Run:** `2026-05-12_142348` · Anatoly v0.9.6 (`90c43bc-dirty`) · project main @ `7dc4cc6`
**Duration:** 8m 36s · **Cost:** $7.09 · **Tokens:** 233 in / 153K out

**Global F1:** 65.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 47.1% | 57.1% | 40.0% | 4 | 6 | 3 | 11m 21s | $1.77 | 43K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 48s | $0.06 | 8K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 20s | $0.07 | 10K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 3m 13s | $0.79 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 14s | $0.67 | 3K |
| best-practices | ✓ | 61.5% | 80.0% | 50.0% | 4 | 4 | 1 | 18m 31s | $2.40 | 73K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 54s | $0.67 | 5K |
| _refinement_ | — | — | — | — | — | — | — | 3m 20s | $0.53 | 8K |

## Misses (9)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (11)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Math.ceil rounds payouts up, paying players fractional coins the house should retain. Slot-machine industry convention requires Math.floor (house keeps the remainder). Domain inferred from jackpot/pay…_
- **[correction] `NEEDS_FIX`** — src/engine.ts:120 (spin) — _rng (line 120) and reelsModule (line 122) are resolved from the container but never referenced afterward. factory.buildReels(5, 3) builds the reels instead, bypassing the registered weightedPick RNG a…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:44 (spinReel) — _REEL_WEIGHTS has exactly 5 entries (indices 0–4). Any reelIndex outside that range returns undefined. pickFromWeighted then calls undefined.reduce() → TypeError at runtime. No guard exists._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] is undefined for reelIndex < 0 or >= 5. TypeScript types this as number[] but the runtime value is undefined, silently breaking any caller that relies on the return type._
- **[correction] `NEEDS_FIX`** — src/factories.ts:9 (StandardReelBuilderFactory) — _`_rowCount` is dropped entirely. The contract inherited from `AbstractReelBuilderFactory` implies callers control both dimensions. Because `spinReel` hard-codes 3 rows, a call like `buildReels(5, 4)` …_
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Inferred slot-machine domain from CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER symbol vocabulary in internal docs and the function's own JSDoc ('suitable for gaming RNG applications'). Math.random…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE silently inflates payouts (adds 5% instead of subtracting), which is a logic bug that tests would catch._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false; dead code path is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _Auto-resolved: import verified on disk (weightedPick found in ./rng.js)_
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Ten payline definitions drive all win detection; correctness of each pattern is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical win-detection logic with WILD substitution, SCATTER early-return, leading-WILD fallback, and run-length threshold — all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. WILD multiplier compounding formula (basePayout * (1 + wildCount) * 2^wildCount) and null-return paths are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Inverted house-edge application (multiplies by 1.05 instead of reducing), guaranteed 1% base return, and Math.ceil rounding are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS array defines the universe of valid slot symbols; no coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values directly affect payout probabilities — critical to verify they sum correctly and reflect design intent._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Verifying that all 5 reels are populated and each weight array has the correct length is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probability sampling logic — boundary conditions (r exactly at boundary, zero weights, single item) and fallback return are completely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts; should verify returns exactly 3 symbols, all within SYMBOLS, and handles out-of-range reelIndex gracefully._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; trivial accessor but its return value is relied upon by engine logic._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard, untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant but its correctness (payout values per symbol) is critical game logic with zero test coverage._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts — sits on a critical business path (payout calculation). Edge cases like unknown symbol, count < 3, count > 5, and each valid count (3/…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, so its pass-through behavior is untested directly and likely untested indirectly without engine tests confirmed._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. String constant used as event key in engine.ts; no tests verify correct usage as an event identifier._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, and full-grid scatter counts._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Missing coverage for all branches: initial activation (scatters>=3), retrigger while active, decrement while active, deactivation at remaining<=0, and inactive state with scatters…_
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. `buildReels` is used by `src/engine.ts` (critical path), but zero tests cover reel count, row count ignored behavior, or spinReel integration._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic (jackpot trigger) imported by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), under-threshold, and empty-reel cases all untested._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, boundary roll at exact cumulative threshold, and negative weights. Used…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent but omits @param for lineWins and bet (typed as any), omits @returns, and does not document the unconditional +1% floor (bet * 0.01). (deliberated: confir…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _No JSDoc. Missing: what reelIndex valid range is (0–4), that it returns 3 symbols (one per row), and that results are independent per row. (deliberated: confirmed — Confirmed ERROR with slight confide…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _No JSDoc. Public export with no description of what the returned array represents or its ordering._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _No JSDoc. Missing: valid reelIndex range, that returned array maps positionally to getReelSymbols(), and that weights are relative integers._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public function with no JSDoc. Missing: what 'count' represents, valid range of count values, return value of 0 for unrecognised symbols or counts outside 3–5, and that WILD/SCATTER always re…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract class with non-obvious extension-point semantics (post-calculation payout adjustment) warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through behavior is not self-evident from the name alone; the deliberate design choice (explicit no-op vs. missing-strategy check) is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. The constant's role as the canonical event name for spin completion, and the payload shape emitted with it, are not documented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what 'scatters' means in context, parameter docs for `reels`, and return value semantics (count of SCATTER symbols across the full grid)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Missing docs for parameters `state` and `scatters`, the three-branch state-machine logic (trigger, retrigger, decrement/deactivate), and the hardcoded threshold/award values of 3 and…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on the class or its buildReels override. Key details left undocumented: delegation to spinReel, the unused _rowCount parameter (reel height is implicitly fixed by spinReel), and the class's r…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing description of purpose, parameter shape (reels dimensions/content), return value semantics, and the ≥4 DIAMOND threshold rule._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negati…_

