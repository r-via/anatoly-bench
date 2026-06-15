# Anatoly Bench Score — slot-engine

**Run:** `2026-05-17_212238` · Anatoly v0.9.6 (`1c35d41-dirty`) · project main @ `7dc4cc6`
**Duration:** 11m 29s · **Cost:** $5.96 · **Tokens:** 230 in / 167K out

**Global F1:** 56.2%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 30.8% | 28.6% | 33.3% | 2 | 4 | 5 | 13m 37s | $1.69 | 54K |
| utility | ✓ | 76.9% | 71.4% | 83.3% | 5 | 1 | 2 | 42s | $0.07 | 6K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 34s | $0.11 | 14K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 3m 54s | $0.64 | 12K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 5s | $0.28 | 3K |
| best-practices | ✓ | 40.0% | 40.0% | 40.0% | 2 | 3 | 3 | 17m 56s | $2.10 | 71K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 7s | $0.40 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 3m 21s | $0.67 | 9K |

## Misses (14)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-WILD-HELPER** — src/wild.ts (applyWildBonus) — expected verdict `DEAD` (dead-helper-superseded-by-inline)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-MAGIC-NUMBERS** — src/engine.ts — expected verdict `NEEDS_FIX` (inline-numeric-literals)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:43 (spinReel) — _No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for index outside 0–4, causing TypeError in pickFromWeighted when wts.reduce is called on undefined._
- **[correction] `NEEDS_FIX`** — src/reels.ts:56 (getReelWeights) — _No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] returns undefined (typed as number[]) for index outside 0–4, silently propagating undefined to callers._
- **[correction] `NEEDS_FIX`** — src/factories.ts:12 (StandardReelBuilderFactory) — _`spinReel(i)` receives no `rowCount` argument. The abstract factory contract declares `rowCount` as a meaningful parameter — any caller that passes a value other than what `spinReel` hardcodes interna…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Math.random() is a non-cryptographic, implementation-defined PRNG (V8 uses xorshift128+). It is not certifiable for regulated gaming RNG. The JSDoc header explicitly labels this function 'suitable for…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type not imported by any file._
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_

## Unscored findings (43)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout calculation but is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false; branch it guards is dead code with no tests._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve mechanics, including the unsafe cast in resolve, are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton with registered dependencies is never exercised in isolation._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. The 10 payline definitions drive all win evaluation logic but are never validated for correctness._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical logic covering WILD substitution, SCATTER short-circuit, run counting, and minimum-run threshold is entirely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-count bonus multiplier formula (basePayout * (1+wc) * 2^wc) and null-return path are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Exported function with inverted HOUSE_EDGE application (adds edge instead of reducing it), fixed 1% bet bonus, and Math.ceil rounding — all business-critical, all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists. Edge cases like zero weights or mismatched config fields are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Critical weighted-random logic with edge cases (zero total weight, single item, r==total boundary) is entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts; happy path, invalid reelIndex, and column-length invariants are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; return value identity and immutability are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; out-of-range reelIndex and return value correctness are untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Module-private table; correctness of payout values is untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic with zero test coverage across all count branches (3/4/5), unknown symbols, and boundary inputs._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, but adjustPayout (identity passthrough) is untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts with no coverage for empty reels, mixed symbols, or all-scatter grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) all untested despite being core free-spin business logic._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical class used by src/engine.ts — on/off/emit methods, multi-listener behavior, handler deregistration, and unknown-arg forwarding are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. String constant used as an event key in src/engine.ts; not exercised in any test._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` (core engine path) but has zero test coverage — loop logic, `spinReel` integration, and output shape are all untested._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic with no coverage — missing tests for exactly 4 diamonds (boundary), fewer than 4, zero diamonds, diamonds spread across multiple reels vs. single reel, and empt…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. No coverage for happy path, edge cases (empty arrays, single item, zero weights, negative weights, boundary roll == cumulative), or the fallback return on L15._

### documentation (14)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent but omits @param descriptions for lineWins and bet, omits @returns, and does not explain the unconditional `bet * 0.01` floor or the Math.ceil rounding._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. reelIndex valid range, return shape (3-element column), and sampling strategy are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of what the returned array represents or that it is the ordered set used for weight alignment._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. reelIndex valid range and the meaning/order of the returned number array are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing: description of what 'count' represents, valid values (3/4/5), return value semantics (multiplier applied to lineBet), and behavior when symbol or count is unrecognized (retu…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with non-obvious contract (strategy pattern for post-processing SpinResult) deserves at minimum a description of purpose and extension requirements._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through identity behavior is not obvious from the class name alone; a one-line doc noting it returns the result unmodified would suffice._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Trigger threshold (≥3), initial award (10 spins), retrigger logic, and decrement-to-deactivation behavior are all undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its methods (`on`, `off`, `emit`). Public API surface — parameter semantics, return values, and event lifecycle are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. The string value `"spin:done"` is visible but the payload type emitted with this event and when it fires are not documented._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or buildReels method. Does not document why _rowCount is ignored, what spinReel does per reel index, or what the returned Symbol[][] represents. (deliberated: confirmed — Confirmed. …_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing description of the jackpot condition (≥4 DIAMOND symbols anywhere on the board), parameter doc for `reels`, and return value explanation._

