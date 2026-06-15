[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 4 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcpaytablets) |
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
| `computePayout` | L101–L111 | 🟡 PARTIAL | 85% | Has a JSDoc block describing general purpose and house-edge intent, but lacks @param tags for lineWins and bet, lacks a @returns description, and the description is misleading — it claims 95% RTP but the code multiplies total by (1 + HOUSE_EDGE), which inflates rather than reduces payout. The bet type is declared as `any`, also undocumented. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `ReelWeightConfig` | L7–L10 | 🟡 PARTIAL | 72% | Auto-resolved: type cannot be over-engineered |
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. This is a public exported function with no documentation explaining the 'reelIndex' parameter (valid range, what 'reel' means), the hardcoded row count of 3, or the structure and semantics of the returned Symbol[] column. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 72% | No JSDoc comment. Public exported getter with no documentation. While simple, it is part of the public API and should at minimum describe what the returned array represents and that it is the canonical symbol list. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. Public exported function with no documentation for the 'reelIndex' parameter (valid range, zero-based index) or the meaning and structure of the returned number[] (parallel to getReelSymbols() ordering). |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 90% | Exported function with no JSDoc/TSDoc comment. Missing documentation for both parameters (what 'count' valid range is, what happens outside 3–5), the return value meaning (multiplier applied to what base?), and the edge case where an unknown symbol returns 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 78% | No JSDoc/TSDoc comment present. As the public abstract base class defining the extension contract for payout adjustment, it warrants at minimum a description of its purpose, the strategy pattern intent, and guidance on how consumers should subclass it. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment present. While the pass-through behavior is inferrable from the implementation, there is no documentation clarifying that this is the no-op/identity strategy intended as the baseline when no payout adjustment is desired. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | Exported constant with no JSDoc. The bare string value 'spin:done' and name give only a rough hint; there is no documentation explaining when this event is emitted, what payload accompanies it, or why consumers should prefer this constant over the raw string literal. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 75% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment on either the class or its buildReels method. The prefixed _rowCount parameter signals a notable behavioral divergence from the parent contract (rowCount is silently ignored; reel height is implicitly fixed by spinReel), which is a non-obvious side-effect that warrants explicit documentation. Without it, callers have no indication that passing a non-default rowCount has no effect. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment present. As an exported public function, it should document its parameter (`reels` — a 2-D grid of symbols), the traversal strategy (full grid, not payline-restricted), and the return value (count of SCATTER symbols found). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment present. As an exported public function with non-trivial branching logic (initial trigger, retrigger, decrement, deactivation), it should document the `state` mutation side-effects, the `scatters` threshold (≥ 3), retrigger behaviour (+10 spins), and the void return. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment is present above or within the function. The function has non-trivial semantics (counts DIAMOND symbols across a 2D reel array, triggers jackpot at >= 4) that warrant documentation of its parameter shape, return value meaning, and the jackpot threshold. Internal .anatoly/ references document it well, but those do not count toward inline documentation scoring. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-6 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-2 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-2 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-8 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-8 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
