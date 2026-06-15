<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **11 min** — **$3.20** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 70 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨 98% OK | 1 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 81% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 3 med · 23 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 44% documented | 1 high · 2 med · 13 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.2 / 10 | 3 critical · 2 high · 5 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 1 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house-edge sign inverts the intended reduction, and Math.ceil violates slot-domain rounding ...

### ♻️ Utility

> Showing top 5 of 8 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files. No runtime or type-only consumers.
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files. No runtime or type-only consumers.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine in src/engine.ts: same WILD-skip lead resolution, same SCATTER guard, same counting l...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: same reduce-sum, same Math.random() * total roll, same cumulative a...
- 🔴 **src/rng.ts** `weightedPick` — Logic is identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, scale Math.random() by it, ac...
- 🔴 **src/engine.ts** `checkLine` — Logic is functionally identical to `lineWins` in src/paytable.ts: same WILD-skip-to-first logic, same SCATTER guard, ...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class with 1 importer wrapping a trivial loop over `spinReel`. The entire class body is a 5-line loop that co...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls on/off/emit over a Map — exactly what Node.js built-in EventEmitter provides. Single importer (1 runtime, ...

### 🧪 Tests

> Showing top 5 of 30 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `spin` — No test file exists. Primary exported entry point imported by src/index.ts. Bet validation, reel evaluation, scatter/...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Used by src/engine.ts; identity and immutability of returned array are untested.
- 🔴 **src/reels.ts** `getReelWeights` — No test file. Used by src/engine.ts; out-of-bounds reelIndex and correct weight values per reel are untested.
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no coverage for count=3/4/5 bran...
- 🔴 **src/reels.ts** `spinReel` — No test file. Imported by src/factories.ts; invalid reelIndex (out of bounds) and return shape (3-element column) are...

### 📝 Documentation

> Showing top 5 of 16 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/engine.ts** `spin` — No JSDoc on the primary exported public API. Missing documentation for the bet parameter constraints, all fields of t...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported with no JSDoc. Name is clear but the return value's role (canonical ordered list used for weight-index align...
- 🔴 **src/reels.ts** `getReelWeights` — Exported with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSymbols()...
- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: what 'count' represents, valid range of 'count', that WILD/SCATTER return...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), that it returns exactly 3 symbols (one pe...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 7% (2/27) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 4 pages to create.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-11_102313` · 10.9 min · $3.20

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.07 | 12 / 3387 |
| duplication | 11 | 1.3m | $0.09 | 12 / 5144 |
| correction | 11 | 14.6m | $1.02 | 33 / 52679 |
| overengineering | 10 | 3.0m | $0.18 | 30 / 8701 |
| tests | 10 | 1.1m | $0.09 | 30 / 3369 |
| best_practices | 10 | 19.0m | $1.10 | 30 / 69844 |
| documentation | 10 | 2.3m | $0.15 | 30 / 7211 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 175ms |
| estimate | 132ms |
| triage | 1ms |
| rag-index | 5.6s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 75.8s |
| review | 411.0s |
| refinement | 161.3s |

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

*Generated: 2026-06-11T08:34:08.443Z*
