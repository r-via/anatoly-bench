[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 2

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 45% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 45% | File-level JSDoc describes purpose and algorithm, but the function itself lacks parameter descriptions (@param items, @param weights), a @returns tag, and edge-case behavior (e.g., mismatched array lengths, zero/negative weights, empty arrays). (deliberated: confirmed — The function at rng.ts:5-16 is algorithmically correct. Verified: cumulative-weight selection with proper generics and fallback. The NEEDS_FIX claim is about duplication with reels.ts:pickFromWeighted — confirmed identical algorithm, differing only in generics (T vs Symbol) and variable names. However, correction axis is wrong for this: weightedPick has no bug. The real issue: engine.ts:2 imports it, engine.ts:30 registers it in container, engine.ts:120 resolves it into `rng` — but `rng` is never called (ESLint no-unused-vars, per engine review L122). The actual reel RNG goes through factory→spinReel→pickFromWeighted, completely bypassing weightedPick. This is dead-code-in-practice + duplication, not a correction issue. Lowering confidence to 45 — below reclassification threshold because function is correct and the concern belongs on duplication axis.) |

## 🧹 Hygiene

- [ ] <!-- ACT-4db700-4 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
