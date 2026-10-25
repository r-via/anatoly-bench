[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `REEL_WEIGHTS` | L22–L28 | 🔴 OVER | 87% | Five identical weightsToArray(DEFAULT_WEIGHTS) calls; all reels share the same weights. Premature per-reel configurability with no actual differentiation. A single shared array referenced by spinReel would express the same behaviour without the false implication of per-reel variation. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 90% | Hand-rolls on/off/emit — an exact subset of Node.js's built-in EventEmitter (require('events').EventEmitter or extends EventEmitter). NIH with zero benefit: single consumer (src/engine.ts::spin), no custom behavior beyond what the built-in provides. Replace with `extends EventEmitter` from Node's stdlib. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | Wraps a trivial loop over `spinReel` calls in a class that exists solely to satisfy an unnecessary abstract base. The entire body is 5 lines that could be a plain exported function `buildReels(reelCount, rowCount)` with no loss of expressiveness. The factory-class pattern here provides no polymorphism, no DI seam, and no lifecycle — only ceremony. |

## 🧹 Hygiene

- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-83e35f-1 --> **[overengineering · medium · small]** `src/reels.ts`: Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
