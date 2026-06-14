# Anatoly Bench Score — slot-engine

**Run:** `2026-05-19_162328` · Anatoly v0.9.6 (`9be94c0-dirty`) · project main @ `7dc4cc6`
**Duration:** 20m 7s · **Cost:** $7.39 · **Tokens:** 230 in / 147K out

**Global F1:** 57.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 61.5% | 57.1% | 66.7% | 4 | 2 | 3 | 7m 16s | $0.68 | 30K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 1m 30s | $0.10 | 15K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 41s | $0.10 | 15K |
| overengineering | ✓ | 40.0% | 25.0% | 100.0% | 1 | 0 | 3 | 3m 22s | $0.35 | 11K |
| tests | — | — | — | — | 0 | 0 | 0 | 54s | $0.17 | 3K |
| best-practices | ✓ | 33.3% | 40.0% | 28.6% | 2 | 5 | 3 | 16m 43s | $1.22 | 68K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 5s | $0.25 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 20s | $0.41 | 7K |

## Misses (12)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:120 (spin) — _rng (line 120) and reelsModule (line 122) are resolved from the container but never passed to factory.buildReels or used anywhere; reels are built by StandardReelBuilderFactory without the injected RN…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] is undefined for invalid indices; TypeScript types the return as number[] but runtime produces undefined, shifting the crash to the caller._
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with 0 importers from other files_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (43)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _Auto-resolved: JSDoc block found before symbol (deliberated: confirmed — Confirmed. src/engine.ts:105 applies `total * (1 + HOUSE_EDGE)` (= ×1.05), increasing payouts by 5%. The JSDoc at lines 97-100 …_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists; critical weighted-random logic with boundary behavior (r == total edge case, weight=0 symbols) is entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists; imported by src/factories.ts making this a critical untested path._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists; imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists; imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Critical function imported by engine.ts and legacy.ts — missing coverage for valid symbols at counts 3/4/5, unknown symbols (returns 0), count < 3 (returns 0), and count > 5 (retu…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Class has non-trivial behavior: on/off/emit interactions, multiple listeners, duplicate handler removal, emit with no listeners — all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant used as an event name in engine.ts but never verified in tests._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Critical game logic used by engine.ts has zero test coverage._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. State mutation logic with multiple branches (activation, retrigger, decrement, deactivation) is entirely untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Abstract base class with no test file. No tests verify the contract or subclass behavior._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. `buildReels` is used by `src/engine.ts` (a critical path), but no tests cover reel count, row count handling, or `spinReel` integration. The `_rowCount` parameter being ignored is …_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic used by src/engine.ts has no test coverage — missing happy path (≥4 diamonds), boundary (exactly 4), negative case (<4), and edge cases (empty reels, single ree…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weights summing to zero, and boundary behavior of the final fallback re…_

### documentation (14)

- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: description of reelIndex valid range (0–4), the fixed 3-row output size, and return type semantics._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No comment on whether the returned array is a copy or the live reference, nor its ordering significance._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid range for reelIndex, whether the returned array is a live reference (mutations would affect behaviour), and weight ordering relative to SYMBOLS._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: what `count` represents, valid range, return value semantics (multiplier vs. absolute payout), and behavior when symbol is absent from PAY_TABLE._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Class and all three public methods (on, off, emit) lack JSDoc. Key behavioral constraints — no `once`, no error event, new instance per `spin()` call — are completely undocumented in inline comments o…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. The constant's purpose (when it is emitted, who listens, what payload it carries) is not documented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Purpose, parameter shape, and return value are not described._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. The three-branch state machine logic (trigger, re-trigger, decrement/deactivate) and mutation side-effects are non-obvious and warrant documentation._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. The class name hints at its role, but the non-obvious `rowCount` parameter semantics (accepted by interface, currently ignored by the standard impl) and the factory pattern contract …_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on the class or its `buildReels` method. The silent `_rowCount` ignore is a meaningful behavioral constraint that callers cannot discover without reading the source._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _Exported public function with no JSDoc/TSDoc comment. Missing: purpose description, @param for reels, @returns explanation, and the critical constraint that ≥4 DIAMOND symbols anywhere in the grid tri…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions (no docs for `items` or `weights`), no @returns tag, and no mention of edge cases (empty arrays, negative/zero weights, mismatched a…_

