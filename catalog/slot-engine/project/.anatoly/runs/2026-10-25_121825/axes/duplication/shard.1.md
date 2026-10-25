[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 97% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 92% | Logic is identical to lineWins in src/paytable.ts — same WILD-skip lead detection, same sequential run count loop, same run>=3 guard, same return structure. Only differences are local variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count). |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 90% | Algorithm is identical to checkLine in src/engine.ts: both resolve the lead non-WILD symbol, guard on WILD/SCATTER, count a consecutive run treating WILD as wildcard, and return null if run < 3. Only difference is return property names (symbol/count vs sym/run) — the semantic contract is interchangeable. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 92% | Logic is identical to weightedPick in src/rng.ts: both compute total weight via reduce, roll Math.random() * total, accumulate weights in a loop, return items[i] on first hit, and fall back to the last item. The only differences are variable names (total/totalWeight, r/roll, acc/cumulative) and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol — making them interchangeable for Symbol arrays. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 92% | Logic is identical to pickFromWeighted in src/reels.ts: both compute total weight via reduce, draw Math.random() * total, accumulate weights in a loop, and fall back to the last item. Only differences are variable names and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol — the algorithm and semantic contract are interchangeable. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-6 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-3 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-83e35f-1 --> **[duplication · high · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
- [ ] <!-- ACT-4db700-1 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
