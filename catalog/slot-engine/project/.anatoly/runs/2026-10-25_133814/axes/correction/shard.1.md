[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcenginets) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 95% | Slot-machine domain, JSDoc target RTP ~95%. A house edge must reduce the payout (multiply by 1 - HOUSE_EDGE). Multiplying by (1 + HOUSE_EDGE) raises every win by 5%, pushing RTP above the target. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 95% | `total += bet * 0.01` runs unconditionally. Every losing spin pays out, and after Math.ceil it pays at least 1 coin. A zero-win spin should pay 0, so RTP is inflated and losses are impossible. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 95% | Math.ceil rounds the payout up. Slot payouts must round DOWN so fractional remainders stay with the house, as industry convention requires. Use Math.floor. |
| `spin` | L118 | 🟡 NEEDS_FIX | 80% | The README defines Bet as an integer from 1 to 100. A bet above 100 only triggers console.warn and the spin proceeds. This is a missing guard. It should throw or reject like the other invalid-bet checks. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 70% | Inferred slot-machine domain from reel/scatter/free-spin/jackpot vocabulary. A free-spin counter must be consumed by every round played, including the round that re-triggers the bonus. A retrigger adds to the remaining count and never exempts the current round. When `state.active && scatters >= 3`, the code does `remaining += 10` and skips the `remaining--` that the third branch applies. The retrigger round is therefore free, and the player gets 10 spins plus an uncounted round. Consecutive retriggers never decrement, so rounds chain indefinitely. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so payouts round down. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Reject bets above 100 (throw an Error) instead of only warning, to enforce the documented 1..100 range. [L118]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch, consume the current round as well as adding the award. Decrement `state.remaining` for the round just played, then add 10 (net +9), and deactivate when `remaining <= 0`. Alternatively, restructure so the decrement runs for every round while active and the +10 is applied afterward. [L17]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Apply the house edge as total * (1 - HOUSE_EDGE), not (1 + HOUSE_EDGE), so wins are reduced to meet the ~95% RTP target. [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · high · large]** `src/engine.ts`: Remove the unconditional `total += bet * 0.01`. Losing spins must pay 0. [L108]
