<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **5 min** — **$4.11** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 23 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 3 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨🟨⬜ 90% lean | 1 high · 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.9 / 10 | 3 critical · 2 high · 1 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> Showing top 3 of 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — House edge applied in the wrong direction (inflates payout 5% instead of reducing it); also rounds up instead of down.
- 🟡 **src/factories.ts** `StandardReelBuilderFactory` — _rowCount parameter is silently ignored — spinReel returns a fixed 3-symbol reel regardless of rowCount, so callers r...
- 🟡 **src/freespin.ts** `handleFreeSpins` — Re-trigger branch adds 10 free spins without consuming the current free spin, over-awarding by 1 spin.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins in src/paytable.ts — same WILD-skip lead detection, same sequential run count loop, sa...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: both compute total weight via reduce, roll Math.random() * total, a...
- 🔴 **src/rng.ts** `weightedPick` — Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, draw Math.random() * to...
- 🔴 **src/paytable.ts** `lineWins` — Algorithm is identical to checkLine in src/engine.ts: both resolve the lead non-WILD symbol, guard on WILD/SCATTER, c...

### 🏗️ Overengineering

> 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — Hand-rolled DI container (register/resolve on a Map) for three symbols that are already statically imported at the to...
- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in EventEmitter (on/off/emit over a Map<string, handler[]>) with zero additional behavior....
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wrapping a 4-line for-loop calling spinReel. `_rowCount` is accepted but unused, revealing the abstract...

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

Run `2026-10-25_121825` · 5.0 min · $4.11

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.6m | $0.12 | 6 / 3161 |
| duplication | 11 | 0.9m | $0.21 | 12 / 4812 |
| correction | 11 | 8.1m | $1.03 | 33 / 36122 |
| overengineering | 10 | 2.6m | $0.47 | 30 / 9888 |
| best_practices | 10 | 12.2m | $1.20 | 30 / 55310 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 146ms |
| estimate | 107ms |
| triage | 1ms |
| rag-index | 10.6s |
| flows | 14ms |
| flow-doc | 0ms |
| review | 138.7s |
| refinement | 150.5s |

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

*Generated: 2026-10-25T11:23:27.034Z*
