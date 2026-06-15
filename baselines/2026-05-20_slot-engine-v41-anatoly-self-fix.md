# Anatoly Bench Score — slot-engine

**Run:** `2026-05-20_204657` · Anatoly v0.9.6 (`694aaeb-dirty`) · project main @ `7dc4cc6`
**Duration:** 9m 38s · **Cost:** $3.75 · **Tokens:** 230 in / 151K out

**Global F1:** 68.0%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 50.0% | 57.1% | 44.4% | 4 | 5 | 3 | 13m 30s | $1.01 | 51K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 1m 31s | $0.12 | 14K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 16s | $0.08 | 11K |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 | 2m 58s | $0.33 | 8K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 10s | $0.17 | 3K |
| best-practices | ✓ | 62.5% | 100.0% | 45.5% | 5 | 6 | 0 | 20m 20s | $1.25 | 55K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 26s | $0.27 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 2m 16s | $0.43 | 7K |

## Misses (7)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (13)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:52 (getReelSymbols) — _Returns a direct mutable reference to the internal SYMBOLS array; a caller mutating the returned array corrupts all subsequent spinReel and getReelSymbols calls. Return a shallow copy instead._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _Returns a mutable reference to REEL_WEIGHTS[reelIndex]; docs state weights are read-only at runtime, but any caller mutating the returned array will corrupt spinReel's weight table for all future spin…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] returns undefined for reelIndex outside [0, 4]; return type is number[] but the actual value is undefined, violating the documented contract of valid range 0–4. Add a bounds gu…_
- **[correction] `NEEDS_FIX`** — src/paytable.ts:11 (PAY_TABLE) — _DIAMOND row [50, 250, 1000]: with reel weight 30/120 these multipliers alone produce E[multiplier per payline] ≥ 2.223 (no-wild) and ≥ 9+ (with wild bonus), far exceeding the entire 0.95 RTP budget._
- **[correction] `NEEDS_FIX`** — src/factories.ts:10 (StandardReelBuilderFactory) — _`rowCount` is declared in the signature but unused (renamed `_rowCount`). The abstract contract `buildReels(reelCount, rowCount): Symbol[][]` implies the returned grid respects `rowCount`. If callers …_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical calls to weightsToArray(DEFAULT_WEIGHTS) produce five equal arrays. A single Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or just referencing one shared array would be …_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (43)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Critical probabilistic logic — boundary conditions (r exactly at accumulator boundary, zero-weight entries, single-item list) and the fallback return are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts; always returns 3 symbols per call — column length, valid symbol membership, and out-of-range reelIndex behavior are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts; returns mutable reference to SYMBOLS — aliasing risk untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; out-of-range reelIndex returns undefined silently — untested._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. Constant directly affects computePayout RTP logic but is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false; branch it guards is dead and untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior, type-erasure, and missing-key handling are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton with three registered dependencies; wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Ten payline definitions that drive all win detection are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD substitution logic, SCATTER early-return, run-length threshold (>=3), and all-WILD edge case are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-count multiplier formula, null propagation from checkLine, and payout arithmetic are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Internal constant, but its values are exercised indirectly through getPayMultiplier — which is also untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No tests found. Used by engine.ts and legacy.ts in critical payout paths. Untested edge cases include unknown symbol (returns 0), count < 3 (returns 0), count === 3/4/5 for each symbol, and count > 5 …_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts but adjustPayout (identity function) is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file found. Core event emitter used by src/engine.ts — on(), off(), emit(), and multi-listener scenarios are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. Constant used by src/engine.ts; no tests verify its value or usage contract._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` (critical path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, rowCount ignored behavior)._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by src/engine.ts — no coverage of empty reels, single scatter, exactly 3 scatters, or multi-reel layouts._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Critical state machine with 3 branches (activation, retrigger, decrement/deactivation) and boundary condition at remaining<=0 — all untested._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. No coverage for happy path (≥4 diamonds), edge cases (exactly 4, fewer than 4, empty reels, single reel), or integration with engine.ts call site._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file found. No tests for happy path, edge cases (empty arrays, mismatched lengths, zero weights, single item), or statistical distribution correctness._

### documentation (14)

- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), return shape (3-element column), and independence of per-row picks. (deliberated: reclassified: correction: ERROR protected (co…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of return value order or its correspondence to getReelWeights indices._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), return array length, and read-only semantics (no setter exists)._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc on exported function. Missing: what `count` represents (run length), valid range (3–5), that WILD/SCATTER return 0, and what the return value unit is (base multiplier applied to line bet)._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc. Abstract base class with non-obvious extension contract — purpose, pattern, and subclassing rules are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc. Identity pass-through behavior is not obvious from the name alone and warrants at least a one-liner._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Exported public API with no documentation on lifecycle, threading guarantees, or intended usage pattern._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. String value 'spin:done' is visible but there is no description of when this event is emitted or what arguments accompany it._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc. Critical undocumented behavior: _rowCount is silently ignored — each reel always produces a fixed row count via spinReel(). This constraint is invisible to callers without a comment._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D reel grid), and return semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. State-mutation side effects, the three-branch transition logic (activation, retrigger, decrement/deactivation), and the meaning of the scatters threshold are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Non-obvious behaviors are undocumented: the hardcoded threshold of 4 DIAMONDs, that counting is grid-wide (not payline-restricted), and what the `reels` parameter structure represent…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what happens when items/weights arrays have mismatched lengths, or when weights array is empty) and no @returns t…_

