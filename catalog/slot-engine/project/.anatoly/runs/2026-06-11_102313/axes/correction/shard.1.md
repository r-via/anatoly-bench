[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 92% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 85% | Forward: code does `total * (1 + 0.05) = total * 1.05`, increasing every win by 5% → implied RTP > 100%. Backward: target RTP 95% requires `total * (1 - 0.05) = total * 0.95`. Sanity: forward(0.95) = 95% ✓ formula consistent. The operand must be `(1 - HOUSE_EDGE)`, not `(1 + HOUSE_EDGE)`. Contradicts the arbitrated intent 'target RTP of approximately 95%'. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 85% | Slot-machine domain (CHERRY/LEMON/DIAMOND/BELL/BAR/SEVEN paytable, paylines, jackpot): industry convention requires rounding payouts DOWN so the house retains the fractional remainder. Math.ceil rounds UP, transferring that remainder to the player on every spin. Replace with Math.floor. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: In computePayout L110, replace Math.ceil with Math.floor to round slot payouts down per slot-machine industry convention (house retains fractional remainder). [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: In spin, add `|| bet > 100` to the existing throw guard (L114) and remove the console.warn at L118 to enforce the full 1..100 integer contract from the arbitrated intent. [L114]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the return expression in Math.floor: `return Math.floor(multiplier * lineBet);` — regulated slot payouts must be integer coin units; fractional remainders go to the house. [L23]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() with a certifiable CSPRNG (e.g. crypto.getRandomValues via Node.js crypto module) to comply with regulated gaming RNG requirements. Math.random() is non-deterministically seedable and not auditable for gaming certification. [L32]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout L105, change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so wins are reduced by 5% (house edge) rather than inflated, restoring the documented 95% RTP target. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to ≤12 (target ≈8) to bring total RTP within the arbitrated 95% ceiling. At weight=30, DIAMOND combinations alone return ~229% of each bet across 10 paylines; a weight of ~8–10 constrains DIAMOND's share to ≈8–15%, leaving budget for other symbols to sum near 95%. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a certifiable source of randomness (e.g., crypto.getRandomValues() producing a value in [0, totalWeight)) to meet regulated gaming RNG requirements. [L7]
