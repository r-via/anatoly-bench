<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **11 min** — **$3.05** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 69 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 95% OK | 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 5 high · 3 med · 22 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 3 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 3 critical · 2 high · 2 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 2 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Bets above 100 are only warned about, not rejected; arbitrated contract specifies Bet as 1..100 coins.
- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house edge applied in the wrong direction (increases RTP to ~105% instead of reducing to 95%...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files. No runtime or type-only consumers.
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files. No runtime or type-only consumers.
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine in src/engine.ts: same WILD-skipping lead detection, same consecutive-match loop with...
- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted-random-selection algorithm: sum weights, roll Math.random() * total, accumulate until roll < cumul...
- 🔴 **src/rng.ts** `weightedPick` — Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, scale Math.random() by ...
- 🔴 **src/engine.ts** `checkLine` — Logic is ~95% identical to lineWins in src/paytable.ts: both find the lead non-WILD symbol, count consecutive matches...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory pattern for a trivial loop over `spinReel`. Only 1 importer; a plain function would suffice. The Factory wrap...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls on/off/emit over a private Map, reimplementing Node.js built-in EventEmitter (no install needed in Node) o...

### 🧪 Tests

> Showing top 5 of 30 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `Bet` — No test file exists. Type alias with no runtime behavior, but still untested.
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by src/engine.ts and src/legacy.ts — critical pay calculation path. Count branches (3/4...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Imported by src/engine.ts.
- 🔴 **src/engine.ts** `spin` — No test file exists. Exported to src/index.ts (production entry point). Bet validation, free-spin triggering, jackpot...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Imported by src/factories.ts; untested stochastic behavior and out-of-bounds reelIndex access in...

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/engine.ts** `Bet` — Public type alias with no JSDoc. Purpose (coin denomination? integer constraint?) is not obvious from the name alone,...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc. Missing @param descriptions for symbol and count, no @returns explaining the multiplier semantics, and no n...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API. No JSDoc; does not document that the returned array is the ordered canonical list used for weigh...
- 🔴 **src/engine.ts** `spin` — Primary exported function with no JSDoc. No documentation of the bet parameter constraints (integer, 1–100), return s...
- 🔴 **src/reels.ts** `spinReel` — Exported public API. No JSDoc describing the reelIndex range (0–4), return shape (3-element column), or behavior when...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 7% (2/27) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 3 pages to create.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-11_105340` · 11.4 min · $3.05

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.0m | $0.07 | 12 / 3545 |
| duplication | 11 | 1.4m | $0.10 | 12 / 5324 |
| correction | 11 | 10.2m | $0.79 | 33 / 36624 |
| overengineering | 10 | 3.1m | $0.26 | 30 / 9815 |
| tests | 10 | 1.2m | $0.09 | 30 / 3496 |
| best_practices | 10 | 18.8m | $1.10 | 30 / 70043 |
| documentation | 10 | 2.5m | $0.16 | 30 / 7852 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 156ms |
| estimate | 129ms |
| triage | 1ms |
| rag-index | 5.6s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 105.5s |
| review | 424.4s |
| refinement | 146.9s |

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

*Generated: 2026-06-11T09:05:04.222Z*
