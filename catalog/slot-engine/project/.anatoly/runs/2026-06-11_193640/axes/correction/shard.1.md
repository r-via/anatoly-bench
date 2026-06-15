[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcreelsts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L104 | 🟡 NEEDS_FIX | 88% | Multiplies total by (1 + HOUSE_EDGE) = 1.05, boosting payouts by 5% rather than reducing them. Arbitrated intent: engine targets 95% RTP with a 5% house edge. Fix: change to `total * (1 - HOUSE_EDGE)`. |
| `computePayout` | L109 | 🟡 NEEDS_FIX | 88% | Math.ceil always rounds the payout up, transferring fractional remainders to the player. Slot-machine industry convention requires Math.floor so the house retains the remainder. |
| `spin` | L116–L118 | 🟡 NEEDS_FIX | 90% | Validation rejects bet < 1 and non-integers but not bet > 100. Arbitrated intent: `type Bet = number; // 1..100 coins, integer`. The guard must throw when bet > 100, not merely warn. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so fractional payout remainders stay with the house, per slot-machine industry convention. [L109]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Add `|| bet > 100` to the throw condition in spin() so bets outside the 1–100 range are rejected, not just warned about. [L116]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the return expression in Math.floor: `return Math.floor(multiplier * lineBet)`. Slot-machine convention (inferred domain) requires rounding DOWN; `bet / 10` is non-exact in IEEE 754 for non-multiples of 10, producing results like 300.00000000000003 for bet=3 × 1000× multiplier. [L23]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certified CSPRNG (e.g., crypto.getRandomValues or a seeded, auditable PRNG approved by the target jurisdiction's gaming lab). Math.random() is non-deterministic in seeding, implementation-defined in distribution, and excluded from GLI/BMM/iTech certifications for regulated slot RNG. [L32]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` so the 5% house edge reduces payouts rather than inflating them. [L104]
