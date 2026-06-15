<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **9 min** — **$3.66** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 72 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 4 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 7 high · 3 med · 19 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 4 high · 2 med · 9 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 5 high · 5 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range index yields undefined weights, crashing in pickFromWeighted.
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house-edge applied in the wrong direction (boosts payouts above 100% RTP instead of reducing...
- 🟡 **src/reels.ts** `getReelWeights` — Returns the internal REEL_WEIGHTS[reelIndex] array by reference; callers can mutate reel weights, violating the docum...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers and 0 type-only importers
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers and 0 type-only importers
- 🔴 **src/engine.ts** `Bet` — Exported type not imported by any file. Zero runtime and type-only importers.
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Duplicate of checkLine. Identical logic: find leading non-WILD symbol, validate non-WILD/SCATTER, count consecutive m...
- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted random selection algorithm. Same logic flow and fallback behavior; variable names differ (acc/cumu...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins: finds lead symbol, checks sequences with WILD support, returns match or null
- 🔴 **src/rng.ts** `weightedPick` — Identical weighted random selection algorithm. Both functions use cumulative weight accumulation, uniform random draw...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class wrapping a single delegating method with only 1 importer. The entire class reduces to `spinReel(i)` per reel — ...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls a pub/sub system (on/off/emit) that Node.js `EventEmitter` provides as a built-in. One importer. Per inter...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Function is imported by src/engine.ts and src/legacy.ts, making untested count/symbol boundary l...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Imported by src/factories.ts — a critical path with no coverage.
- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD substitution logic, SCATTER early-exit, run-length threshold (<3), and all-WILD edge cases ...
- 🔴 **src/engine.ts** `evaluateLine` — No test file exists. Wild-count multiplier compounding (basePayout * (1+wc) * 2^wc) is a critical financial calculati...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc. Missing: what `count` represents (consecutive matching symbols on a line), what the returned number is a mu...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), explanation that it returns 3 independen...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment. The constant's value is visible but there is no documentation of when it is emitted, what args are ...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of what constitutes a scatter count, the grid traversal approach, and return va...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 cached)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |
| Module guides | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% (0/0) | Modules > 200 LOC with a dedicated page in docs/ |
| Reference pages | 18 pages | Anatoly-generated module and API reference pages |

> No `docs/` directory found. Copy `.anatoly/docs/` to `docs/` to adopt the generated documentation and speed up future Anatoly runs.

**Gaps:** 4 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-20_135602` · 9.3 min · $3.66

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.7m | $0.13 | 40 / 16620 |
| duplication | 11 | 1.3m | $0.11 | 40 / 12806 |
| correction | 11 | 10.3m | $0.81 | 33 / 37157 |
| overengineering | 10 | 3.1m | $0.34 | 30 / 8951 |
| tests | 10 | 1.0m | $0.17 | 30 / 3096 |
| best_practices | 10 | 17.7m | $1.17 | 30 / 63563 |
| documentation | 10 | 2.5m | $0.28 | 30 / 8435 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 138ms |
| estimate | 107ms |
| triage | 1ms |
| rag-index | 12.0s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 6.1s |
| review | 351.3s |
| refinement | 188.9s |

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

*Generated: 2026-05-20T12:05:22.395Z*
