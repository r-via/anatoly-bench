<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **12 min** — **$6.09** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 69 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 5 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 85% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 2 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 3 high · 1 med · 11 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.2 / 10 | 4 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 5 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/rng.ts** `weightedPick` — `Math.random()` is not certifiable for regulated gaming RNG; the domain is clearly a slot machine (five reels, paylin...
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `pickFromWeighted` — Uses Math.random() which is not a certifiable RNG; inferred regulated-slot-machine domain from reels/payline/jackpot/...
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; REEL_WEIGHTS[reelIndex] is undefined for values outside [0, 4], causing pickFromWeighte...
- 🟡 **src/reels.ts** `getReelWeights` — No bounds check on reelIndex; returns undefined for out-of-range input despite declared return type of number[].

### ♻️ Utility

> Showing top 5 of 6 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime importers and 0 type-only importers.
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime importers and 0 type-only importers.
- 🔴 **src/engine.ts** `Bet` — Exported type alias with 0 runtime importers and 0 type-only importers
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — 98% identical logic to lineWins in src/paytable.ts. Both extract lead symbol (handling WILDs), reject WILD/SCATTER, c...
- 🔴 **src/rng.ts** `weightedPick` — Identical cumulative-weight algorithm: both compute total weight, generate random roll, accumulate weights in loop, r...
- 🔴 **src/paytable.ts** `lineWins` — Semantically identical to checkLine in src/engine.ts (similarity: 0.823). Both find consecutive matching symbols (or ...
- 🔴 **src/reels.ts** `pickFromWeighted` — Weighted random selection with identical logic to weightedPick in src/rng.ts; score 0.819.

### 🏗️ Overengineering

> Showing top 1 of 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class wrapping a 4-line loop that calls `spinReel`. `_rowCount` is accepted but ignored, signalling premature general...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Used by engine.ts and legacy.ts — critical business logic (payout calculation) with zero test co...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Imported by src/engine.ts; returned array identity and contents are untested.
- 🔴 **src/engine.ts** `checkLine` — No test file exists. Critical logic (WILD substitution, leading WILD fallback, SCATTER guard, run counting) has no co...
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-...
- 🔴 **src/engine.ts** `evaluateLine` — No test file exists. Wild multiplier formula (exponential bonus) and null-propagation from checkLine are untested.

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing @param descriptions for symbol and count, no @returns explaining that the multiplier is app...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported with no JSDoc. Name is clear but return value is a mutable reference to the internal SYMBOLS array — a poten...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. As a public event-name constant consumed by external callers, it should document when it is emitted and wha...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No JSDoc comment. The concrete implementation silently ignores _rowCount, which is a non-obvious behavioral contract ...

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

Run `2026-05-18_154156` · 11.6 min · $6.09

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.4m | $0.10 | 40 / 13167 |
| duplication | 10 | 1.6m | $0.11 | 40 / 13609 |
| correction | 10 | 15.8m | $1.84 | 30 / 59268 |
| overengineering | 10 | 3.4m | $0.58 | 30 / 9968 |
| tests | 10 | 1.4m | $0.28 | 30 / 3370 |
| best_practices | 10 | 19.8m | $2.32 | 30 / 79064 |
| documentation | 10 | 2.1m | $0.39 | 30 / 6547 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 128ms |
| estimate | 114ms |
| triage | 2ms |
| rag-index | 5.8s |
| internal-docs | 3ms |
| doc-conflict-update | 128.2s |
| review | 425.3s |
| refinement | 135.7s |

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

*Generated: 2026-05-18T13:53:33.601Z*
