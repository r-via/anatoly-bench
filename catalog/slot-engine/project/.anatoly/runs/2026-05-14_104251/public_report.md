<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **10 min** — **$5.63** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 74 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 80% OK | 5 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨🟨⬜ 88% lean | 1 high · 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 8 high · 4 med · 17 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 5 high · 3 med · 7 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.6 / 10 | 5 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 5 of 8 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Three independent defects collectively invert the house edge and push RTP well above 100%, contradicting the document...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range value yields undefined weights, causing a TypeError crash inside pickFromW...
- 🟡 **src/factories.ts** `StandardReelBuilderFactory` — `_rowCount` is accepted but silently discarded — `spinReel(i)` never receives the row count, so callers requesting no...
- 🟡 **src/reels.ts** `getReelWeights` — No bounds check returns undefined typed as number[] for out-of-range reelIndex; also exposes mutable internal weight ...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but not imported by any file
- 🔴 **src/engine.ts** `Bet` — Exported type alias with zero runtime and zero type-only importers
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but not imported by any file

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — 95% identical logic to lineWins: same lead-symbol detection, wild-skipping iteration, count >= 3 threshold; differs o...
- 🔴 **src/paytable.ts** `lineWins` — Identical algorithm to checkLine in engine.ts (RAG 0.831). Both extract leading symbol accounting for WILD, check for...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm: both reduce weights to total, draw Math.random() * total, iterate accumulating weights, return w...
- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted selection algorithm to weightedPick in src/rng.ts. Both compute total weight, generate random valu...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wrapping a single call to spinReel in a loop. Has only 1 importer and exists solely to fulfil the unnec...
- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in EventEmitter (always available, no install needed) with an identical on/off/emit API. H...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. Exported function with house-edge application, base-bet bonus, and ceil rounding has no tests de...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic with count boundary cases (c...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. Critical logic for WILD substitution, SCATTER skip, run counting, and minimum-3 threshold has ze...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant used in engine.ts but no tests verify it is emitted under the correct conditions.

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing documentation for parameters (symbol, count), return value semantics (multiplier relative t...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment. Purpose and when this event is emitted are not described.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. what constitutes ...
- 🔴 **src/jackpot.ts** `isJackpotHit` — No JSDoc comment. Missing description of jackpot logic, explanation of the 4-diamond threshold, parameter shape (2D r...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 new)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/26) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 12% (3/26) | Exported symbols with at least a partial inline doc comment |
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

Run `2026-05-14_104251` · 9.8 min · $5.63

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.3m | $0.11 | 40 / 10569 |
| duplication | 10 | 1.6m | $0.13 | 40 / 14665 |
| correction | 10 | 11.7m | $1.47 | 30 / 47541 |
| overengineering | 10 | 3.2m | $0.51 | 30 / 10585 |
| tests | 10 | 1.1m | $0.30 | 30 / 3351 |
| best_practices | 10 | 19.1m | $2.34 | 30 / 82007 |
| documentation | 10 | 1.2m | $0.30 | 30 / 3578 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 127ms |
| estimate | 118ms |
| triage | 2ms |
| rag-index | 14.3s |
| internal-docs | 2ms |
| doc-conflict-update | 70.2s |
| review | 317.4s |
| refinement | 184.8s |

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

*Generated: 2026-05-14T08:52:40.153Z*
