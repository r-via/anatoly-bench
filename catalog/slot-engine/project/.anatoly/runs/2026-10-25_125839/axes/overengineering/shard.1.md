[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 97% | [details](#srcenginets) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 90% | DI container with untyped string-keyed registry used for three statically imported functions that could be called directly. Adds indirection and loses type safety via casts. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 85% | Class wraps a loop over spinReel. A plain function buildReels(reelCount) would do. The factory pattern has one use, and the rowCount parameter is unused (_rowCount). |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-dd0b20-1 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
