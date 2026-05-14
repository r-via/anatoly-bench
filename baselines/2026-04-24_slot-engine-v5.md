# Anatoly Bench Score — slot-engine

**Global F1:** 43.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 54.5% | 42.9% | 75.0% | 3 | 1 | 4 |
| utility | ✓ | 60.0% | 60.0% | 60.0% | 3 | 2 | 2 |
| duplication | ✓ | 0.0% | 0.0% | 100.0% | 0 | 0 | 4 |
| overengineering | ✓ | 66.7% | 75.0% | 60.0% | 3 | 2 | 1 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 36.4% | 40.0% | 33.3% | 2 | 4 | 3 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (14)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-TYPE** — src/types.ts (LegacySpinResult) — expected verdict `DEAD` (dead-type-export)
- **[duplication · medium] DUP-RNG** — src/rng.ts (weightedPick) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[duplication · medium] DUP-LINE-WIN** — src/paytable.ts (lineWins) — expected verdict `DUPLICATE` (semantic-duplicate-predicate)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (9)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/factories.ts:8 (StandardReelBuilderFactory) — _The `_rowCount` parameter is silently ignored. The abstract contract accepts `rowCount` as a meaningful input, and `spinReel(i)` is called without it. If `spinReel` internally determines the number of…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[utility] `DEAD`** — src/paytable.ts:23 (lineWins) — _Auto-resolved: no RAG candidate above 0.68 threshold_
- **[overengineering] `OVER`** — src/engine.ts:113 (spin) — _Accumulates three design-pattern instances (Factory, Strategy, Observer) inside a single function, none providing reuse: `StandardReelBuilderFactory` and `DefaultStrategy` are instantiated fresh every…_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Constructs a 2D array of 5 identical weight arrays, one per reel, establishing infrastructure for per-reel weight customization that is never actually used — every reel gets `DEFAULT_WEIGHTS`. A singl…_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/events.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_

