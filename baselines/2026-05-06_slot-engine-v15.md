# Anatoly Bench Score — slot-engine

**Run:** `2026-05-06_181356` · Anatoly v0.9.5 (`69dea11-dirty`) · project main @ `46a0c40`
**Duration:** 6m 16s · **Cost:** $4.78 · **Tokens:** 217 in / 132K out

**Global F1:** 64.2%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 50.0% | 42.9% | 60.0% | 3 | 2 | 4 |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 57.1% | 50.0% | 66.7% | 2 | 1 | 2 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 61.5% | 80.0% | 50.0% | 4 | 4 | 1 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (10)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:24 (EngineContainer) — _Map.get returns undefined for absent keys; the 'as T' cast hides this. Any caller using a misspelled or unregistered key receives undefined typed as T with no error thrown._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] is undefined when reelIndex ∉ [0, 4]. The declared return type number[] is violated, silently propagating undefined to callers that expect a valid weight array._
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Per-reel weight matrix implies per-reel customisation that doesn't exist. Docs (.anatoly/docs/02-Architecture/02-Core-Concepts.md, .anatoly/docs/04-API-Reference/02-Configuration-Schema.md) confirm al…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Context-adapted rules_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists for this module. Critical logic (HOUSE_EDGE application, bet bonus, Math.ceil) is entirely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Constant defines the full symbol set used throughout the game engine._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Weights directly influence payout probabilities — critical business logic with zero coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Five-reel weight matrix drives all spin outcomes; no verification that weights are non-empty or correctly shaped._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probabilistic selection logic with an off-by-one risk at boundary (r == total falls through to last item). Edge cases like all-zero weights or single-item arrays untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Imported by src/factories.ts — a factory-level consumer — yet no tests verify it returns exactly 3 symbols, handles valid reelIndex range, or rejects out-of-bounds indices._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Imported by src/engine.ts; no tests confirm the returned array matches expected symbols or is immutable._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Imported by src/engine.ts; no tests verify correct weights are returned per reelIndex or that invalid indices are handled._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Private constant is untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Function is imported by engine.ts and legacy.ts — critical path with no coverage for any count branch (3/4/5), unknown symbol, or zero-return paths._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file found._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. Used by src/engine.ts, so payout pass-through behavior is untested._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. String constant used as event key in engine.ts; its usage as a trigger for done-state logic is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime behavior beyond defining the contract._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, varying rowCount) are verified._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts, but no coverage of scatter counting across single/multi-reel layouts, empty reels, or zero-scatter cases._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches (initial trigger, retrigger, decrement, deactivation on zero) are all untested. Used by engine.ts, making this a critical gap._
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file found. Critical game logic (jackpot trigger) used by src/engine.ts has zero test coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, single reel), or bounda…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, all-zero weights, single-item input, boundary roll exactly at cumulative threshold, and distribution correctn…_

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block describing purpose and house-edge intent, but no @param tags for lineWins or bet, no @returns, and the 1% base-bet addition is unexplained. bet is typed as any with no rationale._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: description of reelIndex range (0–4), that it returns a 3-row column, and that each row is independently sampled._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported with no JSDoc. Name is clear but docs should note this returns the same ordered array used for weight indexing._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported with no JSDoc. Missing: valid range for reelIndex, that returned array order corresponds to getReelSymbols() order, and behavior on out-of-range index._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: description of what 'multiplier' means (applied to line bet?), valid range of `count`, return value of 0 for unrecognized symbols or counts below 3._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _No JSDoc comment. Abstract base class with non-obvious extension contract (strategy pattern for post-calculation payout adjustment) warrants at minimum a class-level description and note about the int…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc comment. Pass-through behavior is not self-evident from the name alone; a brief note clarifying it returns the result unchanged would prevent misuse._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _Auto-promoted: exported class imported by 1 file — abstraction built for a single client_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc explaining what event this constant names, when it is emitted, or what arguments handlers receive._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc/TSDoc comment. The contract for `buildReels` — what `reelCount`/`rowCount` represent, the shape of the returned `Symbol[][]`, and the extension semantics — is entirely undocumented._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc/TSDoc comment. Key non-obvious behavior — that `_rowCount` is silently ignored because `spinReel` fixes reel height at 3 — is undocumented, along with the delegation strategy and parameter se…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. that it counts all SCATTER symbols across the full grid regardless of payline position)._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Missing description of the three distinct state transitions (trigger, retrigger, decrement/deactivate), the threshold value, and mutation side-effects on the state parameter._
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. The function's purpose (4+ DIAMOND triggers jackpot), parameter shape (2D reel grid), and return semantics are non-obvious and undocumented inline._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _File-level JSDoc describes purpose and algorithm, but the function itself lacks parameter descriptions (@param for items/weights), return type explanation (@returns), edge case behavior (empty arrays,…_

