# Anatoly Bench Score — slot-engine

**Global F1:** 56.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 54.5% | 42.9% | 75.0% | 3 | 1 | 4 |
| utility | ✓ | 60.0% | 60.0% | 60.0% | 3 | 2 | 2 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 66.7% | 75.0% | 60.0% | 3 | 2 | 1 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 36.4% | 40.0% | 33.3% | 2 | 4 | 3 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (12)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-TYPE** — src/types.ts (LegacySpinResult) — expected verdict `DEAD` (dead-type-export)
- **[duplication · medium] DUP-PAYOUT** — ? — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — ? — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (9)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/factories.ts:8 (StandardReelBuilderFactory) — _The `_rowCount` parameter is accepted but never used when calling `spinReel(i)`. If `spinReel` does not internally account for row count, the returned Symbol[][] may not match the expected row dimensi…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[utility] `DEAD`** — src/paytable.ts:23 (lineWins) — _Exported function with 0 runtime importers and 0 type-only importers. Never imported or used anywhere._
- **[overengineering] `OVER`** — src/engine.ts:113 (spin) — _Auto-resolved: import verified on disk (getReelSymbols found in ./reels.js)_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _All five reels carry identical weights, yet the code spells out five separate weightsToArray(DEFAULT_WEIGHTS) calls instead of Array.from({length: 5}, () => weightsToArray(DEFAULT_WEIGHTS)). More impo…_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_

