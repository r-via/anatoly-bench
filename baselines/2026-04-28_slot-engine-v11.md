# Anatoly Bench Score — slot-engine

**Global F1:** 57.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 44.4% | 28.6% | 100.0% | 2 | 0 | 5 |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 33.3% | 25.0% | 50.0% | 1 | 1 | 3 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 58.8% | 100.0% | 41.7% | 5 | 7 | 0 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (11)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-FREESPIN** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (freespin-retrigger-no-decrement)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-BETCAP** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (missing-upper-bet-guard)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-EVENTS** — src/events.ts (SpinEventEmitter) — expected verdict `OVER` (pubsub-for-one-synchronous-call)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (9)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/engine.ts:113 (spin) — _Three unnecessary abstractions instantiated on every call: (1) `StandardReelBuilderFactory` — a factory object used once to call `buildReels`, which could be a direct function import; (2) `DefaultStra…_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/events.ts — _JSDoc on public exports_

