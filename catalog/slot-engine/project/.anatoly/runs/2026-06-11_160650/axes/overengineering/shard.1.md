[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | DIY Map-backed IoC container for 3 statically-imported ES modules. All three dependencies (weightedPick, getPayMultiplier, getReelSymbols/getReelWeights) are already in scope as named imports — the register/resolve indirection adds zero testability or runtime flexibility. In spin(), rng and reelsModule are resolved from the container but never actually consumed (factory.buildReels() replaces reelsModule; rng goes unused). |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 88% | Reimplements Node.js's built-in `EventEmitter` (always available, no install needed). `on`/`off`/`emit` map 1-to-1 to the native API. Single importer (`engine.ts::spin`) reinforces the over-abstraction signal. Replace with `import { EventEmitter } from 'events'` or the browser-native `EventTarget`. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | A class wrapping a trivial for-loop over `spinReel`. The factory pattern adds instantiation ceremony for a single consumer (`engine.ts::spin`) with no benefit. `_rowCount` is silently ignored, exposing that the interface was designed for flexibility that never materialized. A standalone `buildReels(reelCount: number): Symbol[][]` function would be cleaner and equally expressive. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-1 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
