# Anatoly Bench Score — slot-engine

**Global F1:** 32.4%

## Per-axis scores

| Axis | F1 | Recall | Precision | TP | FP | FN |
|------|---:|------:|----------:|---:|---:|---:|
| correction | 66.7% | 71.4% | 62.5% | 5 | 3 | 2 |
| utility | 80.0% | 80.0% | 80.0% | 4 | 1 | 1 |
| duplication | 0.0% | 0.0% | 100.0% | 0 | 0 | 4 |
| overengineering | 0.0% | 0.0% | 100.0% | 0 | 0 | 4 |
| tests | 18.2% | 75.0% | 10.3% | 3 | 26 | 1 |
| best-practices | 40.0% | 40.0% | 40.0% | 2 | 3 | 3 |
| documentation | 22.2% | 66.7% | 13.3% | 2 | 13 | 1 |

## Misses (16)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · trivial] DEAD-TYPE** — src/types.ts — expected verdict `DEAD` (dead-type-export)
- **[duplication · medium] DUP-RNG** — src/rng.ts — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[duplication · medium] DUP-LINE-WIN** — src/paytable.ts — expected verdict `DUPLICATE` (semantic-duplicate-predicate)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[overengineering · trivial] OVER-DI** — src/engine.ts — expected verdict `OVER` (di-container-for-three-deps)
- **[tests · medium] MISS-TEST-WILD** — src/wild.ts (applyWildBonus) — expected verdict `UNCOVERED` (missing-tests-for-wild)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts — expected verdict `NEEDS_FIX` (string-thrown-not-error)
- **[documentation · trivial] DOC-NO-JSDOC** — src/engine.ts (spin) — expected verdict `UNDOCUMENTED` (missing-jsdoc-on-public-api)

## False positives (46)

Findings Anatoly emitted without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:56 (getReelWeights) — _No bounds check on reelIndex. REEL_WEIGHTS[reelIndex] returns undefined for any index outside 0–4, but the declared return type is number[]. Callers relying on the type contract will receive undefined…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:8 (StandardReelBuilderFactory) — _The `_rowCount` parameter is accepted but intentionally ignored (prefixed with underscore). `spinReel(i)` is called with only the reel index, meaning row count is never passed through. If `spinReel` s…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:5 (weightedPick) — _Auto-resolved: no RAG candidate above 0.68 threshold_
- **[utility] `DEAD`** — src/paytable.ts:23 (lineWins) — _Auto-resolved: no RAG candidate above 0.68 threshold_
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists for this source file. HOUSE_EDGE affects computePayout output but is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. DEBUG_MODE branch in spin() is never exercised by any test._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file found. register/resolve behavior, type-casting, and missing-key scenarios are entirely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file found. Module-level container initialization and its registered dependencies are not tested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file found. The 10 payline definitions and their correctness are never validated by tests._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _Auto-resolved: no RAG candidate above 0.68 threshold_
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file found. Wild multiplier compounding formula and null-propagation from checkLine are completely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module. SYMBOLS constant has no test coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists. DEFAULT_WEIGHTS values are untested, including correctness of individual weight assignments._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists. weightsToArray ordering logic (mapping config fields to array indices) is completely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. REEL_WEIGHTS structure and per-reel weight arrays are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _Auto-resolved: no RAG candidate above 0.68 threshold_
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. spinReel is imported by src/factories.ts making it a critical path, yet there are zero tests for reel indexing, output length (3 rows), or symbol validity._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. getReelSymbols is imported by src/engine.ts but has no tests verifying the returned array contents or length._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. getReelWeights is imported by src/engine.ts but has no tests for valid index handling or returned weight array correctness._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. PAY_TABLE is a module-private constant but its correctness is critical — wrong payout values would silently corrupt all game results. No tests verify the table values._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. This function is imported by src/engine.ts and src/legacy.ts, making it a critical path. No tests cover: valid symbol+count combos (3/4/5), unknown symbol returning 0, count < 3 r…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _No test file found. Abstract base class with no runtime behavior beyond defining the interface, but concrete subclasses are untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. DefaultStrategy is imported by src/engine.ts (critical path), meaning its identity-passthrough behavior of adjustPayout is used in production but has zero test coverage._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists for this module. The class has non-trivial behavior across three methods (on, off, emit) including edge cases like removing non-existent handlers, emitting with no listeners, multi…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. While this is a simple string constant, its correct usage as an event name in src/engine.ts is untested — integration tests verifying the spin:done event lifecycle are absent._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Function is imported by src/engine.ts (core engine path) but has zero test coverage. Edge cases like empty reels, no scatters, single scatter, and multiple scatters per reel are al…_
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. This class is imported by src/engine.ts indicating it is on a critical code path. No tests exist for buildReels behavior, including correct reel count, correct row count handling, …_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found for this source file. isJackpotHit has zero test coverage despite being a critical business logic function used by src/engine.ts. No tests exist for the happy path (exactly 4 DIAMON…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _Auto-resolved: no RAG candidate above 0.68 threshold_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of why consumers would need this, whether the returned array is a shared reference or a copy, or its ordering guarantees._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid range of reelIndex, description of the returned array's ordering (matches SYMBOLS order), and whether the array is a live reference or a copy._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc at all. Missing: description of purpose, @param for 'symbol' and 'count', @returns explanation, and a note that WILD/SCATTER (or any unknown symbol) always returns 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc/TSDoc comment present. As the primary extension point for payout adjustment, it warrants at minimum a description of the abstract contract, when to subclass, and what adjustPayout is expected…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc/TSDoc comment present. The pass-through behavior (returning the result unchanged) is non-obvious from the class name alone and deserves a brief note documenting its intent as the no-op baseli…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Exported public class with no JSDoc on the class itself and no JSDoc on any of its three public methods (`on`, `off`, `emit`). Important behavioral details — such as that this is a zero-dependency, en…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _Exported constant with no JSDoc comment. There is no description of when this event is emitted, what arguments are passed to its handlers, or why a named constant is preferred over a string literal._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc/TSDoc comment present. The function's purpose (counting SCATTER symbols across all reels), its parameter shape, and return value semantics are not documented inline._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc/TSDoc comment present. Critical behavior such as the trigger threshold (>=3 scatters), initial award (10 spins), retrigger logic, and state mutation side-effects are entirely undocumented inl…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc/TSDoc comment is present. Key details such as the meaning of 'standard', the intentional ignoring of the _rowCount parameter and why, the delegation to spinReel(i), and the fixed implicit row…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment is present above the function. The function has no documentation describing its purpose, the meaning of the `reels` parameter, the jackpot trigger condition (≥4 DIAMOND symbols)…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _Auto-resolved: no RAG candidate above 0.68 threshold_

