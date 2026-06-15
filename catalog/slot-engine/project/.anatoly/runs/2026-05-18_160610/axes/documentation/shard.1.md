[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 88% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | JSDoc describes purpose and RTP intent, but omits @param and @returns. Description is misleading: HOUSE_EDGE inflates payout rather than applying a house deduction. The flat bet * 0.01 bonus is also undocumented. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 85% | No JSDoc. Valid range of reelIndex, returned array length (always 3), and sampling strategy are undocumented. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Returns the shared SYMBOLS array by reference; mutation risk and ordering guarantee are undocumented. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 85% | No JSDoc. Valid reelIndex range and the fact the returned array is a live reference (not a copy) are undocumented. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | Exported public function with no JSDoc. Missing: what 'count' represents, what the returned number is relative to (raw credits? multiplier?), and that counts below 3 or above 5 return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. Abstract base class with a non-obvious strategy pattern contract — purpose, extension semantics, and the adjustPayout lifecycle are undocumented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Pass-through identity behavior is not self-evident from the name alone; missing explanation of when/why to use this vs other strategies. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 78% | No JSDoc on the class or any of its public methods (on, off, emit). Lifecycle, thread-safety assumptions, and event name conventions are undocumented. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. The string value 'spin:done' and what payload is emitted with this event are not documented inline. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 70% | No JSDoc on the class or its buildReels method. The fact that _rowCount is ignored (unused parameter) is a non-obvious behavior that warrants documentation. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g., that SCATTERs are counted across the entire grid regardless of position). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 86% | No JSDoc comment. Non-trivial state machine logic (trigger, retrigger, decrement, deactivation) with side-effect mutations on state — behavior is not obvious from the signature alone. Trigger threshold, initial award count, and retrigger semantics all require documentation. (deliberated: reclassified: correction: NEEDS_FIX → OK — The retrigger branch (freespin.ts:18) does `state.remaining += 10`, which the automated review claims is an off-by-one (21 spins instead of 20). However, the project's internal documentation explicitly states 'Retrigger: +10 additional spins' — matching the code exactly. The claim that the triggering spin must be 'consumed' is a domain assumption not supported by any project spec. Additionally, this branch is unreachable at runtime: engine.ts:141 creates a fresh `FreeSpinState { active: false, remaining: 0, totalWon: 0 }` on every call, so only the initial trigger branch (line 14) can ever fire. No observable defect.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols), parameter explanation for `reels` layout, and return value semantics. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 90% | JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what happens when items/weights arrays differ in length, or when weights are empty/zero), and no @returns tag. (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified rng.ts:5-16. The generic weighted selection algorithm is correct: reduce total, uniform draw in [0, total), cumulative accumulation, last-item fallback. The NEEDS_FIX label was justified solely by duplication with pickFromWeighted (reels.ts:30-41) — not by any logical or behavioral defect. Both implementations produce identical correct results. Notably, weightedPick is imported and registered in engine.ts:2,30 but the resolved container value (engine.ts:120) is never used in the spin path — reels are built via StandardReelBuilderFactory→spinReel→pickFromWeighted. This is an architectural concern, not a correctness defect in weightedPick itself.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-5 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-1 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-5 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-2 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-6 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-4 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 17% covered

- [ ] **computePayout** — MISSING: Exported function not referenced in README or any docs/ page.
- [ ] **Bet type** — MISSING: Exported type alias not referenced in any docs/ page.
- [ ] **Wild multiplier formula** — MISSING: README mentions wild multipliers in passing inside the spin() description but never documents the (1 + wildCount) × 2^wildCount formula. Detailed spec exists only in .anatoly/docs/, which does not count.
- [ ] **House edge / RTP mechanics** — MISSING: HOUSE_EDGE constant and its application inside computePayout are not described in any docs/ page.
- [ ] **Payline definitions** — MISSING: README states 'ten left-to-right paylines' but does not define the 10 row-index patterns or their shapes. Detailed table exists only in .anatoly/docs/.
