[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/reels.ts` | 🔴 CRITICAL | 3 | 92% | [details](#srcreelsts) |
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 85% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 92% | No JSDoc on exported function. Missing: what reelIndex valid range is (0–4), that it returns exactly 3 symbols (one per row), and that results are independent per call. (deliberated: confirmed — Missing bounds check confirmed. spinReel (src/reels.ts:43) accesses REEL_WEIGHTS[reelIndex] at line 44. REEL_WEIGHTS (lines 22-28) has exactly 5 entries (indices 0-4). Any reelIndex >= 5 or < 0 yields undefined, causing a TypeError crash inside pickFromWeighted at wts.reduce() (line 31). The function is exported and called from factories.ts:12 via spinReel(i) where i iterates 0..reelCount-1. Currently, engine.ts:128 hardcodes factory.buildReels(5, 3), so indices 0-4 are always valid in production. But since spinReel is a public export, external callers can trigger the crash. getReelWeights (line 56-58) has the same vulnerability. Confirmed as ERROR but lowered confidence slightly to 92 because the defect is not triggered in any current call site — it requires misuse of the public API.) |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | No JSDoc on exported function. Missing: clarification that it returns the shared master symbol list and whether the array is mutable. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 90% | No JSDoc on exported function. Missing: valid range of reelIndex, that returned array is a direct reference (mutable), and weight semantics. |

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 85% | JSDoc describes purpose and house-edge intent, but omits `@param` descriptions, `@returns` type/meaning, and the unconditional `bet * 0.01` floor addition is unexplained. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Missing: parameter semantics (valid count range is 3–5), return value meaning (multiplier applied to lineBet), and behavior for WILD/SCATTER or unknown symbols (returns 0). |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Abstract base class with non-trivial extension semantics (strategy pattern, post-calculation hook) warrants at minimum a description and note about the abstract method contract. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Pass-through behavior is not obvious from the class name alone; a one-line doc clarifying it returns the result unchanged would suffice. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. The event name string and the shape of arguments passed when it is emitted (a SpinResult) are not documented for consumers. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape (2D readonly array), and return semantics (total SCATTER count across all reels). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-trivial state-mutation logic with three distinct branches (trigger, retrigger, decrement/deactivate) warrants documentation of parameters, side effects on FreeSpinState, and the threshold/award constants. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 80% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 85% | No JSDoc on the class or its `buildReels` override. Key omissions: why `_rowCount` is ignored (reel height is implicitly fixed by `spinReel`), what the returned `Symbol[][]` shape represents, and that this is the RNG-backed production implementation. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing description of purpose, parameter shape (reels grid dimensions), return semantics, and the ≥4 DIAMOND threshold rule. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 90% | JSDoc describes the function's purpose and algorithm but omits @param descriptions for `items` and `weights`, and no @returns tag documenting the return value or edge-case behavior (e.g., empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — Duplication with pickFromWeighted (src/reels.ts:30-41) confirmed — identical algorithm. However, weightedPick (src/rng.ts:5-16) is never actually invoked at runtime: engine.ts imports it (line 2), registers it in the container (line 30), resolves it (line 120), but the resolved 'rng' variable is never called (grep 'rng\(' in engine.ts: 0 matches). All reel generation flows through StandardReelBuilderFactory.buildReels → spinReel → pickFromWeighted. So weightedPick is dead code in practice, and the duplication is moot from a correctness standpoint. The code is not incorrect — it's unused and duplicated. Reclassified to OK on correction axis: either remove weightedPick and its import, or refactor spinReel to use it and delete pickFromWeighted.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-9 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-1 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-2 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-3 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-6 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-28c3e3-12 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-4 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
