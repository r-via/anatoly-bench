<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **3 min** — **$0.99** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 2 critical bugs found · 34 findings in 10 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 91% OK | 2 critical · 1 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% used | All clear | — |
| Duplication | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% unique | All clear | — |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 75% lean · 25% acceptable | All clear | — |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟥🟥⬜⬜⬜⬜⬜⬜⬜⬜ 23% documented | 3 high · 1 med · 26 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> Showing top 3 of 4 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/interlocking.ts** `isBlockFree` — Queries `currentBlock` instead of the `block` parameter — wrong block checked, `block` is silently ignored.
- 🔴 **src/dispatcher.ts** `runSchedule` — Off-by-one in dispatched-removal loop skips the first-dispatched train, leaving it in readyQueue permanently.
- 🟡 **src/signals.ts** `canEnterBlock` — Off-by-one: `elapsed >= MIN_HEADWAY - 1` enforces a 2-tick headway instead of the documented 3-tick minimum, allowing...

### ♻️ Utility

✨ **CLEAN** — No issues found!

### 📋 Duplication

✨ **CLEAN** — No issues found!

### 🏗️ Overengineering

✨ **CLEAN** — No issues found!

### 🧪 Tests

✨ **CLEAN** — No issues found!

### 📝 Documentation

> Showing top 5 of 30 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/interlocking.ts** `isBlockFree` — No JSDoc. Exported and critically non-obvious: the `block` parameter is entirely unused; the check is against `curren...
- 🔴 **src/dispatcher.ts** `runSchedule` — Exported public API with no JSDoc comment. The README documents it in prose, but no TSDoc block appears on the functi...
- 🔴 **src/interlocking.ts** `resetInterlocking` — No JSDoc. Exported public API. Clears both maps — intended call site (simulation reset) and side effects are undocume...
- 🔴 **src/interlocking.ts** `occupyBlock` — No JSDoc. Exported public API. No documentation on preconditions (caller must call isBlockFree first) or relationship...
- 🔴 **src/interlocking.ts** `reserveSectionBlock` — No JSDoc. Exported public API with complex, non-obvious behavior: silently no-ops for all blocks except hardcoded bS1...

### ✅ Best Practices

✨ **CLEAN** — No issues found!

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 8% (3/39) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 10% (4/39) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 9 pages to create, 1 pages outdated.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-15_112827` · 2.7 min · $0.99

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| correction | 10 | 6.9m | $0.52 | 30 / 25315 |
| documentation | 10 | 3.4m | $0.34 | 30 / 11457 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 172ms |
| estimate | 121ms |
| triage | 1ms |
| rag-index | 6.5s |
| review | 100.7s |
| invariants | 141ms |
| refinement | 50.9s |

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

*Generated: 2026-06-15T09:31:07.554Z*
