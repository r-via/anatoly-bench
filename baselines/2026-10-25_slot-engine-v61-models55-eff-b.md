# Anatoly Bench Score — slot-engine

**Run:** `2026-10-25_125839` · Anatoly v0.10.0 (`aba77db-dirty`) · project main @ `60bdb75`
**Duration:** 2m 12s · **Cost:** $1.39 · **Tokens:** 74 in / 35K out

**Global F1:** 66.0%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN | Time | Cost | Out tokens |
|------|:------:|---:|------:|----------:|---:|---:|---:|-----:|-----:|-----------:|
| correction | ✓ | 54.5% | 42.9% | 75.0% | 3 | 1 | 4 | 1m 8s | $0.33 | 8K |
| utility | ✓ | 92.3% | 85.7% | 100.0% | 6 | 0 | 1 | 9s | $0.04 | 1K |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 19s | $0.12 | 3K |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 | 36s | $0.21 | 3K |
| tests | — | — | — | — | 0 | 0 | 0 | — | — | — |
| best-practices | ✓ | 50.0% | 80.0% | 36.4% | 4 | 7 | 1 | 2m 11s | $0.39 | 20K |
| documentation | — | — | — | — | 0 | 0 | 0 | — | — | — |
| flow | — | — | — | — | 0 | 0 | 0 | — | — | — |
| _refinement_ | — | — | — | — | — | — | — | 56s | $0.29 | 6K |

## Misses (10)

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
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _Inferred slot-machine domain from reels, paylines, jackpot and RTP vocabulary. Payout rounding must go DOWN so the house keeps the fractional remainder. Math.ceil rounds every fractional payout up in …_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/engine.ts — _Testability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/rng.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/events.ts — _JSDoc on public exports_

