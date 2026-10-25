[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 96% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 85% | Same logic as lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts the run with WILD substitution, requires >= 3. Only the return field names differ (sym/run vs symbol/count). |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 90% | Same logic as checkLine: picks the lead symbol (first non-WILD if the line starts with WILD), returns null for WILD or SCATTER leads, counts the run of lead or WILD, and returns a result if the run is at least 3. Only the names differ (symbol/count vs sym/run), so the two are interchangeable. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 93% | Line-for-line identical algorithm to weightedPick (total weight, random roll, cumulative scan, fallback to last item). Only difference is the generic type vs Symbol, and weightedPick<T> can be used directly. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 88% | Line-for-line identical logic to pickFromWeighted: sum weights, random roll scaled by total, cumulative scan, fallback to last item. Only names and generic vs. Symbol typing differ; weightedPick is a drop-in replacement. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-6 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-3 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-83e35f-2 --> **[duplication · high · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
- [ ] <!-- ACT-4db700-1 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
