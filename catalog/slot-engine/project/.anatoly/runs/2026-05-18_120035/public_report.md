<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **12 min** — **$5.67** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 71 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% OK | 4 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 85% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 83% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 6 med · 17 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 3 high · 4 med · 8 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 4 high · 3 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 4 of 7 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/rng.ts** `weightedPick` — Math.random() is a non-certifiable PRNG; JSDoc explicitly claims the function is 'suitable for gaming RNG application...
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex: REEL_WEIGHTS[reelIndex] returns undefined for any value outside [0,4], causing wts.redu...
- 🟡 **src/reels.ts** `getReelWeights` — No bounds check on reelIndex: returns undefined for indices outside [0,4], silently exposing an invalid value to call...

### ♻️ Utility

> Showing top 5 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime and 0 type-only importers
- 🔴 **src/engine.ts** `Bet` — Exported type but never imported by any file per import analysis.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime and 0 type-only importers
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Identical logic to weightedPick: both use cumulative weight comparison with Math.random() for weighted selection. Onl...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins (0.823 similarity). Both extract leading symbol, validate non-SCATTER, count consecutive ...
- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine: same WILD/SCATTER handling, consecutive symbol counting loop, >=3 threshold check. Only...
- 🔴 **src/rng.ts** `weightedPick` — Implements identical weighted selection algorithm as pickFromWeighted. Both compute total weight via reduce, generate...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class wrapper around a trivial `for` loop calling `spinReel`. The `_rowCount` parameter is intentionally unused (unde...
- 🔴 **src/events.ts** `SpinEventEmitter` — Full pub/sub bus (Map<string, handler[]>, on/off/emit) for a single-event, single-use object: docs confirm each spin(...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by engine.ts and legacy.ts — critical payout logic covering all 6 symbols, counts 3/4/5...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Imported by src/engine.ts; return identity and array contents untested.
- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD-leading, WILD-only, SCATTER-lead, run < 3, and run >= 3 branches are all untested.
- 🔴 **src/engine.ts** `evaluateLine` — No test file exists. Wild multiplier compounding formula and null-return path are untested.
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc. Exported function. Neither parameter is described (`count` requires knowing it means matched-symbol run len...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API. No JSDoc; return value mutability and ordering semantics (mirrors REEL_WEIGHTS index mapping) ar...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc describing when this event fires or what arguments are passed to handlers.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No JSDoc comment. 'buildReels' silently ignores '_rowCount', which is non-obvious behavior that warrants documentatio...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 cached)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/26) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 12% (3/26) | Exported symbols with at least a partial inline doc comment |
| Module guides | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% (0/0) | Modules > 200 LOC with a dedicated page in docs/ |
| Reference pages | 18 pages | Anatoly-generated module and API reference pages |

> No `docs/` directory found. Copy `.anatoly/docs/` to `docs/` to adopt the generated documentation and speed up future Anatoly runs.

**Gaps:** 5 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-18_120035` · 12.1 min · $5.67

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 0.6m | $0.07 | 40 / 5938 |
| duplication | 10 | 1.8m | $0.09 | 40 / 14689 |
| correction | 10 | 14.6m | $1.74 | 30 / 55498 |
| overengineering | 10 | 3.5m | $0.59 | 30 / 10451 |
| tests | 10 | 1.1m | $0.29 | 30 / 3632 |
| best_practices | 10 | 17.3m | $2.05 | 30 / 68263 |
| documentation | 10 | 2.1m | $0.41 | 30 / 7155 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 137ms |
| estimate | 122ms |
| triage | 2ms |
| rag-index | 5.7s |
| internal-docs | 3ms |
| doc-conflict-update | 123.3s |
| review | 442.8s |
| refinement | 152.4s |

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

*Generated: 2026-05-18T10:12:42.467Z*
