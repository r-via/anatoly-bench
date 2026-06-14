[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 10 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 90% | No test file exists for this module. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE affects payout computation but is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior, type-safety gaps, and missing-key behavior are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive all win evaluation; correctness is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 92% | No test file exists. WILD-lead resolution, SCATTER short-circuit, run counting, and minimum-run threshold (3) are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 82% | No test file exists. Wild-count multiplier formula and payout calculation are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file exists. House-edge application, flat bet bonus, zero-win path, and Math.ceil rounding are untested. Exported and used by spin; critical business logic. |
| `spin` | L113–L179 | 🔴 NONE | 92% | No test file exists. Input validation (invalid bet throws, >100 warns), reel construction, payline evaluation, scatter/free-spin wiring, jackpot detection, and event emission are all untested. Primary public API imported by src/index.ts. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Array content and ordering are untested despite being critical to weighted selection alignment. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Default weight values (sum, individual entries) are untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file. Ordering of returned array relative to SYMBOLS array is untested — a mismatch would silently corrupt probability distribution. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Shape (5 reels, 8 weights each) and values are untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file. Core probability logic is entirely untested: boundary conditions (r == 0, r just below total), uniform weights, single-item list, and the fallback return on the last item are all uncovered. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file. Called by src/factories.ts; return shape (array of 3 Symbols), valid symbol membership, and out-of-range reelIndex behavior are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Used by src/engine.ts; returned reference equality (mutability hazard) and array contents are untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file. Used by src/engine.ts; out-of-range reelIndex (returns undefined) and returned array mutability are untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. PAY_TABLE drives all payout calculations; zero coverage. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Imported by src/engine.ts and src/legacy.ts — a critical payout path with no direct tests. Edge cases (unknown symbol, count < 3, count > 5, each valid count 3/4/5 per symbol) are all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts, making untested identity-passthrough behavior a risk for downstream engine tests. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 88% | No test file exists. Critical class used by src/engine.ts with on/off/emit methods — none are tested. Missing coverage for: multiple handlers, handler removal, emit with args, emit with no registered handlers, duplicate handler registration. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. String constant imported by src/engine.ts; no tests verify it is used correctly as an event name. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract base class with no runtime behavior beyond interface contract, but the contract itself is untested. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 82% | No test file exists. Concrete implementation used by src/engine.ts — buildReels loop logic and spinReel delegation are completely untested, including edge cases like reelCount=0 or varying rowCount. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. No coverage for scatter counting across reels, empty reels, zero scatters, or mixed symbol grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. All branches untested: initial activation (scatters>=3), retrigger while active, decrement, and deactivation on remaining<=0. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 92% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, all-zero weights, single-item input, and boundary roll == cumulative. Called by src/engine.ts, making this a production code path with zero test coverage. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic called by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), under-threshold, and empty reel cases all untested. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout to scale total payout upward. | [UNIQUE] Module-scoped numeric constant. No similar symbols found. | [OK] Constant value 0.05 is correct; the misapplication lives in computePayout, not here. | [LEAN] Simple named constant. | [NONE] No test file exists. HOUSE_EDGE affects payout computation but is never tested. | [UNDOCUMENTED] No JSDoc. Internal constant; name conveys intent but the exact effect on payout math is undocumented.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded false makes the guarded console.log block permanently unreachable; the constant is referenced but never toggleable at runtime. | [UNIQUE] Module-scoped boolean constant. No similar symbols found. | [OK] Used correctly in the in-file conditional log in spin(); no defect. | [LEAN] Simple named constant. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Internal flag; self-descriptive name, tolerable as a private constant.
  - EngineContainer: [USED] Instantiated as module-level container at L29; its resolve method is called in spin. | [UNIQUE] Local DI container class. No similar symbols found. | [OK] resolve() casts unknown to T without a missing-key guard, but all three registered keys have matching resolve() calls in spin() — no concrete missing-key dereference path exists. | [OVER] Bespoke DI container (register/resolve via Map) built for 3 static module-level imports that never change at runtime. Direct usage of the imported functions (weightedPick, getPayMultiplier, getReelSymbols/getReelWeights) would be equivalent and clearer. Adds string-keyed indirection and an unsafe cast (as T) with zero payoff. | [NONE] No test file exists. register/resolve behavior, type-safety gaps, and missing-key behavior are untested. | [UNDOCUMENTED] No JSDoc on class or either method. Purpose as a DI registry is non-obvious from name alone.
  - container: [USED] resolve called three times in spin; paytable resolution is functionally needed. rng and reelsModule are resolved but unused, so the container provides only partial value, but it is actively referenced. | [UNIQUE] Module-scoped singleton instance. No similar symbols found. | [OK] All three registrations match their resolve() calls in spin(); no defect. | [LEAN] Straightforward instantiation of EngineContainer; over-engineering source is the class definition, not this consumer. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Internal module-level singleton; no comment explaining what it holds or why.
  - PAYLINES: [USED] Iterated in spin's main win-detection loop and again in the wild-multiplier accumulation block. | [UNIQUE] Static payline configuration data. No similar symbols found. | [OK] Matches reference documentation verbatim. | [LEAN] Static data table; no abstraction needed or added. | [NONE] No test file exists. Payline definitions drive all win evaluation; correctness is untested. | [UNDOCUMENTED] No JSDoc explaining row-index encoding, coordinate system, or the meaning of each pattern.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls (L48, L53) and returned by getReelSymbols (L53). | [UNIQUE] No similar constants found in RAG results. | [OK] Array contains exactly 8 symbols matching ReelWeightConfig keys and documentation. | [LEAN] Simple typed array of the eight symbol identifiers. No unnecessary abstraction. | [NONE] No test file exists. Array content and ordering are untested despite being critical to weighted selection alignment. | [UNDOCUMENTED] No JSDoc. Non-exported module constant with no description of purpose or intended use.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27). | [UNIQUE] No similar constants found in RAG results. | [OK] Weights sum to 120 (25+25+15+10+5+30+5+5), matching the documented total in both reference docs. | [LEAN] Plain object literal mapping each symbol to its weight. Minimal and clear. | [NONE] No test file. Default weight values (sum, individual entries) are untested. | [UNDOCUMENTED] No JSDoc. No description of what these defaults represent, their sum (120), or how they affect probability distribution.
  - weightsToArray: [USED] Called five times to populate REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar functions found in RAG results. | [OK] Emission order matches SYMBOLS array order; no correctness issues. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file. Ordering of returned array relative to SYMBOLS array is untested — a mismatch would silently corrupt probability distribution. | [UNDOCUMENTED] Non-exported internal helper under 10 lines with a clear name. Tolerated per internal-helper leniency rule, but no JSDoc present.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and getReelWeights (L57). | [UNIQUE] No similar constants found in RAG results. | [OK] Five reels all correctly initialized from DEFAULT_WEIGHTS via weightsToArray. | [ACCEPTABLE] Five identical weight arrays. Redundant today (docs confirm all reels share the same distribution), but the per-index structure is justified by the exported getReelWeights(reelIndex) API, which implies per-reel override is a supported use case. | [NONE] No test file. Shape (5 reels, 8 weights each) and values are untested. | [UNDOCUMENTED] No JSDoc. No description of the 5-reel structure, index mapping, or that all reels currently share DEFAULT_WEIGHTS.
  - pickFromWeighted: [USED] Called inside spinReel loop (L48) to select each symbol. | [DUPLICATE] Logic is ~95% identical to weightedPick in src/rng.ts: both sum weights, draw Math.random()*total, accumulate in a loop, and return items[items.length-1] as fallback. Only differences are variable names and that pickFromWeighted pins the type to Symbol[] while weightedPick is generic <T>. The functions are interchangeable for any Symbol[] call site. | [NEEDS_FIX] Uses Math.random() — not certifiable for regulated gaming RNG (slot-machine domain inferred from reel/paytable/jackpot/SCATTER/WILD vocabulary and RTP target). The weighted-selection logic itself is mathematically correct; the fallback on L40 is unreachable but harmless. | [LEAN] Textbook weighted-random selection. Correct single-pass algorithm, no unnecessary abstraction. | [NONE] No test file. Core probability logic is entirely untested: boundary conditions (r == 0, r just below total), uniform weights, single-item list, and the fallback return on the last item are all uncovered. | [UNDOCUMENTED] Non-exported but non-trivial (weighted random sampling algorithm). No JSDoc explaining the algorithm, the contract that wts.length must equal items.length, or the fallback return on floating-point edge cases. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. Compared reels.ts:30-41 with rng.ts:5-16 line-by-line: both implement identical cumulative-weight sampling (sum weights, draw Math.random()*total, walk accumulating weights, return on first r < acc, fallback to last item). The duplication is factual — only differences are variable names and generic vs concrete type parameter. However, duplication is a maintenance concern belonging to the duplication axis, not a correctness defect. pickFromWeighted is algorithmically correct and correctly called at reels.ts:47 inside spinReel. No behavioral bug exists.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported; referenced in getPayMultiplier (L15) via PAY_TABLE[symbol]. | [UNIQUE] No similar data structures found in RAG results. | [OK] All six rows exactly match the reference documentation paytable. | [LEAN] Flat Record with fixed tuple values — the most direct representation for a static 6×3 paytable. | [NONE] No test file exists. PAY_TABLE drives all payout calculations; zero coverage. | [UNDOCUMENTED] Non-exported internal constant; tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is not annotated anywhere. Lenient given private scope, but the tuple semantics are not self-evident.

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
