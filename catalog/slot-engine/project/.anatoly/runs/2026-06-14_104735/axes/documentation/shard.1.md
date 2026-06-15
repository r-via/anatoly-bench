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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 95% | Exported type alias with no JSDoc. The name alone does not communicate valid range or units. |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | Has a JSDoc block describing purpose and RTP intent, but omits @param descriptions for lineWins and bet (typed as any), and no @returns annotation. The unconditional floor of bet*0.01 is undocumented. |
| `spin` | L113–L179 | 🔴 UNDOCUMENTED | 85% | Primary exported function with no JSDoc. Behavior described in README but inline documentation is absent; no @param, @returns, or @throws for the string-throw on invalid bet. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 95% | Exported. No JSDoc. Missing: valid range of reelIndex (0–4), meaning of the returned array (3 symbols top-to-bottom), and behavior on out-of-range index. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported. No JSDoc. Returns the master symbol list; return value ordering and mutability are unstated. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 95% | Exported. No JSDoc. Valid reelIndex range (0–4), returned array ordering relative to getReelSymbols(), and mutability of the result are all undocumented. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing: what `count` represents, valid range of `count`, return semantics (multiplier vs. payout), and behavior for WILD/SCATTER symbols (returns 0). |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the class or any of its public methods (on, off, emit). All three methods accept non-trivial parameters with no description of semantics, side effects, or error behavior. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. As a public event-name constant consumed by engine.ts, it should document when the event fires and what args are emitted with it. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 87% | Abstract base class has no JSDoc. Purpose, extension contract, and expected behavior of adjustPayout are undocumented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc on class or method. adjustPayout passes result through unchanged — that identity behavior is non-obvious and worth documenting. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Purpose of the abstract factory pattern, expected contract of buildReels (what the returned Symbol[][] represents, how reelCount/rowCount affect output), and intended extension points are not described. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 88% | No JSDoc. The concrete implementation's behavior (delegates to spinReel per reel, ignores rowCount) and why _rowCount is unused are undocumented. Consumed by spin() in engine.ts, making this a public API surface that warrants at minimum a summary comment. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Public exported function with a non-trivial parameter type (2D readonly array) and a meaningful return value (scatter count) that warrants at least a brief description. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Public exported function with complex state-machine logic (activate, retrigger, decrement/deactivate) that is non-obvious from the signature alone. Missing description of all three transition branches, the mutation side-effect, and the void return. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 95% | JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, no mention of edge cases (empty arrays, mismatched lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/rng.ts:5-16 correctly implements the same cumulative-weight sampling algorithm. Imported by src/engine.ts:2 and registered in the IoC container at L30. The finding claims NEEDS_FIX on the correction axis citing duplication with pickFromWeighted — duplication is factually true (~95% identical logic) but is not a correctness defect. The function itself is algorithmically correct. Additionally, the resolved `rng` variable in engine.ts:120 is never called within `spin()` (reels are built via factory.buildReels at L128), but that's a dead-code issue in engine.ts, not a correctness bug in weightedPick.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious semantics: counts DIAMOND symbols across the entire grid (not paylines), triggers at ≥4. The threshold and grid-wide (not payline-restricted) behavior are invisible from the signature alone. |

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
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 35% covered

- [ ] **computePayout / house edge RTP** — MISSING: The exported computePayout function and its 5% house-edge adjustment are not mentioned in any docs/ page.
- [ ] **Bet type / valid bet range** — MISSING: README shows spin(10) in an example but never documents the Bet type, integer constraint, or maximum advisory.
- [ ] **Wild multiplier formula** — PARTIAL → `README.md`: README mentions 'applies wild multipliers' but does not explain the (1+wc)*2^wc stacking formula or how wildMultiplier is reported in SpinResult.
