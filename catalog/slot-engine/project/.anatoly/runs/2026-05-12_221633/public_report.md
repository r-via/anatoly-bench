<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **10 min** — **$4.88** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 75 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 2 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 5 high · 2 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 4 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 6 med · 19 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 2 high · 3 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.7 / 10 | 6 high · 5 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 5 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Three independent defects collectively make RTP exceed 100%, violating the arbitrated 95% RTP / 5% house-edge invaria...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers and 0 type-only importers
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers and 0 type-only importers
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight selection algorithm as pickFromWeighted. Both compute total weight via reduce, generate u...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins in paytable.ts — same symbol matching algorithm with WILD handling and 3+ run requirement...
- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine: leading symbol detection with WILD handling, consecutive symbol counting, and count >= ...

### 🏗️ Overengineering

> Showing top 1 of 4 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolled event emitter with 1 importer. Node's built-in `EventEmitter` or the browser-compatible `eventemitter3` (...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. HOUSE_EDGE inflation on wins, guaranteed 1% bet floor, and Math.ceil rounding are all untested. ...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by src/engine.ts and src/legacy.ts (critical payout paths), yet count=3/4/5 branches, u...
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Function has critical edge cases untested: single-item arrays, zero weights, negative weights, m...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD-lead substitution, SCATTER short-circuit, and run-length cutoff logic are all untested.
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc. Missing description of what 'count' represents (matching symbols on a line), valid count range, return sema...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment explaining when this event is emitted or what payload callers should expect.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. what constitutes ...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: @param reelIndex (valid range 0–4, out-of-bounds yields undefined weights...

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

Run `2026-05-12_221633` · 9.6 min · $4.88

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.7m | $0.04 | 40 / 6471 |
| duplication | 11 | 1.4m | $0.07 | 40 / 11964 |
| correction | 11 | 12.4m | $1.46 | 31 / 49320 |
| overengineering | 10 | 3.3m | $0.49 | 30 / 11542 |
| tests | 10 | 1.1m | $0.18 | 30 / 3401 |
| best_practices | 10 | 20.7m | $2.18 | 30 / 78520 |
| documentation | 10 | 1.1m | $0.19 | 30 / 3639 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 170ms |
| estimate | 123ms |
| triage | 1ms |
| rag-index | 5.9s |
| internal-docs | 2ms |
| doc-conflict-detection | 75.3s |
| review | 364.6s |
| refinement | 127.6s |

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

*Generated: 2026-05-12T20:26:08.214Z*
