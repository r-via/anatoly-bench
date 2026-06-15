# Anatoly Bench Score — slot-engine

**Run:** `2026-06-11_155311` · Anatoly v0.9.6 (`203dea7-dirty`) · project main @ `7dc4cc6`
**Duration:** 12m 14s · **Cost:** $3.66 · **Tokens:** 177 in / 145K out

**Global F1:** 69.7%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 54.5% | 42.9% | 75.0% | 3 | 1 | 4 | 14m 47s | $1.04 | 53K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 1m 11s | $0.12 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 18s | $0.14 | 5K |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 | 3m 33s | $0.34 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 30s | $0.17 | 3K |
| best-practices | ✓ | 60.0% | 60.0% | 60.0% | 3 | 2 | 2 | 17m 20s | $1.14 | 63K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 22s | $0.24 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 2m 1s | $0.33 | 5K |

## Misses (10)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (4)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/paytable.ts:11 (PAY_TABLE) — _Forward (ignoring WILDs, which would only raise RTP further): p_D=30/120=0.25. E[DIAMOND payout per payline]/lineBet = p^3×(1−p)×50 + p^4×(1−p)×250 + p^5×1000 = 0.25^3×0.75×50 + 0.25^4×0.75×250 + 0.25…_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical arrays produced by five calls to weightsToArray(DEFAULT_WEIGHTS). Docs confirm all reels share the same weight distribution. A single shared weights array referenced by spinReel would e…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_

## Unscored findings (47)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (30)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _No test file exists. Type alias with no runtime behavior, but still undocumented by tests._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file. HOUSE_EDGE is applied in computePayout and directly affects RTP correctness — critical business logic with zero test coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file. Constant always false; dead code path, but still untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file. register/resolve are core DI primitives used throughout spin(); no tests for missing key, type safety, or overwrite behavior._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file. Module-level singleton with no isolation mechanism; not tested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file. 10 payline definitions directly drive win detection; correctness of each row/col index is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file. WILD-leading resolution, SCATTER early-exit, run counting, and the >=3 threshold are all untested edge cases critical to payout correctness._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file. Wild-boost multiplier formula (1+wc)*2^wc applied on top of base payout is complex and completely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file. House-edge inflation on wins and unconditional +bet*0.01 offset (which increases effective RTP rather than reducing it) are business-critical bugs with no test coverage._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file. Exported entry point imported by src/index.ts; bet validation, free-spin state, jackpot path, wildMultiplier accumulation, and strategy.adjustPayout integration all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file found. Array ordering matters because weightsToArray depends on positional alignment with REEL_WEIGHTS._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values directly affect payout probabilities — untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file. Positional ordering of the returned array must match SYMBOLS order; no tests verify this invariant._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Five reels all using DEFAULT_WEIGHTS is untested; any divergence would silently break game math._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probabilistic logic (boundary at r < acc, fallback to last item) has no coverage for edge cases like zero-weight entries or single-item lists._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Consumed by src/factories.ts; out-of-bounds reelIndex would return undefined weights and crash silently — untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Used by spin() in src/engine.ts to build the grid; returns mutable reference to SYMBOLS — no tests._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Used by spin() in src/engine.ts; out-of-bounds reelIndex returns undefined with no guard — untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. PAY_TABLE drives all payout calculations but has no coverage._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Used by both src/engine.ts (core spin logic) and src/legacy.ts — critical payout path with zero test coverage. Missing tests for: all pay symbols at counts 3/4/5, unknown symbol r…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Used by the critical `spin` function in engine.ts but no test file exists. Identity transform (returns result unchanged) is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical class used by spin() in engine.ts — on/off/emit methods, listener deduplication via filter, and multi-handler dispatch are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant consumed by spin() in engine.ts but no test verifies it is emitted at spin completion._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists for this source file._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. buildReels is consumed by the critical spin() function in engine.ts but has zero direct test coverage._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Critical path: called by the main spin engine. Missing coverage for zero scatters, mixed reels, and full scatter grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) are entirely untested despite being core free-spin lifecycle logic consumed by the spin engine._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical gaming RNG utility consumed by spin() — missing tests for uniform distribution, zero-weight items, single-item arrays, last-element fallback, and statistical weight propo…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical jackpot detection logic (threshold: 4 DIAMOND symbols) consumed by core spin engine has zero test coverage — missing edge cases: exactly 3 diamonds (false), exactly 4 diam…_

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Exported type alias with no JSDoc. Public API consumers get no context on valid range, currency unit, or relationship to lineBet._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block but omits @param descriptions for lineWins and bet, omits @returns, and the claim 'target RTP of approximately 95%' is misleading — the code adds HOUSE_EDGE (raising payout) rather t…_
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _Primary exported function with no JSDoc. No description of the bet parameter constraints (integer, 1–100), thrown string on invalid bet, or the structure of SpinResult fields._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API. No JSDoc. Missing: valid range for reelIndex (0–4), meaning of the 3-element return array (one Symbol per row), and behavior if reelIndex is out of bounds._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API. No JSDoc. No description of what it returns or why callers need it (ordering mirrors weight array indices)._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSymbols(), and that weights are read-only at runtime._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: valid range for `count`, behavior for WILD/SCATTER symbols (returns 0), and the fact that only counts 3–5 yield non-zero results._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, expected behavior contract, and usage pattern of `adjustPayout` are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc. The pass-through behavior of `adjustPayout` (returns result unchanged) is non-obvious from the name alone and warrants at least a one-line description._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Parameters, return values, and behavioral contracts (e.g. silent no-op when no listeners) are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. Event name constant with no explanation of when it is emitted or what payload consumers should expect._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. The abstract factory pattern and the contract of buildReels (what reelCount/rowCount mean, what the returned Symbol[][] represents) are not described._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on the class or buildReels. Notable behavior — _rowCount is silently ignored — is undocumented, which is a meaningful omission for consumers._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of grid traversal behavior, parameter shape, and return value semantics (total count across all reels, not per-reel)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-obvious state machine with three branches (activation, retrigger, decrement/deactivation) and mutation side-effects on state — all undocumented._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, mismatched lengths, zero-weight items). (del…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Non-obvious semantics: threshold of 4 DIAMONDs, grid-wide scan (not payline-restricted), and ReadonlyArray input contract are not documented._

