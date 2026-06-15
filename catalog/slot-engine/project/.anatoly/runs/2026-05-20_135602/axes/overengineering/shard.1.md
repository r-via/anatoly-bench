[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 85% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | DIY service-locator wrapping three already-imported module-level references in a string-keyed Map<string, unknown> with unsafe `as T` casts. The resolved values (weightedPick, getPayMultiplier, reels module) are statically imported at the top of the file and never swapped at runtime — direct references are strictly equivalent with zero indirection, zero runtime cost, and full type safety. The abstraction buys nothing. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 82% | Hand-rolls a pub/sub system (on/off/emit) that Node.js `EventEmitter` provides as a built-in. One importer. Per internal docs, the engine creates a fresh emitter each spin, so no external subscriber can attach to the engine's own instance — callers must wrap `spin()` and build their own emitter anyway, defeating the abstraction. A direct callback param on `spin()` or simply using the return value would be sufficient; the generic event system is premature generalization for a single, synchronous event. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 88% | Class wrapping a single delegating method with only 1 importer. The entire class reduces to `spinReel(i)` per reel — a plain function like `buildReels(reelCount)` would be leaner. The factory pattern adds ceremony (instantiation, inheritance) with no polymorphic benefit. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-e0699c-2 --> **[overengineering · medium · small]** `src/strategy.ts`: Simplify: `ConservativeStrategy` is over-engineered (`ConservativeStrategy`) [L13-L20]
