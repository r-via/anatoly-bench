<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **11 min** — **$3.18** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 71 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 1 critical · 3 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 4 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 44% documented | 2 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.3 / 10 | 3 critical · 2 high · 2 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 4 of 5 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — House edge applied in wrong direction (increases payout → ~105% RTP); payout rounded up instead of down.
- 🟡 **src/engine.ts** `spin` — bet > 100 emits a warning instead of throwing, violating the arbitrated 1..100 integer contract.
- 🟡 **src/reels.ts** `DEFAULT_WEIGHTS` — DIAMOND weight 30 (p = 0.25) produces ~229.5% per-payline EV from DIAMOND alone, making the arbitrated 95% RTP target...
- 🟡 **src/rng.ts** `weightedPick` — Uses Math.random() in a certified-gaming context; the weighted-selection algorithm itself is logically correct.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files. No runtime or type-only consumers.
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files. No runtime or type-only consumers.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — Logic is ~95% identical to `lineWins` in src/paytable.ts: same WILD-first resolution, same SCATTER guard, same counti...
- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine in src/engine.ts. Both: resolve the leading non-WILD symbol with the same find-fallba...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is 95%+ identical to weightedPick in src/rng.ts: both sum weights, draw Math.random()*total, accumulate in a lo...
- 🔴 **src/rng.ts** `weightedPick` — Logic is character-for-character equivalent to pickFromWeighted: both reduce weights to a total, draw Math.random()*t...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class pattern wrapping a trivial loop over `spinReel`. 1 importer, no polymorphism needed. A plain function `...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls on/off/emit over a Map when Node.js ships `EventEmitter` as a built-in (`import { EventEmitter } from 'eve...

### 🧪 Tests

> Showing top 5 of 30 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/reels.ts** `spinReel` — No test file exists. Used by src/factories.ts; missing tests for valid reel index, out-of-bounds index (REEL_WEIGHTS[...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Used by src/engine.ts; no coverage of returned array identity or contents.
- 🔴 **src/reels.ts** `getReelWeights` — No test file exists. Used by src/engine.ts; no coverage of valid index, out-of-bounds index, or returned array contents.
- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD-leading logic, SCATTER early-return, run threshold, and mixed-symbol break are all untested.
- 🔴 **src/engine.ts** `computePayout` — No test file exists. Comment claims house edge reduces RTP to ~95% but code multiplies by (1 + HOUSE_EDGE) — inflatin...

### 📝 Documentation

> Showing top 5 of 16 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), meaning of return value (3-element column...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. No explanation of the return value order or that it is the canonical symbol orderi...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that the returned array aligns positiona...
- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported function with no JSDoc. Missing: description of purpose, @param docs for symbol and count, @returns explanat...
- 🔴 **src/engine.ts** `Bet` — No JSDoc. Exported type alias with no constraints or usage notes documented.

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 4 pages to create.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-04_164329` · 11.3 min · $3.18

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.9m | $0.09 | 12 / 3470 |
| duplication | 11 | 1.2m | $0.09 | 12 / 5049 |
| correction | 11 | 15.5m | $0.89 | 33 / 55487 |
| overengineering | 10 | 3.5m | $0.22 | 30 / 10814 |
| tests | 10 | 1.1m | $0.13 | 30 / 3469 |
| best_practices | 10 | 18.5m | $1.05 | 30 / 66313 |
| documentation | 10 | 2.1m | $0.15 | 30 / 6925 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 199ms |
| estimate | 119ms |
| triage | 2ms |
| rag-index | 9.4s |
| internal-docs | 4ms |
| rag-index-update | 2ms |
| doc-conflict-update | 110.1s |
| review | 399.7s |
| refinement | 159.4s |

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

*Generated: 2026-06-04T14:54:49.363Z*
