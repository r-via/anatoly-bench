# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_093939` · Anatoly v0.9.6 (`9255a96-dirty`) · project main @ `7dc4cc6`
**Duration:** 9m 51s · **Cost:** $2.91 · **Tokens:** 177 in / 143K out

**Global F1:** 70.1%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 50.0% | 42.9% | 60.0% | 3 | 2 | 4 | 12m 55s | $0.93 | 48K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 59s | $0.08 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 14s | $0.10 | 5K |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 | 3m 18s | $0.20 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 7s | $0.09 | 3K |
| best-practices | ✓ | 66.7% | 80.0% | 57.1% | 4 | 3 | 1 | 18m 36s | $1.04 | 66K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 19s | $0.15 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 1m 43s | $0.25 | 5K |

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

## False positives (6)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:118 (spin) — _bet > 100 emits only console.warn; the arbitrated intent specifies the valid range as 1..100 (integer). Values above 100 must throw the same Error as other invalid bets._
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Inferred slot-machine domain from reel/paytable/jackpot vocabulary in reference docs and the function's own JSDoc ('suitable for gaming RNG applications'). Math.random() is a non-deterministic, non-au…_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical calls to `weightsToArray(DEFAULT_WEIGHTS)` building five distinct but equal arrays. Docs confirm all reels share the same distribution and there is no setter — per-reel differentiation …_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (46)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects computePayout output but is never verified._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false; branch it guards is dead and untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior, type-cast safety, and missing-key behavior are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline coordinate correctness (row/col indexing) is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-leading resolution, SCATTER early-return, run-length threshold (2 vs 3), and all-WILD edge case are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-count multiplier formula, no-win null return, and payout scaling with lineBet are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. HOUSE_EDGE application (incorrectly inflates rather than reduces payout), flat bet bonus, Math.ceil rounding, and zero-win path are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists. Exported entry point used by src/index.ts. Input validation (non-number, float, negative, >100), free-spin awarding, jackpot detection, wildMultiplier aggregation, and strategy.ad…_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. This function has critical edge cases untested: boundary where r == acc, total-weight of zero, mismatched items/wts lengths, and statistical distribution correctness._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Called by src/factories.ts; untested behavior includes out-of-bounds reelIndex (undefined weights), always returning 3 symbols, and distribution correctness._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts; trivial accessor but zero test coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard, untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant but drives all payout logic; untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no coverage for valid symbols, unknown symbols, or all count branches (3/4/5/<3)._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file. No tests exist for any strategy classes._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, making untested pass-through behavior a gap in engine-level coverage._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Methods on, off, and emit are untested — including edge cases like emitting with no listeners, removing a non-existent handler, multiple handlers for the same event, and argument …_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is imported by src/engine.ts but has no dedicated or integration-level tests confirming correct usage as an event name._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime behavior beyond contract definition, but the concrete subclass is also untested._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. buildReels is used by src/engine.ts (core path) but has zero coverage — reel count iteration, spinReel delegation, and return shape are all untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts but no coverage for empty reels, single scatter, exactly 3 scatters, or mixed symbol grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Critical state-machine logic (activation at 3 scatters, re-trigger, decrement, deactivation at 0) has zero test coverage._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic (jackpot trigger) imported by src/engine.ts has zero test coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, 3 diamonds)._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical gaming RNG logic — uniform distribution, boundary roll (roll === cumulative), zero weights, single-item arrays, mismatched array lengths, and negative weights are all unt…_

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Exported type alias with no JSDoc. The name alone does not convey valid range, currency unit, or how it relates to lineBet._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and mentions house edge / RTP target, but omits @param descriptions for lineWins and bet (bet is typed any, making docs especially important) and has no @returns tag. The uncon…_
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _Primary exported function with no JSDoc in source. README covers its high-level behavior, but the code itself lacks @param, @returns, @throws, or any inline doc block. (deliberated: confirmed — Confir…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), return shape (3-element column), and that each cell is independently sampled._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of the returned array's ordering or its role as the index key aligned with getReelWeights output._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally with getReelSymbols(), and that it is read-only at runtime._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc on exported function. Missing: @param descriptions for symbol and count, @returns explanation, note that WILD/SCATTER and counts outside 3–5 return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, intended usage, and the contract of `adjustPayout` are not explained._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on the class or its `adjustPayout` override. The pass-through behavior (no adjustment) is non-obvious and should be documented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage patterns, and method parameters/return values are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. When and why this event is emitted, and what args accompany it, are not documented._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Purpose of the abstract factory, expected usage, and the semantics of reelCount/rowCount parameters are not described._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. No explanation of how reels are built, why _rowCount is ignored, or what the returned Symbol[][] represents._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc/TSDoc comment. Missing parameter description for `reels`, return value explanation, and clarification that counting is grid-wide (not payline-confined)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc/TSDoc comment. The three-branch state-transition logic (activate, retrigger +10, decrement/deactivate) is non-obvious and requires documentation; `state` mutation side-effect is also undocume…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of purpose, parameter shape (2D reel grid), return semantics, and the hardcoded threshold of 4 DIAMOND symbols._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what `items` and `weights` represent, no mention of the requirement that lengths must match), no @returns tag, an…_

