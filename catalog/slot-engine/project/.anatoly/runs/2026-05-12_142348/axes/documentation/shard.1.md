[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🔴 CRITICAL | 3 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 85% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 80% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 95% | JSDoc describes purpose and house-edge intent but omits @param for lineWins and bet (typed as any), omits @returns, and does not document the unconditional +1% floor (bet * 0.01). (deliberated: confirmed — Confirmed ERROR. Two defects at src/engine.ts:105 and :108. (1) House edge applied in wrong direction: `total * (1 + HOUSE_EDGE)` = `total * 1.05` INCREASES payout by 5%, contradicting the JSDoc at line 98-99 stating 'maintain a target RTP of approximately 95%'. Correct formula would be `total * (1 - HOUSE_EDGE)`. The constant is named HOUSE_EDGE (line 14), which by convention reduces player returns. The automated review at src-engine.rev.md:193 independently confirms this. The internal RAG docs describe the 1.05 multiplier as intentional, but those docs merely describe WHAT the code does, not validate correctness — the docs themselves say the target is 95% RTP while simultaneously describing a formula that achieves >100% RTP, which is self-contradictory. (2) Phantom payout: `total += bet * 0.01` at line 108 adds a guaranteed return on every spin including losses, further inflating RTP. Additionally, `bet: any` at line 101 is a type safety gap when `Bet = number` is defined at line 12. Raising confidence to 95 due to clear mathematical contradiction.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 88% | No JSDoc. Missing: what reelIndex valid range is (0–4), that it returns 3 symbols (one per row), and that results are independent per row. (deliberated: confirmed — Confirmed ERROR with slight confidence reduction. At src/reels.ts:44, `REEL_WEIGHTS[reelIndex]` has no bounds check. REEL_WEIGHTS has exactly 5 entries (lines 22-28). For reelIndex >= 5 or < 0, weights becomes undefined, and pickFromWeighted at line 31 crashes on `wts.reduce()`. The function is exported (line 43) and accepts unconstrained `number`. However, the sole runtime caller is StandardReelBuilderFactory (src/factories.ts:12) which iterates 0..4, so the crash never triggers in current code paths. Lowering confidence slightly to 88 because the bug requires an out-of-range caller that doesn't currently exist, though the missing guard on an exported function is still a legitimate defect.) |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Public export with no description of what the returned array represents or its ordering. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 88% | No JSDoc. Missing: valid reelIndex range, that returned array maps positionally to getReelSymbols(), and that weights are relative integers. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 93% | Exported public function with no JSDoc. Missing: what 'count' represents, valid range of count values, return value of 0 for unrecognised symbols or counts outside 3–5, and that WILD/SCATTER always return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Abstract class with non-obvious extension-point semantics (post-calculation payout adjustment) warrants documentation. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Pass-through behavior is not self-evident from the name alone; the deliberate design choice (explicit no-op vs. missing-strategy check) is undocumented. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. The constant's role as the canonical event name for spin completion, and the payload shape emitted with it, are not documented. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what 'scatters' means in context, parameter docs for `reels`, and return value semantics (count of SCATTER symbols across the full grid). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 75% | No JSDoc comment. Missing docs for parameters `state` and `scatters`, the three-branch state-machine logic (trigger, retrigger, decrement/deactivate), and the hardcoded threshold/award values of 3 and 10. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 85% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 85% | No JSDoc on the class or its buildReels override. Key details left undocumented: delegation to spinReel, the unused _rowCount parameter (reel height is implicitly fixed by spinReel), and the class's role as the default RNG-backed implementation. (deliberated: confirmed — Confirmed NEEDS_FIX. At src/factories.ts:9, parameter is explicitly named `_rowCount` (underscore prefix = intentionally unused). The abstract contract at line 5 declares `buildReels(reelCount: number, rowCount: number)`, implying `rowCount` should be respected. The implementation at line 12 calls `spinReel(i)` which hardcodes 3 rows at src/reels.ts:46 (`for (let row = 0; row < 3; row++)`). Current caller at src/engine.ts:128 passes `buildReels(5, 3)` so behavior is accidentally correct, but any caller passing rowCount != 3 would get a silently wrong grid. The abstract interface creates a false contract. Raising confidence to 85 because the silent mismatch is empirically verified.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing description of purpose, parameter shape (reels dimensions/content), return value semantics, and the ≥4 DIAMOND threshold rule. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 80% | JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negative weights). (deliberated: confirmed — Confirmed duplicate of pickFromWeighted (see pickFromWeighted analysis above — identical algorithm). Additional finding: weightedPick is imported at src/engine.ts:2, registered in container at line 30, and resolved at line 120 (`const rng = container.resolve(...)`), but the resolved `rng` variable is NEVER called in the spin() function body (grep confirms only 3 occurrences of 'rng' in engine.ts: import, register, resolve — no invocation). The actual RNG work flows through factory.buildReels → spinReel → pickFromWeighted, bypassing weightedPick entirely. So weightedPick is effectively dead code in the spin path despite being imported. Slight confidence decrease to 80 because the finding is about duplication but the bigger issue (dead code in spin path) is a separate axis not in the original finding.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-9 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-1 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-7 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-12 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
