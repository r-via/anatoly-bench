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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 92% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 75% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 85% | HOUSE_EDGE applied as `total * (1 + HOUSE_EDGE)` = ×1.05, which INCREASES player payouts by 5%. Forward: winning spins return more than their raw paytable value — the engine gives away the 5% rather than retaining it, producing effective RTP > 100% on any winning spin. Backward: a 5% house edge requires `total * (1 - HOUSE_EDGE)` = ×0.95. Sanity: 1 − 0.05 = 0.95; forward(×0.95) = 5% reduction ✓ — formula is consistent, current constant sign is inverted. Contradicts arbitrated intent: 'The engine targets a theoretical RTP of 95%. Long-run player return approximates the bet-weighted house edge of 5%.' |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 85% | Math.ceil rounds fractional payouts UP, giving players residual fractions. Inferred slot-machine domain (reel/payline/jackpot/scatter/WILD vocabulary). Industry convention: Math.floor — the house retains fractional coins. Using ceil further erodes the house edge on every non-integer payout. |
| `spin` | L118 | 🟡 NEEDS_FIX | 92% | `if (bet > 100) console.warn('bet exceeds maximum')` accepts out-of-range bets. Arbitrated intent fixes Bet as `1..100 coins, integer`; values above 100 must be rejected via throw, consistent with the `bet < 1` guard on line 114. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: In computePayout, replace Math.ceil with Math.floor so the house retains fractional coins per slot-machine industry convention. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: In spin, replace `console.warn('bet exceeds maximum')` with `throw new Error('bet exceeds maximum')` to enforce the upper bound of 100 coins per the arbitrated Bet contract, consistent with the bet < 1 guard above it. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `multiplier * (bet / 10)` with integer-safe arithmetic: `Math.floor(multiplier * bet / 10)` (or require bet is a multiple of 10 and assert it). Floating-point division of integer coin values is not acceptable in regulated gambling payout paths. [L22]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with a cryptographically secure random source (e.g. crypto.getRandomValues()) to produce a certifiable uniform draw required for regulated gaming RNG. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout, change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so winning payouts are reduced by 5%, achieving the documented 95% RTP / 5% house-edge contract. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a cryptographically-auditable RNG (e.g., crypto.getRandomValues() mapped to [0,1)) to satisfy regulated gaming RNG requirements (GLI-11 / eCOGRA equivalents). Math.random()'s implementation is non-deterministically seeded and non-auditable, which disqualifies it from certified slot-machine deployments. [L33]
