# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_102313` · Anatoly v0.9.6 (`d4db354-dirty`) · project main @ `7dc4cc6`
**Duration:** 10m 55s · **Cost:** $3.20 · **Tokens:** 177 in / 150K out

**Global F1:** 62.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 44.4% | 28.6% | 100.0% | 2 | 0 | 5 | 14m 38s | $1.02 | 53K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 50s | $0.07 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 20s | $0.09 | 5K |
| overengineering | ✓ | 57.1% | 50.0% | 66.7% | 2 | 1 | 2 | 2m 58s | $0.18 | 9K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 7s | $0.09 | 3K |
| best-practices | ✓ | 53.3% | 80.0% | 40.0% | 4 | 6 | 1 | 19m 3s | $1.10 | 70K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 20s | $0.15 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 41s | $0.42 | 8K |

## Misses (11)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[overengineering · trivial] OVER-DI** — src/engine.ts (EngineContainer) — expected verdict `OVER` (di-container-for-three-deps)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (7)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical calls to weightsToArray(DEFAULT_WEIGHTS) implies future per-reel variation that doesn't exist. All reels share the same weights; Array.from({length:5}, () => weightsToArray(DEFAULT_WEIG…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (46)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (30)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _No test file exists. Type alias with no runtime behavior, but its constraints (used in spin validation) are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. Constant affects computePayout output but is never verified against expected RTP behavior._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve semantics (including type-unsafe cast on resolve) are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions drive all win evaluation; correctness of each pattern is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical logic covering WILD leading, SCATTER short-circuit, run counting, and minimum run of 3 is entirely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding (basePayout * (1 + wildCount) * 2^wildCount) is a complex, bug-prone formula with zero test coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Exported public API; applies house edge incorrectly (adds edge rather than reducing it) and unconditionally adds bet*0.01 — critical business logic bugs with no tests to catch the…_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists. Primary exported entry point imported by src/index.ts. Bet validation, reel evaluation, scatter/free-spin integration, jackpot detection, and wildMultiplier aggregation are all un…_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists. Edge cases like zero weights or mismatched config are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probabilistic logic — boundary conditions (r exactly at boundary, zero total weight, single item) and distribution correctness are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts; invalid reelIndex (out of bounds) and return shape (3-element column) are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Used by src/engine.ts; identity and immutability of returned array are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Used by src/engine.ts; out-of-bounds reelIndex and correct weight values per reel are untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Internal table drives all payout logic; no tests verify correctness of multiplier values._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no coverage for count=3/4/5 branches, unknown symbol, or count<3._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, making untested identity passthrough a gap in engine coverage._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical class used by engine.ts with on/off/emit methods — none are tested. Missing coverage for: handler registration, removal, multi-listener dispatch, unknown event no-op, and…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. String constant used by engine.ts; no tests verify it is emitted or handled correctly._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. Used by src/engine.ts — buildReels loop logic and spinReel integration are untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by src/engine.ts with no coverage for empty reels, single scatter, exactly 3 scatters, or multiple scatters across multiple reels._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Used by src/engine.ts with no coverage for activation (scatters>=3), re-trigger while active, countdown to zero/deactivation, or no-op when inactive with <3 scatters._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Called by src/engine.ts, so this RNG utility is part of a critical game path. No coverage of uniform distribution, zero-weight items, single-item arrays, weight proportionality, o…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic (jackpot detection) imported by src/engine.ts has zero test coverage — no happy path, no edge cases (exactly 4 diamonds, 3 diamonds, empty reels, multi-column …_

### documentation (16)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _No JSDoc. Exported public type alias with no description of valid range, units, or relationship to lineBet._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and mentions house edge, but omits @param for both parameters (including bet typed as `any`), no @returns, and the unconditional floor `bet * 0.01` is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _No JSDoc on the primary exported public API. Missing documentation for the bet parameter constraints, all fields of the returned SpinResult, thrown error string, and side-effects (event emission, free…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), that it returns exactly 3 symbols (one per visible row), and that sampling is independent per cell._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported with no JSDoc. Name is clear but the return value's role (canonical ordered list used for weight-index alignment) is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSymbols(), and that it is read-only at runtime._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: what 'count' represents, valid range of 'count', that WILD/SCATTER return 0, and what the returned number is (a multiplier applied to line bet)._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, intended usage, and the contract for `adjustPayout` are not explained._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc. The pass-through behavior of `adjustPayout` (returns result unchanged) is non-obvious and warrants at least a brief description._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage pattern, and method parameters are entirely undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. Event name constant with no description of when it is emitted or what payload to expect._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Purpose of the abstract factory pattern, expected subclass contract, and parameter semantics for buildReels are not explained._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or buildReels override. Behavior of _rowCount being ignored and delegation to spinReel is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description, @param for reels, and @returns explaining the scatter count semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Missing description of state transitions, @param for state and scatters, and the retrigger/deactivation behavior is non-obvious without docs._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _Exported function has no JSDoc. Missing: purpose, @param description for `reels`, @returns explanation, and the jackpot threshold rule (≥4 DIAMOND symbols across the grid)._

