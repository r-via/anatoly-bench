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
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 80% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spin` | L120–L122 | 🟡 NEEDS_FIX | 90% | rng and reelsModule are resolved from the container but never passed to StandardReelBuilderFactory or used anywhere else in the function. factory.buildReels(5,3) constructs reels independently, making the container injection for these two dependencies dead code and bypassing the configurable RNG/reel-weight configuration. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `pickFromWeighted` | L32 | 🟡 NEEDS_FIX | 90% | Math.random() is a non-auditable PRNG. Regulated gaming RNG must be certifiable/seeded from a hardware entropy source. Industry convention for casino software: non-certifiable RNG is a correctness defect [inferred slot-machine domain]. |
| `spinReel` | L44 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex ∉ [0, 4]. undefined is passed as wts to pickFromWeighted, where wts.reduce() throws TypeError at runtime. |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS[reelIndex] is undefined for reelIndex ∉ [0, 4]; TypeScript return type number[] does not include undefined, so callers relying on the declared type silently receive undefined. |

### `src/rng.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `weightedPick` | L7 | 🟡 NEEDS_FIX | 92% | Inferred slot-machine domain from reel/payline/jackpot/DIAMOND/SEVEN/SCATTER vocabulary and RTP-95% target in README. `Math.random()` (V8 xorshift128+) is non-deterministically seeded and non-auditable; regulated gaming RNG must be a certified, seedable CSPRNG (e.g. `crypto.getRandomValues`). This is a well-established industry correctness requirement, not a style concern. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-1 --> **[correction · medium · small]** `src/engine.ts`: Pass the container-resolved rng function and reel-weight data to StandardReelBuilderFactory so the registered RNG and reel weights are actually used during reel generation, making the container injection effective. [L120]
- [ ] <!-- ACT-f69593-1 --> **[correction · medium · small]** `src/legacy.ts`: Track `wildCount` separately in the match loop (increment when `lineSymbols[i] === 'WILD'`), then multiply the computed payout by `(1 + wildCount) * Math.pow(2, wildCount)` before returning, matching the formula in `.anatoly/state/internal-docs/02-Architecture/03-Data-Flow.md` Stage 3. [L11]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() with a certified/auditable RNG source suitable for regulated gaming (e.g., CSPRNG from crypto.getRandomValues). [L32]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add a bounds guard in spinReel: throw RangeError (or clamp) if reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length to prevent undefined-wts crash. [L44]

## 🔧 Refactors

- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to a value that, combined with all other symbol payouts, keeps total RTP at or below 95%. At weight=30 DIAMOND alone contributes ~229% RTP; a weight in the low single digits is likely required. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace `Math.random()` with a CSPRNG draw (e.g. `crypto.getRandomValues` filling a Uint32Array, then normalising to [0, 1)) to meet regulated gaming RNG auditability requirements. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-83e35f-4 --> **[correction · low · trivial]** `src/reels.ts`: Add bounds check in getReelWeights or widen the return type to number[] | undefined to match actual JavaScript runtime behavior. [L57]
