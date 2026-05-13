[← Back to Utility](./index.md) · [← Back to report](../../public_report.md)

# ♻️ Utility — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [⚡ Quick Wins](#-quick-wins)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Utility | Conf. | Details |
|------|---------|---------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcstrategyts) |
| `src/types.ts` | 🟡 NEEDS_REFACTOR | 1 | 100% | [details](#srctypests) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `Bet` | L12–L12 | 🔴 DEAD | 92% | Auto-resolved: type cannot be over-engineered |

### `src/reels.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `getReelSymbols` | L52–L54 | 🟡 LOW_VALUE | 85% | Trivial identity getter returning SYMBOLS; runtime-imported by src/engine.ts but provides no logic |
| `getReelWeights` | L56–L58 | 🟡 LOW_VALUE | 85% | Trivial accessor returning array element; runtime-imported by src/engine.ts but adds no value |

### `src/paytable.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `ANCIENT_RTP` | L3–L3 | 🔴 DEAD | 95% | Exported constant with 0 runtime and 0 type-only importers |
| `lineWins` | L23–L40 | 🔴 DEAD | 91% | Exported function with 0 runtime and 0 type-only importers |

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
| `computeLegacyPayout` | L4–L24 | 🔴 DEAD | 88% | Exported but imported by 0 files |

## ⚡ Quick Wins

- [ ] <!-- ACT-28c3e3-5 --> **[utility · high · trivial]** `src/engine.ts`: Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]
- [ ] <!-- ACT-f69593-2 --> **[utility · high · trivial]** `src/legacy.ts`: Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-1 --> **[utility · high · trivial]** `src/paytable.ts`: Remove dead code: `ANCIENT_RTP` is exported but unused (`ANCIENT_RTP`) [L3-L3]
- [ ] <!-- ACT-df0e0f-2 --> **[utility · high · trivial]** `src/paytable.ts`: Remove dead code: `lineWins` is exported but unused (`lineWins`) [L23-L40]
- [ ] <!-- ACT-e0699c-3 --> **[utility · high · trivial]** `src/strategy.ts`: Remove dead code: `ConservativeStrategy` is exported but unused (`ConservativeStrategy`) [L13-L20]

## 🧹 Hygiene

- [ ] <!-- ACT-83e35f-8 --> **[utility · low · trivial]** `src/reels.ts`: Consider removing low-value code: `getReelSymbols` (`getReelSymbols`) [L52-L54]
- [ ] <!-- ACT-83e35f-9 --> **[utility · low · trivial]** `src/reels.ts`: Consider removing low-value code: `getReelWeights` (`getReelWeights`) [L56-L58]
