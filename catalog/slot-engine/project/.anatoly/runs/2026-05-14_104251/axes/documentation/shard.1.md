[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 1 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 95% | JSDoc describes purpose and house-edge intent but omits: parameter types/descriptions, the unexplained `bet * 0.01` floor addition, return value description, and the fact that `bet` is typed `any`. (deliberated: confirmed — Confirmed three correctness defects. (1) src/engine.ts:105 does `total * (1 + HOUSE_EDGE)` where HOUSE_EDGE=0.05 (L14), yielding a 1.05x multiplier that INCREASES payouts. Docstring at L98-99 states target RTP ~95%, requiring `total * (1 - HOUSE_EDGE)` = 0.95x. This is an inverted house edge — the engine pays 105% instead of 95%. (2) L108 `total += bet * 0.01` unconditionally adds 1% of bet to every spin, even zero-win spins, creating a constant money leak. (3) L101 `bet: any` ignores the `Bet` type alias defined at L12. All three are verifiable bugs, not preferences. Raising confidence to 95 given the financial impact in a gambling engine.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. Missing: what reelIndex range is valid, that it returns 3 symbols (one per row), and that results are independently sampled. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 78% | Exported public API with no JSDoc. No description of what the returned array represents or its ordering significance. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 85% | Exported public API with no JSDoc. Missing: valid range for reelIndex, what the returned numbers represent (unnormalized weights), and their correspondence to getReelSymbols() ordering. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | No JSDoc comment. Missing documentation for parameters (symbol, count), return value semantics (multiplier relative to what bet unit?), and the fact that counts outside {3,4,5} return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 88% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 82% | No JSDoc on the class or any of its public methods (on, off, emit). Public API lacks parameter descriptions, return info, and behavioral notes (e.g. silent no-op on off() with unknown handler). |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Purpose and when this event is emitted are not described. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 88% | No JSDoc comment. Missing description of the standard build strategy, why _rowCount is ignored, and what spinReel produces per reel index. (deliberated: confirmed — Confirmed. factories.ts:9 accepts `_rowCount` but never forwards it. `spinReel` at reels.ts:46 hardcodes `row < 3`. The abstract class at factories.ts:5 declares `rowCount` as a meaningful parameter in the contract. Caller at engine.ts:128 passes `buildReels(5, 3)` — coincidentally matches the hardcode, but any other rowCount value is silently ignored, producing wrong reel shapes. The `_` prefix indicates developer awareness of the unused param, but the abstract contract promises usage. This is a genuine interface violation, not a style preference.) |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of purpose, parameter shape, and return value semantics (e.g. what constitutes a scatter, why counting matters). |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 72% | No JSDoc comment. State mutation side-effects, threshold logic (>=3 scatters), spin award amount (10), and decrement/deactivation behavior are all undocumented. (deliberated: confirmed — Partially confirmed but the defect is in the caller, not the function. handleFreeSpins at freespin.ts:13-25 is a correct state machine — the retrigger branch (L17: `state.active && scatters >= 3` → `remaining += 10`) and decrement branch (L19-23) are logically sound. However, engine.ts:141 creates a fresh `FreeSpinState { active: false, remaining: 0, totalWon: 0 }` every spin call. This makes the retrigger (L17) and decrement (L19) branches permanently unreachable from the only caller. The `totalWon` field (types.ts:21) is never written anywhere. The function itself is correct; the integration bug is in engine.ts not persisting state. Slightly lowered confidence because the fix location differs from the finding's target symbol.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of jackpot logic, explanation of the 4-diamond threshold, parameter shape (2D reel array), and boolean return semantics. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 88% | JSDoc describes purpose and algorithm but lacks @param descriptions (items, weights), @returns, error behavior for mismatched array lengths or all-zero weights, and @template T. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at rng.ts:5-16 is correct: identical cumulative-weight algorithm, properly generic with T. The NEEDS_FIX was based on duplication with pickFromWeighted in reels.ts:30-41 — confirmed identical logic. But duplication is not a correctness defect; both implementations produce correct results independently. Additionally, weightedPick is imported in engine.ts:2, registered at L30, resolved at L120 as `rng`, but `rng` is never actually called in the spin function — the actual reel generation goes through factories.ts→spinReel→pickFromWeighted. This makes the import/registration dead code in the integration, but weightedPick itself is correct. Reclassified correction to OK; duplication belongs on its own axis.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-9 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-5 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-4 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-9 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-4 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-28c3e3-15 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
