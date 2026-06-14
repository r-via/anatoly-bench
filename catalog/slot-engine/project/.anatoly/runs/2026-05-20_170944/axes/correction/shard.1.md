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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 82% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 90% | Forward: code applies total × 1.05, increasing payouts 5% above raw line wins. Backward: RTP=95% requires total × 0.95 (i.e. 1 − HOUSE_EDGE). Sanity: backward(0.95) → forward(0.95) = 95% ✓ formula consistent. Current factor 1.05 opposes the house edge — effective RTP exceeds 100% rather than targeting 95%, violating the arbitrated RTP contract. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 90% | Slot-machine convention: fractional coins go to the house (Math.floor). Math.ceil awards fractional coins to the player, further inflating RTP above the 95% target. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | Arbitrated intent: Bet = 1..100 coins, integer. bet > 100 must throw (same guard as bet < 1), not warn. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 75% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex < 0 or >= 5; pickFromWeighted then calls undefined.reduce(), throwing TypeError at runtime on an exported public function. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 75% | REEL_WEIGHTS[reelIndex] for index outside [0,4] returns undefined; TypeScript declares the return type as number[], so callers get no compile-time or runtime error before attempting to use the result (e.g., calling .reduce on undefined). |

### `src/paytable.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `PAY_TABLE` | L11 | 🟡 NEEDS_FIX | 60% | Forward: P(DIAMOND per cell) = 30/120 = 0.25; P(5×DIAMOND per payline) = 0.25^5 = 1/1024 ≈ 9.77e-4; 5×DIAMOND payout = 1000 × lineBet = 1000 × (bet/10) = 100×bet; expected contribution per payline = 9.77e-4 × 100×bet ≈ 0.0977×bet; × 10 paylines ≈ 0.977×bet. That single win type delivers ~97.7% RTP before counting 3× and 4× DIAMOND wins (which add roughly +0.55×bet and +0.69×bet respectively) or any other symbol wins — implying total RTP >> 200%. Backward: to hold 5×DIAMOND contribution to ≤40% of the 95% budget (0.38×bet across 10 paylines): 10 × P(DIAMOND)^5 × M5 × 0.1 = 0.38 → with P=0.25 → M5 ≤ ~390; or keeping M5=1000 → P(DIAMOND) ≤ 0.21 → weight ≤ 25. Sanity: backward(weight=25, M5=1000) → 10 × 0.2083^5 × 100 ≈ 0.40×bet ✓ formula self-consistent. Current weight=30 with M5=1000 is ~2.6× over budget for this single win type. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Add bet > 100 to the validation guard and throw instead of console.warn to enforce the 1..100 integer contract. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Apply Math.floor to the return value so fractional coin payouts are truncated toward zero (house keeps remainder), satisfying the slot-machine whole-coin invariant for all valid bets 1..100. [L22]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add bounds guard in spinReel: throw RangeError (or clamp) when reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length. [L44]
- [ ] <!-- ACT-83e35f-4 --> **[correction · medium · small]** `src/reels.ts`: Add bounds guard in getReelWeights and return a shallow copy (spread or slice) to prevent silent undefined propagation and enforce the documented read-only contract. [L57]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) so the house edge reduces payouts toward 95% RTP instead of inflating them above 100%. [L105]
- [ ] <!-- ACT-df0e0f-1 --> **[correction · high · large]** `src/paytable.ts`: Recalibrate DIAMOND multipliers [50, 250, 1000] at L11: the 5× entry alone contributes ~97.7% RTP across 10 paylines given reel weight 30/120. Either reduce M5 to ≤390 (keeping weight=30) or coordinate with src/reels.ts to lower DIAMOND weight to ≤25. All three multipliers likely need proportional reduction since 3× and 4× DIAMOND add a further ~120%+ to the implied RTP. [L11]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to approximately 3–5; current value causes 5-DIAMOND combinations alone to return ~97.7% of total bet, violating the 95% RTP target. [L14]
- [ ] <!-- ACT-83e35f-2 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() with crypto.getRandomValues() or equivalent certifiable CSPRNG to satisfy regulated gaming RNG requirements. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a CSPRNG source (e.g. crypto.getRandomValues on a Uint32Array, normalised to [0,1)) to make weightedPick certifiable for regulated gaming use. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-2 --> **[correction · low · trivial]** `src/engine.ts`: Replace Math.ceil with Math.floor so fractional coins go to the house per casino convention. [L110]
