# Anatoly Bench Score — slot-engine

**Run:** `2026-06-14_104735` · Anatoly v0.9.6 (`8332732-dirty`) · project main @ `7dc4cc6`
**Duration:** 7m 57s · **Cost:** $3.30 · **Tokens:** 171 in / 132K out

**Global F1:** 76.3%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 60.0% | 42.9% | 100.0% | 3 | 0 | 4 | 10m 51s | $0.83 | 39K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 51s | $0.09 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 8s | $0.14 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 6s | $0.34 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | 1m 4s | $0.18 | 3K |
| best-practices | ✓ | 76.9% | 100.0% | 62.5% | 5 | 3 | 0 | 17m 5s | $1.15 | 64K |
| documentation | — | — | — | — | 0 | 0 | 0 | 1m 58s | $0.24 | 7K |
| _refinement_ | — | — | — | — | — | — | — | 1m 25s | $0.26 | 3K |

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

- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

## Unscored findings (48)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (31)

- **[tests] `UNCOVERED`** — src/engine.ts:12 (Bet) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:14 (HOUSE_EDGE) — _No test file exists. Transitive coverage via computePayout/spin is moot — neither is tested._
- **[tests] `UNCOVERED`** — src/engine.ts:15 (DEBUG_MODE) — _No test file exists. Transitive coverage via spin is moot — spin is not tested._
- **[tests] `UNCOVERED`** — src/engine.ts:17 (EngineContainer) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:29 (container) — _No test file exists. Transitive coverage via spin is moot — spin is not tested._
- **[tests] `UNCOVERED`** — src/engine.ts:34 (PAYLINES) — _No test file exists. Transitive coverage via spin is moot — spin is not tested._
- **[tests] `UNCOVERED`** — src/engine.ts:47 (checkLine) — _No test file exists for this module._
- **[tests] `UNCOVERED`** — src/engine.ts:66 (evaluateLine) — _No test file exists. Transitive coverage via spin is moot — spin is not tested._
- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _No test file exists. Notable gaps include the erroneous house-edge application (adds instead of reduces RTP), the unconditional bet*0.01 bonus, and the Math.ceil behavior — none verified._
- **[tests] `UNCOVERED`** — src/engine.ts:113 (spin) — _No test file exists. Critical exported function with complex behavior (bet validation, reel building, payline evaluation, scatter/freespin/jackpot logic, wild multiplier recalculation) is entirely unt…_
- **[tests] `UNCOVERED`** — src/reels.ts:3 (SYMBOLS) — _No test file exists. Transitive coverage via spinReel/getReelSymbols is moot since those exported callers are also untested._
- **[tests] `UNCOVERED`** — src/reels.ts:12 (DEFAULT_WEIGHTS) — _No test file. Constant drives all reel probability distributions but is never directly verified._
- **[tests] `UNCOVERED`** — src/reels.ts:17 (weightsToArray) — _No test file. Mapping order is critical (determines per-symbol probability) but untested._
- **[tests] `UNCOVERED`** — src/reels.ts:22 (REEL_WEIGHTS) — _No test file. Transitive coverage requires spinReel/getReelWeights to be tested, which they are not._
- **[tests] `UNCOVERED`** — src/reels.ts:30 (pickFromWeighted) — _No test file. Core probability logic with boundary conditions (r exactly at acc boundary, single-item list, zero-weight items) is entirely untested._
- **[tests] `UNCOVERED`** — src/reels.ts:43 (spinReel) — _No test file. Consumed by src/factories.ts for critical spin path; no tests for out-of-range reelIndex, column length, or symbol validity._
- **[tests] `UNCOVERED`** — src/reels.ts:52 (getReelSymbols) — _No test file. Used by spin() in engine.ts for symbol enumeration; return value never asserted._
- **[tests] `UNCOVERED`** — src/reels.ts:56 (getReelWeights) — _No test file. Used by spin() in engine.ts; out-of-range reelIndex returns undefined with no guard, untested._
- **[tests] `UNCOVERED`** — src/paytable.ts:5 (PAY_TABLE) — _No test file. Transitive coverage via getPayMultiplier is irrelevant because getPayMultiplier itself has no tests._
- **[tests] `UNCOVERED`** — src/paytable.ts:14 (getPayMultiplier) — _No test file found. Imported by src/engine.ts and src/legacy.ts but no test coverage is confirmed for those callers either — no test file is available._
- **[tests] `UNCOVERED`** — src/events.ts:1 (EventHandler) — _No test file exists. Type alias with no runtime behavior, but transitive coverage via SpinEventEmitter is also absent._
- **[tests] `UNCOVERED`** — src/events.ts:3 (SpinEventEmitter) — _No test file found. on/off/emit methods and edge cases (duplicate handlers, unknown events, multi-arg emit, handler removal correctness) are entirely untested._
- **[tests] `UNCOVERED`** — src/events.ts:27 (SPIN_DONE) — _No test file found. Constant is consumed by src/engine.ts but no tests verify it is emitted at the correct point in the spin lifecycle._
- **[tests] `UNCOVERED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract class with no test file. No tests exist for any subclass or the abstract contract._
- **[tests] `UNCOVERED`** — src/strategy.ts:7 (DefaultStrategy) — _No test file found. DefaultStrategy is consumed by spin() in engine.ts but its identity-passthrough behavior is untested in isolation._
- **[tests] `UNCOVERED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No test file exists. Abstract class with no runtime logic — but its contract (buildReels signature) is untested._
- **[tests] `UNCOVERED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No test file exists. buildReels is consumed by the critical spin() function in engine.ts (bet validation, payline evaluation, jackpot detection), yet there are zero tests verifying reelCount iteration…_
- **[tests] `UNCOVERED`** — src/freespin.ts:3 (detectScatters) — _No test file exists. Critical path: called by spin() in engine.ts to trigger free spin awards. No coverage of zero scatters, partial counts, or full-grid scatter scenarios._
- **[tests] `UNCOVERED`** — src/freespin.ts:13 (handleFreeSpins) — _No test file exists. Four distinct branches untested: initial activation (scatters>=3 while inactive), retrigger (scatters>=3 while active), decrement, and deactivation (remaining<=0). All are critica…_
- **[tests] `UNCOVERED`** — src/rng.ts:5 (weightedPick) — _No test file exists. Critical RNG utility used by slot machine spin logic with no coverage of edge cases: empty arrays, mismatched lengths, zero-weight items, single-item arrays, or boundary behavior …_
- **[tests] `UNCOVERED`** — src/jackpot.ts:3 (isJackpotHit) — _No test file exists. Critical jackpot logic consumed by core spin engine has zero test coverage — no happy path (≥4 diamonds), no boundary (exactly 4 vs 3), no edge cases (empty reels, single column)._

### documentation (17)

- **[documentation] `UNDOCUMENTED`** — src/engine.ts:12 (Bet) — _Exported type alias with no JSDoc. The name alone does not communicate valid range or units._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:101 (computePayout) — _Has a JSDoc block describing purpose and RTP intent, but omits @param descriptions for lineWins and bet (typed as any), and no @returns annotation. The unconditional floor of bet*0.01 is undocumented._
- **[documentation] `UNDOCUMENTED`** — src/engine.ts:113 (spin) — _Primary exported function with no JSDoc. Behavior described in README but inline documentation is absent; no @param, @returns, or @throws for the string-throw on invalid bet._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:43 (spinReel) — _Exported. No JSDoc. Missing: valid range of reelIndex (0–4), meaning of the returned array (3 symbols top-to-bottom), and behavior on out-of-range index._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:52 (getReelSymbols) — _Exported. No JSDoc. Returns the master symbol list; return value ordering and mutability are unstated._
- **[documentation] `UNDOCUMENTED`** — src/reels.ts:56 (getReelWeights) — _Exported. No JSDoc. Valid reelIndex range (0–4), returned array ordering relative to getReelSymbols(), and mutability of the result are all undocumented._
- **[documentation] `UNDOCUMENTED`** — src/paytable.ts:14 (getPayMultiplier) — _Exported public API with no JSDoc. Missing: what `count` represents, valid range of `count`, return semantics (multiplier vs. payout), and behavior for WILD/SCATTER symbols (returns 0)._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:3 (SpinEventEmitter) — _No JSDoc on the class or any of its public methods (on, off, emit). All three methods accept non-trivial parameters with no description of semantics, side effects, or error behavior._
- **[documentation] `UNDOCUMENTED`** — src/events.ts:27 (SPIN_DONE) — _No JSDoc. As a public event-name constant consumed by engine.ts, it should document when the event fires and what args are emitted with it._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:3 (SpinStrategy) — _Abstract base class has no JSDoc. Purpose, extension contract, and expected behavior of adjustPayout are undocumented._
- **[documentation] `UNDOCUMENTED`** — src/strategy.ts:7 (DefaultStrategy) — _No JSDoc on class or method. adjustPayout passes result through unchanged — that identity behavior is non-obvious and worth documenting._
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:4 (AbstractReelBuilderFactory) — _No JSDoc. Purpose of the abstract factory pattern, expected contract of buildReels (what the returned Symbol[][] represents, how reelCount/rowCount affect output), and intended extension points are no…_
- **[documentation] `UNDOCUMENTED`** — src/factories.ts:8 (StandardReelBuilderFactory) — _No JSDoc. The concrete implementation's behavior (delegates to spinReel per reel, ignores rowCount) and why _rowCount is unused are undocumented. Consumed by spin() in engine.ts, making this a public …_
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:3 (detectScatters) — _No JSDoc/TSDoc comment. Public exported function with a non-trivial parameter type (2D readonly array) and a meaningful return value (scatter count) that warrants at least a brief description._
- **[documentation] `UNDOCUMENTED`** — src/freespin.ts:13 (handleFreeSpins) — _No JSDoc/TSDoc comment. Public exported function with complex state-machine logic (activate, retrigger, decrement/deactivate) that is non-obvious from the signature alone. Missing description of all t…_
- **[documentation] `UNDOCUMENTED`** — src/rng.ts:5 (weightedPick) — _JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, no mention of edge cases (empty arrays, mismatched lengths, negative weights). (delibera…_
- **[documentation] `UNDOCUMENTED`** — src/jackpot.ts:3 (isJackpotHit) — _No JSDoc comment. Non-obvious semantics: counts DIAMOND symbols across the entire grid (not paylines), triggers at ≥4. The threshold and grid-wide (not payline-restricted) behavior are invisible from …_

