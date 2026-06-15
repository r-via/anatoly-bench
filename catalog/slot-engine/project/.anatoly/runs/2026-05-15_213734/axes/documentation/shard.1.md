[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcfreespints) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 72% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 85% | JSDoc describes the house-edge application and ~95% RTP target, but omits @param for lineWins and bet (bet is typed as any), @returns, and the unconditional bet×0.01 floor added regardless of wins. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 85% | Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), return shape (3-element column), and that symbols are drawn independently per row. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. No description of what the returned array represents or its ordering significance. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 80% | Exported public API with no JSDoc. Missing: valid reelIndex range, that the returned array indices correspond to SYMBOLS order, and whether the array is a copy or a live reference. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | No JSDoc comment. Missing description of the multiplier semantics, what `count` values are valid, what the multiplier is applied to (lineBet), and that out-of-range counts return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. Abstract base class with a single abstract method — purpose, extension contract, and intended usage pattern are undocumented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Pass-through behavior is not obvious from the name alone; a brief doc explaining the identity transform and its role as the default engine strategy is absent. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what counts as a scatter, the grid traversal logic, and the return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 92% | No JSDoc comment. Non-obvious state machine logic (trigger threshold, initial award of 10, retrigger +10, decrement-to-deactivate) requires documentation. Parameters and side-effect mutation of state are undescribed. (deliberated: reclassified: correction: NEEDS_FIX → OK — Finding claims 'Retrigger branch (L16) adds 10 spins' but L16 is the initial trigger (`state.remaining = 10`), not the retrigger. The retrigger is L18 (`state.remaining += 10`). Both awarding 10 spins matches project docs: 'Award: 10 free spins per trigger / Retrigger: additional 10 free spins.' Additionally, engine.ts:141 creates a fresh FreeSpinState on every spin call, so the retrigger (L17-18) and decrement (L19-23) branches are unreachable in current usage — no behavioral defect exists.) |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 80% | No JSDoc on the class or any of its methods (on, off, emit). Public API with non-trivial lifecycle semantics (per-spin instantiation, listener management) warrants at minimum class-level and method-level docs. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. As a public event-name constant, it should document what triggers this event and what arguments are passed to handlers. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 88% | No JSDoc on class or buildReels override. Missing explanation of why _rowCount is ignored, what spinReel does per reel index, and the shape of the returned Symbol[][]. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape (2D reel array), return semantics, and the ≥4 DIAMOND threshold rule. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-5 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-1 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-3 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-8 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]

## Documentation Coverage

### `src/engine.ts` — 20% covered

- [ ] **spin() API** — PARTIAL → `README.md`: README describes the high-level flow accurately but omits the bet parameter constraints, the string-throw error contract, and the SpinResult shape.
- [ ] **computePayout / house edge** — MISSING: Not mentioned in any docs/ page. The unconditional bet×0.01 floor and ceiling rounding are undocumented.
- [ ] **Bet type and validation rules** — MISSING: Valid range (integer, 1–100) is enforced in spin() but never stated in docs/.
- [ ] **Payline definitions** — MISSING: PAYLINES array (10 patterns, row-index encoding) is not described in any docs/ page.
- [ ] **Wild multiplier formula** — PARTIAL → `README.md`: README mentions 'applies wild multipliers' but gives no formula or table. Formula is only in .anatoly internal docs, which don't count for scoring.
- [ ] **Scatter / free spins trigger** — PARTIAL → `README.md`: README mentions 'detects scatter bonuses (free spins)' but threshold, award count, and FreeSpinState lifecycle are absent.
