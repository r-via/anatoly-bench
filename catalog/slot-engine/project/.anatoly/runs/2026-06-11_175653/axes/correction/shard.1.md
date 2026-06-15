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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | Forward: total * (1 + 0.05) = total * 1.05 — increases line-win payouts by 5%, pushing implied RTP above the base paytable RTP, well above the 95% target. Backward: RTP 95% requires total * (1 − HOUSE_EDGE) = total * 0.95. Sanity: forward(0.95) → 95% ✓ — formula is consistent. Current `(1 + HOUSE_EDGE)` inverts the house edge; must be `(1 - HOUSE_EDGE)`. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil rounds fractional credits UP, transferring the remainder to the player. Regulated slot-machine convention: round DOWN with Math.floor so the house retains the sub-credit remainder. |
| `spin` | L118 | 🟡 NEEDS_FIX | 92% | Arbitrated intent: valid bet is 1..100 integer. `if (bet > 100) console.warn(...)` lets the spin continue with an out-of-range bet. The guard on L114–L116 throws for the lower-bound and non-integer cases; the upper-bound check must throw as well. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L13–L14 | 🟡 NEEDS_FIX | 95% | Forward: P(cell=DIAMOND)=30/120=0.25. Per-payline EV from DIAMOND alone: P(5D)×1000 + P(4D,not5)×250 + P(3D,not4+)×50 = 0.25^5×1000 + 0.25^4×0.75×250 + 0.25^3×0.75×50 ≈ 0.977+0.732+0.586 = 2.295× lineBet. DIAMOND alone exceeds 100% RTP per payline. Adding CHERRY, LEMON, BELL, BAR, SEVEN, WILD boost, and free spins pushes total RTP to several hundred percent, violating the arbitrated-intent contract of 95% RTP. Backward: for DIAMOND to contribute ≈5% of the 95% target (0.0475×), need p≈0.108 (weight≈13). Sanity: forward(weight=13, p=0.108) ≈ 0.108^3×0.75×50+0.108^4×0.75×250+0.108^5×1000 ≈ 0.047+0.003+0.001 ≈ 0.051 ✓ formula consistent. Current DIAMOND weight=30 is over 2× the whole RTP budget from one symbol. |

### `src/paytable.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `PAY_TABLE` | L11 | 🟡 NEEDS_FIX | 60% | Forward: P(DIAMOND/cell) = 30/120 = 0.25; P(5-of-a-kind on one payline, pure DIAMOND, no WILDs) = 0.25^5 ≈ 0.000977; RTP contribution across 10 paylines = P × multiplier × (paylines × lineBet/bet) = 0.000977 × 1000 × (10 × 1/10) = 0.977 → 97.7% from this single combination alone, a strict lower bound (WILDs and other combos push it higher). Backward: for DIAMOND 5-of-a-kind to contribute ≤5% RTP, P × M ≤ 0.05 → M ≤ 0.05 / 0.000977 ≈ 51. Sanity: forward(M=51) = 0.000977 × 51 ≈ 5% ✓ — formula self-consistent. Conclusion: the 1000× multiplier for DIAMOND 5-of-a-kind must be reduced to ≈51×, or the DIAMOND reel weight in reels.ts must be reduced from 30 to ≈17 (where (17/120)^5 × 1000 ≈ 5%). A full recalibration across all symbol combinations is required to hit the 95% target. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace `Math.ceil(total)` with `Math.floor(total)`: slot-machine convention rounds fractional credits down, retaining the sub-credit remainder for the house. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Add `if (bet > 100) throw 'invalid bet'` (or fold `bet > 100` into the existing guard on L114) to reject bets exceeding the documented maximum of 100 instead of merely warning. [L118]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the 5% house edge reduces payouts toward the 95% RTP target instead of boosting them above it. [L105]
- [ ] <!-- ACT-df0e0f-1 --> **[correction · high · large]** `src/paytable.ts`: Reduce DIAMOND multipliers from [50, 250, 1000] (e.g. to approximately [3, 15, 51]) so that DIAMOND 5-of-a-kind contributes <5% RTP, leaving budget for other combinations to reach 95% total. Alternatively, reduce DIAMOND reel weight in reels.ts from 30 to ≈17. Full solution requires solving the complete RTP equation across all symbol/count combinations and WILD amplification. [L11]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight in DEFAULT_WEIGHTS from 30 to approximately 3–6 so that DIAMOND's per-payline expected value contribution is consistent with the arbitrated 95% RTP target. At weight=30 (p=0.25), DIAMOND alone contributes ~2.3× lineBet per payline, which is more than twice the entire RTP budget. A weight in the range 3–6 (p≈0.025–0.05) keeps DIAMOND contribution below ~0.01×, leaving headroom for the full symbol set and wild/free-spin bonuses to sum to ≈0.95×. [L14]
