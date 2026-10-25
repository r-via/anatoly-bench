# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_122934` · Anatoly v0.10.0 (`cc2adfc-dirty`) · project main @ `60bdb75`
**Duration:** 2m 40s · **Cost:** $1.83 · **Tokens:** 74 in / 36K out

**Global F1:** 73.2%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 54.5% | 42.9% | 75.0% | 3 | 1 | 4 | 1m 9s | $0.38 | 8K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 9s | $0.07 | 1K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 19s | $0.13 | 2K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 35s | $0.27 | 3K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 66.7% | 100.0% | 50.0% | 5 | 5 | 0 | 2m 8s | $0.51 | 21K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 1m 10s | $0.45 | 7K |

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

## False positives (6)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Math.ceil rounds the payout up. Slot payouts must round DOWN so the house keeps the fractional remainder. Combined with the line 108 bonus, a losing spin returns a positive payout._
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_

