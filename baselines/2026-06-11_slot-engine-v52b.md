# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_195315` · Anatoly v0.9.6 (`8c5aa04-dirty`) · project main @ `7dc4cc6`
**Duration:** 11m 16s · **Cost:** $2.75 · **Tokens:** 169 in / 150K out

**Global F1:** 79.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 72.7% | 57.1% | 100.0% | 4 | 0 | 3 | 15m 49s | $0.95 | 57K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 54s | $0.07 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 56s | $0.09 | 4K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 38s | $0.24 | 13K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 8s | $0.09 | 3K |
| best-practices | ✓ | 80.0% | 80.0% | 80.0% | 4 | 1 | 1 | 16m 31s | $0.98 | 62K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 20s | $0.16 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 1m 19s | $0.18 | 4K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (1)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_

## Unscored findings (48)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (31)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _No test file exists for this source file._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists; computePayout (sole caller) has no tests._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists; spin (sole caller) has no tests._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists for this source file._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists; spin (sole caller) has no tests._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists; spin (sole caller) has no tests._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists for this source file._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists; spin (sole caller) has no tests._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists for this source file._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists for this source file._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Transitive coverage via spinReel/getReelSymbols is moot since those exports are also untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists. Constant feeds REEL_WEIGHTS and ultimately spinReel, but none are tested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists. Private helper with ordering-sensitive logic (symbol-to-weight mapping) that is never directly or transitively tested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. Transitive callers spinReel/getReelWeights are also untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Critical probabilistic logic (weighted random selection, boundary at total weight) has zero coverage — no seeded-random or distribution tests exist._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts but no tests cover it; edge cases like out-of-range reelIndex are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Consumed by engine.ts spin() but neither is tested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Consumed by engine.ts spin() but neither is tested; undefined behavior for out-of-range reelIndex unverified._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file; sole caller getPayMultiplier also has no tests, so transitive coverage is absent._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file. Used by engine.ts and legacy.ts but neither file's tests are provided or referenced._
- **[tests] `UNCOVERED`** — src/events.ts:1 (EventHandler) — _No test file exists. Transitive coverage via SpinEventEmitter is also absent since no tests cover SpinEventEmitter either._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file found. Methods on/off/emit and edge cases (duplicate handlers, removing non-existent handlers, emitting with no listeners, multiple args) are untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. Constant is consumed by src/engine.ts but no tests verify correct usage as an event name._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file exists. Used by the critical `spin` function in engine.ts — the identity pass-through behavior is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime behavior beyond the interface contract, but still unverified._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts (validates bets, evaluates paylines, awards jackpots), making untested reel generation a significant gap — bo…_
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used in critical spin path; needs coverage for 0 scatters, exactly 3, mixed reel layouts, and nested symbol iteration._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) are all untested. State mutation side-effects and boundary at remaining<=0 are unverified._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic consumed by the core spin engine with no coverage of the >=4 DIAMOND threshold, boundary cases (exactly 3 vs 4 diamonds), empty reels, or multi-column distribu…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical RNG utility used by slot machine spin logic — missing tests for empty arrays, mismatched array lengths, zero weights, negative weights, single-item arrays, and statistica…_

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Type alias name is self-descriptive, but valid constraints (positive integer, max 100) are not documented — callers must infer them from runtime errors in spin()._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent, but omits @param descriptions for lineWins and bet (typed as any), no @returns, and the unconditional floor (bet * 0.01) and Math.ceil are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _Primary exported function has no JSDoc at all. README covers high-level behavior but in-code documentation for parameters, thrown errors, return shape, and side effects is absent. (deliberated: confir…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that the return is always a 3-element column, and behavior on out-of-range index._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Name is clear but no comment describes the fixed order, length, or that the array is shared (not a defensive copy)._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), weight array length/ordering, and behavior on out-of-range index._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: valid range for `count` (3–5), behavior for WILD/SCATTER symbols (returns 0), and what the returned multiplier is applied against (line bet)._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Class and all three public methods (on, off, emit) lack JSDoc. Public API consumed by engine.ts — contracts for event registration, removal, and dispatch are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc explaining when this event is emitted or what args consumers receive._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Missing description of the strategy pattern purpose, the contract of adjustPayout, and guidance on implementing subclasses._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc. The pass-through behavior (returns result unchanged) is non-obvious from the name alone and warrants at least a one-liner._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Abstract factory contract for building reel grids — the abstract method signature alone does not convey what implementations are expected to guarantee (e.g. reel length, valid symbol…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on the class or its `buildReels` method. Missing documentation for the ignored `_rowCount` parameter (why is it unused?), the return shape, and the relationship to `spinReel`._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter type semantics (2D reel grid), and return value meaning._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. The three-branch state machine logic (activation, retrigger, decrement/deactivation) is non-obvious and critical public API behavior that warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot trigger condition (≥4 DIAMOND symbols anywhere on the grid), parameter shape (2D reel array), and boolean return semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, mismatched lengths, or zero total weight)._

