[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 95% | [details](#srcenginets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 55% | Hand-rolled IoC container (string-keyed registry with register/resolve) whose only purpose is to hold three module-level imports — weightedPick, getPayMultiplier, and the reels module — all of which are already available via direct import. Adds type-erasure (Map<string, unknown> with unsafe casts) and a factory/registry pattern for zero runtime benefit. Single consumer (this file). A DI container is justified when resolving implementations at runtime or in tests with swap-out needs; neither applies here. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 82% | Reimplements Node.js built-in EventEmitter (always available, no install needed) with an identical on/off/emit API. Has exactly 1 runtime importer — a direct callback or Promise from the engine would remove the abstraction entirely. The pub/sub indirection is not justified by a game loop that has a single, synchronous spin result. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 88% | Factory class wrapping a single call to spinReel in a loop. Has only 1 importer and exists solely to fulfil the unnecessary abstract base class contract. The entire class body is trivially replaceable with a standalone function `buildReels(reelCount, rowCount): Symbol[][]`. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-12 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-3 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-e0699c-3 --> **[overengineering · medium · small]** `src/strategy.ts`: Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
