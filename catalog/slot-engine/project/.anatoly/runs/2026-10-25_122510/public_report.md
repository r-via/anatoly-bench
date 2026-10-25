<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **2 min** — **$1.75** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 23 findings in 9 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 95% OK | 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 82% lean | 1 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.6 / 10 | 4 critical · 3 high · 3 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> 2 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — The house edge is applied as a bonus, a flat per-spin payout is added, and the total rounds up.
- 🟡 **src/engine.ts** `spin` — A bet above the documented 1..100 range only logs a warning and still runs the spin.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to the generic weightedPick: total weight, random roll, cumulative scan, last-item fallback. Only ...
- 🔴 **src/engine.ts** `checkLine` — Logic matches lineWins in paytable.ts: same wild-lead resolution, same run counting, same >=3 threshold. Only the ret...
- 🔴 **src/paytable.ts** `lineWins` — Logic identical to checkLine: same WILD-lead resolution, same WILD/SCATTER rejection, same run counting, same thresho...
- 🔴 **src/rng.ts** `weightedPick` — Line-for-line identical algorithm (total weight, random roll, cumulative scan, last-item fallback) with only variable...

### 🏗️ Overengineering

> 1 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class wraps a simple loop over spinReel. A plain function would do. `rowCount` parameter is unused. Factory pattern f...

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

Run `2026-10-25_122510` · 2.1 min · $1.75

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.1m | $0.07 | 4 / 1263 |
| duplication | 11 | 0.3m | $0.14 | 8 / 2331 |
| correction | 11 | 0.9m | $0.45 | 22 / 5840 |
| overengineering | 10 | 0.5m | $0.29 | 20 / 3031 |
| best_practices | 10 | 1.5m | $0.45 | 20 / 14841 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 168ms |
| estimate | 148ms |
| triage | 2ms |
| rag-index | 54.7s |
| flows | 20ms |
| flow-doc | 0ms |
| review | 19.6s |
| refinement | 50.3s |

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

*Generated: 2026-10-25T11:27:17.116Z*
