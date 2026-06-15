[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | Hand-rolled service-locator/IoC container for three directly-importable functions. The registry adds indirection with no benefit: values are registered at module load and resolved once inside spin(), where two of the three resolutions (rng, reelsModule) are dead variables never consumed. Direct use of imported functions would be identical in effect and far simpler. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 85% | Full pub/sub bus (Map<string, handler[]>, on/off/emit) for a single-event, single-use object: docs confirm each spin() creates a new emitter, emits SPIN_DONE once, then discards it. The off() method is dead weight under this lifecycle. Only 1 runtime importer. Node.js built-in EventEmitter (zero deps, extend or delegate) covers this entirely, or a simple callback parameter to spin() would suffice given the discard-after-emit pattern. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | Class wrapper around a trivial `for` loop calling `spinReel`. The `_rowCount` parameter is intentionally unused (underscore-prefixed), exposing that the generalized signature was never warranted. A plain exported function `buildReels(reelCount: number): Symbol[][]` would be identical in behavior with no abstraction overhead. The class exists solely to satisfy the unnecessary abstract base above it. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-6 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
