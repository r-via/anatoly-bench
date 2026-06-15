[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 96% | [details](#srcreelsts) |
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
| `computePayout` | L101–L111 | 🟡 PARTIAL | 90% | Has a JSDoc block but omits @param for both lineWins and bet (typed as any), omits @returns, and the description states house edge maintains ~95% RTP while the implementation adds 5% to wins (increasing payout), contradicting the stated intent. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 96% | Exported public API with no JSDoc. Missing: what reelIndex range is valid, that it returns 3 symbols (one per row), and what happens for out-of-range index. (deliberated: reclassified: correction: ERROR → NEEDS_FIX — Missing bounds check confirmed: REEL_WEIGHTS has 5 entries (reels.ts:22-28), and spinReel(reels.ts:43-50) does not validate reelIndex. Out-of-bounds access yields undefined weights, crashing pickFromWeighted at wts.reduce (line 31). However, all current callers pass valid indices: factories.ts:12 loops i=0 to reelCount-1, and engine.ts:128 sets reelCount=5 (indices 0-4). No active crash path exists in current usage. Downgraded from ERROR to NEEDS_FIX: this is a missing input validation on a public API, not an active runtime error.) |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 85% | Exported public API with no JSDoc. Purpose and return value are inferable but the ordering guarantee (must align with getReelWeights indices) is undocumented. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. Missing: valid reelIndex range, that returned array indices correspond to SYMBOLS order, and mutation warning (returns live array reference). |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | No JSDoc comment. Missing @param descriptions, @returns explanation, and no note that WILD/SCATTER (or unknown symbols) return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 78% | No JSDoc. Abstract class with a single abstract method; the extension contract, intended use, and subclassing pattern are not described inline. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Pass-through semantics are non-obvious without a comment explaining that this is the no-op baseline strategy. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Purpose (event name emitted after every spin completes), expected payload type (SpinResult), and the typo-prevention rationale for exporting it as a constant are all absent. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 85% | No JSDoc. Key details missing: delegation to spinReel(i), the fact that rowCount is intentionally unused (reel height fixed implicitly at 3), and that this is the default RNG-backed implementation. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. counts all SCATTER symbols across entire grid). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 72% | No JSDoc comment. State-mutation side effects, trigger threshold (scatters >= 3), initial award (10), retrigger logic, and decrement-to-deactivation behavior are all undocumented. (deliberated: confirmed — The off-by-one claim (remaining=10 should be 9) is a design assumption, not a bug. In standard slot implementations, the triggering spin is NOT one of the free spins — awarding 10 means 10 additional spins after the trigger. The real issue (not the one claimed) is that engine.ts:141 creates a fresh FreeSpinState every spin, so the retrigger (line 17) and decrement (line 19-23) branches are unreachable dead code in practice. The specific off-by-one claim is debatable, so confidence lowered.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing description of purpose, parameter (`reels`) shape/semantics, return value meaning, and the ≥4 DIAMOND threshold rule. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-8 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-1 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-2 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-7 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-11 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
