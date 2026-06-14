<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **22 min** — **$6.04** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 71 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 4 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 7 high · 2 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 4 high · 1 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.1 / 10 | 4 high · 5 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 4 of 5 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Two independent defects: house edge applied as a boost instead of a deduction, and Math.ceil rounds payouts up in the...
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] returns undefined for any index outside 0–4, causing pickFromWe...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `getReelWeights` — No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for indices outside 0–4, silently returning undefi...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but never imported; no runtime or type-only importers
- 🔴 **src/engine.ts** `Bet` — Exported type alias with 0 runtime importers and 0 type-only importers
- 🔴 **src/paytable.ts** `lineWins` — Exported but never imported; no runtime or type-only importers
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins: finds leading symbol, handles WILDs, counts consecutive matches, applies 3+ threshold. V...
- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine: handles WILD at position 0, validates lead symbol, counts consecutive matches, returns ...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm to pickFromWeighted in src/reels.ts. Both implement weighted random selection via cumulative-weig...
- 🔴 **src/reels.ts** `pickFromWeighted` — RAG score 0.823; implements identical weighted random selection algorithm with same control flow and return behavior

### 🏗️ Overengineering

> Showing top 1 of 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolled reimplementation of Node.js built-in EventEmitter (on/off/emit over a Map<string, handler[]>). Node's Eve...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. Exported public function: house-edge application, minimum bet bonus, Math.ceil rounding, and zer...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Called by src/engine.ts and src/legacy.ts — critical payout logic with no coverage for count bou...
- 🔴 **src/reels.ts** `spinReel` — No test file. Imported by src/factories.ts; produces 3-symbol columns driving game state. No coverage of invalid reel...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. Critical logic: WILD-as-lead substitution, SCATTER early return, run-length cutoff at 3 — all un...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public function with no JSDoc. Missing: what 'count' represents (run length), valid input range, that WILD/S...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: reelIndex valid range (0–4), that the return is always a 3-element column...
- 🔴 **src/events.ts** `SpinEventEmitter` — No JSDoc on the class or any of its public methods (on, off, emit). Public API lacks parameter/return/behavior docume...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment. The string value 'spin:done' is visible but the intended semantics (when it fires, what args are pa...
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of what constitutes a scatter count, the grid traversal behavior, and the retur...

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

**Gaps:** 3 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-20_090415` · 21.6 min · $6.04

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.05 | 40 / 6153 |
| duplication | 11 | 1.2m | $0.07 | 40 / 9543 |
| correction | 11 | 8.9m | $0.74 | 30 / 33218 |
| overengineering | 10 | 3.5m | $0.36 | 30 / 10193 |
| tests | 10 | 1.2m | $0.18 | 30 / 3154 |
| best_practices | 10 | 17.7m | $1.19 | 30 / 64583 |
| documentation | 10 | 2.3m | $0.26 | 30 / 7491 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 180ms |
| estimate | 125ms |
| triage | 1ms |
| bootstrap-doc | 748.7s |
| doc-conflict-bootstrap | 24ms |
| rag-index | 62.9s |
| internal-docs | 3ms |
| rag-index-update | 3ms |
| doc-conflict-update | 3.9s |
| review | 326.2s |
| refinement | 155.3s |

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

*Generated: 2026-05-20T07:25:54.061Z*
