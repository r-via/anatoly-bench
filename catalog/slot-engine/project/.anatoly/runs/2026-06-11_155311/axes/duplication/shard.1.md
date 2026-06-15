[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 70% | Logic is identical to lineWins in src/paytable.ts: same WILD-skip lead resolution, same SCATTER/WILD guard, same consecutive-match loop, same run>=3 threshold. Differences are only cosmetic — variable names (lead/run vs first/count) and return property names ({sym,run} vs {symbol,count}). |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 92% | Logic is identical to weightedPick in src/rng.ts: same reduce-total, random-roll, cumulative-accumulator loop, and fallback-to-last-element pattern. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and that weightedPick is generic <T> while this is hardcoded to Symbol[]. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 92% | Logic is virtually identical to checkLine in src/engine.ts: both resolve the leading non-WILD symbol, guard against WILD/SCATTER leads, count consecutive matching symbols (treating WILD as wildcard), and return null if run < 3. Differences are cosmetic only — variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 92% | Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, scale Math.random() by total, iterate accumulating weights, return item when roll < cumulative, and fall back to last item. The only differences are variable names and that weightedPick is generic while pickFromWeighted is typed to Symbol[]. Same algorithm, same contract, interchangeable behavior. |

## 🔧 Refactors

- [ ] <!-- ACT-df0e0f-5 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-2 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-28c3e3-8 --> **[duplication · medium · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-83e35f-4 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
