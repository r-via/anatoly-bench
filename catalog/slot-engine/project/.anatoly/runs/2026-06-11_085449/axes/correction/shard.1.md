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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 85% | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | total * (1 + HOUSE_EDGE) multiplies by 1.05, boosting payouts 5% above base rather than reducing them. For 95% RTP the factor must be (1 - HOUSE_EDGE) = 0.95. Forward: current code yields payout > base → implied RTP > 100%. Backward: target 95% RTP requires factor 0.95. Sanity: 0.95 applied to a base that sums to ~100% of bet → ~95% ✓. Arbitrated intent confirms 95% RTP target. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil rounds the payout up, handing the fractional remainder to the player. Slot-machine industry convention (inferred from reel/payline/jackpot/paytable vocabulary throughout the project) requires Math.floor so the house retains the fraction. |
| `spin` | L115 | 🟡 NEEDS_FIX | 90% | throw "invalid bet" throws a string literal rather than an Error. Callers (src/index.ts) receive a value with no .message, no .stack, and failing instanceof Error checks, breaking standard error handling. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | bet > 100 emits only console.warn and lets the spin proceed. Arbitrated contract states valid bets are 1..100 integers; bets above 100 must be rejected with a throw, not silently accepted. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L14 | 🟡 NEEDS_FIX | 60% | Forward derivation (per-payline, payline-count-independent since per-line bet = bet/N cancels with N paylines): 3×D = (0.25)^3×0.75×50 ≈ 58.6% RTP; 4×D = (0.25)^4×0.75×250 ≈ 73.2% RTP; 5×D = (0.25)^5×1000 ≈ 97.7% RTP. DIAMOND alone ≈ 229.5% — before any other symbol wins. Backward: for DIAMOND total ≤ 50% budget within 95% target, solving (w/120)^3×0.75×50+(w/120)^4×0.75×250+(w/120)^5×1000 ≤ 0.50 gives w ≤ ~5–7. Sanity: forward(w=5) → DIAMOND total ≈ 0.3% RTP, leaves ample room for other symbols to reach ~95%. Consistent. Conclusion: w=30 is ~4–6× too large; total RTP >> 100%. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 85% | Domain inferred from reference docs (reels, paytable, DIAMOND/WILD/SCATTER symbols, RTP=95%, free spins, jackpot) and confirmed by the JSDoc's own claim 'suitable for gaming RNG applications'. Math.random() in V8 is xorshift128+, which is neither cryptographically secure nor certifiable under gaming regulations (GLI/BMM). It can be seeded and predicted. Replace with crypto.getRandomValues() or a regulatory-approved PRNG to produce a value in [0, totalWeight). |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor; slot-machine payouts must round down so the house retains the fractional remainder. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Add `|| bet > 100` to the existing throw condition (or throw separately after the warn) to reject bets outside the arbitrated 1..100 range. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `multiplier * lineBet` with `Math.floor(multiplier * bet / 10)` to eliminate IEEE 754 imprecision and enforce slot-domain round-down rule on fractional payouts. [L23]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certified, auditable PRNG (e.g. a seeded Mersenne Twister or a crypto-module-backed generator) to satisfy regulated-gaming RNG auditability requirements. [L33]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` so the house edge reduces payouts to the documented 95% RTP target. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to ~3–7 (e.g. 5). At w=30, DIAMOND win combinations alone contribute ~229% expected payout per bet; total RTP >> 100%, violating the arbitrated 95% RTP target. Backward derivation puts the ceiling around w=5–7 to leave room for all other symbols to reach ~95% combined. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues()-based draw (e.g. read a Uint32 from crypto.getRandomValues, divide by 2^32) so the RNG is cryptographically unpredictable and can satisfy gaming-regulator certification requirements. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to propagate a proper Error with stack trace and instanceof support. [L115]
