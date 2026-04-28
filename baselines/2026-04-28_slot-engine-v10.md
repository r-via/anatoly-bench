# Anatoly Bench Score — slot-engine

**Global F1:** 65.0%

**Scored axes:** correction, utility, duplication, overengineering, best-practices

## Per-axis scores

| Axis | Scored | F1 | Recall | Precision | TP | FP | FN |
|------|:------:|---:|------:|----------:|---:|---:|---:|
| correction | ✓ | 53.3% | 57.1% | 50.0% | 4 | 4 | 3 |
| utility | ✓ | 85.7% | 85.7% | 85.7% | 6 | 1 | 1 |
| duplication | ✓ | 66.7% | 50.0% | 100.0% | 2 | 0 | 2 |
| overengineering | ✓ | 75.0% | 75.0% | 75.0% | 3 | 1 | 1 |
| tests | — | — | — | — | 0 | 0 | 0 |
| best-practices | ✓ | 44.4% | 40.0% | 50.0% | 2 | 2 | 3 |
| documentation | — | — | — | — | 0 | 0 | 0 |

## Misses (10)

Cataloged violations that Anatoly did not flag.

- **[correction · medium] INV-WEIGHTS** — src/reels.ts — expected verdict `NEEDS_FIX` (wrong-reel-weight)
- **[correction · hard] INV-WILD** — src/wild.ts (applyWildBonus) — expected verdict `NEEDS_FIX` (wild-multiplier-stacking)
- **[correction · medium] INV-JACKPOT** — src/jackpot.ts (isJackpotHit) — expected verdict `NEEDS_FIX` (jackpot-threshold-too-low)
- **[utility · medium] DEAD-DEBUG-BRANCH** — src/engine.ts (DEBUG_MODE) — expected verdict `DEAD` (unreachable-branch)
- **[duplication · medium] DUP-PAYOUT** — src/legacy.ts (computeLegacyPayout) / src/engine.ts (computePayout) / src/engine.ts (evaluateLine) — expected verdict `DUPLICATE` (semantic-duplicate-function)
- **[duplication · hard] DUP-WILD** — src/engine.ts (evaluateLine) / src/wild.ts (applyWildBonus) — expected verdict `DUPLICATE` (inline-duplicate-of-helper)
- **[overengineering · medium] OVER-STRATEGY** — src/strategy.ts — expected verdict `OVER` (strategy-pattern-single-used-strategy)
- **[best-practices · medium] BP-RNG** — src/rng.ts — expected verdict `NEEDS_FIX` (insecure-rng-for-gaming)
- **[best-practices · medium] BP-MUTATION** — src/freespin.ts (handleFreeSpins) — expected verdict `NEEDS_FIX` (in-place-mutation-of-argument)
- **[best-practices · trivial] BP-STRING-THROW** — src/engine.ts (spin) — expected verdict `NEEDS_FIX` (string-thrown-not-error)

## False positives (8)

Findings Anatoly emitted on scored axes without a matching cataloged violation.

- **[correction] `NEEDS_FIX`** — src/engine.ts:111 (computePayout) — _Math.ceil rounds the final payout UP, further compounding the already-inverted house edge; Math.floor is the correct operation when the house retains a margin._
- **[correction] `NEEDS_FIX`** — src/engine.ts:118 (spin) — _throw "invalid bet" throws a plain string rather than new Error("invalid bet"). Callers that catch with instanceof Error checks or access .message / .stack will receive undefined, causing silent mis-h…_
- **[correction] `NEEDS_FIX`** — src/events.ts:19 (SpinEventEmitter) — _emit holds a direct reference to the stored handlers array and iterates it with for…of. Array iterators re-check length on every step, so push() calls from within a handler (via on()) extend the live …_
- **[correction] `NEEDS_FIX`** — src/freespin.ts:18 (handleFreeSpins) — _On retrigger (state.active && scatters >= 3): remaining += 10 is applied but the current spin is not decremented, so the retrigger effectively grants 11 free spins (10 added + the current spin not con…_
- **[utility] `DEAD`** — src/engine.ts:12 (Bet) — _Auto-resolved: type cannot be over-engineered_
- **[overengineering] `OVER`** — src/engine.ts:113 (spin) — _Accumulates four distinct overengineering concerns in one function: (1) resolves `paytable` from the IoC container despite it being a direct import; resolves `rng` and `reelsModule` which are then nev…_
- **[best-practices] `NEEDS_FIX`** — src/paytable.ts — _JSDoc on public exports_
- **[best-practices] `NEEDS_FIX`** — src/jackpot.ts — _JSDoc on public exports_

## Unscored findings (1)

Findings Anatoly emitted on axes that this fixture does not evaluate. Preserved here for visibility; not counted toward global F1.

### tests (1)

- **[tests] `UNCOVERED`** — src/engine.ts:101 (computePayout) — _Auto-resolved: JSDoc block found before symbol (deliberated: confirmed — Confirmed critical financial bug. JSDoc at src/engine.ts:97-100 states 'Applies the house edge to maintain a target RTP of appr…_

