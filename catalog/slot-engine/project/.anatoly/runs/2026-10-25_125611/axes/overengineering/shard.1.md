[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 96% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcreelsts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 90% | Untyped string-keyed DI container for three statically imported functions; used once with a single registration set. Direct imports suffice, and resolve<T> casts defeat type safety. |

### `src/reels.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `REEL_WEIGHTS` | L22–L28 | 🔴 OVER | 80% | Five identical copies of the same weights, built through the config indirection. Per-reel weights are not used. Array.from({length:5}, ...) or a single shared array would be simpler. It is a small speculative per-reel extension point. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 78% | Hand-rolled pub/sub emitter with a single importer (spin) and a single event (SPIN_DONE). Nothing ever calls `off`, and `on` is only needed if a listener exists. The class is small and standard, but it is an abstraction built for one client. Node's built-in `events.EventEmitter` already provides this, and a direct callback would be simpler. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 88% | Class wrapper around a loop calling spinReel per reel. Plain function suffices. Single importer. The rowCount parameter is unused (_rowCount), which shows the interface is speculative. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-1 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-83e35f-1 --> **[overengineering · medium · small]** `src/reels.ts`: Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
