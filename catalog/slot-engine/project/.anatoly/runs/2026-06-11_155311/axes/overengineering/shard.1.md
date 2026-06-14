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
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | Hand-rolled DI container (register/resolve Map) used to store three symbols that are already directly imported at the top of the file. The container adds a runtime indirection layer with no benefit: callers in spin() resolve the same functions they could call directly. Single use, no interface, no swappable implementations. |

### `src/reels.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `REEL_WEIGHTS` | L22–L28 | 🔴 OVER | 60% | Five identical arrays produced by five calls to weightsToArray(DEFAULT_WEIGHTS). Docs confirm all reels share the same weight distribution. A single shared weights array referenced by spinReel would eliminate the per-reel matrix entirely. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 90% | Reimplements Node.js built-in `EventEmitter` (available via `import { EventEmitter } from 'events'` — zero install cost) with identical semantics: `on`, `off`, `emit`, per-event listener lists. Has exactly 1 runtime consumer, so the abstraction is not amortized. Replace with `extends EventEmitter` or a bare `new EventEmitter()` instance. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | Sole concrete implementation of `AbstractReelBuilderFactory`, consumed by exactly one caller (`engine.ts::spin`). The class wraps a `for` loop over `spinReel`, providing no state, no injection point, and no configurability beyond what a plain function would offer. A free function `buildReels(reelCount, rowCount)` would be equivalent with zero overhead. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-1 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-83e35f-3 --> **[overengineering · medium · small]** `src/reels.ts`: Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
