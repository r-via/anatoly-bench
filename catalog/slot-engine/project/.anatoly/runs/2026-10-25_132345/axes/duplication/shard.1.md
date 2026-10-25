[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 86% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 88% | Logic is identical to lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER leads, counts consecutive matching/WILD symbols, and returns a result if the run is >= 3. Only the result field names differ (sym/run vs symbol/count). |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 90% | Logic matches checkLine line for line: WILD-lead resolution, WILD/SCATTER rejection, consecutive run counting with WILD substitution, threshold of 3. Only the names differ (symbol/count vs sym/run). The two are interchangeable. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 92% | Same algorithm as weightedPick: sum weights, Math.random() * total, cumulative scan with r < acc, fallback to last item. Only differences are variable names and the generic type parameter (this one is fixed to Symbol); weightedPick<T> can replace it directly. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 86% | Line-for-line identical algorithm to pickFromWeighted (sum weights, Math.random roll, cumulative scan, fallback to last item). Only variable names and generic T vs Symbol differ; interchangeable. pickFromWeighted should reuse weightedPick. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-6 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-3 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-83e35f-1 --> **[duplication · high · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
- [ ] <!-- ACT-4db700-2 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
