# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_085449` · Anatoly v0.9.6 (`b74e818-dirty`) · project main @ `7dc4cc6`
**Duration:** 10m 15s · **Cost:** $3.49 · **Tokens:** 177 in / 143K out

**Global F1:** 75.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 61.5% | 57.1% | 66.7% | 4 | 2 | 3 | 11m 2s | $0.83 | 40K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 58s | $0.10 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 11s | $0.14 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 16s | $0.33 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 8s | $0.16 | 4K |
| best-practices | ✓ | 71.4% | 100.0% | 55.6% | 5 | 4 | 0 | 20m 2s | $1.29 | 73K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 22s | $0.24 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 1m 26s | $0.26 | 4K |

## Misses (7)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (6)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:118 (spin) — _bet > 100 emits only console.warn and lets the spin proceed. Arbitrated contract states valid bets are 1..100 integers; bets above 100 must be rejected with a throw, not silently accepted._
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Domain inferred from reference docs (reels, paytable, DIAMOND/WILD/SCATTER symbols, RTP=95%, free spins, jackpot) and confirmed by the JSDoc's own claim 'suitable for gaming RNG applications'. Math.ra…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_

## Unscored findings (47)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (30)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _No test file exists. Type alias with no runtime behavior, but its constraints (used as bet validation input in spin) are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file. HOUSE_EDGE=0.05 is applied in computePayout but the effect (inflating wins by 5%) is never verified._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file. Constant is always false; no test verifies the conditional logging branch._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file. register/resolve round-trip, missing-key behavior, and type-cast safety are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file. Module-level singleton wiring of rng, paytable, and reels is never exercised in isolation._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file. The 10 payline definitions (shape, row indices, boundary values) are never validated._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file. Critical logic paths untested: leading WILD resolution, SCATTER short-circuit, run < 3 rejection, mixed WILD+symbol runs._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file. Wild multiplier formula (basePayout * (1+wc) * 2^wc) and null-passthrough from checkLine are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file. Exported and business-critical: house-edge inflation on wins, the flat 1% bet bonus on every spin, and Math.ceil rounding are all untested. The house-edge comment claims ~95% RTP but the…_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file. Primary exported entry point imported by src/index.ts. Input validation (non-number, float, <1, >100), reel evaluation, scatter/free-spin wiring, jackpot flag, wildMultiplier accumulatio…_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists. Key logic: maps config fields to a fixed-order array; wrong field order would silently corrupt weights._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probabilistic logic with boundary conditions (r exactly at boundary, all-zero weights, single item) is entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts — a critical path. Out-of-bounds reelIndex returns undefined weights silently._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; invalid reelIndex returns undefined with no guard._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Module-private table drives all payout logic; untested indirectly or directly._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file. Called by src/engine.ts and src/legacy.ts — critical payout path with zero test coverage. Missing: unknown symbol (returns 0), count < 3 (returns 0), counts 3/4/5 for each symbol, bounda…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, making untested pass-through behavior a gap in engine-level coverage._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical class used by src/engine.ts; on/off/emit methods and multi-handler dispatch, handler removal, and unknown-event paths are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant used by src/engine.ts; its integration with SpinEventEmitter event dispatch is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime behavior beyond interface contract, but concrete subclasses are untested._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` (core path) but has zero coverage — reel count loop, `spinReel` delegation, and `_rowCount` being unused are all untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Symbol is called by src/engine.ts but has zero test coverage._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. Critical state-mutation logic (activation, re-trigger, decrement, deactivation) is entirely untested._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical business logic (jackpot detection) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, fewer than 4 diam…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Zero coverage of happy path, edge cases (empty arrays, single item, zero weights, negative weights, mismatched array lengths), or the off-by-one boundary where roll equals cumulat…_

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _No JSDoc. Exported type alias carries implicit semantics (valid range 1–100, integer-only) that are enforced in spin() but invisible at the type declaration._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block describing purpose and house-edge intent, but missing @param descriptions for lineWins and bet (typed any), missing @returns, and does not document the unconditional bet*0.01 floor a…_
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _No JSDoc at the function declaration. Primary exported public API; parameter constraints, thrown error form, and SpinResult fields are undocumented inline. (deliberated: confirmed — Both issues confir…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), explanation that it returns 3 symbols (one per row), and that sampling is independent per cell._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. A one-line description of the return value and ordering would suffice._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), description of returned array order, and that weights are read-only at runtime._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: description of what a 'multiplier' represents (base multiplier × lineBet), parameter semantics for count, return value of 0 for WILD/SCATTER or unknown symb…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class has no JSDoc. Purpose, intended usage pattern, and extension contract are not documented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on class or method. While name implies pass-through behavior, the no-op contract of adjustPayout is not explicitly stated._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Class and all three public methods (on, off, emit) lack JSDoc. Missing: class purpose, parameter descriptions for event/handler, and emit's variadic args behavior._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment explaining when this event is emitted or who emits it._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Abstract base class with non-obvious contract (what constitutes a valid reel, what reelCount/rowCount mean) warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. `_rowCount` is ignored silently — a noteworthy behavioral constraint that should be documented. Neither the class nor `buildReels` carry any doc comment._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc/TSDoc comment. Missing description of purpose, parameter meaning (reels layout), and return value semantics (scatter count across full grid)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc/TSDoc comment. State mutation side-effects, retrigger logic (+10 on active + ≥3 scatters), and decrement-to-deactivation behavior are non-obvious and entirely undocumented._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Exported public function with non-obvious semantics: the DIAMOND threshold of 4, grid-wide counting (not payline-restricted), and the ReadonlyArray<ReadonlyArray<Symbol>> param…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _Block-level JSDoc describes purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (empty arrays, negative weights, mismatc…_

