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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 95% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 85% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 90% | total * (1 + HOUSE_EDGE) multiplies by 1.05, increasing player payout rather than applying the house cut. Forward: payout = raw_wins * 1.05 → implied RTP > 100% (house subsidises every win). Backward: 95% RTP requires raw_wins * (1 - 0.05) = raw_wins * 0.95. Sanity: forward(0.95) = raw_wins * 0.95 ✓ formula is consistent; current code uses the wrong sign. Fix: change to total * (1 - HOUSE_EDGE). Contradicts the JSDoc comment ('maintain a target RTP of approximately 95%') and the arbitrated intent (README: engine targets 95% RTP). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 90% | Math.ceil rounds fractional credits up, giving the player remainder credits that belong to the house. Regulated slot-machine industry convention requires Math.floor so the house keeps the fractional remainder. Inferred slot-machine domain from PAYLINES, lineBet, WILD/SCATTER/jackpot vocabulary throughout the file. |
| `spin` | L118 | 🟡 NEEDS_FIX | 92% | console.warn does not reject the bet. Bets above 100 are accepted and processed, violating the arbitrated 1..100 integer range. Should be folded into the existing guard: `if (typeof bet !== 'number' \|\| bet < 1 \|\| bet > 100 \|\| !Number.isInteger(bet)) throw 'invalid bet';`. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Add `bet > 100` to the validation guard in spin() as a thrown error (not a warning) to enforce the arbitrated 1..100 integer range. [L118]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Change Math.ceil to Math.floor in computePayout; slot-machine payouts must round down so the house retains fractional credits. [L110]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `multiplier * lineBet` with `Math.floor(multiplier * bet / 10)` to eliminate floating-point imprecision on non-multiple-of-10 bets and ensure house-down rounding per slot-machine industry convention. [L23]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with a cryptographically secure source (e.g., crypto.getRandomValues() producing a uniform float in [0,1)) to satisfy regulated gaming RNG certification requirements. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` in computePayout so the house edge reduces the player payout to the documented ~95% RTP instead of boosting it above 100%. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with crypto.getRandomValues (or equivalent audited CSPRNG) to satisfy regulated gaming RNG certification requirements. [L32]
