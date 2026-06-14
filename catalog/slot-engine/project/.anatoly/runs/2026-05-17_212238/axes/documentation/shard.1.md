[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcfreespints) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 65% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 90% | JSDoc describes purpose and house-edge intent but omits @param descriptions for lineWins and bet, omits @returns, and does not explain the unconditional `bet * 0.01` floor or the Math.ceil rounding. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 70% | Exported public API with no JSDoc. reelIndex valid range, return shape (3-element column), and sampling strategy are undocumented. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. No description of what the returned array represents or that it is the ordered set used for weight alignment. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 70% | Exported public API with no JSDoc. reelIndex valid range and the meaning/order of the returned number array are undocumented. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc comment. Missing: description of what 'count' represents, valid values (3/4/5), return value semantics (multiplier applied to lineBet), and behavior when symbol or count is unrecognized (returns 0). |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. Abstract base class with non-obvious contract (strategy pattern for post-processing SpinResult) deserves at minimum a description of purpose and extension requirements. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. Pass-through identity behavior is not obvious from the class name alone; a one-line doc noting it returns the result unmodified would suffice. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 92% | No JSDoc comment. Trigger threshold (≥3), initial award (10 spins), retrigger logic, and decrement-to-deactivation behavior are all undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. engine.ts:141 creates a fresh FreeSpinState { active: false, remaining: 0, totalWon: 0 } on every spin call. Since active always starts false, the retrigger branch (freespin.ts:17-18) and decrement branch (freespin.ts:19-23) are unreachable in current usage. Additionally, not consuming the current spin during retrigger is standard slot game behavior. No behavioral defect.) |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 78% | No JSDoc on the class or any of its methods (`on`, `off`, `emit`). Public API surface — parameter semantics, return values, and event lifecycle are undocumented. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. The string value `"spin:done"` is visible but the payload type emitted with this event and when it fires are not documented. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 78% | No JSDoc on class or buildReels method. Does not document why _rowCount is ignored, what spinReel does per reel index, or what the returned Symbol[][] represents. (deliberated: confirmed — Confirmed. factories.ts:5 declares buildReels(reelCount, rowCount) in the abstract contract. factories.ts:9 accepts _rowCount but never forwards it. reels.ts:46 hardcodes row < 3. Calling buildReels(5, N) where N!=3 silently produces 3-row reels — a contract violation. Mitigated by: (1) the _ prefix is the project's documented convention for unused params, (2) the sole call site at engine.ts:128 passes buildReels(5, 3) matching the hardcode. Real interface violation with no current runtime impact. Lowered confidence slightly due to mitigations.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing description of the jackpot condition (≥4 DIAMOND symbols anywhere on the board), parameter doc for `reels`, and return value explanation. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-4 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-1 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-5 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-3 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-6 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-28c3e3-7 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]

## Documentation Coverage

### `src/engine.ts` — 25% covered

- [ ] **spin function** — PARTIAL → `README.md`: README describes spin at a high level (reels, paylines, wilds, scatters, jackpot, payout) but omits bet validation rules, the SpinResult fields, error conditions, and the strategy/emitter pipeline.
- [ ] **computePayout / house edge** — MISSING: No README section explains the house-edge application, the bet*0.01 floor, or the Math.ceil rounding.
- [ ] **PAYLINES layout** — MISSING: README mentions ten paylines but does not document the row-index patterns or their shapes.
- [ ] **wild multiplier mechanics** — MISSING: README says wild multipliers are applied but does not document the formula (1+wildCount)×2^wildCount or the per-line vs. global multiplier distinction.
- [ ] **free spins / scatter detection** — PARTIAL → `README.md`: README mentions scatter bonuses trigger free spins but does not document threshold, spin count, or FreeSpinState lifecycle.
- [ ] **jackpot detection** — PARTIAL → `README.md`: README mentions progressive jackpot but does not document trigger conditions or payout behaviour.
