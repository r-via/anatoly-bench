[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | Hand-rolled DI container (register/resolve) for exactly 3 values that are already direct imports at the top of the same file. Provides no testability or substitution value: the registrations are hardcoded at module init, the container has a single consumer (spin), and all three resolved values could be used directly from import scope. Classic single-use DIY IoC abstraction. |

### `src/reels.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `REEL_WEIGHTS` | L22–L28 | 🔴 OVER | 60% | Five identical calls to `weightsToArray(DEFAULT_WEIGHTS)` building five distinct but equal arrays. Docs confirm all reels share the same distribution and there is no setter — per-reel differentiation is never used. A single shared array (or `Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS))`) paired with a note about immutability would be cleaner; the current form implies per-reel customization that is explicitly out of scope. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 90% | Reimplements Node.js's built-in `EventEmitter` (on/off/emit) with no added behavior. Node's `EventEmitter` is always available — no install needed. Compounded by having only 1 runtime importer, making the custom class unjustified. Replace with `import { EventEmitter } from 'node:events'` and extend or compose it directly. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 82% | Concrete factory with only 1 importer. The class wraps a trivial loop over `spinReel` — no state, no config, no alternate implementations. A plain function would be sufficient; the factory pattern is premature generalization. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-8 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-1 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-83e35f-2 --> **[overengineering · medium · small]** `src/reels.ts`: Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
