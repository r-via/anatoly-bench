# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_121825` · Anatoly v0.10.0 (`cc2adfc-dirty`) · project main @ `60bdb75`
**Duration:** 5m 2s · **Cost:** $4.11 · **Tokens:** 111 in / 109K out

**Global F1:** 76.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 66.7% | 57.1% | 80.0% | 4 | 1 | 3 | 8m 4s | $1.03 | 36K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 34s | $0.12 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 51s | $0.21 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 2m 35s | $0.47 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 72.7% | 80.0% | 66.7% | 4 | 2 | 1 | 12m 12s | $1.20 | 55K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 2m 31s | $1.08 | 9K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (3)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/factories.ts:9 (StandardReelBuilderFactory) — _buildReels accepts rowCount but never passes it to spinReel. spinReel is documented to always generate a 3-symbol outcome. If the engine ever calls buildReels with a rowCount != 3, the returned Symbol…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_

