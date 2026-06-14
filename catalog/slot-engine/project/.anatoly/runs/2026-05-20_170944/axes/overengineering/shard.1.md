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
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | Hand-rolled IoC/service-locator for 3 functions that are already imported at the module top. `register`/`resolve` with a stringly-typed `Map<string, unknown>` sacrifices type safety for zero benefit — callers immediately cast via `as T`. The container is never exported, never mocked, and has a single consumer (`spin`). Direct module-level constants would be one line instead of ~15. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 82% | Reimplements Node.js built-in `EventEmitter` (always available, no install needed): `on`, `off`, `emit` with a `Map<string, handler[]>` are exactly what `EventEmitter` provides. 1 importer and fresh-per-spin instantiation (per internal docs) further undercut the value of a bespoke class. Replace with `import { EventEmitter } from 'node:events'` or, for browser compat, `mitt` (npm, ~8M/week, <300B). |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | Class/factory wrapper around a 4-line loop that calls spinReel. Only 1 importer, no state, no injection — a top-level function `buildReels(reelCount)` would be identical in capability. The ignored `_rowCount` parameter also signals the abstraction contract is already broken at the sole implementation. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-e0699c-3 --> **[overengineering · medium · small]** `src/strategy.ts`: Simplify: `ConservativeStrategy` is over-engineered (`ConservativeStrategy`) [L13-L20]
