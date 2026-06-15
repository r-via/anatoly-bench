[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/reels.ts` | 🔴 CRITICAL | 1 | 92% | [details](#srcreelsts) |
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `REEL_WEIGHTS` | L22–L28 | 🔴 OVER | 60% | Five identical calls to weightsToArray(DEFAULT_WEIGHTS) produce five equal arrays. A single Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or just referencing one shared array would be cleaner. More fundamentally, the per-reel array structure exists to support differentiated weights, but all reels are identical, so the structure is premature generalization. |

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | DIY service-locator for 3 function references already available as direct imports. `resolve<T>` silently casts to `T`, discarding type safety. `spin` bypasses the container entirely for factory/strategy/emitter. Net effect: indirection with no benefit. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 88% | Full custom EventEmitter (on/off/emit over a Map) reimplements Node.js built-in `EventEmitter` or `eventemitter3` (npm, ~60M/week). Has only 1 runtime importer. The hand-rolled implementation adds ~20 lines of tested-elsewhere logic with no novel behavior over the standard API. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 55% | Stateless class wrapping a simple loop — no fields, no lifecycle, no polymorphic swap-in (1 importer). The `rowCount` parameter is silently ignored, exposing a leaky contract. A plain exported function `buildReels(reelCount: number): Symbol[][]` would be equivalent and clearer. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-3 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-83e35f-5 --> **[overengineering · medium · small]** `src/reels.ts`: Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
