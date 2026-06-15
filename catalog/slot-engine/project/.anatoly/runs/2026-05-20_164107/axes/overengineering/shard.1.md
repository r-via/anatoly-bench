[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcreelsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | Hand-rolled service-locator with stringly-typed `register`/`resolve` and `Map<string, unknown>` casts — all to wrap three static module imports that never change at runtime. Direct imports would be zero-overhead and fully typed. The pattern adds indirection, erases types at the boundary, and provides no benefit a real DI framework would justify (no lifecycle, no scoping, no testing swap-out). |

### `src/reels.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `REEL_WEIGHTS` | L22–L28 | 🔴 OVER | 60% | Five identical weightsToArray(DEFAULT_WEIGHTS) calls. Since all reels share the same weights, Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or a single shared array would be cleaner and make the identity explicit. The repetition obscures intent. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 85% | Reimplements Node.js built-in `EventEmitter` (NIH). The `on`/`off`/`emit` API is identical to `require('events').EventEmitter` or the native `EventTarget`. Has exactly 1 runtime importer. Internal docs also reveal the engine instantiates the emitter fresh per spin, making it structurally impossible for external code to attach listeners to the engine's own instance — undermining the entire abstraction's value proposition. |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | Factory class wrapping a trivial 4-line loop over `spinReel`. The class exists solely to satisfy the abstract base; `rowCount` is silently ignored, making the interface misleading. With 1 importer and no substitution requirement, this should be a standalone exported function. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-83e35f-4 --> **[overengineering · medium · small]** `src/reels.ts`: Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- [ ] <!-- ACT-e0699c-3 --> **[overengineering · medium · small]** `src/strategy.ts`: Simplify: `ConservativeStrategy` is over-engineered (`ConservativeStrategy`) [L13-L20]
