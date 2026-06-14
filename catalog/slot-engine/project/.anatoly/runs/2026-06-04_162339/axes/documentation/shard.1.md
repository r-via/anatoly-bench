[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/wild.ts` | 🟡 NEEDS_REFACTOR | 0 | 90% | [details](#srcwildts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `Bet` | L12–L12 | 🔴 UNDOCUMENTED | 90% | Exported type alias with no JSDoc. Purpose and valid range not described. |
| `computePayout` | L101–L111 | 🟡 PARTIAL | 90% | JSDoc describes purpose and house-edge intent but omits @param descriptions for `lineWins` and `bet`, doesn't document the unconditional `bet * 0.01` floor, and uses `any` for `bet` without explanation. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 93% | Exported public API with no JSDoc. Missing: description of what 'spinning' means, valid range of reelIndex (0–4), explanation that it returns a 3-element column, and behavior when reelIndex is out of range. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported public API with no JSDoc. No explanation that the returned array order is significant (it matches weight index positions). |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 93% | Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally with getReelSymbols(), and that it returns a direct reference (mutable). |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `ANCIENT_RTP` | L3–L3 | 🔴 UNDOCUMENTED | 95% | No JSDoc. The 'ANCIENT' qualifier is non-obvious — it's unclear whether this is a theoretical RTP, a game-mode-specific RTP, or a legacy value. Purpose and usage context are undocumented. |
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 92% | Exported function with no JSDoc. Missing: what 'count' represents (run length), valid range for count, return value semantics (base multiplier, not a payout), and the fact that WILD/SCATTER return 0. |
| `lineWins` | L23–L40 | 🔴 UNDOCUMENTED | 92% | Exported function with no JSDoc. Non-obvious behavior: WILD-first resolution picks the first non-WILD symbol as the anchor, SCATTER/all-WILD lines return null, and the function only counts a contiguous prefix run. None of this is documented. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | Abstract base class with no JSDoc. Purpose, intended usage pattern, and the contract of adjustPayout are not described. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc on class or method. The pass-through behavior of adjustPayout (returns result unchanged) is non-obvious and warrants documentation. |
| `ConservativeStrategy` | L13–L20 | 🔴 UNDOCUMENTED | 85% | No JSDoc on class or method. The 0.8 multiplier and floor operation are magic values with no explanation of their rationale or effect. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc on the class or any of its public methods (`on`, `off`, `emit`). Public API with non-trivial semantics (listener map lifecycle, deduplication behavior) lacks all documentation. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment explaining when this event is emitted or what payload (if any) it carries. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Abstract factory contract with non-trivial semantics (reelCount vs rowCount distinction, return shape) warrants documentation. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. `_rowCount` is ignored silently — that behavioral deviation from the abstract contract is undocumented and non-obvious. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Exported public function with no description, no @param for `reels`, no @returns explaining the count semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc. Exported public function with non-trivial state-machine logic (activation threshold, retrigger, decrement-to-deactivate). Neither parameter is described, mutation side-effect is undocumented, and the `scatters >= 3` threshold and `remaining = 10` magic numbers are unexplained. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 95% | Block comment describes purpose and algorithm but lacks @param descriptions for `items` and `weights`, no @returns tag, and no mention of edge cases (empty arrays, negative weights, mismatched array lengths). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. rng.ts:5-16 is algorithmically correct — identical logic to pickFromWeighted, both producing valid results. The evaluator conflated duplication with a correctness defect. Additionally, while weightedPick is imported in engine.ts:2 and registered in the container (engine.ts:30), the resolved variable `rng` (engine.ts:120) is never actually called within spin() — reel generation goes through StandardReelBuilderFactory.buildReels → spinReel → pickFromWeighted (the reels.ts local copy). This makes weightedPick effectively dead code via the container path, but that's a utility/dead-code issue, not a correctness bug. The function itself has no defect.) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Public export with non-obvious semantics: counts DIAMOND symbols grid-wide (not payline-restricted) and uses a hardcoded threshold of 4. Parameter and return behavior are undocumented. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-4 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-3 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-df0e0f-1 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-5 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-3 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-6c7a2e-2 --> **[documentation · medium · trivial]** `src/wild.ts`: Add JSDoc documentation for exported symbol: `applyWildBonus` (`applyWildBonus`) [L1-L4]
- [ ] <!-- ACT-28c3e3-10 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 25% covered

- [ ] **spin** — PARTIAL → `README.md`: README describes the happy-path behavior (5 reels, 10 paylines, wilds, scatters, jackpot) but omits the bet constraints, the string-throw error contract, and the `bet * 0.01` minimum-return floor.
- [ ] **computePayout** — MISSING: Exported function not mentioned in any docs/ page. House-edge application and minimum-return floor are invisible to users of the public API.
- [ ] **Bet** — MISSING: Exported type alias not referenced in docs/. Valid range (1–100 integer) is discoverable only by reading source.
