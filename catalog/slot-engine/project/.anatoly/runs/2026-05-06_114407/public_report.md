<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **15 files** reviewed in **6 min** — **$5.11** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 71 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟨🟨🟨🟨🟨🟨🟨🟨🟨⬜ 86% OK | 2 high · 4 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 7 med · 18 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 2 high · 4 med · 9 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.4 / 10 | 4 high · 3 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 6 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Two independent defects: house edge applied in wrong direction (player advantage, not house advantage), and an undocu...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers. No files import this symbol.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers. No files import this symbol.
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported symbol with 0 importers across the codebase. No consumers found.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported symbol with 0 importers across the codebase. No consumers found.

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine: same WILD/SCATTER handling, same consecutive-symbol-matching algorithm, same >= 3 thres...
- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted selection algorithm. RAG score 0.865. Logic matches: calculate total, generate random, accumulate ...
- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight algorithm as pickFromWeighted. Both compute total via reduce, generate random roll, itera...

### 🏗️ Overengineering

> Showing top 1 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. Exported function with a buggy HOUSE_EDGE application (increases rather than reduces payout), mi...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant used by src/engine.ts as an event name; not verified in any test that it matches expect...
- 🔴 **src/freespin.ts** `detectScatters` — No test file exists. Used by engine.ts for a critical game mechanic — scatter counting across all reels — with no cov...
- 🔴 **src/jackpot.ts** `isJackpotHit` — No test file exists. Critical game logic used by src/engine.ts has zero coverage — no tests for threshold boundary (3...

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc explaining what event this constant represents, when it is emitted, or what arguments handlers receive.
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing: parameter description for `reels`, return value semantics (total count across all position...
- 🔴 **src/jackpot.ts** `isJackpotHit` — No JSDoc/TSDoc comment. Missing description of purpose, parameter semantics (shape/dimensions of reels array), return...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. Should document that it returns the shared SYMBOLS reference and that mutation wou...
- 🔴 **src/strategy.ts** `SpinStrategy` — No JSDoc comment. Abstract base class with non-obvious extension contract (post-calculation payout adjustment hook) d...

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

**Gaps:** 1 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-06_114407` · 6.4 min · $5.11

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 13 | 0.8m | $0.06 | 40 / 7975 |
| duplication | 13 | 1.6m | $0.09 | 50 / 12878 |
| correction | 13 | 10.5m | $1.31 | 37 / 39184 |
| overengineering | 12 | 3.2m | $0.50 | 36 / 9111 |
| tests | 12 | 1.4m | $0.30 | 36 / 3067 |
| best_practices | 12 | 16.8m | $1.96 | 36 / 65969 |
| documentation | 12 | 1.8m | $0.38 | 30 / 6054 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 65ms |
| estimate | 126ms |
| triage | 1ms |
| rag-index | 8.2s |
| review | 180.4s |
| refinement | 193.8s |
| internal-docs | 3ms |

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

*Generated: 2026-05-06T09:50:30.326Z*
