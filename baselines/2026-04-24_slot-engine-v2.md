# Anatoly Bench Score — slot-engine

**Global F1:** 40.7%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 53.3% | 57.1% | 50.0% | 4 | 4 | 3 |
| utility | ✓ | 60.0% | 60.0% | 60.0% | 3 | 2 | 2 |
| duplication | ✓ | 0.0% | 0.0% | 100.0% | 0 | 0 | 4 |
| overengineering | ✓ | 40.0% | 25.0% | 100.0% | 1 | 0 | 3 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 50.0% | 60.0% | 42.9% | 3 | 4 | 2 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (14)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-TYPE** — src/types.ts (LegacySpinResult) — expected verdict `DEAD` (dead-type-export)
- **[duplication · medium] DUP-RNG** — src/rng.ts (weightedPick) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[duplication · medium] DUP-LINE-WIN** — src/paytable.ts (lineWins) — expected verdict `DUPLICATE` (semantic-duplicate-predicate)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts (AbstractReelBuilderFactory) — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts (SpinStrategy) — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (10)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:17 (EngineContainer) — _resolve() returns `this.registry.get(key) as T` with no undefined guard. When an unregistered key is queried the Map returns undefined, which is silently cast to T and will cause a runtime TypeError a…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:56 (getReelWeights) — _No bounds check on reelIndex. REEL_WEIGHTS[reelIndex] returns undefined for out-of-range indices, and the return type declares number[], so callers receive undefined typed as number[], leading to down…_
- **[correction] `NEEDS_FIX`** — src/events.ts:3 (SpinEventEmitter) — _In `emit`, the snapshot of `handlers` is not taken before iterating. If a handler calls `off` or `on` during iteration, the array referenced by `handlers` is mutated mid-loop (via `filter` producing a…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:8 (StandardReelBuilderFactory) — _The `_rowCount` parameter is silently ignored when calling `spinReel(i)`. If `spinReel` produces a fixed-size row result internally, the number of rows returned may not match the `rowCount` contract i…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with 0 runtime and 0 type-only importers._
- **[utility] `DEAD`** — src/paytable.ts:23 (lineWins) — _Auto-resolved: no RAG candidate above 0.68 threshold_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math in computePayout and is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. DEBUG_MODE flag behavior (console.log branch) is never exercised in any test._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve methods, including their type-unsafe cast, are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. The module-level container wiring is never verified in isolation._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. The 10 payline definitions and their correctness against reel layout are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _Auto-resolved: no RAG candidate above 0.68 threshold (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified src/engine.ts:47-64. The function correctly: (1) identifies the leading non-WILD …_
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding logic (basePayout * (1+wc) * 2^wc) and null-return path are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. The house-edge application (incorrectly increases payout), the flat 1% bet bonus, and Math.ceil rounding are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file found. SYMBOLS constant has no test coverage whatsoever._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file found. DEFAULT_WEIGHTS constant is untested; values directly affect game odds and should be validated._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file found. weightsToArray has no tests; ordering correctness is critical since it maps config fields to indexed array positions used in weighted picks._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file found. REEL_WEIGHTS constant is untested; structure (5 reels, each with 8 weights) is never validated._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _Auto-resolved: no RAG candidate above 0.68 threshold (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified src/reels.ts:30-41. The weighted random selection algorithm is correct: (1) sums …_
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file found. spinReel is imported by src/factories.ts making it a critical path; happy path, invalid reelIndex, and column length (3 rows) are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file found. getReelSymbols is imported by src/engine.ts but has zero test coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file found. getReelWeights is imported by src/engine.ts; out-of-bounds reelIndex returning undefined is never tested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file found. The internal pay table structure is untested; its correctness is implicitly exercised only via getPayMultiplier, which is itself untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file found. This function is imported by src/engine.ts and src/legacy.ts — critical callers — yet has no tests covering valid counts (3, 4, 5), invalid counts (0, 1, 2, 6+), unknown symbols, o…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _No test file found. Abstract base class with no runtime behavior beyond contract definition, but no tests exist for any subclass behavior either._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. DefaultStrategy is imported by src/engine.ts (a critical caller), meaning its identity-passthrough behavior is untested despite being used in production code paths._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file found. All three methods (on, off, emit) are untested — including edge cases such as emitting with no listeners, removing a non-existent handler, multiple handlers for the same event, and…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. While this is a simple string constant, its correct value is never asserted in any test, and its usage as an event key in src/engine.ts is unverified._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists for this source file. detectScatters is used by the core engine (src/engine.ts) and has multiple edge cases untested: empty reels, reels with no SCATTER symbols, all SCATTER symbol…_
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists for this source file. handleFreeSpins is critical game logic used by src/engine.ts with at least 4 distinct branches untested: initial activation (scatters>=3, inactive), re-trigge…_
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file found. Abstract base class with no runtime behavior beyond defining the interface, but its contract is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. This class is imported by src/engine.ts, indicating it is part of a critical game engine path. buildReels logic (loop, spinReel calls, reel assembly) is entirely untested — no cove…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _Auto-resolved: no RAG candidate above 0.68 threshold (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified src/rng.ts:5-16. The weighted random selection algorithm is correct: (1) sums wei…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found for this source file. The function has no test coverage whatsoever — neither happy path (exactly 4 DIAMONDs, more than 4, fewer than 4), nor edge cases (empty reels, all DIAMONDs, z…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block with a brief purpose description and a note about house edge, but is missing @param descriptions for 'lineWins' and 'bet' (the latter is typed 'any'), and a @returns explanation. The…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: description of what 'spinning' a reel means, the valid range for reelIndex (0–4), that the return value is always exactly 3 symbols (one per row), and behav…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of what it returns (the fixed master symbol list) or whether the returned array is a copy or a live reference._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid range for reelIndex, what the returned numbers represent (relative weights), whether the array is a live reference or a copy, and behavior on out-of-b…_
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public function with no JSDoc/TSDoc comment. Missing documentation for: the valid range of 'count' (3–5), the fact that counts outside that range return 0, and that WILD/SCATTER symbols (abse…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc/TSDoc comment present. The abstract class and its abstract method `adjustPayout` have no documentation describing the extension contract, expected behavior of implementors, or the role of thi…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc/TSDoc comment present. Neither the class nor the `adjustPayout` override is documented. The pass-through behavior (returning the result unchanged) is not trivially obvious from the name alone…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _The exported class and all three of its public methods (on, off, emit) have no JSDoc comments whatsoever. Missing class-level description, parameter docs for event name and handler arguments, and no d…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. The constant lacks documentation describing when this event is emitted, what payload (args) consumers should expect to receive, and the rationale for exporting it as a named constant…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc/TSDoc comment present. The function's parameter (`reels`) and return value (scatter count) are undescribed. The non-obvious behavior — that counting is grid-wide across all columns, not payli…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc/TSDoc comment present. Both parameters (`state`, `scatters`) lack descriptions. The complex branching logic — initial trigger at ≥3 scatters, retrigger adding 10 spins, and per-spin decrement…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc/TSDoc comment is present on the class or its abstract method. The class name suggests a factory pattern, but the contract of `buildReels` — what `reelCount` and `rowCount` represent, what the…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc/TSDoc comment on the class or its `buildReels` override. Notably, `_rowCount` is silently ignored because `spinReel` fixes reel height internally — a non-obvious constraint that callers canno…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _Auto-resolved: no RAG candidate above 0.68 threshold (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified src/rng.ts:5-16. The weighted random selection algorithm is correct: (1) sums wei…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment present. The function has no documentation describing its purpose, the `reels` parameter, the return value semantics, or the threshold rule (≥4 DIAMOND symbols triggers jackpot)…_

