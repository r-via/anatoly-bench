[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 2

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 82% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 82% | JSDoc describes purpose and algorithm but omits @param descriptions (no docs for `items` or `weights`), no @returns tag, and no mention of edge cases (empty arrays, negative/zero weights, mismatched array lengths). |

## 🧹 Hygiene

- [ ] <!-- ACT-4db700-2 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
