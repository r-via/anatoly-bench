<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **3 min** — **$1.24** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 5 findings in 5 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 89% OK | 4 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% used | All clear | — |
| Duplication | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% unique | All clear | — |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% lean | All clear | — |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> Showing top 4 of 5 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/dispatcher.ts** `runSchedule` — Off-by-one in dispatched-queue cleanup: condition `d > 0` skips index 0, so the first dispatched train (and the only ...
- 🟡 **src/interlocking.ts** `isBlockFree` — Queries `blockHolder` with `currentBlock` instead of `block`; the first parameter is dead and the wrong block is chec...
- 🟡 **src/signals.ts** `canEnterBlock` — Off-by-one in headway check enforces a 2-tick gap instead of the documented 3-tick minimum.
- 🟡 **src/timetable.ts** `TIMETABLE` — T6_LOC route traverses bS2→bS1→bM2 (reverse direction) while T5_EXP departs the same tick going bM2→bS1→bS2, creating...

### ♻️ Utility

✨ **CLEAN** — No issues found!

### 📋 Duplication

✨ **CLEAN** — No issues found!

### 🏗️ Overengineering

✨ **CLEAN** — No issues found!

### 🧪 Tests

✨ **CLEAN** — No issues found!

### 📝 Documentation

✨ **CLEAN** — No issues found!

### ✅ Best Practices

✨ **CLEAN** — No issues found!

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/39) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/39) | Exported symbols with at least a partial inline doc comment |


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-15_071706` · 3.4 min · $1.24

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| correction | 10 | 7.0m | $0.95 | 30 / 26106 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 174ms |
| estimate | 120ms |
| triage | 1ms |
| rag-index | 83.9s |
| review | 115.4s |
| refinement | 21ms |

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

*Generated: 2026-06-15T05:20:28.639Z*
