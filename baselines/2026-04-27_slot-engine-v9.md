# Anatoly Bench Score — slot-engine

**Global F1:** 61.0%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 46.2% | 42.9% | 50.0% | 3 | 3 | 4 |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 66.7% | 75.0% | 60.0% | 3 | 2 | 1 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 40.0% | 40.0% | 40.0% | 2 | 3 | 3 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (11)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[correction · trivial] INV-ROUND** — src/engine.ts (computePayout) — expected verdict `NEEDS_FIX` (ceil-instead-of-floor)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · trivial] BP-MAGIC-NUMBERS** — src/engine.ts — expected verdict `NEEDS_FIX` (inline-numeric-literals)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (9)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:121 (spin) — _`rng` and `reelsModule` are resolved from the container but are never referenced again; `factory.buildReels(5, 3)` bypasses the registered `weightedPick` RNG entirely. This breaks the DI contract, mak…_
- **[correction] `NEEDS_FIX`** — src/factories.ts:12 (StandardReelBuilderFactory) — _`spinReel(i)` never receives `rowCount`. If `buildReels` is meant to honour the contract implied by its signature (producing `rowCount` rows per reel), `rowCount` must be forwarded — e.g. `spinReel(i,…_
- **[correction] `NEEDS_FIX`** — src/freespin.ts:20 (handleFreeSpins) — _The decrement branch (`state.active && scatters < 3`) runs on the same call that initially activates free spins only if the first two branches are skipped — however, on the very first activation call …_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/engine.ts:113 (spin) — _Instantiates three single-use objects per call: `StandardReelBuilderFactory` (factory-of-factory for one 5×3 call), `DefaultStrategy` (single-implementation strategy pattern for one `adjustPayout` cal…_
- **[overengineering] `OVER`** — src/reels.ts:22 (REEL_WEIGHTS) — _Calls weightsToArray(DEFAULT_WEIGHTS) five times to produce five identical arrays. All reels share the same weights, so this 2-D structure is premature generalization — it signals per-reel configurabi…_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _Immutability_
- **[best-practices] `NEEDS_FIX`** — src/reels.ts — _JSDoc on public exports_

