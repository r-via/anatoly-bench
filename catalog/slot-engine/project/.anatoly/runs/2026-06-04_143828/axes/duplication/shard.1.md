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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `checkLine` | L47–L64 | 🔴 DUPLICATE | 80% | Logic is identical to lineWins in src/paytable.ts: same WILD-skip to find leading symbol, same SCATTER/WILD early-exit, same counting loop with break, same ≥3 threshold. Only differences are variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count). Functions are fully interchangeable after a rename. |

### `src/reels.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `pickFromWeighted` | L30–L41 | 🔴 DUPLICATE | 92% | Logic is identical to weightedPick in src/rng.ts: same weighted-random algorithm, same reduce for total, same cumulative loop with early return, same fallback to last element. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative), non-generic Symbol[] type instead of T, and missing export. These are interchangeable implementations. |

### `src/paytable.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `lineWins` | L23–L40 | 🔴 DUPLICATE | 92% | Logic is virtually identical to checkLine in src/engine.ts: both resolve the lead symbol identically (WILD-at-index-0 substitution), both null-out on WILD/SCATTER lead, both count a left-anchored consecutive run including WILDs, both gate return on run >= 3. Differences are only cosmetic — variable names (first/count vs lead/run) and return property names (symbol/count vs sym/run). Same semantic contract: detect a paying run on a payline. |

### `src/rng.ts`

| Symbol | Lines | Duplication | Conf. | Detail |
|--------|-------|-------------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 DUPLICATE | 92% | Logic is identical to pickFromWeighted in src/reels.ts: both sum weights, draw Math.random() * total, accumulate per-item and return on first overshoot, fallback to last item. Only differences are generic type parameter T vs concrete Symbol type and variable renaming (totalWeight/roll/cumulative vs total/r/acc). |

## 🔧 Refactors

- [ ] <!-- ACT-28c3e3-9 --> **[duplication · high · small]** `src/engine.ts`: Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]
- [ ] <!-- ACT-df0e0f-4 --> **[duplication · high · small]** `src/paytable.ts`: Deduplicate: `lineWins` duplicates `checkLine` in `src/engine.ts` (`lineWins`) [L23-L40]
- [ ] <!-- ACT-4db700-2 --> **[duplication · high · small]** `src/rng.ts`: Deduplicate: `weightedPick` duplicates `pickFromWeighted` in `src/reels.ts` (`weightedPick`) [L5-L16]
- [ ] <!-- ACT-83e35f-4 --> **[duplication · medium · small]** `src/reels.ts`: Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
