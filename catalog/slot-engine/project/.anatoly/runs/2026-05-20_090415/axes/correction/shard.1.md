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
| `src/engine.ts` | 🔴 CRITICAL | 3 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 85% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `EngineContainer` | L25 | 🟡 NEEDS_FIX | 60% | Map.get() returns undefined for unknown keys; the 'as T' cast drops that signal. Any caller with an unregistered key receives undefined typed as T and crashes on first use (e.g. calling it as a function). |
| `computePayout` | L105 | 🔴 ERROR | 95% | total * (1 + HOUSE_EDGE) multiplies payout by 1.05, giving the player an extra 5% on top of the raw paytable return — the inverse of a house edge. Forward: paytable_EV × 1.05 → implied RTP > 100%. Backward: 95% RTP target requires × (1 − 0.05) = × 0.95. Sanity: 0.95 × paytable_EV = 95% ✓. Fix: replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE). Violates arbitrated RTP = 95% target. |
| `computePayout` | L110 | 🔴 ERROR | 95% | Math.ceil rounds every fractional payout up, transferring the remainder to the player. Inferred slot-machine domain from reel/payline/jackpot vocabulary. Industry rule: slot payout rounding must round DOWN (house retains the remainder). Replace with Math.floor. |
| `spin` | L118 | 🟡 NEEDS_FIX | 90% | console.warn does not enforce the upper bound. Arbitrated intent states Bet is constrained to 1..100 integers. Should throw, matching the < 1 / non-integer guard on line 114. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L43–L50 | 🟡 NEEDS_FIX | 95% | No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] returns undefined for any index outside 0–4, causing pickFromWeighted to crash with TypeError on wts.reduce() at L32. |
| `getReelWeights` | L56–L58 | 🟡 NEEDS_FIX | 90% | No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for indices outside 0–4, silently returning undefined while TypeScript types the return as number[]; callers relying on the type will crash at the use-site. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Replace Math.ceil with Math.floor in computePayout; regulated slot-machine domain requires rounding payouts down. [L110]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: Throw an error (not just warn) when bet > 100 to enforce the arbitrated 1..100 Bet contract. [L118]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` so payouts are always integer coin amounts and the house retains any fractional remainder, consistent with the 95% RTP target and slot-machine industry convention. [L23]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with a certifiable CSPRNG (e.g., crypto.getRandomValues) suitable for regulated gaming RNG audits. [L32]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Guard spinReel against out-of-range reelIndex (valid range 0–4); throw a RangeError or clamp/assert before accessing REEL_WEIGHTS[reelIndex]. [L44]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with a certifiable CSPRNG (e.g. crypto.getRandomValues or a seeded auditable library) to meet regulated gaming RNG requirements. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout to deduct the 5% house edge instead of adding it. [L105]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: Guard EngineContainer.resolve() against unknown keys to avoid silent undefined-cast crashes. [L25]
- [ ] <!-- ACT-83e35f-3 --> **[correction · low · trivial]** `src/reels.ts`: Guard getReelWeights against out-of-range reelIndex (valid range 0–4); throw or return a defined fallback rather than undefined. [L57]
