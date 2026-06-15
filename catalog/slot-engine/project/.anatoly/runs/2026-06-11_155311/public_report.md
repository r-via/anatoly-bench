<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **12 min** — **$3.66** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 69 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 2 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 4 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 6 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 3 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.2 / 10 | 3 critical · 1 high · 1 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — bet > 100 logs a warning and continues instead of rejecting, violating the arbitrated 1..100 integer contract.
- 🟡 **src/engine.ts** `computePayout` — House edge applied with wrong sign and payout rounded up, together driving RTP above 100%.

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files across the codebase. No consumer references it.
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files. No consumer references it anywhere in the codebase.
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Logic is virtually identical to checkLine in src/engine.ts: both resolve the leading non-WILD symbol, guard against W...
- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: same reduce-total, random-roll, cumulative-accumulator loop, and fa...
- 🔴 **src/rng.ts** `weightedPick` — Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, scale Math.random() by ...

### 🏗️ Overengineering

> Showing top 2 of 4 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in `EventEmitter` (available via `import { EventEmitter } from 'events'` — zero install co...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Sole concrete implementation of `AbstractReelBuilderFactory`, consumed by exactly one caller (`engine.ts::spin`). The...

### 🧪 Tests

> Showing top 5 of 30 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Used by spin() in src/engine.ts to build the grid; returns mutable reference to SYMBOLS — no tests.
- 🔴 **src/reels.ts** `getReelWeights` — No test file. Used by spin() in src/engine.ts; out-of-bounds reelIndex returns undefined with no guard — untested.
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Used by both src/engine.ts (core spin logic) and src/legacy.ts — critical payout path with zero ...
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Critical gaming RNG utility consumed by spin() — missing tests for uniform distribution, zero-we...
- 🔴 **src/engine.ts** `Bet` — No test file exists. Type alias with no runtime behavior, but still undocumented by tests.

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API. No JSDoc. No description of what it returns or why callers need it (ordering mirrors weight arra...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSy...
- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: valid range for `count`, behavior for WILD/SCATTER symbols (returns 0), a...
- 🔴 **src/engine.ts** `Bet` — Exported type alias with no JSDoc. Public API consumers get no context on valid range, currency unit, or relationship...
- 🔴 **src/events.ts** `SpinEventEmitter` — No JSDoc on the class or any of its public methods (on, off, emit). Parameters, return values, and behavioral contrac...

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

Run `2026-06-11_155311` · 12.2 min · $3.66

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.2m | $0.12 | 12 / 4222 |
| duplication | 11 | 1.3m | $0.14 | 12 / 5255 |
| correction | 11 | 14.8m | $1.04 | 33 / 52818 |
| overengineering | 10 | 3.5m | $0.34 | 30 / 9929 |
| tests | 10 | 1.5m | $0.17 | 30 / 3418 |
| best_practices | 10 | 17.3m | $1.14 | 30 / 62981 |
| documentation | 10 | 2.4m | $0.24 | 30 / 6805 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 159ms |
| estimate | 133ms |
| triage | 2ms |
| rag-index | 97.6s |
| internal-docs | 5ms |
| rag-index-update | 4ms |
| doc-conflict-update | 84.8s |
| review | 428.2s |
| refinement | 121.3s |

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

*Generated: 2026-06-11T14:05:26.612Z*
