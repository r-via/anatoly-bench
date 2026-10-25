# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_122510` · Anatoly v0.10.0 (`cc2adfc-dirty`) · project main @ `60bdb75`
**Duration:** 2m 7s · **Cost:** $1.75 · **Tokens:** 74 in / 27K out

**Global F1:** 61.4%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 54.5% | 42.9% | 75.0% | 3 | 1 | 4 | 55s | $0.45 | 6K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 8s | $0.07 | 1K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 17s | $0.14 | 2K |
| overengineering | ✓ | 40.0% | 25.0% | 100.0% | 1 | 0 | 3 | 33s | $0.29 | 3K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 53.3% | 80.0% | 40.0% | 4 | 6 | 1 | 1m 31s | $0.45 | 15K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 50s | $0.35 | 5K |

## Misses (11)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[overengineering · trivial] OVER-DI** — src/engine.ts (EngineContainer) — expected verdict `OVER` (di-container-for-three-deps)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (7)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:109 (computePayout) — _Math.ceil rounds the payout up, which over-pays fractions. Casino payouts must round down._
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Security_

