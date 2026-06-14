<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **10 min** — **$2.94** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 68 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 95% OK | 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 5 high · 3 med · 22 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 3 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.9 / 10 | 3 critical · 3 high | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 2 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Max bet of 100 coins is not enforced — bets above 100 only emit console.warn and proceed, violating the arbitrated Be...
- 🟡 **src/engine.ts** `computePayout` — Two bugs: house edge applied in the wrong direction (multiplies payouts up by 5% instead of reducing by 5%), and Math...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files. No local usage either.
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files. No local usage in file.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins in src/paytable.ts: same WILD-skip lead detection, same run-counting loop with WILD pa...
- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine in src/engine.ts: same WILD-resolution for the lead symbol, same SCATTER/WILD null gu...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is ~95% identical to weightedPick in src/rng.ts: both sum weights, draw Math.random()*total, accumulate in a lo...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm: sum weights, draw uniform random in [0,total), walk accumulating weights, return item on first r...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls on/off/emit over a Map — exactly what Node.js built-in `EventEmitter` provides. NIH with a native API, and...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Single-importer factory class wrapping a trivial loop over `spinReel`. A plain function `buildReels(reelCount, rowCou...

### 🧪 Tests

> Showing top 5 of 30 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Used by src/engine.ts; returned reference equality (mutability hazard) and array contents are untested.
- 🔴 **src/reels.ts** `getReelWeights` — No test file. Used by src/engine.ts; out-of-range reelIndex (returns undefined) and returned array mutability are unt...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD-lead resolution, SCATTER short-circuit, run counting, and minimum-run threshold (3) are all...
- 🔴 **src/engine.ts** `spin` — No test file exists. Input validation (invalid bet throws, >100 warns), reel construction, payline evaluation, scatte...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by src/engine.ts and src/legacy.ts — a critical payout path with no direct tests. Edge ...

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API. No JSDoc. No description of return value ordering or whether the array is a copy or a live refer...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), explanation that the returned array maps 1-to-1 ...
- 🔴 **src/engine.ts** `spin` — No JSDoc on the primary exported function. Bet validation rules, thrown string error, emitter side-effect, and SpinRe...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc. Missing: description of `count` valid range (3–5), that WILD/SCATTER return 0, and that the return is a dim...
- 🔴 **src/engine.ts** `Bet` — No JSDoc. Exported public type with no description of valid range or usage semantics.

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

Run `2026-06-11_095206` · 10.3 min · $2.94

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.0m | $0.08 | 12 / 4097 |
| duplication | 11 | 1.2m | $0.10 | 12 / 5433 |
| correction | 11 | 12.6m | $0.75 | 33 / 45009 |
| overengineering | 10 | 3.1m | $0.19 | 30 / 9119 |
| tests | 10 | 1.2m | $0.10 | 30 / 3361 |
| best_practices | 10 | 18.6m | $1.06 | 30 / 67505 |
| documentation | 10 | 1.9m | $0.14 | 30 / 6187 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 156ms |
| estimate | 131ms |
| triage | 1ms |
| rag-index | 6.6s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 89.9s |
| review | 358.6s |
| refinement | 161.6s |

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

*Generated: 2026-06-11T08:02:25.084Z*
