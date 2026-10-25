<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **6 min** — **$3.30** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 27 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 4 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨🟨⬜ 90% lean | 1 high · 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 8.2 / 10 | 3 critical · 2 high · 5 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — House edge applied in the wrong direction (amplifies payout instead of reducing it) and Math.ceil rounds up, over-pay...
- 🟡 **src/freespin.ts** `handleFreeSpins` — Retrigger branch (state.active && scatters >= 3) adds 10 free spins but does not consume the current free spin, viola...
- 🟡 **src/engine.ts** `spin` — bet > 100 violates the Bet 1..100 contract but is only warned, not rejected.
- 🟡 **src/factories.ts** `StandardReelBuilderFactory` — rowCount is silently ignored; spinReel always returns 3 symbols regardless of rowCount, so builds with rowCount != 3 ...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight algorithm: compute total, scale Math.random(), accumulate per item, return last as fallba...
- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins in src/paytable.ts — same WILD substitution (find first non-WILD), same SCATTER guard,...
- 🔴 **src/paytable.ts** `lineWins` — Logic is structurally identical to checkLine in src/engine.ts: same WILD-lead resolution, same consecutive-match loop...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is functionally identical to weightedPick in src/rng.ts: both reduce weights to total, multiply Math.random() b...

### 🏗️ Overengineering

> 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — Mini IoC container for 3 values that are already available as module-level imports (`weightedPick`, `getPayMultiplier...
- 🔴 **src/events.ts** `SpinEventEmitter` — NIH: reimplements Node.js built-in `EventEmitter` (on/off/emit) for a single consumer (`engine.ts::spin`). Node's `re...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — A class wrapping a trivial loop over `spinReel(i)`. The `_rowCount` parameter is accepted but silently ignored, indic...

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

Run `2026-10-25_132657` · 5.6 min · $3.30

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.7m | $0.07 | 6 / 3668 |
| duplication | 11 | 1.0m | $0.09 | 12 / 4864 |
| correction | 11 | 8.0m | $0.91 | 33 / 32920 |
| overengineering | 10 | 2.8m | $0.20 | 30 / 9812 |
| best_practices | 10 | 11.7m | $1.07 | 30 / 47184 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 198ms |
| estimate | 146ms |
| triage | 2ms |
| rag-index | 11.1s |
| flows | 64ms |
| flow-doc | 1ms |
| review | 147.2s |
| refinement | 172.9s |

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

*Generated: 2026-10-25T12:32:31.419Z*
