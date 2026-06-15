# Anatoly Bench Score — slot-engine

**Run:** `2026-05-07_162000` · Anatoly v0.9.6 (`c58fae8-dirty`) · project main @ `7dc4cc6`
**Duration:** 6m 26s · **Cost:** $6.40 · **Tokens:** 233 in / 143K out

**Global F1:** 69.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 53.3% | 57.1% | 50.0% | 4 | 4 | 3 | 8m 43s | $1.44 | 35K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 41s | $0.09 | 6K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 13s | $0.11 | 11K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 3m 3s | $0.87 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 9s | $0.46 | 3K |
| best-practices | ✓ | 76.9% | 100.0% | 62.5% | 5 | 3 | 0 | 17m 16s | $2.20 | 72K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 50s | $0.67 | 5K |
| _refinement_ | — | — | — | — | — | — | — | 2m 36s | $0.55 | 8K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _`Math.ceil` rounds payout UP. Slot-machine industry convention requires rounding DOWN (`Math.floor`) so the house retains the fractional remainder; rounding up transfers that remainder to the player._
- **[correction] `NEEDS_FIX`** — src/engine.ts:120 (spin) — _`rng` (L120) and `reelsModule` (L122) are resolved from the container but never passed to `factory.buildReels` or used anywhere else in `spin`. The container-registered `weightedPick` RNG is dead code…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] is undefined when reelIndex < 0 or >= 5; the declared return type number[] is violated at runtime, silently propagating undefined to callers._
- **[correction] `NEEDS_FIX`** — src/events.ts:17 (SpinEventEmitter) — _emit holds a direct reference to the array stored in the map. on (L6–L9) does handlers.push() on that same reference when the event already exists, so a handler that calls on(sameEvent, newHandler) ap…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with 0 runtime importers and 0 type-only importers_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout calculations but is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Constant is always false so its branch (console.log) is dead and untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior, unknown-key resolution, and type-cast safety are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions drive all win evaluation; correctness is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical logic (WILD substitution, SCATTER early-return, run-length threshold of 3) is entirely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-count bonus multiplier (exponential) and payout calculation paths are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. House-edge application, zero-win flat bonus, and Math.ceil rounding are untested despite being exported._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Array contents and ordering are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists. Weight values (e.g. sum, individual entries) are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. Shape (5 reels × 8 weights) and correctness are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Critical weighted-random logic — boundary conditions (r==0, r==total-ε, single item, zero-weight entries, fallback last item) all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts; return length (3 rows), valid symbol membership, and out-of-range reelIndex are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts; identity/content of returned array is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; correct index lookup and undefined for out-of-range index are untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Internal constant is untested, though indirectly exercised via getPayMultiplier._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Critical function imported by src/engine.ts and src/legacy.ts; count branching (3/4/5/other), unknown symbol, and zero-return paths are all untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, making untested pass-through behavior a coverage gap for the engine's payout logic._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. Constant is used as an event key in src/engine.ts but its usage pattern is untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file found. Used by src/engine.ts but no tests cover scatter counting logic, including empty reels, zero scatters, or multiple scatters across columns._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file found. Four distinct branches (trigger, re-trigger, decrement, deactivate) are all untested despite being critical game state logic used by src/engine.ts._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Used by src/engine.ts (critical path), yet buildReels has no tests covering reel count, row count ignored, or spinReel integration._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item input, boundary roll at exact cumulative threshold, and distribution uniformity. Use…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic (jackpot threshold, diamond counting across reels) is entirely untested. Called by src/engine.ts, making this a high-risk gap._

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and RTP rationale but omits @param descriptions, does not document the guaranteed minimum payout (bet × 0.01), and the return type is not annotated in the comment. (deliberated…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _No JSDoc. Missing: what reelIndex valid range is (0–4), that it returns a 3-symbol column, and sampling-with-replacement semantics._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _No JSDoc. Returns the shared SYMBOLS array by reference — mutation risk and intended use are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _No JSDoc. Valid index range, return-by-reference behavior, and relationship to DEFAULT_WEIGHTS are undocumented. (deliberated: confirmed — Missing bounds check at reels.ts:57 is real — REEL_WEIGHTS ha…_
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public function with no JSDoc. Missing: description of what 'count' represents (reel positions matched), what happens for count < 3 or unsupported symbols (returns 0), and that WILD/SCATTER a…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with a single abstract method — purpose, extension contract, and intended usage pattern are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through behavior is non-obvious from the name alone; the fact that it returns the result unchanged warrants at least a one-line doc._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment explaining what event this constant represents, when it is emitted, or what arguments are passed to its handlers._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape (2D readonly array of symbols), and return value semantics (total count across all reels)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-trivial state-mutation logic with three distinct branches (trigger, retrigger, decrement/deactivate) warrants documentation of params, side effects on FreeSpinState, and the thre…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or buildReels method. Notable undocumented behavior: _rowCount is silently ignored (reel height fixed implicitly by spinReel), which is a non-obvious contract violation callers canno…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, negative weights, mismatched arr…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Missing description of purpose, parameter shape (reels dimensions/content), return value semantics, and the ≥4 DIAMOND threshold rule._

