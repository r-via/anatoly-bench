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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 82% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L106 | 🟡 NEEDS_FIX | 88% | total * (1 + HOUSE_EDGE) = total * 1.05 boosts the payout by 5% rather than reducing it. To maintain the arbitrated RTP=95% target the factor must be (1 - HOUSE_EDGE) = 0.95. As written, every winning spin pays out 5% more than the raw line total, moving the house edge negative. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil rounds fractional credits up, giving the player the remainder. Slot-machine industry convention (Rule 11) requires Math.floor so the house retains sub-credit remainders. |
| `spin` | L117 | 🟡 NEEDS_FIX | 85% | The arbitrated intent specifies Bet as 1..100 integer. The guard at L115–116 enforces the lower bound and integer constraint but L117 only warns for bet > 100. Execution continues with an out-of-range bet, breaking the stated contract. Should throw (or be added to the existing validation condition) consistently with the lower-bound check. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: In computePayout L110, replace Math.ceil with Math.floor — slot-machine payouts must round down so sub-credit remainders accrue to the house. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: In spin, enforce the upper bound of the Bet range by throwing on bet > 100 (e.g. add `|| bet > 100` to the existing guard condition on L115) instead of only warning. [L117]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `const lineBet = bet / 10; return multiplier * lineBet;` with `return Math.floor(multiplier * bet / 10);`. Both `multiplier` (paytable integer) and `bet` (1–100 integer per README contract) are exactly representable doubles, so their product is exact before the division, and `Math.floor` enforces the industry-standard round-down convention (house retains the remainder). [L22]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout L106, change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house edge reduces the payout to ~95% RTP rather than inflating it to ~105%. [L106]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a cryptographically secure or certified PRNG (e.g., crypto.getRandomValues / a seeded certified RNG). Math.random() cannot pass regulatory RNG audits for casino/gambling software. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a certifiable PRNG (e.g. a seeded MT19937 or crypto.getRandomValues()-based uniform draw) and update the JSDoc to accurately describe the RNG guarantee provided, since Math.random() is not auditable or certifiable for regulated gaming. [L7]
