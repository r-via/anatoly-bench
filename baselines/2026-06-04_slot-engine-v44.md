# Anatoly Bench Score — slot-engine

**Run:** `2026-06-04_162339` · Anatoly v0.9.6 (`e7810e4-dirty`) · project main @ `7dc4cc6`
**Duration:** 8m 37s · **Cost:** $3.37 · **Tokens:** 177 in / 139K out

**Global F1:** 62.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 60.0% | 42.9% | 100.0% | 3 | 0 | 4 | 10m 11s | $0.76 | 37K |
| utility | ✓ | 44.4% | 28.6% | 100.0% | 2 | 0 | 5 | 51s | $0.10 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 16s | $0.14 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 7s | $0.32 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 57s | $0.15 | 3K |
| best-practices | ✓ | 57.1% | 80.0% | 44.4% | 4 | 5 | 1 | 19m 49s | $1.30 | 74K |
| documentation | — | — | — | — | 0 | 0 | 0 | 2m 18s | $0.24 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 1m 25s | $0.27 | 4K |

## Misses (13)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · trivial] DEAD-ANCIENT-RTP** — src/paytable.ts (ANCIENT_RTP) — expected verdict `DEAD` (dead-export)
- **[utility · medium] DEAD-STRATEGY** — src/strategy.ts (ConservativeStrategy) — expected verdict `DEAD` (dead-class)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-TYPE** — src/types.ts (LegacySpinResult) — expected verdict `DEAD` (dead-type-export)
- **[utility · trivial] DEAD-LINE-WIN-HELPER** — src/paytable.ts (lineWins) — expected verdict `DEAD` (dead-helper-superseded-by-inline)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (5)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (52)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (33)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _Type alias with no test file present._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists; register/resolve logic untested._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists; WILD substitution, SCATTER bail-out, and run-length edge cases untested._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists; wild-boost multiplier formula and null-return paths untested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _Exported and used by src/index.ts; house-edge application and Math.ceil behavior completely untested._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _Primary exported function used by src/index.ts; invalid-bet validation, payout computation, free-spin triggering, and jackpot path all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. SYMBOLS array is never directly validated in any test._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file exists. Weight values (e.g. WILD/SCATTER both 5, DIAMOND 30) are never asserted._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file exists. Ordering correctness (CHERRY→SCATTER) is untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file exists. Five-reel homogeneity and per-reel weight arrays are never validated._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file exists. Critical RNG logic (boundary conditions, zero-weight exclusion, fallback to last item) is entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file exists. Exported function used by engine.ts and factories.ts — happy path, out-of-bounds reelIndex, and 3-row output shape are all untested._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file exists. Return value identity and completeness (all 8 symbols) never asserted._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file exists. Valid and out-of-bounds reelIndex behavior never tested._
- **[tests] `UNCOVERED`** — src/paytable.ts:3 (ANCIENT_RTP) — _No test file exists. Constant is used by engine.ts and legacy.ts but has no coverage._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file exists. Internal table is exercised indirectly via getPayMultiplier but has zero direct or indirect test coverage._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file exists. Function handles unknown symbols (returns 0), count branches 3/4/5, and out-of-range counts — none are tested. Used in critical payout paths in engine.ts and legacy.ts._
- **[tests] `UNCOVERED`** — src/paytable.ts:23 (lineWins) — _No test file exists. Complex logic covering WILD substitution, SCATTER early-return, consecutive-match counting, and minimum-count threshold — all untested. Used in engine.ts and legacy.ts payout path…_
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no test file. Used by src/engine.ts as a polymorphic dependency._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file. adjustPayout is an identity function but edge cases (zero payout, negative payout) are untested. Used in src/engine.ts._
- **[tests] `UNCOVERED`** — src/strategy.ts:13 (ConservativeStrategy) — _No test file. adjustPayout applies Math.floor(0.8x) — rounding and truncation behavior (e.g. fractional payouts, zero, large values) are entirely untested. Used in src/engine.ts._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file exists. Methods on/off/emit are untested — missing coverage for handler registration, deregistration, multi-listener dispatch, unknown event emit, and args forwarding._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file exists. Constant string value used by src/engine.ts is never verified in tests._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class used by src/engine.ts as a base type._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. buildReels is the core factory method used by src/engine.ts — happy path, edge cases (reelCount=0, rowCount ignored), and spinReel integration are all untested._
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Used by engine.ts with no coverage for empty reels, single scatter, exactly 3 scatters, or mixed symbol grids._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Critical state machine with 4 branches (activate, retrigger, decrement, deactivate) entirely untested despite being called by engine.ts._
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical gaming RNG utility used by src/engine.ts with no coverage of weighted distribution correctness, edge cases (empty arrays, mismatched lengths, zero weights, single item, a…_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical game logic used by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), under-threshold, and empty reel cases all untested._

### documentation (19)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Exported type alias with no JSDoc. Purpose and valid range not described._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _JSDoc describes purpose and house-edge intent but omits @param descriptions for `lineWins` and `bet`, doesn't document the unconditional `bet * 0.01` floor, and uses `any` for `bet` without explanatio…_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported public API with no JSDoc. Missing: description of what 'spinning' means, valid range of reelIndex (0–4), explanation that it returns a 3-element column, and behavior when reelIndex is out of …_
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported public API with no JSDoc. No explanation that the returned array order is significant (it matches weight index positions)._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally with getReelSymbols(), and that it returns a direct reference (mutable)._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:3 (ANCIENT_RTP) — _No JSDoc. The 'ANCIENT' qualifier is non-obvious — it's unclear whether this is a theoretical RTP, a game-mode-specific RTP, or a legacy value. Purpose and usage context are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported function with no JSDoc. Missing: what 'count' represents (run length), valid range for count, return value semantics (base multiplier, not a payout), and the fact that WILD/SCATTER return 0._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:23 (lineWins) — _Exported function with no JSDoc. Non-obvious behavior: WILD-first resolution picks the first non-WILD symbol as the anchor, SCATTER/all-WILD lines return null, and the function only counts a contiguou…_
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class with no JSDoc. Purpose, intended usage pattern, and the contract of adjustPayout are not described._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on class or method. The pass-through behavior of adjustPayout (returns result unchanged) is non-obvious and warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:13 (ConservativeStrategy) — _No JSDoc on class or method. The 0.8 multiplier and floor operation are magic values with no explanation of their rationale or effect._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). Public API with non-trivial semantics (listener map lifecycle, deduplication behavior) lacks all documentation._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc comment explaining when this event is emitted or what payload (if any) it carries._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc comment. Abstract factory contract with non-trivial semantics (reelCount vs rowCount distinction, return shape) warrants documentation._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc comment. `_rowCount` is ignored silently — that behavioral deviation from the abstract contract is undocumented and non-obvious._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc. Exported public function with no description, no @param for `reels`, no @returns explaining the count semantics._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc. Exported public function with non-trivial state-machine logic (activation threshold, retrigger, decrement-to-deactivate). Neither parameter is described, mutation side-effect is undocumented…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _Block comment describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, negative weights, mismatched array l…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc/TSDoc comment. Public export with non-obvious semantics: counts DIAMOND symbols grid-wide (not payline-restricted) and uses a hardcoded threshold of 4. Parameter and return behavior are undoc…_

