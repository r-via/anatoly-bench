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
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 90% | Logic is identical to lineWins in src/paytable.ts: same WILD-substitution to find lead symbol, same WILD/SCATTER null-guard, same counting loop with identical break condition, same >= 3 threshold. Only differences are local variable names (lead/run vs first/count) and return field names (sym/run vs symbol/count) — the functions are interchangeable. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 92% | Logic is virtually identical to checkLine in src/engine.ts: same WILD-first resolution (symbols[0]==='WILD' ? find first non-WILD : symbols[0]), same consecutive-run loop breaking on first mismatch, same threshold (>= 3). Differences are purely cosmetic — variable names (first/count vs lead/run) and return field names ({symbol,count} vs {sym,run}). Same semantic contract: extract the leading run of matching symbols from a payline. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 95% | Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random() * total, accumulate weights in a loop, and return the last item as fallback. The only differences are variable names (r vs roll, acc vs cumulative) and that pickFromWeighted is Symbol-typed while weightedPick is generic — the functions are interchangeable for Symbol arrays. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 95% | Logic is virtually identical to pickFromWeighted in src/reels.ts: both reduce weights to a total, scale Math.random() by that total, accumulate in a loop, and fall back to the last item. The only differences are variable names and that weightedPick is generic (<T>) while pickFromWeighted is typed to Symbol[]. Same algorithm, same semantics, same fallback behavior. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-7 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-3 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-83e35f-3 --> **[duplication · high · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
- [ ] <!-- ACT-4db700-2 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
