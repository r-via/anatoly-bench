# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_134417` · Anatoly v0.10.0 (`1a07419-dirty`) · project main @ `60bdb75`
**Duration:** 3m 6s · **Cost:** $1.96 · **Tokens:** 111 in / 98K out

**Global F1:** 68.6%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 66.7% | 57.1% | 80.0% | 4 | 1 | 3 | 7m 18s | $0.51 | 29K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 36s | $0.06 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 59s | $0.09 | 5K |
| overengineering | ✓ | 57.1% | 50.0% | 66.7% | 2 | 1 | 2 | 2m 51s | $0.21 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 60.0% | 60.0% | 60.0% | 3 | 2 | 2 | 12m 27s | $1.09 | 50K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 1s | $0.00 | 0 |

## Misses (10)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[overengineering · trivial] OVER-DI** — src/engine.ts (EngineContainer) — expected verdict `OVER` (di-container-for-three-deps)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (4)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/factories.ts:10 (StandardReelBuilderFactory) — __rowCount parameter is discarded; spinReel(i) always produces a 3-row result. If engine.ts ever passes a rowCount != 3, the returned Symbol[][] will have the wrong number of rows per reel, causing pay…_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical weightsToArray(DEFAULT_WEIGHTS) calls; all reels share the same weights. Premature per-reel configurability with no actual differentiation. A single shared array referenced by spinReel …_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Testability_

