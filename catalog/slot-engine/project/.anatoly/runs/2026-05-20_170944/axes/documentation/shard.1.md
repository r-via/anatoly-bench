[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 75% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), explanation that the returned array contains 3 symbols (one per row), and the independence of each pick. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 92% | Exported public API with no JSDoc. Missing: description of return value as the ordered symbol list used for weight-index alignment. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 75% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSymbols(), and that it is read-only at runtime. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc on exported public function. Missing: param descriptions for symbol and count, return value semantics, behavior for WILD/SCATTER (returns 0), and valid count range. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. The abstract class and its `adjustPayout` contract — purpose, expected input/output semantics, and extension guide — are entirely undocumented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The identity-passthrough behavior of `adjustPayout` is not documented; callers cannot know this is a no-op without reading the implementation. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 82% | No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). Public API surface with non-trivial semantics (listener deduplication behavior, variadic args) is entirely undocumented. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The constant's role as the event name emitted after each spin() call, and the shape of its payload, are not described anywhere inline. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The non-obvious behavior — rowCount is silently ignored; reel height is always fixed by spinReel() — is undocumented. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D readonly array), and return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-trivial state machine with three distinct branches (activation, retrigger, decrement/deactivation) and a mutation side-effect — none of which are documented. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The threshold of 4 DIAMOND symbols and the flat grid-wide counting strategy (not payline-restricted) are non-obvious and undocumented. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 90% | JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what `items` and `weights` represent, no constraint that arrays must be same length or weights must be positive), and no @returns tag describing what is returned or edge-case behavior when all weights are zero. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug in the function itself. weightedPick (rng.ts:5-16) is a correct generic weighted random selection implementation. The duplication with pickFromWeighted is real but belongs on the duplication axis. Critically: engine.ts:120 resolves weightedPick from the container as `rng`, but this resolved variable is never called — the actual spin path uses pickFromWeighted via factory.buildReels → spinReel. This is dead-at-runtime registration (architectural concern), not a correctness bug. The function works correctly when called.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-8 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol:  `Bet`, `computePayout`, `spin` (`Bet, computePayout, spin`) [L12-L12, L101-L111, L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-4 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-8 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 33% covered

- [ ] **computePayout** — MISSING: Exported function not mentioned in README. The bet*0.01 minimum-return floor and house-edge application are undocumented in any docs/ page.
- [ ] **Bet** — MISSING: Exported type alias not referenced in README or any docs/ page. Valid range and constraints are undocumented.
