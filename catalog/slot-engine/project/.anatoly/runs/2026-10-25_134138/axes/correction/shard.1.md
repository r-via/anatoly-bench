[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 96% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 96% | The JSDoc says the house edge keeps RTP near 95%. `total * (1 + HOUSE_EDGE)` raises every win by 5%, which lowers the house's margin and pushes RTP up, not down. The edge is applied in the player's favour. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 96% | `total += bet * 0.01` runs even when there are no line wins, so a losing spin still pays out. For bet=10, 0 wins gives 0.1, and `Math.ceil` turns that into 1 coin. Every losing spin returns at least 1 coin, and the extra payout is documented nowhere. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 96% | Inferred slot-machine domain from reels, paylines, scatter and jackpot vocabulary. Slot payouts must round DOWN so the house keeps the fractional remainder. `Math.ceil` rounds up and over-pays every fractional win. It also turns the 0.01*bet term into a guaranteed 1 coin. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L14 | 🟡 NEEDS_FIX | 88% | DIAMOND: 30 is out of line with the other premium weights (SEVEN 5, WILD 5, SCATTER 5) and is the most frequent symbol. It likely over-weights a premium symbol and inflates RTP. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 70% | Inferred slot-machine domain from free-spin and scatter vocabulary. A free-spin counter must be consumed by every free round played, including a round that re-triggers the bonus. A retrigger adds to the remaining count and never exempts the current round. Here, when state.active and scatters >= 3, remaining += 10 runs with no remaining-- for the current spin. Each retrigger therefore awards 11 spins, not 10, and the round that retriggered is played for free. The decrement runs only when scatters < 3. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-1 --> **[correction · medium · small]** `src/engine.ts`: Apply the house edge as a reduction, or remove it, so payouts do not exceed the target RTP. `(1 + HOUSE_EDGE)` currently raises every win by 5%. [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove the unconditional `bet * 0.01` addition, which pays out on losing spins. If a consolation payout is intended, it needs a documented contract. [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace `Math.ceil` with `Math.floor` so fractional payouts round down in the house's favour. [L110]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch, decrement for the current spin as well as adding the award. Use `state.remaining += 10; state.remaining--;`. Then run the same `remaining <= 0` deactivation check as the non-retrigger branch, or restructure so the decrement and end-check run for every active spin. [L18]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Check DIAMOND weight (30) against the paytable and the documented RTP target. It is likely meant to be a rare premium weight (low single digits to about 5). [L14]
