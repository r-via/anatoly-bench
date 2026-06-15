<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **9 min** — **$3.37** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 72 findings in 11 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥 95% OK | 2 high | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 93% used | 2 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 85% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 6% covered | 5 high · 4 med · 24 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 40% documented | 3 high · 2 med · 14 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.2 / 10 | 3 critical · 2 high · 4 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> 2 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/engine.ts** `spin` — bet > 100 only emits a console.warn and the spin proceeds; the arbitrated contract (README: 'type Bet = number; // 1....
- 🟡 **src/engine.ts** `computePayout` — Two independent defects: wrong sign on HOUSE_EDGE application inflates payout by 5% instead of reducing it; Math.ceil...

### ♻️ Utility

> Showing top 2 of 3 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/wild.ts** `applyWildBonus` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/reels.ts** `pickFromWeighted` — Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random() * total, accumul...
- 🔴 **src/rng.ts** `weightedPick` — Logic is virtually identical to pickFromWeighted in src/reels.ts: both compute a total via reduce, draw Math.random()...
- 🔴 **src/paytable.ts** `lineWins` — Identical algorithm to checkLine in src/engine.ts. Both resolve a leading symbol (treating WILD as wildcard), guard a...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolls on/off/emit over a Map when Node's built-in EventEmitter (require('events')) provides identical semantics ...
- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Concrete class with 1 importer that exists solely to satisfy the unnecessary abstract base. The `buildReels` method i...

### 🧪 Tests

> Showing top 5 of 33 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/paytable.ts** `ANCIENT_RTP` — No test file exists. Constant is used by engine.ts and legacy.ts but has no coverage.
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Return value identity and completeness (all 8 symbols) never asserted.
- 🔴 **src/rng.ts** `weightedPick` — No test file exists. Critical gaming RNG utility used by src/engine.ts with no coverage of weighted distribution corr...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Exported function used by engine.ts and factories.ts — happy path, out-of-bounds reelIndex, and ...
- 🔴 **src/reels.ts** `getReelWeights` — No test file exists. Valid and out-of-bounds reelIndex behavior never tested.

### 📝 Documentation

> Showing top 5 of 19 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/paytable.ts** `ANCIENT_RTP` — No JSDoc. The 'ANCIENT' qualifier is non-obvious — it's unclear whether this is a theoretical RTP, a game-mode-specif...
- 🔴 **src/reels.ts** `getReelSymbols` — Exported public API with no JSDoc. No explanation that the returned array order is significant (it matches weight ind...
- 🔴 **src/reels.ts** `spinReel` — Exported public API with no JSDoc. Missing: description of what 'spinning' means, valid range of reelIndex (0–4), exp...
- 🔴 **src/reels.ts** `getReelWeights` — Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally ...
- 🔴 **src/paytable.ts** `getPayMultiplier` — Exported function with no JSDoc. Missing: what 'count' represents (run length), valid range for count, return value s...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 4% (1/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 11% (3/27) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 3 pages to create.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-04_162339` · 8.6 min · $3.37

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.8m | $0.10 | 12 / 3459 |
| duplication | 11 | 1.3m | $0.14 | 12 / 5316 |
| correction | 11 | 10.2m | $0.76 | 33 / 36783 |
| overengineering | 10 | 3.1m | $0.32 | 30 / 9555 |
| tests | 10 | 1.0m | $0.15 | 30 / 3039 |
| best_practices | 10 | 19.8m | $1.30 | 30 / 74075 |
| documentation | 10 | 2.3m | $0.24 | 30 / 7253 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 160ms |
| estimate | 768ms |
| triage | 1ms |
| rag-index | 32.1s |
| internal-docs | 4ms |
| rag-index-update | 5ms |
| doc-conflict-update | 5.4s |
| review | 391.6s |
| refinement | 85.2s |

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

*Generated: 2026-06-04T14:32:17.547Z*
