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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 88% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srcstrategyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | Multiplies total by (1 + HOUSE_EDGE) = 1.05, inflating winning payouts by 5% rather than reducing them. Forward: raw total × 1.05 → implied RTP > 100% on winning spins. Backward: arbitrated RTP target = 95% requires raw total × (1 − 0.05) = × 0.95. Sanity: forward(0.95) = 95% ✓ — formula is self-consistent, confirming the sign is wrong in the code. Must be (1 − HOUSE_EDGE). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil rounds payout up, awarding fractional credits to the player. Slot-machine industry convention (inferred from reel/payline/lineBet/jackpot vocabulary throughout) requires Math.floor so the house retains the remainder. |
| `spin` | L118 | 🟡 NEEDS_FIX | 80% | console.warn for bet > 100 does not enforce the documented range. The arbitrated Bet type comment (README.md) states valid bets are integers in [1, 100]; values above 100 should throw identically to values below 1 on line 114–115. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L14 | 🟡 NEEDS_FIX | 92% | Forward derivation: P(DIAMOND/cell) = 30/120 = 0.25. Expected payout per payline from DIAMOND matches alone: 0.25^5 × 1000 + 0.25^4 × 0.75 × 250 + 0.25^3 × 0.75 × 50 = 0.977 + 0.732 + 0.586 = 2.295 × line_bet. With 10 paylines (implied by the per-line-bet formula bet/10 in the API ref) and line_bet = total_bet/10, total expected DIAMOND return = 10 × 2.295 × (total_bet/10) = 2.295 × total_bet → 229.5% RTP from DIAMOND alone. Adding CHERRY (≈2.3%), LEMON (≈2.3%), BELL (≈1.6%), BAR (≈0.7%), SEVEN (≈0.2%), and wild-boost contributions puts aggregate implied RTP ≈ 237%, more than 2× the arbitrated 95% target. Backward: for 95% total RTP, the DIAMOND 5-of-a-kind contribution per payline must be well under 0.05 × line_bet; at weight W (total ≈ 90+W) that requires (W/(90+W))^5 × 1000 < 0.5, which limits W to roughly ≤ 20. Sanity: forward(W=20) ≈ (20/110)^5 × 1000 ≈ 0.028, consistent. DIAMOND: 30 violates the arbitrated 95% RTP target by an order of magnitude. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor so fractional credits round down to the house, per slot-machine industry convention. [L110]
- [ ] <!-- ACT-e0699c-1 --> **[correction · medium · small]** `src/strategy.ts`: Replace the 0.8 payout multiplier with a value that preserves the 95% RTP arbitrated contract, or document an explicit dispensation from that contract for this strategy variant. [L17]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change (1 + HOUSE_EDGE) to (1 - HOUSE_EDGE) so winning payouts are reduced by 5%, matching the arbitrated 95% RTP target. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to a value ≤ 20 (e.g. 3–5, matching SEVEN/WILD/SCATTER tier) so that the implied RTP from DIAMOND matches alone stays within the 95% target budget. Alternatively, revisit the DIAMOND paytable multipliers in src/paytable.ts in coordination with this weight change. Either adjustment must be validated end-to-end against the engine's full RTP calculation. [L14]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Throw an error (matching the pattern on line 114) when bet > 100 to enforce the documented 1..100 integer range on Bet. [L118]
