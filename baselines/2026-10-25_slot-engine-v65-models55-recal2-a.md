# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_133814` · Anatoly v0.10.0 (`1a07419-dirty`) · project main @ `60bdb75`
**Duration:** 3m 17s · **Cost:** $1.99 · **Tokens:** 74 in / 40K out

**Global F1:** 69.9%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 66.7% | 57.1% | 80.0% | 4 | 1 | 3 | 1m 21s | $0.34 | 9K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 10s | $0.04 | 1K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 18s | $0.12 | 2K |
| overengineering | ✓ | 57.1% | 50.0% | 66.7% | 2 | 1 | 2 | 42s | $0.21 | 3K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 66.7% | 100.0% | 50.0% | 5 | 5 | 0 | 2m 31s | $0.50 | 24K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 1m 37s | $0.78 | 11K |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (7)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Math.ceil rounds the payout up. Slot payouts must round DOWN so fractional remainders stay with the house, as industry convention requires. Use Math.floor._
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Five identical per-reel weight arrays built by repeated calls. Per-reel configuration is not used, so Array.from({length:5}, ...) or a single shared array would be simpler. Per-reel indexing is specul…_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/freespin.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_

