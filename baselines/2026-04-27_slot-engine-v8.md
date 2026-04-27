# Anatoly Bench Score — slot-engine

**Global F1:** 58.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 36.4% | 28.6% | 50.0% | 2 | 2 | 5 |
| utility | ✓ | 66.7% | 80.0% | 57.1% | 4 | 3 | 1 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 50.0% | 60.0% | 42.9% | 3 | 4 | 2 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (11)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (10)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:17 (EngineContainer) — _resolve<T> returns this.registry.get(key) as T without checking for undefined. If a key is not registered, the method silently returns undefined cast to T, meaning callers receive an invalid value wit…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:8 (StandardReelBuilderFactory) — _The _rowCount parameter is accepted but entirely unused. spinReel(i) is called with only the reel index, meaning the number of rows in each reel is never communicated to the spinning logic. If spinRee…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[utility] `DEAD`** — src/paytable.ts:23 (lineWins) — _Exported function with zero runtime or type-only importers across the codebase_
- **[utility] `DEAD`** — src/wild.ts:1 (applyWildBonus) — _Exported but imported by 0 files_
- **[overengineering] `OVER`** — src/engine.ts:113 (spin) — _Auto-resolved: import verified on disk (StandardReelBuilderFactory found in ./factories.js)_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_

