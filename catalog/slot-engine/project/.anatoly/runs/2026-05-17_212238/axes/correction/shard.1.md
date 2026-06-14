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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 92% | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 0 | 92% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 65% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `computePayout` | L104–L106 | 🟡 NEEDS_FIX | 90% | total * (1 + HOUSE_EDGE) multiplies raw line-win totals by 1.05, boosting player return above 100% of paytable value. Arbitrated intent: RTP=95% with a 5% house deduction. Required fix: total * (1 - HOUSE_EDGE) = total * 0.95. Forward check: current formula implies implied_RTP = base_paytable_RTP × 1.05; if paytable targets ~100% base RTP, implied_RTP ≈ 105% (house loses 5%). Backward check: target RTP=95% with standard 100%-base paytable → factor must be 0.95. Sanity: 1.00 × 0.95 = 0.95 ✓ formula consistent. Conclusion: factor 1.05 vs required 0.95 is wrong-sign, violating [README.md#rtp]. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `pickFromWeighted` | L32 | 🟡 NEEDS_FIX | 60% | Math.random() is not a CSPRNG and cannot be certified for regulated slot-machine gaming (inferred domain from reel/payline/jackpot/RTP vocabulary and docs). Replace with crypto.getRandomValues()-based sampling. |
| `spinReel` | L43–L50 | 🟡 NEEDS_FIX | 70% | No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for index outside 0–4, causing TypeError in pickFromWeighted when wts.reduce is called on undefined. |
| `getReelWeights` | L56–L58 | 🟡 NEEDS_FIX | 70% | No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] returns undefined (typed as number[]) for index outside 0–4, silently propagating undefined to callers. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L12 | 🟡 NEEDS_FIX | 78% | `spinReel(i)` receives no `rowCount` argument. The abstract factory contract declares `rowCount` as a meaningful parameter — any caller that passes a value other than what `spinReel` hardcodes internally will silently receive the wrong grid dimensions. The prefixed `_rowCount` suppresses the unused-variable warning but does not fix the logic gap. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 85% | Math.random() is a non-cryptographic, implementation-defined PRNG (V8 uses xorshift128+). It is not certifiable for regulated gaming RNG. The JSDoc header explicitly labels this function 'suitable for gaming RNG applications' and the surrounding project context (slot engine, 95% RTP target, reel weights, paylines) confirms a regulated-gaming domain. Industry convention requires a statistically certified, auditable source of randomness (e.g., a hardware-seeded CSPRNG or a certified RNG service). Inferred slot-machine domain from reels/paylines/jackpot vocabulary in .anatoly/state/internal-docs/04-API-Reference/02-Configuration-Schema.md and arbitrated README. |

## ⚡ Quick Wins

- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Pass `rowCount` (or `_rowCount`) through to `spinReel` so the concrete implementation honours the full contract of `AbstractReelBuilderFactory.buildReels`. If `spinReel` does not yet accept a row-count parameter, add one and use it to slice/limit the returned symbol array to exactly `rowCount` rows. [L12]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch (state.active && scatters >= 3), consume the current free spin before adding the retrigger award: replace `state.remaining += 10` with `state.remaining += 9` (i.e., –1 for the current spin + 10 for the award), matching the documented '+10 additional spins' semantic. [L18]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Track wildCount inside the match loop and multiply the final payout by (1 + wildCount) × 2^wildCount before returning, matching the documented wild bonus formula. [L11]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() with a CSPRNG-backed sampler (e.g. crypto.getRandomValues()) to satisfy regulated gaming RNG certification requirements. [L32]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with a cryptographically secure uniform draw (e.g., crypto.getRandomValues on a Uint32Array, normalised to [0,1)) so the RNG is auditable and certifiable for regulated gaming use. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` in computePayout (line 105) to correctly deduct the 5% house share and achieve the arbitrated RTP=95% target. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to approximately 5–6 (P≈0.04–0.05) so DIAMOND's per-payline EV no longer exceeds the entire 95% RTP budget alone. Current weight implies RTP > 229% from DIAMOND alone. [L14]

## 🧹 Hygiene

- [ ] <!-- ACT-83e35f-3 --> **[correction · low · trivial]** `src/reels.ts`: Add a RangeError guard in spinReel: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw rather than passing undefined to pickFromWeighted. [L44]
- [ ] <!-- ACT-83e35f-4 --> **[correction · low · trivial]** `src/reels.ts`: Add the same bounds guard in getReelWeights to prevent returning undefined typed as number[]. [L57]
