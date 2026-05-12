[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 9 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
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
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout calculations but is never verified in tests. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false; no tests exercise the debug branch. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior, missing-key edge cases, and generic typing are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton with registered dependencies is never tested in isolation. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. The 10 payline definitions drive all win evaluation but are never tested for correctness or completeness. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. Critical logic for WILD substitution, SCATTER exclusion, run-length counting, and minimum-3-match threshold is entirely untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 80% | No test file exists. Wild-count exponential multiplier formula and payout calculation paths are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists. House-edge application (multiplies by 1.05 instead of reducing RTP), the always-added bet*0.01 floor, and Math.ceil rounding are all untested. Comment claims ~95% RTP but implementation adds edge on top of wins rather than reducing them. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Constant defines the full symbol universe used by spinReel and getReelSymbols. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists. Weight values directly influence RTP/payout math; untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. Per-reel weight tables drive all spin outcomes. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file exists. Core sampling logic has edge cases: zero-weight items, r exactly at boundary, single-item list, weights summing to 0. |
| `spinReel` | L43–L50 | 🔴 NONE | 95% | No test file exists. Called by src/factories.ts; out-of-bounds reelIndex would cause undefined weights passed to pickFromWeighted. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts; returns mutable reference to SYMBOLS array. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 88% | No test file exists. Used by src/engine.ts; returns mutable reference to inner REEL_WEIGHTS row, allowing external mutation. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. All payout values are untested; misconfigured multipliers would silently corrupt game math. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Called by engine.ts and legacy.ts — critical payout path with count branching (3/4/5) and unknown-symbol fallback entirely untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Core event emitter used by src/engine.ts — on/off/emit methods and edge cases (multiple handlers, removing non-existent handlers, emitting with no listeners, handler deregistration) are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used by src/engine.ts as an event name — no tests verify it integrates correctly with SpinEventEmitter. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 65% | No test file exists. `buildReels` is used by `src/engine.ts` (core engine path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, varying rowCount) are verified. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Called by engine.ts but no tests cover scatter counting logic, including edge cases like empty reels, no scatters, or mixed reel contents. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 78% | No test file exists. State machine has 4 distinct branches (activate, retrigger, decrement, deactivate) — all untested despite being core game logic used by engine.ts. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, multiple columns), or boundary tests. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical gaming RNG logic with zero coverage: uniform distribution correctness, boundary roll (roll === cumulative), single-item arrays, mismatched weights/items lengths, zero-weight items, and the fallback return on L15 are all untested. Called by src/engine.ts, making this a high-risk gap. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used at line 105 in computePayout to adjust payout calculation | [UNIQUE] House edge constant. No similar constants found. | [OK] Value 0.05 is correct; the defect is in how computePayout applies it. | [LEAN] Named constant for a magic number. Minimal and appropriate. | [NONE] No test file exists. HOUSE_EDGE directly affects payout calculations but is never verified in tests. | [UNDOCUMENTED] No JSDoc comment. Value 0.05 is self-evident as a percentage but its role in payout calculation is undescribed.
  - DEBUG_MODE: [USED] Used at line 159 in spin for conditional debug logging | [UNIQUE] Debug flag constant. No similar constants found. | [OK] Boolean flag, no correctness issue. | [LEAN] Single boolean flag guarding a console.log. Straightforward. | [NONE] No test file exists. Constant is always false; no tests exercise the debug branch. | [UNDOCUMENTED] No JSDoc comment. Boolean flag with no description of what debug output it enables.
  - EngineContainer: [USED] Instantiated at line 29 as dependency injection container | [UNIQUE] Dependency injection container class. No similar classes found. | [OK] resolve() silently returns undefined for missing keys via unchecked cast, but all keys resolved in spin() are registered at module init. | [OVER] DIY service-locator/IoC container for three values that are already statically imported in the same file. The register/resolve indirection with `Map<string, unknown>` and unsafe generic casts adds ceremony with zero benefit over direct calls to weightedPick, getPayMultiplier, and the reels module. Two of the three resolved values (rng, reelsModule) are never actually used in spin(), making the container pointless for them entirely. | [NONE] No test file exists. register/resolve behavior, missing-key edge cases, and generic typing are untested. | [UNDOCUMENTED] No JSDoc on the class or its methods. Purpose as a service locator/DI container and the semantics of register/resolve are undocumented.
  - container: [USED] Used for dependency registration (lines 30-32) and resolution (lines 120-122) | [UNIQUE] Global container instance. No similar variables found. | [OK] All three keys registered correctly; usage defect is in spin(). | [LEAN] Straightforward instantiation and population of EngineContainer. The over-engineering lives in the class definition above. | [NONE] No test file exists. Module-level singleton with registered dependencies is never tested in isolation. | [UNDOCUMENTED] No comment explaining why this module-level singleton exists or what services it holds.
  - PAYLINES: [USED] Used in spin function to evaluate paylines at lines 133, 134, 149 | [UNIQUE] Payline row mapping array. No similar constants found. | [OK] All row indices 0–2 are valid for a 3-row reel grid. | [LEAN] Static data table for 10 payline patterns. Appropriate representation for slot-machine paylines. | [NONE] No test file exists. The 10 payline definitions drive all win evaluation but are never tested for correctness or completeness. | [UNDOCUMENTED] No JSDoc. The structure (array of row-index arrays per reel column) and the meaning of each payline pattern are unexplained.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Used in pickFromWeighted call at line 35 | [UNIQUE] Constant array with no similar definitions found | [OK] Array of 8 symbols; order matches weightsToArray and is consistent throughout the file. | [LEAN] Plain constant array; nothing extraneous. | [NONE] No test file exists. Constant defines the full symbol universe used by spinReel and getReelSymbols. | [UNDOCUMENTED] No JSDoc comment. Purpose (master symbol list used for reel picks) is not stated.
  - DEFAULT_WEIGHTS: [USED] Used in REEL_WEIGHTS initialization (5 calls) | [UNIQUE] Configuration constant with no similar definitions found | [OK] Weights sum to 120; RTP cannot be verified without the paytable constants (not in scope), so no derivable contradiction with the 95% target. | [LEAN] Straightforward object literal; complexity is in the interface, not the constant. | [NONE] No test file exists. Weight values directly influence RTP/payout math; untested. | [UNDOCUMENTED] No JSDoc. Does not explain that weights are relative (not percentages), nor why specific values were chosen (e.g. SEVEN/WILD/SCATTER rarity).
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Used in spinReel (L44) and getReelWeights (L57) | [UNIQUE] Array initialization constant with no similar definitions found | [OK] weightsToArray is called five times, producing five independent 8-element arrays — no shared-reference aliasing issue. | [ACCEPTABLE] Five identical weightsToArray calls are redundant today, but the per-reel array structure anticipates per-reel weight tuning, which is a normal slot-machine design concern. Minor; not flagged OVER. | [NONE] No test file exists. Per-reel weight tables drive all spin outcomes. | [UNDOCUMENTED] No JSDoc. Does not state that index corresponds to reel column, that all 5 reels share identical weights, or that this is the authoritative per-reel config.
  - pickFromWeighted: [USED] Called in spinReel at line 37 | [DUPLICATE] Identical weighted random selection logic: reduce weights to total, generate random value, accumulate until threshold, return item | [OK] Excluded per project instructions (overturned false positive: algorithm is correct; Math.random() concern is compliance, not algorithmic correctness). | [LEAN] Standard weighted-random selection. Generic parameters are warranted; implementation is minimal and correct. | [NONE] No test file exists. Core sampling logic has edge cases: zero-weight items, r exactly at boundary, single-item list, weights summing to 0. | [UNDOCUMENTED] No JSDoc. Algorithm (weighted random selection), assumption that wts.length === items.length, and the fallback on the last element are undocumented.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant used in getPayMultiplier on line 16 | [UNIQUE] Configuration data structure with no equivalent found in provided code | [OK] Multipliers are monotonically increasing within each row and across symbols; index mapping (0=3-match, 1=4-match, 2=5-match) is internally consistent with getPayMultiplier. | [LEAN] Flat record mapping symbol names to fixed-length tuples — minimal structure for a static paytable. | [NONE] No test file exists. All payout values are untested; misconfigured multipliers would silently corrupt game math. | [UNDOCUMENTED] No JSDoc comment. The tuple structure [number, number, number] represents payouts for 3/4/5 matches, but this mapping is implicit — no comment explains the tuple index semantics or units (multiplier? coins?).

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
