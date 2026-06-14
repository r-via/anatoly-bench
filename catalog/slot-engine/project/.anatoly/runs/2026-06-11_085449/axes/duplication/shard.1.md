[← Back to Duplication](./index.md) · [← Back to report](../../public_report.md)

# 📋 Duplication — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Duplication | Conf. | Details |
|------|---------|-------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 70% | Logic is identical to lineWins in src/paytable.ts — same WILD lead resolution, same WILD/SCATTER guard, same consecutive-run counting loop, same >= 3 threshold. Only differences are variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count). Functions are interchangeable. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 92% | Logic is identical to weightedPick in src/rng.ts: both sum total weight, multiply Math.random() by total, accumulate in a loop, and return items[items.length-1] as fallback. Only differences are variable names and that pickFromWeighted is typed to Symbol[] while weightedPick is generic. The two functions are fully interchangeable. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 92% | Logic is identical to checkLine in src/engine.ts: both resolve the lead symbol by skipping leading WILDs, guard on WILD/SCATTER, count consecutive matching-or-WILD symbols, and return null below 3. Differences are cosmetic only — variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). The two functions are interchangeable. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 85% | Logic is identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, scale Math.random() by that total, accumulate in a loop, and fall back to the last item. The only differences are variable names (totalWeight/roll/cumulative vs total/r/acc) and type parameter (generic <T> vs concrete Symbol). The generic version is a superset and the two are fully interchangeable for the Symbol[] call-site in reels.ts. |

## 🔧 Refactors

- [ ] <!-- ACT-df0e0f-4 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-2 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-28c3e3-9 --> **[duplication · medium · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-83e35f-3 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
