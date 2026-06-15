<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **15 files** reviewed in **11 min** — **$4.52** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 27 findings in 10 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 4 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% documented | — | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.5 / 10 | 5 high · 5 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 4 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Three independent defects: house edge applied in the wrong direction (increases payout instead of deducting), uncondi...
- 🟡 **src/rng.ts** `weightedPick` — Two independent correctness defects: non-certifiable RNG source for a regulated gaming context, and missing guard for...
- 🟡 **src/freespin.ts** `handleFreeSpins` — When free spins are triggered for the first time (scatters >= 3, !state.active), the function sets state.remaining = ...
- 🟡 **src/engine.ts** `spin` — Throws a bare string instead of an Error object; resolved `rng` and `reelsModule` are never used, bypassing the confi...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers per exhaustive import analysis
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Weighted random selection using cumulative weight accumulation. Identical logic to weightedPick in src/rng.ts with RA...
- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight algorithm. Both functions compute total weight, generate random roll, accumulate weights ...
- 🔴 **src/engine.ts** `checkLine` — Identical semantic logic to lineWins from paytable.ts (similarity 0.841). Both functions detect consecutive symbol ru...
- 🔴 **src/paytable.ts** `lineWins` — Identical core logic to checkLine: determines first non-WILD symbol, rejects WILD/SCATTER, counts consecutive matches...

### 🏗️ Overengineering

> 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — A hand-rolled IoC/DI container (register + resolve with an untyped Map<string, unknown>) whose sole purpose is to hol...
- 🔴 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### 🧪 Tests

✨ **CLEAN** — No issues found!

### 📝 Documentation

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/documentation/index.md)

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 cached)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with at least a partial inline doc comment |
| Module guides | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% (0/0) | Modules > 200 LOC with a dedicated page in docs/ |
| Reference pages | 18 pages | Anatoly-generated module and API reference pages |

> No `docs/` directory found. Copy `.anatoly/docs/` to `docs/` to adopt the generated documentation and speed up future Anatoly runs.

**Gaps:** 1 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-04-28_111200` · 10.5 min · $4.52

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 13 | 0.7m | $0.04 | 40 / 6472 |
| duplication | 13 | 1.2m | $0.06 | 40 / 10672 |
| correction | 13 | 7.2m | $1.10 | 35 / 29886 |
| overengineering | 12 | 3.8m | $0.61 | 36 / 12369 |
| best_practices | 12 | 20.2m | $2.32 | 36 / 79474 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 80ms |
| estimate | 125ms |
| triage | 2ms |
| rag-index | 31.2s |
| review | 248.3s |
| refinement | 171.0s |
| internal-docs | 4ms |

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

*Generated: 2026-04-28T09:22:33.332Z*
