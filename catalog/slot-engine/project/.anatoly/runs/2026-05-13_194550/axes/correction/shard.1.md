[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 2 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4 | 90% | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srclegacyts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 70% | [details](#srcwildts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 45% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🔴 ERROR | 95% | House edge applied as `(1 + HOUSE_EDGE)` = 1.05, multiplying total UP by 5% instead of reducing it. Forward: raw_payout × 1.05 → implied RTP > 100%. Backward: achieving 95% RTP requires multiplication by (1 − 0.05) = 0.95. Sanity: 0.95 × 1/0.95 = 1.0 ✓ formula is consistent; current sign is inverted. Fix: `total * (1 - HOUSE_EDGE)`. |
| `computePayout` | L108 | 🔴 ERROR | 95% | `total += bet * 0.01` unconditionally returns 1% of the bet on every spin — even when there are no winning lines — further inflating RTP above the arbitrated 95% target. |
| `computePayout` | L110 | 🔴 ERROR | 95% | `Math.ceil` rounds payouts up, systematically returning more than calculated on fractional results. Casino/gaming industry convention rounds DOWN (`Math.floor`) so the house retains the remainder; ceiling rounding erodes the house edge on every winning spin. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | `if (bet > 100) console.warn(...)` must throw (matching the lower-bound guard) — the README arbitrated intent declares Bet as 1..100 coins, integer; values above 100 must be rejected, not silently accepted. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `pickFromWeighted` | L32 | 🟡 NEEDS_FIX | 50% | Slot-machine domain inferred from CHERRY/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER vocabulary and README 95% RTP target. Math.random() is a non-certifiable PRNG; regulated gaming requires a cryptographically secure RNG (e.g., crypto.getRandomValues with scaling/rejection sampling). |
| `spinReel` | L44 | 🟡 NEEDS_FIX | 90% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex < 0 or >= 5. pickFromWeighted then calls wts.reduce(...) on undefined, throwing TypeError at runtime. |
| `getReelSymbols` | L53 | 🟡 NEEDS_FIX | 80% | Callers can push/splice SYMBOLS directly. pickFromWeighted indexes items[i] and wts[i] positionally; adding or removing symbols without mirroring weight array changes produces wrong probabilities or out-of-bounds reads. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 90% | REEL_WEIGHTS[reelIndex] returns undefined when reelIndex is outside [0, 4]; declared return type is number[], so callers trusting the type will dereference undefined and crash. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 90% | Returns the live internal array; callers can mutate weights in place (push, splice, index assignment) and permanently corrupt probability distributions for all subsequent spins. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 65% | When `state.active && scatters >= 3`, the current spin is a free spin being played and should decrement `remaining` before adding 10. The initial trigger (L15–16) correctly omits the decrement because that spin is a paid spin. The re-trigger is a free spin: omitting `state.remaining--` here gives `remaining += 10` instead of the correct net `+9`, awarding one unearned spin per re-trigger. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 45% | Math.random() is a non-seeded, non-cryptographic PRNG. The file docstring explicitly claims 'suitable for gaming RNG applications' and the README establishes a regulated slot-machine domain (reels, jackpot, RTP 95%). Regulated/certified gaming RNG must use a deterministic, auditable, seeded algorithm (e.g. a well-tested CSRNG or provably-fair PRNG); Math.random() is neither certifiable nor reproducible, violating industry convention for gambling software. |
| `weightedPick` | L15 | 🟡 NEEDS_FIX | 45% | When items is empty, items.length - 1 = -1, so items[-1] returns undefined at runtime, but the declared return type is T. TypeScript does not catch negative index access, so callers receive a silently mis-typed undefined. A guard (throw or return a sentinel) is needed before the loop. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove or justify `total += bet * 0.01`; unconditional 1%-of-bet return inflates RTP above the 95% target on every spin. [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Throw an error when `bet > 100` (matching the lower-bound guard) to enforce the arbitrated 1..100 integer contract. [L118]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Forward `rowCount` to `spinReel` (e.g. `spinReel(i, rowCount)`) so the returned symbol arrays respect the requested row dimension. If `spinReel` does not yet accept a row-count argument, add that parameter to its signature and slice/pad its output accordingly. [L13]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the re-trigger branch (active && scatters >= 3), decrement `state.remaining` before adding 10 so the current free spin is consumed: `state.remaining--; state.remaining += 10;` [L18]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `bet / 10` with integer-safe arithmetic (e.g. scale all values to integer coin units and divide at the final presentation layer, or assert bet is divisible by 10 before proceeding) to avoid IEEE 754 precision loss. [L21]
- [ ] <!-- ACT-f69593-2 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the return expression with Math.floor: `return Math.floor(multiplier * lineBet)` to enforce downward rounding per casino-industry convention and protect the 95% RTP target. [L22]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Add bounds check in spinReel: throw a descriptive RangeError when reelIndex < 0 or >= REEL_WEIGHTS.length before accessing the weights array. [L44]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add bounds check in getReelWeights and return a shallow copy ([...REEL_WEIGHTS[reelIndex]]) instead of the mutable internal array. [L57]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Add a precondition guard at function entry: if items.length === 0 or items.length !== weights.length, throw a descriptive error rather than silently returning undefined typed as T. [L15]
- [ ] <!-- ACT-e0699c-1 --> **[correction · medium · small]** `src/strategy.ts`: Revise the ConservativeStrategy payout multiplier so the resulting RTP remains at the arbitrated 95% target, or document and enforce that this strategy is only used in contexts explicitly exempt from the 95% RTP invariant. [L17]
- [ ] <!-- ACT-e0699c-2 --> **[correction · medium · small]** `src/strategy.ts`: Scale individual lineWins entries proportionally alongside totalPayout so SpinResult internal state stays consistent after adjustment. [L16]
- [ ] <!-- ACT-6c7a2e-1 --> **[correction · medium · small]** `src/wild.ts`: Replace `(1 + wildCount) * 2 ** wildCount` with `2 ** wildCount` to apply the standard per-wild doubling multiplier without the additional linear factor; re-verify RTP model after the change. [L3]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to reduce payouts by 5% and achieve the documented 95% RTP instead of >100%. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a cryptographically secure PRNG (e.g., crypto.getRandomValues scaled to [0, total)) to satisfy regulated gaming RNG certification requirements. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a certifiable, auditable PRNG (e.g. a seeded xoshiro256** or a CSPRNG wrapper) to satisfy regulated gaming RNG requirements. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Replace `Math.ceil` with `Math.floor` to round payouts down, preserving the house edge on fractional results per casino-domain convention. [L110]
- [ ] <!-- ACT-83e35f-4 --> **[correction · low · trivial]** `src/reels.ts`: Return a copy of SYMBOLS in getReelSymbols (e.g., [...SYMBOLS]) to prevent external callers from mutating the module-level array. [L53]
