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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 96% | [details](#srcenginets) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 80% | [details](#srcwildts) |
| `src/freespin.ts` | 🟢 CLEAN | 0 | 90% | [details](#srcfreespints) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L104 | 🟡 NEEDS_FIX | 96% | total * (1 + HOUSE_EDGE) raises winnings by 5%. A house edge toward the documented ~95% RTP must reduce them (1 - HOUSE_EDGE). The factor 1.05 pushes the payout in the wrong direction. |
| `computePayout` | L107 | 🟡 NEEDS_FIX | 96% | `total += bet * 0.01` runs even when there are no wins. Every losing spin pays out a positive amount, and Math.ceil makes it at least 1 coin. |
| `computePayout` | L109 | 🟡 NEEDS_FIX | 96% | Math.ceil rounds the payout up, which over-pays fractions. Casino payouts must round down. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | The README says Bet is an integer from 1 to 100, but a bet above 100 only calls console.warn and proceeds. The guard should reject it. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove the unconditional `bet * 0.01` addition so losing spins pay 0. [L107]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so payouts round down. [L109]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · medium · small]** `src/engine.ts`: Reject bets greater than 100 in spin, as the README documents (1..100). Currently it only warns. [L118]
- [ ] <!-- ACT-6c7a2e-1 --> **[correction · medium · small]** `src/wild.ts`: Confirm the intended wild multiplier formula and use a single growth factor (either (1 + wildCount) or 2 ** wildCount), not both multiplied together. [L3]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout, apply the house edge as a reduction (1 - HOUSE_EDGE) instead of 1 + HOUSE_EDGE. [L104]

## 🧹 Hygiene

- [ ] <!-- ACT-89de92-1 --> **[correction · low · trivial]** `src/freespin.ts`: In the retrigger branch (active && scatters >= 3), decrement remaining for the free spin just played, e.g. remaining += 10 - 1. Confirm the intended retrigger semantics first, since no spec is shown. [L17]
