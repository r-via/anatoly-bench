<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **3 min** — **$0.83** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 35 findings in 10 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 91% OK | 3 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% used | All clear | — |
| Duplication | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% unique | All clear | — |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% lean | All clear | — |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟥🟥⬜⬜⬜⬜⬜⬜⬜⬜ 21% documented | 3 high · 1 med · 27 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> Showing top 3 of 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/dispatcher.ts** `runSchedule` — Two independent defects: off-by-one in dispatched-removal loop allows re-dispatch after arrival; reservation leak whe...
- 🟡 **src/interlocking.ts** `isBlockFree` — Checks occupancy of `currentBlock` instead of the target `block`, so the function never verifies whether the destinat...
- 🟡 **src/signals.ts** `canEnterBlock` — Off-by-one in headway check: `elapsed >= MIN_HEADWAY - 1` (>= 2) permits entry after only 2 ticks when the documented...

### ♻️ Utility

✨ **CLEAN** — No issues found!

### 📋 Duplication

✨ **CLEAN** — No issues found!

### 🏗️ Overengineering

✨ **CLEAN** — No issues found!

### 🧪 Tests

✨ **CLEAN** — No issues found!

### 📝 Documentation

> Showing top 5 of 31 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/dispatcher.ts** `runSchedule` — Exported public API with no JSDoc/TSDoc. README covers high-level usage but the function itself carries no inline doc...
- 🔴 **src/interlocking.ts** `resetInterlocking` — Exported public API with no JSDoc. Clears both blockHolder and sectionReservation; callers need to know this resets a...
- 🔴 **src/interlocking.ts** `isBlockFree` — Exported public API with no JSDoc. Critically non-obvious: the `block` parameter is ignored — the lookup uses `curren...
- 🔴 **src/interlocking.ts** `occupyBlock` — Exported public API with no JSDoc. Simple operation but no description of preconditions or interaction with sectionRe...
- 🔴 **src/interlocking.ts** `reserveSectionBlock` — Exported public API with no JSDoc. Complex logic: silently succeeds for non-section blocks (bS1/bS2), implements mutu...

### ✅ Best Practices

✨ **CLEAN** — No issues found!

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 8% (3/39) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 10% (4/39) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 10 pages to create, 1 pages outdated.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-15_083719` · 2.8 min · $0.83

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| correction | 10 | 7.4m | $0.56 | 30 / 28227 |
| documentation | 10 | 3.0m | $0.27 | 30 / 11261 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 165ms |
| estimate | 132ms |
| triage | 2ms |
| rag-index | 18.3s |
| review | 147.3s |
| refinement | 19ms |

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

*Generated: 2026-06-15T06:40:06.446Z*
