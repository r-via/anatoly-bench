[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 88% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srclegacyts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 95% | Has JSDoc prose but no @param or @returns tags. Description states house edge 'maintains ~95% RTP' yet implementation multiplies total by 1.05 (increases payout), contradicting standard house-edge semantics. bet parameter typed any with no documentation of valid range or type. (deliberated: confirmed — Confirmed. engine.ts:105 applies HOUSE_EDGE as `total * (1 + 0.05)` = `total * 1.05`, increasing payouts by 5%. The JSDoc at engine.ts:97-100 states intent is '~95% RTP', which requires `total * (1 - HOUSE_EDGE)` = `total * 0.95`, matching ANCIENT_RTP=0.95 in paytable.ts:3. Additionally, engine.ts:108 adds `bet * 0.01` unconditionally, guaranteeing non-zero payout on every spin and further inflating RTP above 100%. The implementation directly contradicts its documented purpose — this is a real arithmetic bug with financial impact.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 78% | Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that it returns exactly 3 symbols (one per row), and that sampling is independent per cell. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 80% | Exported public API with no JSDoc. Name is self-descriptive and body trivial, but return value semantics (ordered master symbol list) are undocumented. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 80% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), relationship between returned array indices and SYMBOLS order, and read-only nature of the weights. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 93% | Exported public API with no JSDoc. Missing: what 'count' represents (run length), valid range for count, behavior for WILD/SCATTER (returns 0), and what the returned number means (base multiplier, not currency). |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. Abstract base class with a single abstract method; extension semantics and the contract of adjustPayout are undescribed. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Identity behavior (pass-through) is non-obvious without documentation; callers have no indication this is the engine default. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 85% | Exported public class with no JSDoc on the class or any of its three methods (on, off, emit). Missing descriptions of event-name semantics, handler reference-equality contract for off(), and whether emit() is synchronous. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | Exported constant with no JSDoc. Does not document what event payload is passed when this event fires, or which emitter instance produces it. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 88% | No JSDoc/TSDoc comment. Non-obvious behavior — _rowCount is silently ignored and reel row count is fixed by spinReel() — is undocumented, making this a meaningful gap for public API consumers. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape, and return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The three-branch state machine logic (activate, retrigger, decrement/deactivate) and mutation side-effects are non-obvious and warrant documentation. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter semantics (grid structure, expected dimensions), return value meaning, and the hardcoded threshold of 4 DIAMONDs. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-9 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-2 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-6 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-12 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]

## Documentation Coverage

### `src/engine.ts` — 20% covered

- [ ] **spin function** — PARTIAL → `README.md`: README describes spin() behaviour (reels, paylines, wilds, scatters, jackpot) and provides a usage example, but omits bet constraints, the string-throw on invalid input, and the SpinResult field semantics.
- [ ] **computePayout** — MISSING: Not mentioned in README.md. House-edge application, minimum-return floor (bet*0.01), and ceiling rounding are undocumented externally.
- [ ] **Bet type** — MISSING: Exported type alias not referenced in README.md. Valid range and integer constraint not documented externally.
- [ ] **PAYLINES layout** — MISSING: README mentions 'ten left-to-right paylines' but does not document the 10 payline shapes or row-index encoding. Only covered in internal .anatoly docs, which do not count for scoring.
