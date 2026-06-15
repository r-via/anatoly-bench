<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **15 files** reviewed in **10 min** — **$6.13** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 26 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 3 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 No data | All clear | — |
| Documentation | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% documented | — | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.4 / 10 | 5 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Three independent defects: house-edge multiplier sign is inverted (boosts payout instead of reducing it, implying RTP...
- 🟡 **src/rng.ts** `weightedPick` — Math.random() is used as the RNG source in a function explicitly labeled 'suitable for gaming RNG applications' in a ...
- 🟡 **src/engine.ts** `spin` — throw "invalid bet" throws a string literal rather than an Error object; callers using instanceof Error or accessing ...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with zero runtime importers and no type-only importers
- 🔴 **src/paytable.ts** `lineWins` — Exported function with zero runtime importers and no type-only importers
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/engine.ts** `checkLine` — Identical semantic logic to lineWins() from paytable.ts. Both implement the same symbol sequence detection with WILD ...
- 🔴 **src/paytable.ts** `lineWins` — Identical algorithm to checkLine: both find leading symbol, skip WILD, count consecutive matches, return symbol+count...
- 🔴 **src/reels.ts** `pickFromWeighted` — Implements weighted random selection algorithm using cumulative distribution. RAG score 0.852 with matching logic and...
- 🔴 **src/rng.ts** `weightedPick` — Identical weighted random selection algorithm: both use cumulative weight approach with uniform random draw, same loo...

### 🏗️ Overengineering

> 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — A bespoke IoC / service-locator container (register + resolve via a stringly-typed Map<string, unknown>) built to hol...
- 🔴 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — A four-line for-loop wrapped in a class that extends an abstract base with 0 importers. With only 1 runtime importer ...

### 🧪 Tests

✨ **CLEAN** — No issues found!

### 📝 Documentation

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/documentation/index.md)

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 cached)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with at least a partial inline doc comment |
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

Run `2026-04-28_133253` · 10.1 min · $6.13

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 13 | 0.7m | $0.09 | 40 / 6775 |
| duplication | 13 | 1.3m | $0.11 | 40 / 11025 |
| correction | 13 | 8.7m | $1.69 | 35 / 34065 |
| overengineering | 12 | 4.4m | $1.12 | 36 / 14115 |
| best_practices | 12 | 20.1m | $2.72 | 36 / 75539 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 74ms |
| estimate | 174ms |
| triage | 1ms |
| rag-index | 14.7s |
| review | 301.2s |
| refinement | 140.4s |
| internal-docs | 2ms |

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

*Generated: 2026-04-28T11:42:59.350Z*
