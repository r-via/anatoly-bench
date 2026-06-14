<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **12 min** — **$3.40** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 71 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 95% OK | 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 3% covered | 5 high · 3 med · 23 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 3 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.2 / 10 | 3 critical · 1 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 2 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Bet upper-bound (100) is not enforced: bets > 100 produce only a console.warn and proceed.
- 🟡 **src/engine.ts** `computePayout` — House edge applied in the wrong direction (inflates payout instead of reducing it), and Math.ceil rounds in the playe...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine: both resolve a lead symbol skipping WILDs, early-return null for WILD/SCATTER leads,...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, draw Math.random()*total, accumulat...
- 🔴 **src/engine.ts** `checkLine` — Logic is functionally identical to lineWins in src/paytable.ts: both resolve the lead symbol by skipping WILDs, guard...
- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight algorithm: reduce total, draw Math.random()*total, accumulate per-item until threshold, f...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — A class wrapping a single loop over spinReel calls adds no value over a standalone function. The factory pattern is p...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls `on`/`off`/`emit` — a full reimplementation of Node.js built-in `EventEmitter` (or browser `EventTarget`)....

### 🧪 Tests

> Showing top 5 of 31 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file found. Callers src/engine.ts and src/legacy.ts are listed as importers but no test evidence was provided...
- 🔴 **src/reels.ts** `spinReel` — No test file. Used by src/factories.ts but no tests verify column length, symbol membership, or weight application.
- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Consumed by engine.ts spin() but that path is also untested.
- 🔴 **src/reels.ts** `getReelWeights` — No test file. Consumed by engine.ts spin() but that path is also untested.
- 🔴 **src/engine.ts** `Bet` — Type alias with no test file present.

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: parameter descriptions, return value semantics, behavior for unknown symb...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), meaning of the returned 3-element array (one...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. A one-liner getter, but callers need to know the returned array is ordered and tha...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that indices align with getReelSymbols(), th...
- 🔴 **src/engine.ts** `Bet` — Exported public type alias with no JSDoc. No constraint information (valid range, integer requirement) is documented.

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

Run `2026-06-11_193640` · 11.6 min · $3.40

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.11 | 6 / 3086 |
| duplication | 11 | 1.3m | $0.14 | 12 / 5417 |
| correction | 11 | 10.4m | $0.80 | 31 / 37266 |
| overengineering | 10 | 3.7m | $0.36 | 30 / 11902 |
| tests | 10 | 1.0m | $0.17 | 30 / 3176 |
| best_practices | 10 | 15.8m | $1.10 | 30 / 60609 |
| documentation | 10 | 2.5m | $0.26 | 30 / 8246 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 148ms |
| estimate | 113ms |
| triage | 1ms |
| rag-index | 82.9s |
| internal-docs | 3ms |
| rag-index-update | 3ms |
| doc-conflict-update | 122.7s |
| review | 373.3s |
| refinement | 116.3s |

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

*Generated: 2026-06-11T17:48:17.479Z*
