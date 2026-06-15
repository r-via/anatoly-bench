# Anatoly Bench Score — slot-engine

**Global F1:** 67.8%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 53.3% | 57.1% | 50.0% | 4 | 4 | 3 |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 66.7% | 100.0% | 50.0% | 5 | 5 | 0 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (8)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-FACTORY** — src/factories.ts — expected verdict `OVER` (abstract-factory-for-one-concrete)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)

## False positives (10)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:110 (computePayout) — _`Math.ceil` rounds payouts UP, transferring fractional coin remainders to the player. Casino/slot-machine domain convention requires `Math.floor` so the house retains remainders and the target RTP is …_
- **[correction] `NEEDS_FIX`** — src/engine.ts:120 (spin) — _`rng` (L120) and `reelsModule` (L122) are resolved from the DI container but are never passed to `factory.buildReels()` or used anywhere in the function. The factory builds reels with its own internal…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:7 (weightedPick) — _Uses `Math.random()`, which is not a cryptographically secure or certifiable RNG. The Internal Reference Documentation (.anatoly/docs/03-Guides/02-Advanced-Configuration.md, .anatoly/docs/04-API-Refer…_
- **[correction] `NEEDS_FIX`** — src/rng.ts:13 (weightedPick) — _When `items` is empty, the for-loop never executes and the fallback `return items[items.length - 1]` evaluates to `items[-1]`, which is `undefined`. The function then returns `undefined` as type `T`, …_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/legacy.ts — _Security_
- **[best-practices] `NEEDS_FIX`** — src/strategy.ts — _JSDoc on public exports_

