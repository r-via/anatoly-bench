[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 96% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout calculations but is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false so the debug branch is dead and untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve round-trip, missing-key behavior, and type-cast safety are all untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions (shape, row bounds) are untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 85% | No test file exists. WILD-lead resolution, SCATTER early-return, run-length cutoff at <3, and all-WILD cases are untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 88% | No test file exists. Wild-count multiplier formula, null propagation from checkLine, and payout arithmetic are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 90% | No test file exists. House-edge application (note: comment says ~95% RTP but code adds HOUSE_EDGE making payout larger, not smaller), base-bet bonus, Math.ceil rounding, and empty-wins case are all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS array contents (8 slot symbols) are never verified. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Weight values (sum=120, individual distributions) are untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Five-reel structure and per-reel weight arrays are untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 62% | No test file. Critical weighted-random logic—boundary conditions (r exactly at boundary, last-item fallback, zero-weight items) and distribution correctness are entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 96% | No test file. Imported by src/factories.ts; returns 3-symbol column per reel. Output length, valid symbol membership, and invalid reelIndex behavior are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 85% | No test file. Imported by src/engine.ts; returned array identity and contents are untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 90% | No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently—untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private table backing getPayMultiplier; untested indirectly as well. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file. Imported by src/engine.ts and src/legacy.ts — a critical pay calculation path — with zero coverage. Missing: valid symbol/count combos (3/4/5), unknown symbol returning 0, count <3 returning 0. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 78% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, making untested pass-through behavior a gap in engine coverage. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant imported by src/engine.ts as an event key; no tests verify its value or usage contract. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 85% | No test file found. `buildReels` is called by `src/engine.ts` (a critical path), but neither happy path nor edge cases (reelCount=0, rowCount variations, spinReel output shape) are covered. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Missing coverage for: empty reels, no scatters, single scatter, multiple scatters across columns, and scatters within a single column. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 72% | No test file exists. Missing coverage for: initial activation (scatters>=3), retrigger during active state, decrement logic, boundary condition (remaining reaches 0), and inactive state with scatters<3. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, fewer than 4 diamonds). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical gaming RNG logic with zero coverage: uniform distribution correctness, boundary behavior (roll == cumulative), zero/negative weights, mismatched array lengths, single-item input, and fallback to last element all untested. Called by src/engine.ts, making this a high-impact gap. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used in computePayout on line 107 | [UNIQUE] Numeric constant with no similar constants found. | [OK] Constant value 0.05 is numerically correct; the defect is in its application inside computePayout, not in the constant itself. | [LEAN] Named constant for a domain value. Minimal and appropriate. | [NONE] No test file exists. HOUSE_EDGE directly affects payout calculations but is untested. | [UNDOCUMENTED] No JSDoc. Non-obvious semantics: the implementation adds 5% to winning payouts rather than reducing them, which contradicts the conventional house-edge direction — worth documenting.
  - DEBUG_MODE: [USED] Used in spin function on line 172 for conditional logging | [UNIQUE] Boolean constant with no semantic duplicates in codebase. | [OK] Boolean flag constant; no logic. | [LEAN] Simple boolean flag; dead code (always false) but not overengineering. | [NONE] No test file exists. Constant is always false so the debug branch is dead and untested. | [UNDOCUMENTED] No JSDoc. Internal flag; name is clear enough that omission is tolerable, but no comment explains how to enable or what it logs.
  - EngineContainer: [USED] Instantiated on line 29 to create container object | [UNIQUE] Container class with simple service locator pattern — no duplicates detected. | [OK] resolve() silently casts undefined to T for missing keys, but all three registered keys are consumed before any missing-key scenario arises. | [OVER] Hand-rolled DI container (Map + stringly-typed register/resolve with unsafe cast) used exclusively to re-expose three already-imported module functions. All three registered values are resolvable directly via their imports and consumed in a single call site (spin). No test doubles, no swappable implementations, no multi-consumer scenario — zero benefit from the indirection layer. | [NONE] No test file exists. register/resolve round-trip, missing-key behavior, and type-cast safety are all untested. | [UNDOCUMENTED] No JSDoc on the class or its methods. Implements a service-locator / manual DI container pattern that is non-obvious from the name alone.
  - container: [USED] Used throughout file: registered on lines 30-32, resolved on lines 118-120 | [UNIQUE] Instance variable initialized with EngineContainer — unique instantiation. | [OK] All three keys registered at module load before any resolve() call. | [LEAN] Straightforward instantiation; the over-engineering is in EngineContainer's definition, not this usage. | [NONE] No test file exists. Module-level singleton wiring is untested. | [UNDOCUMENTED] No JSDoc. Module-level singleton wiring three core dependencies; its role in the spin pipeline is undescribed.
  - PAYLINES: [USED] Used in spin function: length accessed on line 127, indexed on lines 128 and 153 | [UNIQUE] Payline pattern array with no duplicates in codebase. | [OK] Matches the documented 10-payline configuration exactly. | [LEAN] Ten payline definitions as a plain 2D array. Matches the documented configuration schema exactly. | [NONE] No test file exists. Payline definitions (shape, row bounds) are untested. | [UNDOCUMENTED] No JSDoc explaining the row-index encoding, payline count, or ordering. The data is non-trivial to interpret without context.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced on line 47 in pickFromWeighted call and returned on line 53 by getReelSymbols | [UNIQUE] Symbol array constant. No similar constants found. | [OK] Eight symbols defined; order matches weightsToArray output order. | [LEAN] Simple constant array of symbol names. No abstraction. | [NONE] No test file exists. SYMBOLS array contents (8 slot symbols) are never verified. | [UNDOCUMENTED] No JSDoc comment. Purpose (master symbol list used for reel picks) is not obvious from declaration alone.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray 5 times in REEL_WEIGHTS initialization (lines 24-28) | [UNIQUE] Weight configuration constant. No similar constants found. | [OK] Weights sum to 120, matching documented totals. | [ACCEPTABLE] Named object for weights is reasonable for readability and documentation. The internal docs confirm this is the intended configuration surface. | [NONE] No test file. Weight values (sum=120, individual distributions) are untested. | [UNDOCUMENTED] No JSDoc. Missing explanation that weights are relative (not percentages), what the total is, or that all five reels share this config.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Indexed in spinReel (line 46) and returned by getReelWeights (line 58) | [UNIQUE] Array of weight distributions for five reels. No similar constants found. | [OK] Five reels, each initialized correctly from DEFAULT_WEIGHTS. | [OVER] Five identical calls to weightsToArray(DEFAULT_WEIGHTS) stored in a 2D array. Since all reels share the same weights (confirmed by internal docs), this could be a single weights array reused directly. The per-reel structure implies per-reel configurability that is never used. | [NONE] No test file. Five-reel structure and per-reel weight arrays are untested. | [UNDOCUMENTED] No JSDoc. Implicit assumption that all five reels are identical and index corresponds to reel position is undocumented.
  - pickFromWeighted: [USED] Called in spinReel loop (line 47) to select weighted random symbols | [DUPLICATE] Weighted random selection via cumulative accumulation. Implementation is 95% identical to weightedPick in rng.ts. | [NEEDS_FIX] Math.random() is non-certifiable RNG for a regulated slot-machine domain. | [LEAN] Standard weighted random selection. Minimal, correct, and not reimplementing anything from a listed dependency. | [NONE] No test file. Critical weighted-random logic—boundary conditions (r exactly at boundary, last-item fallback, zero-weight items) and distribution correctness are entirely untested. | [UNDOCUMENTED] No JSDoc. Core weighted-random-selection algorithm; missing description of parameters, return value, and behaviour when weights sum to zero. (deliberated: confirmed — Confirmed: pickFromWeighted (reels.ts:30-41) is algorithmically identical to weightedPick (rng.ts:5-16). Both use Math.random(). The Math.random() concern is valid for a gaming engine but is project-wide — rng.ts:7 also uses Math.random(), so replacing pickFromWeighted with weightedPick wouldn't fix the RNG issue. The duplication itself is real and creates a DI bypass (engine.ts:120 resolves weightedPick but spinReel uses pickFromWeighted instead). Confidence stays low because the correction is about Math.random() suitability, which is systemic, not specific to this function.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant referenced in getPayMultiplier (line 15). Provides core pay data. | [UNIQUE] Configuration lookup table, no similar structures in RAG results | [OK] All six symbol rows match the documented [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] multiplier table exactly. | [LEAN] Flat Record mapping symbols to fixed-length tuples — minimal, appropriate data structure for a static paytable. | [NONE] No test file exists. Private table backing getPayMultiplier; untested indirectly as well. | [UNDOCUMENTED] No JSDoc comment. The tuple structure [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] and the unit (multiplier applied to lineBet) are not explained.

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
