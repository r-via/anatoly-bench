# Anatoly Bench Score — slot-engine

**Run:** `2026-05-13_194550` · Anatoly v0.9.6 (`195fbeb-dirty`) · project main @ `7dc4cc6`
**Duration:** 9m 40s · **Cost:** $5.83 · **Tokens:** 233 in / 168K out

**Global F1:** 68.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 52.6% | 71.4% | 41.7% | 5 | 7 | 2 | 12m 31s | $1.59 | 52K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 47s | $0.06 | 7K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 14s | $0.08 | 11K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 12s | $0.52 | 11K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 5s | $0.30 | 3K |
| best-practices | ✓ | 53.3% | 80.0% | 40.0% | 4 | 6 | 1 | 19m 16s | $2.30 | 80K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 12s | $0.30 | 4K |
| _refinement_ | — | — | — | — | — | — | — | 2m 39s | $0.45 | 7K |

## Misses (7)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (14)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _`Math.ceil` rounds payouts up, systematically returning more than calculated on fractional results. Casino/gaming industry convention rounds DOWN (`Math.floor`) so the house retains the remainder; cei…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:44 (spinReel) — _REEL_WEIGHTS[reelIndex] returns undefined for reelIndex < 0 or >= 5. pickFromWeighted then calls wts.reduce(...) on undefined, throwing TypeError at runtime._
- **[correction] `NEEDS_FIX`** — src/reels.ts:53 (getReelSymbols) — _Callers can push/splice SYMBOLS directly. pickFromWeighted indexes items[i] and wts[i] positionally; adding or removing symbols without mirroring weight array changes produces wrong probabilities or o…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] returns undefined when reelIndex is outside [0, 4]; declared return type is number[], so callers trusting the type will dereference undefined and crash._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _Returns the live internal array; callers can mutate weights in place (push, splice, index assignment) and permanently corrupt probability distributions for all subsequent spins._
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Math.random() is a non-seeded, non-cryptographic PRNG. The file docstring explicitly claims 'suitable for gaming RNG applications' and the README establishes a regulated slot-machine domain (reels, ja…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:15 (weightedPick) — _When items is empty, items.length - 1 = -1, so items[-1] returns undefined at runtime, but the declared return type is T. TypeScript does not catch negative index access, so callers receive a silently…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with zero runtime importers and zero type-only importers. Not used anywhere._
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. HOUSE_EDGE directly affects payout math in computePayout but is never tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Trivial constant but untested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists. register/resolve contract, type-casting behavior, and missing-key behavior are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Payline definitions drive all win evaluation but are never validated._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists. Critical logic — WILD substitution, SCATTER short-circuit, run-length counting, minimum run of 3 — all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Wild multiplier compounding (wildCount exponent), zero-win null path, and lineBet scaling are untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. HOUSE_EDGE application on positive total, unconditional bet*0.01 bonus, Math.ceil rounding, and zero-win path are all untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS drives all reel spin outcomes; untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weight values directly affect payout odds — correctness unverified._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Five identical weight arrays initialized via weightsToArray; no validation that all five reels are populated correctly._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probability logic — off-by-one on boundary (r < acc vs r <= acc), zero-weight symbols, and single-item arrays are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts; always returns 3-element column — length guarantee and out-of-bounds reelIndex behavior untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; returns shared mutable array reference — mutation safety untested._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently — untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant backing getPayMultiplier; its correctness is entirely untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Imported by engine.ts and legacy.ts — a critical payout calculation path with zero test coverage. Missing: valid symbol/count combos, unknown symbol returning 0, count < 3 returni…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _Auto-resolved: import verified on disk (spinReel found in ./reels.js)_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Critical class used by src/engine.ts — on/off/emit methods, handler deduplication, multi-listener dispatch, and removal of non-existent handlers are all untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant is consumed by src/engine.ts but no test verifies correct event string value or its integration with SpinEventEmitter._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts for core scatter detection; no coverage of empty reels, single scatter, exactly 3 scatters, or mixed symbol grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. All four branches (activate, retrigger, decrement, deactivate at 0) are untested. State mutation behavior and boundary at remaining<=0 are uncovered._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic called by src/engine.ts has zero coverage — missing tests for threshold boundary (exactly 4 diamonds), below threshold (3 diamonds), above threshold (5+ diamond…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical paths untested: zero total weight (division by zero), mismatched array lengths, single-item input, boundary where roll equals exact cumulative boundary, and distribution …_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc mentions house-edge application and ~95% RTP target but omits: the `bet * 0.01` floor added unconditionally, the `Math.ceil` rounding, the `any` type on `bet`, and the fact that house edge is ap…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _No JSDoc. Missing: valid range for reelIndex (0–4), that the return is a 3-element column (one Symbol per row), and behavior on out-of-range index._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _No JSDoc. Should note it returns the shared SYMBOLS reference (mutation risk) and that order matches weight array indices._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _No JSDoc. Missing @param reelIndex range constraint and note that the returned array is a direct reference (mutable)._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc. Missing description of parameters (symbol identity constraints, valid count range), return semantics (multiplier applied to what base?), and the 0 sentinel for unknown symbols or out-of-rang…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _Auto-resolved: import verified on disk (spinReel found in ./reels.js)_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). Public API with non-trivial behavior (listener deduplication on off, silent no-op when event has no handlers) needs documentation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. An exported event name constant should document when it is emitted and what args, if any, accompany it._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Purpose is inferrable from name, but return value semantics (total count across all reels/symbols) and parameter shape are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-trivial state machine logic: activation threshold (>=3 scatters), retrigger behavior (+10 spins), and decrement-to-deactivate path are all undocumented. (deliberated: confirmed —…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Missing description of jackpot logic, param shape of `reels`, return semantics, and the threshold (>=4 DIAMONDs)._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _File-level JSDoc describes purpose and algorithm, but the function itself lacks parameter descriptions (@param items, @param weights), a @returns tag, and edge-case behavior (e.g., mismatched array le…_

