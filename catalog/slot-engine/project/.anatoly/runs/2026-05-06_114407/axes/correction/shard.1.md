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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcreelsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `EngineContainer` | L23–L25 | 🟡 NEEDS_FIX | 60% | Map.get returns undefined for missing keys; 'as T' hides the absence with no guard or throw. Any caller receiving undefined will fail at the point of use, not here, making the defect hard to trace. |
| `computePayout` | L106 | 🔴 ERROR | 95% | total * (1 + HOUSE_EDGE) multiplies payout by 1.05, giving the player a 5% bonus rather than deducting a 5% house margin. Forward: payout = base * 1.05 → implied RTP > 100%. Backward: 95% RTP target requires base * 0.95 = base * (1 - HOUSE_EDGE). Sanity: (1 - 0.05) → forward gives 95% ✓. Should be total * (1 - HOUSE_EDGE). Violates RTP=95% target [.anatoly/docs/04-API-Reference/01-Public-API.md]. |
| `computePayout` | L109 | 🔴 ERROR | 95% | total += bet * 0.01 credits 1% of the wager unconditionally — including on zero-win spins where total starts at 0, guaranteeing a non-zero payout on every spin. Not documented in .anatoly/docs/04-API-Reference/01-Public-API.md (which specifies only the 5% house-edge adjustment) and inflates effective RTP further above 100%. |
| `spin` | L118–L120 | 🟡 NEEDS_FIX | 90% | rng (L118) and reelsModule (L120) are resolved from the container then discarded. factory.buildReels(5, 3) is called directly with no reference to these resolved values, so the DI registrations at container.register('rng', ...) and container.register('reels', ...) have no effect on the actual spin outcome. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 78% | REEL_WEIGHTS has indices 0–4. If reelIndex < 0 or >= 5, REEL_WEIGHTS[reelIndex] is undefined; pickFromWeighted then throws TypeError on wts.reduce at L34. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 75% | REEL_WEIGHTS[reelIndex] is undefined for indices outside 0–4. The function's declared return type is number[], so callers receive undefined without a type error at compile time, leading to silent runtime failures downstream. |

### `src/freespin.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `handleFreeSpins` | L17–L18 | 🟡 NEEDS_FIX | 65% | Branch `state.active && scatters >= 3` only does `remaining += 10`. Because this function is called after each spin resolves, the retrigger spin was itself a consumed free spin. Without a matching `state.remaining--`, the retrigger gives the player an extra spin (net +10 rather than the correct net +9: decrement current spin, add 10 new). Non-retrigger free spins (branch 3, line 20) correctly decrement, creating an asymmetry between the two paths. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Remove or document the `total += bet * 0.01` expression; it unconditionally inflates every payout (including losses) with no basis in the spec. [L109]
- [ ] <!-- ACT-28c3e3-3 --> **[correction · medium · small]** `src/engine.ts`: In spin, either pass the container-registered RNG to StandardReelBuilderFactory or remove the unused rng and reelsModule resolutions to avoid silently bypassing DI configuration. [L118]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: In the retrigger branch, decrement remaining before adding 10: `state.remaining--; state.remaining += 10;` (or equivalently `state.remaining += 9;`) so the retrigger spin is counted as a consumed free spin, matching the behaviour of the non-retrigger branch. [L18]
- [ ] <!-- ACT-83e35f-1 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() in pickFromWeighted with the project's certified RNG from src/rng.ts to comply with regulated gaming RNG requirements. [L35]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds guard in spinReel: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw a RangeError before accessing REEL_WEIGHTS[reelIndex]. [L44]
- [ ] <!-- ACT-4db700-1 --> **[correction · medium · small]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues() (or an equivalent CSPRNG wrapper) so the RNG is auditable and meets regulated gaming certification requirements. [L7]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: In computePayout L106, change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` to correctly deduct 5% and achieve the documented 95% RTP. [L106]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[correction · low · trivial]** `src/engine.ts`: In EngineContainer.resolve, throw an error (or return an Option type) when the requested key is absent instead of returning undefined cast to T. [L23]
- [ ] <!-- ACT-83e35f-3 --> **[correction · low · trivial]** `src/reels.ts`: Add a bounds guard in getReelWeights: if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length, throw a RangeError to prevent a silent undefined return. [L57]
