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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcenginets) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 86% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 95% | Inferred slot-machine domain from reels, paylines and the RTP comment. The house edge must reduce the payout, but total*(1+0.05) raises it by 5%. Forward: wins are multiplied by 1.05, which pushes RTP above the base paytable RTP. Backward: a ~95% target needs a factor below 1, such as (1 - HOUSE_EDGE). The inversion is clear. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 95% | `total += bet * 0.01` runs unconditionally. Combined with Math.ceil, every losing spin pays at least 1 coin (bet is an integer >= 1). Losing spins should pay 0, and the flat rebate adds RTP beyond the documented target. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 95% | Slot payout rounding must round DOWN so the house keeps the fractional remainder. Math.ceil over-pays on every fractional payout; it should be Math.floor. |
| `spin` | L118 | 🟡 NEEDS_FIX | 80% | The upper bound is not enforced. A bet like 1000 is warned about and then paid out, although the documented range is 1..100. The guard should reject it, like the other invalid-bet case. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 78% | Inferred slot-machine domain from reel, payline, scatter and free-spin vocabulary. A free-spin counter must be consumed by every free round played, including the round that retriggers. A retrigger adds to the remaining count and does not exempt the current round. When state.active and scatters >= 3, the code only does `remaining += 10` and skips the decrement. The retrigger round is therefore free, and the player gets 11 free rounds for the retrigger instead of 10. Decrement first, then add the 10, then deactivate if remaining <= 0. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove the unconditional `total += bet * 0.01` so non-winning spins pay 0. [L108]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Round the payout down with Math.floor, not Math.ceil. [L110]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Throw when bet > 100 instead of only warning, to enforce the documented 1..100 range. [L118]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the active-state branch, decrement `state.remaining` for the current free round on every path. If scatters >= 3, add 10 after the decrement. Then set `state.active = false` when `remaining <= 0`. [L18]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Apply the house edge as a reduction, e.g. total * (1 - HOUSE_EDGE), not an increase. [L105]

## 🧹 Hygiene

- [ ] <!-- ACT-4db700-1 --> **[correction · low · trivial]** `src/rng.ts`: Validate inputs at the start: throw if items is empty, if items.length !== weights.length, if any weight is negative or non-finite, or if totalWeight <= 0, instead of silently returning the last item. [L5]
