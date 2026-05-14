[← Back to Utility](./index.md) · [← Back to report](../../public_report.md)

# ♻️ Utility — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)

## 📊 Findings

| File | Verdict | Utility | Conf. | Details |
|------|---------|---------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/types.ts` | 🟡 NEEDS_REFACTOR | 1 | 100% | [details](#srctypests) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcstrategyts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcwildts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `Bet` | L12–L12 | 🔴 DEAD | 95% | Auto-resolved: type cannot be over-engineered |

### `src/paytable.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `ANCIENT_RTP` | L3–L3 | 🔴 DEAD | 92% | Exported constant with zero runtime importers and no type-only importers |
| `lineWins` | L23–L40 | 🔴 DEAD | 92% | Exported function with zero runtime importers and no type-only importers |

### `src/types.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `LegacySpinResult` | L24–L28 | 🔴 DEAD | 100% | Exported but imported by 0 files |

### `src/strategy.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `ConservativeStrategy` | L13–L20 | 🔴 DEAD | 90% | Exported but imported by 0 files |

### `src/wild.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `applyWildBonus` | L1–L4 | 🔴 DEAD | 90% | Exported but imported by 0 files |

### `src/legacy.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `computeLegacyPayout` | L4–L24 | 🔴 DEAD | 88% | Exported but imported by 0 files |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-5 --> **[utility · high · trivial]** `src/engine.ts`: Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]
- [ ] <!-- ACT-f69593-2 --> **[utility · high · trivial]** `src/legacy.ts`: Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-1 --> **[utility · high · trivial]** `src/paytable.ts`: Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- [ ] <!-- ACT-df0e0f-2 --> **[utility · high · trivial]** `src/paytable.ts`: Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]
- [ ] <!-- ACT-e0699c-1 --> **[utility · high · trivial]** `src/strategy.ts`: Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]
- [ ] <!-- ACT-6c7a2e-1 --> **[utility · high · trivial]** `src/wild.ts`: Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]
