# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_160650` · Anatoly v0.9.6 (`203dea7-dirty`) · project main @ `7dc4cc6`
**Duration:** 10m 22s · **Cost:** $2.58 · **Tokens:** 177 in / 130K out

**Global F1:** 75.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 72.7% | 57.1% | 100.0% | 4 | 0 | 3 | 10m 16s | $0.59 | 35K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 1m 7s | $0.08 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 21s | $0.09 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 4m 9s | $0.22 | 12K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 23s | $0.10 | 3K |
| best-practices | ✓ | 61.5% | 80.0% | 50.0% | 4 | 4 | 1 | 18m 20s | $1.03 | 64K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 21s | $0.15 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 1m 42s | $0.26 | 5K |

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

## False positives (4)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (46)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (30)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE affects computePayout output but is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior, missing-key behavior, and type-cast correctness are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline coordinate correctness is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-leading, SCATTER early-exit, run < 3 cutoff, and mixed WILD runs are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier math, no-win path, and payout calculation against lineBet are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. The house-edge application is inverted (multiplies by 1.05 instead of reducing), the flat +1% bet bonus is undocumented, and Math.ceil rounding are all untested. Critical exported…_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists. Primary exported function imported by src/index.ts. Bet validation, payout computation, free-spin triggering, jackpot detection, and wildMultiplier accumulation are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS array is used by pickFromWeighted and getReelSymbols; no tests verify its contents or ordering._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values directly affect game payout rates; no tests verify correctness or sum._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file. Maps ReelWeightConfig to ordered array; no tests verify field ordering matches SYMBOLS array order._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. No tests verify 5 reels exist or that each has 8 weights aligned to SYMBOLS._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probability engine; no tests for uniform weights, zero-weight exclusion, single-item input, or boundary where r == acc._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts for critical spin path; no tests verify 3-row output, valid symbol membership, or out-of-bounds reelIndex behavior._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Consumed by spin() in src/engine.ts; no tests verify returned array length, symbol membership, or immutability._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Consumed by spin() in src/engine.ts; no tests verify correct weights per reelIndex or out-of-bounds behavior._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Function is consumed by critical spin logic in engine.ts and legacy.ts — missing tests for all count values (3/4/5), unknown symbols returning 0, and boundary counts (0, 1, 2)._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file exists. Used by the critical `spin` function in engine.ts — pass-through behavior is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Methods on, off, and emit are untested — including edge cases like removing a non-existent handler, emitting with no listeners, multiple handlers for the same event, and handler d…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is consumed by the critical spin() function in engine.ts but its integration with SpinEventEmitter.emit is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists for this source file._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts, but neither the factory nor its reel-building logic has any direct tests._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Critical path in spin engine with no coverage for zero scatters, exactly 3 scatters, or multi-reel scatter distribution._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches (initial activation, retrigger, decrement, deactivation at 0) all untested despite being core free-spin lifecycle logic called by the main spin function._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical gaming RNG function used in slot machine spin logic lacks any coverage: zero distribution validation, no edge case testing (single item, all-zero weights, mismatched arra…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical jackpot logic consumed by spin() with no coverage of: exactly 4 diamonds (boundary true), 3 diamonds (boundary false), 0 diamonds, diamonds spread across multiple reels v…_

### documentation (16)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block describing purpose and RTP target. Missing: @param descriptions for lineWins and bet (typed any, no constraint documented), @returns, and the unconditional bet*0.01 floor behavior is…_
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _No JSDoc on the primary exported public API. Bet validation rules, thrown string error, scatter/free-spin side effects, jackpot detection, and wild-multiplier computation are all undocumented at the c…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), return shape (always 3 symbols), and the fact that each row is sampled independently._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No explanation of return value ordering or that the array is the canonical symbol set driving all reel logic._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), what the returned numbers represent (relative weights, not probabilities), and that the array is parallel to getReelSymbols()._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing: description of what 'multiplier' means (base multiplier applied to lineBet), valid count range (3–5), return value of 0 for unknown symbols or count < 3, and WILD/SCATTER be…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, contract, and expected extension behavior are not documented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on class or method. `adjustPayout` returns the result unchanged — this identity behavior warrants a comment explaining intent (pass-through/no-op strategy)._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). All three methods are part of the public API consumed by `spin()` in src/engine.ts and lack parameter/return/behavior docs._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. As a string constant used as an event name in `spin()`, a doc explaining when this event fires and what args are passed would be useful._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Abstract factory pattern with a single abstract method — the contract (why subclasses exist, what buildReels must guarantee) is non-obvious from the name alone._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on the class or its buildReels override. Key behavior — that _rowCount is ignored and spinReel is called per reel index — is invisible without docs._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of grid-wide scatter counting behavior, parameter shape, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. The three-branch state machine logic (activate, retrigger, decrement/deactivate) and mutation-in-place contract are non-obvious and require documentation._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _Block-level JSDoc describes the algorithm and use case, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g. empty arrays, mismatched arra…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing description of jackpot trigger logic (≥4 DIAMOND symbols anywhere on the grid), the shape/meaning of the `reels` parameter, and the boolean return value semantics._

