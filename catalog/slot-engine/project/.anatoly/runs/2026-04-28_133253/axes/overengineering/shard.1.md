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
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 90% | A bespoke IoC / service-locator container (register + resolve via a stringly-typed Map<string, unknown>) built to hold exactly three static module-level imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). These are pure functions that could be imported directly. The abstraction adds casting noise (`as T`, `as unknown`) with zero benefit for a single-file use case. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 80% | A four-line for-loop wrapped in a class that extends an abstract base with 0 importers. With only 1 runtime importer and no consumer ever referencing the abstract type, the class hierarchy delivers no polymorphism in practice. ADR-002 justifies the factory pattern for future test-double scenarios, but since AbstractReelBuilderFactory itself has 0 importers those scenarios have not been acted upon. A standalone function `buildReels(reelCount: number): Symbol[][]` would be equally extensible and easier to swap in tests via module mocking, without the class indirection ADR-002 itself flags as a negative consequence. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-6 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `Bet` is over-engineered `Bet`, `DEBUG_MODE`, `EngineContainer`, `container` (`Bet, DEBUG_MODE, EngineContainer, container`) [L12-L12, L15-L15, L17-L27, L29-L29]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
