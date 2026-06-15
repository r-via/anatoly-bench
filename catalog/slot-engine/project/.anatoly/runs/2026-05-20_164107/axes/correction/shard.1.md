[← Back to Correction](./index.md) · [← Back to report](../../public_report.md)

# 🐛 Correction — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Correction | Conf. | Details |
|------|---------|------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 93% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 85% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 85% | Forward: winning total × (1 + 0.05) = total × 1.05 — increases player payout by 5%, implying RTP > 100%. Backward: 95% RTP target requires total × (1 − HOUSE_EDGE) = total × 0.95. Sanity: forward(factor=0.95) → 95% ✓ formula consistent. The sign is inverted; fix: replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE). |
| `computePayout` | L110 | 🟡 NEEDS_FIX | 85% | Math.ceil rounds payout UP, awarding fractional credits to the player. Regulated slot-machine convention (inferred from reel/payline/jackpot/SCATTER vocabulary): always round DOWN with Math.floor so the house retains the remainder. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | bet > 100 should throw like the lower-bound check on line 114. Only console.warn allows an out-of-range bet to proceed, violating the arbitrated contract 'type Bet = number; // 1..100 coins, integer'. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS[reelIndex] returns undefined for any reelIndex outside [0, 4]. pickFromWeighted then calls undefined.reduce(), throwing TypeError. No bounds guard is present for an exported function that accepts arbitrary number. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 88% | Reference docs state 'Weights are read-only at runtime — there is no setter.' Returning REEL_WEIGHTS[reelIndex] directly lets any caller do getReelWeights(0)[5] = 9999, which mutates the shared REEL_WEIGHTS entry and skews all future pickFromWeighted calls on that reel. Should return a copy (e.g. [...REEL_WEIGHTS[reelIndex]]). |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout to round slot payouts down per regulated gaming convention (house retains fractional remainder). [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Throw an error when bet > 100 to enforce the upper bound of the arbitrated 1..100 coin constraint, consistent with the existing lower-bound throw. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the return expression with Math.floor(): `return Math.floor(multiplier * lineBet)` to ensure whole-coin payouts when bet is not divisible by 10. [L23]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds check in spinReel: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw a RangeError with a descriptive message instead of propagating a cryptic TypeError. [L44]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Return a shallow copy in getReelWeights (return [...REEL_WEIGHTS[reelIndex]]) to enforce the documented read-only contract and prevent external mutation of internal state. [L57]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so winning payouts are reduced by 5%, achieving the targeted 95% RTP instead of boosting RTP above 100%. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() with a certifiable RNG (e.g. a seeded CSRNG from the Web Crypto API or a GLI-approved library) to meet regulated gaming requirements. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a certified CSPRNG (e.g. crypto.getRandomValues / webcrypto) to meet regulated gaming RNG certification requirements. [L7]
