<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **11 min** — **$3.52** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 68 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 1 critical · 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 9% covered | 4 high · 4 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 44% documented | 2 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.6 / 10 | 4 critical · 2 high · 1 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 3 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Two independent defects: house-edge applied with wrong sign (RTP > 100%); Math.ceil rounds payout up against slot-dom...
- 🟡 **src/engine.ts** `spin` — `bet > 100` guard logs a warning but lets execution continue; arbitrated intent specifies the valid range as 1..100 (...
- 🟡 **src/rng.ts** `weightedPick` — Math.random() is not a certifiable RNG for regulated gaming — the function's own JSDoc claims suitability for gaming ...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime and 0 type-only importers.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime and 0 type-only importers.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine: same WILD-substitution for the lead symbol, same SCATTER/WILD null guard, same run-c...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random()*total, accumulat...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm to pickFromWeighted in src/reels.ts: both reduce weights to total, draw Math.random() * total, ac...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class with 1 importer wrapping a trivial loop over `spinReel`. The factory pattern is unjustified here — a pl...
- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in EventEmitter (on/off/emit) verbatim — NIH with a native substitute available via `impor...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists; house-edge application, base-bet bonus, Math.ceil rounding, and zero-win path are all untested.
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic covering count boundaries (3...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Imported by engine.ts; returns shared mutable array reference — mutation risk untested.
- 🔴 **src/reels.ts** `getReelWeights` — No test file. Imported by engine.ts; invalid reelIndex returns undefined without error — untested.
- 🔴 **src/engine.ts** `spin` — No test file exists. Exported and called from src/index.ts, making its untested state high-risk. Invalid-bet validati...

### 📝 Documentation

> Showing top 5 of 16 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc. Exported public API. Missing: parameter descriptions, return value semantics, and the key behavior that WIL...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. Missing: description of return value (ordered array matching weight indices) and t...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array is a direct referenc...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that it returns exactly 3 symbols (one p...
- 🔴 **src/engine.ts** `Bet` — Exported type alias with no JSDoc. No indication of valid range, currency unit, or relationship to the bet parameter ...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 3 pages to create.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-04_132022` · 10.7 min · $3.52

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.9m | $0.10 | 12 / 3376 |
| duplication | 11 | 1.2m | $0.13 | 12 / 5265 |
| correction | 11 | 10.1m | $0.78 | 33 / 37536 |
| overengineering | 10 | 3.0m | $0.32 | 30 / 9295 |
| tests | 10 | 1.1m | $0.16 | 30 / 3434 |
| best_practices | 10 | 21.2m | $1.33 | 30 / 76254 |
| documentation | 10 | 2.3m | $0.25 | 30 / 7784 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 175ms |
| estimate | 133ms |
| triage | 1ms |
| rag-index | 21.8s |
| internal-docs | 4ms |
| rag-index-update | 5ms |
| doc-conflict-update | 4.7s |
| review | 488.0s |
| refinement | 123.4s |

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

*Generated: 2026-06-04T11:31:02.843Z*
