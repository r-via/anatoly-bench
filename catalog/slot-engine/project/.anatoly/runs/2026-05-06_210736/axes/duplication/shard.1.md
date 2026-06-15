[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/reels.ts` | 🔴 CRITICAL | 1 | 92% | [details](#srcreelsts) |
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 88% | Identical weighted random selection algorithm as weightedPick in src/rng.ts (RAG score 0.826). Both compute weight sum, generate random roll, accumulate weights in loop, return matching item with identical fallback logic. |

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 80% | Identical logic to lineWins() — detects lead symbol, excludes WILD/SCATTER, counts consecutive matches including WILD, requires 3+ run; differs only in field names (sym/run vs symbol/count) |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 90% | Identical logic to checkLine: identifies winning paylines by matching consecutive symbols with WILD wildcard support. Only cosmetic differences: field names (symbol/count vs sym/run) and variable names (first vs lead). |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 90% | Identical algorithm to pickFromWeighted in src/reels.ts. Both implement cumulative weight method for random selection: reduce weights, generate random value, iterate accumulating weights, return on threshold match, fallback to last item. Completely interchangeable semantically. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-11 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-4 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-3 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-83e35f-5 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
