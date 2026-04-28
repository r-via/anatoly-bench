# Anatoly Bench Score — slot-engine

**Global F1:** 46.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 57.1% | 57.1% | 57.1% | 4 | 3 | 3 |
| utility | ✓ | 60.0% | 60.0% | 60.0% | 3 | 2 | 2 |
| duplication | ✓ | 0.0% | 0.0% | 100.0% | 0 | 0 | 4 |
| overengineering | ✓ | 66.7% | 75.0% | 60.0% | 3 | 2 | 1 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 50.0% | 60.0% | 42.9% | 3 | 4 | 2 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (12)

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
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (11)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:17 (EngineContainer) — _resolve<T> calls Map.get(key) which returns undefined when the key is absent, then silently casts undefined as T. Callers receive undefined typed as a concrete type, leading to undetected runtime erro…_
- **[correction] `NEEDS_FIX`** — src/reels.ts:56 (getReelWeights) — _No bounds check on reelIndex. When reelIndex is outside 0–4, REEL_WEIGHTS[reelIndex] is undefined, but the declared return type is number[]. Callers that rely on the return value being a valid array w…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:8 (StandardReelBuilderFactory) — _The `_rowCount` parameter is silently ignored when calling `spinReel(i)`. The abstract contract declares `buildReels(reelCount, rowCount)` implying `rowCount` should influence reel construction. If `s…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Exported type alias with zero runtime and zero type-only importers. No files depend on this type._
- **[utility] `DEAD`** — src/paytable.ts:23 (lineWins) — _Auto-resolved: no RAG candidate above 0.68 threshold_
- **[overengineering] `OVER`** — src/engine.ts:113 (spin) — _Accumulates at least four unnecessary layers: (1) resolves rng/paytable/reelsModule from the container but reelsModule is never used; (2) instantiates StandardReelBuilderFactory for a single 5×3 call …_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _All five reels call weightsToArray(DEFAULT_WEIGHTS) producing identical arrays. Since there is no per-reel differentiation, this could simply be a single weights array shared by all reels (or derived …_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_

