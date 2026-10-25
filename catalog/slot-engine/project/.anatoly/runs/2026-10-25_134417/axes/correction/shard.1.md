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
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 90% | Forward derivation: total * (1 + 0.05) = total * 1.05 boosts the payout by 5% rather than reducing it. Backward derivation: target RTP ~95% requires multiplier (1 - 0.05) = 0.95. Sanity: forward(0.95) = 95% ✓ — formula is consistent, so the forward result of 1.05 is definitively wrong. Current code produces RTP > 100%, directly contradicting the JSDoc "target RTP of approximately 95%". Change `(1 + HOUSE_EDGE)` to `(1 - HOUSE_EDGE)`. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 90% | Inferred slot-machine domain from reels/paylines/jackpot/free-spin vocabulary. Industry rule: slot payouts must round DOWN so the house retains fractional coins. Math.ceil rounds up, over-paying players by up to 1 coin on every winning spin. |
| `spin` | L118 | 🟡 NEEDS_FIX | 55% | README contract: Bet is `1..100 coins, integer`. Values above 100 emit console.warn but the spin proceeds normally. The guard should throw (matching the lower-bound check) to enforce the documented upper bound. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L10–L14 | 🟡 NEEDS_FIX | 90% | _rowCount parameter is discarded; spinReel(i) always produces a 3-row result. If engine.ts ever passes a rowCount != 3, the returned Symbol[][] will have the wrong number of rows per reel, causing payline evaluation to read incorrect or undefined positions. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 90% | Inferred slot-machine domain from reel/scatter/freespin/jackpot vocabulary throughout the project. Industry rule: a free-spin counter must be consumed by every round played, including a retrigger round (retrigger adds to remaining, never exempts the current round). When `state.active && scatters >= 3`, the current spin IS a free spin but `remaining` is only incremented by 10, not decremented by 1 for the round just played. Correct net delta is +9 (add 10, subtract 1). The current code over-awards one free spin per retrigger and, if scatters appear every round, the counter never decreases, creating an indefinite free-spin loop. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace `Math.ceil(total)` with `Math.floor(total)` to comply with the slot-machine industry convention of rounding payouts down so the house retains fractional coins. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Add `bet > 100` to the existing throw condition (or add a separate throw) so bets exceeding the documented maximum are rejected rather than only warned about. [L118]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Pass rowCount to spinReel (or slice/extend its output) so buildReels respects the requested row dimension. At minimum, validate that rowCount matches spinReel's fixed output length and throw if they diverge. [L12]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch (state.active && scatters >= 3), decrement remaining for the current round in addition to adding the retrigger award: `state.remaining += 10; state.remaining--;` (net +9). This ensures the current free spin is consumed as required by the slot-machine convention that every played round decrements the counter. [L18]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house edge reduces payout toward the documented ~95% RTP target instead of inflating it above 100%. [L105]
