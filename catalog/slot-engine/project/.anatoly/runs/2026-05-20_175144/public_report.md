<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **9 min** — **$3.46** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 71 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 3 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 5 high · 4 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 2 high · 2 med · 11 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.3 / 10 | 5 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 3 of 4 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Three independent defects push RTP well above 100%: house edge sign is inverted (increases payout by 5%), uncondition...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/rng.ts** `weightedPick` — Uses Math.random() in a slot-machine engine; not certifiable for regulated gaming RNG.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant imported by 0 files. No runtime usage detected.
- 🔴 **src/paytable.ts** `lineWins` — Exported function imported by 0 files. No runtime usage detected.
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine: same control flow for validating consecutive symbol matches, same return structure
- 🔴 **src/reels.ts** `pickFromWeighted` — Implements weighted random selection. RAG score 0.823 with matching logic verified in source.
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm: accumulate weights and return when random draw exceeds cumulative total. Generic type parameter ...
- 🔴 **src/engine.ts** `checkLine` — RAG score 0.823 with matching implementation. Both validate symbol arrays: handle WILD first, reject SCATTER, count c...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Stateless class that wraps a 4-line loop. Holds no state, has one importer, and ignores `rowCount` entirely. The fact...
- 🔴 **src/events.ts** `SpinEventEmitter` — Full reimplementation of Node.js built-in `EventEmitter` (`import { EventEmitter } from 'events'`) with identical on/...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists for this module. Critical logic: applies house edge incorrectly (multiplies by 1+HOUSE_EDGE inste...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file found. Imported by src/engine.ts and src/legacy.ts — critical payout path with no coverage for valid sym...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant is used as an event key in src/engine.ts but no tests verify its value or its use in em...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: what 'count' represents (run length), valid range for count, behavior for...
- 🔴 **src/events.ts** `SPIN_DONE` — Exported constant with no JSDoc. Does not document what event payload is passed when this event fires, or which emitt...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics.
- 🔴 **src/freespin.ts** `handleFreeSpins` — No JSDoc comment. The three-branch state machine logic (activate, retrigger, decrement/deactivate) and mutation side-...

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

Run `2026-05-20_175144` · 8.7 min · $3.46

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.2m | $0.07 | 40 / 11665 |
| duplication | 11 | 2.3m | $0.11 | 40 / 20234 |
| correction | 11 | 13.9m | $1.56 | 33 / 44451 |
| overengineering | 10 | 2.6m | $0.16 | 30 / 7321 |
| tests | 10 | 1.0m | $0.08 | 30 / 2768 |
| best_practices | 10 | 16.5m | $0.94 | 30 / 58801 |
| documentation | 10 | 2.5m | $0.16 | 30 / 7586 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 150ms |
| estimate | 119ms |
| triage | 1ms |
| rag-index | 6.9s |
| internal-docs | 3ms |
| rag-index-update | 3ms |
| doc-conflict-update | 4.6s |
| review | 364.8s |
| refinement | 141.8s |

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

*Generated: 2026-05-20T16:00:25.069Z*
