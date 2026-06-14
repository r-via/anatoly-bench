<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **9 min** — **$3.18** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 76 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 2 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 4 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 5 high · 7 med · 17 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 2 high · 4 med · 9 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.8 / 10 | 7 high · 5 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 5 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/engine.ts** `computePayout` — Two independent bugs: HOUSE_EDGE applied in the wrong direction (×1.05 inflates payouts instead of reducing them) and...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers and 0 type-only importers per exhaustive import analysis
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers and 0 type-only importers per exhaustive import analysis
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — 98% identical weighted selection algorithm — only variable names and type specificity differ
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm to pickFromWeighted: both perform weighted random selection via cumulative weight accumulation. S...
- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine: finds lead symbol, counts consecutive matches including WILDs, returns symbol+count if ...
- 🔴 **src/engine.ts** `checkLine` — Identical semantic logic to lineWins in paytable.ts. Both functions identify leading symbol, count consecutive matche...

### 🏗️ Overengineering

> Showing top 2 of 4 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class exists solely to satisfy the unnecessary abstract hierarchy. The body is a trivial loop over `spinReel(i)` — a ...
- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in EventEmitter (on/off/emit over a Map) — Node's `events` module is always available, no ...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Imported by src/engine.ts.
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item i...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file. Used by engine.ts and legacy.ts — critical payout logic with count branching (3/4/5) and unknown-symbol...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant used by src/engine.ts as an event name key; no tests verify its value or integration us...

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. Name is clear, but no note that index order aligns with getReelWeights output — a ...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc on this exported function. Missing: description of purpose, @param for symbol and count, @returns explaining...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. The constant's purpose — event name emitted after each spin with a SpinResult payload — is not inferable fr...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No JSDoc/TSDoc. Has a subtle, non-obvious behavior: `_rowCount` is silently ignored and row count is always determine...

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

Run `2026-05-20_173359` · 9.0 min · $3.18
 · 1 degraded reviews

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.5m | $0.09 | 40 / 15291 |
| duplication | 11 | 1.1m | $0.06 | 40 / 9256 |
| correction | 11 | 15.9m | $1.04 | 30 / 43877 |
| overengineering | 10 | 2.9m | $0.33 | 30 / 8696 |
| tests | 10 | 1.0m | $0.08 | 30 / 2706 |
| best_practices | 9 | 18.3m | $1.06 | 24 / 51282 |
| documentation | 10 | 2.3m | $0.16 | 30 / 7524 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 156ms |
| estimate | 120ms |
| triage | 2ms |
| rag-index | 8.2s |
| internal-docs | 4ms |
| rag-index-update | 2ms |
| doc-conflict-update | 5.6s |
| review | 417.2s |
| refinement | 110.9s |

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

*Generated: 2026-05-20T15:43:02.701Z*
