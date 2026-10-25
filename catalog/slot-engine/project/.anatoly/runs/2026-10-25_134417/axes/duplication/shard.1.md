[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 90% | Logic is identical to lineWins in src/paytable.ts: same WILD-substitution for first symbol, same SCATTER/WILD guard, same consecutive-match loop with break, same >= 3 threshold, same return shape. Differences are cosmetic: variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count). |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 92% | Logic is identical to checkLine in src/engine.ts: both resolve the lead symbol from WILD-prefixed input, bail on WILD/SCATTER leads, count consecutive matching symbols treating WILD as wildcard, and return null below 3 matches. Only difference is return-object field names (symbol/count vs sym/run) and local variable names. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 92% | Identical logic to weightedPick in src/rng.ts: both compute total weight, draw Math.random()*total, accumulate weights in a loop, return items[i] on first match, fall back to last item. The only differences are variable names (total/totalWeight, r/roll, acc/cumulative) and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol. The generic version subsumes this one entirely. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 95% | Logic is virtually identical to `pickFromWeighted` in src/reels.ts: both reduce weights to a total, draw `Math.random() * total`, accumulate in a loop with an early return when roll < cumulative, and fall back to the last item. The only differences are variable names (cosmetic) and that `weightedPick` is generic `<T>` while `pickFromWeighted` is hardcoded to `Symbol[]`. Same semantic contract — weighted random selection — making `pickFromWeighted` a non-generic private copy of this exported utility. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-6 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-3 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-83e35f-2 --> **[duplication · high · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
- [ ] <!-- ACT-4db700-1 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
