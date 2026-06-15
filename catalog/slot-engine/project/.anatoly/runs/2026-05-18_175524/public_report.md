<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **11 min** — **$5.56** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 67 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 2 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 83% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 3 high · 5 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 48% documented | 1 high · 3 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.1 / 10 | 4 high · 3 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/rng.ts** `weightedPick` — Two independent correctness defects: non-certifiable RNG for a regulated gaming domain, and undefined return on empty...
- 🟡 **src/engine.ts** `computePayout` — House edge applied as a 5% bonus (×1.05) instead of a 5% deduction (×0.95), contradicting the arbitrated RTP=95% target.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers across the codebase
- 🔴 **src/engine.ts** `Bet` — Exported type with 0 importers across the codebase
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted random selection algorithm with variable naming differences only.
- 🔴 **src/paytable.ts** `lineWins` — Logic identical to checkLine (RAG 0.823): both identify leading symbol handling WILD, count consecutive matches, requ...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm to pickFromWeighted. Both compute cumulative weights, generate uniform random value, and select m...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Wraps a trivial 5-line loop in a class hierarchy solely to satisfy the abstract factory above. `_rowCount` is ignored...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolled event bus reimplementing Node.js's built-in `EventEmitter` (on/off/emit + Map-based listener registry). O...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no tests for valid counts (3/4/5...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Imported by src/engine.ts. Returns mutable array reference; no tests verify contents or immutability.
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant used as event key in src/engine.ts; its integration with SpinEventEmitter.emit is untes...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines

### 📝 Documentation

> Showing top 5 of 14 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing description of the parameter semantics (valid count values: 3–5), the return value unit (mu...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API. No JSDoc. No description of the returned array's significance (master ordered symbol list) or wh...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. As a public event-name constant, it should document what triggers it and what arguments are passed to handl...
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
| Complete doc comments | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 7% (2/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
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

Run `2026-05-18_175524` · 10.6 min · $5.56

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.5m | $0.06 | 40 / 4800 |
| duplication | 11 | 1.9m | $0.10 | 40 / 15724 |
| correction | 11 | 11.2m | $1.49 | 33 / 43645 |
| overengineering | 10 | 3.2m | $0.58 | 30 / 9782 |
| tests | 10 | 1.1m | $0.27 | 30 / 3473 |
| best_practices | 10 | 17.8m | $2.13 | 30 / 71646 |
| documentation | 10 | 2.1m | $0.41 | 30 / 7218 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 162ms |
| estimate | 128ms |
| triage | 2ms |
| rag-index | 6.3s |
| internal-docs | 5ms |
| doc-conflict-update | 131.1s |
| review | 348.1s |
| refinement | 151.4s |

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

*Generated: 2026-05-18T16:06:04.098Z*
