[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 2

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 85% | JSDoc describes the function's purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negative weights). (deliberated: confirmed — Confirmed duplicate: weightedPick (rng.ts:5-16) is 100% algorithmically identical to pickFromWeighted (reels.ts:30-41). weightedPick is imported by engine.ts:2, registered in DI container at engine.ts:30, resolved at engine.ts:120, but the resolved `rng` variable is never used. The actual RNG path is: factory.buildReels → spinReel → pickFromWeighted, completely bypassing the DI-registered weightedPick. This is a real latent bug: swapping the RNG in the container would have no effect on reel generation. Confidence bumped slightly as the DI bypass is conclusively verified.) |

## 🧹 Hygiene

- [ ] <!-- ACT-4db700-4 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
