[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 9 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 88% | [details](#srcreelsts) |
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
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists for this module. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists for this module. |
| `checkLine` | L47–L64 | 🔴 NONE | 80% | No test file exists for this module. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 55% | No test file exists for this module. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists for this module. Critical logic: applies house edge incorrectly (multiplies by 1+HOUSE_EDGE instead of reducing) and adds unconditional 1% bet bonus — untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 88% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 88% | No test file exists. Critical probabilistic logic with boundary condition at loop exit (fallback return) is entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 78% | No test file exists. Imported by src/factories.ts, making it a critical production path with zero coverage. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 80% | No test file exists. Imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 80% | No test file exists. Imported by src/engine.ts. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. PAY_TABLE is internal but drives all payout logic — untested indirectly through getPayMultiplier. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 93% | No test file found. Imported by src/engine.ts and src/legacy.ts — critical payout path with no coverage for valid symbols at counts 3/4/5, unknown symbols (returns 0), or boundary counts like 2 or 6. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts — pass-through identity behavior is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 85% | No test file exists. `on`, `off`, and `emit` are all untested — including edge cases like emitting with no listeners, removing a non-registered handler, multiple handlers per event, and handler invocation order. Used by src/engine.ts, making this a critical gap. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is used as an event key in src/engine.ts but no tests verify its value or its use in emit/on flows. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file exists. Used by src/engine.ts (critical path), yet buildReels has no coverage — neither happy path (correct reel count, spinReel delegation) nor edge cases (reelCount=0, large values). |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic used by engine.ts has zero test coverage. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. State mutation logic with multiple branches (activation, re-trigger, decrement, deactivation) is completely untested. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Function has no test coverage despite being imported by src/engine.ts (critical game engine path). Missing tests for: jackpot threshold (exactly 4 diamonds), below threshold (3 diamonds), zero diamonds, mixed symbols, empty reels, single reel. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item input, boundary roll equal to cumulative weight, and distribution uniformity. Called by src/engine.ts, making coverage gaps a real risk. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout() line 105 to adjust payout multiplier. | [UNIQUE] Simple numeric constant; no similar symbols found | [OK] Constant value 0.05 is correct for a 5% house edge. The bug is in how computePayout applies it, not in the constant itself. | [LEAN] Named constant for a magic number — standard practice. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Private module constant.
  - DEBUG_MODE: [USED] Referenced in spin() line 159 to conditionally log debug output. | [UNIQUE] Boolean constant; no similar symbols found | [OK] Simple boolean constant, no correctness issues. | [LEAN] Simple flag constant guarding a single debug log. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Private module constant.
  - EngineContainer: [USED] Instantiated on line 29 to serve as dependency container, accessed via container variable in spin(). | [UNIQUE] DI container class with register/resolve; no similar classes found | [OK] resolve<T> casts undefined to T when key is missing, but all keys used at runtime are pre-registered in module scope. No runtime failure in current usage. | [OVER] Hand-rolled IoC registry with `register`/`resolve` used solely to store and re-retrieve three functions that are already in scope as top-level imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). The indirection buys nothing: the container is module-private, never swapped, never mocked, and has exactly one call site. | [NONE] No test file exists for this module. | [UNDOCUMENTED] Unexported internal DI container class. No JSDoc on class or its methods. Low severity given it is not public API.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Referenced in spin() loops at lines 133 and 149 to evaluate payline patterns. | [UNIQUE] Static payline configuration; no similar constants found | [OK] 10 paylines with valid row indices (0-2) for a 5×3 grid. Matches documentation exactly. | [LEAN] Fixed data table — appropriate representation for 10 static payline definitions. | [NONE] No test file exists for this module. | [UNDOCUMENTED] 10-element payline array with no JSDoc explaining the row-index encoding, coordinate system, or payline numbering convention.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Used locally: passed to pickFromWeighted on line 34 and returned from getReelSymbols on line 42 | [UNIQUE] Constant symbol array. No similar constants found. | [OK] Symbol list matches documentation and aligns with weightsToArray field order. | [LEAN] Simple constant array of 8 symbol strings. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal non-exported constant; name and values are self-descriptive, so low severity.
  - DEFAULT_WEIGHTS: [USED] Used locally: passed to weightsToArray 5 times in REEL_WEIGHTS initialization (L24–L28) | [UNIQUE] Constant weight configuration object. No similar constants found. | [NEEDS_FIX] DIAMOND weight 30 (highest of all symbols, P=25%) combined with its 1000× 5-of-a-kind payout yields RTP >> 100%, violating the arbitrated target of 95%. The highest-paying symbol should be among the rarest, not the most common. | [LEAN] Straightforward named constant mapping symbols to weights. Readable and appropriately simple. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant; name and literal values are clear, but the total-weight sum (120) and per-symbol probabilities are undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. reels.ts:12-15 defines weights summing to 120. weightsToArray (reels.ts:17-20) correctly maps them to an ordered array matching SYMBOLS (reels.ts:3-5). The weighted selection algorithm at reels.ts:30-41 handles them correctly. DIAMOND having weight 30 (highest) while also being the highest-paying symbol is a game-balance concern, not a code defect. No specification exists dictating correct weight values. The code is logically correct — it does exactly what it says.)
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Used locally: accessed in spinReel (L32) and returned from getReelWeights (L57) | [UNIQUE] Constant 5-reel weight arrays. No similar constants found. | [OK] Five identical weight arrays matching documentation. Inherits the DIAMOND weight defect from DEFAULT_WEIGHTS but the source of that issue is DEFAULT_WEIGHTS. | [LEAN] Five reels each using the same weight array. Repeating weightsToArray five times is verbose but the structure is clear and trivially maintainable. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant; the decision that all 5 reels share identical weights is an implicit design choice with no explanation.
  - pickFromWeighted: [USED] Called locally in spinReel loop (L34) for weighted symbol selection | [DUPLICATE] Implements weighted random selection. RAG score 0.823 with matching logic verified in source. | [NEEDS_FIX] Math.random() is not certifiable for regulated gaming RNG. Inferred slot-machine domain from reel/paytable/jackpot/scatter vocabulary and paytable structure. Industry convention requires a certified PRNG (e.g., FIPS 140-2 compliant) for production slot engines. | [LEAN] Standard weighted-random selection algorithm. Minimal and correct for its purpose. | [NONE] No test file exists. Critical probabilistic logic with boundary condition at loop exit (fallback return) is entirely untested. | [UNDOCUMENTED] Non-exported helper implementing weighted-random selection. Algorithm is non-trivial (cumulative-weight scan) but name and parameter names convey intent adequately. No @param/@returns. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at reels.ts:30-41 is algorithmically correct — cumulative-weight sampling with fallback return. It duplicates rng.ts:5-16 (weightedPick) with only cosmetic differences (variable names: total/totalWeight, r/roll, acc/cumulative), confirmed by code comparison. However, duplication is a duplication-axis concern, not a correction-axis concern. The function produces correct weighted random selections and is properly called at reels.ts:47. No logical error exists in the implementation.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Internal constant used in getPayMultiplier on line 16 to look up payouts. | [UNIQUE] No duplicates found | [OK] All six symbol rows match the documented paytable exactly (3/4/5-of-a-kind multipliers). | [LEAN] Flat record mapping symbol names to fixed 3-tuple arrays. No abstraction overhead; direct data declaration. | [NONE] No test file exists. PAY_TABLE is internal but drives all payout logic — untested indirectly through getPayMultiplier. | [UNDOCUMENTED] Internal constant with no JSDoc. The tuple structure [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is inferrable from data but not stated; indices are undocumented. Lower confidence because it is unexported.

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
