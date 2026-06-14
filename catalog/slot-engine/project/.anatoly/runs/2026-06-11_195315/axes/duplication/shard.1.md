[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 65% | Logic is ~95% identical to `lineWins` in src/paytable.ts: both resolve the lead symbol by skipping leading WILDs, guard on WILD/SCATTER leads, count consecutive matching-or-WILD symbols, and gate on run >= 3. Only difference is return-field names (`sym`/`run` vs `symbol`/`count`). Functions are interchangeable for all callers that only consume the count/run value. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 60% | Identical weighted random selection logic: both compute total weight, roll Math.random() * total, accumulate weights in a loop, return items[i] on hit, fall back to last item. Only differences are variable names (total/totalWeight, r/roll, acc/cumulative) and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol. Functionally interchangeable. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 90% | Logic is identical to checkLine: both resolve the leading non-WILD symbol, count consecutive matches allowing WILD substitution, and return the symbol+count if run >= 3. Only differences are cosmetic — return property names (symbol/count vs sym/run) and function name. The functions are fully interchangeable modulo the output shape. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 85% | Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, draw Math.random()*total, accumulate weights in a loop, return items[i] on first threshold cross, and fall back to items[items.length-1]. The only differences are generic type parameter T vs concrete Symbol type and variable names (roll/cumulative vs r/acc). Semantically interchangeable for the weighted-pick operation. |

## 🔧 Refactors

- [ ] <!-- ACT-df0e0f-4 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-1 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-28c3e3-8 --> **[duplication · medium · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-83e35f-2 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
