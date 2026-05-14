<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **12 files** reviewed in **8 min** — **$4.57** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 75 findings in 11 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 80% OK | 5 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 80% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 5 med · 18 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 48% documented | 3 high · 3 med · 7 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.2 / 10 | 6 high · 6 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 5 of 8 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `spinReel` — No bounds check on reelIndex; an out-of-range value yields undefined weights, causing a TypeError in pickFromWeighted.
- 🟡 **src/engine.ts** `computePayout` — Three independent defects: wrong-sign house-edge multiplier inflates payout by 5% instead of reducing it; uncondition...
- 🟡 **src/reels.ts** `getReelWeights` — No bounds check; out-of-range reelIndex silently returns undefined despite the declared return type number[], propaga...
- 🟡 **src/rng.ts** `weightedPick` — Two independent defects: Math.random() is non-certifiable for regulated gaming RNG; empty-array fallback silently ret...

### ♻️ Utility

> Showing top 5 of 8 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime and 0 type-only importers
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime and 0 type-only importers
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical algorithm to checkLine (RAG score 0.831): both extract first non-WILD symbol, check against WILD/SCATTER, c...
- 🔴 **src/engine.ts** `checkLine` — Identical algorithm to lineWins in paytable.ts: both extract leading non-WILD symbol, validate against WILD/SCATTER, ...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm to pickFromWeighted. Both compute total weight, generate random draw, accumulate weights in loop,...

### 🏗️ Overengineering

> Showing top 1 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Full reimplementation of a standard event emitter (on/off/emit) that Node's built-in `events.EventEmitter` or `evente...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Called by src/engine.ts and src/legacy.ts — a critical payout path — yet count=3/4/5 branches, u...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD-leading fallback, SCATTER short-circuit, and run-length boundary (run < 3) are all untested.
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant is used in src/engine.ts but no tests verify it is emitted at the correct lifecycle point.
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines

### 📝 Documentation

> Showing top 5 of 13 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing documentation for parameters (symbol, count), return value semantics, and the behavior when...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment. The constant's purpose — what triggers this event and what listeners should expect — is not documen...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Purpose and return value are inferrable from the name, but the parameter shape and return semantics...
- 🔴 **src/jackpot.ts** `isJackpotHit` — No JSDoc comment. Missing description of jackpot logic, explanation of the threshold (>=4 DIAMONDs), parameter shape,...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 new)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/26) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 12% (3/26) | Exported symbols with at least a partial inline doc comment |
| Module guides | 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩 100% (0/0) | Modules > 200 LOC with a dedicated page in docs/ |
| Reference pages | 18 pages | Anatoly-generated module and API reference pages |

> No `docs/` directory found. Copy `.anatoly/docs/` to `docs/` to adopt the generated documentation and speed up future Anatoly runs.

**Gaps:** 1 pages to create.

<details>
<summary><strong>New pages generated (18)</strong></summary>

- .anatoly/docs/01-Getting-Started/01-Overview.md  (from scaffolded)
- .anatoly/docs/01-Getting-Started/02-Installation.md  (from scaffolded)
- .anatoly/docs/01-Getting-Started/03-Configuration.md  (from scaffolded)
- .anatoly/docs/01-Getting-Started/04-Quick-Start.md  (from scaffolded)
- .anatoly/docs/02-Architecture/01-System-Overview.md  (from scaffolded)
- .anatoly/docs/02-Architecture/02-Core-Concepts.md  (from scaffolded)
- .anatoly/docs/02-Architecture/03-Data-Flow.md  (from scaffolded)
- .anatoly/docs/02-Architecture/04-Design-Decisions.md  (from scaffolded)
- .anatoly/docs/03-Guides/01-Common-Workflows.md  (from scaffolded)
- .anatoly/docs/03-Guides/02-Advanced-Configuration.md  (from scaffolded)
- .anatoly/docs/03-Guides/03-Troubleshooting.md  (from scaffolded)
- .anatoly/docs/04-API-Reference/01-Public-API.md  (from scaffolded)
- .anatoly/docs/04-API-Reference/02-Configuration-Schema.md  (from scaffolded)
- .anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md  (from scaffolded)
- .anatoly/docs/05-Development/01-Source-Tree.md  (from scaffolded)
- .anatoly/docs/05-Development/02-Build-and-Test.md  (from scaffolded)
- .anatoly/docs/05-Development/03-Code-Conventions.md  (from scaffolded)
- .anatoly/docs/05-Development/04-Release-Process.md  (from scaffolded)

</details>


## 📚 Documentation

Anatoly generated a complete documentation for this project during the audit.

**[Browse the documentation →](./docs/index.md)**

---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-05-13_233229` · 8.4 min · $4.57

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 10 | 1.1m | $0.11 | 40 / 10509 |
| duplication | 10 | 1.6m | $0.11 | 40 / 14350 |
| correction | 10 | 10.5m | $1.24 | 30 / 38883 |
| overengineering | 10 | 3.2m | $0.53 | 30 / 11096 |
| tests | 10 | 1.0m | $0.29 | 30 / 3056 |
| best_practices | 10 | 17.5m | $1.98 | 30 / 67582 |
| documentation | 10 | 1.1m | $0.31 | 30 / 3737 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 130ms |
| estimate | 111ms |
| triage | 1ms |
| rag-index | 13.8s |
| internal-docs | 4ms |
| doc-conflict-update | 78.2s |
| review | 229.0s |
| refinement | 181.7s |

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

*Generated: 2026-05-13T21:40:54.147Z*
