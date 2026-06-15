[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 2 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 80% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🔴 ERROR | 95% | Forward: `total * (1 + 0.05) = total * 1.05` → the house pays out 5% MORE than it receives → RTP > 100%. Backward: target RTP 95% requires `total * (1 − 0.05) = total * 0.95`. Sanity: `total * 0.95` → 95% RTP ✓ — formula is internally consistent. Current code contradicts the arbitrated RTP = 95% target by the wrong sign on HOUSE_EDGE; must be `total * (1 − HOUSE_EDGE)`. |
| `computePayout` | L110 | 🔴 ERROR | 95% | Slot-machine domain: payout rounding must use Math.floor so the house retains fractional credits. Math.ceil rounds up, gifting the player the remainder and eroding the house edge on every winning spin. |
| `spin` | L118 | 🟡 NEEDS_FIX | 92% | `if (bet > 100) console.warn('bet exceeds maximum')` does not throw. The arbitrated contract (`type Bet = number; // 1..100 coins, integer`) makes bet > 100 invalid. The lower-bound guard on L114–116 correctly throws; the upper-bound guard must do the same. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 85% | Inferred slot-machine domain from reels/paytable/jackpot/scatter/wild vocabulary in reference docs. Math.random() is backed by an unseeded, non-auditable PRNG (V8's xorshift128+). Regulated gaming jurisdictions require a certifiable, independently auditable RNG (e.g. a CSPRNG such as crypto.getRandomValues). The JSDoc on L2 explicitly claims this is 'suitable for gaming RNG applications', making the mismatch a correctness defect, not a style preference. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: In computePayout L110, replace Math.ceil with Math.floor so fractional credits are retained by the house, consistent with slot-machine payout rounding convention. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: In spin L118, replace `console.warn('bet exceeds maximum')` with `throw 'invalid bet'` (or a proper Error) to enforce the documented upper bound of 100 coins. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the return expression with Math.floor: `return Math.floor(multiplier * lineBet);` — slot-machine payouts must be integer coins and rounding must favour the house. [L23]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout L105, replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to reduce the payout by 5% and achieve the documented 95% RTP instead of paying out >100%. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certifiable, auditable PRNG (e.g., a seeded crypto-quality generator or a gaming-certified RNG library). Math.random() is non-certifiable for regulated slot machine software. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a CSPRNG-based draw (e.g. crypto.getRandomValues with a BigInt or typed-array approach) so the RNG meets certifiable-gaming requirements stated in the JSDoc. [L7]
