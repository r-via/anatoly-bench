[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. |
| `checkLine` | L47–L64 | 🔴 NONE | 60% | No test file exists. Critical edge cases untested: WILD-only runs, SCATTER early-exit, runs of exactly 2 (boundary), mixed WILD leading. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 72% | No test file exists. Wild multiplier compounding logic (exponential boost) is entirely untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file exists. Comment claims RTP ~95% but code applies HOUSE_EDGE as a boost (multiplies total by 1.05), inverting the intended house-edge direction — untested and unverified. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file exists. This is the most critical untested symbol: weighted random selection with boundary behavior (r < acc edge, fallback return) and Math.random dependency are all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 85% | No test file exists. Imported by src/factories.ts, making this a critical untested export path. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 82% | No test file exists. Imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 88% | No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex behavior (undefined return) is also untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists for this module. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Function is imported by engine.ts and legacy.ts — critical path with no coverage for valid symbols, unknown symbols, or count boundary values (2, 3, 4, 5, 6). |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 80% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts but adjustPayout (identity return) has no coverage. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 85% | No test file exists. `on`, `off`, and `emit` are untested — including edge cases like emitting with no listeners, removing a non-registered handler, multiple handlers for the same event, and handler argument forwarding. Used by `src/engine.ts`, making coverage gaps impactful. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is used as an event name in `src/engine.ts` but its integration with `SpinEventEmitter.emit`/`on` is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is imported by `src/engine.ts` (critical path) but has zero test coverage — happy path, edge cases (reelCount=0, reelCount=1), and `spinReel` integration are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Function is used by engine.ts but has zero test coverage for scatter counting logic, empty reels, or multi-column inputs. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Critical state-mutation function with 4 branches (activation, retrigger, decrement, deactivation) used by engine.ts — all branches untested. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 93% | No test file exists. Critical edge cases untested: mismatched array lengths, zero-weight items, single-item input, floating-point boundary where roll equals cumulative weight, and empty arrays. Called by src/engine.ts, meaning untested RNG behavior affects core game logic. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Function has clear edge cases to cover: exactly 4 diamonds (boundary), fewer than 4, more than 4, empty reels, diamonds spread across columns vs. concentrated. Used by src/engine.ts, making untested coverage a real risk. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used in computePayout function at line 107 | [UNIQUE] Constant numeric value. No duplicates found. | [OK] Value 0.05 is correct; the defect is in how computePayout applies it. | [LEAN] Named magic constant, appropriate. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Purpose and RTP impact are not documented at the declaration site.
  - DEBUG_MODE: [USED] Used in spin function at line 171 | [UNIQUE] Constant boolean flag. No duplicates found. | [OK] Correctly gates debug logging. | [LEAN] Simple boolean flag; guarded block at L170 is trivially dead code but that is a correctness concern, not an overengineering one. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Internal flag with no explanation of what debug output is produced.
  - EngineContainer: [USED] Instantiated to create container variable at line 29 | [UNIQUE] Service locator container with register/resolve methods. No duplicates found. | [OK] resolve() silently returns undefined for unknown keys, but all registered keys are always present in this file. | [OVER] Hand-rolled service-locator with stringly-typed `register`/`resolve` and `Map<string, unknown>` casts — all to wrap three static module imports that never change at runtime. Direct imports would be zero-overhead and fully typed. The pattern adds indirection, erases types at the boundary, and provides no benefit a real DI framework would justify (no lifecycle, no scoping, no testing swap-out). | [NONE] No test file exists. | [UNDOCUMENTED] Internal DI container class, not exported, but its purpose and lifecycle are undocumented. Neither the class nor its methods carry JSDoc.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Iterated in spin function at lines 117-118 and accessed at line 163 | [UNIQUE] Constant payline configuration array. No duplicates found. | [OK] Matches the reference documentation exactly. | [LEAN] Static data table exactly matching the documented 10-payline spec. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. The coordinate encoding (row-index per column) and payline shapes are not explained at the declaration.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Non-exported internal symbol, referenced at line 37 in pickFromWeighted call within spinReel | [UNIQUE] Constant array of symbol names, no semantic duplicates found | [OK] Eight symbols in correct order matching ReelWeightConfig and weightsToArray. | [LEAN] Simple constant array of 8 symbol names. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported; self-descriptive name and content make purpose clear, but no comment explains the ordering significance or that this array is the canonical symbol registry.
  - DEFAULT_WEIGHTS: [USED] Non-exported constant used in REEL_WEIGHTS initialization (lines 23-28, called 5 times) | [UNIQUE] Constant weight configuration object, no semantic duplicates found | [OK] Sum = 120; values match documented distribution exactly. | [ACCEPTABLE] Object literal is slightly verbose due to ReelWeightConfig, but readable as a named weight map. Complexity is mild and justified by legibility. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported. Name implies purpose, but no comment explains the weight sum (120), probability implications, or that all five reels share this distribution.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Non-exported constant accessed in spinReel (line 44) and getReelWeights (line 57) | [UNIQUE] Constant array initialization, no duplicates found | [OK] Five reels, each initialised with weightsToArray(DEFAULT_WEIGHTS); matches documented configuration. | [OVER] Five identical weightsToArray(DEFAULT_WEIGHTS) calls. Since all reels share the same weights, Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or a single shared array would be cleaner and make the identity explicit. The repetition obscures intent. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported. No comment explains that all five reels are intentionally identical or that this array is indexed by reel number (0–4).
  - pickFromWeighted: [USED] Non-exported utility function called in spinReel (line 37) | [DUPLICATE] Identical weighted selection algorithm to weightedPick — both accumulate weights and return item at matching random position | [NEEDS_FIX] Math.random() is not a certifiable RNG for regulated gambling software. | [LEAN] Standard weighted random selection — minimal, correct, no unnecessary abstraction. | [NONE] No test file exists. This is the most critical untested symbol: weighted random selection with boundary behavior (r < acc edge, fallback return) and Math.random dependency are all untested. | [UNDOCUMENTED] Internal helper with non-trivial weighted-random algorithm. Name conveys intent, but no JSDoc on parameters, return value, or edge-case behavior (fallback to last item on floating-point rounding). (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified reels.ts:30-41 — the function is algorithmically correct. It performs cumulative-weight selection identically to weightedPick (rng.ts:5-16), but duplication is not a correctness defect. pickFromWeighted is actively used at reels.ts:47 via spinReel → factories.ts:12 → engine.ts:128. No bug, no crash, no data loss. The NEEDS_FIX classification conflates the duplication axis with the correction axis. Both implementations produce identical results; replacing one with the other would cause zero behavioral change.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Internal constant used by getPayMultiplier on line 15 | [UNIQUE] Constant mapping structure with no similar definitions found | [OK] All six symbol rows match the reference-doc paytable exactly (3/4/5-of-a-kind multipliers). | [LEAN] Flat record mapping symbols to fixed tuple — minimal and appropriate for a static paytable. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Private constant, so leniency applies, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and nowhere stated. A one-line comment would suffice.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/events.ts` — 2 untested
  Improve `src/events.test.ts` covering: SpinEventEmitter, SPIN_DONE

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit
