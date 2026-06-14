# Anatoly Bench Score — slot-engine

**Run:** `2026-05-20_175144` · Anatoly v0.9.6 (`ea0d628-dirty`) · project main @ `7dc4cc6`
**Duration:** 8m 40s · **Cost:** $3.46 · **Tokens:** 233 in / 153K out

**Global F1:** 67.6%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 42.9% | 42.9% | 42.9% | 3 | 4 | 4 | 13m 56s | $1.56 | 44K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 1m 12s | $0.07 | 12K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 2m 16s | $0.11 | 20K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 2m 35s | $0.16 | 7K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 2s | $0.08 | 3K |
| best-practices | ✓ | 57.1% | 80.0% | 44.4% | 4 | 5 | 1 | 16m 28s | $0.94 | 59K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 28s | $0.16 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 2m 22s | $0.38 | 7K |

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
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (10)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:86 (evaluateLine) — _Formula `basePayout * (1 + wildCount) * 2 ** wildCount` yields: 1 wild → 4×, 2 wilds → 12×, 3 wilds → 32×. For DIAMOND 5-of-a-kind with 3 wilds: 1000 × lineBet × 32 = 3200× total bet from a single lin…_
- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Math.ceil rounds payout UP (player's favor). Inferred slot-machine domain from reel/payline/paytable vocabulary. Industry convention: payout rounding must use Math.floor (house keeps the remainder)._
- **[correction] `NEEDS_FIX`** — src/engine.ts:115 (spin) — _Throws string literal "invalid bet" instead of an Error object. Callers using `instanceof Error` won't catch it, and no stack trace is produced._
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Inferred slot-machine domain from reel/paytable/jackpot/scatter/wild vocabulary and documented RTP target in project docs. Math.random() relies on a non-cryptographic PRNG (e.g., xorshift128+ in V8) w…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Testability_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists for this module. Critical logic: applies house edge incorrectly (multiplies by 1+HOUSE_EDGE instead of reducing) and adds unconditional 1% bet bonus — untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Critical probabilistic logic with boundary condition at loop exit (fallback return) is entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts, making it a critical production path with zero coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. PAY_TABLE is internal but drives all payout logic — untested indirectly through getPayMultiplier._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file found. Imported by src/engine.ts and src/legacy.ts — critical payout path with no coverage for valid symbols at counts 3/4/5, unknown symbols (returns 0), or boundary counts like 2 or 6._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts — pass-through identity behavior is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. `on`, `off`, and `emit` are all untested — including edge cases like emitting with no listeners, removing a non-registered handler, multiple handlers per event, and handler invoca…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is used as an event key in src/engine.ts but no tests verify its value or its use in emit/on flows._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Used by src/engine.ts (critical path), yet buildReels has no coverage — neither happy path (correct reel count, spinReel delegation) nor edge cases (reelCount=0, large values)._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Critical game logic used by engine.ts has zero test coverage._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. State mutation logic with multiple branches (activation, re-trigger, decrement, deactivation) is completely untested._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Function has no test coverage despite being imported by src/engine.ts (critical game engine path). Missing tests for: jackpot threshold (exactly 4 diamonds), below threshold (3 dia…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item input, boundary roll equal to cumulative weight, and distribution uniformity. Called…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has JSDoc prose but no @param or @returns tags. Description states house edge 'maintains ~95% RTP' yet implementation multiplies total by 1.05 (increases payout), contradicting standard house-edge sem…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that it returns exactly 3 symbols (one per row), and that sampling is independent per cell._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Name is self-descriptive and body trivial, but return value semantics (ordered master symbol list) are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), relationship between returned array indices and SYMBOLS order, and read-only nature of the weights._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: what 'count' represents (run length), valid range for count, behavior for WILD/SCATTER (returns 0), and what the returned number means (base multiplier, not…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with a single abstract method; extension semantics and the contract of adjustPayout are undescribed._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Identity behavior (pass-through) is non-obvious without documentation; callers have no indication this is the engine default._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Exported public class with no JSDoc on the class or any of its three methods (on, off, emit). Missing descriptions of event-name semantics, handler reference-equality contract for off(), and whether e…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _Exported constant with no JSDoc. Does not document what event payload is passed when this event fires, or which emitter instance produces it._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc/TSDoc comment. Non-obvious behavior — _rowCount is silently ignored and reel row count is fixed by spinReel() — is undocumented, making this a meaningful gap for public API consumers._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. The three-branch state machine logic (activate, retrigger, decrement/deactivate) and mutation side-effects are non-obvious and warrant documentation._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of purpose, parameter semantics (grid structure, expected dimensions), return value meaning, and the hardcoded threshold of 4 DIAMONDs._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched lengths, negative we…_

