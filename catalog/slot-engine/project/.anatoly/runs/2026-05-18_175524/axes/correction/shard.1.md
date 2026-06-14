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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L106 | 🟡 NEEDS_FIX | 85% | `total * (1 + HOUSE_EDGE)` = ×1.05 inflates the player's payout above raw wins. To deduct a 5% house edge and achieve RTP≈95%, the formula must be `total * (1 - HOUSE_EDGE)` = ×0.95. The JSDoc comment on the function and the arbitrated README intent both state RTP=95%; multiplying by 1.05 violates this in the wrong direction. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L43–L50 | 🟡 NEEDS_FIX | 75% | No bounds check on reelIndex: REEL_WEIGHTS[reelIndex] yields undefined for any reelIndex outside [0, 4], causing pickFromWeighted to throw a TypeError on wts.reduce() at runtime. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 88% | Uses Math.random(), which is not a certifiable PRNG. The file comment explicitly labels this 'suitable for gaming RNG applications' and the project is a regulated slot machine (reels, paylines, jackpot, RTP target). Industry convention for certified gaming RNG requires an auditable, deterministic PRNG (e.g. Mersenne Twister with recorded seed) or a CSPRNG — not Math.random(), whose implementation is VM-defined and cannot be audited or reproduced. |
| `weightedPick` | L15 | 🟡 NEEDS_FIX | 88% | When items is empty, the loop body never executes and the fallback returns items[-1] (undefined in JavaScript), but the TypeScript return type is T. Caller receives undefined with no type error, silently propagating a bad value. |

## ⚡ Quick Wins

- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a cryptographically secure RNG (e.g. crypto.getRandomValues in Node/browser) to satisfy regulated gaming RNG requirements. [L33]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Guard against empty items/weights arrays at the top of the function; throw or return a typed sentinel rather than silently returning undefined. [L15]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout line 106, replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to correctly deduct the 5% house edge and achieve the documented RTP≈95%. [L106]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight so the 5-DIAMOND expected payout across 10 paylines does not alone exceed the 95% RTP target. With payout=1000×lineBet and 10 paylines, the weight must satisfy 10×(w/120)^5×100 < 0.95 with margin left for all other wins; a weight in the range 2–5 (≈1.7%–4.2%/cell) is consistent with a high-value rare symbol at this paytable multiplier. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with a certifiable, auditable PRNG (e.g. a seeded Mersenne Twister or crypto.getRandomValues-based uniform draw) required for regulated gaming RNG. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-83e35f-3 --> **[correction · low · trivial]** `src/reels.ts`: Add a bounds guard at the top of spinReel (and optionally getReelWeights): if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length throw a RangeError rather than crashing inside pickFromWeighted with an opaque TypeError. [L44]
