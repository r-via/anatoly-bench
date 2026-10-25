<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **3 min** — **$1.44** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 22 findings in 10 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 2 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 86% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟨🟨🟨🟨🟨🟨🟨🟨⬜⬜ 78% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 6.7 / 10 | 3 critical · 2 high · 2 med | [View →](./axes/best-practices/index.md) |
| Flow | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |

## Top Findings

### 🐛 Correction

> Showing top 2 of 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Payout math is wrong in three independent ways: the house edge raises payouts, every spin gets a bonus, and rounding ...
- 🟡 **src/reels.ts** `DEFAULT_WEIGHTS` — DIAMOND weight 30 is the highest of all symbols, breaking the descending-rarity pattern (CHERRY 25, LEMON 25, BELL 15...

### ♻️ Utility

> Showing top 5 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Line-for-line the same algorithm as weightedPick: sum the weights, roll Math.random() * total, scan the cumulative su...
- 🔴 **src/paytable.ts** `lineWins` — Logic is identical to checkLine: same WILD-leading resolution, same WILD/SCATTER rejection, same run counting with WI...
- 🔴 **src/rng.ts** `weightedPick` — Line-for-line identical logic to pickFromWeighted: sum weights, draw Math.random()*total, cumulative scan, fallback t...
- 🔴 **src/engine.ts** `checkLine` — Same logic as lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts run of lead or WI...

### 🏗️ Overengineering

> 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class wraps a trivial loop over spinReel and ignores the rowCount parameter. Only one importer. A simple function, or...
- 🔴 **src/engine.ts** `EngineContainer` — Untyped string-keyed DI container for three module-level functions used in one place. Direct imports suffice; adds ca...

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

Run `2026-10-25_134138` · 2.6 min · $1.44

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.1m | $0.04 | 4 / 1283 |
| duplication | 11 | 0.4m | $0.10 | 8 / 2529 |
| correction | 11 | 1.6m | $0.35 | 22 / 10401 |
| overengineering | 10 | 0.7m | $0.22 | 20 / 3581 |
| best_practices | 10 | 2.5m | $0.42 | 20 / 23284 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 205ms |
| estimate | 179ms |
| triage | 1ms |
| rag-index | 53.0s |
| flows | 25ms |
| flow-doc | 1ms |
| review | 38.6s |
| refinement | 62.7s |

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

*Generated: 2026-10-25T12:44:15.333Z*
