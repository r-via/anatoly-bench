[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 10 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 91% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 95% | No test file exists. Type alias with no runtime behavior, but still untested. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. Critical constant affecting payout math — zero coverage. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior and type-unsafe resolve return untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline correctness (shape, uniqueness, index alignment) is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 80% | No test file exists. WILD substitution logic, SCATTER/WILD-only rejection, run counting, and run<3 cutoff are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file exists. Wild multiplier compounding (basePayout * (1+wc) * 2^wc) is a complex formula with zero test coverage. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists. House-edge application, the unconditional +bet*0.01 bonus, and Math.ceil rounding are untested. Comment claims RTP ~95% but edge is added on top of wins, inflating actual RTP — doc divergence risk. |
| `spin` | L113–L179 | 🔴 NONE | 92% | No test file exists. Exported to src/index.ts (production entry point). Bet validation, free-spin triggering, jackpot path, wildMultiplier aggregation, and strategy delegation are all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists for this module. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file exists. This function has critical edge cases worth testing: total=0, single-item array, boundary rounding, and uniform vs skewed weight distributions. |
| `spinReel` | L43–L50 | 🔴 NONE | 92% | No test file exists. Imported by src/factories.ts; untested stochastic behavior and out-of-bounds reelIndex access into REEL_WEIGHTS are unverified. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 92% | No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal constant backing getPayMultiplier; all six symbol rows untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts and src/legacy.ts — critical pay calculation path. Count branches (3/4/5), unknown symbol, and count < 3 return 0 all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts — identity pass-through behavior is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 85% | No test file exists. Methods on()/off()/emit() have zero coverage — including edge cases like duplicate handlers, off() on unknown events, emit() with no listeners, and multiple args propagation. Used by src/engine.ts making this a critical untested dependency. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant string used by src/engine.ts but never tested as an event name in integration scenarios. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class with no runtime logic, but its contract is untested. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts (critical path), yet buildReels loop logic and spinReel integration are completely untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts for core game logic; missing coverage of empty reels, single scatter, exactly 3 scatters, and mixed symbol grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Critical state machine with 4 branches (initial activation, re-trigger, decrement, deactivation at 0) — all untested. Used by src/engine.ts. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 91% | No test file exists. No coverage for happy path, edge cases (empty arrays, mismatched lengths, zero/negative weights, single-item), or the fallback return on L15. Used by src/engine.ts, making this a gap in critical path coverage. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Called by src/engine.ts — no coverage for threshold boundary (exactly 4 diamonds), fewer than 4, empty reels, or multi-column distribution. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout (L104): `total * (1 + HOUSE_EDGE)`. | [UNIQUE] Module-level constant with no RAG matches. | [OK] Constant value 0.05 is correct; the defect is in computePayout's use of it. | [LEAN] Named constant replacing a magic number. | [NONE] No test file exists. Critical constant affecting payout math — zero coverage. | [UNDOCUMENTED] Internal constant with no JSDoc. The value 0.05 and its application (applied only when total > 0, then added to rather than subtracted from payout) are non-obvious and undocumented.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded to false; the guarded block in spin (L165-167) is permanently dead and never executes. | [UNIQUE] Module-level constant with no RAG matches. | [OK] Boolean debug flag; no correctness defect. | [LEAN] Simple compile-time boolean flag. | [NONE] No test file exists. | [UNDOCUMENTED] Internal flag with no JSDoc. Self-descriptive name and trivial use; low severity.
  - EngineContainer: [USED] Instantiated at L29 to create `container`, which is used in spin to resolve paytable, rng, and reelsModule. | [UNIQUE] Registry/IoC class with no RAG matches. | [OK] resolve() returns undefined-cast-as-T for missing keys, but all three keys resolved in spin() are registered at construction time. | [OVER] Hand-rolled IoC container (string-keyed Map<string,unknown>, type-unsafe resolve<T> cast) wrapping three statically-imported symbols used only inside spin(). Direct invocation of weightedPick, getPayMultiplier, getReelSymbols, and getReelWeights is simpler and fully type-safe. Single file, single consumer — no runtime substitution is ever performed. | [NONE] No test file exists. register/resolve behavior and type-unsafe resolve return untested. | [UNDOCUMENTED] Non-exported DI/service-locator class with no JSDoc. Neither the class nor its register/resolve methods are documented; the resolve cast-to-T pattern and lack of missing-key handling are undescribed.
  - container: [USED] Populated at L30-32 and resolved in spin (L118-120); paytable resolved value is actively passed to evaluateLine. | [UNIQUE] Singleton instance with no RAG matches. | [OK] Registers all keys consumed by spin(); initialization is consistent. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. Module-level singleton wiring is untested. | [UNDOCUMENTED] Module-level singleton with no JSDoc. Its role as the engine's service registry is implicit.
  - PAYLINES: [USED] Iterated in spin (L134-136) and used again at L153 for wild multiplier computation. | [UNIQUE] Data constant with no RAG matches. | [OK] Matches reference documentation exactly. | [LEAN] Static data literal for 10 fixed paylines. No abstraction overhead. | [NONE] No test file exists. Payline correctness (shape, uniqueness, index alignment) is untested. | [UNDOCUMENTED] No JSDoc describing what each row-index array represents, the coordinate convention (col→row), or the 10-line layout. The shape patterns (V, zigzag, etc.) are entirely uncommented.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls (L37, L40) and returned by getReelSymbols (L53). | [UNIQUE] No similar constants found in RAG results. | [OK] Eight-symbol array order is consistent with weightsToArray and documented symbol set. | [LEAN] Simple string-literal array; straightforward constant. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Purpose is inferable from name but no comment explains its role as the canonical ordered symbol list used for reel indexing.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27). | [UNIQUE] No similar constants found in RAG results. | [OK] Weights sum to 120 and match the documented distribution exactly. | [ACCEPTABLE] Named fields improve readability over a bare array, but the value is only consumed by weightsToArray which discards the names. Slightly over-specified given the pattern, but the documentation benefit is real. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Weight values (e.g. DIAMOND: 30 as highest) and the total-sum baseline are non-obvious and undocumented.
  - weightsToArray: [USED] Called five times to build REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar functions found per RAG results. | [OK] Emission order [CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER] matches SYMBOLS array order; correctly parallel. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists for this module. | [UNDOCUMENTED] Internal non-exported helper, <10 lines, name describes behavior. Tolerated per private-helper leniency rule.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and getReelWeights (L57). | [UNIQUE] No similar constants found in RAG results. | [OK] Five reels, each initialized from DEFAULT_WEIGHTS; consistent with all five reels sharing the same distribution per docs. | [ACCEPTABLE] Five separate identical arrays allow future per-reel differentiation. Docs confirm all reels share the same weights with no runtime setter, so this is mildly redundant now, but the structure is a one-time declaration and not harmful. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The 5-reel structure and the fact that all reels share identical weights are non-obvious without a comment.
  - pickFromWeighted: [USED] Called inside spinReel loop (L47). | [DUPLICATE] Identical weighted-random-selection algorithm: sum weights, roll Math.random() * total, accumulate until roll < cumulative, return last item as fallback. Only differences are variable names and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol — no behavioral distinction. | [NEEDS_FIX] Math.random() is non-certifiable for regulated gaming RNG in this slot-machine context. | [LEAN] Standard O(n) weighted random pick; minimal and correct for the task. | [NONE] No test file exists. This function has critical edge cases worth testing: total=0, single-item array, boundary rounding, and uniform vs skewed weight distributions. | [UNDOCUMENTED] Non-exported helper. Name and signature are clear, but the weighted-random algorithm and edge-case fallback (last item) are undocumented. Slightly over 10 lines; minor concern. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. pickFromWeighted (reels.ts:30-41) is algorithmically correct: cumulative-weight sampling with proper fallback at L40. The NEEDS_FIX was based solely on duplication with weightedPick in rng.ts — but duplication is not a correction defect. The function produces correct weighted random selections. The original review itself acknowledged this at src-reels.rev.md: 'Correction [OK]: Correctly iterates 3 rows and delegates to pickFromWeighted with the correct SYMBOLS and per-reel weights.' Duplication belongs on the duplication axis, not correction.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported. Referenced in getPayMultiplier (L15) via PAY_TABLE[symbol]. | [UNIQUE] No similar data structure found in RAG results. | [OK] All multipliers match the reference documentation table exactly for every symbol and run length. | [LEAN] Flat record mapping symbol names to fixed tuple of three multipliers. No abstraction beyond what the domain requires. | [NONE] No test file exists. Internal constant backing getPayMultiplier; all six symbol rows untested. | [UNDOCUMENTED] Private constant so leniency applies, but the 3-tuple semantics (3-of-a-kind / 4-of-a-kind / 5-of-a-kind multipliers) are non-obvious from the type alone and have no inline or block comment explaining them.

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
