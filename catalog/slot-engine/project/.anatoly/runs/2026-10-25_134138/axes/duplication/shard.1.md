[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 96% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 85% | Same logic as lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts run of lead or WILD, returns a result if run >= 3. Only the return field names differ (sym/run vs symbol/count). |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 93% | Line-for-line the same algorithm as weightedPick: sum the weights, roll Math.random() * total, scan the cumulative sum, fall back to the last item. The only difference is that it takes Symbol[] instead of a generic T[]. weightedPick<T> can be called directly with the same arguments. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 88% | Logic is identical to checkLine: same WILD-leading resolution, same WILD/SCATTER rejection, same run counting with WILD substitution, same >=3 threshold. Only local names (first/count vs lead/run) and return field names (symbol/count vs sym/run) differ. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 88% | Line-for-line identical logic to pickFromWeighted: sum weights, draw Math.random()*total, cumulative scan, fallback to last item. Only differences are variable names and the generic <T> vs concrete Symbol type; they are interchangeable. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-5 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-3 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-83e35f-2 --> **[duplication · high · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
- [ ] <!-- ACT-4db700-1 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
