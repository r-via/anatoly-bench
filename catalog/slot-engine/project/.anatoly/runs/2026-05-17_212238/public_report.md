<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **11 min** — **$5.96** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 66 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 85% OK | 2 high · 4 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 85% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 80% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 3 high · 5 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 48% documented | 1 high · 3 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 3 high · 2 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 6 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — House edge applied as × (1 + HOUSE_EDGE) = × 1.05, which increases player payout by 5% instead of deducting it; viola...
- 🟡 **src/rng.ts** `weightedPick` — Uses Math.random() in a gaming/slot-machine domain where a certifiable RNG is required by industry convention.

### ♻️ Utility

> Showing top 5 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but has 0 runtime importers and 0 type-only importers
- 🔴 **src/paytable.ts** `lineWins` — Exported but has 0 runtime importers and 0 type-only importers
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/engine.ts** `Bet` — Exported type not imported by any file.

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine (RAG score 0.823). Both extract leading symbol, validate against WILD/SCATTER, count con...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins from paytable.ts; both detect winning symbol patterns with same algorithm
- 🔴 **src/rng.ts** `weightedPick` — Identical weighted random selection algorithm. Both reduce weights to total, generate uniform random in [0, total), a...

### 🏗️ Overengineering

> 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wrapping a trivial loop over spinReel(). Has only 1 importer and no configuration surface — a plain fun...
- 🔴 **src/engine.ts** `EngineContainer` — DIY IoC container (string-keyed registry with generic resolve<T>) built for a single-file module that already imports...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic with zero test coverage acro...
- 🔴 **src/freespin.ts** `handleFreeSpins` — No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) all untested despite being c...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. Critical logic covering WILD substitution, SCATTER short-circuit, run counting, and minimum-run ...
- 🔴 **src/engine.ts** `evaluateLine` — No test file exists. Wild-count bonus multiplier formula (basePayout * (1+wc) * 2^wc) and null-return path are untested.
- 🔴 **src/engine.ts** `computePayout` — No test file exists. Exported function with inverted HOUSE_EDGE application (adds edge instead of reducing it), fixed...

### 📝 Documentation

> Showing top 5 of 14 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing: description of what 'count' represents, valid values (3/4/5), return value semantics (mult...
- 🔴 **src/freespin.ts** `handleFreeSpins` — No JSDoc comment. Trigger threshold (≥3), initial award (10 spins), retrigger logic, and decrement-to-deactivation be...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. The string value `"spin:done"` is visible but the payload type emitted with this event and when it fires ar...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics.

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 cached)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 8% (2/26) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 12% (3/26) | Exported symbols with at least a partial inline doc comment |
| Module guides | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% (0/0) | Modules > 200 LOC with a dedicated page in docs/ |
| Reference pages | 18 pages | Anatoly-generated module and API reference pages |

> No `docs/` directory found. Copy `.anatoly/docs/` to `docs/` to adopt the generated documentation and speed up future Anatoly runs.

**Gaps:** 4 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-17_212238` · 11.5 min · $5.96

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 0.7m | $0.07 | 40 / 6376 |
| duplication | 10 | 1.6m | $0.11 | 40 / 14136 |
| correction | 10 | 13.6m | $1.69 | 30 / 53637 |
| overengineering | 10 | 3.9m | $0.64 | 30 / 12324 |
| tests | 10 | 1.1m | $0.28 | 30 / 3316 |
| best_practices | 10 | 17.9m | $2.10 | 30 / 70538 |
| documentation | 10 | 2.1m | $0.40 | 30 / 6975 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 134ms |
| estimate | 120ms |
| triage | 1ms |
| rag-index | 6.4s |
| internal-docs | 4ms |
| doc-conflict-update | 125.7s |
| review | 354.7s |
| refinement | 200.8s |

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

*Generated: 2026-05-17T19:34:08.768Z*
