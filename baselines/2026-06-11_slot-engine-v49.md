# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_105340` · Anatoly v0.9.6 (`914c4b7-dirty`) · project main @ `7dc4cc6`
**Duration:** 11m 24s · **Cost:** $3.05 · **Tokens:** 177 in / 137K out

**Global F1:** 70.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 60.0% | 42.9% | 100.0% | 3 | 0 | 4 | 10m 15s | $0.79 | 37K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 58s | $0.07 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 22s | $0.10 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 7s | $0.26 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 10s | $0.09 | 3K |
| best-practices | ✓ | 50.0% | 60.0% | 42.9% | 3 | 4 | 2 | 18m 49s | $1.10 | 70K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 29s | $0.16 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 2m 27s | $0.39 | 8K |

## Misses (10)

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
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (4)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (47)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (30)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _No test file exists. Type alias with no runtime behavior, but still untested._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. Critical constant affecting payout math — zero coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior and type-unsafe resolve return untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline correctness (shape, uniqueness, index alignment) is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD substitution logic, SCATTER/WILD-only rejection, run counting, and run<3 cutoff are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding (basePayout * (1+wc) * 2^wc) is a complex formula with zero test coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. House-edge application, the unconditional +bet*0.01 bonus, and Math.ceil rounding are untested. Comment claims RTP ~95% but edge is added on top of wins, inflating actual RTP — do…_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists. Exported to src/index.ts (production entry point). Bet validation, free-spin triggering, jackpot path, wildMultiplier aggregation, and strategy delegation are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. This function has critical edge cases worth testing: total=0, single-item array, boundary rounding, and uniform vs skewed weight distributions._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts; untested stochastic behavior and out-of-bounds reelIndex access into REEL_WEIGHTS are unverified._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Internal constant backing getPayMultiplier; all six symbol rows untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts — critical pay calculation path. Count branches (3/4/5), unknown symbol, and count < 3 return 0 all untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts — identity pass-through behavior is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Methods on()/off()/emit() have zero coverage — including edge cases like duplicate handlers, off() on unknown events, emit() with no listeners, and multiple args propagation. Used…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant string used by src/engine.ts but never tested as an event name in integration scenarios._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime logic, but its contract is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Used by src/engine.ts (critical path), yet buildReels loop logic and spinReel integration are completely untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by src/engine.ts for core game logic; missing coverage of empty reels, single scatter, exactly 3 scatters, and mixed symbol grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Critical state machine with 4 branches (initial activation, re-trigger, decrement, deactivation at 0) — all untested. Used by src/engine.ts._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. No coverage for happy path, edge cases (empty arrays, mismatched lengths, zero/negative weights, single-item), or the fallback return on L15. Used by src/engine.ts, making this a …_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Called by src/engine.ts — no coverage for threshold boundary (exactly 4 diamonds), fewer than 4, empty reels, or multi-column distribution._

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Public type alias with no JSDoc. Purpose (coin denomination? integer constraint?) is not obvious from the name alone, and the type accepts any number including floats despite spin() enforcing integer-…_
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and RTP intent but omits @param docs for lineWins and bet (typed as any), @returns description, and the unconditional floor of bet*0.01 added regardless of wins. The house-edge…_
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _Primary exported function with no JSDoc. No documentation of the bet parameter constraints (integer, 1–100), return shape, thrown exception type (string literal rather than Error), or side effects (em…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API. No JSDoc describing the reelIndex range (0–4), return shape (3-element column), or behavior when reelIndex is out of bounds._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API. No JSDoc; does not document that the returned array is the ordered canonical list used for weight indexing._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API. No JSDoc describing the reelIndex range, return value semantics (parallel to getReelSymbols), or read-only nature of the array._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc. Missing @param descriptions for symbol and count, no @returns explaining the multiplier semantics, and no note that WILD/SCATTER always return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, usage pattern, and the contract of adjustPayout are undescribed._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on class or method. The pass-through behavior of adjustPayout is non-obvious without a comment explaining it is the identity/no-op strategy._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage, and method parameters/return values are entirely undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment explaining when this event is emitted or what payload, if any, accompanies it._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Purpose, contract, and intended extension points are not described._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or `buildReels` method. The `_rowCount` parameter being ignored is a non-obvious behavior that warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of grid traversal logic, parameter shape, and return value semantics (total scatter count across all reels)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-trivial state machine with three branches (activate, retrigger, decrement/deactivate) — none of the transitions, mutation side-effects, or parameter semantics are documented._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions (no documentation of what `items` or `weights` expect, e.g. length parity requirement, non-negative weights), no @returns tag, and n…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. The function name hints at purpose but non-obvious semantics are undocumented: the >= 4 DIAMOND threshold, that counting is grid-wide (not payline-restricted), and that the parameter…_

