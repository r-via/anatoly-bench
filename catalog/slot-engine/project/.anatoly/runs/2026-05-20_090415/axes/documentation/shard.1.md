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
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 88% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 95% | Has a JSDoc describing purpose and RTP intent, but omits @param descriptions for lineWins and bet, omits @returns, and does not document the unconditional bet*0.01 floor or the incorrect HOUSE_EDGE direction (multiplies rather than discounts). (deliberated: confirmed — Confirmed. engine.ts:105 applies `total * (1 + HOUSE_EDGE)` = `total * 1.05`, increasing payouts by 5% instead of reducing them. JSDoc at engine.ts:99 explicitly states intent is '~95% RTP', but the code produces ~105% RTP. Additionally, engine.ts:108 `total += bet * 0.01` unconditionally adds to payout on every spin, further inflating RTP. This is a financial logic bug — the house loses money. HOUSE_EDGE constant at engine.ts:14 is correct (0.05); the misapplication is in the arithmetic operator (+ instead of -).) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: reelIndex valid range (0–4), that the return is always a 3-element column, and that selection is independent per row. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. No description of what is returned or its significance as the canonical ordered symbol list. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. Missing: reelIndex valid range (0–4), that the returned array is ordered to match getReelSymbols(), and that it is a direct reference (not a copy). |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | Exported public function with no JSDoc. Missing: what 'count' represents (run length), valid input range, that WILD/SCATTER and count < 3 return 0, and that the return value is a bet multiplier. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 75% | No JSDoc. Abstract base class with no description of its role in the payout pipeline, what implementors must guarantee, or extension contract for `adjustPayout`. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc. 'Default' is ambiguous without a comment stating this is an identity pass-through that leaves `SpinResult` unchanged. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the class or any of its public methods (on, off, emit). Public API lacks parameter/return/behavior documentation. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The string value 'spin:done' is visible but the intended semantics (when it fires, what args are passed) are not documented. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, the grid traversal behavior, and the return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The state-transition logic (activate on ≥3 scatters, retrigger adds 10, decrement and deactivate) is non-trivial and entirely undocumented. Missing @param descriptions and mutation side-effect notice. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 88% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 85% | No JSDoc on class or its buildReels method. Notable behavior — rowCount is silently ignored, each reel always yields 3 rows via spinReel() — is undocumented. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing description of jackpot logic, the DIAMOND counting mechanic, the hardcoded threshold of 4, and what the boolean return value signifies. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 90% | JSDoc describes the algorithm and general purpose, but omits @param descriptions (no explanation of what happens when weights.length !== items.length, or when weights contain negative/zero values), no @returns tag, and no @throws annotation for edge cases like empty arrays. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. rng.ts:5-16 is a correct generic weighted random selection implementation. The 'USED' claim is inaccurate: while imported at engine.ts:2, registered at engine.ts:30, and resolved at engine.ts:120, the resolved `rng` variable is never called — reels are built via factory.buildReels() → spinReel() → pickFromWeighted() (factories.ts:12, reels.ts:47). weightedPick is effectively dead code in the current call graph. The duplication with pickFromWeighted is real but is a refactoring/duplication concern, not a correction issue. No behavioral defect exists in the function itself.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-6 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-7 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
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

## Documentation Coverage

### `src/engine.ts` — 38% covered

- [ ] **computePayout / house edge / RTP** — MISSING: Exported function and its RTP/house-edge semantics are absent from README.md and any other docs/ page.
- [ ] **Bet type and valid bet constraints** — MISSING: The Bet type alias and its valid range (positive integer, max 100) are not documented in docs/.
