<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **7 min** — **$4.50** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 72 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 3 high · 2 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨⬜⬜ 83% lean | 1 high · 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 5 high · 4 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 3 high · 2 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.8 / 10 | 5 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 3 of 5 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Three independent defects inflate payouts instead of enforcing the documented 5% house edge.
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/events.ts** `SpinEventEmitter` — emit iterates the live handlers array without snapshotting; on() called from inside a handler pushes to the same arra...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers
- 🔴 **src/engine.ts** `Bet` — Exported type alias with 0 imports — no external usage
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — RAG score 0.834 with checkLine; identical logic comparing source code confirms duplication: both identify first non-W...
- 🔴 **src/engine.ts** `checkLine` — Identifies winning symbol sequences on payline. Matches lineWins in src/paytable.ts with score 0.834. Both implement ...
- 🔴 **src/rng.ts** `weightedPick` — Identical weighted random selection algorithm. Both accumulate weights via reduce, draw uniform random, iterate to fi...

### 🏗️ Overengineering

> Showing top 1 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolled event emitter with a single importer. Node.js ships `EventEmitter` as a built-in (no install needed) that...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. House-edge application (multiplies by 1.05 instead of reducing RTP), the always-added bet*0.01 f...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Called by engine.ts and legacy.ts — critical payout path with count branching (3/4/5) and unknow...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Called by src/factories.ts; out-of-bounds reelIndex would cause undefined weights passed to pick...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. Critical logic for WILD substitution, SCATTER exclusion, run-length counting, and minimum-3-matc...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing documentation for parameters (what valid values of `count` are, what happens outside 3–5), ...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: @param reelIndex (valid range 0–4), @returns (3-symbol column array), beh...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc describing when this event is emitted or what args handlers should expect.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics.

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

Run `2026-05-12_220643` · 6.5 min · $4.50

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.6m | $0.08 | 40 / 14709 |
| duplication | 11 | 1.1m | $0.06 | 40 / 9556 |
| correction | 11 | 9.5m | $1.18 | 31 / 38533 |
| overengineering | 10 | 3.4m | $0.48 | 30 / 11430 |
| tests | 10 | 1.1m | $0.18 | 30 / 3506 |
| best_practices | 10 | 18.6m | $2.17 | 30 / 78367 |
| documentation | 10 | 1.1m | $0.19 | 30 / 3686 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 166ms |
| estimate | 125ms |
| triage | 1ms |
| rag-index | 6.1s |
| internal-docs | 3ms |
| doc-conflict-detection | 90.5s |
| review | 207.3s |
| refinement | 86.7s |

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

*Generated: 2026-05-12T20:13:15.326Z*
