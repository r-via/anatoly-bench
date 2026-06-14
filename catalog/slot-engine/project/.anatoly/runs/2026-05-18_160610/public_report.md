<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **13 min** — **$4.85** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 68 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 3 high · 2 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 85% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜ 83% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 2 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 4 high · 1 med · 10 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.1 / 10 | 4 high · 3 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 3 of 5 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Multiplies wins by (1 + HOUSE_EDGE) = 1.05, boosting payouts by 5% instead of deducting the house edge; contradicts t...
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for indices outside 0–4, causing a crash inside pi...
- 🟡 **src/reels.ts** `getReelWeights` — No bounds check on reelIndex; returns undefined (typed as number[]) for out-of-range indices, breaking any caller tha...

### ♻️ Utility

> Showing top 5 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with no runtime or type-only importers
- 🔴 **src/paytable.ts** `lineWins` — Exported function with no runtime or type-only importers
- 🔴 **src/engine.ts** `Bet` — Exported type with zero runtime or type-only importers across the codebase.
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine — extracts first non-WILD symbol, counts consecutive matches with first or WILD, breaks ...
- 🔴 **src/reels.ts** `pickFromWeighted` — Weighted random selection algorithm. Identical logic to weightedPick: same total calculation, same random roll, same ...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm to pickFromWeighted in src/reels.ts. Both implement cumulative-weight random selection with same ...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins: extracts leading symbol, handles WILD/SCATTER, counts consecutive matches. Semantic cont...

### 🏗️ Overengineering

> 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wrapping a trivial for-loop over spinReel(i). The _rowCount parameter is unused, exposing an abstractio...
- 🔴 **src/engine.ts** `EngineContainer` — DIY IoC container (string-keyed Map<string, unknown> with register/resolve) for three functions already imported at t...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Imported by src/engine.ts; returned array identity and contents are never asserted.
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by src/engine.ts and src/legacy.ts — a critical payout path. Happy path (count 3/4/5 pe...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant imported by engine.ts as a key event signal; its correct usage in emit/on calls is unte...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/reels.ts** `getReelSymbols` — No JSDoc. Returns the shared SYMBOLS array by reference; mutation risk and ordering guarantee are undocumented.
- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public function with no JSDoc. Missing: what 'count' represents, what the returned number is relative to (ra...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. The string value 'spin:done' and what payload is emitted with this event are not documented inline.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g., that SCATTERs ar...

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

**Gaps:** 6 pages to create.


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-18_160610` · 13.2 min · $4.85

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.1m | $0.06 | 40 / 9633 |
| duplication | 10 | 1.0m | $0.05 | 40 / 7860 |
| correction | 10 | 17.2m | $1.82 | 30 / 68141 |
| overengineering | 10 | 3.8m | $0.39 | 30 / 11361 |
| tests | 10 | 1.2m | $0.18 | 30 / 3459 |
| best_practices | 10 | 16.8m | $1.63 | 30 / 60528 |
| documentation | 10 | 2.2m | $0.30 | 30 / 7997 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 123ms |
| estimate | 106ms |
| triage | 1ms |
| rag-index | 11.0s |
| internal-docs | 4ms |
| doc-conflict-update | 128.4s |
| review | 444.5s |
| refinement | 203.6s |

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

*Generated: 2026-05-18T14:19:20.115Z*
