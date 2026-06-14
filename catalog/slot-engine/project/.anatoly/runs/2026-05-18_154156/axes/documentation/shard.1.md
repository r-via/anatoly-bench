[← Back to Documentation](./index.md) · [← Back to report](../../public_report.md)

# 📝 Documentation — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧹 Hygiene](#-hygiene)

## 📊 Findings

| File | Verdict | Documentation | Conf. | Details |
|------|---------|---------------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 3 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/legacy.ts` | 🟡 NEEDS_REFACTOR | 0 | 80% | [details](#srclegacyts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `computePayout` | L101–L111 | 🟡 PARTIAL | 88% | Has a JSDoc block describing purpose and house-edge intent, but no @param tags for lineWins or bet, no @returns tag, and the RTP claim ("~95%") is contradicted by the code adding HOUSE_EDGE on top of wins rather than reducing them. |

### `src/reels.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `spinReel` | L43–L50 | 🔴 UNDOCUMENTED | 85% | Exported with no JSDoc. Missing: valid range for reelIndex (0–4), that it returns exactly 3 symbols per call, and that each symbol is drawn independently. |
| `getReelSymbols` | L52–L54 | 🔴 UNDOCUMENTED | 95% | Exported with no JSDoc. Name is clear but return value is a mutable reference to the internal SYMBOLS array — a potentially important side-effect not documented. |
| `getReelWeights` | L56–L58 | 🔴 UNDOCUMENTED | 85% | Exported with no JSDoc. Valid reelIndex range (0–4), the meaning of each element in the returned array, and whether it is a live reference are all undocumented. (deliberated: confirmed — Confirmed. src/reels.ts:56-58 performs no bounds check. REEL_WEIGHTS has 5 elements (L22-28). Passing reelIndex ≥ 5 or < 0 returns undefined typed as number[], causing downstream TypeError. Additionally, it returns a mutable reference to the internal weight array — callers can silently corrupt probability tables. In engine.ts, getReelWeights is imported (L3), registered in container (L32), and resolved (L122), but reelsModule.getReelWeights is never actually called during spin(). Blast radius is limited to hypothetical external consumers, but the type-safety defect is real.) |

### `src/paytable.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `getPayMultiplier` | L14–L21 | 🔴 UNDOCUMENTED | 95% | No JSDoc comment. Missing @param descriptions for symbol and count, no @returns explaining that the multiplier is applied to lineBet (not raw bet), and no note that counts < 3 or > 5 return 0. |

### `src/strategy.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Abstract base class with a single abstract method; purpose, extension contract, and usage pattern are undocumented. |
| `DefaultStrategy` | L7–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Pass-through behavior of adjustPayout is not described. |

### `src/events.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 UNDOCUMENTED | 78% | No JSDoc on the class or any of its methods (on, off, emit). Public API with non-trivial behavior (listener deduplication via filter, silent no-op on missing event in off/emit) deserves at minimum class-level and method-level docs. |
| `SPIN_DONE` | L27–L27 | 🔴 UNDOCUMENTED | 90% | No JSDoc. As a public event-name constant consumed by external callers, it should document when it is emitted and what payload to expect. |

### `src/factories.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 UNDOCUMENTED | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The concrete implementation silently ignores _rowCount, which is a non-obvious behavioral contract that warrants documentation. buildReels also lacks @param/@returns annotations. |

### `src/freespin.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. Missing description of what constitutes a scatter count, the shape of the input grid, and the return value semantics. |
| `handleFreeSpins` | L13–L25 | 🔴 UNDOCUMENTED | 90% | No JSDoc comment. The trigger threshold (≥3 scatters), initial award (10 spins), retrigger behavior (+10), and decrement-on-spin logic are all undocumented. State mutation side-effects are not noted. |

