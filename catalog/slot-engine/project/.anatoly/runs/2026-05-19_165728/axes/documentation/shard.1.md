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
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 88% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 95% | JSDoc describes purpose and house-edge intent, but omits @param for both parameters (notably bet typed as any), missing @returns, and does not document the unconditional bet*0.01 floor. (deliberated: confirmed — Confirmed. engine.ts:105 applies `total * (1 + HOUSE_EDGE)` where HOUSE_EDGE=0.05 (engine.ts:14), multiplying winning payouts by 1.05 instead of 0.95. The docstring at engine.ts:99 states 'target RTP of approximately 95%' and paytable.ts:3 defines ANCIENT_RTP=0.95, confirming intent. The correct formula is `total * (1 - HOUSE_EDGE)`. Additionally, engine.ts:108 adds `bet * 0.01` unconditionally (even on losses), and engine.ts:110 uses Math.ceil (rounds up favoring player). All three issues compound to produce RTP well above 100%. This is a real financial/mathematical bug.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 72% | Exported public API with no JSDoc. Missing: description of purpose, explanation of reelIndex (valid range 0–4), and clarification that the returned Symbol[] represents 3 rows for that column. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. No explanation of why callers would need the canonical symbol list or that order matches weight array indices. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 68% | Exported public API with no JSDoc. Missing: description of reelIndex parameter (valid range, what out-of-bounds returns), and what the returned number[] represents (ordered weights parallel to getReelSymbols()). |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | Exported function with no JSDoc. Missing: param descriptions for symbol and count, return value semantics, behavior for out-of-range counts (below 3 or above 5 returns 0), and WILD/SCATTER handling. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 85% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 88% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 82% | No JSDoc on the class or any of its public methods (on, off, emit). Public API with non-trivial semantics (lazy listener array init, silent no-op on missing event in off/emit) has zero documentation. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Event name constant with no explanation of when it is emitted or what args handlers should expect. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 55% | No JSDoc on the class or its `buildReels` method. Parameters `reelCount` and `_rowCount` (notably ignored) are undocumented, and the return structure is not explained. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. State mutation side effects, the three transition branches, and the re-trigger behavior (adding 10 vs resetting) are non-obvious and undocumented. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The function name hints at purpose but the threshold (>=4 diamonds), grid assumptions, and return semantics are not documented inline. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 90% | JSDoc describes purpose and algorithm but omits @param and @returns tags. No documentation of edge cases: empty arrays, mismatched array lengths, zero/negative weights, or why the last item is returned as fallback. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. weightedPick (rng.ts:5-16) is algorithmically correct: it computes total weight, draws uniform random, iterates with cumulative sum, returns on match, and has a floating-point fallback at line 15. The duplicate pickFromWeighted (reels.ts:30-41) uses identical logic with different variable names (total/r/acc vs totalWeight/roll/cumulative) and concrete Symbol type instead of generic T. Duplication is real but belongs on the duplication axis — it does not constitute a correctness defect in weightedPick itself. The function produces correct weighted random selections.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-5 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-6 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-6 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-3 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 30% covered

- [ ] **computePayout** — MISSING: Not mentioned in README.md. Only covered in .anatoly/docs (excluded from scoring).
- [ ] **PAYLINES** — MISSING: README references 'ten left-to-right paylines' but does not document the 10 payline patterns or the row-index encoding.
- [ ] **Wild multiplier amplification** — PARTIAL → `README.md`: README says spin 'applies wild multipliers' but does not document the (1+wc)*2^wc formula implemented in evaluateLine and spin.
- [ ] **House edge / RTP** — MISSING: The 5% HOUSE_EDGE constant and its effect on returned payouts are not mentioned in README.md.
