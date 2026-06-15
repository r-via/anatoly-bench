[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 85% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 85% | Forward: raw payout P → P * (1 + 0.05) = P * 1.05; player receives more than P, RTP > 100%. Backward: 95% RTP target requires P * (1 - 0.05) = P * 0.95. Sanity: forward(0.95) = 0.9975 ≠ 1.0 — derivations are opposed, not degenerate; formula is wrong. Fix: `(1 + HOUSE_EDGE)` → `(1 - HOUSE_EDGE)`. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 85% | Math.ceil rounds fractional credits UP, giving the player the rounding benefit. Slot-machine industry standard (inferred from gambling domain: reel/payline/jackpot/lineBet vocabulary) requires Math.floor so the house retains any sub-credit remainder. |
| `spin` | L118 | 🟡 NEEDS_FIX | 92% | Arbitrated intent: `type Bet = number; // 1..100 coins, integer`. The lower-bound check at L114 throws; the upper-bound check here only warns. Both paths should throw the same error to make the range symmetric. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 NEEDS_FIX | 90% | DIAMOND weight 30 → P=0.25/cell. Left-to-right payline contribution: 3-match = 0.25³×0.75×50 = 0.586; 4-match = 0.25⁴×0.75×250 = 0.732; 5-match = 0.25⁵×1000 = 0.977 → total ≈ 2.295 (229.5% RTP) from DIAMOND alone, before all other symbols, WILDs, and free spins. Backward: weight ~5 → P≈0.042 → DIAMOND contribution ≈0.43%, leaving headroom for other symbols to sum toward 95%. Sanity: forward(weight 5) ≈ 0.43% ✓ formula consistent. Arbitrated intent (README.md): RTP = 95%. DIAMOND at weight 30 violates this target by more than an order of magnitude. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout: slot-machine convention requires rounding down so the house retains fractional-credit remainders. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace `console.warn` with a throw (matching the lower-bound error) in spin() when bet > 100 to enforce the arbitrated upper bound. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the final return value with Math.floor(): `return Math.floor(multiplier * lineBet);`. This ensures integer coin payouts and keeps fractional remainders on the house side, consistent with regulated slot-machine payout conventions. [L23]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues() (or a certified PRNG seeded from it) to meet regulated gaming RNG requirements. Update the JSDoc accordingly. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `(1 + HOUSE_EDGE)` to `(1 - HOUSE_EDGE)` in computePayout so the house edge reduces payouts by 5%, targeting the arbitrated 95% RTP instead of inflating it above 100%. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to a value consistent with the 95% RTP target. At weight 30, DIAMOND alone contributes ~230% RTP per payline. A full actuarial model is needed for the exact value, but order-of-magnitude correction requires bringing DIAMOND weight into single digits (e.g., ~5). [L14]
- [ ] <!-- ACT-83e35f-2 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() with crypto.getRandomValues (normalized to [0,1) Float64) to meet regulated gaming certification requirements (GLI-11, BMM, etc.). [L32]
