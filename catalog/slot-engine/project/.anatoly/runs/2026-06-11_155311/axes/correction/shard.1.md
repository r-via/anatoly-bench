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
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 92% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 85% | total * (1 + HOUSE_EDGE) multiplies payout by 1.05, giving the player an extra 5% instead of deducting it. Forward: base payout × 1.05 → implied RTP > 100%. Backward: target 95% RTP requires × (1 − 0.05) = × 0.95. Sanity: forward(0.95) = 95% ✓ formula consistent. Arbitrated intent: RTP ≈ 95%. Fix: change to total * (1 - HOUSE_EDGE). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 85% | Math.ceil rounds fractional credits up to the player. Slot-machine industry convention: payouts round DOWN so the house retains the remainder. Fix: use Math.floor. |
| `spin` | L118 | 🟡 NEEDS_FIX | 88% | Arbitrated intent: Bet = number 1..100 integer. A bet of 101+ triggers console.warn and proceeds to spin. The guards for bet < 1 and non-integer bets (L114–116) correctly throw; the upper-bound check must do the same. |

### `src/paytable.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `PAY_TABLE` | L11 | 🟡 NEEDS_FIX | 60% | Forward (ignoring WILDs, which would only raise RTP further): p_D=30/120=0.25. E[DIAMOND payout per payline]/lineBet = p^3×(1−p)×50 + p^4×(1−p)×250 + p^5×1000 = 0.25^3×0.75×50 + 0.25^4×0.75×250 + 0.25^5×1000 = 0.586+0.732+0.977 = 2.295. All symbols combined ≈ 2.384; RTP = 2.384×(10×lineBet)/(10×lineBet) ≈ 238%. Backward: for 95% total RTP with these other-symbol weights, DIAMOND per-payline contribution must be ≈0.86, requiring p≈0.195 (weight≈23.4) not 0.25 (weight 30). Self-consistency: forward(p=0.195)≈0.87≈backward target ✓ — formula is sound. The documented DIAMOND weight of 30 or these multipliers (or both) must be reduced; their combination violates the arbitrated 95% RTP contract. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout; slot-machine payouts must round down so the house retains fractional remainders. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Throw an error when bet > 100, consistent with the arbitrated 1..100 integer contract and the existing throws for bet < 1 and non-integer inputs. [L118]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with crypto.getRandomValues() (Node.js built-in) to produce auditable, certifiable random draws required for regulated casino gaming RNG. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with a CSPRNG draw (e.g. crypto.getRandomValues() scaled to [0, totalWeight)) to satisfy regulated gaming RNG certification requirements. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` in computePayout so the house edge reduces payout to ~95% RTP instead of inflating it above 100%. [L105]
- [ ] <!-- ACT-df0e0f-1 --> **[correction · high · large]** `src/paytable.ts`: Reduce DIAMOND paytable entries [50, 250, 1000] or coordinate with reels.ts to reduce DIAMOND weight (30→~23) so the system achieves ~95% RTP. With p=0.25, DIAMOND alone contributes ~229.5% RTP; full paytable implies ~238%. [L11]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight in DEFAULT_WEIGHTS from 30 to approximately 10–14. At weight 30 (P=25%), DIAMOND alone yields ~229% expected return per line bet. A weight of ~12 (P=10%) constrains DIAMOND's EV to ~7.8% of line bet, leaving the remaining ~87% budget for all other symbols to reach the 95% RTP target. [L14]
