[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 10 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srceventsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 95% | Type alias with no test file present. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists; transitive coverage via computePayout is moot since computePayout itself has no tests. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists; spin (the only caller) is also untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file present; register/resolve behavior is never directly or indirectly verified by any test. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file; spin is the only caller and is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file; spin is the only caller and is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file; WILD/SCATTER logic, run-length counting, and minimum-run threshold are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file; wild-count multiplier logic and null-return path are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file; house-edge application (adds edge instead of reducing payout — likely a bug) and base-bet bonus are untested. |
| `spin` | L113–L179 | 🔴 NONE | 92% | No test file; bet validation, free-spin integration, jackpot path, wild-multiplier accumulation, and strategy adjustment are all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Transitive coverage via spinReel/getReelSymbols, but those exports are also untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 95% | No test file exists; no transitive coverage from any tested caller. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists; private function with no tested callers. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists; transitive callers spinReel/getReelWeights are also untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file exists. Core weighted-random logic (boundary at r==total, fallback return) has zero test coverage. |
| `spinReel` | L43–L50 | 🔴 NONE | 93% | No test file exists. Exported and called by src/factories.ts but no tests cover its behavior or edge cases (invalid reelIndex, distribution correctness). |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Consumed by src/engine.ts spin() but no tests verify the returned symbol list. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file exists. Consumed by src/engine.ts spin() but no tests cover valid/invalid reelIndex or returned weight arrays. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists; sole caller getPayMultiplier is also untested, so no transitive coverage applies. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file found. Callers src/engine.ts and src/legacy.ts are not confirmed to have tests that exercise this symbol. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `EventHandler` | L1–L1 | 🟡 WEAK | 60% | No test file exists for this source file. Type alias has no runtime behavior, but transitive coverage via SpinEventEmitter is also absent. |
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 87% | No test file found. on/off/emit methods and multi-listener behavior, handler removal, and emit-with-args are untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file found. Constant is consumed by src/engine.ts but no tests verify its value or usage. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file exists. Used by the critical `spin` function in engine.ts — pass-through payout behavior is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class with no runtime behavior beyond defining the interface, but still untested. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts (full slot machine spin logic), yet has zero direct tests — no coverage of correct reel count, row count ignored, or `spinReel` delegation. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical path: feeds scatter count into handleFreeSpins via spin(). Edge cases untested: empty reels, zero scatters, exactly 3 scatters, scatters in multiple columns. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches untested: initial activation (scatters>=3, inactive), retrigger (scatters>=3, active), decrement (active, scatters<3, remaining>0), and deactivation (remaining reaches 0). All called by core spin() function. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic consumed by `spin` with no coverage of: exactly 4 diamonds (boundary true), 3 diamonds (boundary false), 0 diamonds, diamonds spread across multiple reels vs. same reel, or empty reels input. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical RNG utility consumed by core slot machine spin logic — missing coverage for: uniform distribution validation, single-item arrays, mismatched array lengths, zero/negative weights, last-item fallback path (L15), and boundary roll values at cumulative weight thresholds. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout (L106): `total * (1 + HOUSE_EDGE)`. | [UNIQUE] Module-level constant with no RAG matches. | [OK] Value 0.05 correctly represents 5%; the defect is in computePayout's application of it, not in the constant itself. | [LEAN] Named constant for a magic number — minimal and appropriate. | [NONE] No test file exists; transitive coverage via computePayout is moot since computePayout itself has no tests. | [UNDOCUMENTED] No JSDoc. Non-obvious value with a semantic impact on RTP; warrants at least an inline explanation.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded false; the guarded branch in spin (L161–163) is permanently dead. Symbol is syntactically referenced but never enables any behavior. | [UNIQUE] Module-level constant with no RAG matches. | [OK] Boolean flag, used correctly in spin for conditional logging. | [LEAN] Simple boolean flag; hardcoded false is dead but not complex. | [NONE] No test file exists; spin (the only caller) is also untested. | [UNDOCUMENTED] No JSDoc. Internal flag; low severity, but no comment explaining effect.
  - EngineContainer: [USED] Instantiated at L29 to create the module-level container. | [UNIQUE] Simple IoC registry class with no RAG matches. | [OK] Registry pattern is self-consistent; all keys are registered before being resolved. | [OVER] DIY service-locator / IoC container wrapping a Map<string, unknown> with type-unsafe resolve<T>. All three registered values (weightedPick, getPayMultiplier, reelsModule) are already available as direct module imports at the top of the file and never need runtime substitution. The abstraction adds zero testability benefit (nothing swaps implementations) and introduces unsafe casting. Replace with the three direct import references. | [NONE] No test file present; register/resolve behavior is never directly or indirectly verified by any test. | [UNDOCUMENTED] No JSDoc on class or its methods. Non-exported but non-trivial: acts as a manual IoC container — purpose is not obvious from name alone.
  - container: [USED] Resolved in spin for paytable (L127) and rng/reels (L126, L128), with paytable actively passed to evaluateLine (L136). | [UNIQUE] Module-level singleton instance with no RAG matches. | [OK] All three dependencies registered with correct keys and values. | [LEAN] Single instantiation and wiring of EngineContainer. Overengineering is attributed to the class definition; this is just the consumer. | [NONE] No test file; spin is the only caller and is untested. | [UNDOCUMENTED] No JSDoc. Internal singleton with side-effecting registrations; purpose and lifetime undocumented.
  - PAYLINES: [USED] Iterated in spin (L135) and used for wild multiplier recalculation (L147). | [UNIQUE] Payline definition array with no RAG matches. | [OK] All 10 paylines match the reference documentation exactly. | [LEAN] Plain data table of 10 fixed payline paths — appropriate for this domain. | [NONE] No test file; spin is the only caller and is untested. | [UNDOCUMENTED] No JSDoc. The row-index semantics and payline shapes are non-obvious without a comment; none present.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced by pickFromWeighted call in spinReel and returned by getReelSymbols, both of which are runtime-imported externally. | [UNIQUE] No similar constants found in RAG results. | [OK] Eight symbols defined, order matches weightsToArray and is consistent with reference docs. | [LEAN] Plain array of 8 symbol literals — minimal and appropriate. | [NONE] No test file exists. Transitive coverage via spinReel/getReelSymbols, but those exports are also untested. | [UNDOCUMENTED] No JSDoc. Internal constant; not exported, but its role as the master symbol roster used by all reels is non-trivial and undocumented.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times to populate REEL_WEIGHTS. | [UNIQUE] No similar constants found in RAG results. | [NEEDS_FIX] DIAMOND weight=30 (p=0.25) produces per-payline expected return far exceeding the arbitrated 95% RTP target. | [LEAN] Named constant with readable per-symbol values — appropriate regardless of the surrounding abstraction. | [NONE] No test file exists; no transitive coverage from any tested caller. | [UNDOCUMENTED] No JSDoc. Purpose (shared default distribution for all five reels) and the significance of the weight values are not explained. (deliberated: confirmed — Confirmed at reels.ts:14: DIAMOND weight=30, highest of all symbols (total weights=120, so 25% probability per pick). Cross-referenced paytable.ts:11: DIAMOND pays [50, 250, 1000], also the highest-paying symbol. This inverts the standard rarity-payout relationship. Compare SEVEN: weight=5 (4.2%), pays [25, 100, 500]. DIAMOND is 6x more frequent yet pays 2x more. Further, jackpot.ts:10 triggers at ≥4 DIAMONDs across 15 positions (5 reels × 3 rows); binomial probability of 4+ hits at p=0.25 is ~22%, making jackpots fire roughly every 5 spins. DIAMOND weight should be ~2-3 to maintain viable RTP.)
  - weightsToArray: [USED] Called five times to build REEL_WEIGHTS from DEFAULT_WEIGHTS. | [UNIQUE] No similar functions found per RAG results. | [OK] Correctly maps ReelWeightConfig fields to array in same order as SYMBOLS. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists; private function with no tested callers. | [UNDOCUMENTED] Private 3-line helper; lenient, but the fixed symbol-order dependency (must match SYMBOLS order) is a hidden constraint worth documenting.
  - REEL_WEIGHTS: [USED] Indexed by spinReel and getReelWeights, both externally consumed. | [UNIQUE] No similar constants found in RAG results. | [OK] Correctly constructs five identical weight arrays from DEFAULT_WEIGHTS. Defect is in the source constant; flagged there per rule 10. | [ACCEPTABLE] Five explicit identical weightsToArray calls where Array(5).fill(...) would be cleaner, but readability is acceptable and the verbosity is minor. | [NONE] No test file exists; transitive callers spinReel/getReelWeights are also untested. | [UNDOCUMENTED] No JSDoc. The fact that all five reels share identical weights and that modifying this array would affect runtime behavior is undocumented.
  - pickFromWeighted: [USED] Called inside spinReel for every row of every reel spin. | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: both compute a total weight via reduce, draw Math.random() * total, iterate accumulating weights, and return items[i] on first threshold crossing with the same fallback. Differences are purely cosmetic (variable names: total/totalWeight, r/roll, acc/cumulative, wts/weights) and that pickFromWeighted is typed to Symbol[] while weightedPick is generic. These functions are fully interchangeable; spinReel could call weightedPick<Symbol> directly. | [OK] Cumulative-weight random selection is correct. Previously cleared as false positive; no new evidence of defect. | [LEAN] Correct, straightforward weighted-random-selection loop. No unnecessary abstraction. | [NONE] No test file exists. Core weighted-random logic (boundary at r==total, fallback return) has zero test coverage. | [UNDOCUMENTED] Non-exported helper; lenient. Algorithm (weighted random selection, falls back to last item) and the requirement that items and wts have equal length are undocumented.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced in-file by getPayMultiplier (which is imported by other files) | [UNIQUE] No similar lookup tables found in RAG results. | [NEEDS_FIX] DIAMOND multipliers combined with documented reel weight of 30 produce ~97.7% RTP from DIAMOND 5-of-a-kind alone, violating the arbitrated 95% RTP target before any other combination is counted. | [LEAN] Flat Record with tuple values — minimal representation for a fixed paytable. | [NONE] No test file exists; sole caller getPayMultiplier is also untested, so no transitive coverage applies. | [UNDOCUMENTED] No JSDoc. Tuple indices are opaque — nothing documents that positions [0], [1], [2] correspond to 3-, 4-, and 5-of-a-kind multipliers respectively.

- [ ] `src/events.ts` — 2 untested, 1 weak
  Improve `src/events.test.ts` covering: EventHandler, SpinEventEmitter, SPIN_DONE
  - EventHandler: [USED] Referenced in-file by SpinEventEmitter (which is imported by other files) | [UNIQUE] No RAG data available | [OK] Correct generic event handler type alias. | [LEAN] Minimal type alias; improves readability without adding abstraction weight. | [NONE] No test file exists for this source file. Type alias has no runtime behavior, but transitive coverage via SpinEventEmitter is also absent. | [UNDOCUMENTED] No JSDoc comment. Type alias is simple but its role as the listener callback signature for SpinEventEmitter is not explained.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick
