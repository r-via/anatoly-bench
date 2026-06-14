[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 92% | Logic is ~95% identical to `lineWins` in src/paytable.ts: same WILD-first resolution, same SCATTER guard, same counting loop with break, same >= 3 threshold. Only differences are field names (`sym`/`run` vs `symbol`/`count`) and local variable names (`lead` vs `first`). Functions are interchangeable in behavior. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 90% | Logic is 95%+ identical to weightedPick in src/rng.ts: both sum weights, draw Math.random()*total, accumulate in a loop, return items[i] on first exceedance, fall back to last item. Only differences are variable names and that pickFromWeighted is typed Symbol[] instead of generic T[]. pickFromWeighted is interchangeable with weightedPick and should be replaced by it. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 92% | Logic is identical to checkLine in src/engine.ts. Both: resolve the leading non-WILD symbol with the same find-fallback pattern, guard on WILD/SCATTER, count a consecutive matching run with the same break-on-mismatch loop, and return null below 3. Only differences are local variable names (first/count vs lead/run) and return field names (symbol/count vs sym/run). The functions are fully interchangeable in behavior. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 85% | Logic is character-for-character equivalent to pickFromWeighted: both reduce weights to a total, draw Math.random()*total, accumulate in a loop, and fall back to the last item. Only superficial differences: variable names (totalWeight/roll/cumulative vs total/r/acc), parameter name (weights vs wts), and a generic type parameter vs concrete Symbol[] type. The generic form makes weightedPick strictly more general but functionally interchangeable for Symbol[] inputs. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-9 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-5 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-2 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-83e35f-5 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
