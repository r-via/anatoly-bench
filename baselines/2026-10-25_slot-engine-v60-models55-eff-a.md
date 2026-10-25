# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_125611` · Anatoly v0.10.0 (`aba77db-dirty`) · project main @ `60bdb75`
**Duration:** 2m 25s · **Cost:** $1.56 · **Tokens:** 74 in / 38K out

**Global F1:** 69.5%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 54.5% | 42.9% | 75.0% | 3 | 1 | 4 | 1m 21s | $0.36 | 10K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 9s | $0.05 | 1K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 18s | $0.12 | 2K |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 | 35s | $0.24 | 3K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 58.8% | 100.0% | 41.7% | 5 | 7 | 0 | 2m 13s | $0.43 | 21K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 57s | $0.35 | 6K |

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

## False positives (9)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Inferred slot-machine domain from reels/paylines/jackpot/free-spin vocabulary. Slot payouts must round DOWN so the house keeps fractional remainders. Math.ceil over-pays every fractional payout; use M…_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical copies of the same weights, built through the config indirection. Per-reel weights are not used. Array.from({length:5}, ...) or a single shared array would be simpler. It is a small spe…_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_

