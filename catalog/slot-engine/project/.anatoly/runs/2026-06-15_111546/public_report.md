<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **9 min** — **$3.04** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 27 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 4 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 93% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.2 / 10 | 3 critical · 1 high · 5 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 4 of 5 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Three independent defects inflate RTP well above the documented 95% target: wrong house-edge direction, undocumented ...
- 🟡 **src/reels.ts** `DEFAULT_WEIGHTS` — DIAMOND weight 30 (p=0.25) produces per-payline EV ≈ 2.30× line-bet from DIAMOND combinations alone, violating the ar...
- 🟡 **src/reels.ts** `pickFromWeighted` — Uses Math.random() which is not a certifiable RNG for regulated gaming.
- 🟡 **src/rng.ts** `weightedPick` — Uses Math.random() in a regulated slot-machine gaming context; Math.random() is not a certifiable RNG source under an...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random() * total, accumul...
- 🔴 **src/rng.ts** `weightedPick` — Logic is virtually identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, scale Math.random()...
- 🔴 **src/paytable.ts** `lineWins` — Logic is virtually identical to checkLine in src/engine.ts: same WILD-first resolution (symbols[0]==='WILD' ? find fi...
- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins in src/paytable.ts: same WILD-substitution to find lead symbol, same WILD/SCATTER null...

### 🏗️ Overengineering

> 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — Custom IoC container backed by a Map, used exactly once to register three values (rng, paytable, reels) that are alre...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wraps a trivial loop over `spinReel`. The `_rowCount` parameter is accepted but intentionally unused (u...
- 🔴 **src/events.ts** `SpinEventEmitter` — NIH: reimplements Node.js built-in `EventEmitter` (on/off/emit, Map-backed listener lists) with identical semantics. ...

### 🧪 Tests

✨ **CLEAN** — No issues found!

### 📝 Documentation

✨ **CLEAN** — No issues found!

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with at least a partial inline doc comment |


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-15_111546` · 8.8 min · $3.04

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.6m | $0.08 | 6 / 2833 |
| duplication | 11 | 1.0m | $0.12 | 12 / 4898 |
| correction | 11 | 15.1m | $1.01 | 33 / 58575 |
| overengineering | 10 | 3.7m | $0.30 | 30 / 12509 |
| best_practices | 10 | 15.8m | $1.04 | 30 / 60827 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 179ms |
| estimate | 135ms |
| triage | 2ms |
| rag-index | 7.8s |
| review | 323.2s |
| invariants | 78.8s |
| refinement | 119.7s |

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

*Generated: 2026-06-15T09:24:37.152Z*
