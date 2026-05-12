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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout math but is never verified in isolation or via computePayout tests. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Flag controls console.log branch in spin(); branch is never exercised by tests. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve methods, type-cast behavior, and missing-key silent undefined return are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is never validated. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. The 10 payline definitions and their row-index correctness are never asserted. |
| `checkLine` | L47–L64 | 🔴 NONE | 92% | No test file exists. Critical logic paths untested: all-WILD sequences, SCATTER early-return, leading WILD resolved to first non-WILD, run < 3 returning null, run == 3 boundary. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 88% | No test file exists. Wild-count multiplier formula (basePayout * (1+wc) * 2^wc) and null propagation from checkLine are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists. Exported public function with a doc comment claiming 95% RTP; HOUSE_EDGE application (multiplies on win, not house edge reduction), the +1% floor on bet, and Math.ceil rounding are all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Constant defines the full symbol set used by engine and reels logic. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists. Weight values directly affect payout odds — untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. Five-reel weight matrix is entirely untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file exists. Core probability logic — boundary condition where r equals accumulated weight, zero-weight items, and single-item arrays are all uncovered. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file exists. Imported by src/factories.ts; untested for invalid reelIndex (undefined weights), correct column length of 3, and symbol membership. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file exists. Imported by src/engine.ts; returns shared mutable array reference — mutation side-effects untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 75% | No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard — untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant but its correctness is critical — wrong multiplier values would silently corrupt all payout logic. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by engine.ts and legacy.ts — a critical payout path. No coverage of valid counts (3/4/5), unknown symbols returning 0, or count values outside the 3–5 range. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 88% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 80% | No test file exists. Critical methods on()/off()/emit() are untested — no coverage of multi-listener dispatch, handler deregistration, unknown-event emit, or argument forwarding. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is consumed by src/engine.ts but no test verifies its value or that it is used as the correct event key. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 55% | No test file exists. buildReels is imported by src/engine.ts (production critical path) and has no coverage — reelCount iteration, spinReel delegation, and returned Symbol[][] shape are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, single-reel input. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Missing coverage for: inactive→active transition (scatters>=3), re-trigger while active, decrement, deactivation at remaining<=0, and inactive with scatters<3 (no-op). |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic used by src/engine.ts has zero coverage — no tests for threshold boundary (exactly 4 diamonds), fewer than 4, more than 4, empty reels, or mixed symbol grids. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 90% | No test file exists. Critical gaming RNG logic with no coverage: unequal weight distribution, single-item arrays, boundary roll (roll === 0, roll === totalWeight - epsilon), and the fallback return on L15 are all untested. Called by src/engine.ts, making this a high-risk gap. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used in computePayout at line 108 to apply edge adjustment to total payout. | [UNIQUE] Simple numeric constant. No similar constants found. | [OK] Value 0.05 is correct; the defect is in computePayout's misapplication of this constant. | [LEAN] Named constant for a magic number used in payout calculation. | [NONE] No test file exists. HOUSE_EDGE directly affects payout math but is never verified in isolation or via computePayout tests. | [UNDOCUMENTED] No JSDoc. Purpose and effect on RTP are only inferable from computePayout's comment, not from the constant itself.
  - DEBUG_MODE: [USED] Checked at line 177 in spin function to conditionally log debug output. | [UNIQUE] Simple boolean constant. No similar constants found. | [OK] Boolean false constant; no correctness issues. | [LEAN] Single boolean flag guarding a debug log. Trivial even though hardcoded to false. | [NONE] No test file exists. Flag controls console.log branch in spin(); branch is never exercised by tests. | [UNDOCUMENTED] No JSDoc. Private constant — tolerable, but name alone doesn't document what debug output is produced.
  - EngineContainer: [USED] Instantiated once at line 29; provides service-locator pattern for RNG, paytable, and reels modules. | [UNIQUE] Service locator/DI container class with register and resolve methods. No similar classes found. | [NEEDS_FIX] resolve() silently returns undefined typed as T for unregistered keys instead of throwing. | [OVER] Hand-rolled DI container (`register`/`resolve<T>`) used exclusively in this file to store 3 values that could be referenced directly. Loses all type safety via `Map<string, unknown>` + unsafe cast. Additionally, the registered `reels` module is resolved inside `spin` but never actually used — `factory.buildReels` is called instead. | [NONE] No test file exists. register/resolve methods, type-cast behavior, and missing-key silent undefined return are untested. | [UNDOCUMENTED] No class-level JSDoc. Purpose (service locator / DI container), lifetime, and type-safety caveats of resolve<T> are undocumented. Neither method has JSDoc.
  - container: [USED] Registered with three dependencies and resolved three times in spin function at lines 116–118. | [UNIQUE] Singleton instantiation of EngineContainer. No similar instantiations found. | [OK] Container registrations are correct; usage bugs are in spin(). | [LEAN] Trivial instantiation; overengineering lives in `EngineContainer`. | [NONE] No test file exists. Module-level singleton wiring is never validated. | [UNDOCUMENTED] Module-level singleton with no comment explaining its role as the engine's dependency registry.
  - PAYLINES: [USED] Iterated at line 159 to evaluate all paylines; accessed at line 167 to compute wild multiplier. | [UNIQUE] Constant data structure defining slot machine paylines. No similar constants found. | [OK] All row indices in [0,2] for a 3-row grid; 10 paylines correctly formed. | [LEAN] Static data table for slot paylines — appropriate for the domain. | [NONE] No test file exists. The 10 payline definitions and their row-index correctness are never asserted. | [UNDOCUMENTED] No JSDoc. The coordinate system (row indices per column, grid dimensions) and payline layout are non-obvious and completely undocumented.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in spinReel (line 47) and getReelSymbols (line 53) | [UNIQUE] Array of symbol type values. No similar constants found. | [OK] Eight-element symbol array correctly ordered and consistent with ReelWeightConfig and weightsToArray. | [LEAN] Plain array of symbol names. No unnecessary abstraction. | [NONE] No test file exists. Constant defines the full symbol set used by engine and reels logic. | [UNDOCUMENTED] No JSDoc comment. Purpose as the master symbol registry is not self-evident from the constant name alone.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray 5 times in REEL_WEIGHTS initialization (lines 23–27) | [UNIQUE] Configuration constant for default reel weights. No duplicates found. | [OK] Weights are valid positive integers; without paytable data, DIAMOND's high weight (30) cannot be confirmed as a correctness defect under rule 12. | [LEAN] Simple object literal assigning weights. No abstraction beyond what's needed. | [NONE] No test file exists. Weight values directly affect payout odds — untested. | [UNDOCUMENTED] No JSDoc. Missing explanation of what these weight values mean (e.g. relative frequency units), how they sum, or that they apply uniformly to all five reels.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Accessed in spinReel (line 44) and getReelWeights (line 57) | [UNIQUE] 2D array of weight configurations for 5 reels. No similar constants found. | [OK] Five reels, each built via weightsToArray(DEFAULT_WEIGHTS); structurally correct. | [ACCEPTABLE] Per-reel weight arrays are a standard slot mechanic that enables future per-reel tuning. All 5 entries being identical is redundant right now, but the structure is justified by the domain. | [NONE] No test file exists. Five-reel weight matrix is entirely untested. | [UNDOCUMENTED] No JSDoc. The structure (5 reels × 8 weights, index-aligned with SYMBOLS) and the decision to use identical weights for all reels are both undocumented.
  - pickFromWeighted: [USED] Called in spinReel loop (line 47) | [DUPLICATE] Identical weighted random selection logic to weightedPick. Both accumulate weights and return item when threshold exceeded. | [OK] Algorithm correct per prior tier-3 deliberation; fallback at L40 handles floating-point edge case. | [LEAN] Canonical O(n) weighted random selection. Clean and correct. | [NONE] No test file exists. Core probability logic — boundary condition where r equals accumulated weight, zero-weight items, and single-item arrays are all uncovered. | [UNDOCUMENTED] No JSDoc on an internal but non-trivial weighted random selection algorithm. Missing: parameter descriptions, return semantics, and the fallback behavior on the last item.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant referenced locally in getPayMultiplier (line 15). Required for function operation. | [UNIQUE] Unique lookup table mapping symbols to payout values; no similar structures found | [OK] Tuple layout [3-match, 4-match, 5-match] is consistent with getPayMultiplier's index access pattern. | [LEAN] Flat record mapping symbol names to 3-count payout tuples. No unnecessary abstraction; direct data structure for a fixed paytable. | [NONE] No test file exists. Private constant but its correctness is critical — wrong multiplier values would silently corrupt all payout logic. | [UNDOCUMENTED] No JSDoc comment. The tuple layout [3-match, 4-match, 5-match] multipliers is not documented; readers must infer the index semantics from getPayMultiplier.

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
