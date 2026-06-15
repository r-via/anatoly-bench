[← Back to Overengineering](./index.md) · [← Back to report](../../public_report.md)

# 🏗️ Overengineering — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Overengineering | Conf. | Details |
|------|---------|-----------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 95% | [details](#srcenginets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srceventsts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `EngineContainer` | L17–L27 | 🔴 OVER | 60% | DIY IoC container (register/resolve via a string-keyed Map) wrapping three static imports that are already in scope at the top of the file. The only consumer is the module-level `container` instance, which immediately registers `weightedPick`, `getPayMultiplier`, and the reels module — all directly imported — only so `spin()` can resolve them back out. No indirection benefit, no swappable implementations, no testability gain beyond what plain variables provide. Textbook single-use container anti-pattern. |

### `src/events.ts`

| Symbol | Lines | Overengineering | Conf. | Detail |
|--------|-------|-----------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 OVER | 82% | Hand-rolls on/off/emit against a Map<string, EventHandler[]> — a verbatim reimplementation of Node.js's built-in EventEmitter or browser-compatible `eventemitter3` (npm, >5M/week). NIH: no installed dep provides this, but the native platform already does. Compound signal: pre-computed usage shows only 1 runtime importer, so the abstraction serves a single client and is unlikely to justify a bespoke class over `import { EventEmitter } from 'node:events'` or a lightweight npm alternative. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[overengineering · medium · small]** `src/engine.ts`: Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- [ ] <!-- ACT-7dd2fe-1 --> **[overengineering · medium · small]** `src/events.ts`: Simplify: `SpinEventEmitter` is over-engineered (`SpinEventEmitter`) [L3-L25]
