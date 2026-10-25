[← Back to Utility](./index.md) · [← Back to report](../../public_report.md)

# ♻️ Utility — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🔧 Refactors](#-refactors)

## 📊 Findings

| File | Verdict | Utility | Conf. | Details |
|------|---------|---------|-------|---------|
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 93% | [details](#srcpaytablets) |
| `src/types.ts` | 🟡 NEEDS_REFACTOR | 1 | 100% | [details](#srctypests) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcstrategyts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 1 | 80% | [details](#srclegacyts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 1 | 70% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/paytable.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `ANCIENT_RTP` | L3–L3 | 🔴 DEAD | 90% | Exported but imported by 0 files |
| `lineWins` | L23–L40 | 🔴 DEAD | 90% | Exported but imported by 0 files |

### `src/types.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `LegacySpinResult` | L24–L28 | 🔴 DEAD | 100% | Exported but imported by 0 files |

### `src/strategy.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `ConservativeStrategy` | L13–L20 | 🔴 DEAD | 78% | Exported but imported by 0 files |

### `src/legacy.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `computeLegacyPayout` | L4–L24 | 🔴 DEAD | 80% | Exported but imported by 0 files |

### `src/wild.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `applyWildBonus` | L1–L4 | 🔴 DEAD | 70% | Exported but imported by 0 files |

## ⚡ Quick Wins

- [ ] <!-- ACT-f69593-1 --> **[utility · high · trivial]** `src/legacy.ts`: Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-1 --> **[utility · high · trivial]** `src/paytable.ts`: Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- [ ] <!-- ACT-df0e0f-2 --> **[utility · high · trivial]** `src/paytable.ts`: Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]

## 🔧 Refactors

- [ ] <!-- ACT-e0699c-1 --> **[utility · medium · trivial]** `src/strategy.ts`: Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
- [ ] <!-- ACT-6c7a2e-1 --> **[utility · medium · trivial]** `src/wild.ts`: Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]
