<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **12 min** — **$6.34** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 65 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 3 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 85% used | 5 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 3 med · 20 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 48% documented | 2 high · 1 med · 11 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 4 high · 2 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for reelIndex outside [0,4], causing TypeError in ...
- 🟡 **src/reels.ts** `getReelWeights` — Returns undefined (typed number[]) for reelIndex outside [0,4]; no bounds check, silently propagates undefined to cal...

### ♻️ Utility

> Showing top 5 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 runtime and 0 type-only sources
- 🔴 **src/engine.ts** `Bet` — Exported type with 0 importers across the codebase
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 runtime and 0 type-only sources
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — RAG score 0.823. Identical logic to lineWins: identify lead symbol handling WILD/SCATTER, count consecutive matches, ...
- 🔴 **src/reels.ts** `pickFromWeighted` — Implements weighted random selection. Semantically identical to weightedPick in src/rng.ts — both sum weights, genera...
- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight random selection algorithm (RAG 0.819); differs only in type parameters and variable naming
- 🔴 **src/paytable.ts** `lineWins` — 95% identical logic to checkLine: same symbol-matching algorithm, WILD/SCATTER handling, break-on-mismatch pattern, a...

### 🏗️ Overengineering

> Showing top 1 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wrapping a trivial 3-line loop. The `_rowCount` parameter is silently ignored (underscore-prefixed), ex...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD-lead resolution, SCATTER short-circuit, run-length counting, and run < 3 rejection are all ...
- 🔴 **src/freespin.ts** `handleFreeSpins` — No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger during active spins, countdow...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file. Imported by src/engine.ts and src/legacy.ts — critical payout path. Missing coverage of valid counts (3...
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, negativ...
- 🔴 **src/engine.ts** `evaluateLine` — No test file exists. Wild-multiplier exponential bonus, no-win null return, and lineBet scaling are untested.

### 📝 Documentation

> Showing top 5 of 14 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/freespin.ts** `handleFreeSpins` — No JSDoc comment. Non-obvious state machine logic (trigger threshold, initial award of 10, retrigger +10, decrement-t...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing description of the multiplier semantics, what `count` values are valid, what the multiplier...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment. As a public event-name constant, it should document what triggers this event and what arguments are...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of what counts as a scatter, the grid traversal logic, and the return value sem...

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

Run `2026-05-15_213734` · 12.0 min · $6.34

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.2m | $0.08 | 40 / 13127 |
| duplication | 10 | 2.1m | $0.11 | 40 / 17866 |
| correction | 10 | 13.9m | $1.73 | 30 / 55136 |
| overengineering | 10 | 3.8m | $0.61 | 30 / 11032 |
| tests | 10 | 1.3m | $0.28 | 30 / 3510 |
| best_practices | 10 | 21.2m | $2.38 | 30 / 81458 |
| documentation | 10 | 2.1m | $0.39 | 30 / 6534 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 147ms |
| estimate | 109ms |
| triage | 1ms |
| rag-index | 49.4s |
| internal-docs | 3ms |
| doc-conflict-update | 96.3s |
| review | 414.8s |
| refinement | 156.3s |

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

*Generated: 2026-05-15T19:49:32.123Z*
