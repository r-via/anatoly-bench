[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 90% | Logic is identical to lineWins in src/paytable.ts: same WILD-skip leading-symbol resolution, same consecutive-run loop with WILD substitution, same >= 3 threshold. Only cosmetic differences: variable names (lead vs first) and return property names (sym/run vs symbol/count). |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 60% | Logic is identical to weightedPick in src/rng.ts: both compute a total weight via reduce, draw Math.random() * total, iterate accumulating weights, and return items[i] on first threshold crossing with the same fallback. Differences are purely cosmetic (variable names: total/totalWeight, r/roll, acc/cumulative, wts/weights) and that pickFromWeighted is typed to Symbol[] while weightedPick is generic. These functions are fully interchangeable; spinReel could call weightedPick<Symbol> directly. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 92% | Identical algorithm to checkLine in src/engine.ts: same WILD-skipping lead detection, same SCATTER/WILD null guard, same counting loop with WILD matching, same >= 3 threshold. Only differences are variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). Functions are fully interchangeable. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 85% | Logic is identical to pickFromWeighted in src/reels.ts: same reduce for total, same Math.random() * total roll, same accumulator loop with early return, same last-item fallback. Only differences are variable names and the generic <T> type parameter vs hard-coded Symbol type. Both implement the same cumulative-weight algorithm with no behavioral divergence. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-8 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-5 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-1 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-83e35f-2 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
