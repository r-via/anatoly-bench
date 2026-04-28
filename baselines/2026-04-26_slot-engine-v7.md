# Anatoly Bench Score — slot-engine

**Global F1:** 65.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 61.5% | 57.1% | 66.7% | 4 | 2 | 3 |
| utility | ✓ | 60.0% | 60.0% | 60.0% | 3 | 2 | 2 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 66.7% | 75.0% | 60.0% | 3 | 2 | 1 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 72.7% | 80.0% | 66.7% | 4 | 2 | 1 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (9)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[utility · trivial] DEAD-TYPE** — src/types.ts (LegacySpinResult) — expected verdict `DEAD` (dead-type-export)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:17 (EngineContainer) — _resolve<T>() returns this.registry.get(key) as T without any existence check. When key is missing, registry.get returns undefined, which is silently cast to T. Callers receive undefined typed as a fun…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:8 (StandardReelBuilderFactory) — _rowCount parameter is silently ignored (prefixed with _ indicating intentional omission). spinReel(i) is called with only a reel index, meaning the number of rows per reel is never applied. If spinRee…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[utility] `DEAD`** — src/paytable.ts:23 (lineWins) — _Exported function never imported by any file (0 runtime importers, 0 type-only importers)_
- **[overengineering] `OVER`** — src/engine.ts:113 (spin) — _Instantiates StandardReelBuilderFactory, DefaultStrategy, and SpinEventEmitter on every call despite each having a single implementation. The factory pattern for reel building, the strategy pattern fo…_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _All five reels receive identical weight arrays via repeated weightsToArray(DEFAULT_WEIGHTS). This creates premature generalization infrastructure for per-reel weighting that is never used. A single sh…_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_

