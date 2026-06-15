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
| `src/engine.ts` | 🔴 CRITICAL | 2 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcstrategyts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 85% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🔴 ERROR | 92% | Forward: total × (1 + 0.05) = total × 1.05 → payout exceeds raw line-win sum → implied RTP > 100%. Backward: target RTP 95% requires total × (1 − 0.05) = total × 0.95, i.e. formula must be `total * (1 - HOUSE_EDGE)`. Sanity: (1 − 0.05) = 0.95 ✓. Current code inverts the house edge, directly violating the arbitrated RTP=95% target. |
| `computePayout` | L101 | 🔴 ERROR | 92% | bet typed as any; a non-number caller yields NaN from `bet * 0.01`, silently corrupting total. Should be `Bet` or `number`. |
| `spin` | L113 | 🟡 NEEDS_FIX | 90% | bet typed as any contradicts the arbitrated API contract `function spin(bet: Bet): SpinResult`; runtime validation on lines 114–116 catches the obvious cases but the type-system protection is missing for all callers. |
| `spin` | L120–L122 | 🟡 NEEDS_FIX | 90% | rng (line 120) and reelsModule (line 122) are resolved from the container but never passed to factory.buildReels or used anywhere; reels are built by StandardReelBuilderFactory without the injected RNG or reel-weight data, potentially bypassing the configured dependencies entirely. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 65% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex < 0 or >= 5; the result is passed directly to pickFromWeighted, which calls wts.reduce() and crashes with TypeError. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 60% | REEL_WEIGHTS[reelIndex] is undefined for invalid indices; TypeScript types the return as number[] but runtime produces undefined, shifting the crash to the caller. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Either inject rng and reelsModule into StandardReelBuilderFactory.buildReels so the container-configured dependencies are actually used, or remove the dead container.resolve calls on lines 120 and 122. [L120]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the return expression in Math.floor(): `return Math.floor(multiplier * lineBet);` to ensure integer credit payouts and correct house-edge rounding for all bet values not divisible by 10. [L23]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Add bounds check in spinReel: if reelIndex < 0 or reelIndex >= REEL_WEIGHTS.length, throw RangeError before accessing REEL_WEIGHTS[reelIndex]. [L44]
- [ ] <!-- ACT-e0699c-1 --> **[correction · medium · small]** `src/strategy.ts`: ConservativeStrategy's 0.8 multiplier drops effective RTP from the documented 95% to ≈76%. If a lower-RTP mode is intentional it must be explicitly reconciled with the arbitrated 95% RTP invariant; otherwise remove or adjust the multiplier so payout reduction stays within the documented 5% house edge. [L17]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout line 105, replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to apply a 5% deduction and achieve the documented 95% RTP target. [L105]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Change `bet: any` to `bet: Bet` (or `number`) in spin's signature to match the arbitrated API contract. [L113]
- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Change `bet: any` to `bet: number` in computePayout to prevent silent NaN propagation from non-numeric inputs. [L101]
- [ ] <!-- ACT-83e35f-2 --> **[correction · low · trivial]** `src/reels.ts`: Add bounds check in getReelWeights: if reelIndex < 0 or reelIndex >= REEL_WEIGHTS.length, throw RangeError to match the declared number[] return type. [L57]
