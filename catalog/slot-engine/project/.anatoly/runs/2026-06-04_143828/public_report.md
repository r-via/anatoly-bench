<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **9 min** — **$3.46** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 69 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 3 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨🟨⬜ 90% lean | 1 high · 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 9% covered | 6 high · 2 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 44% documented | 3 high · 1 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.7 / 10 | 3 critical · 1 high · 3 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 3 of 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Upper-bound of bet range (max 100) is not enforced; arbitrated intent requires a hard 1..100 integer constraint.
- 🟡 **src/engine.ts** `computePayout` — House edge applied in wrong direction (boosts payout rather than reducing it, implying RTP > 100%); Math.ceil further...
- 🟡 **src/events.ts** `SpinEventEmitter` — on() mutates the shared handlers array in-place; a handler that calls on() for the same event during emit() appends t...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files. No local usage either.
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files. No local usage in file.
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Logic is virtually identical to checkLine in src/engine.ts: both resolve the lead symbol identically (WILD-at-index-0...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: same weighted-random algorithm, same reduce for total, same cumulat...
- 🔴 **src/rng.ts** `weightedPick` — Logic is identical to pickFromWeighted in src/reels.ts: both sum weights, draw Math.random() * total, accumulate per-...
- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins in src/paytable.ts: same WILD-skip to find leading symbol, same SCATTER/WILD early-exi...

### 🏗️ Overengineering

> Showing top 1 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls on/off/emit over a Map — exactly what Node.js built-in EventEmitter provides. NIH against a zero-install b...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `spin` — No test file exists. Only public entry point (imported by src/index.ts). Bet validation, jackpot path, free-spin stat...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file found. Function is imported by engine.ts and legacy.ts — critical business logic (count branching for 3/...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Used by src/factories.ts — a critical call path with no coverage. Out-of-bounds reelIndex (>=5) ...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Imported by src/engine.ts with no coverage.
- 🔴 **src/reels.ts** `getReelWeights` — No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard.

### 📝 Documentation

> Showing top 5 of 16 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public function with no JSDoc. Missing: what 'count' represents, the valid range of count values (3–5), the ...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: what reelIndex range is valid (0–4), that it returns 3 symbols (one per r...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. No description of return value order or that it is the canonical symbol order used...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally ...
- 🔴 **src/engine.ts** `Bet` — Exported type alias with no JSDoc. No documentation of valid range, units, or constraints (e.g. integer-only, 1–100 e...

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

Run `2026-06-04_143828` · 8.6 min · $3.46

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.10 | 12 / 3252 |
| duplication | 11 | 1.3m | $0.14 | 12 / 5338 |
| correction | 11 | 11.1m | $0.81 | 33 / 39839 |
| overengineering | 10 | 3.6m | $0.35 | 30 / 11332 |
| tests | 10 | 1.2m | $0.16 | 30 / 3487 |
| best_practices | 10 | 17.9m | $1.16 | 30 / 65218 |
| documentation | 10 | 2.3m | $0.25 | 30 / 7849 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 154ms |
| estimate | 130ms |
| triage | 1ms |
| rag-index | 13.0s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 5.4s |
| review | 363.2s |
| refinement | 131.1s |

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

*Generated: 2026-06-04T12:47:03.815Z*
