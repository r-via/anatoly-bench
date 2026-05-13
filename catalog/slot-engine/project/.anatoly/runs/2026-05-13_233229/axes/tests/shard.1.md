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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout math but is never exercised in tests. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant controls debug logging path; untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve logic, including unsafe cast in resolve, has no coverage. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive all line-win logic but are never verified. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. WILD-leading fallback, SCATTER short-circuit, and run-length boundary (run < 3) are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file exists. Wild-multiplier compounding formula and null-return path have no coverage. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file exists. Exported public function with house-edge application, base-bet bonus, and Math.ceil rounding — all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file exists; weighted-selection logic has edge cases (boundary r==total, single item, zero-weight entries) that are untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file exists; imported by src/factories.ts making it a critical code path with no coverage. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 85% | No test file exists; imported by src/engine.ts with no coverage. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 85% | No test file exists; imported by src/engine.ts with no coverage. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal table untested; correctness of payout values (e.g. CHERRY=[2,5,25]) is never verified. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Called by src/engine.ts and src/legacy.ts — a critical payout path — yet count=3/4/5 branches, unknown-symbol fallback, and count<3 fallback are all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 85% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. All three methods (on, off, emit) are untested — including edge cases like removing a non-registered handler, emitting with no listeners, multiple handlers for the same event, and handler ordering. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is used in src/engine.ts but no tests verify it is emitted at the correct lifecycle point. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 72% | No test file exists. buildReels is used by src/engine.ts (a critical path), but zero tests cover reel count, row count behavior, or spinReel integration. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, and single-reel inputs. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 70% | No test file exists. Missing coverage for: initial activation (scatters >= 3), re-trigger during active state, decrement logic, boundary condition (remaining reaches 0), and no-op when inactive with < 3 scatters. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic called by src/engine.ts with no coverage for threshold boundary (exactly 4 DIAMONDs), below-threshold cases, empty reels, or mixed symbol grids. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical edge cases untested: zero-weight items, single-item arrays, mismatched items/weights lengths, negative weights, all-equal weights distribution, and the fallback return on L15. Used by src/engine.ts, making this a production risk. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Internal constant used in computePayout function at line 108. | [UNIQUE] Numeric constant, no duplication detected | [OK] Constant value 0.05 is correct for a 5% house edge; misuse is in computePayout, not here. | [LEAN] Named constant for a domain value. Minimal and appropriate. | [NONE] No test file exists. HOUSE_EDGE directly affects payout math but is never exercised in tests. | [UNDOCUMENTED] No JSDoc. Value 0.05 needs context — whether it inflates or deflates payouts, and its RTP effect, are non-obvious.
  - DEBUG_MODE: [USED] Internal constant checked in spin function at line 169. | [UNIQUE] Boolean constant, no duplication detected | [OK] Boolean flag correctly initialized to false. | [LEAN] Simple compile-time flag. Acceptable for dead-code branches. | [NONE] No test file exists. Constant controls debug logging path; untested. | [UNDOCUMENTED] No JSDoc. Trivial name but no comment describing what debug output is produced or how to enable it in other environments.
  - EngineContainer: [USED] Internal class instantiated at line 29 to create container instance. | [UNIQUE] Simple service container/registry implementation, no similar code detected | [OK] resolve uses an unchecked `as T` cast, but no better alternative exists without runtime generics; controlled usage poses no correctness risk. | [OVER] Full IoC/DI container (register/resolve with a Map) whose only purpose is to hold three values that are already directly imported at the top of the file. `container.resolve<typeof weightedPick>("rng")` is strictly worse than calling `weightedPick` directly. No test-injection, no multi-implementation scenario, no external consumer — the abstraction provides zero value. | [NONE] No test file exists. register/resolve logic, including unsafe cast in resolve, has no coverage. | [UNDOCUMENTED] No JSDoc on the class or its methods. Purpose as a DI/service-locator registry is non-obvious; `resolve` silently returns `undefined` on missing keys.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Internal constant used in spin function for line evaluation (lines 138-139, 157). | [UNIQUE] Constant array definition, no duplication detected | [OK] Ten paylines with row indices 0–2 on a 5-reel, 3-row grid are valid. | [LEAN] Static payline configuration data. Flat array of arrays is the right shape. | [NONE] No test file exists. Payline definitions drive all line-win logic but are never verified. | [UNDOCUMENTED] No JSDoc. The encoding (row indices per reel column) and the payline topology (zigzag patterns) are not described.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Internal constant used by getReelSymbols (L53) and pickFromWeighted (L47); core symbol definitions | [UNIQUE] Constant array of symbol strings with no similar definitions found | [OK] Array of 8 symbols matches all fields in ReelWeightConfig and the order used in weightsToArray. | [LEAN] Simple constant array of all symbol names. No abstraction needed beyond this. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc comment. Purpose (master symbol list used for reel picks) is not obvious from declaration alone.
  - DEFAULT_WEIGHTS: [USED] Used 5 times initializing REEL_WEIGHTS (L23–L27); primary weight configuration | [UNIQUE] Configuration object defining default reel weights with no similar constants | [OK] Weight values are structurally valid. RTP impact cannot be verified without the paytable, so no numerical finding is emitted per Rule 13 (forward derivation requires paytable constants not present in this file). | [LEAN] Simple object literal; complexity belongs to ReelWeightConfig, not the value itself. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The weight values (e.g. DIAMOND: 30 vs SEVEN: 5) encode payout probability design decisions that warrant documentation.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Used by spinReel (L44) and getReelWeights (L57); stores weighted symbol distributions per reel | [UNIQUE] Constant array of weight arrays initialized from default configuration | [OK] Five reels, each initialised with DEFAULT_WEIGHTS via weightsToArray. Structurally correct. | [ACCEPTABLE] All 5 reels currently share identical weights, but storing per-reel weight arrays is a natural slot-machine design that costs little and enables per-reel tuning for RTP adjustments (README targets 95% RTP). Slight redundancy is justified. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The 5-reel structure and the fact that all reels share DEFAULT_WEIGHTS (uniform distribution) is not explained.
  - pickFromWeighted: [USED] Called by spinReel (L47); implements weighted random selection core logic | [DUPLICATE] Identical weighted random selection algorithm to weightedPick in src/rng.ts — same reduce-accumulate-iterate pattern with matching logic | [NEEDS_FIX] Weighted-selection logic is correct, but Math.random() is a non-certifiable PRNG for regulated gaming RNG. | [LEAN] Standard O(n) weighted-random pick; minimal and correct for 8-symbol reels. | [NONE] No test file exists; weighted-selection logic has edge cases (boundary r==total, single item, zero-weight entries) that are untested. | [UNDOCUMENTED] No JSDoc. Core weighted-random-selection algorithm; missing @param descriptions, @returns, and a note on the fallback to last item when floating-point rounding causes r >= total.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant used locally in getPayMultiplier function | [UNIQUE] Static lookup table for slot payout multipliers. No similar tables found in RAG results. | [OK] Structure is a valid Record mapping symbol names to [3-match, 4-match, 5-match] multiplier tuples. RTP accuracy cannot be verified without reel probability weights; no paytable-internal defect is visible. | [LEAN] Flat lookup table mapping symbol names to 3-element tuples. No unnecessary abstraction; tuple type accurately encodes the fixed 3-count structure. | [NONE] No test file exists. Internal table untested; correctness of payout values (e.g. CHERRY=[2,5,25]) is never verified. | [UNDOCUMENTED] No JSDoc comment. The tuple structure [number, number, number] lacks explanation of what each index represents (likely match counts 3/4/5), which is non-obvious to readers.

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
