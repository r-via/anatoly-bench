[← Back to Utility](./index.md) · [← Back to report](../../public_report.md)

# ♻️ Utility — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Utility | Conf. | Details |
|------|---------|---------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcstrategyts) |
| `src/types.ts` | 🟡 NEEDS_REFACTOR | 1 | 100% | [details](#srctypests) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 1 | 65% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `Bet` | L12–L12 | 🔴 DEAD | 90% | Exported type alias, 0 importers in codebase |

### `src/paytable.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `ANCIENT_RTP` | L3–L3 | 🔴 DEAD | 95% | Exported constant with no runtime or type-only importers |
| `lineWins` | L23–L40 | 🔴 DEAD | 92% | Exported function with no runtime or type-only importers |

### `src/strategy.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `ConservativeStrategy` | L13–L20 | 🔴 DEAD | 90% | Exported but imported by 0 files |

### `src/types.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `LegacySpinResult` | L24–L28 | 🔴 DEAD | 100% | Exported but imported by 0 files |

### `src/legacy.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `computeLegacyPayout` | L4–L24 | 🔴 DEAD | 65% | Exported but imported by 0 files |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-4 --> **[utility · high · trivial]** `src/engine.ts`: Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]
- [ ] <!-- ACT-df0e0f-1 --> **[utility · high · trivial]** `src/paytable.ts`: Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- [ ] <!-- ACT-df0e0f-2 --> **[utility · high · trivial]** `src/paytable.ts`: Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]
- [ ] <!-- ACT-e0699c-2 --> **[utility · high · trivial]** `src/strategy.ts`: Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

## 🔧 Refactors

- [ ] <!-- ACT-f69593-2 --> **[utility · medium · trivial]** `src/legacy.ts`: Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
