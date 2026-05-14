[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🔴 CRITICAL | 1 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 80% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 70% | RAG score 0.834 with lineWins; identical logic for detecting consecutive matching symbols, skipping WILD/SCATTER, returning symbol and count if >= 3 |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 75% | Weighted random selection with identical logic to weightedPick from src/rng.ts. Both compute cumulative weights and return item at threshold. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 93% | Identical logic to checkLine: finds first non-WILD symbol, validates it, counts consecutive matches including WILDs, returns result if count >= 3. Only differences are variable names (first/lead, count/run) and return property names (symbol/sym). |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 80% | Identical weighted random selection algorithm. Both functions compute total weight via reduce, generate a uniform random value, iterate through items accumulating weights, and return on first match where random falls below cumulative threshold. Variable names differ (totalWeight/total, roll/r, cumulative/acc) but logic is identical. RAG score 0.837 confirms semantic equivalence. The generic <T> type parameter in weightedPick vs specific Symbol[] in pickFromWeighted is stylistic generalization, not semantic contract difference. |

## 🔧 Refactors

- [ ] <!-- ACT-df0e0f-4 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-2 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-28c3e3-11 --> **[duplication · medium · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-83e35f-6 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
