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
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcwildts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `DEBUG_MODE` | L15–L15 | 🟡 LOW_VALUE | 60% | Hardcoded `false`; the guarded `console.log` block in spin (L168–170) can never execute. Dead branch masquerading as a feature flag. |

### `src/wild.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `applyWildBonus` | L1–L4 | 🔴 DEAD | 90% | Exported but imported by 0 files |

### `src/legacy.ts`

| Symbol | Lines | Utility | Conf. | Detail |
|--------|-------|---------|-------|--------|
| `computeLegacyPayout` | L4–L24 | 🔴 DEAD | 85% | Exported but imported by 0 files |

## ⚡ Quick Wins

- [ ] <!-- ACT-f69593-2 --> **[utility · high · trivial]** `src/legacy.ts`: Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-6c7a2e-1 --> **[utility · high · trivial]** `src/wild.ts`: Remove dead code: `applyWildBonus` is exported but unused (`applyWildBonus`) [L1-L4]

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-6 --> **[utility · low · trivial]** `src/engine.ts`: Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
