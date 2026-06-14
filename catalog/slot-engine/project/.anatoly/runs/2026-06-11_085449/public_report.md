<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **10 min** — **$3.49** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 73 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 3 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 5 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 3 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.5 / 10 | 3 critical · 2 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 3 of 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Non-Error throw and missing upper-bound rejection both violate the arbitrated bet contract.
- 🟡 **src/engine.ts** `computePayout` — House edge applied in the wrong direction, and payout rounded up instead of down.
- 🟡 **src/rng.ts** `weightedPick` — Math.random() is not a certifiable RNG for regulated gaming — violates industry convention for casino/slot-machine ap...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime and 0 type-only importers.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime and 0 type-only importers.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine in src/engine.ts: both resolve the lead symbol by skipping leading WILDs, guard on WI...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: both sum total weight, multiply Math.random() by total, accumulate ...
- 🔴 **src/rng.ts** `weightedPick` — Logic is identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, scale Math.random() by that t...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in `EventEmitter` (available as `import { EventEmitter } from 'events'` with no extra deps...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Concrete factory class with only 1 consumer. Its entire body is a loop over `spinReel` — trivially expressible as a s...

### 🧪 Tests

> Showing top 5 of 30 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Imported by src/engine.ts.
- 🔴 **src/reels.ts** `getReelWeights` — No test file. Imported by src/engine.ts; invalid reelIndex returns undefined with no guard.
- 🔴 **src/reels.ts** `spinReel` — No test file. Imported by src/factories.ts — a critical path. Out-of-bounds reelIndex returns undefined weights silen...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file. Called by src/engine.ts and src/legacy.ts — critical payout path with zero test coverage. Missing: unkn...
- 🔴 **src/engine.ts** `Bet` — No test file exists. Type alias with no runtime behavior, but its constraints (used as bet validation input in spin) ...

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. A one-line description of the return value and ordering would suffice.
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), description of returned array order, and tha...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), explanation that it returns 3 symbols (o...
- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: description of what a 'multiplier' represents (base multiplier × lineBet)...
- 🔴 **src/engine.ts** `Bet` — No JSDoc. Exported type alias carries implicit semantics (valid range 1–100, integer-only) that are enforced in spin(...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 7% (2/27) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 2 pages to create.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-11_085449` · 10.2 min · $3.49

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.0m | $0.10 | 12 / 3288 |
| duplication | 11 | 1.2m | $0.14 | 12 / 5284 |
| correction | 11 | 11.0m | $0.83 | 33 / 40040 |
| overengineering | 10 | 3.3m | $0.33 | 30 / 9843 |
| tests | 10 | 1.1m | $0.16 | 30 / 3518 |
| best_practices | 10 | 20.0m | $1.29 | 30 / 73474 |
| documentation | 10 | 2.4m | $0.24 | 30 / 7662 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 188ms |
| estimate | 164ms |
| triage | 1ms |
| rag-index | 6.7s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 72.9s |
| review | 447.3s |
| refinement | 85.6s |

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

*Generated: 2026-06-11T07:05:04.388Z*
