[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/reels.ts` | 🔴 CRITICAL | 3 | 92% | [details](#srcreelsts) |
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 0 | 92% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 92% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), return shape (3-element column), and independence of per-row picks. (deliberated: reclassified: correction: ERROR protected (confidence 92 < 95) — src/reels.ts:43-50. The missing bounds check on reelIndex is real — REEL_WEIGHTS[outOfRange] returns undefined, crashing pickFromWeighted at L31 (.reduce on undefined). However, ERROR implies actively broken code. The sole call site (src/factories.ts:12) iterates i=0..4, matching REEL_WEIGHTS' 5 entries (L22-28). No current execution path triggers the crash. This is a defensive programming gap on an exported function, warranting NEEDS_FIX (add a RangeError guard), not ERROR (no active defect in production).) |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 75% | Exported public API with no JSDoc. No description of return value order or its correspondence to getReelWeights indices. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 90% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), return array length, and read-only semantics (no setter exists). |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc on exported function. Missing: what `count` represents (run length), valid range (3–5), that WILD/SCATTER return 0, and what the return value unit is (base multiplier applied to line bet). |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 85% | No JSDoc. Abstract base class with non-obvious extension contract — purpose, pattern, and subclassing rules are undocumented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Identity pass-through behavior is not obvious from the name alone and warrants at least a one-liner. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 88% | No JSDoc on the class or any of its public methods (on, off, emit). Exported public API with no documentation on lifecycle, threading guarantees, or intended usage pattern. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. String value 'spin:done' is visible but there is no description of when this event is emitted or what arguments accompany it. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 55% | No JSDoc. Critical undocumented behavior: _rowCount is silently ignored — each reel always produces a fixed row count via spinReel(). This constraint is invisible to callers without a comment. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, parameter shape (2D reel grid), and return semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. State-mutation side effects, the three-branch transition logic (activation, retrigger, decrement/deactivation), and the meaning of the scatters threshold are undocumented. |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Non-obvious behaviors are undocumented: the hardcoded threshold of 4 DIAMONDs, that counting is grid-wide (not payline-restricted), and what the `reels` parameter structure represents. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 90% | JSDoc describes purpose and algorithm but omits @param descriptions (no explanation of what happens when items/weights arrays have mismatched lengths, or when weights array is empty) and no @returns tag documenting the return value. (deliberated: reclassified: correction: NEEDS_FIX → OK — src/rng.ts:5-16 is algorithmically correct — identical logic to pickFromWeighted. The NEEDS_FIX was driven by the duplication finding, which belongs on the duplication axis. On the correction axis specifically, the function has no bugs: it correctly computes cumulative weights (L6-7), iterates with proper comparison (L9-13), and has a floating-point fallback (L15). It IS used at runtime — imported at engine.ts:2, registered in DI container at engine.ts:30, resolved at engine.ts:120 — though notably the resolved value is never actually called (the reel path bypasses it via pickFromWeighted). That's an architectural concern, not a correctness bug in weightedPick itself.) |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-8 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol:  `Bet`, `computePayout`, `spin` (`Bet, computePayout, spin`) [L12-L12, L101-L111, L113-L179]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-5 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-4 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-7 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-4db700-4 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 15% covered

- [ ] **spin function** — PARTIAL → `README.md`: README describes the happy-path call and result fields, but omits the bet validity constraints (integer, 1–100), the thrown string error, and the minimum floor payout (bet * 0.01) when no lines win.
- [ ] **computePayout** — MISSING: Exported function not mentioned in any docs/ page.
- [ ] **Bet type** — MISSING: Exported type alias not referenced in docs/.
- [ ] **PAYLINES / payline patterns** — MISSING: The 10 payline shapes and row-index encoding are not described in any docs/ page.
- [ ] **Wild multiplier formula** — MISSING: The (1 + wildCount) * 2^wildCount stacking rule is not documented in docs/. README only mentions 'wild multipliers' in passing.
