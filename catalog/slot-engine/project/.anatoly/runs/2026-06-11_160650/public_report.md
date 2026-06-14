<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **10 min** — **$2.58** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 70 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% OK | 2 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 4 high | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 93% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 5 high · 4 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 44% documented | 3 high · 2 med · 11 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.0 / 10 | 3 critical · 3 high · 2 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 2 of 3 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — Bet upper-bound (≤100) is warned but not enforced, contradicting the arbitrated contract that valid bets are 1..100 i...
- 🟡 **src/engine.ts** `computePayout` — Two independent defects: house edge applied in the wrong direction (boosts payout by 5% instead of reducing it), and ...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files. No consumer references it anywhere in the codebase.
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files. Consumer analysis lists no callers; logic duplicated inside computeLegacyPayout in ...
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files
- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files

### 📋 Duplication

> 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: both reduce weights to total, roll Math.random()*total, iterate wit...
- 🔴 **src/rng.ts** `weightedPick` — Identical algorithm: both compute total weight via reduce, draw Math.random() * total, accumulate per-index weights, ...
- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins in src/paytable.ts: same WILD-skipping lead resolution, same SCATTER guard, same count...
- 🔴 **src/paytable.ts** `lineWins` — Algorithm is identical to checkLine in src/engine.ts: same WILD-skipping lead detection, same SCATTER/WILD guard, sam...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — A class wrapping a trivial for-loop over `spinReel`. The factory pattern adds instantiation ceremony for a single con...
- 🔴 **src/events.ts** `SpinEventEmitter` — Reimplements Node.js's built-in `EventEmitter` (always available, no install needed). `on`/`off`/`emit` map 1-to-1 to...

### 🧪 Tests

> Showing top 5 of 30 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file exists. Function is consumed by critical spin logic in engine.ts and legacy.ts — missing tests for all c...
- 🔴 **src/reels.ts** `getReelSymbols` — No test file. Consumed by spin() in src/engine.ts; no tests verify returned array length, symbol membership, or immut...
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Critical gaming RNG function used in slot machine spin logic lacks any coverage: zero distributi...
- 🔴 **src/engine.ts** `checkLine` — No test file exists. WILD-leading, SCATTER early-exit, run < 3 cutoff, and mixed WILD runs are all untested.
- 🔴 **src/engine.ts** `spin` — No test file exists. Primary exported function imported by src/index.ts. Bet validation, payout computation, free-spi...

### 📝 Documentation

> Showing top 5 of 16 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc comment. Missing: description of what 'multiplier' means (base multiplier applied to lineBet), valid count r...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. No explanation of return value ordering or that the array is the canonical symbol ...
- 🔴 **src/engine.ts** `spin` — No JSDoc on the primary exported public API. Bet validation rules, thrown string error, scatter/free-spin side effect...
- 🔴 **src/events.ts** `SPIN_DONE` — No JSDoc comment. As a string constant used as an event name in `spin()`, a doc explaining when this event fires and ...
- 🔴 **src/factories.ts** `AbstractReelBuilderFactory` — No JSDoc comment. Abstract factory pattern with a single abstract method — the contract (why subclasses exist, what b...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 4 pages to create.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-11_160650` · 10.4 min · $2.58

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 1.1m | $0.08 | 12 / 3995 |
| duplication | 11 | 1.4m | $0.09 | 12 / 5220 |
| correction | 11 | 10.3m | $0.59 | 33 / 34954 |
| overengineering | 10 | 4.2m | $0.22 | 30 / 11905 |
| tests | 10 | 1.4m | $0.10 | 30 / 3364 |
| best_practices | 10 | 18.3m | $1.03 | 30 / 64229 |
| documentation | 10 | 2.3m | $0.15 | 30 / 6563 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 176ms |
| estimate | 137ms |
| triage | 2ms |
| rag-index | 10.7s |
| internal-docs | 6ms |
| rag-index-update | 7ms |
| doc-conflict-update | 57.7s |
| review | 449.8s |
| refinement | 102.2s |

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

*Generated: 2026-06-11T14:17:12.808Z*
