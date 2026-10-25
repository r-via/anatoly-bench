<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **5 min** — **$2.19** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 22 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 95% OK | 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.5 / 10 | 3 critical · 1 high · 3 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> 2 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house edge applied in the wrong direction (boosts payout instead of reducing it) and Math.ce...
- 🟡 **src/engine.ts** `spin` — Upper-bound bet violation (bet > 100) is silently swallowed with console.warn; README documents Bet as 1..100 integer...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm to pickFromWeighted in src/reels.ts: both compute totalWeight via reduce, draw Math.random() * to...
- 🔴 **src/engine.ts** `checkLine` — Logic is functionally identical to lineWins in src/paytable.ts: same WILD-resolution (find first non-WILD or fall bac...
- 🔴 **src/paytable.ts** `lineWins` — Logic is functionally identical to checkLine in src/engine.ts: both resolve the lead symbol by skipping WILDs, guard ...
- 🔴 **src/reels.ts** `pickFromWeighted` — Identical algorithm: compute total weight, roll Math.random() * total, accumulate until threshold, return last item a...

### 🏗️ Overengineering

> 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — Hand-rolled IoC container (register/resolve Map) wraps three static imports that are already in scope. One instantiat...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolled reimplementation of Node.js built-in `EventEmitter` (`require('events')`), which natively provides `on`, ...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wrapping a trivial loop over spinReel calls. The `_rowCount` param is silently ignored (prefixed unders...

### 🧪 Tests

✨ **CLEAN** — No issues found!

### 📝 Documentation

✨ **CLEAN** — No issues found!

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

### 🔀 Flow

✨ **CLEAN** — No issues found!

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with at least a partial inline doc comment |


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-10-25_125045` · 5.4 min · $2.19

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.5m | $0.05 | 6 / 2793 |
| duplication | 11 | 0.9m | $0.09 | 12 / 4277 |
| correction | 11 | 9.4m | $0.66 | 33 / 38918 |
| overengineering | 10 | 3.1m | $0.21 | 30 / 10096 |
| best_practices | 10 | 13.4m | $0.88 | 30 / 54636 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 247ms |
| estimate | 175ms |
| triage | 1ms |
| rag-index | 13.4s |
| flows | 23ms |
| flow-doc | 0ms |
| review | 204.8s |
| refinement | 104.0s |

</details>

<details>
<summary><strong>Methodology</strong></summary>

Each file is evaluated through 7 independent axis evaluators running in parallel.
Every symbol is analysed individually with a confidence score (0–100).
Findings below 30% confidence are discarded; those below 60% are excluded from verdicts.

**Verdicts:** CLEAN (no findings) · NEEDS_REFACTOR (confirmed findings) · CRITICAL (ERROR-level bugs)

**Severity:** High = ERROR or high-confidence NEEDS_FIX/DEAD/DUPLICATE · Medium = lower confidence or OVER · Low = minor

See each axis folder for detailed rating criteria.

</details>

*Generated: 2026-10-25T11:56:10.197Z*
