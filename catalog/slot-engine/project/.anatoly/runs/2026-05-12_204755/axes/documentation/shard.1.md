[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srcwildts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 68% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | JSDoc exists but is misleading: comment says house edge maintains ~95% RTP, yet the code adds `HOUSE_EDGE` to winning payouts (inflating them) and unconditionally adds `bet*0.01`. Neither behavior matches the stated intent, and `bet` is typed `any`. Parameters and return are undescribed. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 90% | No JSDoc on exported function. Missing: @param reelIndex (valid range 0–4), @returns (3-element column of symbols), and that results are independent per row. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | No JSDoc on exported function. Missing @returns description and whether the returned array is a copy or a reference to the internal constant. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 88% | No JSDoc on exported function. Missing @param reelIndex valid range, @returns description, and whether mutation of the returned array affects internal state. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc comment. Missing @param descriptions for symbol and count, no @returns explaining that 0 means no win or unrecognised symbol, and no note on valid count range (3–5). |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 82% | No JSDoc on the class or any of its public methods (on, off, emit). All three methods lack parameter and behavior documentation. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment explaining when this event is emitted or what payload consumers should expect. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Concrete implementation ignores rowCount (_rowCount) without explanation, and delegates to spinReel without documenting the resulting structure or side effects. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 78% | No JSDoc comment. State mutation side effects, threshold logic (>=3 scatters), and retrigger behavior (+10 spins) are non-obvious and undocumented. (deliberated: confirmed — Confirmed retrigger inconsistency at freespin.ts:17-18: when active && scatters >= 3, remaining += 10 without decrementing for the current spin, while the normal active branch (L19-20) does decrement. This asymmetry awards 11 effective spins on retrigger vs the intended 10. The negative-remaining claim (defect 2) is not reachable in normal flow: starting from remaining=10 and decrementing, it reaches 0 and deactivates cleanly at L21-22. Confidence lowered from 90→78 because engine.ts:141 creates a fresh FreeSpinState with active=false on every spin() call, making the retrigger branch unreachable in current usage — the defect is real in the function's contract but dormant.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of jackpot condition (>=4 DIAMONDs across all reels), parameter shape, and return semantics. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 68% | JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (e.g., empty arrays, negative weights, mismatched array lengths). (deliberated: confirmed — Two claimed defects at rng.ts:5-16. Defect 1 (Math.random() non-certifiable): same as pickFromWeighted — this is a compliance concern, not a correctness bug; reclassified. Defect 2 (empty items returns undefined): Confirmed real at rng.ts:15 — items[items.length - 1] with empty array yields items[-1] = undefined typed as T, a type-safety violation that could cause downstream runtime errors. However, no current caller passes empty arrays: engine.ts:30 registers it in the container, engine.ts:120 resolves it, but factory.buildReels (factories.ts:12) calls spinReel→pickFromWeighted instead, so weightedPick is never actually invoked. Confidence lowered from 85→68: one of two claimed defects is valid but unreachable in current code.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-8 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-4 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-5 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-2 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-4 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
