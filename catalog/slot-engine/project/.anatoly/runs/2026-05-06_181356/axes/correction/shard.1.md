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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcreelsts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 75% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `EngineContainer` | L24–L26 | 🟡 NEEDS_FIX | 60% | Map.get returns undefined for absent keys; the 'as T' cast hides this. Any caller using a misspelled or unregistered key receives undefined typed as T with no error thrown. |
| `computePayout` | L105 | 🟡 NEEDS_FIX | 90% | Forward: total*(1+0.05)=total*1.05 — payouts increase 5%, implying RTP>100%. Backward: for 95% RTP the factor must be (1-0.05)=0.95. Sanity: 0.95→forward→95% ✓ formula consistent. Conclusion: (1+HOUSE_EDGE) must be (1-HOUSE_EDGE). Violates documented RTP≈95% target [.anatoly/docs/04-API-Reference/01-Public-API.md]. |
| `computePayout` | L108 | 🟡 NEEDS_FIX | 90% | Unconditional bet*0.01 added to every spin's payout — including losing spins where total==0 — is entirely undocumented and further inflates effective RTP above the 95% target. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 80% | REEL_WEIGHTS[reelIndex] is undefined for any reelIndex outside [0, 4]. The value is passed to pickFromWeighted as wts; wts.reduce() then throws a TypeError. No guard or RangeError is raised before the access. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 78% | REEL_WEIGHTS[reelIndex] is undefined when reelIndex ∉ [0, 4]. The declared return type number[] is violated, silently propagating undefined to callers that expect a valid weight array. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove or document the bet*0.01 unconditional payout; it silently inflates RTP above the 95% target on every spin, including losses. [L108]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Wrap the final return expression in Math.floor: `return Math.floor(multiplier * lineBet)`. Slot-machine payout rounding must be downward (house keeps fractional remainder); omitting the floor yields fractional credits when bet is not divisible by 10. [L23]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Guard spinReel: validate reelIndex ∈ [0, REEL_WEIGHTS.length) and throw a RangeError before accessing REEL_WEIGHTS to prevent a downstream TypeError in pickFromWeighted. [L44]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so the house deducts 5% from wins rather than adding 5%, restoring the documented RTP≈95%. [L105]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[correction · low · trivial]** `src/engine.ts`: Guard EngineContainer.resolve against missing keys by throwing a descriptive error (or returning a typed Result/Option) instead of silently casting undefined to T. [L25]
- [ ] <!-- ACT-83e35f-2 --> **[correction · low · trivial]** `src/reels.ts`: Guard getReelWeights: validate reelIndex ∈ [0, REEL_WEIGHTS.length) and throw a RangeError (or return undefined explicitly with a matching return type) for out-of-range values. [L57]
