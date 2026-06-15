# Anatoly Bench Score — slot-engine

**Run:** `2026-05-20_170944` · Anatoly v0.9.6 (`8db1095-dirty`) · project main @ `7dc4cc6`
**Duration:** 8m 52s · **Cost:** $3.07 · **Tokens:** 233 in / 164K out

**Global F1:** 72.2%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 61.5% | 57.1% | 66.7% | 4 | 2 | 3 | 16m 30s | $1.17 | 62K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 1m 3s | $0.06 | 9K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 17s | $0.06 | 11K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 28s | $0.20 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 11s | $0.09 | 3K |
| best-practices | ✓ | 61.5% | 80.0% | 50.0% | 4 | 4 | 1 | 17m 4s | $0.97 | 61K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 21s | $0.15 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 16s | $0.35 | 6K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (7)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] for index outside [0,4] returns undefined; TypeScript declares the return type as number[], so callers get no compile-time or runtime error before attempting to use the result …_
- **[correction] `NEEDS_FIX`** — src/paytable.ts:11 (PAY_TABLE) — _Forward: P(DIAMOND per cell) = 30/120 = 0.25; P(5×DIAMOND per payline) = 0.25^5 = 1/1024 ≈ 9.77e-4; 5×DIAMOND payout = 1000 × lineBet = 1000 × (bet/10) = 100×bet; expected contribution per payline = 9…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (43)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists; constant's effect on computePayout is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists; register/resolve behavior, missing-key cast, and type-unsafe resolve are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists; module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists; payline shape correctness and index usage in evaluateLine are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists; WILD-lead resolution, SCATTER early-return, run < 3 rejection, and mixed-WILD runs are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists; wild-bonus multiplier formula and null propagation from checkLine are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. This function uses Math.random and has boundary logic (last-element fallback) that warrants dedicated edge-case tests._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts — a critical caller — yet fully untested including out-of-bounds reelIndex behavior._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Called by engine.ts and legacy.ts — critical payout logic with count boundary conditions (3/4/5) and unknown symbol handling are untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts but adjustPayout (identity pass-through) is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Methods on, off, and emit are untested — including edge cases like removing a non-registered handler, emitting with no listeners, multiple handlers for the same event, and handler…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is referenced by src/engine.ts but no tests verify it is used correctly as an event name._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Used by src/engine.ts but buildReels logic (loop calling spinReel per reel index, returning Symbol[][]) has zero test coverage — no happy path, no edge cases (reelCount=0, varying…_
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Critical game logic used by engine.ts has no coverage for scatter counting across multiple reels, empty reels, or non-scatter symbols._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. State machine with 4 branches (activation, retrigger, decrement, deactivation) is entirely untested despite being core free-spin business logic consumed by engine.ts._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic (jackpot detection) used by src/engine.ts has zero test coverage — no happy path, no edge cases (empty reels, exactly 4 diamonds, fewer than 4, mixed symbols)._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weight boundary (roll == cumulative), and uniform distribution validati…_

### documentation (14)

- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), explanation that the returned array contains 3 symbols (one per row), and the independence of each pick._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Missing: description of return value as the ordered symbol list used for weight-index alignment._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSymbols(), and that it is read-only at runtime._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc on exported public function. Missing: param descriptions for symbol and count, return value semantics, behavior for WILD/SCATTER (returns 0), and valid count range._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. The abstract class and its `adjustPayout` contract — purpose, expected input/output semantics, and extension guide — are entirely undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. The identity-passthrough behavior of `adjustPayout` is not documented; callers cannot know this is a no-op without reading the implementation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). Public API surface with non-trivial semantics (listener deduplication behavior, variadic args) is entirely undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. The constant's role as the event name emitted after each spin() call, and the shape of its payload, are not described anywhere inline._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. The non-obvious behavior — rowCount is silently ignored; reel height is always fixed by spinReel() — is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D readonly array), and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-trivial state machine with three distinct branches (activation, retrigger, decrement/deactivation) and a mutation side-effect — none of which are documented._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. The threshold of 4 DIAMOND symbols and the flat grid-wide counting strategy (not payline-restricted) are non-obvious and undocumented._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what `items` and `weights` represent, no constraint that arrays must be same length or weights must be positive),…_

