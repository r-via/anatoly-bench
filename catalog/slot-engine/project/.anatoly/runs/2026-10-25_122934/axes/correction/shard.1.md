[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 96% | [details](#srcenginets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 87% | [details](#srcrngts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 80% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 96% | Inferred slot-machine domain from reel/payline/jackpot vocabulary. A house edge must reduce the payout, for example total * (1 - HOUSE_EDGE). Multiplying by (1 + 0.05) raises payouts by 5%, which moves RTP away from the documented ~95% target. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 96% | total += bet * 0.01 adds 1% of the bet even when there are no wins. Every losing spin pays out, and the ceil on line 110 turns that into at least 1 coin. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 96% | Math.ceil rounds the payout up. Slot payouts must round DOWN so the house keeps the fractional remainder. Combined with the line 108 bonus, a losing spin returns a positive payout. |
| `spin` | L118 | 🟡 NEEDS_FIX | 92% | The README restricts Bet to 1..100 integers, but a bet above 100 only logs a console.warn and the spin proceeds with a full payout. The out-of-contract input should be rejected like the other invalid bets. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-1 --> **[correction · medium · small]** `src/engine.ts`: Apply the house edge as total * (1 - HOUSE_EDGE), or remove it if the paytable already encodes the RTP. [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove the unconditional bet * 0.01 addition so a losing spin pays 0. [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so payouts round down. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Throw on bet > 100 instead of only warning, to enforce the documented 1..100 range. [L118]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Validate inputs: throw if items is empty, if weights.length !== items.length, if any weight is negative or non-finite, or if total weight <= 0. Do this instead of silently returning the last item or undefined. [L6]
- [ ] <!-- ACT-6c7a2e-1 --> **[correction · medium · small]** `src/wild.ts`: Apply a single wild multiplier formula (either `1 + wildCount` or `2 ** wildCount`) instead of multiplying both. Confirm the intended formula against the game design before changing it. [L3]
