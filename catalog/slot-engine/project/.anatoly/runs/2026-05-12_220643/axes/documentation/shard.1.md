[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srclegacyts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 95% | JSDoc mentions house-edge application and ~95% RTP target but omits: the +1% flat bet bonus (bet * 0.01), the Math.ceil rounding, the meaning of the `bet` parameter (typed `any`), and the `lineWins` parameter structure. (deliberated: confirmed — Confirmed two correctness bugs. (1) src/engine.ts:105 — `total * (1 + HOUSE_EDGE)` multiplies by 1.05, increasing payout by 5%. The docstring at lines 98-100 states intent is 95% RTP, requiring `(1 - HOUSE_EDGE)`. House edge is inverted. (2) src/engine.ts:108 — `total += bet * 0.01` unconditionally adds 1% of bet on every spin including losses, guaranteeing a minimum payout that undermines the financial model. Additionally, `bet: any` at line 101 bypasses type safety despite the runtime check in `spin()` at line 114. These are real defects affecting monetary calculations.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: @param reelIndex (valid range 0–4), @returns (3-symbol column array), behavior on out-of-range index. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. Does not clarify that the returned array is the shared mutable reference to SYMBOLS. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 88% | Exported public API with no JSDoc. Missing: @param reelIndex valid range, @returns (direct reference to internal array — mutation risk), behavior on invalid index. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc comment. Missing documentation for parameters (what valid values of `count` are, what happens outside 3–5), return value (multiplier of what?), and the 0 sentinel for unknown symbols or out-of-range counts. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 82% | No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). Parameters, return values, and behavior (e.g. silent no-op in `off` when event absent) are undocumented. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc describing when this event is emitted or what args handlers should expect. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 65% | No JSDoc comment. `_rowCount` is silently ignored — a critical behavioral detail that must be documented for callers. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 78% | No JSDoc comment. State mutation side-effects, activation threshold (>=3 scatters), spin award (10), and decrement/deactivation logic are undocumented. (deliberated: confirmed — Confirmed two issues. (1) `totalWon` is declared in FreeSpinState (src/types.ts:21) and initialized to 0 (src/engine.ts:141) but never updated by handleFreeSpins — the field is unused, indicating incomplete implementation. (2) The retrigger branch at src/freespin.ts:17-18 (`state.remaining += 10`) has no cap on accumulated free spins. Furthermore, this branch is unreachable in current usage: src/engine.ts:141 creates a fresh FreeSpinState with `active: false` on every spin call, so the condition `state.active && scatters >= 3` at freespin.ts:17 can never be true. The function logic is self-consistent but the integration is broken — free spin state needs persistence across spins for retriggering to work. Raised confidence slightly from 72 to 78 based on the additional unreachable-retrigger evidence.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of jackpot condition (>=4 DIAMOND symbols across all reels), parameter shape, and return semantics. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-8 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-4 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-5 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-4 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-4 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-2 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-12 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
