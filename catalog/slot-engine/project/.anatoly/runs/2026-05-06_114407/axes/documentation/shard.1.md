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
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 88% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srclegacyts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 95% | JSDoc describes purpose and house-edge intent but omits @param descriptions for both lineWins and bet (typed as any), and no @returns describing ceiling-rounding or the unconditional +1% bet addition. (deliberated: confirmed — Confirmed. src/engine.ts:105 applies `total * (1 + HOUSE_EDGE)` where HOUSE_EDGE=0.05 (line 14), yielding a 1.05x multiplier on wins — inflating payouts above 100% RTP. JSDoc at lines 97-100 documents target ~95% RTP, requiring `(1 - HOUSE_EDGE)`. Line 108 adds `bet * 0.01` unconditionally (even on losses), further inflating RTP. `bet: any` at line 101 bypasses type safety. Called at line 138 (not 144 as stated in finding). Critical financial bug in a slot engine.) |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 78% | Exported public API with no JSDoc. Missing @param reelIndex (valid range 0–4), @returns (3-element column array), and behavior on out-of-range index. (deliberated: confirmed — Confirmed. src/reels.ts:44 accesses `REEL_WEIGHTS[reelIndex]` with no bounds check. REEL_WEIGHTS has 5 entries (lines 22-28). Any reelIndex outside [0,4] yields undefined, causing TypeError in pickFromWeighted at line 31 (`wts.reduce`). Current usage in src/factories.ts:11-12 always passes indices 0-4 (driven by reelCount=5 at engine.ts:128), so crash is unreachable in practice. Kept NEEDS_FIX since the exported public API accepts arbitrary numbers with no guard, but slightly lowered confidence due to limited current blast radius.) |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. Should document that it returns the shared SYMBOLS reference and that mutation would affect all reel logic. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 75% | Exported public API with no JSDoc. Missing @param reelIndex (valid range), @returns (8-element weight array), and mutation-risk warning on returned reference. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 85% | Exported public API with no JSDoc. Missing: description of what 'count' valid values are (3–5), what 0 return means, and that WILD/SCATTER symbols are not handled. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Abstract base class with non-obvious extension contract (post-calculation payout adjustment hook) deserves at minimum a purpose description and note that subclasses must implement adjustPayout. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Pass-through behavior is not self-evident from the name alone; a one-line doc clarifying it returns the result unchanged would prevent misuse. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc explaining what event this constant represents, when it is emitted, or what arguments handlers receive. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing: parameter description for `reels`, return value semantics (total count across all positions, not per-reel), and the fact that detection is grid-wide rather than payline-restricted. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 65% | No JSDoc comment. Missing: description of state mutation side-effects, the scatter threshold of 3, the 10-spin award and retrigger behavior, and the decrement/deactivation path when scatters < 3 during an active session. (deliberated: confirmed — Off-by-one confirmed in retrigger path. src/freespin.ts:17-18: when `state.active && scatters >= 3`, `remaining += 10` without decrementing for the current spin, unlike the normal active path at line 20 (`remaining--`). However, the sole caller (src/engine.ts:141) creates a fresh FreeSpinState with `active: false` on every spin, making the retrigger branch (line 17) and decrement branch (line 19) permanently unreachable in production. Bug is real but has zero blast radius in current codebase. Lowered confidence accordingly.) |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 72% | No JSDoc/TSDoc. As an abstract base defining the grid-construction contract, it warrants at minimum a description of purpose and parameter semantics (reelCount vs rowCount). |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 88% | No JSDoc/TSDoc on class or buildReels. The silently ignored _rowCount parameter (reel height is implicitly fixed by spinReel) is a non-obvious contract violation that must be documented. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing description of purpose, parameter semantics (shape/dimensions of reels array), return value meaning, and the DIAMOND threshold (>=4) that drives the jackpot condition. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 90% | File-level JSDoc describes purpose and algorithm but is attached to the file, not the function. The function itself has no JSDoc — missing @param descriptions for `items` and `weights`, no @returns, no @throws for edge cases (e.g., empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. src/rng.ts:5-16 implements correct weighted random selection: total computation (line 6), uniform roll (line 7), cumulative threshold (lines 9-12), fallback (line 15). The NEEDS_FIX was based on duplication with pickFromWeighted — valid as a duplication finding but not a correction bug. Additionally, weightedPick is imported (engine.ts:2), registered in container (line 30), and resolved (line 120), but the resolved `rng` variable is never invoked — grep for `rng(` in engine.ts returns no matches. Actual reel generation uses pickFromWeighted via spinReel, bypassing the container entirely. This is a dead-resolution / DI design issue, not a bug in weightedPick itself.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-6 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-7 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-1 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-1 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-2 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-3 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-2 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-6 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]
