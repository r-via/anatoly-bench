# Anatoly Bench Score — slot-engine

**Run:** `2026-05-12_215138` · Anatoly v0.9.6 (`15c4951-dirty`) · project main @ `7dc4cc6`
**Duration:** 7m 56s · **Cost:** $3.35 · **Tokens:** 223 in / 118K out

**Global F1:** 67.0%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 53.3% | 57.1% | 50.0% | 4 | 4 | 3 | 10m 25s | $1.08 | 38K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 44s | $0.04 | 7K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 2m 7s | $0.09 | 17K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 2m 59s | $0.31 | 8K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 47s | $0.18 | 4K |
| best-practices | ✓ | 43.5% | 100.0% | 27.8% | 5 | 13 | 0 | 12m 7s | $1.09 | 40K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 29s | $0.17 | 4K |
| _refinement_ | — | — | — | — | — | — | — | 2m 45s | $0.39 | 8K |

## Misses (7)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (18)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:24 (EngineContainer) — _Map.get() returns undefined for missing keys; the `as T` cast hides this, giving callers a runtime undefined where they expect T._
- **[correction] `NEEDS_FIX`** — src/engine.ts:115 (spin) — _throw "invalid bet" throws a string literal, not an Error. Callers checking `e instanceof Error` or reading `e.message` will fail; stack trace is lost._
- **[correction] `NEEDS_FIX`** — src/factories.ts:10 (StandardReelBuilderFactory) — _`_rowCount` is never passed to `spinReel(i)`. The abstract contract accepts `rowCount` as a meaningful parameter, but the concrete implementation discards it, producing reels whose length is determine…_
- **[correction] `NEEDS_FIX`** — src/freespin.ts:20 (handleFreeSpins) — _`remaining` is decremented to 0 and then `state.active` is set to false inside `if (state.remaining <= 0)`, but the guard is `else if (state.active)` — meaning a spin where `scatters >= 3` also skips …_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Async/Promises/Error handling_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/events.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Context-adapted rules_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math but is never verified in isolation or via computePayout tests._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Flag controls console.log branch in spin(); branch is never exercised by tests._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve methods, type-cast behavior, and missing-key silent undefined return are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is never validated._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. The 10 payline definitions and their row-index correctness are never asserted._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical logic paths untested: all-WILD sequences, SCATTER early-return, leading WILD resolved to first non-WILD, run < 3 returning null, run == 3 boundary._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-count multiplier formula (basePayout * (1+wc) * 2^wc) and null propagation from checkLine are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Exported public function with a doc comment claiming 95% RTP; HOUSE_EDGE application (multiplies on win, not house edge reduction), the +1% floor on bet, and Math.ceil rounding ar…_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Constant defines the full symbol set used by engine and reels logic._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists. Weight values directly affect payout odds — untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. Five-reel weight matrix is entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Core probability logic — boundary condition where r equals accumulated weight, zero-weight items, and single-item arrays are all uncovered._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts; untested for invalid reelIndex (undefined weights), correct column length of 3, and symbol membership._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts; returns shared mutable array reference — mutation side-effects untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard — untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant but its correctness is critical — wrong multiplier values would silently corrupt all payout logic._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by engine.ts and legacy.ts — a critical payout path. No coverage of valid counts (3/4/5), unknown symbols returning 0, or count values outside the 3–5 range._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical methods on()/off()/emit() are untested — no coverage of multi-listener dispatch, handler deregistration, unknown-event emit, or argument forwarding._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is consumed by src/engine.ts but no test verifies its value or that it is used as the correct event key._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. buildReels is imported by src/engine.ts (production critical path) and has no coverage — reelCount iteration, spinReel delegation, and returned Symbol[][] shape are all untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, single-reel input._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Missing coverage for: inactive→active transition (scatters>=3), re-trigger while active, decrement, deactivation at remaining<=0, and inactive with scatters<3 (no-op)._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic used by src/engine.ts has zero coverage — no tests for threshold boundary (exactly 4 diamonds), fewer than 4, more than 4, empty reels, or mixed symbol grids._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical gaming RNG logic with no coverage: unequal weight distribution, single-item arrays, boundary roll (roll === 0, roll === totalWeight - epsilon), and the fallback return on…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block mentioning house edge and ~95% RTP target, but omits: parameter descriptions, the unconditional `bet * 0.01` floor addition, the Math.ceil rounding, and the `bet: any` type issue. Re…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: what reelIndex valid range is (0–4), that it returns 3 symbols (one per row), and that sampling is independent per row._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Should note it returns the canonical ordered symbol list and whether the returned array is a copy or a mutable reference._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid range of reelIndex, units/semantics of returned weights, and whether the array is a direct reference to internal state._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing documentation for parameters (symbol, count), return value (multiplier magnitude/units), valid count range, and the 0 fallback for unknown symbols or non-winning counts._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Parameters, return values, and behavior (e.g. silent no-op when no listeners exist) are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. The event's semantics — when it is emitted and what payload it carries — are not described._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. Notable behavior — _rowCount is ignored entirely — is undocumented, as are parameter semantics and return shape._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. State-mutation side effects, threshold logic (scatters >= 3), spin award amounts (10), and decrement/deactivation behavior are all undocumented. (deliberated: confirmed — Confirmed t…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot logic, explanation of the threshold (>=4 DIAMONDs), parameter shape (2D reel grid), and return semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (empty arrays, negative weights, mismatched array len…_

