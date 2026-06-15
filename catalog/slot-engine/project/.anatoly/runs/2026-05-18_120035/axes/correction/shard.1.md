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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 75% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L105 | 🟡 NEEDS_FIX | 75% | total * (1 + HOUSE_EDGE) = total * 1.05 gives the player 5% more than the raw line-win sum, producing a negative house edge (casino loses). Applying a 5% house-edge deduction requires total * (1 - HOUSE_EDGE) = total * 0.95. This directly contradicts the arbitrated README intent 'house edge of 5%' (house keeps 5%, player receives 95%). Confidence is 75 rather than higher because the Configuration Schema reference doc also shows '× (1 + HOUSE_EDGE)', suggesting the formula may have been mis-documented from the same source bug; the arbitrated intent takes precedence. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | bet > 100 logs a warning but the spin executes normally. The arbitrated README explicitly bounds Bet to 1..100 integers; this guard must throw (matching the pattern on L114–116 for bets < 1) instead of warn. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `DEFAULT_WEIGHTS` | L14 | 🟡 NEEDS_FIX | 72% | DIAMOND: 30 — 5-DIAMOND contribution across 10 paylines ≈ 97.7% of total bet; total RTP >> 100%, violates arbitrated RTP=95% target. |
| `spinReel` | L44 | 🟡 NEEDS_FIX | 82% | REEL_WEIGHTS[reelIndex] is undefined for reelIndex ≥ 5 or < 0; subsequent pickFromWeighted call crashes on wts.reduce(). |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 80% | REEL_WEIGHTS[reelIndex] returns undefined for out-of-range reelIndex; return type number[] does not reflect this. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 78% | When active and scatters >= 3 (retrigger during a free spin), the current spin is being consumed from `remaining` just like any other free spin, but only `+10` is applied with no corresponding `-1`. Branch 3 correctly decrements for non-retrigger free spins; branch 2 must do the same. If `remaining` was N before this spin, the result should be N - 1 + 10 = N + 9, not N + 10. Use `state.remaining += 9` or `state.remaining += 10; state.remaining--`. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 85% | Inferred regulated gaming/casino domain from paytable, paylines, RTP-95% target, and jackpot vocabulary in reference docs. Math.random() is a non-cryptographic, non-auditable PRNG seeded by the JS engine at startup; it cannot be certified under any major gaming-lab standard (GLI-11, eCOGRA, BMM). The JSDoc on line 2 explicitly labels this function 'suitable for gaming RNG applications', creating a false safety claim. Replace with crypto.getRandomValues() to generate a uniform 32-bit integer and scale, or a certified CSPRNG library. Industry convention: Math.random() is categorically unacceptable for regulated gaming RNG. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-1 --> **[correction · medium · small]** `src/engine.ts`: In computePayout line 105, change (1 + HOUSE_EDGE) to (1 - HOUSE_EDGE) so the house deducts 5% from line wins rather than adding 5%, aligning with the arbitrated 95% RTP / 5% house-edge contract. [L105]
- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: In spin line 118, replace console.warn with throw 'invalid bet' (or an equivalent rejection) when bet > 100 to enforce the documented 1..100 integer constraint. [L118]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch (active && scatters >= 3), decrement `remaining` by 1 in addition to adding 10, so the current free spin is consumed: `state.remaining += 9` (or equivalently `state.remaining += 10; state.remaining--`). This matches the behaviour of branch 3 where every active free spin consumes one from `remaining`. [L18]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Track wildCount as a separate counter during the match loop and multiply the final payout by (1 + wildCount) * Math.pow(2, wildCount) before returning, consistent with Data-Flow.md Stage 3 formula. [L11]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add reelIndex bounds validation in spinReel (and getReelWeights) before accessing REEL_WEIGHTS; throw a RangeError or clamp the index to [0, REEL_WEIGHTS.length-1]. [L44]

## 🔧 Refactors

- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to approximately 3–5 so that combined RTP across all pay combinations reaches ~95%. At w=30, 5-DIAMOND alone across 10 paylines contributes ~97.7% of total bet, leaving no budget for any other combination. [L14]
- [ ] <!-- ACT-83e35f-2 --> **[correction · high · large]** `src/reels.ts`: Replace Math.random() with a certifiable, auditable PRNG (e.g., a seeded cryptographic PRNG or a jurisdiction-approved RNG library). Math.random() is not acceptable for regulated gaming RNG. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues() (or equivalent CSPRNG) to make the RNG certifiable under regulated gaming standards (GLI-11, eCOGRA, BMM). Update the JSDoc to document the RNG source explicitly. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-f69593-2 --> **[correction · low · trivial]** `src/legacy.ts`: Apply Math.ceil (consistent with the main engine's computePayout convention) to the return value to prevent fractional credits when bet is not divisible by 10. [L23]
