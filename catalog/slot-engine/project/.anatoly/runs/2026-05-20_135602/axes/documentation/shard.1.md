[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 85% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | JSDoc describes purpose and house-edge intent but omits @param for lineWins and bet, omits @returns, and does not document the unconditional floor addition (bet * 0.01) or the incorrect house-edge direction (multiplies by 1.05, which raises rather than reduces payout). |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 92% | Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), explanation that it returns 3 independently sampled symbols, and what happens for an out-of-range index. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. While simple, a note that the returned array is ordered and matches the weight-array index positions would be useful. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 88% | Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), return array ordering, and that the array is not a defensive copy. |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | No JSDoc. Missing: what `count` represents (consecutive matching symbols on a line), what the returned number is a multiplier of (line bet), and that WILD/SCATTER return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 80% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 85% | No JSDoc comment. Identity behavior (pass-through) is not obvious from the class name alone and is undocumented. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 82% | No JSDoc on the class or any of its public methods (on, off, emit). A public API class with three exported methods has no description of purpose, parameters, or behavior. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The constant's value is visible but there is no documentation of when it is emitted, what args are passed, or how consumers should use it. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 88% | No JSDoc comment. The non-obvious behavior — that _rowCount is silently ignored and row count is fixed by spinReel() — is a critical omission; callers passing rowCount will receive no indication it has no effect. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, the grid traversal approach, and return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The three-branch state machine (activate, retrigger, decrement/deactivate) and mutation-in-place behavior are non-obvious and warrant documentation. Missing @param descriptions and side-effect notice. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious behavior includes: the hardcoded threshold of 4 DIAMONDs, that counting spans the entire grid (not payline-restricted), and the meaning of the reels parameter shape — none of which are documented inline. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 88% | JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what `items` and `weights` represent, no constraint that arrays must be same length or weights non-negative), and no @returns tag explaining the selected item. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Verified rng.ts:5-16: identical algorithm to pickFromWeighted, equally correct. Two claimed defects: (1) Non-certifiable RNG — security/compliance concern, not algorithmic correctness. Math.random() produces a valid uniform distribution for the weighted selection algorithm. (2) Silent undefined on empty input — calling weightedPick([], []) returns items[-1]=undefined typed as T (rng.ts:15). This IS a real edge case, but no caller in the codebase passes empty arrays: the only import is engine.ts:2, registered at engine.ts:30, resolved at engine.ts:120, and the resolved rng variable is never actually called at runtime (reels are built via factory.buildReels→spinReel→pickFromWeighted path at factories.ts:12). The function is effectively dead code in the current call graph. Defensive input validation is hardening, not correction of an existing defect. Per investigation rules: only actual defects (crashes, data loss, security breaches) warrant NEEDS_FIX — no current code path triggers the empty-input issue.) |

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
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-8 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-3 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-9 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-4 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 30% covered

- [ ] **computePayout** — MISSING: Exported function is not mentioned anywhere in README.md.
- [ ] **Bet type** — MISSING: Exported type alias Bet has no documentation page coverage.
- [ ] **wild multiplier formula** — PARTIAL → `README.md`: README mentions 'applies wild multipliers' but does not explain the (1 + wildCount) * 2^wildCount amplification formula.
- [ ] **house edge / RTP** — MISSING: HOUSE_EDGE constant and its effect on RTP are not mentioned in README.md.
