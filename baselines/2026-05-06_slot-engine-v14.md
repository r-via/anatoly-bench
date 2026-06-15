# Anatoly Bench Score — slot-engine

**Run:** `2026-05-06_114407` · project main @ `b15455b`
**Duration:** 6m 23s · **Cost:** $5.11 · **Tokens:** 265 in / 144K out

**Global F1:** 72.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 71.4% | 71.4% | 71.4% | 5 | 2 | 2 |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 57.1% | 50.0% | 66.7% | 2 | 1 | 2 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 83.3% | 100.0% | 71.4% | 5 | 2 | 0 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (7)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (6)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:23 (EngineContainer) — _Map.get returns undefined for missing keys; 'as T' hides the absence with no guard or throw. Any caller receiving undefined will fail at the point of use, not here, making the defect hard to trace._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] is undefined for indices outside 0–4. The function's declared return type is number[], so callers receive undefined without a type error at compile time, leading to silent runt…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with zero runtime and zero type-only importers. No external files reference this type._
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _number[][] storing one weight array per reel implies per-reel customization, but docs confirm all five reels are identical (.anatoly/docs/04-API-Reference/02-Configuration-Schema.md: 'All five reels s…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout calculation but is never verified._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false, dead code branch untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior, type-unsafe cast, and missing-key behavior are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton with side effects at import time; never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions drive all win evaluation; correctness never verified._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD substitution logic, SCATTER short-circuit, run-length counting, and minimum-run threshold are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding (exponential formula) and payout arithmetic are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Exported function with a buggy HOUSE_EDGE application (increases rather than reduces payout), minimum bet bonus, and Math.ceil rounding — all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS drives all reel spin outcomes; zero coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists. Weight values directly affect RTP; untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. All five reels use identical weights; this assumption is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Core probability logic with boundary conditions (r==0, r==total, weight=0) and fallback path entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts; produces 3-symbol column per reel but output length, valid symbols, and invalid reelIndex behavior are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts; returns SYMBOLS reference without defensive copy — mutation risk untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; returns mutable array reference and silently returns undefined for out-of-range reelIndex — untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Module-private table, but correctness of payout values is untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by engine.ts and legacy.ts — critical business logic for payout calculation with no coverage for valid symbols, unknown symbols (returns 0), and all count branches (3/4/5…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, but adjustPayout identity behavior is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant used by src/engine.ts as an event name; not verified in any test that it matches expected consumers._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts for a critical game mechanic — scatter counting across all reels — with no coverage of empty reels, single scatter, or multiple scatters per column._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) all untested despite being core free-spin lifecycle logic called by engine.ts._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime behavior beyond defining the interface, but concrete subclass coverage is also absent._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. buildReels is used by src/engine.ts (critical path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, rowCount ignored) are verified._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic used by src/engine.ts has zero coverage — no tests for threshold boundary (3 vs 4 diamonds), empty reels, mixed symbols, or multi-reel distribution._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical RNG utility used by src/engine.ts has zero coverage — no tests for uniform distribution, boundary rolls (roll === 0, roll approaches totalWeight), single-item arrays, mis…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent but omits @param descriptions for both lineWins and bet (typed as any), and no @returns describing ceiling-rounding or the unconditional +1% bet addition.…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing @param reelIndex (valid range 0–4), @returns (3-element column array), and behavior on out-of-range index. (deliberated: confirmed — Confirmed. src/reels.ts:…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Should document that it returns the shared SYMBOLS reference and that mutation would affect all reel logic._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing @param reelIndex (valid range), @returns (8-element weight array), and mutation-risk warning on returned reference._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: description of what 'count' valid values are (3–5), what 0 return means, and that WILD/SCATTER symbols are not handled._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with non-obvious extension contract (post-calculation payout adjustment hook) deserves at minimum a purpose description and note that subclasses must implement ad…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through behavior is not self-evident from the name alone; a one-line doc clarifying it returns the result unchanged would prevent misuse._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc explaining what event this constant represents, when it is emitted, or what arguments handlers receive._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing: parameter description for `reels`, return value semantics (total count across all positions, not per-reel), and the fact that detection is grid-wide rather than payline-rest…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Missing: description of state mutation side-effects, the scatter threshold of 3, the 10-spin award and retrigger behavior, and the decrement/deactivation path when scatters < 3 durin…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc/TSDoc. As an abstract base defining the grid-construction contract, it warrants at minimum a description of purpose and parameter semantics (reelCount vs rowCount)._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc/TSDoc on class or buildReels. The silently ignored _rowCount parameter (reel height is implicitly fixed by spinReel) is a non-obvious contract violation that must be documented._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing description of purpose, parameter semantics (shape/dimensions of reels array), return value meaning, and the DIAMOND threshold (>=4) that drives the jackpot condition._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _File-level JSDoc describes purpose and algorithm but is attached to the file, not the function. The function itself has no JSDoc — missing @param descriptions for `items` and `weights`, no @returns, n…_

