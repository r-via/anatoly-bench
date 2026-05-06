<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **6 min** — **$4.78** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 70 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 2 high · 2 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 5 high · 2 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 2 high · 2 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 3 high · 6 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 3 high · 2 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 5 high · 3 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house edge applied in wrong direction (multiplier >1 inflates payouts instead of reducing th...
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range index yields undefined weights, causing a TypeError inside pickFromWeighted.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime and 0 type-only importers
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime and 0 type-only importers
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported symbol with 0 importers across the codebase. No consumers found.

### 📋 Duplication

> Showing top 2 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine in engine.ts: both determine leading symbol, count consecutive matches with WILD wildcar...
- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight algorithm with same control flow. RAG score 0.839 (>0.82 threshold) and source code compa...

### 🏗️ Overengineering

> Showing top 1 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Function is imported by engine.ts and legacy.ts — critical path with no coverage for any count b...
- 🔴 **src/engine.ts** `computePayout` — No test file exists for this module. Critical logic (HOUSE_EDGE application, bet bonus, Math.ceil) is entirely untested.
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. String constant used as event key in engine.ts; its usage as a trigger for done-state logic is u...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — neither happy path nor edge...

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: description of what 'multiplier' means (applied to line bet?), valid rang...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc explaining what event this constant names, when it is emitted, or what arguments handlers receive.
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No JSDoc/TSDoc comment. Key non-obvious behavior — that `_rowCount` is silently ignored because `spinReel` fixes reel...
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. that it counts al...
- 🔴 **src/freespin.ts** `handleFreeSpins` — No JSDoc comment. Missing description of the three distinct state transitions (trigger, retrigger, decrement/deactiva...

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


## Degraded Reviews

> One or more axis evaluators crashed for these files. Verdicts may be unreliable — re-run recommended.

- `src/freespin.ts` — crashed: overengineering

## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-06_postrefactor` · 6.3 min · $4.78
 · 1 degraded reviews

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.0m | $0.07 | 40 / 10517 |
| duplication | 10 | 1.5m | $0.09 | 50 / 12357 |
| correction | 10 | 10.1m | $1.48 | 28 / 40901 |
| overengineering | 9 | 6.3m | $0.65 | 24 / 10929 |
| tests | 10 | 4.9m | $0.31 | 24 / 2394 |
| best_practices | 10 | 22.2m | $1.42 | 24 / 47348 |
| documentation | 10 | 5.3m | $0.48 | 27 / 7124 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 132ms |
| estimate | 138ms |
| triage | 1ms |
| rag-index | 58.1s |
| review | 317.0s |
| refinement | 19ms |
| internal-docs | 2ms |

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

*Generated: 2026-05-06T16:20:11.622Z*
