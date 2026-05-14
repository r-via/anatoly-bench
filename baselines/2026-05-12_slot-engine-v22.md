# Anatoly Bench Score — slot-engine

**Run:** `2026-05-12_221633` · Anatoly v0.9.6 (`2834cba-dirty`) · project main @ `7dc4cc6`
**Duration:** 9m 35s · **Cost:** $4.88 · **Tokens:** 231 in / 165K out

**Global F1:** 69.4%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 57.1% | 57.1% | 57.1% | 4 | 3 | 3 | 12m 24s | $1.46 | 49K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 44s | $0.04 | 6K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 25s | $0.07 | 12K |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 | 3m 18s | $0.49 | 12K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 5s | $0.18 | 3K |
| best-practices | ✓ | 62.5% | 100.0% | 45.5% | 5 | 6 | 0 | 20m 44s | $2.18 | 79K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 8s | $0.19 | 4K |
| _refinement_ | — | — | — | — | — | — | — | 2m 8s | $0.28 | 6K |

## Misses (7)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (11)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:24 (EngineContainer) — _registry.get(key) returns undefined when key is absent; as T suppresses the type error, delivering undefined to callers that expect a real T._
- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Math.ceil rounds payout up; slot-machine industry convention (and house-edge correctness) requires Math.floor so the house retains the fractional remainder._
- **[correction] `NEEDS_FIX`** — src/factories.ts:9 (StandardReelBuilderFactory) — _`_rowCount` is discarded and never forwarded to `spinReel(i)`. The abstract interface establishes that callers pass `rowCount` to control grid height; if `spinReel` returns a fixed or random row count…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _All 5 entries are identical `weightsToArray(DEFAULT_WEIGHTS)` calls. Building a per-reel weight matrix when every reel currently uses the same weights is premature generalization. A single shared weig…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math but is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false; dead code path is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve logic and type-unsafe cast are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline coordinate data drives all win evaluation but is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-lead substitution, SCATTER short-circuit, and run-length cutoff logic are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null-return path are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. HOUSE_EDGE inflation on wins, guaranteed 1% bet floor, and Math.ceil rounding are all untested. Called by spin which is the public entry point._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS drives all reel outcomes; untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values directly control payout odds; correctness is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Five-reel weight matrix is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Critical weighted-random logic — boundary at r==total, single-item arrays, zero-weight items — all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts; out-of-range reelIndex would silently pass undefined weights to pickFromWeighted; untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Used by src/engine.ts; untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Used by src/engine.ts; out-of-bounds index returns undefined silently; untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant backing getPayMultiplier — untested indirectly and directly._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts (critical payout paths), yet count=3/4/5 branches, unknown symbol fallback, and count<3 return-0 path are all untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Class has non-trivial behavior: multi-listener registration, handler deduplication on off(), emit with args, and silent no-op paths — none are tested. Used by src/engine.ts, makin…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. String constant used as an event key in src/engine.ts; its correctness depends on integration tests that are also absent._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Used by src/engine.ts (core engine path), yet buildReels loop logic, reelCount/rowCount handling, and spinReel integration are all untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Missing coverage for: empty reels, single scatter, exactly 3, mixed symbols, nested empty columns._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger while active, decrement, expiry (remaining<=0), inactive state with <3 scatters._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Function has critical edge cases untested: single-item arrays, zero weights, negative weights, mismatched array lengths, floating-point precision, and boundary behavior when roll …_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — happy path, boundary (exactly 4 vs 3 diamonds), empty reels, and mixed-symbol grids all untested._

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes house-edge application and RTP target, but omits parameter types/descriptions, the +1% floor added unconditionally, Math.ceil rounding, and the `bet: any` type issue. (deliberated: con…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: @param reelIndex (valid range 0–4, out-of-bounds yields undefined weights), @returns (3-symbol column), and behavior description._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Should document that it returns the shared SYMBOLS reference (mutation risk) and what callers use it for._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing @param reelIndex (valid range), @returns (live array reference — mutation affects reel behavior), and purpose._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc. Missing description of what 'count' represents (matching symbols on a line), valid count range, return semantics (0 for no win), and relationship to PAY_TABLE._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). None of on/off/emit document their parameters, return values, or edge-case behavior (e.g. emit is a no-op when no listeners are regi…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment explaining when this event is emitted or what payload callers should expect._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. buildReels and its parameters (reelCount, _rowCount — notably rowCount is ignored) are undocumented; the ignored parameter is a non-obvious behavioral detail that warrants explanatio…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. what constitutes a scatter count)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. State mutation side-effects, trigger threshold (>=3 scatters), spin award amount (10), and decrement-on-spin behavior are all undocumented. (deliberated: confirmed — Partially confir…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, lacks @returns documentation, and does not document edge cases (e.g., empty arrays, negative weights, mis…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot logic, explanation of the DIAMOND threshold (>=4), parameter shape (2D reel array), and boolean return semantics._

