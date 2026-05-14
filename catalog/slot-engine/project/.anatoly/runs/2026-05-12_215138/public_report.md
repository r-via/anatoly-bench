<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **8 min** — **$3.35** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 81 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 3 high · 2 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 5 high · 2 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% unique | 2 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 4 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 2 high · 2 med · 11 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥⬜⬜⬜⬜ avg 6.4 / 10 | 9 high · 10 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 3 of 5 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Two defects: house edge applied as ×1.05 (inflates payout) instead of ×0.95, and Math.ceil rounds up. Both contradict...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/freespin.ts** `handleFreeSpins` — Two independent logic defects: retrigger increments before decrement, and `remaining` can reach 0 without deactivatin...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers and 0 type-only importers. Never referenced outside this file.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers and 0 type-only importers. Never imported anywhere.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 2 of 3 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins in src/paytable.ts. Both extract lead symbol, validate against WILD/SCATTER, count consec...
- 🔴 **src/paytable.ts** `lineWins` — Functionally identical to checkLine with identical wildcard handling, loop logic, and return conditions; only naming ...

### 🏗️ Overengineering

> Showing top 1 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolled pub/sub reimplements Node.js's built-in `EventEmitter` (always available in Node environments) or the bro...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. Exported public function with a doc comment claiming 95% RTP; HOUSE_EDGE application (multiplies...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by engine.ts and legacy.ts — a critical payout path. No coverage of valid counts (3/4/5...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. Critical logic paths untested: all-WILD sequences, SCATTER early-return, leading WILD resolved t...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant is consumed by src/engine.ts but no test verifies its value or that it is used as the c...

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing documentation for parameters (symbol, count), return value (multiplier magnitude/units), va...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. The event's semantics — when it is emitted and what payload it carries — are not described.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics.
- 🔴 **src/freespin.ts** `handleFreeSpins` — No JSDoc comment. State-mutation side effects, threshold logic (scatters >= 3), spin award amounts (10), and decremen...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 cached)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |
| Module guides | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% (0/0) | Modules > 200 LOC with a dedicated page in docs/ |
| Reference pages | 18 pages | Anatoly-generated module and API reference pages |

> No `docs/` directory found. Copy `.anatoly/docs/` to `docs/` to adopt the generated documentation and speed up future Anatoly runs.

**Gaps:** 1 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-12_215138` · 7.9 min · $3.35

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.7m | $0.04 | 40 / 6677 |
| duplication | 11 | 2.1m | $0.09 | 40 / 17238 |
| correction | 11 | 10.4m | $1.08 | 32 / 38343 |
| overengineering | 10 | 3.0m | $0.31 | 30 / 8301 |
| tests | 10 | 1.8m | $0.18 | 27 / 3601 |
| best_practices | 10 | 12.1m | $1.09 | 27 / 39844 |
| documentation | 10 | 1.5m | $0.17 | 27 / 3526 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 166ms |
| estimate | 120ms |
| triage | 1ms |
| rag-index | 15.3s |
| internal-docs | 2ms |
| doc-conflict-detection | 76.9s |
| review | 217.1s |
| refinement | 164.9s |

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

*Generated: 2026-05-12T19:59:35.308Z*
