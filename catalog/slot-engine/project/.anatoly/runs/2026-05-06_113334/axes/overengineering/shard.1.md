[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcreelsts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | A hand-rolled IoC / service-locator container (register + resolve with a Map<string, unknown>) built exclusively to inject three values — `weightedPick`, `getPayMultiplier`, and the reels module — that are already imported as named ES module imports in the same file. The container is populated once at module load with fixed, compile-time-known dependencies and has exactly one consumer (`spin`). This is a textbook premature abstraction: all the indirection of a DI container with none of the configurability benefit, since the registrations never change at runtime. |

### `src/reels.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `REEL_WEIGHTS` | L22–L28 | 🔴 OVER | 60% | Creates five separate, identical arrays by calling `weightsToArray(DEFAULT_WEIGHTS)` five times. The Configuration Schema doc (`.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`) explicitly states "All five reels share the same weight distribution", making per-reel array storage premature generalization. A single shared weights array would be correct and sufficient; the current structure implies per-reel differentiation that neither exists nor is planned. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- [ ] <!-- ACT-7dd2fe-4 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-83e35f-5 --> **[overengineering · medium · small]** `src/reels.ts`: Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
