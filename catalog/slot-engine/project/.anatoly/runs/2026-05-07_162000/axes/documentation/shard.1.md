[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 97% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 85% | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 97% | JSDoc describes purpose and RTP rationale but omits @param descriptions, does not document the guaranteed minimum payout (bet × 0.01), and the return type is not annotated in the comment. (deliberated: confirmed — Confirmed bug. engine.ts:105 multiplies by (1 + HOUSE_EDGE) = 1.05, increasing payout by 5%. Docstring at engine.ts:99 states 'target RTP of approximately 95%', and paytable.ts:3 exports ANCIENT_RTP = 0.95 confirming intent. Correct formula should be (1 - HOUSE_EDGE) = 0.95. Paytable multipliers (paytable.ts:5-12) are raw values with no pre-baked house edge. Additionally, engine.ts:108 adds bet*0.01 on every spin (including losses), further inflating RTP. The house edge is applied in the wrong direction — this is a financial logic bug causing player overpayment.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 92% | No JSDoc. Missing: what reelIndex valid range is (0–4), that it returns a 3-symbol column, and sampling-with-replacement semantics. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Returns the shared SYMBOLS array by reference — mutation risk and intended use are undocumented. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 62% | No JSDoc. Valid index range, return-by-reference behavior, and relationship to DEFAULT_WEIGHTS are undocumented. (deliberated: confirmed — Missing bounds check at reels.ts:57 is real — REEL_WEIGHTS has indices 0-4 (reels.ts:22-28), and out-of-bounds access returns undefined typed as number[]. However, blast radius is near zero: the only import is engine.ts:3, registered in container at engine.ts:32, resolved at engine.ts:122 as reelsModule — but reelsModule is NEVER actually called in spin(). The factory (factories.ts:12) calls spinReel directly, which accesses REEL_WEIGHTS[reelIndex] at reels.ts:44 with the same lack of bounds check but always receives indices 0-4 from the for-loop. No current caller passes an invalid index. This is defensive programming, not fixing an active bug. Lowered confidence accordingly.) |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | Exported public function with no JSDoc. Missing: description of what 'count' represents (reel positions matched), what happens for count < 3 or unsupported symbols (returns 0), and that WILD/SCATTER always return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Abstract base class with a single abstract method — purpose, extension contract, and intended usage pattern are undocumented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Pass-through behavior is non-obvious from the name alone; the fact that it returns the result unchanged warrants at least a one-line doc. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment explaining what event this constant represents, when it is emitted, or what arguments are passed to its handlers. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape (2D readonly array of symbols), and return value semantics (total count across all reels). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-trivial state-mutation logic with three distinct branches (trigger, retrigger, decrement/deactivate) warrants documentation of params, side effects on FreeSpinState, and the threshold/award constants. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 82% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 85% | No JSDoc on class or buildReels method. Notable undocumented behavior: _rowCount is silently ignored (reel height fixed implicitly by spinReel), which is a non-obvious contract violation callers cannot discover without reading the source. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 93% | JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at rng.ts:5-16 is algorithmically correct — identical cumulative-weight logic to pickFromWeighted with proper generic typing and fallback at line 15. The NEEDS_FIX claim is based on duplication with reels.ts:pickFromWeighted, which belongs on the duplication axis, not correction. Furthermore, weightedPick is never invoked at runtime: imported at engine.ts:2, registered in container at engine.ts:30, resolved at engine.ts:120, but the rng variable is never called — StandardReelBuilderFactory.buildReels (factories.ts:9-15) delegates to spinReel which uses pickFromWeighted directly.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing description of purpose, parameter shape (reels dimensions/content), return value semantics, and the ≥4 DIAMOND threshold rule. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-8 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-2 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-7 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-11 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
