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
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcfactoriests) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 45% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout math in computePayout but is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Trivial constant but untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve contract, type-casting behavior, and missing-key behavior are all untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive all win evaluation but are never validated. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. Critical logic — WILD substitution, SCATTER short-circuit, run-length counting, minimum run of 3 — all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 88% | No test file exists. Wild multiplier compounding (wildCount exponent), zero-win null path, and lineBet scaling are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists. HOUSE_EDGE application on positive total, unconditional bet*0.01 bonus, Math.ceil rounding, and zero-win path are all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS drives all reel spin outcomes; untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Weight values directly affect payout odds — correctness unverified. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Five identical weight arrays initialized via weightsToArray; no validation that all five reels are populated correctly. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 50% | No test file. Core probability logic — off-by-one on boundary (r < acc vs r <= acc), zero-weight symbols, and single-item arrays are all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file. Imported by src/factories.ts; always returns 3-element column — length guarantee and out-of-bounds reelIndex behavior untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 80% | No test file. Imported by src/engine.ts; returns shared mutable array reference — mutation safety untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 90% | No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently — untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant backing getPayMultiplier; its correctness is entirely untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Imported by engine.ts and legacy.ts — a critical payout calculation path with zero test coverage. Missing: valid symbol/count combos, unknown symbol returning 0, count < 3 returning 0, count === 3/4/5 boundary cases. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 95% | Auto-resolved: import verified on disk (spinReel found in ./reels.js) |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Critical class used by src/engine.ts — on/off/emit methods, handler deduplication, multi-listener dispatch, and removal of non-existent handlers are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is consumed by src/engine.ts but no test verifies correct event string value or its integration with SpinEventEmitter. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts for core scatter detection; no coverage of empty reels, single scatter, exactly 3 scatters, or mixed symbol grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 65% | No test file exists. All four branches (activate, retrigger, decrement, deactivate at 0) are untested. State mutation behavior and boundary at remaining<=0 are uncovered. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic called by src/engine.ts has zero coverage — missing tests for threshold boundary (exactly 4 diamonds), below threshold (3 diamonds), above threshold (5+ diamonds), empty reels, and no-diamond cases. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 45% | No test file exists. Critical paths untested: zero total weight (division by zero), mismatched array lengths, single-item input, boundary where roll equals exact cumulative boundary, and distribution accuracy. Used by src/engine.ts, making this a production risk. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout at line 108 to adjust total payout. | [UNIQUE] Numeric constant specific to engine configuration. No similar constants identified. | [OK] Value 0.05 matches the documented 5% house edge; the constant itself is correct. | [LEAN] Named constant for a magic number. Appropriate. | [NONE] No test file exists. HOUSE_EDGE directly affects payout math in computePayout but is never tested. | [UNDOCUMENTED] No JSDoc comment. The value 0.05 and its role in payout calculation are not explained inline.
  - DEBUG_MODE: [USED] Referenced in spin at line 167 for conditional debug logging. | [UNIQUE] Boolean flag for debug logging. No duplication found. | [OK] Simple boolean flag; no correctness issues. | [LEAN] Simple hardcoded boolean flag. Not overengineered. | [NONE] No test file exists. Trivial constant but untested. | [UNDOCUMENTED] No JSDoc comment. Boolean flag with no explanation of what debug behavior it enables.
  - EngineContainer: [USED] Instantiated at line 29 to create the dependency container. | [UNIQUE] Dependency container class with register/resolve pattern. No similar implementation found. | [OK] Registry pattern is correct for current usage; all keys resolved in spin() are pre-registered. | [OVER] DIY IoC container (register/resolve via Map<string, unknown>) for three static module-level imports that never change. Introduces type-unsafe `as T` casts, string-keyed lookups, and runtime indirection with zero benefit over direct references. Single consumer (spin), no swapping, no testing seam. | [NONE] No test file exists. register/resolve contract, type-casting behavior, and missing-key behavior are all untested. | [UNDOCUMENTED] No JSDoc on the class or its methods. The DI-container pattern, registry semantics, and the untyped `unknown` resolution contract are non-obvious and warrant documentation.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Referenced multiple times in spin: line 128 for length, line 129 to pass paylines, line 155 for line symbols lookup. | [UNIQUE] Game-specific payline configuration array. No similar array structure identified. | [OK] All row indices in [0, 2]; valid for a 3-row reel grid. | [LEAN] Static payline matrix. Exactly the right representation for this data. | [NONE] No test file exists. Payline definitions drive all win evaluation but are never validated. | [UNDOCUMENTED] No JSDoc explaining the coordinate system (row indices per reel column), how many paylines exist, or their layout semantics.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Array used locally in pickFromWeighted at line 38 for weighted random selection | [UNIQUE] Constant array defining available reel symbols. No similar constants found. | [OK] 8-symbol array order matches ReelWeightConfig keys and weightsToArray extraction order. | [LEAN] Simple typed constant, no abstraction overhead. | [NONE] No test file exists. SYMBOLS drives all reel spin outcomes; untested. | [UNDOCUMENTED] No JSDoc comment. Purpose (master symbol list used for reel picks) is not stated.
  - DEFAULT_WEIGHTS: [USED] Used locally 5 times in REEL_WEIGHTS initialization (L24–L28) | [UNIQUE] Default weight configuration for all reels. No similar constants found. | [OK] All values are valid positive integers. RTP impact of DIAMOND weight=30 (25% of total 120) cannot be verified without paytable constants from another file; abstaining per rule 13. | [LEAN] Plain config object literal, minimal and appropriate. | [NONE] No test file. Weight values directly affect payout odds — correctness unverified. | [UNDOCUMENTED] No JSDoc. Missing explanation that these are relative weights (not probabilities), and no note on which reel(s) they apply to by default.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Array referenced in spinReel (L44) and getReelWeights (L57) | [UNIQUE] Multi-dimensional array of reel weight configurations. No similar constants found. | [OK] Five reels each initialized correctly via weightsToArray(DEFAULT_WEIGHTS). | [ACCEPTABLE] Five separate weight arrays anticipate per-reel customisation, which is standard slot-machine design. Currently identical values, but the structure is justified. | [NONE] No test file. Five identical weight arrays initialized via weightsToArray; no validation that all five reels are populated correctly. | [UNDOCUMENTED] No JSDoc. Does not explain that the outer array is indexed by reel (0–4) or that all five reels share identical weights.
  - pickFromWeighted: [USED] Function called in spinReel loop (L48) for weighted random symbol selection | [DUPLICATE] Weighted random selection using cumulative probability. Identical logic to weightedPick. | [NEEDS_FIX] Uses Math.random(), which is not a certifiable PRNG for regulated gaming. | [LEAN] Correct, minimal weighted-random implementation with no unnecessary abstraction. | [NONE] No test file. Core probability logic — off-by-one on boundary (r < acc vs r <= acc), zero-weight symbols, and single-item arrays are all untested. | [UNDOCUMENTED] No JSDoc. Weighted-random selection algorithm with a fallback on the last item is non-trivial; missing @param and @returns descriptions. (deliberated: confirmed — The function at reels.ts:30-41 is algorithmically correct — standard cumulative-weight selection with proper fallback at L40. The finding's actual concern is duplication with rng.ts:weightedPick, not a correctness bug. Both implementations are identical in logic (verified line-by-line: reduce total, random * total, accumulate, compare, fallback to last). The real correction concern is architectural: engine.ts:30 registers weightedPick as 'rng' in DI container, engine.ts:120 resolves it, but the resolved `rng` variable is never passed to factory.buildReels (L128), so pickFromWeighted bypasses the official RNG entirely. Lowering confidence to 50 because the function itself is correct; the issue is duplication/architecture, not a bug in pickFromWeighted's logic.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced locally in getPayMultiplier on line 15. | [UNIQUE] Unique paytable lookup object. No similar structures found in RAG. | [OK] Paytable structure is internally consistent; RTP verification requires reel-strip weights not present in this file. | [LEAN] Fixed tuple type `[number, number, number]` precisely models 3-match / 4-match / 5-match tiers. Plain object literal is the right structure for a static lookup table. | [NONE] No test file exists. Private constant backing getPayMultiplier; its correctness is entirely untested. | [UNDOCUMENTED] No JSDoc. The tuple structure [number, number, number] maps to match counts 3/4/5, but this is not documented. Not exported but semantically non-trivial.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/events.ts` — 2 untested
  Improve `src/events.test.ts` covering: SpinEventEmitter, SPIN_DONE

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick
