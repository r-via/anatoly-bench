# Anatoly Bench Score — slot-engine

**Run:** `2026-05-18_160610` · Anatoly v0.9.6 (`3c119a2-dirty`) · project main @ `7dc4cc6`
**Duration:** 13m 9s · **Cost:** $4.85 · **Tokens:** 230 in / 169K out

**Global F1:** 62.1%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 33.3% | 28.6% | 40.0% | 2 | 3 | 5 | 17m 12s | $1.82 | 68K |
| utility | ✓ | 76.9% | 71.4% | 83.3% | 5 | 1 | 2 | 1m 4s | $0.06 | 10K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 59s | $0.05 | 8K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 3m 45s | $0.39 | 11K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 12s | $0.18 | 3K |
| best-practices | ✓ | 66.7% | 80.0% | 57.1% | 4 | 3 | 1 | 16m 46s | $1.63 | 61K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 12s | $0.30 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 3m 24s | $0.42 | 9K |

## Misses (12)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-WILD-HELPER** — src/wild.ts (applyWildBonus) — expected verdict `DEAD` (dead-helper-superseded-by-inline)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (7)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:25 (EngineContainer) — _undefined; the `as T` cast hides the undefined case. An unregistered key yields undefined typed as a callable, crashing when invoked._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] returns undefined for reelIndex outside 0–4; TypeScript types it as number[] but runtime value is undefined, causing downstream crashes._
- **[correction] `NEEDS_FIX`** — src/factories.ts:9 (StandardReelBuilderFactory) — _`_rowCount` is accepted by the abstract contract but discarded. `spinReel(i)` receives only the reel index, not the required row count. If `spinReel` does not hard-code exactly 3 rows, the returned gr…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with zero runtime or type-only importers across the codebase._
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math and is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior, including type-unsafe cast in resolve, is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions are structurally untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD substitution logic, SCATTER short-circuit, run-length threshold (>=3), and leading-WILD resolution are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null propagation from checkLine are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. HOUSE_EDGE application (only when total>0), flat 1% bet bonus, and Math.ceil rounding are untested. Exported and business-critical._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. This constant defines the full symbol universe; its contents are never validated._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values (e.g. sum, individual entries) are never asserted._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file. Order and completeness of the returned array (8 elements, correct mapping) are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Shape (5 reels × 8 weights) and per-reel values are never validated._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Critical probability logic — boundary conditions (r==0, r at exact boundary, r just below total), fallback return, and distribution skew are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts making it a critical path; column length (3), valid symbol membership, and out-of-range reelIndex behavior are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; returned array identity and contents are never asserted._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; out-of-range index and correct per-reel weight array are untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant backing getPayMultiplier; correctness of payout values (e.g. DIAMOND 3-of-a-kind=50) is entirely untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts — a critical payout path. Happy path (count 3/4/5 per symbol), unknown symbol returning 0, and count<3 returning 0 are all untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file. No tests verify the contract or polymorphic behavior._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file exists. DefaultStrategy is used by src/engine.ts, making untested pass-through behavior a coverage gap in a critical path._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Core event emitter used by engine.ts has zero coverage: on/off/emit methods, multi-listener dispatch, handler deduplication, and unknown-event handling are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant imported by engine.ts as a key event signal; its correct usage in emit/on calls is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. Used by src/engine.ts, but buildReels — including reel count, row count handling, and spinReel integration — is entirely untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Missing coverage for: empty reels, reels with no SCATTER, single SCATTER, multiple SCATTERs across columns, non-SCATTER symbols mixed in._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger during active spins, decrement logic, boundary at remaining=1 (deactivation), inactive state with scatters<3._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic (jackpot payout trigger) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds vs 3), no edge cases (empty reels, all diamon…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file found. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, boundary roll values (roll === cumulative), and distribution uniformity.…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and RTP intent, but omits @param and @returns. Description is misleading: HOUSE_EDGE inflates payout rather than applying a house deduction. The flat bet * 0.01 bonus is also u…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _No JSDoc. Valid range of reelIndex, returned array length (always 3), and sampling strategy are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _No JSDoc. Returns the shared SYMBOLS array by reference; mutation risk and ordering guarantee are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _No JSDoc. Valid reelIndex range and the fact the returned array is a live reference (not a copy) are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public function with no JSDoc. Missing: what 'count' represents, what the returned number is relative to (raw credits? multiplier?), and that counts below 3 or above 5 return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with a non-obvious strategy pattern contract — purpose, extension semantics, and the adjustPayout lifecycle are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through identity behavior is not self-evident from the name alone; missing explanation of when/why to use this vs other strategies._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Lifecycle, thread-safety assumptions, and event name conventions are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. The string value 'spin:done' and what payload is emitted with this event are not documented inline._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on the class or its buildReels method. The fact that _rowCount is ignored (unused parameter) is a non-obvious behavior that warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g., that SCATTERs are counted across the entire grid regardless of position)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-trivial state machine logic (trigger, retrigger, decrement, deactivation) with side-effect mutations on state — behavior is not obvious from the signature alone. Trigger threshol…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols), parameter explanation for `reels` layout, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what happens when items/weights arrays differ in length, or when weights are empty/zero), and no @returns tag. (d…_

