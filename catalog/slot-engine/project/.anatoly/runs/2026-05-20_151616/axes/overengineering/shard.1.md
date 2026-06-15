[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | Service-locator container for 3 statically-imported module-level values (weightedPick, getPayMultiplier, {getReelSymbols,getReelWeights}) that never change and are not injected from outside. Adds register/resolve indirection with no substitution, testing, or extension benefit. Direct calls to the imports are sufficient. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 88% | NIH reimplementation of Node.js's built-in EventEmitter (or browser EventTarget). on/off/emit over a Map<string, fn[]> is exactly what both provide natively. Has 1 importer and is instantiated fresh per spin, so no lifecycle complexity justifies a custom class. Replace with `import { EventEmitter } from 'node:events'` or, for browser targets, EventTarget. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | Class wrapping a trivial for-loop over `spinReel`. Has only 1 importer and ignores `rowCount` entirely. The factory class indirection adds instantiation overhead and a forced inheritance chain for logic that could be a two-line exported function. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-e0699c-2 --> **[overengineering · medium · small]** `src/strategy.ts`: Simplify: `ConservativeStrategy` is over-engineered (`ConservativeStrategy`) [L13-L20]
