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
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcfactoriests) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srclegacyts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 70% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 95% | JSDoc mentions house-edge application and ~95% RTP target but omits: the `bet * 0.01` floor added unconditionally, the `Math.ceil` rounding, the `any` type on `bet`, and the fact that house edge is applied as a bonus multiplier (increasing payout, not reducing it — which contradicts a typical house-edge definition). (deliberated: confirmed — Confirmed three independent defects. (1) engine.ts:105 — `total * (1 + HOUSE_EDGE)` multiplies by 1.05, increasing payout; should be `(1 - HOUSE_EDGE)` to achieve stated 95% RTP. (2) engine.ts:108 — `total += bet * 0.01` runs unconditionally, adding 1% of bet even on zero-win spins, leaking money every spin. (3) engine.ts:101 — `bet: any` despite exported `Bet = number` type alias at L12. Together these push implied RTP well above 100% in a gambling engine. Raising confidence to 95 because all three defects are trivially verifiable in source.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Missing: valid range for reelIndex (0–4), that the return is a 3-element column (one Symbol per row), and behavior on out-of-range index. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 80% | No JSDoc. Should note it returns the shared SYMBOLS reference (mutation risk) and that order matches weight array indices. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Missing @param reelIndex range constraint and note that the returned array is a direct reference (mutable). |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | No JSDoc. Missing description of parameters (symbol identity constraints, valid count range), return semantics (multiplier applied to what base?), and the 0 sentinel for unknown symbols or out-of-range counts. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 95% | Auto-resolved: import verified on disk (spinReel found in ./reels.js) |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 82% | No JSDoc on the class or any of its public methods (on, off, emit). Public API with non-trivial behavior (listener deduplication on off, silent no-op when event has no handlers) needs documentation. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. An exported event name constant should document when it is emitted and what args, if any, accompany it. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Purpose is inferrable from name, but return value semantics (total count across all reels/symbols) and parameter shape are undocumented. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 65% | No JSDoc comment. Non-trivial state machine logic: activation threshold (>=3 scatters), retrigger behavior (+10 spins), and decrement-to-deactivate path are all undocumented. (deliberated: confirmed — Off-by-one confirmed in isolation: freespin.ts:17-18 re-trigger branch adds 10 spins via `remaining += 10` but does not decrement for the current spin (decrement only in the else branch at L20). This grants one extra spin per re-trigger. However, in the only call site (engine.ts:141-142), FreeSpinState is created fresh with `active: false` on every spin() call, making the re-trigger branch (L17: `state.active && scatters >= 3`) unreachable. The bug exists in the function's contract but has zero runtime impact in current usage. Lowering confidence to 65.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of jackpot logic, param shape of `reels`, return semantics, and the threshold (>=4 DIAMONDs). |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-6 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-7 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-5 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-4 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-8 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-4 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-3 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-11 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
