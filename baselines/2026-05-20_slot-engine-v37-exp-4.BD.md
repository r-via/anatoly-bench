# Anatoly Bench Score — slot-engine

**Run:** `2026-05-20_151616` · Anatoly v0.9.6 (`5c37f4f-dirty`) · project main @ `7dc4cc6`
**Duration:** 8m 49s · **Cost:** $3.49 · **Tokens:** 227 in / 142K out

**Global F1:** 65.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 72.7% | 57.1% | 100.0% | 4 | 0 | 3 | 17m 11s | $1.19 | 63K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 1m 15s | $0.10 | 11K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 3s | $0.09 | 9K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 23s | $0.34 | 9K |
| tests | — | — | — | — | 0 | 0 | 0 | 58s | $0.16 | 3K |
| best-practices | ✓ | 18.2% | 20.0% | 16.7% | 1 | 5 | 4 | 11m 7s | $0.76 | 40K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 25s | $0.26 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 2m 14s | $0.49 | 7K |

## Misses (11)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-ANY** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (any-type-on-financial-api)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-MAGIC-NUMBERS** — src/engine.ts — expected verdict `NEEDS_FIX` (inline-numeric-literals)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (6)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with 0 runtime importers; not imported by any file_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Critical path: applies house edge incorrectly (adds edge instead of reducing) and always adds 1% of bet; untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. This is the most critical untested symbol — probabilistic selection logic with boundary behavior (r exactly at accumulator boundary, single-item lists, zero-weight items) is untes…_
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts — a critical caller path with no coverage for valid reelIndex, out-of-bounds reelIndex, or output shape (3 symbols per column)._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts. Out-of-bounds reelIndex returns undefined with no guard — untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. PAY_TABLE is internal but drives all payout calculations — untested indirectly._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file. Imported by src/engine.ts and src/legacy.ts — critical payout path with no coverage for any symbol, count boundary (2, 3, 4, 5, 6), or unknown symbol returning 0._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts — identity payout pass-through is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical class used by src/engine.ts — on/off/emit methods, multiple listeners, handler deduplication on off(), and emit-with-no-listeners path are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant imported by src/engine.ts but never verified in tests._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — no happy path, no edge cases (reelCount=0, reelCount>0, spinReel failure)._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Critical game logic used by engine.ts with no coverage._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. State machine with 4 branches (activation, retrigger, decrement, deactivation) — all untested._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weight distribution uniformity. Called by src/engine.ts, suggesting it …_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Called by src/engine.ts, making it a critical path with no coverage for happy path, edge cases (fewer than 4 diamonds, exactly 4, empty reels, nested empty arrays), or boundary con…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc description and notes the house-edge RTP target, but missing @param for lineWins and bet (typed as any), missing @returns, and the unconditional floor of bet * 0.01 is not explained._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: description of reelIndex range (0–4), explanation that return value is a 3-element column, and any note on independence of picks._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of return value order or that it mirrors the weight-array index mapping._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), description of returned array length/order, and that weights are read-only._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing @param descriptions for symbol and count, no @returns, and no note that WILD/SCATTER return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. The identity-pass-through behavior is not obvious from the name; a one-line description would suffice but is absent._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Exported public class with no JSDoc on the class or any of its three methods (on, off, emit). Missing: class-level purpose, event name conventions, listener ordering guarantees, and per-method paramet…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _Exported constant with no JSDoc. The string value 'spin:done' hints at purpose but does not document when the event fires, what arguments are passed to listeners, or which emitter emits it._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or `buildReels`. Critical non-obvious behavior — `_rowCount` is silently ignored; each reel always produces a fixed row count via `spinReel()` — is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of scatter counting logic (full grid vs paylines), parameter shape, and return semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-obvious state machine with three branches (activate, retrigger, decrement/deactivate) and in-place mutation — all undocumented._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (empty arrays, mismatched array lengths, negative wei…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing: purpose description, @param for reels, @returns explanation, and the hardcoded threshold of 4 DIAMOND symbols._

