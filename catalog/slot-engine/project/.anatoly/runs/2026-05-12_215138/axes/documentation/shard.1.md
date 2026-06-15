[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 95% | Has a JSDoc block mentioning house edge and ~95% RTP target, but omits: parameter descriptions, the unconditional `bet * 0.01` floor addition, the Math.ceil rounding, and the `bet: any` type issue. Return value is not documented. (deliberated: confirmed — Confirmed three defects. (1) engine.ts:105: `total * (1 + HOUSE_EDGE)` = `total * 1.05` — INCREASES payout by 5% instead of reducing it. The JSDoc at engine.ts:99 states 'maintain a target RTP of approximately 95%' and README.md:42 documents '95% RTP', so the correct formula is `total * (1 - HOUSE_EDGE)` = `total * 0.95`. The house edge is applied in the wrong direction, making the game player-favorable. (2) engine.ts:108: `total += bet * 0.01` unconditionally adds 1% of bet to every spin payout, guaranteeing a minimum return even on zero-win spins — undocumented and financially unsound. (3) engine.ts:101: `bet: any` instead of `number` defeats TypeScript type safety on a financial parameter. Raising confidence because all three defects are unambiguously verified against the documented intent.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. Missing: what reelIndex valid range is (0–4), that it returns 3 symbols (one per row), and that sampling is independent per row. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. Should note it returns the canonical ordered symbol list and whether the returned array is a copy or a mutable reference. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 75% | Exported public API with no JSDoc. Missing: valid range of reelIndex, units/semantics of returned weights, and whether the array is a direct reference to internal state. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc comment. Missing documentation for parameters (symbol, count), return value (multiplier magnitude/units), valid count range, and the 0 fallback for unknown symbols or non-winning counts. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 88% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 80% | No JSDoc on the class or any of its public methods (on, off, emit). Parameters, return values, and behavior (e.g. silent no-op when no listeners exist) are undocumented. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. The event's semantics — when it is emitted and what payload it carries — are not described. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 55% | No JSDoc comment. Notable behavior — _rowCount is ignored entirely — is undocumented, as are parameter semantics and return shape. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. State-mutation side effects, threshold logic (scatters >= 3), spin award amounts (10), and decrement/deactivation behavior are all undocumented. (deliberated: confirmed — Confirmed two independent defects. (1) engine.ts:141 creates a fresh `FreeSpinState` with `active: false` on every spin call. This makes freespin.ts:17-18 (retrigger branch: `state.active && scatters >= 3`) and freespin.ts:19-23 (decrement branch: `state.active`) permanently unreachable as integrated — the free spin feature is non-functional. Only the initial trigger path (freespin.ts:14-16) ever executes. (2) types.ts:21 defines `totalWon: number` on FreeSpinState, but `handleFreeSpins` never writes to it (grep confirms only two references: the type definition and the initialization to 0 at engine.ts:141). Free spin winnings are never accumulated. Both are real logic defects, not style preferences.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of jackpot logic, explanation of the threshold (>=4 DIAMONDs), parameter shape (2D reel grid), and return semantics. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 90% | JSDoc describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at rng.ts:5-16 implements a standard cumulative-weight algorithm that is correct for all valid inputs. The fallback at rng.ts:15 (`return items[items.length - 1]`) correctly handles floating-point edge cases. The original finding conflates duplication (pickFromWeighted in reels.ts:30-41 reimplements identical logic) with a correction defect in weightedPick itself — but there is no bug in the function. Additionally, engine.ts:120 resolves `rng` from the container but never invokes it; the actual reel generation flows through factories.ts:12 → reels.ts:43-49 → pickFromWeighted. The unused-resolved-variable and duplication are real issues but belong on the utility and duplication axes, not correction. No behavioral fix is needed in the function itself.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-9 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-5 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-4 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-4 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-2 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-12 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
