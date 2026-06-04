# Anatoly Bench Score — slot-engine

**Run:** `2026-06-04_132022` · Anatoly v0.9.6 (`8544796-dirty`) · project main @ `7dc4cc6`
**Duration:** 10m 40s · **Cost:** $3.52 · **Tokens:** 177 in / 143K out

**Global F1:** 76.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 54.5% | 42.9% | 75.0% | 3 | 1 | 4 | 10m 9s | $0.78 | 38K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 51s | $0.10 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 12s | $0.13 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 2s | $0.32 | 9K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 8s | $0.16 | 3K |
| best-practices | ✓ | 83.3% | 100.0% | 71.4% | 5 | 2 | 0 | 21m 15s | $1.33 | 76K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 18s | $0.25 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 2m 3s | $0.36 | 5K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (3)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Inferred slot-machine domain from reels/paytable/jackpot/scatter/wild vocabulary in reference docs. Math.random() is backed by an unseeded, non-auditable PRNG (V8's xorshift128+). Regulated gaming jur…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (45)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists; constant is untested. Its effect on payout is also not verified._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists; register/resolve behavior untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists; payline definitions and their correctness are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists; WILD substitution logic, SCATTER short-circuit, run-length counting, and minimum-3 threshold are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists; wild-count bonus multiplier formula and null-propagation from checkLine are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists; house-edge application, base-bet bonus, Math.ceil rounding, and zero-win path are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists. Exported and called from src/index.ts, making its untested state high-risk. Invalid-bet validation, free-spin triggering, jackpot path, and wildMultiplier accumulation are all unc…_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Symbol is referenced by exported functions used in engine and factories._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values directly affect game odds; correctness is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file. Ordering of weights array must match SYMBOLS order — silent misalignment is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Five-reel weight matrix drives all spin probabilities; structure and values are untested._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probability logic with boundary behavior (r == acc edge, last-item fallback) is entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by factories.ts; out-of-bounds reelIndex silently returns undefined weights — untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by engine.ts; returns shared mutable array reference — mutation risk untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by engine.ts; invalid reelIndex returns undefined without error — untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Pay table values are business-critical multiplier data with zero test coverage._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic covering count boundaries (3/4/5), unknown symbols returning 0, and count < 3 returning 0 are all untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class, no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Used by src/engine.ts but no test file exists. Identity payout logic is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical class used by src/engine.ts — on/off/emit methods, multi-listener dispatch, handler deregistration, and unknown-event handling are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is consumed by src/engine.ts but no tests verify its value or correct usage as an event name._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime behavior beyond defining the interface, but still warrants contract testing via its concrete subclass._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Used by src/engine.ts, making this a critical path. buildReels logic (reel count loop, spinReel calls, returned 2D array shape) is completely untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Called by src/engine.ts with no test coverage for scatter counting across reels, empty input, or zero-scatter grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. State machine with 3 branches (activate, retrigger, decrement/deactivate) is entirely untested despite being called by core engine logic._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic used by src/engine.ts has zero coverage — happy path (≥4 diamonds), boundary (exactly 4 vs 3), empty reels, and multi-column distribution all untested._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Symbol is imported by src/engine.ts (critical game engine path) with zero coverage of happy path, edge cases (empty arrays, single item, zero weights, negative weights, mismatched…_

### documentation (16)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Exported type alias with no JSDoc. No indication of valid range, currency unit, or relationship to the bet parameter in spin()._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a two-sentence JSDoc describing purpose and RTP target, but omits @param tags for lineWins and bet, no @returns tag, and the claim of ~95% RTP is misleading (the code applies HOUSE_EDGE as a 5% bo…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that it returns exactly 3 symbols (one per row), and behaviour when reelIndex is out of bounds._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Missing: description of return value (ordered array matching weight indices) and that mutating the returned array is unsafe._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array is a direct reference (mutation affects spin behaviour), and that weights correspond positionally to ge…_
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc. Exported public API. Missing: parameter descriptions, return value semantics, and the key behavior that WILD/SCATTER return 0 (no paytable entry)._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class has no JSDoc. Purpose, intended usage pattern, and the contract of adjustPayout are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc. The identity behavior (returns result unchanged) is non-obvious and warrants at least a one-line description._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Parameters, return values, and behavioral constraints (e.g. duplicate handler registration, no-op on missing event) are undocumented…_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment. The event name string value is self-evident but the semantics of when this event is emitted are not documented._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Abstract class purpose, contract, and expected subclass behavior are not described._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc on class or its `buildReels` method. Parameters `reelCount` and `_rowCount` (notably unused) are unexplained, and return value semantics are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D reel grid), and return value semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Three distinct state-transition branches (activate, retrigger, decrement/deactivate) are non-obvious and warrant documented @param and @returns (void with mutation side-effect)._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing parameter description for `reels`, return value explanation, and the hardcoded DIAMOND threshold of 4 — all non-obvious semantics for a public exported function._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes the function's purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, negative weights…_

