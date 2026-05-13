# Anatoly Bench Score — slot-engine

**Run:** `2026-05-13_233229` · Anatoly v0.9.6 (`0f81f2f-dirty`) · project main @ `7dc4cc6`
**Duration:** 8m 24s · **Cost:** $4.57 · **Tokens:** 230 in / 149K out

**Global F1:** 68.7%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 55.6% | 71.4% | 45.5% | 5 | 6 | 2 | 10m 29s | $1.24 | 39K |
| utility | ✓ | 76.9% | 71.4% | 83.3% | 5 | 1 | 2 | 1m 7s | $0.11 | 11K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 35s | $0.11 | 14K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 12s | $0.53 | 11K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 0s | $0.29 | 3K |
| best-practices | ✓ | 58.8% | 100.0% | 41.7% | 5 | 7 | 0 | 17m 30s | $1.98 | 68K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 8s | $0.31 | 4K |
| _refinement_ | — | — | — | — | — | — | — | 3m 2s | $0.00 | 0 |

## Misses (7)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-WILD-HELPER** — src/wild.ts (applyWildBonus) — expected verdict `DEAD` (dead-helper-superseded-by-inline)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (14)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _`Math.ceil` rounds payout up, awarding the player the fractional coin. Casino/gambling industry convention requires `Math.floor` so the house retains the remainder._
- **[correction] `NEEDS_FIX`** — src/reels.ts:44 (spinReel) — _REEL_WEIGHTS[reelIndex] returns undefined for any reelIndex outside [0, 4]. Passing undefined as wts to pickFromWeighted causes wts.reduce() to throw TypeError at runtime. No guard or early-return exi…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] is undefined for reelIndex outside [0, 4]. TypeScript types the return as number[] but the actual value is undefined, which will crash any caller that iterates or reads from th…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:9 (StandardReelBuilderFactory) — _`_rowCount` is part of the abstract contract (L5) and callers rely on it to control the inner-array length of the returned `Symbol[][]`, but it is never forwarded to `spinReel(i)`. Any caller requesti…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Math.random() is a non-cryptographic PRNG and is not certifiable for regulated gaming. Domain is unambiguously casino/slot from the README arbitrated intents (jackpotHit, freeSpinsAwarded, 95% RTP tar…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:15 (weightedPick) — _When items is empty, the for-loop body never executes and the fallback returns items[items.length - 1] = items[-1] = undefined, violating the T return type. No guard exists for this case._
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Testability_

## Unscored findings (42)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math but is never exercised in tests._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant controls debug logging path; untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve logic, including unsafe cast in resolve, has no coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions drive all line-win logic but are never verified._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-leading fallback, SCATTER short-circuit, and run-length boundary (run < 3) are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-multiplier compounding formula and null-return path have no coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Exported public function with house-edge application, base-bet bonus, and Math.ceil rounding — all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists; weighted-selection logic has edge cases (boundary r==total, single item, zero-weight entries) that are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists; imported by src/factories.ts making it a critical code path with no coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists; imported by src/engine.ts with no coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists; imported by src/engine.ts with no coverage._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Internal table untested; correctness of payout values (e.g. CHERRY=[2,5,25]) is never verified._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Called by src/engine.ts and src/legacy.ts — a critical payout path — yet count=3/4/5 branches, unknown-symbol fallback, and count<3 fallback are all untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. All three methods (on, off, emit) are untested — including edge cases like removing a non-registered handler, emitting with no listeners, multiple handlers for the same event, and…_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is used in src/engine.ts but no tests verify it is emitted at the correct lifecycle point._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. buildReels is used by src/engine.ts (a critical path), but zero tests cover reel count, row count behavior, or spinReel integration._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, and single-reel inputs._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Missing coverage for: initial activation (scatters >= 3), re-trigger during active state, decrement logic, boundary condition (remaining reaches 0), and no-op when inactive with <…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic called by src/engine.ts with no coverage for threshold boundary (exactly 4 DIAMONDs), below-threshold cases, empty reels, or mixed symbol grids._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: zero-weight items, single-item arrays, mismatched items/weights lengths, negative weights, all-equal weights distribution, and the fallback return on…_

### documentation (13)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc mentions house-edge and ~95% RTP but omits: the `bet * 0.01` floor addition, `Math.ceil` rounding, the meaning of the `bet: any` parameter type, and that HOUSE_EDGE actually inflates (not reduce…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _No JSDoc on exported function. Missing @param reelIndex (valid range 0–4), @returns (3-symbol column array), and behavior on out-of-range index._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc comment. Missing documentation for parameters (symbol, count), return value semantics, and the behavior when count < 3 (returns 0)._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Class purpose, method parameters, and behavioral contracts (e.g., no-op on missing event in off/emit) are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. The constant's purpose — what triggers this event and what listeners should expect — is not documented._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. Notable undocumented behavior: _rowCount is ignored entirely, which is a non-obvious deviation from the base class signature that callers need to know about._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Purpose and return value are inferrable from the name, but the parameter shape and return semantics (count of SCATTER symbols across all reels) are not documented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. The function has non-trivial branching logic (activation threshold of 3 scatters, retrigger behavior, decrement-and-deactivate) that is not self-evident from the signature alone and …_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot logic, explanation of the threshold (>=4 DIAMONDs), parameter shape, and return semantics._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _File-level JSDoc describes purpose and algorithm, but the function itself lacks per-parameter docs (@param items, @param weights), a @returns tag, and does not document edge cases (e.g. empty arrays, …_

