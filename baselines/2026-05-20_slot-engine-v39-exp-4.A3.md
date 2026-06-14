# Anatoly Bench Score — slot-engine

**Run:** `2026-05-20_173359` · Anatoly v0.9.6 (`ea0d628-dirty`) · project main @ `7dc4cc6`
**Duration:** 9m 3s · **Cost:** $3.18 · **Tokens:** 224 in / 139K out

**Global F1:** 67.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 53.3% | 57.1% | 50.0% | 4 | 4 | 3 | 15m 54s | $1.04 | 44K |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 | 1m 31s | $0.09 | 15K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 5s | $0.06 | 9K |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 | 2m 57s | $0.33 | 9K |
| tests | — | — | — | — | 0 | 0 | 0 | 57s | $0.08 | 3K |
| best-practices | ✓ | 58.8% | 100.0% | 41.7% | 5 | 7 | 0 | 18m 18s | $1.06 | 51K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 21s | $0.16 | 8K |
| _refinement_ | — | — | — | — | — | — | — | 1m 51s | $0.36 | 6K |

## Misses (7)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (13)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:115 (spin) — _throw "invalid bet" throws a string primitive, not an Error. Callers checking e.message get undefined; e instanceof Error is false. Should be throw new Error("invalid bet")._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _REEL_WEIGHTS[reelIndex] returns undefined for reelIndex outside 0–4; TypeScript types this as number[] so callers receive undefined where they expect an array, causing downstream crashes._
- **[correction] `NEEDS_FIX`** — src/reels.ts:57 (getReelWeights) — _Returns a direct reference to the internal weight array. A caller can mutate it (e.g. getReelWeights(0)[0]=0), silently corrupting the RNG distribution for all subsequent spins. Docs state 'Weights ar…_
- **[correction] `NEEDS_FIX`** — src/paytable.ts:11 (PAY_TABLE) — _Forward: P(DIAMOND/reel) = 30/120 = 0.25; P(5-of-a-kind, no WILD) = 0.25^5 = 0.000977; payout per hit = 1000 × lineBet = 1000 × (bet/10) = 100 × bet; expected RTP contribution over 10 paylines = 10 × …_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical calls to weightsToArray(DEFAULT_WEIGHTS) when all reels share the same weights. `Array.from({length:5}, () => [...DEFAULT_WEIGHTS])` or even a single shared array would be simpler. The …_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (44)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (29)

- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Critical export with incorrect house-edge logic (adds edge instead of reducing) and an unconditional bet*0.01 bonus — both behaviors go untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Auto-resolved: JSDoc block found before symbol_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. This stochastic function has critical edge cases (zero-weight items, single-item list, boundary rounding) that need deterministic seeding tests._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Imported by src/factories.ts, making it a critical path with no coverage._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Imported by src/engine.ts._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file. Used by engine.ts and legacy.ts — critical payout logic with count branching (3/4/5) and unknown-symbol fallback is completely untested._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Core class used by src/engine.ts with on/off/emit methods — none tested. Missing coverage for: multiple handlers, handler removal, emit with no listeners, and args forwarding._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant used by src/engine.ts as an event name key; no tests verify its value or integration usage._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. Core factory used by src/engine.ts with no coverage of buildReels output shape, reelCount loop iterations, or spinReel integration._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Called by src/engine.ts — no coverage of empty reels, single scatter, exactly 3 scatters, or multi-reel layouts._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Called by src/engine.ts — all three branches (activate, retrigger, decrement/deactivate) are untested, including boundary at remaining=1._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item input, weight boundary (roll == cumulative), and distribution uniformity. Called by …_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic used by src/engine.ts has zero coverage — no happy path, edge cases (empty reels, fewer than 4 diamonds, exactly 4, nested empty arrays), or boundary tests._

### documentation (15)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block describing purpose and house-edge intent, but omits @param descriptions for lineWins and bet (typed as `any`), the unconditional floor addition (bet * 0.01), and @returns._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), meaning of returned Symbol[] (3-row column), and behavior on out-of-bounds index._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. Name is clear, but no note that index order aligns with getReelWeights output — a critical coupling for callers._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. reelIndex valid range (0–4) and the fact that the returned array is shared (not a copy) are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _No JSDoc on this exported function. Missing: description of purpose, @param for symbol and count, @returns explaining the multiplier semantics, and the notable edge case that WILD/SCATTER return 0._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). A public exported class with a non-trivial API requires at minimum class-level and method-level docs._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. The constant's purpose — event name emitted after each spin with a SpinResult payload — is not inferable from the name alone and warrants a comment._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _Auto-resolved: function ≤ 5 lines_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc/TSDoc. Has a subtle, non-obvious behavior: `_rowCount` is silently ignored and row count is always determined by `spinReel()`. This constraint is undocumented and would surprise callers who p…_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D reel grid), and return semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc comment. Non-obvious state machine with three branches (activation, retrigger, decrement/deactivation) and a mutation side-effect on `state` — all undocumented._
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what `items` and `weights` represent, no mention of the requirement that weights.length === items.length), no @re…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _Exported public function with no JSDoc/TSDoc comment. Missing: parameter description for `reels`, return value semantics, hardcoded threshold of 4 DIAMONDs, and the fact that matching is grid-wide (no…_

