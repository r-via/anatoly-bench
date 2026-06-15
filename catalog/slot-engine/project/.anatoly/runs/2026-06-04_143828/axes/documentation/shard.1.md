[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 90% | Exported type alias with no JSDoc. No documentation of valid range, units, or constraints (e.g. integer-only, 1–100 enforced in spin()). |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | JSDoc describes purpose and house-edge intent, but omits @param descriptions for lineWins and bet (bet is typed any), no @returns, and does not document the unconditional floor (bet*0.01) or ceiling (Math.ceil). |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: what reelIndex range is valid (0–4), that it returns 3 symbols (one per row), and that sampling is independent per cell. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. No description of return value order or that it is the canonical symbol order used for weight array indexing. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally with getReelSymbols(), and that it is read-only at runtime. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | Exported public function with no JSDoc. Missing: what 'count' represents, the valid range of count values (3–5), the return-0 contract for unknown symbols and out-of-range counts, and that WILD/SCATTER are not in the table. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Abstract base class with no JSDoc. Purpose, intended usage pattern, and the contract of `adjustPayout` are not described. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the class or its `adjustPayout` override. It is non-obvious that this is a pass-through (no-op) implementation — that behavior warrants documentation. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 88% | No JSDoc on the class or any of its public methods (on, off, emit). Parameters and return types are unannotated in docs; purpose of the emitter relative to existing Node.js EventEmitter is unexplained. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The event name constant lacks any description of when it is emitted or what payload (if any) listeners should expect. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Abstract factory with a non-trivial contract (reelCount vs rowCount semantics, return shape) that warrants documentation. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 72% | No JSDoc comment. `_rowCount` is silently ignored — a notable behavioral detail that should be documented. No description of what 'standard' means relative to other possible factory implementations. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g., counts all SCATTER symbols across the entire grid). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-trivial state machine with three distinct transition branches (activate, retrigger, decrement/deactivate) and a mutation side-effect — all undocumented. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 92% | Block comment describes purpose and algorithm, but lacks @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (e.g., empty arrays, mismatched array lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/rng.ts:5-16 is algorithmically correct — same cumulative-weight sampling as pickFromWeighted. Duplication is real but is not a correction defect. Additionally, weightedPick is imported by engine.ts (L2), registered in the container (L30), and resolved (L120), but the resolved `rng` variable is never called — the factory path (spinReel → pickFromWeighted) is used instead. This makes weightedPick effectively dead at runtime, which is a utility concern, not a correction defect. The function itself is correct; it's just unused and duplicated.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Exported public API missing description of jackpot trigger condition (≥4 DIAMONDs), parameter semantics (2-D reel grid layout), and return value meaning. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-4 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-5 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-5 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-3 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 15% covered

- [ ] **spin function** — PARTIAL → `README.md`: README shows usage and lists what spin() does (reels, paylines, wilds, scatters, jackpot) but omits parameter constraints, thrown errors, and SpinResult field semantics.
- [ ] **computePayout / house edge** — MISSING: computePayout, HOUSE_EDGE, the RTP floor (bet*0.01), and Math.ceil rounding are not mentioned anywhere in docs/.
- [ ] **PAYLINES structure** — MISSING: The 10 payline definitions and their row-index semantics are absent from docs/. Only covered in .anatoly/docs/ (excluded from scoring).
- [ ] **Wild multiplier boost formula** — PARTIAL → `README.md`: README mentions 'applies wild multipliers' but does not document the (1+wc)*2^wc stacking formula or wildMultiplier field on SpinResult.
- [ ] **Bet type and constraints** — MISSING: The Bet type alias and its enforced constraints (positive integer, implicit max 100) are not documented in docs/.
