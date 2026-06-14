[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 10 | 90% | [details](#srcenginets) |
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
| `Bet` | L12–L12 | 🔴 NONE | 90% | No test file exists. Type alias with no runtime behavior, but its constraints (used as bet validation input in spin) are untested. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file. HOUSE_EDGE=0.05 is applied in computePayout but the effect (inflating wins by 5%) is never verified. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file. Constant is always false; no test verifies the conditional logging branch. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file. register/resolve round-trip, missing-key behavior, and type-cast safety are all untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file. Module-level singleton wiring of rng, paytable, and reels is never exercised in isolation. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file. The 10 payline definitions (shape, row indices, boundary values) are never validated. |
| `checkLine` | L47–L64 | 🔴 NONE | 70% | No test file. Critical logic paths untested: leading WILD resolution, SCATTER short-circuit, run < 3 rejection, mixed WILD+symbol runs. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 70% | No test file. Wild multiplier formula (basePayout * (1+wc) * 2^wc) and null-passthrough from checkLine are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file. Exported and business-critical: house-edge inflation on wins, the flat 1% bet bonus on every spin, and Math.ceil rounding are all untested. The house-edge comment claims ~95% RTP but the formula actually increases payouts, contradicting the stated intent. |
| `spin` | L113–L179 | 🔴 NONE | 90% | No test file. Primary exported entry point imported by src/index.ts. Input validation (non-number, float, <1, >100), reel evaluation, scatter/free-spin wiring, jackpot flag, wildMultiplier accumulation, and strategy.adjustPayout delegation are all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists. Key logic: maps config fields to a fixed-order array; wrong field order would silently corrupt weights. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file. Core probabilistic logic with boundary conditions (r exactly at boundary, all-zero weights, single item) is entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 93% | No test file. Imported by src/factories.ts — a critical path. Out-of-bounds reelIndex returns undefined weights silently. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file. Imported by src/engine.ts; invalid reelIndex returns undefined with no guard. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Module-private table drives all payout logic; untested indirectly or directly. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file. Called by src/engine.ts and src/legacy.ts — critical payout path with zero test coverage. Missing: unknown symbol (returns 0), count < 3 (returns 0), counts 3/4/5 for each symbol, boundary behavior. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 88% | No test file found. Used by src/engine.ts, making untested pass-through behavior a gap in engine-level coverage. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 90% | No test file exists. Critical class used by src/engine.ts; on/off/emit methods and multi-handler dispatch, handler removal, and unknown-event paths are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used by src/engine.ts; its integration with SpinEventEmitter event dispatch is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class with no runtime behavior beyond interface contract, but concrete subclasses are untested. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is used by `src/engine.ts` (core path) but has zero coverage — reel count loop, `spinReel` delegation, and `_rowCount` being unused are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Symbol is called by src/engine.ts but has zero test coverage. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. Critical state-mutation logic (activation, re-trigger, decrement, deactivation) is entirely untested. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical business logic (jackpot detection) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, fewer than 4 diamonds). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Zero coverage of happy path, edge cases (empty arrays, single item, zero weights, negative weights, mismatched array lengths), or the off-by-one boundary where roll equals cumulative weight. Called by src/engine.ts, making this an untested critical path. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced at L105 inside computePayout to scale the total payout. | [UNIQUE] No similar constant found in RAG results. | [OK] Value 0.05 correctly represents the 5% house edge; the misapplication belongs to computePayout. | [LEAN] Named magic-number constant; minimal and appropriate. | [NONE] No test file. HOUSE_EDGE=0.05 is applied in computePayout but the effect (inflating wins by 5%) is never verified. | [UNDOCUMENTED] No JSDoc. Private module constant; its purpose is mentioned only inside computePayout's JSDoc, not at the declaration site.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded false; the guarded branch at L162 can never execute. Functions as a permanent dead-code gate with no runtime effect. | [UNIQUE] No similar constant found in RAG results. | [OK] Constant is false; guarded console.log never executes. No correctness issue. | [LEAN] Simple boolean flag. The dead-code path it guards is a code-quality issue, not an abstraction problem. | [NONE] No test file. Constant is always false; no test verifies the conditional logging branch. | [UNDOCUMENTED] No JSDoc. Private flag with self-explanatory name; low documentation concern but still bare.
  - EngineContainer: [USED] Instantiated at L29 to create the module-level container. | [UNIQUE] No similar class found in RAG results. | [OK] resolve returns undefined-cast-to-T for missing keys, but all three registered keys are consumed correctly in-file. | [OVER] Hand-rolled IoC/DI container (Map-backed register/resolve) for three items that are already directly imported at the top of the same file. Two of the three resolved values (`rng`, `reelsModule`) are never actually used in `spin` — the factory bypasses `reelsModule` entirely. Zero configurability benefit in a single-file scope; direct references would be simpler and type-safe without casting. | [NONE] No test file. register/resolve round-trip, missing-key behavior, and type-cast safety are all untested. | [UNDOCUMENTED] No JSDoc on class, register(), or resolve(). Internal DI container; purpose and lifetime are non-obvious without docs.
  - container: [USED] Registered with rng/paytable/reels at L30-32; resolved inside spin at L122-124. paytable resolution is actively used in evaluateLine. | [UNIQUE] No similar variable found in RAG results. | [OK] Container registered with three keys; no correctness issue. | [LEAN] Straightforward instantiation and population of EngineContainer; the abstraction source is flagged on the class itself. | [NONE] No test file. Module-level singleton wiring of rng, paytable, and reels is never exercised in isolation. | [UNDOCUMENTED] No JSDoc. Module-level singleton with non-obvious role as the DI registry for the engine.
  - PAYLINES: [USED] Iterated in spin at L137 and indexed at L138 and L165. | [UNIQUE] No similar data constant found in RAG results. | [OK] All ten payline definitions match the reference documentation exactly. | [LEAN] Static data table for 10 fixed paylines; exactly the right representation. | [NONE] No test file. The 10 payline definitions (shape, row indices, boundary values) are never validated. | [UNDOCUMENTED] No JSDoc. The row-index encoding of each payline path is non-trivial; without comments each array entry is opaque.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls (L49) and returned by getReelSymbols (L53). | [UNIQUE] No similar constants found in RAG results. | [OK] Array order matches weightsToArray and docs exactly; no correctness issues. | [LEAN] Plain array of enum-like string literals. Minimal and appropriate. | [NONE] No test file exists for this module. | [UNDOCUMENTED] Internal constant with no JSDoc. Name is clear but no comment explaining role or valid values.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27). | [UNIQUE] No similar constants found in RAG results. | [NEEDS_FIX] DIAMOND weight 30 (P=0.25/cell) makes DIAMOND winning combinations alone contribute ~229% RTP, violating the arbitrated 95% target. | [LEAN] Straightforward data constant; complexity belongs to the type, not the value. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The specific numeric weight values and their probabilistic interpretation are non-obvious and worth documenting.
  - weightsToArray: [USED] Called five times to build REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar functions found per RAG results. | [OK] Field extraction order matches SYMBOLS exactly; no correctness issues. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. Key logic: maps config fields to a fixed-order array; wrong field order would silently corrupt weights. | [UNDOCUMENTED] Internal helper, <10 lines, clear name. Tolerated as undocumented per internal-helper leniency rule.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and getReelWeights (L57). | [UNIQUE] No similar constants found in RAG results. | [OK] Five reels with identical DEFAULT_WEIGHTS matches documented configuration. | [ACCEPTABLE] Five identical arrays instead of a shared reference. Docs confirm all reels use the same weights and per-reel customization requires forking the file, so the per-reel array structure is not providing runtime extensibility. Minor overhead but a defensible slot-machine convention. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Shape (5 reels × 8 weights) and the fact that all reels share DEFAULT_WEIGHTS is non-obvious without a comment.
  - pickFromWeighted: [USED] Called inside spinReel loop (L49). | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: both sum total weight, multiply Math.random() by total, accumulate in a loop, and return items[items.length-1] as fallback. Only differences are variable names and that pickFromWeighted is typed to Symbol[] while weightedPick is generic. The two functions are fully interchangeable. | [NEEDS_FIX] Math.random() is not a certifiable RNG for regulated slot-machine gaming. | [LEAN] Textbook weighted-random implementation. Single responsibility, no unnecessary abstraction. | [NONE] No test file. Core probabilistic logic with boundary conditions (r exactly at boundary, all-zero weights, single item) is entirely untested. | [UNDOCUMENTED] Internal, not exported, but the weighted-random-sampling algorithm is non-trivial. No JSDoc explaining the contract or edge cases. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 is logically identical to weightedPick in src/rng.ts:5-16 (same cumulative-weight scan, same Math.random() * total, same fallback to last element). Duplication is confirmed. However, duplication is not a correctness defect — pickFromWeighted produces correct weighted-random results. No bug, no wrong output, no crash. The correction axis should be OK; the duplication concern belongs on the duplication axis (which was not escalated). Reclassified from NEEDS_FIX to OK.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant referenced in getPayMultiplier (L15). | [UNIQUE] Module-local lookup table. No similar structure found in RAG. | [OK] All multiplier triples match the reference documentation table exactly. | [LEAN] Plain Record lookup with fixed 6-entry tuple rows — correct data structure for a static paytable. | [NONE] No test file exists. Module-private table drives all payout logic; untested indirectly or directly. | [UNDOCUMENTED] Private constant with no JSDoc. The three-element tuple structure (index 0 = 3-of-a-kind, 1 = 4-of-a-kind, 2 = 5-of-a-kind) is implicit and undocumented. Being lenient since it is non-exported, but the tuple semantics are non-obvious.

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
