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

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 96% | Forward: total * (1 + 0.05) = 1.05x the line wins, so payout rises 5% and the implied RTP is above the base paytable RTP. Backward: a documented ~95% target needs total * (1 - HOUSE_EDGE) = 0.95x. Sanity: 0.95x fed forward gives a 95% factor, so the formula is consistent. The sign is inverted, a mismatch of about 10 percentage points. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 96% | `total += bet * 0.01` runs unconditionally, outside the `total > 0` guard. Every spin, including a losing one, receives a bonus of 1% of the bet. Combined with Math.ceil, any losing spin with bet 1..100 pays at least 1 coin. At bet 10 that returns 10% of the stake on a loss, so RTP exceeds the target. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 96% | Inferred slot-machine domain from reels/paylines/jackpot/free-spin vocabulary. Slot payouts must round DOWN so the house keeps fractional remainders. Math.ceil over-pays every fractional payout; use Math.floor. |
| `spin` | L118 | 🟡 NEEDS_FIX | 92% | README documents Bet as an integer in 1..100, and the code's own message says 'bet exceeds maximum'. The out-of-contract input is only warned about, and the spin proceeds and pays out. This path should reject the bet like the other invalid-bet case. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout so fractional payouts round down. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Reject bets above 100 in spin by throwing an Error, instead of only logging console.warn and proceeding. [L118]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout, change the house-edge application to total * (1 - HOUSE_EDGE) so the engine moves toward the documented ~95% RTP. [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · high · large]** `src/engine.ts`: In computePayout, remove the unconditional `total += bet * 0.01`, or move it inside the `total > 0` branch if a bonus is intended. It currently pays out on losing spins. [L108]
