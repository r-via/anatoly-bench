<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **3 min** — **$1.96** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 22 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 3 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 81% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨🟨⬜ 90% lean | 1 high · 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.7 / 10 | 3 critical · 1 high · 1 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> Showing top 3 of 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Two defects: house edge applied in the wrong direction (inflates payout instead of reducing it), and Math.ceil over-p...
- 🟡 **src/factories.ts** `StandardReelBuilderFactory` — rowCount is silently ignored: spinReel returns a fixed 3-symbol array regardless of rowCount, so callers requesting a...
- 🟡 **src/freespin.ts** `handleFreeSpins` — Retrigger branch adds 10 free spins without consuming the current free spin, violating the slot-machine industry rule...

### ♻️ Utility

> Showing top 5 of 8 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/rng.ts** `weightedPick` — Logic is virtually identical to `pickFromWeighted` in src/reels.ts: both reduce weights to a total, draw `Math.random...
- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine in src/engine.ts: both resolve the lead symbol from WILD-prefixed input, bail on WILD...
- 🔴 **src/reels.ts** `pickFromWeighted` — Identical logic to weightedPick in src/rng.ts: both compute total weight, draw Math.random()*total, accumulate weight...
- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins in src/paytable.ts: same WILD-substitution for first symbol, same SCATTER/WILD guard, ...

### 🏗️ Overengineering

> 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls on/off/emit — an exact subset of Node.js's built-in EventEmitter (require('events').EventEmitter or extend...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Wraps a trivial loop over `spinReel` calls in a class that exists solely to satisfy an unnecessary abstract base. The...
- 🔴 **src/reels.ts** `REEL_WEIGHTS` — Five identical weightsToArray(DEFAULT_WEIGHTS) calls; all reels share the same weights. Premature per-reel configurab...

### 🧪 Tests

✨ **CLEAN** — No issues found!

### 📝 Documentation

✨ **CLEAN** — No issues found!

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

### 🔀 Flow

✨ **CLEAN** — No issues found!

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with at least a partial inline doc comment |


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-10-25_134417` · 3.1 min · $1.96

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.6m | $0.06 | 6 / 2969 |
| duplication | 11 | 1.0m | $0.09 | 12 / 4905 |
| correction | 11 | 7.3m | $0.51 | 33 / 29362 |
| overengineering | 10 | 2.8m | $0.21 | 30 / 10384 |
| best_practices | 10 | 12.4m | $1.09 | 30 / 50231 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 236ms |
| estimate | 200ms |
| triage | 1ms |
| rag-index | 11.7s |
| flows | 27ms |
| flow-doc | 1ms |
| review | 170.7s |
| refinement | 1.3s |

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

*Generated: 2026-10-25T12:47:24.221Z*
