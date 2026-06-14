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
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | total * (1 + HOUSE_EDGE) = total * 1.05 gives the player a 5% bonus on wins rather than applying a 5% house take. Forward: raw win W → player receives 1.05W, implying RTP > 100%. Backward: to hit the documented 95% RTP target the factor must be (1 - HOUSE_EDGE) = 0.95 → player receives 0.95W. Sanity: forward(factor=0.95) = 95% ✓ — formula is consistent, sign is wrong. Fix: change (1 + HOUSE_EDGE) to (1 - HOUSE_EDGE). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil always rounds the payout up to the next integer, giving the player the remainder. Slot-machine domain convention requires Math.floor so the house retains the fractional remainder. This compounds the RTP overshoot from the wrong house-edge sign. |
| `spin` | L118 | 🟡 NEEDS_FIX | 92% | bet > 100 emits console.warn and continues. Arbitrated intent states Bet range is 1..100 coins; values above 100 must be rejected with throw, consistent with the lower-bound check at line 114 that throws for bet < 1. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L14 | 🟡 NEEDS_FIX | 60% | Forward derivation — DIAMOND at 30/120 = 0.25 per cell. On a single 5-cell payline, using left-to-right longest-run rules: P(exactly 3) = 0.25^3 × 0.75 ≈ 0.01172, pays 50×; P(exactly 4) = 0.25^4 × 0.75 ≈ 0.00293, pays 250×; P(exactly 5) = 0.25^5 ≈ 0.000977, pays 1000×. DIAMOND contribution per line bet = 0.01172×50 + 0.00293×250 + 0.000977×1000 = 0.586 + 0.733 + 0.977 ≈ 2.30 (230% of line bet from DIAMOND alone). Backward derivation — for 95% total RTP, DIAMOND's share of return should be well under 95% of the total. At weight=10 (p≈0.083): contribution ≈ 0.000579×50 + 0.0000482×250 + 0.000004×1000 ≈ 0.042 (4.2% per line); at weight=5 (p≈0.042): ≈ 0.005% per line. Sanity: forward(weight=10)≈4.2% → consistent with backward target; formula is self-consistent. Conclusion: weight=30 is off by roughly an order of magnitude vs. weight≈5–10 needed for a house edge. DIAMOND alone contributes ≈230% of line bet, making total RTP >> 100% before any other symbol, WILD, or free-spin contribution is counted. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so the house retains the fractional remainder, consistent with slot-machine industry convention and the 95% RTP target. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace `console.warn("bet exceeds maximum")` with a throw (matching the lower-bound guard) to enforce the documented upper bound of 100 coins. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `const lineBet = bet / 10; return multiplier * lineBet;` with `return (multiplier * bet) / 10;` to avoid the imprecise IEEE 754 intermediate when `bet` is not a multiple of 10. For a fully exact solution, track all payouts in integer 1/10-coin units to eliminate floating-point division entirely. [L22]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a cryptographically-secure or independently-certified PRNG (e.g. a seeded CSPRNG from a regulated gaming library). Math.random() is non-deterministic-seed pseudorandom and fails certifiability requirements for regulated slot RNG. [L34]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with a crypto.getRandomValues-based uniform draw. Use rejection sampling on a Uint32 to avoid modulo bias. This is required for regulated gaming certification (GLI-11 / BMM / iTech standards prohibit non-cryptographic PRNGs). [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so wins are reduced by 5%, targeting the documented RTP of 95% instead of boosting payouts to >100% RTP. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight in DEFAULT_WEIGHTS from 30 to approximately 5–10 (matching documented ~4.2% probability or similar) to bring implied RTP in line with the arbitrated 95% target. At weight=30 (25% per cell), DIAMOND alone contributes ~230% of line bet in expected return, making the total RTP >> 100%. [L14]
