[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 2 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 80% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🔴 ERROR | 92% | total * (1 + HOUSE_EDGE) multiplies by 1.05, increasing player payout by 5% and producing an implied RTP > 100%. Forward: raw wins × 1.05 → RTP exceeds 100%. Backward: target RTP 95% requires multiplier 0.95 = (1 − HOUSE_EDGE). Sanity: (1 − 0.05) applied to forward base → 95% ✓. Fix: change to total * (1 − HOUSE_EDGE). |
| `computePayout` | L110 | 🔴 ERROR | 92% | Math.ceil rounds payout UP; regulated slot-machine domain requires Math.floor — the house keeps the fractional remainder. Math.ceil transfers that remainder to the player on every winning spin. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | console.warn for bet > 100 silently accepts out-of-range bets. Arbitrated intent specifies Bet = 1..100 integer; values above 100 must be rejected with a thrown error, consistent with the < 1 / non-integer check on line 114. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L14 | 🟡 NEEDS_FIX | 85% | Forward: p_DIAMOND = 30/120 = 0.25. Per-payline EV (best-win, left-to-right) = 0.25^5×1000 + 0.25^4×0.75×250 + 0.25^3×0.75×50 = 1000/1024 + 750/1024 + 600/1024 = 2350/1024 ≈ 2.295× per-line bet (229.5% from DIAMOND alone, before all other symbols, wilds, and free spins). Backward: to keep DIAMOND contribution below 100% of per-line bet, need p ≤ 0.20 (weight ≤ 24); check: forward(p=0.20) = 0.20^5×1000 + 0.20^4×0.8×250 + 0.20^3×0.8×50 = 0.32+0.32+0.32 = 0.96 ✓. Sanity holds. At weight 30, DIAMOND alone exceeds 200% EV per payline, so overall RTP is far above 100%, directly contradicting the arbitrated 95% target. |

### `src/paytable.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `PAY_TABLE` | L11 | 🟡 NEEDS_FIX | 60% | Forward: p_DIAMOND=30/120=0.25, p_WILD=5/120≈0.0417; P(5-of-a-kind DIAMOND\|WILD on one payline)=(35/120)^5≈0.002111; payout=1000×lineBet=1000×(bet/10)=100×bet; E[return, 10 paylines]=10×0.002111×100×bet=2.111×bet → implied RTP ≥211% from this combo alone (lower bound: wild bonus amplifies further). Backward: for DIAMOND 5-of-a-kind to equal the entire 95% budget: (w_D+w_W)^5×1000=0.95 → (w_D+w_W)=0.00095^(1/5)≈0.247, weight≈29.7/120. Sanity: forward(29.7/120)=(0.2475)^5×1000≈0.000929×1000=0.929→92.9% ✓ formula consistent. Conclusion: documented weight 35/120 vs needed ≈30/120 to stay within budget; with 35, DIAMOND 5-of-a-kind alone yields >200% RTP, meaning total RTP far exceeds 100%. Either DIAMOND[2] must be reduced below 1000× or the DIAMOND reel weight (30 in reels.ts) must be lowered. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 85% | Inferred slot-machine domain from CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER vocabulary in reference docs and the file's own JSDoc ('suitable for gaming RNG applications'). Math.random() is a non-seeded PRNG (V8 uses xorshift128+) — it is not certifiable under any major gaming-lab standard (GLI, BMM, iTech). Regulated gaming RNG must use a CSRNG (e.g. crypto.getRandomValues()) or a certified hardware source. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout; slot-machine payouts round down so the house retains the fractional remainder. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace `console.warn` with `throw new Error('invalid bet')` for bet > 100 to enforce the arbitrated 1..100 range contract. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Apply Math.floor to the return value so payout is an integer number of coins (house keeps fractional remainder), satisfying regulated slot-machine rounding conventions. [L23]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certifiable CSPRNG (e.g., crypto.getRandomValues) to meet regulated gaming RNG certification requirements. [L33]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues()-based uniform draw to satisfy gaming-lab certifiability requirements (GLI-11, BMM, iTech). Pattern: const buf = new Uint32Array(1); crypto.getRandomValues(buf); const roll = (buf[0] / 0x100000000) * totalWeight; [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` in computePayout to reduce payouts by 5% and achieve ~95% RTP instead of ~105%. [L105]
- [ ] <!-- ACT-df0e0f-1 --> **[correction · high · large]** `src/paytable.ts`: Reduce DIAMOND[2] (5-of-a-kind multiplier) from 1000× to a value consistent with 95% RTP, or lower DIAMOND reel weight in reels.ts. Current combination yields E[DIAMOND 5-of-a-kind across 10 paylines] ≈ 211% of bet, exhausting the entire RTP budget before any other symbol or bonus contributes. [L11]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Significantly reduce DIAMOND weight from 30. At weight 30 (p=0.25), DIAMOND alone contributes 2.295× per-line bet in expected value (229.5%), making overall RTP >> 100% and incompatible with the arbitrated 95% target. Backward derivation: weight must be ≤ 24 (p ≤ 0.20) for DIAMOND to stay below 100% EV by itself; typical premium-symbol contribution in a 95% RTP game suggests weight in the 14–20 range, validated against full engine simulation. [L14]
