[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 91% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 90% | Has a JSDoc description and notes the house-edge RTP target, but missing @param for lineWins and bet (typed as any), missing @returns, and the unconditional floor of bet * 0.01 is not explained. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 87% | Exported public API with no JSDoc. Missing: description of reelIndex range (0–4), explanation that return value is a 3-element column, and any note on independence of picks. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. No description of return value order or that it mirrors the weight-array index mapping. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), description of returned array length/order, and that weights are read-only. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. Missing @param descriptions for symbol and count, no @returns, and no note that WILD/SCATTER return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 82% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. The identity-pass-through behavior is not obvious from the name; a one-line description would suffice but is absent. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 88% | Exported public class with no JSDoc on the class or any of its three methods (on, off, emit). Missing: class-level purpose, event name conventions, listener ordering guarantees, and per-method parameter/return docs. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | Exported constant with no JSDoc. The string value 'spin:done' hints at purpose but does not document when the event fires, what arguments are passed to listeners, or which emitter emits it. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc on class or `buildReels`. Critical non-obvious behavior — `_rowCount` is silently ignored; each reel always produces a fixed row count via `spinReel()` — is undocumented. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of scatter counting logic (full grid vs paylines), parameter shape, and return semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious state machine with three branches (activate, retrigger, decrement/deactivate) and in-place mutation — all undocumented. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 91% | JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, no @returns tag, and no documentation of edge cases (empty arrays, mismatched array lengths, negative weights). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Algorithm at src/rng.ts:5-16 is identical to pickFromWeighted and equally correct. Duplication belongs on the duplication axis. Additionally, weightedPick is effectively dead at runtime: imported at engine.ts:2, registered in container at engine.ts:30, resolved at engine.ts:120 as `rng`, but `rng` is never invoked — grep of engine.ts shows zero calls to the resolved variable. Reels are generated via factory.buildReels(5,3) → spinReel → pickFromWeighted path (factories.ts:12 → reels.ts:47). The empty-input edge case (items[-1]=undefined) is theoretical hardening, not correction of an existing defect — no caller passes empty arrays.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing: purpose description, @param for reels, @returns explanation, and the hardcoded threshold of 4 DIAMOND symbols. |

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
- [ ] <!-- ACT-df0e0f-4 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-7 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-3 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-4 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 25% covered

- [ ] **spin function** — PARTIAL → `README.md`: README covers basic usage and lists high-level behaviors (reels, paylines, wilds, scatters, jackpot) but omits bet validation rules, thrown errors, and the unconditional minimum return.
- [ ] **computePayout** — MISSING: Not mentioned in any docs/ page. House-edge application and bet * 0.01 floor are invisible to consumers.
- [ ] **Bet type** — MISSING: Exported type alias not referenced in docs/. Valid range (integer, 1–100) is undocumented.
- [ ] **PAYLINES layout** — MISSING: README mentions 'ten paylines' but never describes the row-index encoding or individual payline shapes.
- [ ] **Wild multiplier formula** — PARTIAL → `README.md`: README says 'applies wild multipliers' but does not document the exponential bonus formula used in evaluateLine and spin.
