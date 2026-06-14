[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 10 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srceventsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 90% | Type alias with no test file present. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists; transitive coverage through computePayout is moot with zero tests. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists; no transitive coverage through spin. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file found; class is untested directly or indirectly. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file; no transitive coverage. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file; no transitive coverage. |
| `checkLine` | L47–L64 | 🔴 NONE | 65% | No test file found. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 75% | No test file; no transitive coverage. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file found. Critical payout logic — including the misapplied HOUSE_EDGE (inflates rather than reduces payout) and unconditional bet*0.01 floor — is completely untested. |
| `spin` | L113–L179 | 🔴 NONE | 92% | No test file found. Primary exported entry point imported by src/index.ts is entirely untested, including bet validation, wild multiplier logic, free spin handling, and jackpot detection. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Transitive coverage would require spinReel/getReelSymbols to be tested, but they are not. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 90% | No test file exists to verify weight values or their effect on symbol distribution. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists. Ordering of weights relative to SYMBOLS array is critical and untested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. Transitive coverage would require spinReel/getReelWeights to be tested, but they are not. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 95% | No test file exists. Key edge cases untested: single-item array, all-zero weights, boundary rounding (r == acc), and statistical distribution correctness. |
| `spinReel` | L43–L50 | 🔴 NONE | 95% | No test file exists. Used by src/factories.ts. Edge cases like out-of-range reelIndex (REEL_WEIGHTS[reelIndex] would be undefined) are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Consumed by spin() in src/engine.ts for core slot logic; symbol list integrity is untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file exists. Consumed by spin() in src/engine.ts; out-of-range reelIndex returns undefined silently, untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Transitive coverage via getPayMultiplier would apply, but getPayMultiplier itself has no tests. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Consumed by spin() and computeLegacyPayout() in engine.ts and legacy.ts — no evidence those callers are tested either. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `EventHandler` | L1–L1 | 🟡 WEAK | 60% | No test file exists. Type alias has no runtime behavior, but transitive coverage via SpinEventEmitter is also absent. |
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 90% | No test file found. Critical behaviors untested: on/off/emit lifecycle, multiple handlers, handler removal, emit with no listeners, and args forwarding. Used by core engine.ts spin function. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file found. Constant used as event key in engine.ts spin function but no tests verify it is emitted or consumed correctly. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 88% | No test file found. Used by the critical `spin` function in engine.ts — identity pass-through behavior is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class with no runtime behavior beyond interface contract — but the factory pattern is untested entirely. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts (full slot machine spin logic), yet zero tests verify reel count, row count handling, or that `spinReel` is called per reel index. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical path: called by spin() in engine.ts on every spin. Missing tests for zero scatters, exactly 3 scatters, mixed reels, and empty reels. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches untested: initial activation (scatters>=3, inactive), re-trigger (scatters>=3, active), decrement with remaining>1, and deactivation on remaining<=0. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 95% | No test file exists. Critical RNG utility consumed by core spin logic with no coverage of edge cases: zero-weight items, single-item arrays, negative weights, weights summing to zero, or distribution correctness under repeated draws. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game-logic function consumed by the core spin engine with no coverage of the DIAMOND counting threshold (>=4), boundary cases (exactly 3 vs 4 diamonds), empty reels, or multi-column distribution scenarios. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout (L107): `total * (1 + HOUSE_EDGE)`. | [UNIQUE] Module-local constant; no similar constant found in provided context. | [OK] Value 0.05 is correct; the bug is in how computePayout applies it, not in the constant itself. | [LEAN] Named constant for a magic number. Correct practice. | [NONE] No test file exists; transitive coverage through computePayout is moot with zero tests. | [UNDOCUMENTED] Internal constant with no JSDoc. No comment explaining its role in RTP calculation or that it inflates payouts rather than reducing them.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded `false` — the guarded block in spin (L161–163) is permanently dead code at runtime. | [UNIQUE] Module-local boolean flag; no similar constant found in provided context. | [OK] Guards a debug log branch; no correctness issues. | [LEAN] Simple boolean flag gating one console.log. No abstraction overhead. | [NONE] No test file exists; no transitive coverage through spin. | [UNDOCUMENTED] Internal flag with no JSDoc. Purpose is inferrable from name, but no comment on how to enable or what it logs.
  - EngineContainer: [USED] Instantiated at L29 to create `container`, which is used in spin. | [UNIQUE] Registry class with no similar class found in provided context. | [OK] Simple registry; resolve() returning undefined-cast-to-T is acceptable given all keys are registered at module load and no unknown key is ever passed. | [OVER] Hand-rolled IoC/DI container (register/resolve with a Map) used solely in this file to wrap three statically-imported symbols (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). None of these registrations are ever overridden or swapped; direct calls to the imports would be identical. Unnecessary indirection layer with no testability or extensibility benefit in practice. | [NONE] No test file found; class is untested directly or indirectly. | [UNDOCUMENTED] No JSDoc on the class or either method. Purpose as a service-locator DI container is non-obvious and undocumented.
  - container: [USED] Resolved in spin at L121–L123 for rng, paytable, and reels. | [UNIQUE] Module-level singleton instance; no similar variable found in provided context. | [OK] Registers known keys at module init; no correctness issues. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file; no transitive coverage. | [UNDOCUMENTED] Module-level singleton with no comment explaining it is the engine's DI registry or which keys are registered.
  - PAYLINES: [USED] Iterated in spin (L131) and used again in wild-multiplier block (L151). | [UNIQUE] Payline matrix constant; no similar definition found in provided context. | [OK] Matches the reference documentation exactly. | [LEAN] 10-element constant array of payline patterns. Natural, flat representation for this domain. | [NONE] No test file; no transitive coverage. | [UNDOCUMENTED] No JSDoc explaining what the row-index arrays represent or the geometry of each payline pattern.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced by spinReel (pickFromWeighted call) and returned by getReelSymbols, both of which are externally imported. | [UNIQUE] No similar constant found in the codebase. | [OK] Eight symbols defined in the correct order matching weightsToArray output. | [LEAN] Simple flat array of literal strings. Appropriate as the canonical symbol list. | [NONE] No test file exists. Transitive coverage would require spinReel/getReelSymbols to be tested, but they are not. | [UNDOCUMENTED] No JSDoc. Internal constant with no comment explaining its role as the master symbol registry.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times during REEL_WEIGHTS initialization (L23–L27). | [UNIQUE] No similar constant found in the codebase. | [NEEDS_FIX] DIAMOND weight 30 → P=0.25/cell. Left-to-right payline contribution: 3-match = 0.25³×0.75×50 = 0.586; 4-match = 0.25⁴×0.75×250 = 0.732; 5-match = 0.25⁵×1000 = 0.977 → total ≈ 2.295 (229.5% RTP) from DIAMOND alone, before all other symbols, WILDs, and free spins. Backward: weight ~5 → P≈0.042 → DIAMOND contribution ≈0.43%, leaving headroom for other symbols to sum toward 95%. Sanity: forward(weight 5) ≈ 0.43% ✓ formula consistent. Arbitrated intent (README.md): RTP = 95%. DIAMOND at weight 30 violates this target by more than an order of magnitude. | [ACCEPTABLE] Named fields improve readability over a bare number[], but the benefit is undermined by the ReelWeightConfig → weightsToArray indirection it necessitates. If the interface were dropped, a well-commented number[] would be simpler overall. | [NONE] No test file exists to verify weight values or their effect on symbol distribution. | [UNDOCUMENTED] No JSDoc. No comment explaining the weight values, their sum (120), or that all five reels share these defaults. (deliberated: confirmed — Confirmed with increased confidence. reels.ts:14 sets DIAMOND weight to 30 (highest of all symbols at 25% probability = 30/120). paytable.ts:11 shows DIAMOND pays [50, 250, 1000] — the highest-paying symbol in the game. Meanwhile SEVEN pays [25, 100, 500] with weight 5 (4.2%). The most valuable symbol is 6x more likely than the second-most valuable but pays 2x more. This inverts the standard risk/reward relationship and would produce an RTP far exceeding 100%, making the game unprofitable for the house. Cross-referencing all five reels use identical DEFAULT_WEIGHTS (reels.ts:23-27), amplifying the issue across every spin.)
  - weightsToArray: [USED] Called five times in REEL_WEIGHTS array initializer (L23–L27). | [UNIQUE] No similar function found per RAG results. | [OK] Maps ReelWeightConfig fields to array in the same order as SYMBOLS. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. Ordering of weights relative to SYMBOLS array is critical and untested. | [UNDOCUMENTED] Private helper, <10 lines, clear name. Tolerated per internal-helper leniency rule.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and getReelWeights (L57), both consumed externally. | [UNIQUE] No similar constant found in the codebase. | [OK] Five reels initialized from DEFAULT_WEIGHTS; root defect is in DEFAULT_WEIGHTS.DIAMOND, not here. | [ACCEPTABLE] Five-element structure anticipates per-reel weight divergence and matches the getReelWeights(reelIndex) API contract. All five reels currently share identical weights, but the 2D layout is a reasonable extension point given the documented API surface. | [NONE] No test file exists. Transitive coverage would require spinReel/getReelWeights to be tested, but they are not. | [UNDOCUMENTED] No JSDoc. Non-obvious that all five entries share identical default weights — a comment would clarify intent and extensibility.
  - pickFromWeighted: [USED] Called in spinReel (L47), which is runtime-imported by src/factories.ts. | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: same reduce-based total, same Math.random() roll, same cumulative loop with early return, same fallback to last element. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and type (Symbol vs generic T). pickFromWeighted should be replaced by a call to the more generic weightedPick. | [NEEDS_FIX] Math.random() on line 32 is a non-certifiable PRNG. Domain inferred from slot-machine vocabulary (reels, CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER, paylines, jackpot). Regulated gaming RNG must use a CSRNG — Math.random() (V8 Xorshift128+) is not accepted by gaming regulators (GLI, BMM, etc.). | [LEAN] Standard O(n) weighted-random-selection algorithm. Single responsibility, no unnecessary abstraction. | [NONE] No test file exists. Key edge cases untested: single-item array, all-zero weights, boundary rounding (r == acc), and statistical distribution correctness. | [UNDOCUMENTED] Private helper implementing weighted random selection. Tolerated per internal-helper leniency rule, though algorithm is non-trivial. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. reels.ts:30-41 is algorithmically identical to rng.ts:5-16 (same cumulative-weight loop, same fallback). However, duplication is not a correctness bug — both functions produce correct weighted-random results. pickFromWeighted is private to reels.ts, called at line 47 in spinReel, and works correctly. The duplication belongs on the duplication axis (which the automated review also flagged separately), not the correction axis. No behavioral defect exists in this function.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced in-file by getPayMultiplier (which is imported by other files) | [UNIQUE] No similar data tables found in RAG results. | [OK] All six symbol rows match the reference-doc paytable exactly (CHERRY→[2,5,25] … DIAMOND→[50,250,1000]). | [LEAN] Fixed module-level lookup table as a typed Record. No dynamic construction, no abstraction layers — just data. | [NONE] No test file exists. Transitive coverage via getPayMultiplier would apply, but getPayMultiplier itself has no tests. | [UNDOCUMENTED] Private unexported constant, so leniency applies, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and undocumented. No inline comment on the columns.

- [ ] `src/events.ts` — 2 untested, 1 weak
  Improve `src/events.test.ts` covering: EventHandler, SpinEventEmitter, SPIN_DONE
  - EventHandler: [USED] Referenced in-file by SpinEventEmitter (which is imported by other files) | [UNIQUE] No RAG data available | [OK] Simple function type alias; correct and self-consistent. | [LEAN] Minimal type alias; appropriate for typing listener callbacks. | [NONE] No test file exists. Type alias has no runtime behavior, but transitive coverage via SpinEventEmitter is also absent. | [UNDOCUMENTED] No JSDoc comment. The type alias is simple but a brief doc noting it represents a variadic event callback would be appropriate for a public-ish utility type.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit
