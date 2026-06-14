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
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 0 | 85% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcfactoriests) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | Hand-rolled IoC/service-locator using `Map<string, unknown>` with unsafe `as T` casts to store 3 fixed, file-local dependencies that could be plain imports or a const object. The pattern adds indirection, loses type safety, and has a single instantiation site. No benefit over `const deps = { rng: weightedPick, paytable: getPayMultiplier, reels: { getReelSymbols, getReelWeights } }`. |

### `src/reels.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `REEL_WEIGHTS` | L22–L28 | 🔴 OVER | 60% | Five identical calls to weightsToArray(DEFAULT_WEIGHTS) when all reels share the same weights. `Array.from({length:5}, () => [...DEFAULT_WEIGHTS])` or even a single shared array would be simpler. The indirection through weightsToArray compounds the ReelWeightConfig overengineering. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 87% | Reimplements Node.js built-in EventEmitter (on/off/emit over a Map) — Node's `events` module is always available, no install needed. Single importer compounds the issue: the internal docs confirm the engine creates a fresh emitter per spin, so external callers wrap spin() and build their own emitter anyway (making the class even more marginal). Replace with `import { EventEmitter } from 'node:events'` or, for isomorphic use, `eventemitter3` (~15M weekly downloads). |

### `src/factories.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `StandardReelBuilderFactory` | L8–L16 | 🔴 OVER | 90% | Class exists solely to satisfy the unnecessary abstract hierarchy. The body is a trivial loop over `spinReel(i)` — a standalone function `buildReels(reelCount: number): Symbol[][]` would be identical with no loss of expressiveness. The `rowCount` parameter is accepted but silently ignored, which is a leaky abstraction artifact of the forced interface contract. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-dd0b20-2 --> **[overengineering · medium · small]** `src/factories.ts`: Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-83e35f-5 --> **[overengineering · medium · small]** `src/reels.ts`: Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- [ ] <!-- ACT-e0699c-1 --> **[overengineering · medium · small]** `src/strategy.ts`: Simplify: `SpinStrategy` is over-engineered `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
