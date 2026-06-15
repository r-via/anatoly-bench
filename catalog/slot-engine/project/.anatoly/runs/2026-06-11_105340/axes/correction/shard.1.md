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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 91% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | Forward: total * (1 + 0.05) = total * 1.05 — multiplies payout UP by 5%, yielding ~105% RTP. Backward: target RTP 95% requires total * (1 - HOUSE_EDGE) = total * 0.95. Sanity: forward(0.95) → 0.95 ✓ formula consistent. Conclusion: (1 + HOUSE_EDGE) is a sign inversion; must be (1 - HOUSE_EDGE). Contradicts arbitrated intent: 'The engine targets a theoretical RTP of 95%'. |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 88% | Math.ceil rounds payout UP, giving fractional remainders to the player. Slot-machine industry convention (inferred domain from reel/payline/jackpot/DIAMOND vocabulary): payouts must round DOWN — house retains the remainder. With the bet*0.01 floor, Math.ceil(0.01) = 1 for bet=1, returning 100× the intended floor and systematically inflating effective RTP above target. Fix: Math.floor. |
| `spin` | L118 | 🟡 NEEDS_FIX | 92% | if (bet > 100) console.warn(...) silently allows over-limit bets to proceed. Arbitrated intent: 'type Bet = number; // 1..100 coins, integer'. Must throw (matching the pattern on L114) to enforce the upper bound. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor: slot-machine payouts must round down so the house retains fractional remainders; Math.ceil currently inflates every payout. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Replace `console.warn` with a throw when bet > 100, enforcing the arbitrated 1..100 integer range consistently with the lower-bound check on L114. [L118]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace `Math.random()` with `crypto.getRandomValues()` (e.g., `const buf = new Uint32Array(1); crypto.getRandomValues(buf); const roll = (buf[0] / 0x100000000) * totalWeight;`) to produce an auditable, certifiable entropy source required for regulated gaming RNG. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to deduct the 5% house edge rather than add it, achieving the documented 95% RTP target. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with crypto.getRandomValues (or a seeded, auditable CSPRNG) to satisfy regulated gaming RNG certification requirements. Math.random() is non-reproducible and non-auditable. [L32]
