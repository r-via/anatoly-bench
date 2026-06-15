[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Type alias lacks description of valid range or constraints (e.g. 1–100 integer). |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | JSDoc describes purpose and house-edge intent but omits @param descriptions for `lineWins` and `bet` (typed `any`), omits @returns, and does not document the unconditional floor `bet * 0.01`. |
| `spin` | L113–L179 | 🔴 UNDOCUMENTED | 92% | No JSDoc. Primary exported public API. Throw condition for invalid bet, side effects (emitter, free-spin state mutation), and return shape are entirely undocumented in-source. (deliberated: confirmed — Verified two correctness bugs in computePayout (engine.ts:101-111). (1) Line 105: `total * (1 + HOUSE_EDGE)` with HOUSE_EDGE=0.05 (line 14) increases payout by 5% instead of decreasing it — comment on line 99 says 'maintain a target RTP of approximately 95%' but the math yields ~105% RTP. Should be `(1 - HOUSE_EDGE)`. (2) Line 108: `total += bet * 0.01` unconditionally adds 1% of bet even on zero-win spins, guaranteeing non-zero payout on every spin. Both are behavioral bugs affecting game economics.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 93% | Public export with no JSDoc. Valid reelIndex range (0–4), return shape (3-element column), and that each cell is sampled independently are all undocumented. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Public export with no JSDoc. Returning the shared SYMBOLS array (mutable reference) rather than a copy is an undocumented contract detail. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 95% | Public export with no JSDoc. Valid reelIndex range (0–4), that the returned array is the live reference (no defensive copy), and the weight-sum semantics are undocumented. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc. Missing: what 'count' represents, what the returned number means (base multiplier for lineBet calculation), and that WILD/SCATTER always return 0. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 87% | Class and all three public methods (on, off, emit) lack JSDoc. No description of purpose, event name conventions, or method parameters/return values. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | Exported constant has no JSDoc. The event name string value is self-evident but when/why this event is emitted (after a completed spin in engine.ts) is undocumented. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Abstract base class with no JSDoc. Purpose, contract, and intended extension points are undocumented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc on class or method. The pass-through behavior (no payout adjustment) is non-obvious from the name alone and warrants documentation. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the class or its abstract method `buildReels`. Purpose of `reelCount`/`rowCount` params and the shape of the returned `Symbol[][]` are undescribed. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the class or its `buildReels` override. The silent discard of `_rowCount` and the delegation to `spinReel` are undocumented behavioural details that consumers cannot discover without reading the source. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of grid traversal logic, parameter shape (2D reel array), and return value (scatter count integer). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious state machine with three distinct transitions (activate, retrigger, decrement/deactivate) and a mutation side-effect — all undocumented. Parameters and return void not described. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of jackpot condition (4+ DIAMONDs anywhere on grid), parameter shape, and return semantics. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 85% | Block comment describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, mismatched lengths, zero-weight items, or the fallback return of the last item). |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-5 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-2 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-4 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
- [ ] <!-- ACT-83e35f-3 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- [ ] <!-- ACT-e0699c-2 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-2 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 15% covered

- [ ] **spin function** — PARTIAL → `README.md`: README covers basic usage and high-level behavior (5 reels, 10 paylines, wilds, scatters, jackpot, totalPayout) but omits throw conditions for invalid bet, the `bet * 0.01` floor, and all other return fields beyond `totalPayout`.
- [ ] **computePayout** — MISSING: Not referenced in README or any docs/ page.
- [ ] **Bet type** — MISSING: Exported type alias not mentioned in any docs/ page; valid range and integer constraint undocumented.
- [ ] **Paylines layout** — MISSING: PAYLINES constant and its 10-shape layout absent from README; only present in .anatoly internal docs which do not count for scoring.
- [ ] **Wild multiplier stacking** — MISSING: The (1 + wildCount) * 2^wildCount stacking formula used in evaluateLine and re-derived in spin is not described anywhere in docs/.