### `src/rng.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `weightedPick` | L5–L16 | 🟡 PARTIAL | 92% | JSDoc describes purpose and algorithm but omits @param descriptions for `items` and `weights`, missing @returns, and no mention of edge cases (empty arrays, mismatched lengths, negative weights). (deliberated: confirmed — Confirmed. src/rng.ts:5-16 is the canonical RNG function, imported by engine.ts:2, registered in container at engine.ts:30, resolved at engine.ts:120 — but the resolved `rng` variable is never called in spin(). Actual reel generation flows through factory.buildReels(5,3) → spinReel(i) (factories.ts:12) → pickFromWeighted (reels.ts:47), which is the duplicate copy. weightedPick itself is algorithmically correct, but it's effectively dead code at runtime despite being the architecturally intended RNG entry point. The fix is to eliminate pickFromWeighted in reels.ts and have spinReel use weightedPick (either directly or via the container).) |

### `src/jackpot.ts`

| Symbol | Lines | Documentation | Conf. | Detail |
|--------|-------|---------------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 UNDOCUMENTED | 90% | No JSDoc/TSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols), parameter shape, and return value semantics. |

## 🧹 Hygiene

- [ ] <!-- ACT-28c3e3-3 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- [ ] <!-- ACT-28c3e3-4 --> **[documentation · medium · trivial]** `src/engine.ts`: Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- [ ] <!-- ACT-7dd2fe-1 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SpinEventEmitter` (`SpinEventEmitter`) [L3-L25]
- [ ] <!-- ACT-7dd2fe-2 --> **[documentation · medium · trivial]** `src/events.ts`: Add JSDoc documentation for exported symbol: `SPIN_DONE` (`SPIN_DONE`) [L27-L27]
- [ ] <!-- ACT-dd0b20-3 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- [ ] <!-- ACT-dd0b20-4 --> **[documentation · medium · trivial]** `src/factories.ts`: Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
- [ ] <!-- ACT-89de92-1 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `detectScatters` (`detectScatters`) [L3-L11]
- [ ] <!-- ACT-89de92-2 --> **[documentation · medium · trivial]** `src/freespin.ts`: Add JSDoc documentation for exported symbol: `handleFreeSpins` (`handleFreeSpins`) [L13-L25]
- [ ] <!-- ACT-547488-1 --> **[documentation · medium · trivial]** `src/jackpot.ts`: Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
- [ ] <!-- ACT-f69593-3 --> **[documentation · medium · trivial]** `src/legacy.ts`: Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
- [ ] <!-- ACT-df0e0f-3 --> **[documentation · medium · trivial]** `src/paytable.ts`: Add JSDoc documentation for exported symbol:  `ANCIENT_RTP`, `getPayMultiplier`, `lineWins` (`ANCIENT_RTP, getPayMultiplier, lineWins`) [L3-L3, L14-L21, L23-L40]
- [ ] <!-- ACT-83e35f-6 --> **[documentation · medium · trivial]** `src/reels.ts`: Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
- [ ] <!-- ACT-e0699c-1 --> **[documentation · medium · trivial]** `src/strategy.ts`: Add JSDoc documentation for exported symbol:  `SpinStrategy`, `DefaultStrategy`, `ConservativeStrategy` (`SpinStrategy, DefaultStrategy, ConservativeStrategy`) [L3-L5, L7-L11, L13-L20]
- [ ] <!-- ACT-28c3e3-7 --> **[documentation · low · trivial]** `src/engine.ts`: Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- [ ] <!-- ACT-4db700-3 --> **[documentation · low · trivial]** `src/rng.ts`: Complete JSDoc documentation for: `weightedPick` (`weightedPick`) [L5-L16]

## Documentation Coverage

### `src/engine.ts` — 30% covered

- [ ] **Wild multiplier mechanics** — PARTIAL → `README.md`: README mentions "applies wild multipliers" but does not document the formula ((1+wildCount)×2^wildCount) or the per-line vs global distinction.
- [ ] **Paylines definition** — PARTIAL → `README.md`: README states "ten left-to-right paylines" but does not document the row-index patterns or shapes.
- [ ] **House edge / RTP** — MISSING: HOUSE_EDGE constant and its effect on computePayout are not mentioned anywhere in README.md.
- [ ] **computePayout** — MISSING: The exported computePayout function is not referenced in README.md.
