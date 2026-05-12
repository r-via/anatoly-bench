<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **9 min** — **$7.09** in AI analysis so you don't have to.
> Verdict: **CRITICAL** · 2 critical bugs found · 72 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% OK | 6 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high · 1 med | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 2 high · 2 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 2 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 6 high · 4 med · 19 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 45% documented | 5 high · 1 med · 9 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ avg 7.5 / 10 | 4 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 5 of 7 findings. [View all →](./axes/correction/index.md)

- 🔴 **src/engine.ts** `computePayout` — Three independent defects: house edge applied in the wrong direction (boosts payout 5% instead of deducting it), undo...
- 🔴 **src/reels.ts** `spinReel` — No bounds check on reelIndex; out-of-range index yields undefined weights, crashing pickFromWeighted at wts.reduce().
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/reels.ts** `getReelWeights` — No bounds check on reelIndex; returns undefined for invalid indices, violating the number[] return type contract at r...
- 🟡 **src/factories.ts** `StandardReelBuilderFactory` — `rowCount` is silently ignored; internal docs confirm `spinReel` fixes row height at 3, so any caller passing a diffe...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime and 0 type-only importers
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime and 0 type-only importers
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 2 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical logic to checkLine: finds first non-WILD symbol, validates it, counts consecutive matches including WILDs, ...
- 🔴 **src/rng.ts** `weightedPick` — Identical weighted random selection algorithm. Both functions compute total weight via reduce, generate a uniform ran...

### 🏗️ Overengineering

> 2 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/engine.ts** `EngineContainer` — Auto-resolved: import verified on disk (weightedPick found in ./rng.js)
- 🔴 **src/events.ts** `SpinEventEmitter` — Auto-promoted: exported class imported by 1 file — abstraction built for a single client

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `computePayout` — No test file exists. Inverted house-edge application (multiplies by 1.05 instead of reducing), guaranteed 1% base ret...
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Imported by src/engine.ts and src/legacy.ts — sits on a critical business path (payout calculati...
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. String constant used as event key in engine.ts; no tests verify correct usage as an event identi...
- 🔴 **src/freespin.ts** `detectScatters` — No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, and f...

### 📝 Documentation

> Showing top 5 of 15 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported public function with no JSDoc. Missing: what 'count' represents, valid range of count values, return value o...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc. The constant's role as the canonical event name for spin completion, and the payload shape emitted with it,...
- 🔴 **src/freespin.ts** `detectScatters` — No JSDoc comment. Missing description of what 'scatters' means in context, parameter docs for `reels`, and return val...
- 🔴 **src/jackpot.ts** `isJackpotHit` — No JSDoc/TSDoc comment. Missing description of purpose, parameter shape (reels dimensions/content), return value sema...
- 🔴 **src/reels.ts** `getReelSymbols` — No JSDoc. Public export with no description of what the returned array represents or its ordering.

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.
Anatoly also generates reference pages in `.anatoly/docs/` for every reviewed module.

**Reference pages:** 18 pages generated (18 new)

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |
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

Run `2026-05-12_142348` · 8.6 min · $7.09

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.06 | 40 / 7828 |
| duplication | 11 | 1.3m | $0.07 | 40 / 10268 |
| correction | 11 | 11.4m | $1.77 | 33 / 42908 |
| overengineering | 10 | 3.2m | $0.79 | 30 / 9909 |
| tests | 10 | 1.2m | $0.67 | 30 / 3464 |
| best_practices | 10 | 18.5m | $2.40 | 30 / 73011 |
| documentation | 10 | 1.9m | $0.67 | 30 / 5315 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 169ms |
| estimate | 125ms |
| triage | 1ms |
| rag-index | 64.1s |
| review | 250.6s |
| refinement | 200.5s |
| internal-docs | 3ms |

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

*Generated: 2026-05-12T12:32:24.415Z*
