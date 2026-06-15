<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **10 min** — **$5.83** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 76 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 81% OK | 5 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 2 high · 2 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 6 med · 17 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 4 high · 4 med · 7 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.1 / 10 | 6 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 5 of 8 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Three independent defects: inverted house-edge sign, unconditional +1% bet addition, and ceiling rounding — together ...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range value makes weights undefined, causing TypeError inside pickFromWeighted.
- 🟡 **src/reels.ts** `getReelWeights` — Two independent defects: returns undefined for out-of-range index (violates number[] return type), and exposes mutabl...
- 🟡 **src/reels.ts** `getReelSymbols` — Returns mutable reference to internal SYMBOLS array; external mutation creates item/weight index misalignment in pick...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers and 0 type-only importers.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers and 0 type-only importers.
- 🔴 **src/engine.ts** `Bet` — Exported type with zero runtime importers and zero type-only importers. Not used anywhere.
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 2 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — RAG score 0.831 with identical core logic. Both functions perform the same algorithm: find consecutive matching symbo...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins in paytable.ts. Both handle WILD as leading symbol, check for SCATTER, count consecutive ...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Auto-resolved: import verified on disk (spinReel found in ./reels.js)
- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in EventEmitter (available via `import { EventEmitter } from 'events'` with no install). T...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. HOUSE_EDGE application on positive total, unconditional bet*0.01 bonus, Math.ceil rounding, and ...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Auto-resolved: import verified on disk (spinReel found in ./reels.js)
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by engine.ts and legacy.ts — a critical payout calculation path with zero test coverage...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. Critical logic — WILD substitution, SCATTER short-circuit, run-length counting, minimum run of 3...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Auto-resolved: import verified on disk (spinReel found in ./reels.js)
- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc. Missing description of parameters (symbol identity constraints, valid count range), return semantics (multi...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. An exported event name constant should document when it is emitted and what args, if any, accompany it.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Purpose is inferrable from name, but return value semantics (total count across all reels/symbols) ...

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

Run `2026-05-13_194550` · 9.7 min · $5.83

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.06 | 40 / 7230 |
| duplication | 11 | 1.2m | $0.08 | 40 / 10777 |
| correction | 11 | 12.5m | $1.59 | 33 / 51539 |
| overengineering | 10 | 3.2m | $0.52 | 30 / 10877 |
| tests | 10 | 1.1m | $0.30 | 30 / 3409 |
| best_practices | 10 | 19.3m | $2.30 | 30 / 80309 |
| documentation | 10 | 1.2m | $0.30 | 30 / 3697 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 178ms |
| estimate | 129ms |
| triage | 1ms |
| rag-index | 48.8s |
| internal-docs | 2ms |
| doc-conflict-update | 81.6s |
| review | 283.0s |
| refinement | 158.6s |

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

*Generated: 2026-05-13T17:55:30.975Z*
