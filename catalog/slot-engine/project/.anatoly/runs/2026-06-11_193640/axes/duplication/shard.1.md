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
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 90% | Logic is functionally identical to lineWins in src/paytable.ts: both resolve the lead symbol by skipping WILDs, guard against WILD/SCATTER leads, count consecutive matching-or-WILD symbols, and return null when run < 3. Only superficial differences: field names sym/run vs symbol/count and local variable names lead vs first. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 92% | Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, draw Math.random()*total, accumulate per-index, and return the item whose cumulative threshold is first exceeded, falling back to the last item. The only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and that pickFromWeighted constrains items to Symbol[] instead of using a generic T[]. These functions are fully interchangeable; pickFromWeighted should be replaced with weightedPick<Symbol>. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 92% | Logic is identical to checkLine: both resolve a lead symbol skipping WILDs, early-return null for WILD/SCATTER leads, count consecutive matching-or-WILD symbols, and return null if count < 3. Only difference is return-object property names (symbol/count vs sym/run) and local variable names — not a semantic distinction. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 85% | Identical cumulative-weight algorithm: reduce total, draw Math.random()*total, accumulate per-item until threshold, fall back to last element. Only differences are variable names and that pickFromWeighted is locked to Symbol[] while weightedPick is generic. pickFromWeighted could be replaced by a call to weightedPick with no behavioral change. |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-8 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-4 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-1 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-83e35f-2 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
