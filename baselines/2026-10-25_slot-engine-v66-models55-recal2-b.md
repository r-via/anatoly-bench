# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_134138` · Anatoly v0.10.0 (`1a07419-dirty`) · project main @ `60bdb75`
**Duration:** 2m 36s · **Cost:** $1.44 · **Tokens:** 74 in / 41K out

**Global F1:** 75.1%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 66.7% | 57.1% | 80.0% | 4 | 1 | 3 | 1m 39s | $0.35 | 10K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 9s | $0.04 | 1K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 21s | $0.10 | 3K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 43s | $0.22 | 4K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 83.3% | 100.0% | 71.4% | 5 | 2 | 0 | 2m 30s | $0.42 | 23K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 1m 3s | $0.31 | 6K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (3)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Inferred slot-machine domain from reels, paylines, scatter and jackpot vocabulary. Slot payouts must round DOWN so the house keeps the fractional remainder. `Math.ceil` rounds up and over-pays every f…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/freespin.ts — _JSDoc on public exports_

