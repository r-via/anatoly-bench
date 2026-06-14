[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcenginets) |
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
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 90% | Exported public type alias with no JSDoc. No constraint information (valid range, integer requirement) is documented. |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | JSDoc describes purpose and mentions house edge, but omits @param descriptions for `lineWins` and `bet`, the return type explanation, and the unconditional floor of `bet * 0.01` which is a notable behavior. |
| `spin` | L113–L179 | 🔴 UNDOCUMENTED | 90% | Primary exported function with no JSDoc. No documentation of the `bet` parameter constraints (must be integer 1–100), thrown string error, or the fields of the returned SpinResult. (deliberated: confirmed — Confirmed. computePayout (engine.ts:101-111) has two real bugs in the spin lifecycle: (1) Line 105: `total * (1 + HOUSE_EDGE)` multiplies by 1.05, increasing payout instead of decreasing it — the JSDoc at line 99 states intent to 'maintain a target RTP of approximately 95%', so it should be `(1 - HOUSE_EDGE)` = 0.95. (2) Line 108: `total += bet * 0.01` unconditionally adds 1% of bet to every spin result, guaranteeing a minimum payout even on losing spins. Both bugs directly affect the game's RTP. spin() calls computePayout at line 138.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), meaning of the returned 3-element array (one Symbol per visible row), and that each row is sampled independently. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. A one-liner getter, but callers need to know the returned array is ordered and that its indices align with getReelWeights output. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that indices align with getReelSymbols(), that the returned array is a direct reference (not a copy), and the weight total (120). |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: parameter descriptions, return value semantics, behavior for unknown symbols (returns 0), and that count values outside {3,4,5} also return 0. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 82% | Class and all three public methods (on, off, emit) lack any JSDoc. A public API consumed by engine.ts deserves at minimum a class-level description and @param/@returns annotations on each method. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment describing when this event fires or what arguments are passed to listeners. Consumers relying on this event string need documentation of its semantics. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Abstract base class with no explanation of the strategy pattern's purpose, when to subclass, or what contract adjustPayout must satisfy. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 88% | No JSDoc. Passes result through unchanged — non-obvious that this is the identity/no-op strategy. No note that it is the default used by engine.ts. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Abstract factory contract — purpose, expected override behavior, and relationship to the slot machine engine are non-obvious from the name alone. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 88% | No JSDoc on class or buildReels method. Non-obvious behavior: _rowCount is ignored, spinReel is called per reel index — these constraints and the reason rowCount is unused are undocumented. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, parameter type semantics, and return value meaning. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The three-branch state machine logic (activate, retrigger, decrement/deactivate) is non-obvious and warrants documented parameter contracts and side-effect description. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious behavior (counts DIAMOND symbols globally across all reels, triggers at >=4) is not documented inline. The threshold and grid-wide (not payline-restricted) counting logic are critical contract details absent from the code. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 85% | JSDoc describes the purpose and algorithm, but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (e.g., empty arrays, mismatched array lengths, or negative weights). |

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
- [ ] <!-- ACT-83e35f-3 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- [ ] <!-- ACT-e0699c-2 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-2 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 35% covered

- [ ] **computePayout / house-edge RTP guarantee** — MISSING: Exported function and its ~95% RTP contract via HOUSE_EDGE are not mentioned anywhere in README.md.
- [ ] **Bet type and valid bet constraints** — MISSING: The exported Bet type and the integer-only, 1–100 range constraint enforced in spin() are absent from the README.
- [ ] **Wild multiplier formula** — PARTIAL → `README.md`: README mentions 'applies wild multipliers' but does not describe the (1+wc)*2^wc compounding formula used in evaluateLine and spin.
