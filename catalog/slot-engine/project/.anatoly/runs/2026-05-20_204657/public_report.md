<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **10 min** — **$3.75** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 76 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% OK | 1 critical · 3 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 83% lean | 4 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 7 med · 16 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 48% documented | 3 high · 3 med · 8 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.4 / 10 | 3 critical · 2 high · 6 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 4 of 7 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range access yields undefined weights, crashing pickFromWeighted.
- 🟡 **src/engine.ts** `computePayout` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `getReelWeights` — Two independent defects: mutable return exposes internal state, and missing bounds check silently returns undefined.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but never imported. 0 runtime importers, 0 type-only importers.
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/paytable.ts** `lineWins` — Exported but never imported. 0 runtime importers, 0 type-only importers.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine: finds leading non-WILD symbol, counts consecutive matches including WILDs, returns null...
- 🔴 **src/reels.ts** `pickFromWeighted` — Weighted random selection via cumulative sum and binary search. Identical algorithm and logic to weightedPick despite...
- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight selection algorithm. Both sum weights, generate uniform random draw, and accumulate to th...

### 🏗️ Overengineering

> Showing top 1 of 4 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Full custom EventEmitter (on/off/emit over a Map) reimplements Node.js built-in `EventEmitter` or `eventemitter3` (np...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No tests found. Used by engine.ts and legacy.ts in critical payout paths. Untested edge cases include unknown symbol ...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Imported by src/factories.ts; always returns 3 symbols per call — column length, valid symbol me...
- 🔴 **src/engine.ts** `computePayout` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file found. Constant used by src/engine.ts; no tests verify its value or usage contract.

### 📝 Documentation

> Showing top 5 of 14 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc on exported function. Missing: what `count` represents (run length), valid range (3–5), that WILD/SCATTER re...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), return shape (3-element column), and indepen...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. String value 'spin:done' is visible but there is no description of when this event is emitted or what argum...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D reel grid), and return...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 cached)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 7% (2/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |
| Module guides | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% (0/0) | Modules > 200 LOC with a dedicated page in docs/ |
| Reference pages | 18 pages | Anatoly-generated module and API reference pages |

> No `docs/` directory found. Copy `.anatoly/docs/` to `docs/` to adopt the generated documentation and speed up future Anatoly runs.

**Gaps:** 5 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-20_204657` · 9.6 min · $3.75

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.5m | $0.12 | 40 / 14499 |
| duplication | 11 | 1.3m | $0.08 | 40 / 10945 |
| correction | 11 | 13.5m | $1.01 | 33 / 50700 |
| overengineering | 10 | 3.0m | $0.33 | 30 / 8044 |
| tests | 10 | 1.2m | $0.17 | 30 / 3220 |
| best_practices | 10 | 20.3m | $1.25 | 27 / 55002 |
| documentation | 10 | 2.4m | $0.27 | 30 / 8173 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 136ms |
| estimate | 116ms |
| triage | 1ms |
| rag-index | 32.0s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 6.2s |
| review | 401.8s |
| refinement | 136.1s |

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

*Generated: 2026-05-20T18:56:35.675Z*
