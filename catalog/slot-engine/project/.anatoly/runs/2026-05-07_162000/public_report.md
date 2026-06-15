<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **6 min** — **$6.40** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 70 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 4 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨🟨⬜ 85% lean | 1 high · 1 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 7 high · 2 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 4 high · 1 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.5 / 10 | 4 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 4 of 5 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Three independent defects: wrong-sign house edge (inflates payout 5% instead of deducting it), undocumented bet×0.01 ...
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range index yields undefined weights, causing a TypeError in pickFromWeighted at...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with zero runtime importers
- 🔴 **src/paytable.ts** `lineWins` — Exported function with zero runtime importers
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight algorithm: both calculate total, generate random roll, iterate with accumulation, return ...
- 🔴 **src/paytable.ts** `lineWins` — Identical algorithm to checkLine—same symbol matching logic with wildcard support, consecutive counting, and threshol...
- 🔴 **src/reels.ts** `pickFromWeighted` — Weighted random selection from Symbol array. Identical algorithm to weightedPick in src/rng.ts (reduce weights, rando...
- 🔴 **src/engine.ts** `checkLine` — RAG score 0.838 confirms duplication; 95%+ identical logic with lineWins. Both count consecutive matching symbols/WIL...

### 🏗️ Overengineering

> Showing top 1 of 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. House-edge application, zero-win flat bonus, and Math.ceil rounding are untested despite being e...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Critical function imported by src/engine.ts and src/legacy.ts; count branching (3/4/5/other), un...
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item i...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Imported by src/factories.ts; return length (3 rows), valid symbol membership, and out-of-range ...
- 🔴 **src/engine.ts** `evaluateLine` — No test file exists. Wild-count bonus multiplier (exponential) and payout calculation paths are untested.

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public function with no JSDoc. Missing: description of what 'count' represents (reel positions matched), wha...
- 🔴 **src/reels.ts** `spinReel` — No JSDoc. Missing: what reelIndex valid range is (0–4), that it returns a 3-symbol column, and sampling-with-replacem...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment explaining what event this constant represents, when it is emitted, or what arguments are passed to ...
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape (2D readonly array of symbols), and return value se...
- 🔴 **src/freespin.ts** `handleFreeSpins` — No JSDoc comment. Non-trivial state-mutation logic with three distinct branches (trigger, retrigger, decrement/deacti...

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

Run `2026-05-07_162000` · 6.4 min · $6.40

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.7m | $0.09 | 40 / 6481 |
| duplication | 11 | 1.2m | $0.11 | 40 / 11300 |
| correction | 11 | 8.7m | $1.44 | 33 / 34604 |
| overengineering | 10 | 3.0m | $0.87 | 30 / 9735 |
| tests | 10 | 1.2m | $0.46 | 30 / 3221 |
| best_practices | 10 | 17.3m | $2.20 | 30 / 71942 |
| documentation | 10 | 1.8m | $0.67 | 30 / 5355 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 182ms |
| estimate | 137ms |
| triage | 1ms |
| rag-index | 13.1s |
| review | 214.6s |
| refinement | 156.0s |
| internal-docs | 4ms |

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

*Generated: 2026-05-07T14:26:26.898Z*
