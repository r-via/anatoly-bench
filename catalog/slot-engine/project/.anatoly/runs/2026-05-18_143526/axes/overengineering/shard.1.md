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
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | String-keyed IoC container (Map<string, unknown> + register/resolve with unsafe `as T` cast) for exactly 3 values that are already statically imported at the top of the file. Zero polymorphism, zero late-binding, zero testability gain — pure indirection that erases types and hides the actual dependencies. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 82% | Hand-rolls Node.js's built-in `EventEmitter` (on/off/emit over a Map<string, Handler[]>) without gaining anything over `import { EventEmitter } from 'events'`. Has 1 importer, emits exactly one event (SPIN_DONE), and per docs the instance is created and discarded per spin — making `off` effectively dead in the primary flow. The full multi-event, multi-listener infrastructure is disproportionate to a single fire-and-forget notification. Extending `EventEmitter` directly would remove ~20 lines and the NIH risk. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | Wraps a trivial 3-line loop in a class that extends an abstract factory. `_rowCount` is silently discarded, exposing that the interface was over-generalized — the real signature needed is just `(reelCount: number) => Symbol[][]`. Single importer (per usage analysis). A top-level function `buildReels(reelCount: number): Symbol[][]` eliminates the class, the inheritance, and the dead parameter. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
