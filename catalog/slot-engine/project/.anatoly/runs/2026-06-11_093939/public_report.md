<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **10 min** — **$2.91** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 70 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 2 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 4 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 9% covered | 3 high · 6 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 2 high · 3 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.1 / 10 | 3 critical · 2 high · 2 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — House-edge multiplier applied in wrong direction (inflates payouts instead of reducing them) and ceiling rounding fav...
- 🟡 **src/rng.ts** `weightedPick` — Uses Math.random() in a certified-gaming context; algorithm is otherwise correct.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime and 0 type-only importers.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime and 0 type-only importers.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: both sum weights, generate Math.random()*total, accumulate in a loo...
- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine: both resolve the leading non-WILD symbol, guard against WILD/SCATTER leads, count a ...
- 🔴 **src/rng.ts** `weightedPick` — Algorithm is identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, draw Math.random() * tota...

### 🏗️ Overengineering

> Showing top 2 of 4 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js's built-in `EventEmitter` (on/off/emit) with no added behavior. Node's `EventEmitter` is always ...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Concrete factory with only 1 importer. The class wraps a trivial loop over `spinReel` — no state, no config, no alter...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no coverage for valid symbols, u...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Imported by src/engine.ts; trivial accessor but zero test coverage.
- 🔴 **src/reels.ts** `getReelWeights` — No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard, untested.
- 🔴 **src/events.ts** `SpinEventEmitter` — No test file exists. Methods on, off, and emit are untested — including edge cases like emitting with no listeners, r...
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant is imported by src/engine.ts but has no dedicated or integration-level tests confirming...

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc on exported function. Missing: @param descriptions for symbol and count, @returns explanation, note that WIL...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. No description of the returned array's ordering or its role as the index key align...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally ...
- 🔴 **src/engine.ts** `Bet` — Exported type alias with no JSDoc. The name alone does not convey valid range, currency unit, or how it relates to li...
- 🔴 **src/events.ts** `SpinEventEmitter` — No JSDoc on the class or any of its public methods (on, off, emit). Purpose, usage patterns, and method parameters/re...

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

Run `2026-06-11_093939` · 9.9 min · $2.91

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.0m | $0.08 | 12 / 3905 |
| duplication | 11 | 1.2m | $0.10 | 12 / 5322 |
| correction | 11 | 12.9m | $0.93 | 33 / 47633 |
| overengineering | 10 | 3.3m | $0.20 | 30 / 9969 |
| tests | 10 | 1.1m | $0.09 | 30 / 3327 |
| best_practices | 10 | 18.6m | $1.04 | 30 / 65724 |
| documentation | 10 | 2.3m | $0.15 | 30 / 7309 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 156ms |
| estimate | 129ms |
| triage | 2ms |
| rag-index | 6.6s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 70.8s |
| review | 409.8s |
| refinement | 102.9s |

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

*Generated: 2026-06-11T07:49:30.980Z*
