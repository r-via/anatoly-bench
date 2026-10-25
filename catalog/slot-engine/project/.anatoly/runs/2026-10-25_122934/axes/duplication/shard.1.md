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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 87% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 88% | Logic identical to lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts run of lead or WILD, returns when run >= 3. Only the return field names differ (sym/run vs symbol/count). |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 90% | Line-for-line identical logic to checkLine: resolves lead symbol through leading WILDs, rejects WILD/SCATTER, counts consecutive matches or wilds, requires >=3. Only the local names (first/count vs lead/run) and result keys (symbol/count vs sym/run) differ. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 92% | Line-for-line identical logic to the generic weightedPick: total weights, random roll, cumulative scan, fallback to last item. Only differences are variable names and the Symbol type vs generic T. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 87% | Line-for-line identical logic to pickFromWeighted: sums weights, draws Math.random()*total, walks cumulative weights, falls back to last item. Only differences are variable names and generic T vs. Symbol typing, so the two are interchangeable. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-6 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-3 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-83e35f-1 --> **[duplication · high · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
- [ ] <!-- ACT-4db700-2 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
