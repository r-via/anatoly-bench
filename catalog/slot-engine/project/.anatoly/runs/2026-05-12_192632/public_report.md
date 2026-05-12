<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **11 min** — **$5.66** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 75 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 81% OK | 6 high · 2 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 83% lean | 4 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 7 high · 6 med · 16 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 5 high · 3 med · 7 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.3 / 10 | 4 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 5 of 8 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range value yields undefined weights, crashing in pickFromWeighted at wts.reduce.
- 🟡 **src/engine.ts** `computePayout` — House edge applied in the wrong direction (1+HOUSE_EDGE inflates payout instead of reducing it); Math.ceil rounds pay...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `getReelWeights` — Two independent defects: missing bounds check returns undefined typed as number[], and the returned array is the live...
- 🟡 **src/reels.ts** `getReelSymbols` — Returns direct reference to internal SYMBOLS array; callers can mutate it, corrupting symbol-to-weight mapping for al...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers. Never used by any file.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers. Never imported by any file.
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Semantically identical to checkLine—both handle WILD replacement, early exit on WILD/SCATTER, loop with identical bre...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins in src/paytable.ts (RAG score 0.834). Both validate symbols, find consecutive runs from f...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm: cumulative-weight weighted selection via reduce and iterative accumulation. Variable names diffe...

### 🏗️ Overengineering

> Showing top 2 of 4 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Wraps a trivial for-loop in a full class hierarchy. The `_rowCount` parameter is silently ignored, leaking an ill-fit...
- 🔴 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/reels.ts** `spinReel` — No test file. Imported by src/factories.ts; returns 3-symbol column per reel. Output length, valid symbol membership,...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file. Imported by src/engine.ts and src/legacy.ts — a critical pay calculation path — with zero coverage. Mis...
- 🔴 **src/engine.ts** `computePayout` — No test file exists. House-edge application (note: comment says ~95% RTP but code adds HOUSE_EDGE making payout large...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant imported by src/engine.ts as an event key; no tests verify its value or usage contract.

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: what reelIndex range is valid, that it returns 3 symbols (one per row), a...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing @param descriptions, @returns explanation, and no note that WILD/SCATTER (or unknown symbol...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. Purpose (event name emitted after every spin completes), expected payload type (SpinResult), and the typo-p...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. counts all SCATTE...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 new)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |
| Module guides | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% (0/0) | Modules > 200 LOC with a dedicated page in docs/ |
| Reference pages | 18 pages | Anatoly-generated module and API reference pages |

> No `docs/` directory found. Copy `.anatoly/docs/` to `docs/` to adopt the generated documentation and speed up future Anatoly runs.

**Gaps:** 1 pages to create.

<details>
<summary><strong>New pages generated (18)</strong></summary>

- .anatoly/docs/01-Getting-Started/01-Overview.md  (from scaffolded)
- .anatoly/docs/01-Getting-Started/02-Installation.md  (from scaffolded)
- .anatoly/docs/01-Getting-Started/03-Configuration.md  (from scaffolded)
- .anatoly/docs/01-Getting-Started/04-Quick-Start.md  (from scaffolded)
- .anatoly/docs/02-Architecture/01-System-Overview.md  (from scaffolded)
- .anatoly/docs/02-Architecture/02-Core-Concepts.md  (from scaffolded)
- .anatoly/docs/02-Architecture/03-Data-Flow.md  (from scaffolded)
- .anatoly/docs/02-Architecture/04-Design-Decisions.md  (from scaffolded)
- .anatoly/docs/03-Guides/01-Common-Workflows.md  (from scaffolded)
- .anatoly/docs/03-Guides/02-Advanced-Configuration.md  (from scaffolded)
- .anatoly/docs/03-Guides/03-Troubleshooting.md  (from scaffolded)
- .anatoly/docs/04-API-Reference/01-Public-API.md  (from scaffolded)
- .anatoly/docs/04-API-Reference/02-Configuration-Schema.md  (from scaffolded)
- .anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md  (from scaffolded)
- .anatoly/docs/05-Development/01-Source-Tree.md  (from scaffolded)
- .anatoly/docs/05-Development/02-Build-and-Test.md  (from scaffolded)
- .anatoly/docs/05-Development/03-Code-Conventions.md  (from scaffolded)
- .anatoly/docs/05-Development/04-Release-Process.md  (from scaffolded)

</details>


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-12_192632` · 10.7 min · $5.66

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.7m | $0.09 | 40 / 6319 |
| duplication | 11 | 1.2m | $0.11 | 40 / 9804 |
| correction | 11 | 9.2m | $1.40 | 33 / 42734 |
| overengineering | 10 | 3.6m | $0.59 | 30 / 12470 |
| tests | 10 | 1.1m | $0.30 | 30 / 3473 |
| best_practices | 10 | 17.7m | $2.20 | 30 / 75288 |
| documentation | 10 | 1.7m | $0.40 | 30 / 5242 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 210ms |
| estimate | 151ms |
| triage | 1ms |
| rag-index | 9.8s |
| internal-docs | 4ms |
| doc-conflict-detection | 130.8s |
| review | 275.0s |
| refinement | 222.5s |

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

*Generated: 2026-05-12T17:37:12.966Z*
