<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **14 min** — **$6.32** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 72 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 2 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 85% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 6 med · 19 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 2 high · 4 med · 9 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 6 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 5 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house edge applied in the wrong direction (inflates payouts), and payout rounded up instead ...

### ♻️ Utility

> Showing top 5 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with no runtime or type-only importers
- 🔴 **src/paytable.ts** `lineWins` — Exported function with no runtime or type-only importers
- 🔴 **src/engine.ts** `Bet` — Exported type alias, 0 importers in codebase
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins — detects consecutive symbol runs with WILD handling; differs only in property names (sym...
- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine in src/engine.ts: both extract leading symbol (skipping WILDs), validate against WILD/SC...
- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight algorithm as `pickFromWeighted`. Both iterate through items, accumulating weights until r...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Wraps a trivial 3-line loop in a class that extends an abstract factory. `_rowCount` is silently discarded, exposing ...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls Node.js's built-in `EventEmitter` (on/off/emit over a Map<string, Handler[]>) without gaining anything ove...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by engine.ts and legacy.ts — critical payout path. Missing tests for all count branches...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD leading, SCATTER short-circuit, run length threshold (>=3), and mixed-WILD sequences are al...
- 🔴 **src/engine.ts** `evaluateLine` — No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null-result path are untested.
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant string used as an event key in src/engine.ts; no tests verify its value or usage contract.

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing description of what the multiplier is applied to, what valid values of `count` are, and wha...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. Should document when this event is emitted and what payload is passed to handlers.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No JSDoc on the class or its `buildReels` method. Missing explanation of why `_rowCount` is ignored, what `spinReel` ...
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Function purpose (count SCATTER symbols across entire grid), parameter shape, and return value sema...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 cached)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/26) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 12% (3/26) | Exported symbols with at least a partial inline doc comment |
| Module guides | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% (0/0) | Modules > 200 LOC with a dedicated page in docs/ |
| Reference pages | 18 pages | Anatoly-generated module and API reference pages |

> No `docs/` directory found. Copy `.anatoly/docs/` to `docs/` to adopt the generated documentation and speed up future Anatoly runs.

**Gaps:** 3 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-18_143526` · 13.5 min · $6.32

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 0.7m | $0.07 | 40 / 5912 |
| duplication | 10 | 2.3m | $0.12 | 40 / 20504 |
| correction | 10 | 13.9m | $1.62 | 30 / 50575 |
| overengineering | 10 | 4.2m | $0.65 | 30 / 12705 |
| tests | 10 | 1.1m | $0.28 | 30 / 3406 |
| best_practices | 10 | 21.2m | $2.67 | 30 / 93093 |
| documentation | 10 | 2.2m | $0.42 | 30 / 7509 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 131ms |
| estimate | 112ms |
| triage | 1ms |
| rag-index | 6.0s |
| internal-docs | 4ms |
| doc-conflict-update | 127.7s |
| review | 509.3s |
| refinement | 166.2s |

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

*Generated: 2026-05-18T12:48:58.694Z*
