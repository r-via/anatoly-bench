[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 97% | [details](#srcenginets) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L104–L106 | 🟡 NEEDS_FIX | 97% | Forward: total * (1 + 0.05) multiplies wins by 1.05, so the player is paid 5% more. The JSDoc says the edge maintains a ~95% RTP. Backward: a 95% target needs a factor of (1 - HOUSE_EDGE) = 0.95. Check: 0.95 applied forward gives 95%, so the math is consistent. The sign is inverted, which pushes RTP up by roughly 10 points relative to the intended factor. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 97% | `total += bet * 0.01` runs unconditionally, outside the `total > 0` guard. Losing spins therefore receive a payout. Combined with Math.ceil, any losing spin with bet >= 1 pays at least 1 coin (ceil(0.01*bet) >= 1), so no spin ever pays 0. This is free money on every spin. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 97% | Inferred slot-machine domain from reels, paylines, jackpot and RTP vocabulary. Payout rounding must go DOWN so the house keeps the fractional remainder. Math.ceil rounds every fractional payout up in the player's favour, which compounds the RTP overshoot. |
| `spin` | L118 | 🟡 NEEDS_FIX | 80% | README defines Bet as an integer from 1 to 100 coins. `if (bet > 100) console.warn(...)` is a missing guard: an out-of-contract bet should be rejected, not just logged, and the spin proceeds with a payout scaled to the oversized bet. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: In computePayout, replace Math.ceil with Math.floor so fractional payouts round down in the house's favour. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: In spin, throw an Error when bet > 100 instead of only warning, to enforce the documented 1..100 range. [L118]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout, apply the house edge as total * (1 - HOUSE_EDGE) (or remove it if the paytable already encodes the RTP) instead of (1 + HOUSE_EDGE). [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · high · large]** `src/engine.ts`: In computePayout, remove the unconditional `total += bet * 0.01`. It pays a bonus on every losing spin. [L108]
