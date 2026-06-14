<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **9 min** — **$3.07** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 70 findings in 12 files

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 88% OK | 2 high · 3 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 7 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 88% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 5 high · 6 med · 18 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥🟥⬜⬜⬜⬜⬜ 48% documented | 1 high · 4 med · 9 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.4 / 10 | 5 high · 3 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 5 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `computePayout` — Auto-resolved: JSDoc block found before symbol
- 🟡 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported constant with 0 runtime and 0 type-only importers
- 🔴 **src/paytable.ts** `lineWins` — Exported function with 0 runtime and 0 type-only importers
- 🔴 **src/engine.ts** `Bet` — Auto-resolved: type cannot be over-engineered
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical algorithm to checkLine in engine.ts (similarity 0.823). Both find leading symbol, validate for WILD/SCATTER...
- 🔴 **src/reels.ts** `pickFromWeighted` — Identical weighted random selection logic to weightedPick; same accumulation pattern, same fallback, same mathematica...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm to pickFromWeighted in src/reels.ts. Both accumulate weights via reduce, generate a random roll, ...
- 🔴 **src/engine.ts** `checkLine` — Identical logic to lineWins: determines lead symbol, counts consecutive matches (including WILDs), returns null if <3...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Class/factory wrapper around a 4-line loop that calls spinReel. Only 1 importer, no state, no injection — a top-level...
- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js built-in `EventEmitter` (always available, no install needed): `on`, `off`, `emit` with a `Map<s...

### 🧪 Tests

> Showing top 5 of 29 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Called by engine.ts and legacy.ts — critical payout logic with count boundary conditions (3/4/5)...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Imported by src/engine.ts.
- 🔴 **src/engine.ts** `computePayout` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/engine.ts** `spin` — Auto-resolved: JSDoc block found before symbol
- 🔴 **src/events.ts** `SPIN_DONE` — No test file exists. Constant is referenced by src/engine.ts but no tests verify it is used correctly as an event name.

### 📝 Documentation

> Showing top 5 of 14 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc on exported public function. Missing: param descriptions for symbol and count, return value semantics, behav...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. Missing: description of return value as the ordered symbol list used for weight-in...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment. The constant's role as the event name emitted after each spin() call, and the shape of its payload,...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — Auto-resolved: function ≤ 5 lines
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — No JSDoc comment. The non-obvious behavior — rowCount is silently ignored; reel height is always fixed by spinReel() ...

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

Run `2026-05-20_170944` · 8.9 min · $3.07

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.0m | $0.06 | 40 / 9462 |
| duplication | 11 | 1.3m | $0.06 | 40 / 10517 |
| correction | 11 | 16.5m | $1.17 | 33 / 61510 |
| overengineering | 10 | 3.5m | $0.20 | 30 / 10435 |
| tests | 10 | 1.2m | $0.09 | 30 / 3211 |
| best_practices | 10 | 17.1m | $0.97 | 30 / 61458 |
| documentation | 10 | 2.3m | $0.15 | 30 / 7406 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 144ms |
| estimate | 119ms |
| triage | 1ms |
| rag-index | 6.9s |
| internal-docs | 3ms |
| rag-index-update | 2ms |
| doc-conflict-update | 5.8s |
| review | 381.6s |
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

*Generated: 2026-05-20T15:18:36.451Z*
