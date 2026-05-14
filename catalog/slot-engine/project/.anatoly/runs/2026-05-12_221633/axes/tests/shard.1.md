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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout math but is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false; dead code path is untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve logic and type-unsafe cast are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline coordinate data drives all win evaluation but is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. WILD-lead substitution, SCATTER short-circuit, and run-length cutoff logic are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null-return path are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists. HOUSE_EDGE inflation on wins, guaranteed 1% bet floor, and Math.ceil rounding are all untested. Called by spin which is the public entry point. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS drives all reel outcomes; untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Weight values directly control payout odds; correctness is untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Five-reel weight matrix is untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file. Critical weighted-random logic — boundary at r==total, single-item arrays, zero-weight items — all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file. Imported by src/factories.ts; out-of-range reelIndex would silently pass undefined weights to pickFromWeighted; untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file. Used by src/engine.ts; untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 88% | No test file. Used by src/engine.ts; out-of-bounds index returns undefined silently; untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant backing getPayMultiplier — untested indirectly and directly. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Imported by src/engine.ts and src/legacy.ts (critical payout paths), yet count=3/4/5 branches, unknown symbol fallback, and count<3 return-0 path are all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Class has non-trivial behavior: multi-listener registration, handler deduplication on off(), emit with args, and silent no-op paths — none are tested. Used by src/engine.ts, making coverage gaps impactful. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. String constant used as an event key in src/engine.ts; its correctness depends on integration tests that are also absent. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 78% | No test file exists. Used by src/engine.ts (core engine path), yet buildReels loop logic, reelCount/rowCount handling, and spinReel integration are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Missing coverage for: empty reels, single scatter, exactly 3, mixed symbols, nested empty columns. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 60% | No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger while active, decrement, expiry (remaining<=0), inactive state with <3 scatters. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 92% | No test file exists. Function has critical edge cases untested: single-item arrays, zero weights, negative weights, mismatched array lengths, floating-point precision, and boundary behavior when roll equals cumulative. Called by src/engine.ts, making this a gap in core engine coverage. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 88% | No test file found. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — happy path, boundary (exactly 4 vs 3 diamonds), empty reels, and mixed-symbol grids all untested. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Internal constant used in computePayout at L110 to adjust total payout. | [UNIQUE] Numeric constant. No similar definitions found. | [OK] Value 0.05 is correct; misapplication is in computePayout, not here. | [LEAN] Standard named constant for a magic number. | [NONE] No test file exists. HOUSE_EDGE directly affects payout math but is untested. | [UNDOCUMENTED] No JSDoc. Purpose and effect on payout calculation not documented inline.
  - DEBUG_MODE: [USED] Internal constant checked in spin function at L173 for debug logging. | [UNIQUE] Boolean constant. No similar definitions found. | [OK] Boolean constant, no issues. | [LEAN] Simple boolean flag; minimal. | [NONE] No test file exists. Constant is always false; dead code path is untested. | [UNDOCUMENTED] No JSDoc. Flag with no explanation of what debug behavior it enables.
  - EngineContainer: [USED] Internal class instantiated at L29 to create the container object. | [UNIQUE] Service locator implementation. No similar classes found. | [NEEDS_FIX] resolve() casts Map.get() result to T without checking for key absence; missing key silently propagates as undefined typed as T. | [OVER] Custom service-locator for 3 fixed dependencies (`rng`, `paytable`, `reels`) that could be imported directly. Uses `Map<string, unknown>` with unsafe casts. Single consumer (`spin`). Classic premature DI infrastructure in a simple game engine. | [NONE] No test file exists. register/resolve logic and type-unsafe cast are untested. | [UNDOCUMENTED] No JSDoc on class or its methods. Purpose as a service locator/DI container, and the typed resolve pattern, are undocumented.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Internal array iterated in spin loop at L132-L133 and accessed at L154 to extract line symbols. | [UNIQUE] Game payline configuration. No similar definitions found. | [OK] 10 paylines, row values all in [0,2], 5 elements each — consistent with a 5-reel 3-row grid. | [LEAN] Plain data array defining 10 paylines — appropriate for a slot engine. | [NONE] No test file exists. Payline coordinate data drives all win evaluation but is untested. | [UNDOCUMENTED] No JSDoc. Array semantics (row indices per reel column) and the 10-line layout are not explained.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted function call on line 44 | [UNIQUE] No similar constants found in RAG search. | [OK] Array of 8 symbols is correct and consistent with ReelWeightConfig ordering. | [LEAN] Plain array of 8 symbol literals. No unnecessary abstraction. | [NONE] No test file exists. SYMBOLS drives all reel outcomes; untested. | [UNDOCUMENTED] No JSDoc comment. Name and values are clear, but no explanation of role (master symbol pool used for reel picks).
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray in REEL_WEIGHTS initialization on lines 24-28 | [UNIQUE] No similar constants found in RAG search. | [OK] Weights sum to 120. Cannot verify RTP=95% claim from weights alone without the paytable (not in scope of this file); no standalone correctness defect identifiable here. | [LEAN] Simple object literal with one value per symbol. Appropriate. | [NONE] No test file. Weight values directly control payout odds; correctness is untested. | [UNDOCUMENTED] No JSDoc. The weight values (e.g. SEVEN: 5 vs DIAMOND: 30) encode non-obvious game design decisions — odds ratios — that warrant documentation.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Accessed in spinReel and getReelWeights exported functions | [UNIQUE] No similar constants found in RAG search. | [OK] 5 reels, each correctly constructed from DEFAULT_WEIGHTS via weightsToArray. | [OVER] All 5 entries are identical `weightsToArray(DEFAULT_WEIGHTS)` calls. Building a per-reel weight matrix when every reel currently uses the same weights is premature generalization. A single shared weight array (with per-reel lookup deferred until differentiation is actually needed) is sufficient. | [NONE] No test file. Five-reel weight matrix is untested. | [UNDOCUMENTED] No JSDoc. Purpose (per-reel weight matrix, one row per reel) and the implication that all 5 reels share identical weights are non-obvious and undocumented.
  - pickFromWeighted: [USED] Called in spinReel function loop on line 44 | [DUPLICATE] Identical weighted selection algorithm: both compute cumulative weights, apply random value, iterate to match threshold. Variable names differ (total/totalWeight, r/roll, acc/cumulative) but logic and control flow are equivalent. | [OK] Algorithm is correct: cumulative-weight selection with valid fallback. Previously overturned finding not re-flagged. | [LEAN] Textbook weighted-random selection. Linear scan is appropriate for 8 items. | [NONE] No test file. Critical weighted-random logic — boundary at r==total, single-item arrays, zero-weight items — all untested. | [UNDOCUMENTED] No JSDoc. Non-trivial weighted-random-selection algorithm; missing @param descriptions, @returns, and a note on fallback behavior (last item returned when floating-point rounding causes r >= total).

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported symbol referenced in getPayMultiplier (line 15) | [UNIQUE] Game-specific lookup table; no similar structures found in RAG results | [OK] Structure is consistent: three-element tuples map to 3-, 4-, 5-of-a-kind counts; getPayMultiplier accesses the correct indices. | [LEAN] Plain static lookup table. Tuple type [number,number,number] cleanly models the three pay tiers (3/4/5-of-a-kind) without unnecessary abstraction. | [NONE] No test file exists. Private constant backing getPayMultiplier — untested indirectly and directly. | [UNDOCUMENTED] No JSDoc. The tuple structure [number, number, number] maps to 3/4/5-of-a-kind multipliers, but this is not stated anywhere — readers must infer it from getPayMultiplier.

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
