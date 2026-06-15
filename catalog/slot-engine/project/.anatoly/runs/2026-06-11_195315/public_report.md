<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **11 min** — **$2.75** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 69 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 3 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 2 high · 2 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 3% covered | 4 high · 5 med · 22 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 3 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.3 / 10 | 3 critical · 1 high · 1 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/reels.ts** `DEFAULT_WEIGHTS` — DIAMOND weight of 30 (25% per cell) combined with its paytable (50×/250×/1000×) produces an RTP far above the arbitra...
- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house edge applied as a bonus (+5%) instead of a reduction (−5%), and Math.ceil rounds payou...
- 🟡 **src/engine.ts** `spin` — Bet > 100 emits only a warning instead of throwing, violating the arbitrated Bet contract of 1..100 integer coins.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 2 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine: both resolve the leading non-WILD symbol, count consecutive matches allowing WILD su...
- 🔴 **src/rng.ts** `weightedPick` — Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, draw Math.random()*tota...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — A class wrapping a single call to spinReel in a loop. The factory pattern is unjustified: there is only one implement...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolled on/off/emit emitter with 1 consumer reimplements Node.js built-in EventEmitter (or browser-compatible `ev...

### 🧪 Tests

> Showing top 5 of 31 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file. Used by engine.ts and legacy.ts but neither file's tests are provided or referenced.
- 🔴 **src/reels.ts** `getReelWeights` — No test file exists. Consumed by engine.ts spin() but neither is tested; undefined behavior for out-of-range reelInde...
- 🔴 **src/events.ts** `SPIN_DONE` — No test file found. Constant is consumed by src/engine.ts but no tests verify correct usage as an event name.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — No test file exists. Abstract class with no runtime behavior beyond the interface contract, but still unverified.
- 🔴 **src/freespin.ts** `detectScatters` — No test file exists. Used in critical spin path; needs coverage for 0 scatters, exactly 3, mixed reel layouts, and ne...

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: valid range for `count` (3–5), behavior for WILD/SCATTER symbols (returns...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), weight array length/ordering, and behavior o...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc explaining when this event is emitted or what args consumers receive.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — No JSDoc comment. Abstract factory contract for building reel grids — the abstract method signature alone does not co...
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of what constitutes a scatter count, parameter type semantics (2D reel grid), a...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 3 pages to create.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-11_195315` · 11.3 min · $2.75

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.9m | $0.07 | 6 / 3859 |
| duplication | 11 | 0.9m | $0.09 | 12 / 3731 |
| correction | 11 | 15.8m | $0.95 | 31 / 57227 |
| overengineering | 10 | 3.6m | $0.24 | 30 / 12978 |
| tests | 10 | 1.1m | $0.09 | 30 / 2990 |
| best_practices | 10 | 16.5m | $0.98 | 30 / 61647 |
| documentation | 10 | 2.3m | $0.16 | 30 / 7865 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 174ms |
| estimate | 135ms |
| triage | 1ms |
| rag-index | 42.9s |
| internal-docs | 4ms |
| rag-index-update | 4ms |
| doc-conflict-update | 123.4s |
| review | 429.0s |
| refinement | 78.6s |

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

*Generated: 2026-06-11T18:04:31.131Z*
