[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 96% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 96% | Forward derivation: total * (1 + 0.05) raises payouts by 5%. The JSDoc says the house edge keeps RTP near 95%, which needs a reduction, e.g. (1 - HOUSE_EDGE). Backward derivation: 95% of the raw payout is total * 0.95. Feeding that back forward gives 0.95 * raw, which is the documented target. The sign is inverted, so the code pushes RTP above the raw paytable RTP instead of below it. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 96% | `total += bet * 0.01` runs unconditionally, outside the `total > 0` guard. Combined with Math.ceil, every losing spin pays at least 1 coin. With bet=1 that refunds 100% of the stake on a loss, and across bets 1..100 it returns at least 1 coin per spin. Nothing in the README or JSDoc describes this consolation payout. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 96% | Inferred slot-machine domain from reels, paylines, jackpot and RTP vocabulary. Payout rounding must round DOWN so the house keeps the fractional remainder. Math.ceil over-pays every spin. |
| `spin` | L118 | 🟡 NEEDS_FIX | 88% | README: `type Bet = number; // 1..100 coins, integer`. A bet above 100 only calls console.warn and the spin proceeds with the out-of-contract stake. The guard should reject it (throw an Error) like the other invalid-bet checks. Because of the line-108 payout bug in computePayout, a larger bet also yields a larger guaranteed payout. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L14 | 🟡 NEEDS_FIX | 92% | Inferred slot-machine domain from the reel, symbol and WILD/SCATTER vocabulary. By convention, symbols listed in ascending value (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND) get decreasing weights, and premium symbols are rare. Here DIAMOND is 30 of a total of 120, so P(DIAMOND) per cell is about 0.25, versus 0.04 for SEVEN. That is likely to push RTP far above any normal target. A DIAMOND weight in the low single digits, near SEVEN's 5, would fit. The paytable and documented RTP are not in context, so confidence is limited. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 75% | Inferred slot-machine domain from reel, payline, scatter, jackpot and free-spin vocabulary. A bonus-round counter must be consumed by every round played, including the round that re-triggers the bonus, and a retrigger only adds to the remaining count. When state.active and scatters >= 3, the code does `remaining += 10` and skips the `remaining--` that the non-retrigger active branch performs. The retrigger round therefore plays for free, and the player is awarded one spin too many per retrigger. The code should decrement for the current spin and then add 10. It should also deactivate when remaining reaches 0, which is a no-op here because 10 is added first. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so fractional payout remainders go to the house. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Reject bets above 100 with a thrown Error instead of only warning, matching the documented 1..100 range. [L118]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the active-and-retrigger branch, decrement `state.remaining` for the spin just played, then add 10. Run the decrement and the `remaining <= 0` deactivation check for every active round. [L18]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Check the DIAMOND weight (30) in DEFAULT_WEIGHTS against the paytable and the target RTP. Lower it to a rare-symbol value if it is not intended. [L14]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Apply the house edge as a reduction, e.g. total * (1 - HOUSE_EDGE), to match the documented RTP of about 95%. [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · high · large]** `src/engine.ts`: Remove the unconditional `total += bet * 0.01`, or move it inside a documented, intended branch, so losing spins pay 0. [L108]
