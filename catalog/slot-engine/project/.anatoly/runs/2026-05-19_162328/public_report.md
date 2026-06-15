<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **20 min** — **$7.39** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 1 critical bug found · 66 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 2 high · 2 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 1 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 4 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 48% documented | 1 high · 2 med · 11 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.6 / 10 | 4 high · 3 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 4 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Auto-resolved: JSDoc block found before symbol (deliberated: confirmed — Confirmed. src/engine.ts:105 applies `total ...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime and 0 type-only importers.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime and 0 type-only importers.
- 🔴 **src/engine.ts** `Bet` — Exported type with 0 importers from other files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Nearly identical implementation to checkLine; both execute the same algorithm: extract leading symbol (skipping WILD)...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins in paytable.ts: finds leading symbol, validates against WILD/SCATTER, counts consecutive ...
- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight algorithm as pickFromWeighted in src/reels.ts; differences only in type generics and vari...

### 🏗️ Overengineering

> 1 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — Hand-rolled IoC/DI container for exactly three items (rng, paytable, reels) that are already directly imported at the...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists; imported by src/engine.ts.
- 🔴 **src/engine.ts** `computePayout` — Auto-resolved: JSDoc block found before symbol (deliberated: confirmed — Confirmed. src/engine.ts:105 applies `total ...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Critical function imported by engine.ts and legacy.ts — missing coverage for valid symbols at co...
- 🔴 **src/engine.ts** `evaluateLine` — No test file exists.
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### 📝 Documentation

> Showing top 5 of 14 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. No comment on whether the returned array is a copy or the live reference, nor its ...
- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing: what `count` represents, valid range, return value semantics (multiplier ...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. The constant's purpose (when it is emitted, who listens, what payload it carries) is not documented.
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Purpose, parameter shape, and return value are not described.
- 🔴 **src/freespin.ts** `handleFreeSpins` — No JSDoc comment. The three-branch state machine logic (trigger, re-trigger, decrement/deactivate) and mutation side-...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 cached)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 7% (2/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |
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

Run `2026-05-19_162328` · 20.1 min · $7.39

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.5m | $0.10 | 40 / 14611 |
| duplication | 11 | 1.7m | $0.10 | 40 / 14580 |
| correction | 11 | 7.3m | $0.68 | 30 / 29638 |
| overengineering | 10 | 3.4m | $0.35 | 30 / 10627 |
| tests | 10 | 0.9m | $0.17 | 30 / 2686 |
| best_practices | 10 | 16.7m | $1.22 | 30 / 67937 |
| documentation | 10 | 2.1m | $0.25 | 30 / 7040 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 184ms |
| estimate | 110ms |
| triage | 2ms |
| bootstrap-doc | 635.1s |
| doc-conflict-bootstrap | 27ms |
| rag-index | 69.3s |
| internal-docs | 5ms |
| rag-index-update | 5ms |
| doc-conflict-update | 10.1s |
| review | 350.6s |
| refinement | 139.5s |

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

*Generated: 2026-05-19T14:43:35.219Z*
