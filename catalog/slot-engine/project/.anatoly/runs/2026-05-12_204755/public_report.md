<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **27 min** — **$11.80** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 70 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 2 high · 2 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 5 high · 2 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% unique | 2 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 4 high · 5 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 1 high · 4 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 5 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/engine.ts** `computePayout` — House edge applied in wrong direction (boosts wins instead of deducting) and Math.ceil rounds payout up against casin...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with zero runtime importers and zero type-only importers.
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported function with zero runtime importers and zero type-only importers.

### 📋 Duplication

> Showing top 2 of 3 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — RAG similarity 0.834. Identical logic to lineWins: determines lead symbol, validates against WILD/SCATTER, counts con...
- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted selection algorithm with variable renaming; weightedPick is generic version

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Concrete factory class with 1 importer wrapping a trivial loop over `spinReel`. The factory pattern buys nothing here...
- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in `EventEmitter` (node:events) with identical semantics (on/off/emit, multi-listener per ...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no tests for valid symbols (coun...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD-lead resolution, SCATTER short-circuit, run-length threshold, and mixed WILD/symbol sequenc...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant string used as an event key in src/engine.ts; untested as part of any emit/on integration.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing @param descriptions for symbol and count, no @returns explaining that 0 means no win or unr...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment explaining when this event is emitted or what payload consumers should expect.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No JSDoc comment. Concrete implementation ignores rowCount (_rowCount) without explanation, and delegates to spinReel...
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics.

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

Run `2026-05-12_204755` · 27.2 min · $11.80

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.6m | $0.08 | 40 / 5655 |
| duplication | 11 | 1.9m | $0.13 | 40 / 15056 |
| correction | 11 | 8.2m | $1.18 | 32 / 36219 |
| overengineering | 10 | 2.5m | $0.42 | 30 / 8058 |
| tests | 10 | 1.2m | $0.30 | 30 / 3441 |
| best_practices | 10 | 14.4m | $1.76 | 30 / 59641 |
| documentation | 10 | 1.2m | $0.31 | 30 / 3655 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 170ms |
| estimate | 123ms |
| triage | 1ms |
| doc-conflict-detection | 171.9s |
| rag-index | 12.6s |
| internal-docs | 5ms |
| review | 211.6s |
| refinement | 175.4s |

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

*Generated: 2026-05-12T19:15:06.245Z*
