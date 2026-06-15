# Anatoly Bench Score — slot-engine

**Global F1:** 43.2%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 61.5% | 57.1% | 66.7% | 4 | 2 | 3 |
| utility | ✓ | 60.0% | 60.0% | 60.0% | 3 | 2 | 2 |
| duplication | ✓ | 0.0% | 0.0% | 100.0% | 0 | 0 | 4 |
| overengineering | ✓ | 40.0% | 25.0% | 100.0% | 1 | 0 | 3 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 54.5% | 60.0% | 50.0% | 3 | 3 | 2 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (14)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-TYPE** — src/types.ts (LegacySpinResult) — expected verdict `DEAD` (dead-type-export)
- **[duplication · medium] DUP-RNG** — src/rng.ts (weightedPick) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[duplication · medium] DUP-LINE-WIN** — src/paytable.ts (lineWins) — expected verdict `DUPLICATE` (semantic-duplicate-predicate)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts (AbstractReelBuilderFactory) — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts (SpinStrategy) — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (7)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/reels.ts:56 (getReelWeights) — _No bounds check on reelIndex. REEL_WEIGHTS[reelIndex] silently returns undefined for out-of-range indices, violating the declared return type of number[] and causing downstream callers to observe unde…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:8 (StandardReelBuilderFactory) — _The `_rowCount` parameter is silently ignored. `spinReel(i)` is called with only a reel index, meaning the number of rows in the returned Symbol[] cannot be controlled by the caller. If `spinReel` alw…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type with 0 runtime and 0 type-only importers._
- **[utility] `DEAD`** — src/paytable.ts:23 (lineWins) — _Auto-resolved: no RAG candidate above 0.68 threshold_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_

