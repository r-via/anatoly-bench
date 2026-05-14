[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 9 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects RTP calculation in computePayout; its effect is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false; branch it guards is dead and untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 55% | No test file exists. register/resolve logic (including unsafe cast) has no coverage. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive all win evaluation; correctness is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. Critical logic for WILD substitution, SCATTER skip, run counting, and minimum-3 threshold has zero coverage. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file exists. Wild-count bonus formula (exponential multiplier) and null-return paths are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists. Exported function with house-edge application, base-bet bonus, and ceil rounding has no tests despite being a critical financial calculation. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS drives all reel outcomes; no coverage of its contents or ordering. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 85% | No test file. Weight values directly affect payout math; sum, individual values, and proportions are untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Five-reel structure and uniform weight application are untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 87% | No test file. Critical weighted-random logic — boundary at r===acc, total=0 edge case, and last-item fallback are all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file. Imported by src/factories.ts making it a critical path; 3-row column length, valid symbol membership, and out-of-range reelIndex are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 78% | No test file. Imported by src/engine.ts; return identity and length are untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 85% | No test file. Imported by src/engine.ts; undefined return for invalid reelIndex and correct weight array identity are untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Pay table values are business-critical and untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic with count boundary cases (count<3, count=3,4,5, unknown symbol) all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 88% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Core event emitter used by engine.ts — on/off/emit methods, handler deduplication, multi-listener dispatch, and removal logic are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used in engine.ts but no tests verify it is emitted under the correct conditions. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file exists. `buildReels` is used by `src/engine.ts` (critical path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, varying rowCount) are exercised. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts for scatter counting — missing tests for empty reels, single scatter, exactly 3, and mixed symbol grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 72% | No test file exists. Four distinct branches (activation, re-trigger, decrement, deactivation) are all untested. Used by engine.ts in a critical game-logic path. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic with no coverage — missing happy path (≥4 diamonds), boundary (exactly 4 vs 3), empty reels, and mixed-symbol cases. Called by src/engine.ts, making untested behavior high-risk. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 88% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weight boundary conditions (roll == cumulative), and distribution uniformity. Called by src/engine.ts, making this a production code path with zero test coverage. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout function at line 108 to adjust total payout | [UNIQUE] Constant defining house edge multiplier. No duplicates found. | [OK] Value 0.05 matches documented 5% house edge; the misuse is in computePayout, not here. | [LEAN] Named constant for a magic number. Appropriate. | [NONE] No test file exists. HOUSE_EDGE directly affects RTP calculation in computePayout; its effect is untested. | [UNDOCUMENTED] No JSDoc comment. Value is self-evident but its role in RTP calculation is non-obvious.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded to false; guards console.log code that never executes (line 175) | [UNIQUE] Boolean constant for debug logging. No duplicates found. | [OK] Boolean flag, no correctness issues. | [LEAN] Simple boolean flag; gating a single console.log is minimal. | [NONE] No test file exists. Constant is always false; branch it guards is dead and untested. | [UNDOCUMENTED] No JSDoc comment. Private constant, tolerable, but even a brief note on what it enables would help.
  - EngineContainer: [USED] Instantiated at line 29 to create the dependency container | [UNIQUE] Dependency injection container with register/resolve methods. No duplicates found. | [NEEDS_FIX] resolve() silently casts undefined to T when key is absent, hiding missing-dependency bugs at the call site. | [OVER] Hand-rolled IoC container (string-keyed registry with register/resolve) whose only purpose is to hold three module-level imports — weightedPick, getPayMultiplier, and the reels module — all of which are already available via direct import. Adds type-erasure (Map<string, unknown> with unsafe casts) and a factory/registry pattern for zero runtime benefit. Single consumer (this file). A DI container is justified when resolving implementations at runtime or in tests with swap-out needs; neither applies here. | [NONE] No test file exists. register/resolve logic (including unsafe cast) has no coverage. | [UNDOCUMENTED] No JSDoc on class or its methods. Purpose (service locator / DI container), type-safety trade-offs, and intended usage are not documented.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Used in spin function for payline evaluation loop and line symbol lookup | [UNIQUE] Static array defining 10 payline configurations. No duplicates found. | [OK] 10 paylines, all row indices 0–2, consistent with 3-row reel grid. | [LEAN] 10-entry fixed payline matrix is standard slot machine data; no abstraction overhead. | [NONE] No test file exists. Payline definitions drive all win evaluation; correctness is untested. | [UNDOCUMENTED] No JSDoc. The coordinate system (row indices per reel column) and the meaning of each sub-array are not explained.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted call within spinReel (L45) | [UNIQUE] Constant symbol array. No similar definitions found. | [OK] Eight-element array order matches ReelWeightConfig fields and weightsToArray mapping. | [LEAN] Simple typed array of the 8 distinct symbols. No unnecessary abstraction. | [NONE] No test file exists. SYMBOLS drives all reel outcomes; no coverage of its contents or ordering. | [UNDOCUMENTED] No JSDoc comment. Purpose (master symbol list used for reel picks) is not obvious from name alone.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray 5 times in REEL_WEIGHTS initialization (L25-L29) | [UNIQUE] Constant weight configuration. No similar definitions found. | [NEEDS_FIX] DIAMOND carries the single highest weight (30 of 120 total → 25% per cell), higher than low-value symbols CHERRY/LEMON (25 each); contradicts slot-machine design conventions and likely violates the documented 95% RTP target. | [LEAN] Straightforward named configuration object. The named fields are the most readable way to express per-symbol probabilities. | [NONE] No test file. Weight values directly affect payout math; sum, individual values, and proportions are untested. | [UNDOCUMENTED] No JSDoc. Lacks explanation of what the weight values mean (relative probability units) or that they apply to all five reels by default. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. reels.ts:12-15 defines weights summing to 120 (25+25+15+10+5+30+5+5). DIAMOND at 30 is the highest weight, which the automated review flagged as suspicious for a 'premium' symbol. However, without the paytable multipliers (getPayMultiplier in src/paytable.ts), a high frequency + low payout design is a valid slot mechanic. The code works correctly: weights are positive, sum is valid, weightsToArray at L17-19 correctly extracts them in SYMBOLS order (L3-5). No crash, no data corruption, no incorrect probability math. This is a game design choice, not a code defect. Reclassified to OK.)
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Accessed in spinReel (L44) and exported getReelWeights (L57) | [UNIQUE] Constant array of weight arrays. No similar definitions found. | [OK] Five independent weight arrays created correctly; inherits the DIAMOND weight defect from DEFAULT_WEIGHTS but has no independent structural bug. | [ACCEPTABLE] Five identical calls to `weightsToArray(DEFAULT_WEIGHTS)` is verbose; `Array.from({length: 5}, () => weightsToArray(DEFAULT_WEIGHTS))` would be cleaner. The explicit listing may anticipate future per-reel weight differentiation, which justifies it marginally. | [NONE] No test file. Five-reel structure and uniform weight application are untested. | [UNDOCUMENTED] No JSDoc. The fact that all five reels share identical weights and that index maps to reel column is not documented.
  - pickFromWeighted: [USED] Called in spinReel loop to generate weighted random symbols (L45) | [DUPLICATE] Identical weighted selection algorithm to weightedPick in src/rng.ts. Both compute total weight, generate random value, iterate with cumulative check, and return last item as fallback. | [NEEDS_FIX] Uses Math.random() — not a certifiable PRNG for regulated gaming. | [LEAN] Canonical O(n) weighted-random-selection. Correctly handles floating-point edge cases with the fallback return. No unnecessary complexity. | [NONE] No test file. Critical weighted-random logic — boundary at r===acc, total=0 edge case, and last-item fallback are all untested. | [UNDOCUMENTED] No JSDoc. Core weighted-random selection algorithm with no description of parameters, return value, or edge-case behavior (fallback to last item). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at reels.ts:30-41 is algorithmically correct: sums weights (L31), draws Math.random()*total (L32), accumulates with < comparison (L35-36), returns last item as fallback (L40). The finding's NEEDS_FIX is based on duplication with weightedPick in rng.ts:5-16 — confirmed identical algorithm — but duplication is not a correctness defect. The function produces correct weighted random selections. The duplication concern belongs on a duplication axis, not correction. Reclassified correction to OK.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Used locally in getPayMultiplier at line 15 | [UNIQUE] Lookup table for slot payouts with no duplicates found | [OK] Paytable structure is internally consistent; RTP verification requires reel-strip data not present in this file. | [LEAN] Flat Record<string, tuple> lookup table; no abstraction beyond what the data requires. | [NONE] No test file exists. Pay table values are business-critical and untested. | [UNDOCUMENTED] No JSDoc comment. The tuple structure [number, number, number] implicitly maps to match counts (3, 4, 5) but this is undocumented; readers must infer from getPayMultiplier.

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
