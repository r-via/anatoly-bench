[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 75% | Logic is identical to `lineWins` in src/paytable.ts: same WILD-substitution for lead symbol, same SCATTER/WILD early return, same counting loop with WILD inclusion, same >= 3 threshold. Only difference is property names in the return object (`sym`/`run` vs `symbol`/`count`), which is cosmetic and does not change behavior or semantic contract. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 95% | Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random() * total, accumulate weights in a loop, return items[i] on first match, and fall back to the last item. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and that pickFromWeighted locks the type to Symbol[] instead of using a generic T. The functions are interchangeable for the Symbol use case. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 92% | Identical algorithm to checkLine in src/engine.ts. Both resolve a leading symbol (treating WILD as wildcard), guard against all-WILD/SCATTER, count the consecutive run, and return null if run < 3. Differences are purely cosmetic: variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 95% | Logic is virtually identical to pickFromWeighted in src/reels.ts: both compute a total via reduce, draw Math.random() * total, iterate accumulating per-item weights, and fall back to the last element. Only differences are variable names (totalWeight/roll/cumulative vs total/r/acc), the generic <T> vs concrete Symbol type, and export visibility — none of these alter the algorithm or its invariants. |

## 🔧 Refactors

- [ ] <!-- ACT-df0e0f-2 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-2 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-28c3e3-9 --> **[duplication · medium · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-83e35f-4 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
