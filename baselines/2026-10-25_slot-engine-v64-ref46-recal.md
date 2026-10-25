# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_132657` · Anatoly v0.10.0 (`291f3c5-dirty`) · project main @ `60bdb75`
**Duration:** 5m 33s · **Cost:** $3.30 · **Tokens:** 111 in / 98K out

**Global F1:** 72.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 66.7% | 57.1% | 80.0% | 4 | 1 | 3 | 8m 3s | $0.91 | 33K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 45s | $0.07 | 4K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 0s | $0.09 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 2m 47s | $0.20 | 10K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 53.3% | 80.0% | 40.0% | 4 | 6 | 1 | 11m 41s | $1.07 | 47K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 2m 53s | $0.96 | 11K |

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

## False positives (7)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/factories.ts:10 (StandardReelBuilderFactory) — _The parameter _rowCount is discarded and never passed to spinReel. spinReel is documented to return a 3-symbol reel unconditionally. If the engine ever calls buildReels with a rowCount other than 3, t…_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_

