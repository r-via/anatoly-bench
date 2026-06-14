<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **9 min** — **$3.49** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 67 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 3 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 3 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 3 high · 2 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.7 / 10 | 2 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house-edge factor is inverted (raises payout instead of cutting it) and Math.ceil rounds in ...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `getReelWeights` — Returns direct mutable reference to internal REEL_WEIGHTS[reelIndex]; callers can alter live weight state, violating ...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers and 0 type-only importers. Never imported anywhere.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers and 0 type-only importers. Never imported anywhere.
- 🔴 **src/engine.ts** `Bet` — Exported type with 0 runtime importers; not imported by any file
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted random selection algorithm to weightedPick in rng.ts (RAG score 0.823). Both: compute total weight...
- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine; both identify winning sequences by finding consecutive matching symbols (including WILD...
- 🔴 **src/rng.ts** `weightedPick` — Identical logic to pickFromWeighted in src/reels.ts — both compute cumulative weight and pick via random draw. RAG sc...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins from paytable.ts — both identify winning symbol runs by filtering WILD/SCATTER, counting ...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class wrapping a trivial for-loop over `spinReel`. Has only 1 importer and ignores `rowCount` entirely. The factory c...
- 🔴 **src/events.ts** `SpinEventEmitter` — NIH reimplementation of Node.js's built-in EventEmitter (or browser EventTarget). on/off/emit over a Map<string, fn[]...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file. Imported by src/engine.ts and src/legacy.ts — critical payout path with no coverage for any symbol, cou...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Imported by src/engine.ts.
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-...
- 🔴 **src/engine.ts** `checkLine` — No test file exists.
- 🔴 **src/engine.ts** `computePayout` — No test file exists. Critical path: applies house edge incorrectly (adds edge instead of reducing) and always adds 1%...

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public API with no JSDoc. Missing @param descriptions for symbol and count, no @returns, and no note that WI...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. No description of return value order or that it mirrors the weight-array index map...
- 🔴 **src/events.ts** `SPIN_DONE` — Exported constant with no JSDoc. The string value 'spin:done' hints at purpose but does not document when the event f...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No JSDoc on class or `buildReels`. Critical non-obvious behavior — `_rowCount` is silently ignored; each reel always ...

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

**Gaps:** 4 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-20_151616` · 8.8 min · $3.49
 · 2 degraded reviews

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.3m | $0.10 | 40 / 11133 |
| duplication | 11 | 1.0m | $0.09 | 40 / 9197 |
| correction | 11 | 17.2m | $1.19 | 33 / 62610 |
| overengineering | 10 | 3.4m | $0.34 | 30 / 8838 |
| tests | 10 | 1.0m | $0.16 | 30 / 2736 |
| best_practices | 8 | 11.1m | $0.76 | 24 / 39765 |
| documentation | 10 | 2.4m | $0.26 | 30 / 7714 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 134ms |
| estimate | 112ms |
| triage | 1ms |
| rag-index | 28.4s |
| internal-docs | 4ms |
| rag-index-update | 3ms |
| doc-conflict-update | 5.9s |
| review | 359.2s |
| refinement | 134.2s |

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

*Generated: 2026-05-20T13:25:06.219Z*
