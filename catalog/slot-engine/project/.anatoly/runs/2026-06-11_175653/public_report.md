<p align="center">
  <img src="https://raw.githubusercontent.com/r-via/anatoly/main/assets/imgs/logo.jpg" width="400" alt="Anatoly" />
</p>

# Anatoly Audit Report

> **13 files** reviewed in **12 min** — **$3.65** in AI analysis so you don't have to.
> Verdict: **NEEDS_REFACTOR** · 70 findings in 12 files
> ⚠️ 3 unresolved code↔reference doc conflicts — run `anatoly docs arbitrate`

## Axes

| Axis | Health | Findings | Details |
|------|--------|----------|---------|
| Correction | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% OK | 3 high · 1 med | [View →](./axes/correction/index.md) |
| Utility | 🟥🟥🟥🟥🟥🟥🟥🟥⬜⬜ 83% used | 6 high | [View →](./axes/utility/index.md) |
| Duplication | 🟥🟥🟥🟥🟥🟥🟥🟥🟥⬜ 90% unique | 3 high · 1 med | [View →](./axes/duplication/index.md) |
| Overengineering | 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜ 90% lean | 3 med | [View →](./axes/overengineering/index.md) |
| Tests | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 3% covered | 5 high · 5 med · 21 low | [View →](./axes/tests/index.md) |
| Documentation | 🟥🟥🟥🟥⬜⬜⬜⬜⬜⬜ 41% documented | 3 high · 2 med · 12 low | [View →](./axes/documentation/index.md) |
| Best Practices | 🟥🟥🟥🟥🟥🟥🟥⬜⬜⬜ avg 7.1 / 10 | 3 critical · 1 high · 1 med | [View →](./axes/best-practices/index.md) |

## Top Findings

### 🐛 Correction

> Showing top 3 of 4 findings. [View all →](./axes/correction/index.md)

- 🟡 **src/reels.ts** `DEFAULT_WEIGHTS` — DIAMOND weight=30 (p=0.25) produces per-payline expected return far exceeding the arbitrated 95% RTP target.
- 🟡 **src/engine.ts** `spin` — Bet upper-bound is not enforced: bets > 100 only trigger console.warn and proceed, violating the arbitrated contract ...
- 🟡 **src/engine.ts** `computePayout` — Two independent bugs: house edge applied with wrong sign (boosts payouts instead of reducing them), and Math.ceil rou...

### ♻️ Utility

> Showing top 5 of 7 findings. [View all →](./axes/utility/index.md)

- 🔴 **src/types.ts** `LegacySpinResult` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `ANCIENT_RTP` — Exported but imported by 0 files
- 🔴 **src/paytable.ts** `lineWins` — Exported but imported by 0 files
- 🔴 **src/legacy.ts** `computeLegacyPayout` — Exported but imported by 0 files
- 🔴 **src/strategy.ts** `ConservativeStrategy` — Exported but imported by 0 files

### 📋 Duplication

> Showing top 3 of 4 findings. [View all →](./axes/duplication/index.md)

- 🔴 **src/paytable.ts** `lineWins` — Identical algorithm to checkLine in src/engine.ts: same WILD-skipping lead detection, same SCATTER/WILD null guard, s...
- 🔴 **src/engine.ts** `checkLine` — Logic is identical to lineWins in src/paytable.ts: same WILD-skip leading-symbol resolution, same consecutive-run loo...
- 🔴 **src/rng.ts** `weightedPick` — Logic is identical to pickFromWeighted in src/reels.ts: same reduce for total, same Math.random() * total roll, same ...

### 🏗️ Overengineering

> Showing top 2 of 3 findings. [View all →](./axes/overengineering/index.md)

- 🔴 **src/factories.ts** `StandardReelBuilderFactory` — Factory class wrapping a trivial `for` loop over `spinReel`. With exactly 1 consumer (`engine.ts::spin`) that instant...
- 🔴 **src/events.ts** `SpinEventEmitter` — Hand-rolled pub/sub with on/off/emit for a single consumer (engine.ts::spin) that emits exactly one event (SPIN_DONE)...

### 🧪 Tests

> Showing top 5 of 31 findings. [View all →](./axes/tests/index.md)

- 🔴 **src/engine.ts** `Bet` — Type alias with no test file present.
- 🔴 **src/paytable.ts** `getPayMultiplier` — No test file found. Callers src/engine.ts and src/legacy.ts are not confirmed to have tests that exercise this symbol.
- 🔴 **src/reels.ts** `getReelSymbols` — No test file exists. Consumed by src/engine.ts spin() but no tests verify the returned symbol list.
- 🔴 **src/reels.ts** `getReelWeights` — No test file exists. Consumed by src/engine.ts spin() but no tests cover valid/invalid reelIndex or returned weight a...
- 🔴 **src/reels.ts** `spinReel` — No test file exists. Exported and called by src/factories.ts but no tests cover its behavior or edge cases (invalid r...

### 📝 Documentation

> Showing top 5 of 17 findings. [View all →](./axes/documentation/index.md)

- 🔴 **src/engine.ts** `Bet` — No JSDoc. Type alias lacks description of valid range or constraints (e.g. 1–100 integer).
- 🔴 **src/paytable.ts** `getPayMultiplier` — No JSDoc. Missing: what 'count' represents, what the returned number means (base multiplier for lineBet calculation),...
- 🔴 **src/reels.ts** `getReelSymbols` — Public export with no JSDoc. Returning the shared SYMBOLS array (mutable reference) rather than a copy is an undocume...
- 🔴 **src/reels.ts** `getReelWeights` — Public export with no JSDoc. Valid reelIndex range (0–4), that the returned array is the live reference (no defensive...
- 🔴 **src/reels.ts** `spinReel` — Public export with no JSDoc. Valid reelIndex range (0–4), return shape (3-element column), and that each cell is samp...

### ✅ Best Practices

✨ **CLEAN** — Only low-confidence findings. [View details →](./axes/best-practices/index.md)

## Documentation Coverage

Measures inline doc comments (`///` in Rust, `/** */` in JS/TS, docstrings in Python) on exported symbols.

| Metric | Coverage | Description |
|--------|----------|-------------|
| Complete doc comments | ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0% (0/27) | Exported symbols with a complete inline doc comment covering description, params, and return |
| Any doc comment | 🟥⬜⬜⬜⬜⬜⬜⬜⬜⬜ 7% (2/27) | Exported symbols with at least a partial inline doc comment |

**Gaps:** 5 pages to create.


---

<details>
<summary><strong>Run Details</strong></summary>

Run `2026-06-11_175653` · 12.3 min · $3.65

| Axis | Calls | Duration | Cost | Tokens (in/out) |
|------|-------|----------|------|-----------------|
| utility | 11 | 0.9m | $0.09 | 6 / 3827 |
| duplication | 11 | 1.3m | $0.14 | 12 / 5511 |
| correction | 11 | 16.0m | $1.15 | 31 / 60443 |
| overengineering | 10 | 3.1m | $0.33 | 30 / 9532 |
| tests | 10 | 1.1m | $0.17 | 30 / 3288 |
| best_practices | 10 | 16.0m | $1.07 | 30 / 58295 |
| documentation | 10 | 1.9m | $0.23 | 30 / 6263 |

**Phase durations:**

| Phase | Duration |
|-------|----------|
| scan | 159ms |
| estimate | 173ms |
| triage | 1ms |
| rag-index | 107.9s |
| internal-docs | 3ms |
| rag-index-update | 3ms |
| doc-conflict-update | 109.4s |
| review | 427.3s |
| refinement | 94.4s |

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

*Generated: 2026-06-11T16:09:15.199Z*
