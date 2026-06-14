[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 95% | [details](#srcenginets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | Hand-rolled service-locator/IoC container with typed `register`/`resolve` for exactly three dependencies that are already available as top-level imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). Adds `Map`, type-erasure via `unknown`, and a cast on every `resolve` call for zero benefit. Direct references to the imports would be clearer, shorter, and fully type-safe. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 90% | Hand-rolled reimplementation of Node.js built-in EventEmitter (on/off/emit over a Map<string, handler[]>). Node's EventEmitter is available natively with identical semantics plus error handling, once/prependListener, and eventNames. With only 1 runtime importer and the internal docs confirming the emitter is created fresh per spin (making engine-side listeners unreachable), the custom class adds maintenance surface for no gain. Drop SpinEventEmitter and extend or instantiate Node's EventEmitter directly. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-8 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
