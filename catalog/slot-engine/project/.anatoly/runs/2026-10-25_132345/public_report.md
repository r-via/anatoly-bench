<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **3 min** — **$1.93** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 29 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 2 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 86% used | 4 high · 2 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 80% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.7 / 10 | 3 critical · 5 high · 6 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> Showing top 2 of 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — The house edge is applied as a bonus, losing spins get a payout, and the result is rounded up. All three break the do...
- 🟡 **src/engine.ts** `spin` — Bets above 100 only trigger console.warn. The README defines Bet as 1..100 and the code's own message says 'exceeds m...

### ♻️ Utility

> Showing top 4 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Same algorithm as weightedPick: sum weights, Math.random() * total, cumulative scan with r < acc, fallback to last it...
- 🔴 **src/paytable.ts** `lineWins` — Logic matches checkLine line for line: WILD-lead resolution, WILD/SCATTER rejection, consecutive run counting with WI...
- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER leads, counts con...
- 🔴 **src/rng.ts** `weightedPick` — Line-for-line identical algorithm to pickFromWeighted (sum weights, Math.random roll, cumulative scan, fallback to la...

### 🏗️ Overengineering

> 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — DI container with untyped string-keyed registry for three statically imported functions used in one place. Adds indir...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class wraps a loop over spinReel with no state. The `_rowCount` parameter is unused. A plain function `buildReels(ree...

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

Run `2026-10-25_132345` · 3.2 min · $1.93

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.2m | $0.04 | 4 / 1278 |
| duplication | 11 | 0.3m | $0.12 | 8 / 2492 |
| correction | 11 | 1.3m | $0.34 | 22 / 9534 |
| overengineering | 10 | 0.7m | $0.21 | 20 / 3311 |
| best_practices | 10 | 2.0m | $0.38 | 20 / 18847 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 316ms |
| estimate | 272ms |
| triage | 1ms |
| rag-index | 53.7s |
| flows | 30ms |
| flow-doc | 0ms |
| review | 30.7s |
| refinement | 103.6s |

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

*Generated: 2026-10-25T12:26:55.757Z*
