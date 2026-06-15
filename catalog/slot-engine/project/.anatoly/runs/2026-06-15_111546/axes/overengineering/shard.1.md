[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcenginets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 90% | Custom IoC container backed by a Map, used exactly once to register three values (rng, paytable, reels) that are already statically imported at the top of the same file. spin() immediately resolves them back to the same types. The abstraction adds zero value: replacing the three resolve() calls with direct references to the already-imported symbols eliminates this entire class with no loss of flexibility. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 88% | NIH: reimplements Node.js built-in `EventEmitter` (on/off/emit, Map-backed listener lists) with identical semantics. Has exactly 1 consumer that emits exactly 1 event (`SPIN_DONE`). Extending `require('events').EventEmitter` or using `EventTarget` eliminates ~20 lines with no trade-offs. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | Factory class wraps a trivial loop over `spinReel`. The `_rowCount` parameter is accepted but intentionally unused (underscore prefix), exposing a generalization that was never implemented. With 1 consumer and no polymorphism in play, this is a stateless class whose entire body could be a two-line standalone function. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-6 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-1 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
