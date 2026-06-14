<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **13 min** — **$5.96** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 70 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 2 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 6 med · 19 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 2 high · 4 med · 9 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.3 / 10 | 4 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 5 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — House edge applied in the wrong direction (inflates payout by 5%, RTP > 100%); payout also rounds up instead of down.
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files per pre-computed analysis
- 🔴 **src/engine.ts** `Bet` — Exported type; 0 runtime importers, 0 type-only importers.
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files per pre-computed analysis
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Semantic match with checkLine: identical logic for detecting consecutive matching symbols, counting runs, and filteri...
- 🔴 **src/rng.ts** `weightedPick` — Identical weighted random selection via cumulative-weight iteration. Both compute total weight, generate random value...
- 🔴 **src/engine.ts** `checkLine` — Identical algorithm to lineWins in paytable.ts (score 0.835). Both detect winning symbol runs by counting consecutive...

### 🏗️ Overengineering

> Showing top 1 of 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls on/off/emit against a Map<string, EventHandler[]> — a verbatim reimplementation of Node.js's built-in Even...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. Critical path: applies house edge incorrectly (adds edge instead of reducing, then adds flat 1% ...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout path. Missing tests for all symbol...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Imported by src/engine.ts.
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant string used by src/engine.ts as an event name — no tests verify its value or usage.

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported function with no JSDoc. Missing: param descriptions for symbol and count, return value semantics, behavior f...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. No explanation of why callers would need the canonical symbol list or that order m...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. Event name constant with no explanation of when it is emitted or what args handlers should expect.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics.

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

Run `2026-05-19_165728` · 12.8 min · $5.96

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.1m | $0.06 | 40 / 9582 |
| duplication | 11 | 1.5m | $0.09 | 40 / 12768 |
| correction | 11 | 10.2m | $0.83 | 30 / 40204 |
| overengineering | 10 | 3.5m | $0.36 | 30 / 10531 |
| tests | 10 | 0.9m | $0.08 | 30 / 2752 |
| best_practices | 10 | 15.4m | $1.10 | 30 / 59597 |
| documentation | 10 | 1.9m | $0.24 | 30 / 6569 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 177ms |
| estimate | 122ms |
| triage | 1ms |
| bootstrap-doc | 322.3s |
| doc-conflict-bootstrap | 24ms |
| rag-index | 46.6s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 9.4s |
| review | 315.5s |
| refinement | 71.8s |

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

*Generated: 2026-05-19T15:10:16.321Z*
