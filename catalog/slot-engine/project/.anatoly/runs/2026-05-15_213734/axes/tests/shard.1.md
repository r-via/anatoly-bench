[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcfreespints) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 91% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout math and its 0.05 value is never validated by any test. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Trivial constant but its conditional branch in spin() is untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve round-trip, missing-key behavior, and type-unsafe cast are all untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline shape (10 lines × 5 columns, values 0–2) is never validated. |
| `checkLine` | L47–L64 | 🔴 NONE | 92% | No test file exists. WILD-lead resolution, SCATTER short-circuit, run-length counting, and run < 3 rejection are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 90% | No test file exists. Wild-multiplier exponential bonus, no-win null return, and lineBet scaling are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file exists. House-edge application, 1% base-bet floor, Math.ceil rounding, and zero-wins path are all untested. Exported and business-critical. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Array contents and ordering are never verified. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 90% | No test file. Weight values are never asserted and sum (120) is never validated. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Number of reels (5) and per-reel weight arrays are never verified. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file. Weighted distribution logic, boundary condition (r exactly at boundary), and fallback return are all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 85% | No test file. Used by src/factories.ts; column length (3), valid symbol membership, and invalid reelIndex behavior are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file. Used by src/engine.ts; returned array identity and contents never asserted. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 80% | No test file. Used by src/engine.ts; out-of-range reelIndex returning undefined is never caught. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant, but its correctness (payout values per symbol tier) is entirely untested via getPayMultiplier. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file. Imported by src/engine.ts and src/legacy.ts — critical payout path. Missing coverage of valid counts (3/4/5), unknown symbols returning 0, and invalid counts (1, 2, 6+). |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file. No tests verify the contract or subclass behavior. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, making this a critical path — identity passthrough behavior is untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Missing coverage for: empty reels, no scatters, single scatter, multiple scatters across columns, scatters in same column. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 92% | No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger during active spins, countdown decrement, deactivation at 0, inactive state with <3 scatters. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 80% | No test file exists. Critical methods on()/off()/emit() are untested — including edge cases like emitting with no listeners, removing a handler mid-loop, multiple handlers for the same event, and duplicate handler removal. Used by src/engine.ts in production paths. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is a string sentinel used by src/engine.ts; no tests verify it is emitted at the correct lifecycle point. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — neither happy path nor edge cases (zero reelCount, large values, reel shape) are tested. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 91% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, negative weights, single-item arrays, and boundary roll values (roll === cumulative). The fallback return on L15 (guards floating-point overshoot) is also untested. Used by src/engine.ts, making this a production risk. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), edge cases (empty reels, fewer than 4 diamonds) all untested. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced on line 105 in computePayout function | [UNIQUE] Numeric constant (0.05) for house edge calculation. No duplicates identified. | [OK] Value 0.05 matches the reference documentation. | [LEAN] Named constant for a magic number used in computePayout. Appropriate. | [NONE] No test file exists. HOUSE_EDGE directly affects payout math and its 0.05 value is never validated by any test. | [UNDOCUMENTED] No JSDoc. Internal constant with no explanation of how it is applied or its relationship to target RTP.
  - DEBUG_MODE: [USED] Referenced on line 159 in spin function | [UNIQUE] Boolean constant for debug mode flag. No duplicate constants found. | [OK] Constant false; gates only a console.log branch. | [LEAN] Single boolean constant; not overengineered even if hardcoded false creates dead code. | [NONE] No test file exists. Trivial constant but its conditional branch in spin() is untested. | [UNDOCUMENTED] No JSDoc. Internal flag with no description of what debug output it enables.
  - EngineContainer: [USED] Instantiated on line 29 to create container instance | [UNIQUE] Service locator class with register/resolve methods. No similar classes identified. | [OK] resolve casts undefined to T for missing keys, but all keys are registered before first use so no runtime defect in the current call graph. | [OVER] DIY service-locator for exactly 3 statically-imported functions. Uses Map<string, unknown> losing type safety, then casts with `as T` on every resolve. No inversion of control is achieved — the same three imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols/getReelWeights`) could be used directly. Single instantiation, single consumer. Textbook premature abstraction. | [NONE] No test file exists. register/resolve round-trip, missing-key behavior, and type-unsafe cast are all untested. | [UNDOCUMENTED] No JSDoc on the class or its methods. Purpose as a service-locator/DI container is non-obvious from the name alone; register/resolve semantics are undocumented.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Referenced on lines 133 and 149 in spin function | [UNIQUE] 2D array of payline patterns (10 lines). No duplicate payline arrays found. | [OK] All 10 payline row-index sequences match the data-flow documentation exactly. | [LEAN] Static data array of 10 payline patterns. Matches the documented payline table exactly. | [NONE] No test file exists. Payline shape (10 lines × 5 columns, values 0–2) is never validated. | [UNDOCUMENTED] No JSDoc. The row-index encoding convention and the meaning of each pattern (middle row, V-shape, etc.) are not explained.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Passed to pickFromWeighted in spinReel (L47) | [UNIQUE] Constant array of symbol types. No similar definitions found. | [OK] 8-element array order matches ReelWeightConfig fields and weightsToArray output order. | [LEAN] Simple array of 8 symbol constants. Minimal and appropriate. | [NONE] No test file exists. Array contents and ordering are never verified. | [UNDOCUMENTED] No JSDoc comment. Purpose (master symbol registry for weighted sampling) is not self-evident from the name alone.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray in REEL_WEIGHTS initialization (L24-28) | [UNIQUE] Default weight configuration constant. No similar constants found. | [NEEDS_FIX] DIAMOND weight 30 (25%/cell) combined with 1000× 5-match payout contributes ~97.7% expected return per spin from that one win type alone, before any other symbol wins; total RTP >> 100%, violating arbitrated RTP = 95% [README.md]. | [LEAN] Flat object with one numeric field per symbol. Direct and minimal. | [NONE] No test file. Weight values are never asserted and sum (120) is never validated. | [UNDOCUMENTED] No JSDoc. Missing explanation of what the numeric values represent (relative probability weights, total=120) and that all five reels share this table. (deliberated: reclassified: correction: NEEDS_FIX → OK — Weights at src/reels.ts:12-15 sum to 120 (CHERRY:25+LEMON:25+BELL:15+BAR:10+SEVEN:5+DIAMOND:30+WILD:5+SCATTER:5). These match internal documentation verbatim: 'Total weight: 120. pickFromWeighted draws a uniform random in [0, 120)'. The NEEDS_FIX claim provides no evidence of what the correct values should be. RTP depends on the entire system (weights + paytable + paylines + HOUSE_EDGE), not weights alone. These are intentional design constants.)
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Accessed in spinReel to get weights for reel (L44) | [UNIQUE] Array of weight configurations for five reels. No similar constants found. | [OK] Five reels initialized from DEFAULT_WEIGHTS; RTP defect attributed to DEFAULT_WEIGHTS. | [OVER] Five identical rows produced by calling weightsToArray(DEFAULT_WEIGHTS) five times. All reels share the same weights (confirmed by reference docs), so storing a 2-D array of duplicates adds indirection. A single shared weights array passed into spinReel would suffice. | [NONE] No test file. Number of reels (5) and per-reel weight arrays are never verified. | [UNDOCUMENTED] No JSDoc. The 5-reel structure and its relationship to SYMBOLS index positions are not documented.
  - pickFromWeighted: [USED] Called in spinReel loop to select random symbols (L47) | [DUPLICATE] Implements weighted random selection. Semantically identical to weightedPick in src/rng.ts — both sum weights, generate random value, iterate to find item where cumulative exceeds random, and return fallback. Only differences: variable naming, generic vs specific type, and export status. | [NEEDS_FIX] Math.random() is not a certifiable RNG for regulated gambling; slot-machine domain confirmed by reel/payline/jackpot vocabulary and arbitrated RTP target. | [LEAN] Standard cumulative-weight sampling loop. Correct and minimal for its purpose. | [NONE] No test file. Weighted distribution logic, boundary condition (r exactly at boundary), and fallback return are all untested. | [UNDOCUMENTED] No JSDoc. Cumulative-weight sampling algorithm, parameter semantics (items and wts must be same length), and fallback behavior (returns last item on floating-point edge case) are undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — src/reels.ts:30-41 implements correct cumulative-weight random selection: sums weights, generates uniform random in [0,total), accumulates and returns matching item, with last-item fallback. Algorithm is sound. The finding conflates duplication (real — identical to weightedPick in rng.ts) with correctness. Duplication is a code quality concern belonging on the duplication axis, not a correctness defect. The function produces correct results every time it's called (src/reels.ts:47).)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported; referenced by getPayMultiplier at line 15 | [UNIQUE] Excluded per project instructions | [OK] All six symbol rows match the documented [3-match, 4-match, 5-match] multipliers exactly. | [LEAN] Plain data-only lookup table; tuple shape [3-match, 4-match, 5-match] is the minimal representation for the three pay tiers. | [NONE] No test file exists. Private constant, but its correctness (payout values per symbol tier) is entirely untested via getPayMultiplier. | [UNDOCUMENTED] No JSDoc comment. The tuple layout ([3-match, 4-match, 5-match] multipliers applied to lineBet) and the absence of WILD/SCATTER entries are not documented inline.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/events.ts` — 2 untested
  Improve `src/events.test.ts` covering: SpinEventEmitter, SPIN_DONE

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit
