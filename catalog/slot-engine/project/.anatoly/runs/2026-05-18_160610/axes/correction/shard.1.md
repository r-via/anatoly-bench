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
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcreelsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `EngineContainer` | L25 | 🟡 NEEDS_FIX | 55% | Map.get() returns V\|undefined; the `as T` cast hides the undefined case. An unregistered key yields undefined typed as a callable, crashing when invoked. |
| `computePayout` | L105 | 🟡 NEEDS_FIX | 88% | `total * (1 + HOUSE_EDGE)` adds 5% to player wins rather than deducting 5%. To apply a 5% house edge yielding RTP≈95% (arbitrated intent), the factor must be `(1 - HOUSE_EDGE)` = 0.95. |

### `src/reels.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `spinReel` | L44 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS has five entries (indices 0–4); any reelIndex < 0 or ≥ 5 yields undefined, which propagates to pickFromWeighted as wts and throws TypeError on wts.reduce(). |
| `getReelWeights` | L57 | 🟡 NEEDS_FIX | 85% | REEL_WEIGHTS[reelIndex] returns undefined for reelIndex outside 0–4; TypeScript types it as number[] but runtime value is undefined, causing downstream crashes. |

### `src/factories.ts`

| Symbol | Lines | Correction | Conf. | Detail |
|--------|-------|------------|-------|--------|
| `StandardReelBuilderFactory` | L9–L13 | 🟡 NEEDS_FIX | 70% | `_rowCount` is accepted by the abstract contract but discarded. `spinReel(i)` receives only the reel index, not the required row count. If `spinReel` does not hard-code exactly 3 rows, the returned grid dimensions will not match the caller's expectation. Even if `spinReel` is currently hard-coded to 3, the parameter silently does nothing, making the override violate the intent of the abstract method's `rowCount` argument. |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-2 --> **[correction · medium · small]** `src/engine.ts`: Guard EngineContainer.resolve() against absent keys: throw a descriptive Error (or return a typed Result) instead of silently casting undefined to T. [L25]
- [ ] <!-- ACT-dd0b20-1 --> **[correction · medium · small]** `src/factories.ts`: Forward `rowCount` to `spinReel` (or assert it equals the hard-coded constant) so the implementation honours the abstract method's contract and does not silently produce grids of the wrong height. [L9]
- [ ] <!-- ACT-89de92-1 --> **[correction · medium · small]** `src/freespin.ts`: Replace `state.remaining += 10` in the retrigger branch with `state.remaining += 9` (or `state.remaining--; state.remaining += 10`) so the triggering free spin is consumed while exactly 10 new spins are appended, yielding the documented 20 total spins (10 initial + 10 retrigger). [L18]
- [ ] <!-- ACT-83e35f-2 --> **[correction · medium · small]** `src/reels.ts`: Replace Math.random() with crypto.getRandomValues or another certifiable RNG to meet regulated gaming correctness requirements. [L33]
- [ ] <!-- ACT-83e35f-3 --> **[correction · medium · small]** `src/reels.ts`: Add bounds guard in spinReel: throw or return early when reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length. [L44]
- [ ] <!-- ACT-4db700-2 --> **[correction · medium · small]** `src/rng.ts`: Guard against empty items/weights arrays: throw or return a typed sentinel rather than silently returning undefined. [L15]

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-1 --> **[correction · high · large]** `src/engine.ts`: Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` in computePayout to correctly deduct 5% from wins and achieve RTP≈95% per the arbitrated contract. [L105]
- [ ] <!-- ACT-83e35f-1 --> **[correction · high · large]** `src/reels.ts`: Reduce DIAMOND weight from 30 to ~5 (or equivalently reduce paytable multipliers in paytable.ts) to align total RTP with the arbitrated 95% target; current weight alone drives DIAMOND-only RTP to ~230% of bet. [L14]
- [ ] <!-- ACT-4db700-1 --> **[correction · high · large]** `src/rng.ts`: Replace Math.random() with crypto.getRandomValues()-based uniform draw to produce a certifiable, auditable RNG suitable for the regulated gaming domain. [L7]

## 🧹 Hygiene

- [ ] <!-- ACT-83e35f-4 --> **[correction · low · trivial]** `src/reels.ts`: Add bounds guard in getReelWeights to prevent returning undefined for out-of-range reelIndex. [L57]
