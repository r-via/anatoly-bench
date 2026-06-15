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
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 90% | Exported type alias with no JSDoc. Public API consumers get no context on valid range, currency unit, or relationship to lineBet. |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 85% | Has a JSDoc block but omits @param descriptions for lineWins and bet, omits @returns, and the claim 'target RTP of approximately 95%' is misleading — the code adds HOUSE_EDGE (raising payout) rather than deducting it, contradicting the stated intent. |
| `spin` | L113–L179 | 🔴 UNDOCUMENTED | 88% | Primary exported function with no JSDoc. No description of the bet parameter constraints (integer, 1–100), thrown string on invalid bet, or the structure of SpinResult fields. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 90% | Exported public API. No JSDoc. Missing: valid range for reelIndex (0–4), meaning of the 3-element return array (one Symbol per row), and behavior if reelIndex is out of bounds. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API. No JSDoc. No description of what it returns or why callers need it (ordering mirrors weight array indices). |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 95% | Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSymbols(), and that weights are read-only at runtime. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | Exported public API with no JSDoc. Missing: valid range for `count`, behavior for WILD/SCATTER symbols (returns 0), and the fact that only counts 3–5 yield non-zero results. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Abstract base class with no JSDoc. Purpose, expected behavior contract, and usage pattern of `adjustPayout` are undocumented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc. The pass-through behavior of `adjustPayout` (returns result unchanged) is non-obvious from the name alone and warrants at least a one-line description. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the class or any of its public methods (on, off, emit). Parameters, return values, and behavioral contracts (e.g. silent no-op when no listeners) are undocumented. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Event name constant with no explanation of when it is emitted or what payload consumers should expect. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The abstract factory pattern and the contract of buildReels (what reelCount/rowCount mean, what the returned Symbol[][] represents) are not described. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the class or buildReels. Notable behavior — _rowCount is silently ignored — is undocumented, which is a meaningful omission for consumers. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of grid traversal behavior, parameter shape, and return value semantics (total count across all reels, not per-reel). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious state machine with three branches (activation, retrigger, decrement/deactivation) and mutation side-effects on state — all undocumented. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 92% | JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, mismatched lengths, zero-weight items). (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at src/rng.ts:5-16 is correct: same cumulative-weight algorithm as pickFromWeighted, generic typed. Imported by src/engine.ts:2, registered in container at engine.ts:30, resolved at engine.ts:120 — but the resolved `rng` variable is never actually called in spin(). Reel generation flows through StandardReelBuilderFactory.buildReels (src/factories.ts:9-15) → spinReel → pickFromWeighted. The unused resolution is a utility/dead-code concern, not a correction defect. The function itself has no bugs. Duplication with pickFromWeighted is real but belongs on the duplication axis, not correction.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious semantics: threshold of 4 DIAMONDs, grid-wide scan (not payline-restricted), and ReadonlyArray input contract are not documented. |

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
- [ ] <!-- ACT-83e35f-5 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `SpinStrategy` (`SpinStrategy`) [L3-L5]
- [ ] <!-- ACT-e0699c-2 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol: `DefaultStrategy` (`DefaultStrategy`) [L7-L11]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 38% covered

- [ ] **computePayout** — MISSING: Not mentioned in README.md. The house-edge application, the bet*0.01 floor, and the Math.ceil rounding are undocumented externally.
- [ ] **Bet** — MISSING: No documentation of valid bet range, integer requirement, or coin denomination semantics.
- [ ] **PAYLINES** — PARTIAL → `README.md`: README mentions 'ten left-to-right paylines' but does not document the coordinate scheme, payline shapes, or lineBet = bet/10 allocation.
