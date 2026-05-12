# Anatoly Bench Score — slot-engine

**Run:** `2026-05-12_204755` · Anatoly v0.9.6 (`4336c42-dirty`) · project main @ `7dc4cc6`
**Duration:** 27m 10s · **Cost:** $11.80 · **Tokens:** 232 in / 132K out

**Global F1:** 69.7%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 53.3% | 57.1% | 50.0% | 4 | 4 | 3 | 8m 13s | $1.18 | 36K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 36s | $0.08 | 6K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 53s | $0.13 | 15K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 2m 29s | $0.42 | 8K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 11s | $0.30 | 3K |
| best-practices | ✓ | 57.1% | 80.0% | 44.4% | 4 | 5 | 1 | 14m 23s | $1.76 | 60K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 13s | $0.31 | 4K |
| _refinement_ | — | — | — | — | — | — | — | 2m 55s | $0.50 | 8K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (10)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:120 (spin) — _rng (line 120) and reelsModule (line 122) are resolved from the container but never used anywhere in the function body. factory.buildReels(5, 3) at line 128 uses its own internal implementation, bypas…_
- **[correction] `NEEDS_FIX`** — src/freespin.ts:19 (handleFreeSpins) — _remaining is decremented before the zero-check, so it reaches 0 (or negative) and is then compared with <= 0. This is not wrong per se, but if handleFreeSpins is called with remaining already at 0 (ed…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _JSDoc declares this function 'suitable for gaming RNG applications', but Math.random() is a non-seeded, non-auditable PRNG that fails regulated gaming certification requirements (GLI, BMM, iTech Labs …_
- **[correction] `NEEDS_FIX`** — src/rng.ts:15 (weightedPick) — _When items is empty, the loop body never executes and the fallback returns items[-1] === undefined, typed as T. TypeScript does not narrow array index access to undefined by default (noUncheckedIndexe…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _Context-adapted rules_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math and its bug (adds edge instead of reducing it) is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false; branch it guards is dead and untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve mechanics, including unsafe cast and missing-key behavior, are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline coordinate correctness is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-lead resolution, SCATTER short-circuit, run-length threshold, and mixed WILD/symbol sequences are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding logic and null-win path are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Exported function with inverted house-edge application and unconditional bet bonus are critical business-logic bugs with zero test coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS defines the full symbol universe used by engine and reels; no coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values directly affect payout probabilities; no tests verify correctness._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Five reels all share DEFAULT_WEIGHTS; shape and indexing assumptions are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probability logic with boundary condition (r exactly equals cumulative threshold) and fallback return path are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts; critical path for game play. Out-of-range reelIndex (e.g. 5) would return undefined weights silently — untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; returns internal SYMBOLS array by reference, mutation risk untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; returns live REEL_WEIGHTS sub-array by reference, out-of-bounds index behavior untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant but its values drive all payout logic — zero coverage._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no tests for valid symbols (count 3/4/5), unknown symbols (returns 0), or out-of-range counts._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical behaviors untested: on/off/emit lifecycle, multiple listeners per event, off removing only the target handler, emit with no registered listeners, emit forwarding variadic…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant string used as an event key in src/engine.ts; untested as part of any emit/on integration._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` (critical path) but has zero coverage — neither happy path nor edge cases (reelCount=0, large values, spinReel integration) are tested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts with no coverage for empty reels, all-scatter grids, mixed symbols, or zero-scatter cases._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Used by engine.ts with no coverage for any of the four branches: initial activation (scatters>=3), re-trigger while active, normal decrement, or deactivation at remaining<=0._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic (jackpot payout trigger) used by src/engine.ts has zero coverage — no happy path, boundary (exactly 4 diamonds), or negative-case tests._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: zero-weight items, single-item arrays, mismatched array lengths, negative weights, all-equal weights distribution, and the fallback return on last el…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc exists but is misleading: comment says house edge maintains ~95% RTP, yet the code adds `HOUSE_EDGE` to winning payouts (inflating them) and unconditionally adds `bet*0.01`. Neither behavior mat…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _No JSDoc on exported function. Missing: @param reelIndex (valid range 0–4), @returns (3-element column of symbols), and that results are independent per row._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _No JSDoc on exported function. Missing @returns description and whether the returned array is a copy or a reference to the internal constant._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _No JSDoc on exported function. Missing @param reelIndex valid range, @returns description, and whether mutation of the returned array affects internal state._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing @param descriptions for symbol and count, no @returns explaining that 0 means no win or unrecognised symbol, and no note on valid count range (3–5)._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). All three methods lack parameter and behavior documentation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment explaining when this event is emitted or what payload consumers should expect._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. Concrete implementation ignores rowCount (_rowCount) without explanation, and delegates to spinReel without documenting the resulting structure or side effects._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. State mutation side effects, threshold logic (>=3 scatters), and retrigger behavior (+10 spins) are non-obvious and undocumented. (deliberated: confirmed — Confirmed retrigger incons…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot condition (>=4 DIAMONDs across all reels), parameter shape, and return semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (e.g., empty arrays, negative weights, mismatched array len…_

