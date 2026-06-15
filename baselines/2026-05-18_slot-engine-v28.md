# Anatoly Bench Score — slot-engine

**Run:** `2026-05-18_120035` · Anatoly v0.9.6 (`ab1034e-dirty`) · project main @ `7dc4cc6`
**Duration:** 12m 6s · **Cost:** $5.67 · **Tokens:** 230 in / 166K out

**Global F1:** 67.3%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 57.1% | 57.1% | 57.1% | 4 | 3 | 3 | 14m 35s | $1.74 | 55K |
| utility | ✓ | 76.9% | 71.4% | 83.3% | 5 | 1 | 2 | 38s | $0.07 | 6K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 51s | $0.09 | 15K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 29s | $0.59 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 8s | $0.29 | 4K |
| best-practices | ✓ | 50.0% | 60.0% | 42.9% | 3 | 4 | 2 | 17m 15s | $2.05 | 68K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 9s | $0.41 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 32s | $0.44 | 7K |

## Misses (10)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-WILD-HELPER** — src/wild.ts (applyWildBonus) — expected verdict `DEAD` (dead-helper-superseded-by-inline)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:44 (spinReel) — _REEL_WEIGHTS[reelIndex] is undefined for reelIndex ≥ 5 or < 0; subsequent pickFromWeighted call crashes on wts.reduce()._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] returns undefined for out-of-range reelIndex; return type number[] does not reflect this._
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Inferred regulated gaming/casino domain from paytable, paylines, RTP-95% target, and jackpot vocabulary in reference docs. Math.random() is a non-cryptographic, non-auditable PRNG seeded by the JS eng…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type but never imported by any file per import analysis._
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Testability_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE affects every payout calculation and its 0.05 value contradicts the JSDoc comment claiming ~95% RTP (applying 1+0.05 multiplier increases payouts, not decreases them). …_
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is false and its code path is never exercised._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve logic, type-unsafe cast in resolve, and missing-key behavior are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline shape correctness (all entries in [0,2], exactly 5 columns) and payline logic are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-leading, WILD-only, SCATTER-lead, run < 3, and run >= 3 branches are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding formula and null-return path are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. The unconditional `bet * 0.01` bonus, the HOUSE_EDGE branch (only triggered when total > 0), Math.ceil rounding, and the `bet: any` type unsafety are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Array contents and ordering are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists. Weight values (sum, individual fields) are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists. Ordering and completeness of output array are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. Reel count (5) and per-reel weight arrays are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Critical probabilistic logic — distribution correctness, boundary (r == acc), single-item, and zero-weight cases all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts; column length (3), valid symbol membership, and out-of-bounds reelIndex are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts; return identity and array contents untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; correct index mapping and returned array contents untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Internal lookup table is implicitly exercised only through getPayMultiplier, which is also untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by engine.ts and legacy.ts — critical payout logic covering all 6 symbols, counts 3/4/5, unknown symbol fallback (returns 0), and count<3 fallback are all untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts but adjustPayout (identity passthrough) is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Core event emitter used by src/engine.ts — on/off/emit methods and edge cases (duplicate handlers, unknown events, multiple args, handler removal) are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is consumed by src/engine.ts but no test verifies its value or integration usage._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. buildReels is used by src/engine.ts (critical path) but has zero test coverage — reelCount loop behavior, spinReel integration, and return shape are all untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Missing tests for: zero scatters, single scatter, exactly 3 scatters, scatters across multiple reels, non-scatter symbols mixed in._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Missing tests for all four branches: initial activation (scatters>=3, inactive), retrigger (scatters>=3, active), decrement (active, no scatter), deactivation at remaining<=0._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic (jackpot threshold, diamond counting across reels) used by src/engine.ts has zero test coverage._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical gaming RNG utility used by src/engine.ts has zero coverage — missing tests for uniform distribution, single-item arrays, zero-weight items, mismatched array lengths, and …_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block describing purpose and RTP target, but missing @param tags for lineWins and bet, no @returns tag, and does not note the unconditional +1% base bet addition or the Math.ceil rounding._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API. No JSDoc on reelIndex range (0–4), return shape (3-element column), or sampling strategy._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API. No JSDoc; return value mutability and ordering semantics (mirrors REEL_WEIGHTS index mapping) are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API. No JSDoc on valid reelIndex range, return array length, or relationship between indices and SYMBOLS order._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc. Exported function. Neither parameter is described (`count` requires knowing it means matched-symbol run length 3–5), the return unit (multiplier applied to lineBet) is absent, and the 0 fall…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with non-obvious contract (strategy pattern for post-processing SpinResult) warrants at minimum a description and note on how to extend it._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through behavior is non-obvious without documentation; a one-line description clarifying it returns result unmodified would suffice._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Class and all three public methods (on, off, emit) lack JSDoc. Parameters and return types are undocumented; lifecycle semantics (one-per-spin vs shared) are unexplained._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc describing when this event fires or what arguments are passed to handlers._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. 'buildReels' silently ignores '_rowCount', which is non-obvious behavior that warrants documentation. No description of how spinReel is used per reel index or what the output represe…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. that it counts all SCATTER symbols across the entire grid regardless of position)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-trivial state-machine logic (trigger, retrigger, decrement, deactivation) with side effects on the state argument — all require documentation. Missing param descriptions, trigger…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of the jackpot condition (≥4 DIAMOND symbols anywhere on the grid), parameter description for `reels`, and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes the function's purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, negative weights, or mismatch…_

