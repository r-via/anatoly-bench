<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **12 min** — **$3.95** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 71 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 3 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 3% covered | 5 high · 4 med · 22 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 3 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.1 / 10 | 3 critical · 2 high · 2 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Bet upper bound of 100 is not enforced: bets > 100 produce only a console.warn and silently proceed, violating the ar...
- 🟡 **src/reels.ts** `DEFAULT_WEIGHTS` — DIAMOND weight 30 → P=0.25/cell. Left-to-right payline contribution: 3-match = 0.25³×0.75×50 = 0.586; 4-match = 0.25⁴...
- 🟡 **src/engine.ts** `computePayout` — House edge applied with wrong sign (boosts payout by 5% instead of reducing it), yielding effective RTP > 100%; Math....

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: same reduce-based total, same Math.random() roll, same cumulative l...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm: reduce total, random roll scaled by total, accumulate in loop, return on threshold, fall back to...
- 🔴 **src/paytable.ts** `lineWins` — Logic is ~97% identical to checkLine in src/engine.ts: same WILD-substitution lead detection, same null guard for WIL...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in `EventEmitter` (NIH). Has exactly 1 consumer using exactly 1 event (`SPIN_DONE`); the f...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class pattern for what is effectively a single two-liner loop over spinReel(). One importer (engine.ts::spin)...

### 🧪 Tests

> Showing top 5 of 31 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Consumed by spin() and computeLegacyPayout() in engine.ts and legacy.ts — no evidence those call...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Used by src/factories.ts. Edge cases like out-of-range reelIndex (REEL_WEIGHTS[reelIndex] would ...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Consumed by spin() in src/engine.ts for core slot logic; symbol list integrity is untested.
- 🔴 **src/reels.ts** `getReelWeights` — No test file exists. Consumed by spin() in src/engine.ts; out-of-range reelIndex returns undefined silently, untested.
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Critical RNG utility consumed by core spin logic with no coverage of edge cases: zero-weight ite...

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: parameter descriptions, return semantics, and the key constraint that WIL...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), meaning of the 3-element return array (o...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. Name is descriptive but no comment on ordering or that the array is the canonical ...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), correspondence between returned array indice...
- 🔴 **src/engine.ts** `spin` — Primary exported function with no JSDoc. Missing @param bet (valid range, integer constraint), @returns SpinResult sh...

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

Run `2026-06-14_143754` · 12.2 min · $3.95

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.09 | 6 / 3673 |
| duplication | 11 | 1.3m | $0.14 | 12 / 5604 |
| correction | 11 | 12.5m | $0.97 | 33 / 48354 |
| overengineering | 10 | 3.1m | $0.34 | 30 / 9923 |
| tests | 10 | 1.2m | $0.18 | 30 / 3356 |
| best_practices | 10 | 20.0m | $1.33 | 30 / 75488 |
| documentation | 10 | 2.1m | $0.24 | 30 / 6885 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 131ms |
| estimate | 109ms |
| triage | 1ms |
| rag-index | 4.2s |
| internal-docs | 3ms |
| rag-index-update | 4ms |
| doc-conflict-update | 9.6s |
| review | 397.2s |
| invariants | 175.5s |
| refinement | 145.3s |

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

*Generated: 2026-06-14T12:50:07.807Z*
