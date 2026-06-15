<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **8 min** — **$4.70** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 72 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 4 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 7 high · 3 med · 19 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 4 high · 1 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.8 / 10 | 6 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 4 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range index yields undefined weights, crashing inside pickFromWeighted at wts.re...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `getReelWeights` — No bounds check on reelIndex; returns undefined for out-of-range indices despite number[] return type, creating a sil...
- 🟡 **src/engine.ts** `computePayout` — Three independent defects: house edge applied in the wrong direction (boosts payout instead of reducing it), undocume...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers and 0 type-only importers
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers and 0 type-only importers

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine: identifies winning paylines by matching consecutive symbols with WILD wildcard support....
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm to pickFromWeighted in src/reels.ts. Both implement cumulative weight method for random selection...
- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted random selection algorithm as weightedPick in src/rng.ts (RAG score 0.826). Both compute weight su...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins() — detects lead symbol, excludes WILD/SCATTER, counts consecutive matches including WILD...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — Auto-resolved: import verified on disk (weightedPick found in ./rng.js)
- 🔴 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Called by src/engine.ts and src/legacy.ts — a critical payout path — with zero coverage of count...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Used by src/factories.ts; return shape (3-element Symbol array), valid reelIndex bounds, and out...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant used by src/engine.ts as an event key; its correct string value is never asserted in an...
- 🔴 **src/freespin.ts** `detectScatters` — No test file exists. Function is used in engine.ts for core game logic but has zero test coverage across all paths: e...

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc. Missing: parameter semantics (valid count range is 3–5), return value meaning (multiplier applied to lineBe...
- 🔴 **src/reels.ts** `spinReel` — No JSDoc on exported function. Missing: what reelIndex valid range is (0–4), that it returns exactly 3 symbols (one p...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. The event name string and the shape of arguments passed when it is emitted (a SpinResult) are not documente...
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape (2D readonly array), and return semantics (total SC...
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

Run `2026-05-06_210736` · 8.4 min · $4.70

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 2.1m | $0.12 | 40 / 23076 |
| duplication | 11 | 1.6m | $0.09 | 40 / 14428 |
| correction | 11 | 8.3m | $1.15 | 33 / 36019 |
| overengineering | 10 | 3.3m | $0.47 | 30 / 10073 |
| tests | 10 | 1.1m | $0.17 | 30 / 2869 |
| best_practices | 10 | 16.4m | $1.92 | 30 / 67464 |
| documentation | 10 | 1.5m | $0.34 | 30 / 4897 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 159ms |
| estimate | 130ms |
| triage | 1ms |
| rag-index | 158.9s |
| review | 213.4s |
| refinement | 118.5s |
| internal-docs | 2ms |

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

*Generated: 2026-05-06T19:16:01.457Z*
