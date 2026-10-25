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
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 97% | Forward: total * (1 + 0.05) = total * 1.05 increases payout by 5%, raising effective RTP above the raw paytable RTP — opposite of retaining a house edge. Backward: to keep 5% for the house and deliver ~95% RTP, the factor must be (1 − HOUSE_EDGE) = 0.95. Sanity check: backward(95%) → factor 0.95 → forward(factor 0.95) = 95% ✓ formula consistent. The JSDoc says 'applies the house edge to maintain ~95% RTP'; multiplying by 1.05 contradicts both the documented intent and the standard industry meaning of 'house edge' (the fraction the house keeps). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 97% | Inferred slot-machine domain from reel/payline/jackpot vocabulary throughout the file. Slot payouts must round DOWN so the house retains fractional remainders; Math.ceil rounds up, over-paying on every non-integer result. |
| `spin` | L118 | 🟡 NEEDS_FIX | 93% | README declares Bet = 1..100 coins (integer). Bets above 100 receive only console.warn and proceed normally, silently violating the documented contract. Should be included in the existing guard on line 114 (e.g. \|\| bet > 100) to match the throw pattern used for the lower-bound check. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor: slot payouts must round down so the house keeps fractional remainders, not round up (over-paying the player). [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Add `|| bet > 100` to the existing guard on line 114 so out-of-range bets throw instead of proceeding silently, consistent with the documented Bet = 1..100 contract. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace the `?? 'WILD'` fallback with the highest-value non-WILD, non-SCATTER symbol from the paytable so an all-WILD line receives the correct top payout instead of 0. [L6]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house retains 5% and effective RTP is reduced toward the documented ~95% target rather than boosted above it. [L105]
