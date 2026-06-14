[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/reels.ts` | 🔴 CRITICAL | 8 | 92% | [details](#srcreelsts) |
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 92% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 90% | No test file exists. Critical probabilistic logic — boundary conditions (r exactly at accumulator boundary, zero-weight entries, single-item list) and the fallback return are all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 92% | No test file exists. Imported by src/factories.ts; always returns 3 symbols per call — column length, valid symbol membership, and out-of-range reelIndex behavior are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 75% | No test file exists. Imported by src/engine.ts; returns mutable reference to SYMBOLS — aliasing risk untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 90% | No test file exists. Imported by src/engine.ts; out-of-range reelIndex returns undefined silently — untested. |

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. Constant directly affects computePayout RTP logic but is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false; branch it guards is dead and untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior, type-erasure, and missing-key handling are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton with three registered dependencies; wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Ten payline definitions that drive all win detection are untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 60% | No test file exists. WILD substitution logic, SCATTER early-return, run-length threshold (>=3), and all-WILD edge case are untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 75% | No test file exists. Wild-count multiplier formula, null propagation from checkLine, and payout arithmetic are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal constant, but its values are exercised indirectly through getPayMultiplier — which is also untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No tests found. Used by engine.ts and legacy.ts in critical payout paths. Untested edge cases include unknown symbol (returns 0), count < 3 (returns 0), count === 3/4/5 for each symbol, and count > 5 (returns 0). |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts but adjustPayout (identity function) is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 88% | No test file found. Core event emitter used by src/engine.ts — on(), off(), emit(), and multi-listener scenarios are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file found. Constant used by src/engine.ts; no tests verify its value or usage contract. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 55% | No test file exists. `buildReels` is used by `src/engine.ts` (critical path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, rowCount ignored behavior). |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts — no coverage of empty reels, single scatter, exactly 3 scatters, or multi-reel layouts. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Critical state machine with 3 branches (activation, retrigger, decrement/deactivation) and boundary condition at remaining<=0 — all untested. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. No coverage for happy path (≥4 diamonds), edge cases (exactly 4, fewer than 4, empty reels, single reel), or integration with engine.ts call site. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 90% | No test file found. No tests for happy path, edge cases (empty arrays, mismatched lengths, zero weights, single item), or statistical distribution correctness. |

## 🧪 Test Improvements

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Non-exported constant used locally in spinReel (L47) passed to pickFromWeighted | [UNIQUE] Symbol array constant. No similar definitions found in RAG results. | [OK] 8-element array order matches ReelWeightConfig fields and weightsToArray output; no issues. | [LEAN] Simple constant array of 8 symbol strings. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported; self-explanatory name, but no comment clarifying its role as the canonical symbol registry for all reels.
  - DEFAULT_WEIGHTS: [USED] Non-exported constant used in REEL_WEIGHTS initialization (L23–27) called 5 times | [UNIQUE] Configuration object for default reel weights. No similar constants in RAG results. | [OK] Weights sum to 120; matches documented distribution exactly. | [ACCEPTABLE] Structured object makes per-symbol weights readable and self-documenting. Minor complexity cost is justified by clarity. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Raw numeric weights have no explanation of their scale, how they sum, or how to interpret probability from them.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Non-exported constant used in spinReel (L44) and exported getReelWeights (L57) | [UNIQUE] 2D array of reel weights initialized via weightsToArray. No duplicates found. | [OK] Five reels each initialized with DEFAULT_WEIGHTS; matches documented configuration. | [OVER] Five identical calls to weightsToArray(DEFAULT_WEIGHTS) produce five equal arrays. A single Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or just referencing one shared array would be cleaner. More fundamentally, the per-reel array structure exists to support differentiated weights, but all reels are identical, so the structure is premature generalization. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The 5-reel structure and the implicit 0-based index contract are not explained.
  - pickFromWeighted: [USED] Non-exported function called in spinReel (L47) to randomly select reel symbols | [DUPLICATE] Weighted random selection via cumulative sum and binary search. Identical algorithm and logic to weightedPick despite variable name differences (total→totalWeight, r→roll, acc→cumulative). | [NEEDS_FIX] Math.random() is not certifiable for regulated gaming RNG. | [LEAN] Standard weighted random selection — minimal, correct, no unnecessary abstraction. | [NONE] No test file exists. Critical probabilistic logic — boundary conditions (r exactly at accumulator boundary, zero-weight entries, single-item list) and the fallback return are all untested. | [UNDOCUMENTED] Not exported, but longer than 10 lines and implements a non-trivial weighted RNG algorithm. No JSDoc on parameters or the fallback-to-last-element behavior. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 is algorithmically correct: cumulative-weight selection with proper fallback at L40. The NEEDS_FIX was driven by duplication with weightedPick (rng.ts:5-16), but duplication belongs on the duplication axis, not correction. Both functions use Math.random() — that's a project-wide design choice, not a bug unique to this function. No actual incorrect behavior or crash path exists with current callers (spinReel at L47 always passes valid SYMBOLS and weights arrays).)

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout at line 105 | [UNIQUE] Numeric constant, no similar patterns found | [OK] Value 0.05 correctly represents 5%; the defect is in how it is applied inside computePayout, not the constant itself. | [LEAN] Named constant for a magic number. Correct practice. | [NONE] No test file exists. Constant directly affects computePayout RTP logic but is never tested. | [UNDOCUMENTED] No JSDoc. Private constant; name conveys intent, but the 0.05 value and its effect on RTP are not described.
  - DEBUG_MODE: [USED] Referenced in spin at line 159 | [UNIQUE] Boolean constant, no similar patterns found | [OK] Constant false; no correctness issue. | [LEAN] Hardcoded false, but a named flag for conditional debug output is standard and costs nothing. | [NONE] No test file exists. Constant is always false; branch it guards is dead and untested. | [UNDOCUMENTED] No JSDoc. Private, self-descriptive boolean flag; no documentation needed beyond what the name provides.
  - EngineContainer: [USED] Instantiated at line 29 for dependency injection | [UNIQUE] Service locator pattern class, no similar patterns found | [OK] resolve() silently casts undefined to T for unknown keys, but all three keys are registered at module load before any call to resolve(). | [OVER] DIY service-locator for 3 function references already available as direct imports. `resolve<T>` silently casts to `T`, discarding type safety. `spin` bypasses the container entirely for factory/strategy/emitter. Net effect: indirection with no benefit. | [NONE] No test file exists. register/resolve behavior, type-erasure, and missing-key handling are untested. | [UNDOCUMENTED] No JSDoc on class, register, or resolve. Acts as a simple service-locator DI container; purpose and usage not documented.
  - container: [USED] Used to resolve dependencies in spin at lines 120-122 | [UNIQUE] Instance variable, no similar patterns found | [OK] All three keys registered immediately after instantiation; no correctness issue. | [LEAN] Straightforward instantiation and population of EngineContainer; overengineering is in the class definition, not here. | [NONE] No test file exists. Module-level singleton with three registered dependencies; wiring is untested. | [UNDOCUMENTED] No JSDoc. Module-level singleton container wiring; no description of what it registers or why.
  - PAYLINES: [USED] Used in payline evaluation loop at lines 133-134 and wildMultiplier calculation at line 149 | [UNIQUE] Slot machine paylines data constant, no similar patterns found | [OK] Matches reference docs exactly (10 paylines, identical order and values). | [LEAN] Static data table for 10 fixed paylines. Matches spec exactly. | [NONE] No test file exists. Ten payline definitions that drive all win detection are untested. | [UNDOCUMENTED] No JSDoc. The 10 payline patterns are non-obvious (zigzag, V-shapes, diagonals); each row-index meaning is undocumented.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported internal constant. Referenced in getPayMultiplier (line 15). | [UNIQUE] Lookup table mapping symbols to payout arrays. No similar structures found in RAG results. | [NEEDS_FIX] DIAMOND multipliers [50, 250, 1000] with documented DIAMOND reel weight 30/120 produce an implied RTP far above the arbitrated 95% target. Forward derivation (no-wild runs only, RTP = E[multiplier per payline]): 3-of-a-kind: (30/120)^3 × (85/120) × 50 = 0.01107 × 50 = 0.554; 4-of-a-kind: (30/120)^4 × (85/120) × 250 = 0.00277 × 250 = 0.692; 5-of-a-kind: (30/120)^5 × 1000 = 0.000977 × 1000 = 0.977; DIAMOND no-wild subtotal = 2.223. Wild-boosted DIAMOND 5-of-a-kind adds ≈3.26 (1-wild) + ≈3.25 (2-wild) + more, pushing total DIAMOND contribution alone above 9×. Adding CHERRY, LEMON, BELL, BAR, SEVEN yields total RTP >> 200%. Backward derivation: for DIAMOND to consume a reasonable share of the 0.95 budget, reel weight must be ≈2–3, not 30. Sanity check: forward(w=2) ≈ (2/120)^3 × (113/120) × 50 + … ≈ 0.007 (plausible single-symbol share of 0.95) ✓; forward(w=30) = 2.223 ≫ 0.95 ✓ — formula self-consistent, finding is sound. | [LEAN] Flat lookup table mapping symbols to a fixed 3-tuple. Minimal and correct for a static paytable. | [NONE] No test file exists. Internal constant, but its values are exercised indirectly through getPayMultiplier — which is also untested. | [UNDOCUMENTED] No JSDoc. Tuple index semantics (index 0 = 3-of-a-kind, 1 = 4-of-a-kind, 2 = 5-of-a-kind) are implicit and undocumented. Private constant, so severity is lower, but the column mapping is non-obvious.

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
