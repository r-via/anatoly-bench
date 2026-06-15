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
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | Hand-rolled IoC registry with `register`/`resolve` used solely to store and re-retrieve three functions that are already in scope as top-level imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). The indirection buys nothing: the container is module-private, never swapped, never mocked, and has exactly one call site. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 85% | Full reimplementation of Node.js built-in `EventEmitter` (`import { EventEmitter } from 'events'`) with identical on/off/emit semantics and no added value. One importer; per the internal docs the emitter is created fresh per spin so listeners cannot be attached to the engine's instance anyway, further undermining the need for a custom class. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 88% | Stateless class that wraps a 4-line loop. Holds no state, has one importer, and ignores `rowCount` entirely. The factory-class pattern adds nothing a plain exported function wouldn't provide. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-8 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
