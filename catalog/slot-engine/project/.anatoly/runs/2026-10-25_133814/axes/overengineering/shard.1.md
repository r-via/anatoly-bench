[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcreelsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 90% | A DI container with an untyped registry and unchecked casts. It has a single instance and registers static imports that could be called directly. Premature indirection that loses type safety. |

### `src/reels.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `REEL_WEIGHTS` | L22–L28 | 🔴 OVER | 80% | Five identical per-reel weight arrays built by repeated calls. Per-reel configuration is not used, so Array.from({length:5}, ...) or a single shared array would be simpler. Per-reel indexing is speculative generality. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 85% | Factory class wraps a loop over spinReel and has one importer. A plain function would do. Unused _rowCount parameter exists only to satisfy the abstract signature. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-dd0b20-1 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-83e35f-1 --> **[overengineering · medium · small]** `src/reels.ts`: Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
