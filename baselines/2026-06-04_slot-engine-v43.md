# Anatoly Bench Score — slot-engine

**Run:** `2026-06-04_143828` · Anatoly v0.9.6 (`fb7bafc-dirty`) · project main @ `7dc4cc6`
**Duration:** 8m 34s · **Cost:** $3.46 · **Tokens:** 177 in / 136K out

**Global F1:** 72.3%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 50.0% | 42.9% | 60.0% | 3 | 2 | 4 | 11m 8s | $0.81 | 40K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 48s | $0.10 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 20s | $0.14 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 35s | $0.35 | 11K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 14s | $0.16 | 3K |
| best-practices | ✓ | 66.7% | 80.0% | 57.1% | 4 | 3 | 1 | 17m 56s | $1.16 | 65K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 21s | $0.25 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 2m 11s | $0.41 | 7K |

## Misses (9)

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

## False positives (5)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/events.ts:7 (SpinEventEmitter) — _this.listeners.get(event) returns the exact array reference emit() is iterating on L21. handlers.push(handler) mutates that live array, so the new handler is appended mid-iteration and called immediat…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:12 (StandardReelBuilderFactory) — _`spinReel(i)` receives no `rowCount` argument. The abstract method signature includes `rowCount` as a meaningful contract parameter, but this implementation discards it (`_rowCount`). If `spinReel` al…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_

## Unscored findings (45)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE affects computePayout output but is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Dead constant (always false); branch it guards is untestable as written._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve behavior, missing-key behavior, and type-cast safety are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Module-level singleton wiring is untested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions (shape, row bounds) are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. WILD-lead resolution, SCATTER early-return, run < 3 cutoff, and mixed WILD/symbol runs are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild-boost multiplier formula, zero-win path, and lineBet scaling are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. HOUSE_EDGE application (only on positive totals), floor bet bonus, and Math.ceil rounding are untested. Exported and critical to RTP correctness._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists. Only public entry point (imported by src/index.ts). Bet validation, jackpot path, free-spin state mutation, wildMultiplier accumulation, and strategy delegation are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists for this module. Key edge cases untested: weight order, length, zero-weight entries._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Critical untested cases: uniform distribution boundary (r === acc), all-equal weights, single-item list, total=0 (division by zero risk)._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Used by src/factories.ts — a critical call path with no coverage. Out-of-bounds reelIndex (>=5) would return undefined weights silently._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts with no coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists; PAY_TABLE values are indirectly exercised only through getPayMultiplier, which itself has no tests._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file found. Function is imported by engine.ts and legacy.ts — critical business logic (count branching for 3/4/5, unknown symbol returning 0) is entirely untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts but adjustPayout (identity passthrough) is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. on/off/emit methods are untested — missing coverage for multi-handler dispatch, handler removal, duplicate removal, emit with no listeners, and args forwarding._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant used by src/engine.ts as an event key; not validated in any test._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Abstract base class with no test file. No tests exist for the contract it defines._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file found. buildReels is used by src/engine.ts (critical path) but has zero test coverage — happy path, edge cases (reelCount=0, rowCount boundaries), and spinReel integration are all unteste…_
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Missing coverage for: zero scatters, one/two scatters, exactly 3, mixed symbols, empty reels._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Missing coverage for: initial activation (scatters>=3), retrigger while active, decrement, deactivation at remaining<=0, and no-op when inactive+scatters<3._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file found. Critical gaming RNG utility used by src/engine.ts has zero test coverage — edge cases like empty arrays, mismatched array lengths, zero weights, single-item arrays, and distributio…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic used by src/engine.ts has zero coverage — happy path (>=4 diamonds), boundary (exactly 4 vs 3), empty reels, and multi-column distribution all untested._

### documentation (16)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Exported type alias with no JSDoc. No documentation of valid range, units, or constraints (e.g. integer-only, 1–100 enforced in spin())._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent, but omits @param descriptions for lineWins and bet (bet is typed any), no @returns, and does not document the unconditional floor (bet*0.01) or ceiling (…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: what reelIndex range is valid (0–4), that it returns 3 symbols (one per row), and that sampling is independent per cell._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No description of return value order or that it is the canonical symbol order used for weight array indexing._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally with getReelSymbols(), and that it is read-only at runtime._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public function with no JSDoc. Missing: what 'count' represents, the valid range of count values (3–5), the return-0 contract for unknown symbols and out-of-range counts, and that WILD/SCATTE…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, intended usage pattern, and the contract of `adjustPayout` are not described._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on the class or its `adjustPayout` override. It is non-obvious that this is a pass-through (no-op) implementation — that behavior warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Parameters and return types are unannotated in docs; purpose of the emitter relative to existing Node.js EventEmitter is unexplained…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. The event name constant lacks any description of when it is emitted or what payload (if any) listeners should expect._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Abstract factory with a non-trivial contract (reelCount vs rowCount semantics, return shape) that warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. `_rowCount` is silently ignored — a notable behavioral detail that should be documented. No description of what 'standard' means relative to other possible factory implementations._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g., counts all SCATTER symbols across the entire grid)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-trivial state machine with three distinct transition branches (activate, retrigger, decrement/deactivate) and a mutation side-effect — all undocumented._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _Block comment describes purpose and algorithm, but lacks @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array length…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Exported public API missing description of jackpot trigger condition (≥4 DIAMONDs), parameter semantics (2-D reel grid layout), and return value meaning._

