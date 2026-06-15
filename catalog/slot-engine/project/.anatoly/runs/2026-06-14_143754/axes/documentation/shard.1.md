[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 90% | Exported type alias with no JSDoc. 'Bet' does not convey constraints (integer-only, range 1–100) that are enforced in spin(). |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 85% | JSDoc describes purpose and RTP intent, but omits @param for lineWins and bet, no @returns, and does not document the unconditional floor (bet * 0.01) or that HOUSE_EDGE inflates rather than reduces total. |
| `spin` | L113–L179 | 🔴 UNDOCUMENTED | 92% | Primary exported function with no JSDoc. Missing @param bet (valid range, integer constraint), @returns SpinResult shape, @throws for invalid bet, and documentation of side effects (emitter, strategy adjustment). (deliberated: confirmed — Confirmed. engine.ts:118 warns `console.warn("bet exceeds maximum")` when `bet > 100` but does not throw or cap the value — the spin proceeds with an arbitrarily large bet. The lower-bound validation at line 114 correctly throws, proving the developer intended hard enforcement. The upper bound is a genuine defect: a soft warning in a gambling engine allows unbounded exposure. Additionally, `computePayout` at line 105 multiplies by `(1 + HOUSE_EDGE)` which *increases* payouts by 5% instead of reducing them — the comment at line 99 states 'target RTP of approximately 95%' but the math yields ~105%. This compounds the bet-enforcement bug.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), meaning of the 3-element return array (one Symbol per row), and behavior on out-of-range index. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Name is descriptive but no comment on ordering or that the array is the canonical symbol registry used by weight arrays. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), correspondence between returned array indices and symbol order, and that weights are read-only at runtime. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: parameter descriptions, return semantics, and the key constraint that WILD/SCATTER return 0 (non-obvious caller behavior). |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the class or any of its public methods (on, off, emit). All three methods are exported public API and lack parameter/return/behavior documentation. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. As a named event constant consumed externally by the spin engine, it should describe when this event is emitted and what args are passed. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Abstract base class with no JSDoc. Purpose, contract, and intended extension points are not described. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 88% | No JSDoc on class or method. `adjustPayout` returns the result unchanged — that passthrough behavior is non-obvious and warrants documentation. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Abstract factory contract for building reels is non-obvious: callers need to know what `reelCount`/`rowCount` mean, what the returned `Symbol[][]` shape represents, and why an abstract factory pattern is used here. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc on class or `buildReels`. Notable behavior (ignores `_rowCount`, delegates to `spinReel` per reel index) is invisible to callers. Consumed by `spin()` in engine.ts, making its contract part of the public API. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, parameter type semantics, and return value meaning. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious state machine logic (activate, retrigger, decrement/deactivate) with side-effect mutation of state warrants documentation of all three transition branches, parameters, and the void return. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 95% | JSDoc describes the algorithm and use case, but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. rng.ts:5-16 is a correct generic weighted-random selection function. The duplication with reels.ts:pickFromWeighted is real but is not a bug — both implementations are correct. Furthermore, weightedPick is imported at engine.ts:2, registered in the container at engine.ts:30, and resolved at engine.ts:120, but the resolved `rng` variable is never invoked — the spin flow uses factory.buildReels → spinReel → pickFromWeighted instead. This makes weightedPick effectively dead code in the current execution path, but that's a utility concern, not a correction concern. The function itself has no defects.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious behavior (counts DIAMOND symbols across entire grid, threshold of 4+) is not documented inline. The parameter type and return semantics are not explained. |

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
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol: `getPayMultiplier` (`getPayMultiplier`) [L14-L21]
- [ ] <!-- ACT-83e35f-4 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- [ ] <!-- ACT-e0699c-2 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 20% covered

- [ ] **spin()** — PARTIAL → `README.md`: README covers basic usage and high-level behavior (reels, paylines, wilds, scatters, jackpot) but omits the bet constraints (integer, 1–100), the SpinResult fields, and that spin() can throw.
- [ ] **computePayout()** — MISSING: Not mentioned in any docs/ page. The house-edge inflation and bet*0.01 floor are undocumented externally.
- [ ] **PAYLINES layout** — MISSING: README mentions '10 paylines' in passing but does not describe the grid geometry, row-index encoding, or the shapes of individual paylines.
