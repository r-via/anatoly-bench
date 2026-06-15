# Anatoly Bench Score — slot-engine

**Run:** `2026-06-15_111546` · Anatoly v0.9.6 (`78e46eb-dirty`) · project main @ `60bdb75`
**Duration:** 8m 51s · **Cost:** $3.04 · **Tokens:** 111 in / 140K out

**Global F1:** 68.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 57.1% | 57.1% | 57.1% | 4 | 3 | 3 | 15m 5s | $1.01 | 59K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 37s | $0.08 | 3K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 1m 1s | $0.12 | 5K |
| overengineering | ✓ | 85.7% | 75.0% | 100.0% | 3 | 0 | 1 | 3m 40s | $0.30 | 13K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 42.9% | 60.0% | 33.3% | 3 | 6 | 2 | 15m 49s | $1.04 | 61K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 2m 0s | $0.40 | 6K |

## Misses (9)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (9)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Math.ceil rounds payout up. Casino/slot domain convention: payouts must round DOWN so the house retains the remainder. Replace with Math.floor._
- **[correction] `NEEDS_FIX`** — src/reels.ts:32 (pickFromWeighted) — _Inferred casino/slot-machine domain from CHERRY/SEVEN/BAR/WILD/SCATTER vocabulary, RTP documentation, free-spin and jackpot mechanics across the project. Math.random() (V8 xorshift128+) is not cryptog…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Inferred regulated slot-machine domain from JSDoc ('suitable for gaming RNG applications'), consumer `spin` in src/engine.ts (paylines, jackpot, free-spins), and reel/paytable vocabulary throughout th…_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/factories.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_

