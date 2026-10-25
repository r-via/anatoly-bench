<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **2 min** — **$1.39** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 25 findings in 10 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 95% OK | 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 86% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 80% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.7 / 10 | 4 critical · 4 high · 3 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> 2 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — The house edge is added instead of subtracted, a flat 1% of the bet is paid on every spin, and the result is rounded up.
- 🟡 **src/engine.ts** `spin` — Bets above the documented maximum of 100 only trigger a console.warn and are processed anyway.

### ♻️ Utility

> Showing top 5 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Same algorithm as weightedPick: sum weights, roll Math.random() * total, accumulate until roll < cumulative, fall bac...
- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins in paytable.ts: same wild-lead resolution, same WILD/SCATTER rejection, same run count...
- 🔴 **src/paytable.ts** `lineWins` — Logic identical to checkLine: same wild-leading lead resolution, same WILD/SCATTER bail-out, same run counting, same ...
- 🔴 **src/rng.ts** `weightedPick` — Line-for-line identical logic to pickFromWeighted: sums weights, draws Math.random()*total, walks cumulative weights,...

### 🏗️ Overengineering

> 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — DI container with untyped string-keyed registry used for three statically imported functions that could be called dir...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class wraps a loop over spinReel. A plain function buildReels(reelCount) would do. The factory pattern has one use, a...

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

Run `2026-10-25_125839` · 2.2 min · $1.39

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.2m | $0.04 | 4 / 1303 |
| duplication | 11 | 0.3m | $0.12 | 8 / 2523 |
| correction | 11 | 1.1m | $0.33 | 22 / 7991 |
| overengineering | 10 | 0.6m | $0.21 | 20 / 3272 |
| best_practices | 10 | 2.2m | $0.39 | 20 / 20410 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 280ms |
| estimate | 193ms |
| triage | 1ms |
| rag-index | 49.8s |
| flows | 23ms |
| flow-doc | 0ms |
| review | 24.3s |
| refinement | 56.2s |

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

*Generated: 2026-10-25T12:00:51.922Z*
