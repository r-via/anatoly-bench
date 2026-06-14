# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_193640` · Anatoly v0.9.6 (`8c5aa04-dirty`) · project main @ `7dc4cc6`
**Duration:** 11m 36s · **Cost:** $3.40 · **Tokens:** 169 in / 130K out

**Global F1:** 73.2%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 60.0% | 42.9% | 100.0% | 3 | 0 | 4 | 10m 23s | $0.80 | 37K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 45s | $0.11 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 16s | $0.14 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 40s | $0.36 | 12K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 3s | $0.17 | 3K |
| best-practices | ✓ | 61.5% | 80.0% | 50.0% | 4 | 4 | 1 | 15m 51s | $1.10 | 61K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 31s | $0.26 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 1m 56s | $0.43 | 6K |

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

## False positives (4)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_

## Unscored findings (48)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (31)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _Type alias with no test file present._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists; transitive coverage via computePayout is also absent._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists; transitive coverage via spin is also absent._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file present; class is never directly tested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists; transitive coverage via spin is also absent._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists; transitive coverage via spin is also absent._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file present; function is untested directly or transitively._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists; transitive coverage via spin is also absent._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file present. Notable: house edge is applied additively (increases payout instead of reducing it), and a flat 1% bet is always added — both are untested bugs._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file present. Critical exported entry point with no coverage: invalid-bet validation, win accumulation, free-spin triggering, jackpot detection, and wild multiplier logic are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file. Transitive callers spinReel and getReelSymbols are also untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists; constant exercised only through untested callers._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file. Private helper with no tested callers._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Transitive callers spinReel and getReelWeights are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core weighted-random logic — probability distribution, boundary (r==0, r==total), and fallback to last item are all uncovered._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Used by src/factories.ts but no tests verify column length, symbol membership, or weight application._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Consumed by engine.ts spin() but that path is also untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Consumed by engine.ts spin() but that path is also untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists; getPayMultiplier (sole caller) is itself untested, so no transitive coverage applies._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file found. Callers src/engine.ts and src/legacy.ts are listed as importers but no test evidence was provided for those either._
- **[tests] `UNCOVERED`** — src/events.ts:1 (EventHandler) — _No test file exists. Transitive coverage depends on SpinEventEmitter tests, which also have none._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file found. on/off/emit methods and multi-handler scenarios, handler removal, missing-event guards are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. Constant value and its use as the event key in engine.ts are untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class — no test file exists for this module._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Identity pass-through used by the critical `spin()` function in engine.ts, but no tests exist for this file._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime behavior beyond interface contract, but its concrete subclass is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. `buildReels` is consumed by the critical `spin` function in engine.ts (validates bet, evaluates paylines, handles jackpots), but no tests verify reel count, row count ignored behav…_
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Critical path: called by spin() in engine.ts to trigger free spin awards. Zero coverage for empty reels, no scatters, exactly 3 scatters, or scatters spread across multiple reels._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches untested: initial activation (scatters>=3, inactive), re-trigger (scatters>=3, active), decrement while active, and deactivation when remaining<=0. All call…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic consumed by spin() — no coverage of the >=4 DIAMOND threshold, boundary case of exactly 4, fewer than 4, zero, or all-DIAMOND reels._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical gaming RNG utility used by slot machine spin logic — missing tests for uniform distribution, zero-weight items, single-item arrays, negative/NaN weights, and boundary rol…_

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Exported public type alias with no JSDoc. No constraint information (valid range, integer requirement) is documented._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and mentions house edge, but omits @param descriptions for `lineWins` and `bet`, the return type explanation, and the unconditional floor of `bet * 0.01` which is a notable beh…_
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _Primary exported function with no JSDoc. No documentation of the `bet` parameter constraints (must be integer 1–100), thrown string error, or the fields of the returned SpinResult. (deliberated: confi…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), meaning of the returned 3-element array (one Symbol per visible row), and that each row is sampled independently._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. A one-liner getter, but callers need to know the returned array is ordered and that its indices align with getReelWeights output._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that indices align with getReelSymbols(), that the returned array is a direct reference (not a copy), and the weight total (120…_
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: parameter descriptions, return value semantics, behavior for unknown symbols (returns 0), and that count values outside {3,4,5} also return 0._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Class and all three public methods (on, off, emit) lack any JSDoc. A public API consumed by engine.ts deserves at minimum a class-level description and @param/@returns annotations on each method._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment describing when this event fires or what arguments are passed to listeners. Consumers relying on this event string need documentation of its semantics._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc. Abstract base class with no explanation of the strategy pattern's purpose, when to subclass, or what contract adjustPayout must satisfy._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc. Passes result through unchanged — non-obvious that this is the identity/no-op strategy. No note that it is the default used by engine.ts._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc. Abstract factory contract — purpose, expected override behavior, and relationship to the slot machine engine are non-obvious from the name alone._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or buildReels method. Non-obvious behavior: _rowCount is ignored, spinReel is called per reel index — these constraints and the reason rowCount is unused are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter type semantics, and return value meaning._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. The three-branch state machine logic (activate, retrigger, decrement/deactivate) is non-obvious and warrants documented parameter contracts and side-effect description._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Non-obvious behavior (counts DIAMOND symbols globally across all reels, triggers at >=4) is not documented inline. The threshold and grid-wide (not payline-restricted) counting logic…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes the purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (e.g., empty arrays, mismatched array lengths, or nega…_

