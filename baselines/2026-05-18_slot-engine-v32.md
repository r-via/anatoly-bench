# Anatoly Bench Score — slot-engine

**Run:** `2026-05-18_175524` · Anatoly v0.9.6 (`dd38dc3-dirty`) · project main @ `7dc4cc6`
**Duration:** 10m 39s · **Cost:** $5.56 · **Tokens:** 233 in / 156K out

**Global F1:** 71.6%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 36.4% | 28.6% | 50.0% | 2 | 2 | 5 | 11m 12s | $1.49 | 44K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 29s | $0.06 | 5K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 51s | $0.10 | 16K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 14s | $0.58 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 4s | $0.27 | 3K |
| best-practices | ✓ | 83.3% | 100.0% | 71.4% | 5 | 2 | 0 | 17m 48s | $2.13 | 72K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 6s | $0.41 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 31s | $0.52 | 7K |

## Misses (9)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (5)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Uses Math.random(), which is not a certifiable PRNG. The file comment explicitly labels this 'suitable for gaming RNG applications' and the project is a regulated slot machine (reels, paylines, jackpo…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:15 (weightedPick) — _When items is empty, the loop body never executes and the fallback returns items[-1] (undefined in JavaScript), but the TypeScript return type is T. Caller receives undefined with no type error, silen…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with 0 importers across the codebase_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_

## Unscored findings (43)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math but is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior, type-unsafe cast, and missing-key handling are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions drive all win detection but have no coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD substitution, SCATTER early-return, run-length cutoff, and all-WILD edge cases are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding, no-win null return, and payout calculation are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. HOUSE_EDGE application, zero-win base-bet bonus, Math.ceil rounding, and the documented bug (edge adds instead of reducing) are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS defines the full symbol set used by spinReel and getReelSymbols — untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values directly affect game odds; sum correctness and per-symbol values are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file. Ordering of returned array must match SYMBOLS order exactly — a transposition would silently corrupt all odds. No tests verify this invariant._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. No verification that all 5 reels are initialized, each has 8 entries, or that weights are non-negative._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probability logic is completely untested: boundary conditions (r === 0, r just below total), fallback return on floating-point overshoot, uniform distribution across zero-weight ite…_
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts — a production code path. No tests for out-of-bounds reelIndex, column length of exactly 3, or symbol membership in SYMBOLS._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts. Returns mutable array reference; no tests verify contents or immutability._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts. No tests for valid reelIndex range, returned array length, or correct weight values._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Internal constant, but its values directly determine payout correctness — zero coverage._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no tests for valid counts (3/4/5), unknown symbols, or boundary counts (0, 1, 2, 6+)._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file. No tests verify the interface contract._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file exists. DefaultStrategy is imported by src/engine.ts (critical path), but adjustPayout — which is an identity function — has no direct tests verifying it returns the result unchanged acro…_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Core event emitter used by src/engine.ts — on/off/emit methods, including edge cases like removing non-existent handlers, emitting with no listeners, and multi-listener ordering, …_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant used as event key in src/engine.ts; its integration with SpinEventEmitter.emit is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. buildReels is used by src/engine.ts (critical path) but has zero coverage — reelCount loop behavior, spinReel integration, and rowCount being ignored are all untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts; edge cases like empty reels, no scatters, mixed symbols, and all-scatter grids are untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) are all untested, including the boundary condition at remaining <= 0._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic (jackpot trigger) with no coverage — happy path, boundary (exactly 4 diamonds), under-boundary (3 diamonds), empty reels, and multi-reel distribution cases all …_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical RNG logic used by src/engine.ts has zero coverage — no tests for uniform distribution, boundary roll (roll === cumulative), zero weights, single-item input, or weight nor…_

### documentation (14)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes high-level purpose and RTP intent but omits @param tags for both parameters (including the untyped `bet: any`) and an @returns annotation. The additive `bet * 0.01` term is unexplained…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API. No JSDoc. Missing: description of reelIndex range (0–4), return shape (3-element column), and that each symbol is independently sampled._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API. No JSDoc. No description of the returned array's significance (master ordered symbol list) or whether it is a live reference or a copy._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), meaning of returned values (weights summing to 120), and that the array is a direct reference to the internal mutable state._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing description of the parameter semantics (valid count values: 3–5), the return value unit (multiplier, not credits), and the 0-return behaviour for unknown symbols or out-of-ra…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with non-obvious contract (strategy pattern for post-processing SpinResult) warrants at minimum a class-level description and a note on the expected behavior of a…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through identity behavior is not obvious from the name alone; a one-liner clarifying it applies no adjustment would suffice._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its methods (`on`, `off`, `emit`). Public API with three exported methods — all lack parameter and behavior descriptions._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. As a public event-name constant, it should document what triggers it and what arguments are passed to handlers._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. The _rowCount parameter is silently ignored — behavior that warrants explicit documentation. Missing @param descriptions and no explanation of the spinReel delegation._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. The trigger threshold (≥3), initial award (10 spins), retrigger logic (+10), and decrement-to-deactivation behavior are non-obvious and undocumented._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols anywhere on the grid), parameter docs for `reels`, and return value semantics._

