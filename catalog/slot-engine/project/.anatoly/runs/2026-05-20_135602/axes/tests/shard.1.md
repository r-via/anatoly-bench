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
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 85% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE affects computePayout behavior but is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve contract and missing-key behavior are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline layout correctness is never verified. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. WILD substitution logic, SCATTER early-exit, run-length threshold (<3), and all-WILD edge cases are untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 90% | No test file exists. Wild-count multiplier compounding (basePayout * (1+wc) * 2^wc) is a critical financial calculation with no test coverage. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists. The house-edge application (multiplies instead of reducing), the unconditional +bet*0.01 floor, and Math.ceil rounding are all untested despite being exported and financially significant. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 88% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file exists. This function uses Math.random() and has boundary behavior (last-item fallback) that warrant dedicated tests. |
| `spinReel` | L43–L50 | 🔴 NONE | 92% | No test file exists. Imported by src/factories.ts — a critical path with no coverage. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file exists. Imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 88% | No test file exists. Imported by src/engine.ts. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists for this module. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Function is imported by src/engine.ts and src/legacy.ts, making untested count/symbol boundary logic a risk. Cases like count<3, unknown symbol, and all six symbols across all three counts are uncovered. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 80% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 85% | No test file found. Used by src/engine.ts — pass-through identity behavior is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Core event bus used by engine.ts — on/off/emit and edge cases (unknown event, duplicate handlers, handler removal) are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used by engine.ts but never verified in any test. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file exists. `buildReels` is used by `src/engine.ts` (critical game engine path) but has no tests for reel count, row count handling, or `spinReel` integration. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Used in src/engine.ts with no coverage for empty reels, single scatter, or multi-reel scatter counting. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. Critical state mutation logic with 4 branches (activation, retrigger, decrement, deactivation) has zero test coverage. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic used by src/engine.ts has no coverage for happy path, edge cases (fewer than 4 diamonds, exactly 4, empty reels, mixed symbols), or boundary conditions. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 88% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item lists, and boundary roll exactly at cumulative threshold. Called by src/engine.ts, making this a production risk. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used in computePayout at line 108 to apply house edge multiplier. | [UNIQUE] Numeric constant, no duplicates found | [OK] Value 0.05 is arithmetically correct for a 5% edge; the defect is in its application inside computePayout, not the constant itself. | [LEAN] Named numeric constant, appropriate. | [NONE] No test file exists. HOUSE_EDGE affects computePayout behavior but is never tested. | [UNDOCUMENTED] Private module-level constant, no JSDoc. Value and effect on RTP are undocumented.
  - DEBUG_MODE: [USED] Used in spin function at line 171 to conditionally log debug output. | [UNIQUE] Boolean flag, no duplicates found | [OK] Constant correctly set to false. | [LEAN] Named boolean flag, appropriate. | [NONE] No test file exists. | [UNDOCUMENTED] Private constant, no JSDoc.
  - EngineContainer: [USED] Instantiated at line 29 as container; provides registry/resolve pattern for dependency injection. | [UNIQUE] Service container class, no semantic matches found | [OK] resolve() silently returns undefined cast to T for missing keys, but all three keys are registered at module load before any resolve call, so no reachable undefined-dereference path. | [OVER] DIY service-locator wrapping three already-imported module-level references in a string-keyed Map<string, unknown> with unsafe `as T` casts. The resolved values (weightedPick, getPayMultiplier, reels module) are statically imported at the top of the file and never swapped at runtime — direct references are strictly equivalent with zero indirection, zero runtime cost, and full type safety. The abstraction buys nothing. | [NONE] No test file exists. register/resolve contract and missing-key behavior are untested. | [UNDOCUMENTED] No class-level or method-level JSDoc. Purpose as a service-locator container and generic resolve semantics are not documented.
  - container: [USED] Registered with RNG, paytable, and reels at lines 30–32; resolved in spin at lines 117–119. | [UNIQUE] Instance variable, no duplicates found | [OK] Module-level init registers all required keys before use. | [LEAN] Single instantiation line; the over-engineering lives in EngineContainer. | [NONE] No test file exists. | [UNDOCUMENTED] Internal module singleton, no JSDoc. Role and registered keys undocumented.
  - PAYLINES: [USED] Used to evaluate line wins at line 139 and to extract line symbols at line 160 in spin function. | [UNIQUE] Payline array constant, no semantic matches found | [OK] Matches the 10-payline definition in the authoritative reference docs exactly. | [LEAN] Plain data constant for 10 fixed paylines. Appropriate. | [NONE] No test file exists. Payline layout correctness is never verified. | [UNDOCUMENTED] No JSDoc explaining row-index encoding or payline shape semantics.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Used in spinReel at L47 and returned by getReelSymbols at L53 | [UNIQUE] Data constant array. No similar definitions found. | [OK] Eight symbols match ReelWeightConfig keys and weightsToArray order. | [LEAN] Simple constant array of 8 symbol names. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported; name is clear, but no comment explaining its role as the canonical ordered symbol list used for reel indexing.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray 5 times in REEL_WEIGHTS initialization at L23–L27 | [UNIQUE] Data constant object. No similar definitions found. | [NEEDS_FIX] DIAMOND weight=30 (25% per cell) makes DIAMOND's expected line-bet contribution alone ~230%, violating the arbitrated 95% RTP target. | [ACCEPTABLE] Named config object is readable and matches documented weight table. Slight overhead from ReelWeightConfig indirection, but the named fields aid maintainability. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported. No comment explaining that weights sum to 120 or that all five reels share this distribution. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. The weights are structurally valid configuration values used correctly at reels.ts:23-27 via weightsToArray. The claim that DIAMOND=30 violates the 95% RTP target is mathematically sound (DIAMOND alone contributes ~230% expected payout), but this is a game-design balancing issue, not a code correctness defect. The weights don't cause crashes, data loss, or security breaches — they produce 'overly generous' payouts relative to a stated target. The ANCIENT_RTP=0.95 constant in paytable.ts:3 and the comment at engine.ts:99 are aspirational documentation, not enforced constraints. Additionally, computePayout at engine.ts:105 itself multiplies by (1+HOUSE_EDGE)=1.05 which INCREASES payout — showing the entire RTP calculation chain has multiple design inconsistencies, not an isolated weight defect. Changing DEFAULT_WEIGHTS is a behavioral change with no evidence of a bug.)
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Used in spinReel at L44 and getReelWeights at L57 | [UNIQUE] Data constant array initialization. No duplicates found. | [OK] Five reels each initialised with DEFAULT_WEIGHTS via weightsToArray; structure is correct. | [ACCEPTABLE] Five reels all sharing the same weight array could be expressed as a single array plus a repeat, but the explicit 2D layout is clear and matches the documented per-reel getter API. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported. No comment explaining the 5-reel structure or that all reels share identical weights.
  - pickFromWeighted: [USED] Called by spinReel at L47 to select weighted random symbols | [DUPLICATE] Identical weighted random selection algorithm. Same logic flow and fallback behavior; variable names differ (acc/cumulative, r/roll, wts/weights) but semantics are fully interchangeable. Score 0.823 with matching behavior in source. | [NEEDS_FIX] Math.random() is not certifiable for regulated gaming RNG; inferred slot-machine domain from reel/payline/jackpot/SCATTER/WILD vocabulary throughout the project. | [LEAN] Standard weighted random selection — minimal, correct, no unnecessary abstractions. | [NONE] No test file exists. This function uses Math.random() and has boundary behavior (last-item fallback) that warrant dedicated tests. | [UNDOCUMENTED] Private but non-trivial weighted-random algorithm. No JSDoc describing the selection logic, parameter contracts, or edge case (fallback to last item). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Verified reels.ts:30-41: the algorithm (sum weights, uniform random draw, cumulative accumulation, last-item fallback) is a correct implementation of weighted random selection. It produces valid results for all inputs seen in the codebase — SYMBOLS always has 8 elements (reels.ts:3-5), weights always has 8 values (reels.ts:12-15). The two sub-claims that triggered NEEDS_FIX are misclassified: (1) Math.random() non-certifiability is a security/compliance concern, not a correctness bug — the algorithm itself is mathematically correct regardless of RNG source. (2) Duplication with rng.ts:weightedPick belongs on the duplication axis, not correction. The function is the one actually called at runtime via spinReel (reels.ts:47 → factories.ts:12 → engine.ts:128).)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Internal constant referenced in getPayMultiplier function at line 15 | [UNIQUE] Pay multiplier lookup table. No duplicates found. | [OK] All six pay symbol rows exactly match the reference documentation multiplier table. | [LEAN] Fixed-at-load-time lookup table; tuple type precisely encodes the 3-of/4-of/5-of multipliers without unnecessary abstraction. | [NONE] No test file exists for this module. | [UNDOCUMENTED] Private constant — leniency applies — but the tuple indices [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] are implicit and not documented anywhere in the file. A single-line comment explaining the tuple layout would suffice.

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
