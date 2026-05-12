[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 68% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout math and its bug (adds edge instead of reducing it) is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false; branch it guards is dead and untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve mechanics, including unsafe cast and missing-key behavior, are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline coordinate correctness is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. WILD-lead resolution, SCATTER short-circuit, run-length threshold, and mixed WILD/symbol sequences are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 88% | No test file exists. Wild multiplier compounding logic and null-win path are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists. Exported function with inverted house-edge application and unconditional bet bonus are critical business-logic bugs with zero test coverage. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS defines the full symbol universe used by engine and reels; no coverage. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Weight values directly affect payout probabilities; no tests verify correctness. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Five reels all share DEFAULT_WEIGHTS; shape and indexing assumptions are untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 88% | No test file. Core probability logic with boundary condition (r exactly equals cumulative threshold) and fallback return path are untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file. Imported by src/factories.ts; critical path for game play. Out-of-range reelIndex (e.g. 5) would return undefined weights silently — untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file. Imported by src/engine.ts; returns internal SYMBOLS array by reference, mutation risk untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 88% | No test file. Imported by src/engine.ts; returns live REEL_WEIGHTS sub-array by reference, out-of-bounds index behavior untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant but its values drive all payout logic — zero coverage. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no tests for valid symbols (count 3/4/5), unknown symbols (returns 0), or out-of-range counts. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Critical behaviors untested: on/off/emit lifecycle, multiple listeners per event, off removing only the target handler, emit with no registered listeners, emit forwarding variadic args, and handler isolation across events. Used by src/engine.ts, making this a real coverage gap. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant string used as an event key in src/engine.ts; untested as part of any emit/on integration. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is used by `src/engine.ts` (critical path) but has zero coverage — neither happy path nor edge cases (reelCount=0, large values, spinReel integration) are tested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts with no coverage for empty reels, all-scatter grids, mixed symbols, or zero-scatter cases. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 78% | No test file exists. Used by engine.ts with no coverage for any of the four branches: initial activation (scatters>=3), re-trigger while active, normal decrement, or deactivation at remaining<=0. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot payout trigger) used by src/engine.ts has zero coverage — no happy path, boundary (exactly 4 diamonds), or negative-case tests. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 68% | No test file exists. Critical edge cases untested: zero-weight items, single-item arrays, mismatched array lengths, negative weights, all-equal weights distribution, and the fallback return on last element (floating-point rounding). Called by src/engine.ts, making this a risk in production game logic. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Internal constant used in computePayout at line 109. | [UNIQUE] Numeric constant. No similar symbols found. | [OK] Constant value 0.05 is correct; the misuse is in computePayout and flagged there. | [LEAN] Named constant for a magic number — correct practice. | [NONE] No test file exists. HOUSE_EDGE directly affects payout math and its bug (adds edge instead of reducing it) is untested. | [UNDOCUMENTED] No JSDoc. Non-obvious semantic: value is added to winning payouts rather than subtracted, inverting the typical house-edge convention.
  - DEBUG_MODE: [USED] Internal constant used in spin at line 172. | [UNIQUE] Boolean constant. No similar symbols found. | [OK] Boolean flag; no correctness issues. | [LEAN] Simple compile-time flag, minimal. | [NONE] No test file exists. Constant is always false; branch it guards is dead and untested. | [UNDOCUMENTED] No JSDoc. Private constant; tolerable, but purpose and toggle mechanism are undescribed.
  - EngineContainer: [USED] Internal class instantiated at line 29 for service container. | [UNIQUE] Service locator/registry class with register and resolve methods. No similar symbols found. | [OK] resolve silently returns undefined cast to T when a key is absent, but all three keys are registered before any resolve call, so no runtime failure in current usage. | [OVER] Hand-rolled IoC container (string-keyed registry with `register`/`resolve`) used exclusively to wrap three directly-imported module-level functions in the same file. Provides zero testability or swappability benefit because it is populated at module load time with the actual imports. The three consumers (`rng`, `paytable`, `reels`) could simply be called directly. | [NONE] No test file exists. register/resolve mechanics, including unsafe cast and missing-key behavior, are untested. | [UNDOCUMENTED] No JSDoc on the class or either method. Acts as a service-locator/DI container; that role and the type-unsafe cast in resolve() warrant at least a class-level description.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Internal constant used in spin at lines 127–128 and 161. | [UNIQUE] Constant array defining payline patterns. No similar symbols found. | [OK] All row indices are within the valid range [0, 2] for a 3-row grid. | [LEAN] Standard slot payline configuration data; appropriate representation. | [NONE] No test file exists. Payline coordinate correctness is untested. | [UNDOCUMENTED] No JSDoc. Non-obvious data: each inner array encodes row indices per reel column. Format and count (10 lines) should be documented.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Non-exported constant used locally in pickFromWeighted (L38) and spinReel (L47) | [UNIQUE] Data constant with no similar symbols found | [OK] Eight distinct symbol literals; order matches weightsToArray and pickFromWeighted iteration order. | [LEAN] Plain array of string literals. Appropriately minimal. | [NONE] No test file exists. SYMBOLS defines the full symbol universe used by engine and reels; no coverage. | [UNDOCUMENTED] No JSDoc comment. Purpose (master list of all reel symbols) is not self-evident from declaration alone.
  - DEFAULT_WEIGHTS: [USED] Non-exported constant used to initialize REEL_WEIGHTS (L24–L28) | [UNIQUE] Configuration constant with no similar symbols found | [OK] Weight values are internally consistent; no paytable is provided in this file to derive an RTP contradiction, so the DIAMOND:30 value cannot be flagged with sufficient confidence under rule 13. | [LEAN] Simple literal object. Named keys improve readability of the weight values. | [NONE] No test file. Weight values directly affect payout probabilities; no tests verify correctness. | [UNDOCUMENTED] No JSDoc. Does not document what the numeric values represent (probabilities, relative weights, denominators), nor that these weights are shared across all 5 reels.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Non-exported constant used in spinReel (L44) and getReelWeights (L57) | [UNIQUE] Constant array initialization with no similar symbols found | [OK] Five reel weight arrays, each independently produced by weightsToArray; no aliasing or sharing issues. | [ACCEPTABLE] Five identical `weightsToArray(DEFAULT_WEIGHTS)` calls is repetitive (`Array(5).fill(...)` or a loop would be cleaner), but maintaining a per-reel weight array is a reasonable anticipation of per-reel odds, which is standard in slot machine design. | [NONE] No test file. Five reels all share DEFAULT_WEIGHTS; shape and indexing assumptions are untested. | [UNDOCUMENTED] No JSDoc. Does not document that all 5 reels share identical weights or that index corresponds to reel position.
  - pickFromWeighted: [USED] Non-exported function called in spinReel (L47) for weighted random selection | [DUPLICATE] Identical weighted selection algorithm with variable renaming; weightedPick is generic version | [NEEDS_FIX] Math.random() is not a certifiable RNG for regulated slot-machine gaming; the domain is unambiguous (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER symbols, spinReel, paytable weights). Industry rule: certified gaming RNG must be a vetted CSPRNG, not V8's xorshift128+-based Math.random(). | [LEAN] Textbook weighted-random selection. Generic enough to be reusable but not over-abstracted; the generics are appropriate (Symbol[] + number[]). | [NONE] No test file. Core probability logic with boundary condition (r exactly equals cumulative threshold) and fallback return path are untested. | [UNDOCUMENTED] No JSDoc. Core weighted-random selection logic with no documentation of parameters, algorithm, or the assumption that items.length === wts.length. (deliberated: reclassified: correction: NEEDS_FIX → OK — The NEEDS_FIX claim rests entirely on Math.random() being non-certifiable for regulated gambling (reels.ts:32). Verified the algorithm at reels.ts:30-41: it correctly computes cumulative weights, generates a uniform draw, iterates and returns the matching item with a valid fallback at L40. Math.random() produces correct random numbers — the certification concern is a security/compliance issue, not a correctness defect. The function is algorithmically correct. Duplication with rng.ts:weightedPick is confirmed (100% identical logic) but that's the duplication axis, not correction.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Internal constant referenced in getPayMultiplier at line 17. | [UNIQUE] Lookup table; no similar structures found | [OK] Static data table; indices [0,1,2] map to 3-match, 4-match, 5-match multipliers respectively, consistent with getPayMultiplier usage. | [LEAN] Flat lookup table mapping symbol names to fixed-length tuples. No unnecessary abstraction. | [NONE] No test file exists. Private constant but its values drive all payout logic — zero coverage. | [UNDOCUMENTED] No JSDoc comment. The tuple layout [3-match, 4-match, 5-match] multipliers is not documented; readers must infer the index semantics from getPayMultiplier.

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
