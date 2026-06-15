[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout math and is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false, but its conditional branch is untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior and type-unsafe cast are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton registration is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive win evaluation and are untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 92% | No test file exists. WILD leading, SCATTER short-circuit, run length threshold (>=3), and mixed-WILD sequences are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 91% | No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null-result path are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 80% | No test file exists. House-edge application (only when total>0), flat +1% bet bonus, and Math.ceil rounding are untested. Note: comment claims 95% RTP but HOUSE_EDGE inflates wins, which is the opposite of a house edge. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Constant defines the full symbol set used by engine and reels — no coverage. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists. Weight values directly affect game odds — correctness and sum are untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists. Ordering of array elements is critical for correct symbol-to-weight mapping; untested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. Five-reel weight matrix drives all spin probabilities; untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file exists. Core probability logic — boundary conditions (r == acc), single-item lists, zero-weight items, and statistical distribution are all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 75% | No test file exists. Imported by src/factories.ts; always returns 3-symbol column, out-of-bounds reelIndex, and distribution correctness are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file exists. Imported by src/engine.ts; identity and immutability of returned array untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 72% | No test file exists. Imported by src/engine.ts; valid and invalid reelIndex handling untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal constant driving all payout logic; no tests validate the payout values for any symbol. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by engine.ts and legacy.ts — critical payout path. Missing tests for all count branches (3/4/5), unknown symbol returning 0, and count < 3 returning 0. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, making untested pass-through behavior a coverage gap in a critical path. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Critical paths untested: on/off/emit interactions, multiple listeners, handler removal idempotency, emit with no listeners, argument forwarding, and duplicate handler registration. Used by src/engine.ts making this a meaningful gap. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant string used as an event key in src/engine.ts; no tests verify its value or usage contract. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is used by `src/engine.ts` (a critical path), yet no tests verify reel count, row count handling, or `spinReel` integration behavior. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Used by engine.ts; no coverage for empty reels, single scatter, exactly 3 scatters, or non-scatter symbols. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. Used by engine.ts; all branches untested: initial activation (scatters>=3), retrigger, decrement, deactivation on remaining<=0. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, fewer than 4 diamonds). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 90% | No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item arrays, weight boundary conditions (roll == cumulative). Called by src/engine.ts, making coverage gaps production-relevant. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Non-exported constant used in computePayout at line 109 | [UNIQUE] Numeric constant, no duplicates found | [OK] Constant value 0.05 is correct; the defect is in how computePayout applies it. | [LEAN] Named numeric constant. Appropriate extraction. | [NONE] No test file exists. HOUSE_EDGE directly affects payout math and is untested. | [UNDOCUMENTED] No JSDoc. Internal constant with no explanation of how it is applied or its relationship to RTP.
  - DEBUG_MODE: [USED] Non-exported constant used in conditional at line 171 in spin | [UNIQUE] Boolean constant, no duplicates found | [OK] Boolean flag, no correctness issue. | [LEAN] Single boolean flag; dead (false) but trivial. | [NONE] No test file exists. Constant is always false, but its conditional branch is untested. | [UNDOCUMENTED] No JSDoc. Internal flag with no description of what debug output it enables.
  - EngineContainer: [USED] Non-exported class instantiated at line 29 | [UNIQUE] Service locator class with register/resolve methods | [OK] resolve() returns undefined cast to T for unregistered keys, but all three keys are registered at module load before any spin() call, so no runtime fault occurs. | [OVER] String-keyed IoC container (Map<string, unknown> + register/resolve with unsafe `as T` cast) for exactly 3 values that are already statically imported at the top of the file. Zero polymorphism, zero late-binding, zero testability gain — pure indirection that erases types and hides the actual dependencies. | [NONE] No test file exists. register/resolve behavior and type-unsafe cast are untested. | [UNDOCUMENTED] No JSDoc on class or its methods. Purpose as a service-locator/DI container is not explained.
  - container: [USED] Non-exported module-level variable registered and resolved throughout spin function | [UNIQUE] Singleton instance, no duplicates found | [OK] All keys registered synchronously before spin() can be called. | [LEAN] Module-level instantiation of EngineContainer. Overengineering lives in the class definition; the variable itself is a trivial assignment. | [NONE] No test file exists. Module-level singleton registration is untested. | [UNDOCUMENTED] No JSDoc. Module-level singleton with no description of registered services or lifetime.
  - PAYLINES: [USED] Non-exported constant used in evaluateLine loop (line 128) and line symbol retrieval (line 161) | [UNIQUE] 2D array defining payline patterns | [OK] All ten payline arrays match the documented table exactly (middle, top, bottom, V-down, V-up, curve-down, curve-up, wave-1, wave-2, zigzag). | [LEAN] Plain data declaration for 10 paylines. No abstraction; matches the documented payline table exactly. | [NONE] No test file exists. Payline definitions drive win evaluation and are untested. | [UNDOCUMENTED] No JSDoc. Row-index layout for ten paylines is non-obvious and warrants shape/pattern descriptions.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted call (L40) and returned by getReelSymbols (L54) | [UNIQUE] Array constant with slot symbol names. No similar symbol arrays found. | [OK] Array matches the 8-symbol set used throughout the codebase; order is consistent with weightsToArray and ReelWeightConfig. | [LEAN] Simple constant array of 8 symbol names. No abstraction needed. | [NONE] No test file exists. Constant defines the full symbol set used by engine and reels — no coverage. | [UNDOCUMENTED] No JSDoc. Not exported; internal module constant. Name is clear but tolerated at lower confidence.
  - DEFAULT_WEIGHTS: [USED] Referenced 5 times in weightsToArray calls to initialize REEL_WEIGHTS (L23-L27) | [UNIQUE] Configuration constant initializing default weight values. No similar constants found. | [OK] Weights sum to 120 and per-symbol values match the reference documentation table exactly. | [LEAN] Plain object literal satisfying ReelWeightConfig. Minimal and appropriate. | [NONE] No test file exists. Weight values directly affect game odds — correctness and sum are untested. | [UNDOCUMENTED] No JSDoc. Not exported. Name implies defaults, but nothing documents what these numeric values represent (relative probabilities) or their total (120).
  - weightsToArray: [USED] Called 5 times to populate REEL_WEIGHTS array (L23-L27) | [UNIQUE] Utility converting ReelWeightConfig object to number array. No similar functions found. | [OK] Emission order matches SYMBOLS array (CHERRY→LEMON→BELL→BAR→SEVEN→DIAMOND→WILD→SCATTER); no ordering mismatch. | [ACCEPTABLE] Exists solely to bridge ReelWeightConfig to number[]; would be unnecessary if weights were stored as Record<Symbol, number> and derived via SYMBOLS.map(). Mild coupling — must stay in sync with SYMBOLS order manually — but it's a short, single-purpose function justified by the documented config shape. | [NONE] No test file exists. Ordering of array elements is critical for correct symbol-to-weight mapping; untested. | [UNDOCUMENTED] Internal helper, <10 lines, not exported. Name is clear; leniency applied per private-helper rule.
  - REEL_WEIGHTS: [USED] Referenced in spinReel (L44) and getReelWeights (L57) | [UNIQUE] 2D array initializing weights for 5 reels. No duplicate weight arrays found. | [OK] Five reels each using DEFAULT_WEIGHTS, consistent with reference docs. | [LEAN] Five explicit weightsToArray calls create five independent arrays (not aliased references), which is the correct safe choice. Verbosity clearly communicates the 5-reel structure. | [NONE] No test file exists. Five-reel weight matrix drives all spin probabilities; untested. | [UNDOCUMENTED] No JSDoc. Not exported. Nothing documents that all five reels share identical weights or that the outer array is indexed by reel position 0–4.
  - pickFromWeighted: [USED] Called in spinReel loop (L40) to select symbols | [DUPLICATE] Weighted random selection via cumulative probability accumulation. Code logic is identical to weightedPick in src/rng.ts; differs only in type specificity (Symbol vs generic T) and variable naming. | [NEEDS_FIX] Uses Math.random() — not certifiable for regulated gaming RNG. Cumulative-weight algorithm is otherwise correct. | [LEAN] Standard cumulative-weight sampling loop. Correct algorithm, minimal implementation. | [NONE] No test file exists. Core probability logic — boundary conditions (r == acc), single-item lists, zero-weight items, and statistical distribution are all untested. | [UNDOCUMENTED] Not exported, internal. Cumulative-weight sampling algorithm has no description. Slightly over 10 lines but still an internal helper; leniency applied.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported symbol used locally in getPayMultiplier (line 15) | [UNIQUE] Data structure with payoff mappings, no similar structures in RAG results | [OK] All six symbol tuples [3-match, 4-match, 5-match] match the authoritative pay table in documentation exactly. | [LEAN] Flat record mapping symbols to fixed tuples. Minimal and direct for a static pay table. | [NONE] No test file exists. Internal constant driving all payout logic; no tests validate the payout values for any symbol. | [UNDOCUMENTED] No JSDoc comment. The tuple semantics [3-match, 4-match, 5-match] and the unit (multiplier applied to lineBet) are non-obvious and undocumented.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/events.ts` — 2 untested
  Improve `src/events.test.ts` covering: SpinEventEmitter, SPIN_DONE

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick
