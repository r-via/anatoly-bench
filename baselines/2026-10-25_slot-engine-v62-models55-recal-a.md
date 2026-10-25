# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_132113` · Anatoly v0.10.0 (`291f3c5-dirty`) · project main @ `60bdb75`
**Duration:** 2m 28s · **Cost:** $1.68 · **Tokens:** 78 in / 37K out

**Global F1:** 69.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 76.9% | 71.4% | 83.3% | 5 | 1 | 2 | 1m 27s | $0.43 | 9K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 9s | $0.04 | 1K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 19s | $0.12 | 2K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 35s | $0.21 | 3K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 47.1% | 80.0% | 33.3% | 4 | 8 | 1 | 2m 8s | $0.53 | 21K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 1m 12s | $0.34 | 8K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (9)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Inferred slot-machine domain from reels, paylines, jackpot and RTP vocabulary. Payout rounding must round DOWN so the house keeps the fractional remainder. Math.ceil over-pays every spin._
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/events.ts — _JSDoc on public exports_

