<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **3 min** — **$1.83** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 25 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 95% OK | 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 86% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨⬜⬜ 78% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.7 / 10 | 3 critical · 3 high · 4 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> 2 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — The house edge is applied in the wrong direction, a flat payout is added on every spin, and the result rounds up. All...
- 🟡 **src/engine.ts** `spin` — The documented maximum bet of 100 is not enforced.

### ♻️ Utility

> Showing top 5 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Line-for-line identical logic to the generic weightedPick: total weights, random roll, cumulative scan, fallback to l...
- 🔴 **src/paytable.ts** `lineWins` — Line-for-line identical logic to checkLine: resolves lead symbol through leading WILDs, rejects WILD/SCATTER, counts ...
- 🔴 **src/engine.ts** `checkLine` — Logic identical to lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts run of lead ...
- 🔴 **src/rng.ts** `weightedPick` — Line-for-line identical logic to pickFromWeighted: sums weights, draws Math.random()*total, walks cumulative weights,...

### 🏗️ Overengineering

> 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — Untyped service-locator DI container for three statically imported functions. Single instance, no swapping, and resol...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wraps a loop over spinReel and has no state. `_rowCount` is unused. A plain function `buildReels(reelCo...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolled pub/sub with a single importer (spin) and a single event (SPIN_DONE). A plain callback or Node's built-in...

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

Run `2026-10-25_122934` · 2.7 min · $1.83

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.1m | $0.07 | 4 / 1278 |
| duplication | 11 | 0.3m | $0.13 | 8 / 2495 |
| correction | 11 | 1.2m | $0.38 | 22 / 8230 |
| overengineering | 10 | 0.6m | $0.27 | 20 / 3373 |
| best_practices | 10 | 2.1m | $0.51 | 20 / 21116 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 250ms |
| estimate | 194ms |
| triage | 1ms |
| rag-index | 51.7s |
| flows | 23ms |
| flow-doc | 0ms |
| review | 36.8s |
| refinement | 70.1s |

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

*Generated: 2026-10-25T11:32:15.532Z*
