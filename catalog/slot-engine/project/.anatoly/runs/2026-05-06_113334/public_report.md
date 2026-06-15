<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **15 files** reviewed in **9 min** — **$6.45** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 71 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 4 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨🟨⬜ 85% lean | 1 high · 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 7 high · 3 med · 19 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 42% documented | 5 high · 1 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.5 / 10 | 5 high · 2 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 4 of 5 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house edge applied as a +5% boost instead of a −5% deduction, and an undocumented bet*0.01 t...
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range index yields undefined weights, causing a TypeError crash in pickFromWeigh...
- 🟡 **src/reels.ts** `getReelWeights` — No bounds check on reelIndex (returns undefined typed as number[]) and returns a mutable reference allowing callers t...
- 🟡 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers and 0 type-only importers. No files import or use this symbol.
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers and 0 type-only importers. No files import this symbol.
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine in src/engine.ts (RAG score 0.831 >= 0.82 threshold). Both extract first non-WILD symbol...
- 🔴 **src/reels.ts** `pickFromWeighted` — Implements weighted random selection by accumulating weights and comparing to a random roll. RAG found weightedPick (...
- 🔴 **src/rng.ts** `weightedPick` — Identical weighted random selection algorithm. Both weightedPick and pickFromWeighted implement the same logic: calcu...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins in paytable.ts (score 0.831). Both match symbols against payline rules, handle WILDs, and...

### 🏗️ Overengineering

> Showing top 1 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file found. While this is a simple string constant, its role as the canonical event name used by src/engine.t...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No test file found. buildReels is imported by src/engine.ts (critical game engine path) and has untested behavior: re...
- 🔴 **src/freespin.ts** `detectScatters` — No test file found. detectScatters is used by the core engine and has no test coverage for happy path (multiple scatt...
- 🔴 **src/freespin.ts** `handleFreeSpins` — No test file found. handleFreeSpins is used by the core engine and has no test coverage for any of its branches: init...

### 📝 Documentation

> Showing top 5 of 16 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/events.ts** `SPIN_DONE` — Exported constant with no JSDoc. The bare string value 'spin:done' and name give only a rough hint; there is no docum...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No JSDoc/TSDoc comment on either the class or its buildReels method. The prefixed _rowCount parameter signals a notab...
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc/TSDoc comment present. As an exported public function, it should document its parameter (`reels` — a 2-D gri...
- 🔴 **src/freespin.ts** `handleFreeSpins` — No JSDoc/TSDoc comment present. As an exported public function with non-trivial branching logic (initial trigger, ret...
- 🔴 **src/jackpot.ts** `isJackpotHit` — No JSDoc/TSDoc comment is present above or within the function. The function has non-trivial semantics (counts DIAMON...

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

Run `2026-05-06_113334` · 8.8 min · $6.45

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 13 | 0.8m | $0.06 | 40 / 7926 |
| duplication | 13 | 1.9m | $0.10 | 50 / 14534 |
| correction | 13 | 11.6m | $1.60 | 39 / 49449 |
| overengineering | 12 | 4.4m | $0.63 | 36 / 14201 |
| tests | 12 | 1.5m | $0.33 | 39 / 3694 |
| best_practices | 12 | 23.7m | $2.59 | 36 / 91321 |
| documentation | 12 | 3.1m | $0.49 | 30 / 10302 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 86ms |
| estimate | 124ms |
| triage | 1ms |
| rag-index | 39.9s |
| review | 340.7s |
| refinement | 149.8s |
| internal-docs | 3ms |

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

*Generated: 2026-05-06T09:42:25.656Z*
