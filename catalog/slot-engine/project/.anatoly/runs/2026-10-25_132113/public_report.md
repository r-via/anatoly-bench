<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **2 min** — **$1.68** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 28 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 3 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 86% used | 4 high · 2 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 80% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 3 critical · 2 high · 7 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> Showing top 3 of 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — The house edge is applied as a bonus. A flat bet-based payout is added on losing spins. Math.ceil rounds payouts up.
- 🟡 **src/reels.ts** `DEFAULT_WEIGHTS` — DIAMOND weight 30 is the highest of all symbols, so the premium symbol is the most common. The paytable is not shown,...
- 🟡 **src/engine.ts** `spin` — The README defines Bet as 1..100, but bets above 100 only log a warning and are still played.

### ♻️ Utility

> Showing top 4 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Same algorithm as weightedPick: sum weights, random roll, cumulative scan, fall back to last item. Differs only in th...
- 🔴 **src/paytable.ts** `lineWins` — Line-for-line identical logic to checkLine: resolves lead symbol skipping leading WILDs, returns null for WILD/SCATTE...
- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins: resolves the lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts the r...
- 🔴 **src/rng.ts** `weightedPick` — Logic is identical to pickFromWeighted: sum weights, draw Math.random()*total, walk cumulative weights, return the fi...

### 🏗️ Overengineering

> 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — Untyped DI registry (Map<string, unknown> with unchecked cast) wrapping three statically importable functions. Single...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class wrapping a loop over spinReel with no state. A plain function would do. It has one importer and ignores the _ro...

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

Run `2026-10-25_132113` · 2.5 min · $1.68

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.1m | $0.04 | 4 / 1272 |
| duplication | 11 | 0.3m | $0.12 | 8 / 2436 |
| correction | 11 | 1.5m | $0.43 | 22 / 9341 |
| overengineering | 10 | 0.6m | $0.21 | 20 / 3258 |
| best_practices | 10 | 2.1m | $0.53 | 24 / 21005 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 272ms |
| estimate | 165ms |
| triage | 1ms |
| rag-index | 44.3s |
| flows | 24ms |
| flow-doc | 1ms |
| review | 30.4s |
| refinement | 72.0s |

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

*Generated: 2026-10-25T12:23:41.730Z*
