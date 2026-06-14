<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **8 min** — **$3.30** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 71 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 95% OK | 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 3% covered | 5 high · 3 med · 23 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 3 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.2 / 10 | 3 critical · 2 high · 3 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 2 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house-edge applied in the wrong direction, and payout rounded up instead of down.
- 🟡 **src/engine.ts** `spin` — Upper bound of the Bet range is not enforced: bet > 100 only emits a console.warn instead of throwing, violating the ...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted-random-selection algorithm: accumulate total, pick random in [0,total), iterate accumulating per-i...
- 🔴 **src/rng.ts** `weightedPick` — Implements identical algorithm to `pickFromWeighted` in src/reels.ts: same reduce-total → random-roll → cumulative-ac...
- 🔴 **src/engine.ts** `checkLine` — Identical algorithm to lineWins in src/paytable.ts: same WILD-skip lead detection, same SCATTER guard, same counting ...
- 🔴 **src/paytable.ts** `lineWins` — Identical algorithm to checkLine in src/engine.ts: same WILD-lead resolution, same consecutive-match loop with WILD w...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in EventEmitter (stdlib, zero install cost) with identical semantics: on, off, emit with m...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wrapping a trivial loop over spinReel(). Has only 1 consumer (engine.ts::spin). The entire class could ...

### 🧪 Tests

> Showing top 5 of 31 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `Bet` — No test file exists for this module.
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file found. Imported by src/engine.ts and src/legacy.ts but no test coverage is confirmed for those callers e...
- 🔴 **src/reels.ts** `spinReel` — No test file. Consumed by src/factories.ts for critical spin path; no tests for out-of-range reelIndex, column length...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Used by spin() in engine.ts for symbol enumeration; return value never asserted.
- 🔴 **src/reels.ts** `getReelWeights` — No test file. Used by spin() in engine.ts; out-of-range reelIndex returns undefined with no guard, untested.

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/engine.ts** `Bet` — Exported type alias with no JSDoc. The name alone does not communicate valid range or units.
- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: what `count` represents, valid range of `count`, return semantics (multip...
- 🔴 **src/reels.ts** `spinReel` — Exported. No JSDoc. Missing: valid range of reelIndex (0–4), meaning of the returned array (3 symbols top-to-bottom),...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported. No JSDoc. Returns the master symbol list; return value ordering and mutability are unstated.
- 🔴 **src/reels.ts** `getReelWeights` — Exported. No JSDoc. Valid reelIndex range (0–4), returned array ordering relative to getReelSymbols(), and mutability...

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

Run `2026-06-14_104735` · 7.9 min · $3.30

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.09 | 6 / 3627 |
| duplication | 11 | 1.1m | $0.14 | 12 / 5159 |
| correction | 11 | 10.8m | $0.83 | 33 / 39242 |
| overengineering | 10 | 3.1m | $0.34 | 30 / 10039 |
| tests | 10 | 1.1m | $0.18 | 30 / 3427 |
| best_practices | 10 | 17.1m | $1.15 | 30 / 63794 |
| documentation | 10 | 2.0m | $0.24 | 30 / 6791 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 137ms |
| estimate | 109ms |
| triage | 1ms |
| rag-index | 7.8s |
| internal-docs | 3ms |
| rag-index-update | 3ms |
| doc-conflict-update | 5.6s |
| review | 376.5s |
| invariants | 267ms |
| refinement | 85.0s |

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

*Generated: 2026-06-14T08:55:32.332Z*
