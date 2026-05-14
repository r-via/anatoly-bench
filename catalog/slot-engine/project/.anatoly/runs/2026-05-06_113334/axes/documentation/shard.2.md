[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 2

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 88% | The function has a JSDoc comment that describes its general purpose and algorithm, but it is missing @param descriptions for 'items' and 'weights' (e.g., constraints like weights.length must equal items.length, or that weights should be non-negative), a @returns tag describing what is returned, a @template tag for the generic type parameter T, and any edge-case behavior (e.g., what happens when items/weights are empty). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/rng.ts:5-16 is algorithmically correct — identical logic to pickFromWeighted with only cosmetic differences (variable names: totalWeight/roll/cumulative vs total/r/acc; generic T vs concrete Symbol). It IS imported by src/engine.ts:2 and registered in the DI container at engine.ts:30, but critically, after being resolved at engine.ts:120 (`const rng = container.resolve<typeof weightedPick>('rng')`), the `rng` variable is never actually called — the factory at factories.ts:12 calls spinReel() which uses pickFromWeighted instead. So weightedPick is effectively dead code in the runtime spin path. However, this is an engine.ts wiring issue, not a bug in weightedPick itself. The function works correctly when called. The finding conflates duplication (valid concern, belongs on duplication axis) with correction (no bug present). The proper fix is to refactor reels.ts to import and use weightedPick, eliminating pickFromWeighted — this would have zero behavioral impact since the algorithms are identical.) |

## 🧹 Hygiene

- [ ] <!-- ACT-4db700-5 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
