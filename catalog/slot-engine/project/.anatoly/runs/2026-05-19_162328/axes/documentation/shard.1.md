[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 0 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 88% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 85% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 65% | Exported public API with no JSDoc. Missing: description of reelIndex valid range (0–4), the fixed 3-row output size, and return type semantics. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. No comment on whether the returned array is a copy or the live reference, nor its ordering significance. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 60% | Exported public API with no JSDoc. Missing: valid range for reelIndex, whether the returned array is a live reference (mutations would affect behaviour), and weight ordering relative to SYMBOLS. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | Exported public API with no JSDoc. Missing: what `count` represents, valid range, return value semantics (multiplier vs. absolute payout), and behavior when symbol is absent from PAY_TABLE. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 75% | Class and all three public methods (on, off, emit) lack JSDoc. Key behavioral constraints — no `once`, no error event, new instance per `spin()` call — are completely undocumented in inline comments or JSDoc. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. The constant's purpose (when it is emitted, who listens, what payload it carries) is not documented. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Purpose, parameter shape, and return value are not described. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The three-branch state machine logic (trigger, re-trigger, decrement/deactivate) and mutation side-effects are non-obvious and warrant documentation. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 88% | No JSDoc comment. The class name hints at its role, but the non-obvious `rowCount` parameter semantics (accepted by interface, currently ignored by the standard impl) and the factory pattern contract are not documented. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 88% | No JSDoc on the class or its `buildReels` method. The silent `_rowCount` ignore is a meaningful behavioral constraint that callers cannot discover without reading the source. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | Exported public function with no JSDoc/TSDoc comment. Missing: purpose description, @param for reels, @returns explanation, and the critical constraint that ≥4 DIAMOND symbols anywhere in the grid triggers the jackpot. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-7 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol:  `Bet`, `computePayout`, `spin` (`Bet, computePayout, spin`) [L12-L12, L101-L111, L113-L179]
- [ ] <!-- ACT-7dd2fe-1 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-1 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-2 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-3 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-6 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-3 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]

## Documentation Coverage

### `src/engine.ts` — 33% covered

- [ ] **computePayout** — MISSING: Exported function not mentioned anywhere in README.md. Consumers cannot discover it or its house-edge semantics from project docs.
- [ ] **Bet** — MISSING: Exported type alias not referenced in README.md. Valid range and units are undocumented externally.

### `src/jackpot.ts` — 25% covered

- [ ] **isJackpotHit / jackpot trigger logic** — PARTIAL → `README.md`: README.md mentions jackpot detection as a bullet within spin() behavior but does not describe the 4+ DIAMOND rule, the reels parameter shape, or that jackpotHit does not affect totalPayout. The trigger condition and usage contract are absent from docs/.
