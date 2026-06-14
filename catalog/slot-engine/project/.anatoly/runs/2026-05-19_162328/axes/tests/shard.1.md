[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 9 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 88% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 82% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. |
| `checkLine` | L47–L64 | 🔴 NONE | 85% | No test file exists. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 90% | No test file exists. |
| `computePayout` | L101–L111 | 🔴 NONE | 92% | Auto-resolved: JSDoc block found before symbol (deliberated: confirmed — Confirmed. src/engine.ts:105 applies `total * (1 + HOUSE_EDGE)` (= ×1.05), increasing payouts by 5%. The JSDoc at lines 97-100 says 'Applies the house edge to maintain a target RTP of approximately 95%', which conventionally means a deduction (×0.95). HOUSE_EDGE constant name (line 14) reinforces the deduction interpretation. ANCIENT_RTP=0.95 in paytable.ts:3 is defined but never imported or used in any computation — no code enforces the 95% target. RAG design docs claim the markup is intentional (paytable calibrated below target), but no inline comment at line 105 documents this, no tests validate it, and the naming/JSDoc directly contradict a markup interpretation. The code either has a formula bug (should be `1 - HOUSE_EDGE`) or the JSDoc and constant name are dangerously misleading for a financial computation. Either way this is a correction-level defect.) |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file exists; critical weighted-random logic with boundary behavior (r == total edge case, weight=0 symbols) is entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 65% | No test file exists; imported by src/factories.ts making this a critical untested path. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists; imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 60% | No test file exists; imported by src/engine.ts. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists for this module. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Critical function imported by engine.ts and legacy.ts — missing coverage for valid symbols at counts 3/4/5, unknown symbols (returns 0), count < 3 (returns 0), and count > 5 (returns 0). |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 75% | No test file exists. Class has non-trivial behavior: on/off/emit interactions, multiple listeners, duplicate handler removal, emit with no listeners — all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used as an event name in engine.ts but never verified in tests. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic used by engine.ts has zero test coverage. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. State mutation logic with multiple branches (activation, retrigger, decrement, deactivation) is entirely untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 88% | Abstract base class with no test file. No tests verify the contract or subclass behavior. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file found. `buildReels` is used by `src/engine.ts` (a critical path), but no tests cover reel count, row count handling, or `spinReel` integration. The `_rowCount` parameter being ignored is a notable untested behavior. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic used by src/engine.ts has no test coverage — missing happy path (≥4 diamonds), boundary (exactly 4), negative case (<4), and edge cases (empty reels, single reel). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 82% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weights summing to zero, and boundary behavior of the final fallback return. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used locally at line 109 in computePayout function | [UNIQUE] Constant value; no duplicates found | [OK] Value 0.05 is correct; the defect is in how it is applied inside computePayout. | [LEAN] Named constant for the 5% house edge used in computePayout. Appropriate. | [NONE] No test file exists. | [UNDOCUMENTED] Private module-level constant, no JSDoc. Name implies direction but not how it is applied (markup vs. deduction) or its relationship to RTP.
  - DEBUG_MODE: [USED] Used locally at line 171 in spin function conditional | [UNIQUE] Boolean constant; no duplicates found | [OK] Boolean flag constant; no correctness issues. | [LEAN] Single boolean constant guarding a console.log. Trivial; no abstraction concern. | [NONE] No test file exists. | [UNDOCUMENTED] Private flag, self-explanatory name and trivial semantics — tolerable without JSDoc.
  - EngineContainer: [USED] Instantiated on line 29 to create container instance | [UNIQUE] Service container class with no similar implementations found | [OK] resolve silently returns undefined cast to T on a missing key, but all registered keys are present before use in this file. | [OVER] Hand-rolled IoC/DI container for exactly three items (rng, paytable, reels) that are already directly imported at the top of the file. The class adds a string-keyed, untyped Map lookup where direct references would be zero-overhead and fully type-safe. No injection ever occurs — entries are hardcoded in the module. This is a classic premature-abstraction of a dependency-injection pattern with a single, hardcoded instantiation. | [NONE] No test file exists. | [UNDOCUMENTED] Internal DI registry class with no JSDoc. Purpose and expected key/value contracts are non-obvious from names alone.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Referenced at lines 139, 140, 157 in spin and evaluateLine logic | [UNIQUE] Data constant array; no duplicates found | [OK] Ten valid 5-column paylines using row indices 0–2 for a 5×3 grid. | [LEAN] Static 10×5 payline matrix. Exactly the right representation for a fixed payline slot engine. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc explaining row-index encoding, coordinate system, or which axis is reel vs. row. Structure is not self-evident.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Local usage in spinReel function (line 46) as argument to pickFromWeighted | [UNIQUE] Constant symbol array. No similar functions found. | [OK] Eight symbols correctly defined, matching ReelWeightConfig and weightsToArray order. | [LEAN] Plain array of 8 symbol literals, no unnecessary abstraction. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant with no comment explaining its role as the master symbol registry or its ordering significance for weight arrays.
  - DEFAULT_WEIGHTS: [USED] Used in REEL_WEIGHTS initialization (lines 24–28), called 5 times | [UNIQUE] Constant initialization with no matches found. | [OK] Excluded per project instructions (previously investigated and overturned). | [LEAN] Simple constant, appropriate use of the config type. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. No comment explaining the rationale behind the chosen weight values or that total sums to 120.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Local usage in spinReel (line 44) and getReelWeights (line 57) | [UNIQUE] Constant array initialization with no matches. | [OK] Five reels each initialized with DEFAULT_WEIGHTS via weightsToArray; matches architecture spec. | [ACCEPTABLE] Five explicit identical entries is verbose, but the architecture doc confirms per-reel indexing (`REEL_WEIGHTS[i]`) and the structure is the natural extension point for diverging weights per reel. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. No comment indicating all 5 reels share identical weights or that this can be customised per-reel.
  - pickFromWeighted: [USED] Called in spinReel (line 46) for weighted random symbol selection | [DUPLICATE] Identical weighted selection algorithm to weightedPick (score 0.818). Both accumulate weights, generate random threshold, select on match, fallback to last item. | [OK] Excluded per project instructions (previously investigated and overturned). | [LEAN] Standard O(n) weighted-pick; minimal and correct. | [NONE] No test file exists; critical weighted-random logic with boundary behavior (r == total edge case, weight=0 symbols) is entirely untested. | [UNDOCUMENTED] Non-exported but implements a non-trivial weighted-random algorithm. No comment on the cumulative-distribution approach, the fallback on the last item, or the assumption that items and wts are parallel arrays of equal length.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Internal constant referenced by getPayMultiplier on line 15. | [UNIQUE] Data structure mapping symbols to payout arrays; no duplicates found | [OK] Data structure is well-formed; three-tuple entries map to 3-, 4-, and 5-match payouts. | [LEAN] Plain Record lookup table; tuple type is minimal and appropriate for 3-column paytable data. | [NONE] No test file exists for this module. | [UNDOCUMENTED] Private constant with no JSDoc. The three-element tuple has no labels; readers must infer that indices map to 3-, 4-, and 5-symbol match payouts from the implementation of getPayMultiplier.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/events.ts` — 2 untested
  Improve `src/events.test.ts` covering: SpinEventEmitter, SPIN_DONE

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick
