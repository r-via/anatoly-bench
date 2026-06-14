[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 92% | [details](#srcenginets) |
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
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. Constant directly affects payout calculations but is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Trivial constant but still uncovered. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior and type-unsafe cast are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions are untested; incorrect row indices would silently corrupt all win evaluations. |
| `checkLine` | L47–L64 | 🔴 NONE | 92% | No test file exists. Critical logic (WILD substitution, leading WILD fallback, SCATTER guard, run counting) has no coverage. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 90% | No test file exists. Wild multiplier formula (exponential bonus) and null-propagation from checkLine are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists. House-edge application, minimum-bet floor addition, and Math.ceil rounding are all untested. Exported and business-critical. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Array contents and ordering are untested, yet symbol order implicitly couples to REEL_WEIGHTS index alignment. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 90% | No test file. Weight values (e.g. DIAMOND=30 highest, SEVEN/WILD/SCATTER=5) are untested and silently affect RTP/odds. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file. Order of array elements must match SYMBOLS order exactly; this coupling is never verified. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Five identical reel weight arrays are assumed; homogeneity and length (5 reels × 8 symbols) are untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 90% | No test file. Critical gambling logic: distribution correctness, boundary at r===acc, and fallback return are all untested. Math.random seeding is not mocked anywhere. |
| `spinReel` | L43–L50 | 🔴 NONE | 85% | No test file. Imported by src/factories.ts making it a critical code path. Return length (3 rows), valid symbol membership, and out-of-bounds reelIndex behavior are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Imported by src/engine.ts; returned array identity and contents are untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 85% | No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently — untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant; coverage only via getPayMultiplier tests, which also don't exist. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Used by engine.ts and legacy.ts — critical business logic (payout calculation) with zero test coverage. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, so untested pass-through behavior in a critical path. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 78% | No test file exists. Critical behaviors untested: on() accumulating multiple handlers, off() removing only the target handler, emit() invoking all handlers with args, emit() on unknown event, off() on unknown event, and duplicate handler registration. Used by src/engine.ts, making this a meaningful coverage gap. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant string used as an event key in src/engine.ts; its integration with SpinEventEmitter.emit/on is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is used by `src/engine.ts` (a critical path), but neither happy path (correct reel count, correct shape) nor edge cases (reelCount=0, rowCount ignored) are tested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts with no coverage for empty reels, no scatters, single scatter, or multiple scatters across columns. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches uncovered: initial activation (scatters>=3), retrigger while active, decrement while active, and deactivation at remaining<=0. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 92% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item arrays, negative weights, and boundary roll == cumulative. Called by src/engine.ts, making this a production code path with zero test coverage. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical business logic (jackpot payout trigger) used by src/engine.ts has zero coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, single reel), or boundary tests. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout on L108 to adjust payout calculation | [UNIQUE] Numeric constant with unique purpose in payout calculation. | [OK] Value 0.05 matches the authoritative reference doc formula (total × 1.05). | [LEAN] Named constant for a single magic number used in computePayout. | [NONE] No test file exists. Constant directly affects payout calculations but is untested. | [UNDOCUMENTED] Internal constant, no JSDoc. The value (0.05) and its role in RTP calculation are not explained.
  - DEBUG_MODE: [USED] Conditional guard on L171 for debug logging | [UNIQUE] Boolean flag constant. No duplication found. | [OK] Boolean flag; no correctness issue. | [LEAN] Hardcoded-false guard around a single console.log; minimal overhead. | [NONE] No test file exists. Trivial constant but still uncovered. | [UNDOCUMENTED] Internal flag, no JSDoc. Trivial but undocumented.
  - EngineContainer: [USED] Instantiated on L29 to create dependency container | [UNIQUE] Custom container class with register/resolve methods. No duplication found. | [OK] resolve() silently returns undefined-cast-to-T for unregistered keys, but every key resolved in spin() is registered at module init — no missing-key dereference at runtime. | [OVER] Hand-rolled IoC/DI container (register/resolve over a `Map<string,unknown>`) for exactly 3 values that are already statically imported at the top of the file. `container.resolve<typeof weightedPick>("rng")` just returns the same function registered two lines above. Provides zero decoupling, adds unsafe `as T` casts, and `rng` resolved from the container is never actually called inside `spin`. A direct reference to the imported functions is all that is needed. | [NONE] No test file exists. register/resolve behavior and type-unsafe cast are untested. | [UNDOCUMENTED] Internal DI container with no class-level or method-level JSDoc. Purpose, lifetime, and registration contract are not described.
  - container: [USED] Used on L30-31 and L124-126 to register and resolve dependencies | [UNIQUE] Instance variable initialization. No duplication found. | [OK] All three dependencies registered before any resolve() call. | [LEAN] Merely instantiates and populates EngineContainer; over-engineering resides in the class definition above, not here. | [NONE] No test file exists. Module-level singleton wiring is untested. | [UNDOCUMENTED] Module-level singleton with no comment explaining registered keys or intended consumers.
  - PAYLINES: [USED] Accessed on L96 (length), L97 (iteration), L166 (mapping) | [UNIQUE] Constant array defining payline patterns. No duplication found. | [OK] Ten payline arrays exactly match the reference doc table (indices 0–9, values within [0,2]). | [LEAN] Static lookup table exactly matching the 10 documented payline patterns. | [NONE] No test file exists. Payline definitions are untested; incorrect row indices would silently corrupt all win evaluations. | [UNDOCUMENTED] No JSDoc describing the encoding (column→row-index), payline count, or shape semantics.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted() at L39. Internal constant used by local functions. | [UNIQUE] Constant array of symbol names. No similar definitions found. | [OK] All 8 symbols declared in the same order used by weightsToArray; no correctness issue. | [LEAN] Simple constant array of all 8 symbol literals. No unnecessary abstraction. | [NONE] No test file exists. Array contents and ordering are untested, yet symbol order implicitly couples to REEL_WEIGHTS index alignment. | [UNDOCUMENTED] No JSDoc. Not exported, but purpose and ordering (which must match ReelWeightConfig field order for weightsToArray to be correct) is not explained.
  - DEFAULT_WEIGHTS: [USED] Referenced in REEL_WEIGHTS initialization (L24–L28). Provides default weight configuration. | [UNIQUE] Default weight configuration object. No similar constants found. | [NEEDS_FIX] DIAMOND weight=30/120=25% produces ~229% RTP from DIAMOND base pays alone, far exceeding the arbitrated 95% RTP target. | [LEAN] Straightforward constant assignment. Values match the documented weight table exactly. | [NONE] No test file. Weight values (e.g. DIAMOND=30 highest, SEVEN/WILD/SCATTER=5) are untested and silently affect RTP/odds. | [UNDOCUMENTED] No JSDoc. Raw numeric values give no hint of the total weight (120), relative probabilities, or that all five reels share this same config. (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified src/reels.ts:12-15. Weights sum to 120 and produce documented probabilities (DIAMOND ≈25%, SEVEN/WILD/SCATTER ≈4.2%). weightsToArray (L17-20) creates new number[] arrays from the config values, so REEL_WEIGHTS (L22-28) holds independent copies — mutating DEFAULT_WEIGHTS post-init has no effect. The mutable typing is a best_practices/immutability concern, not a correctness defect. No behavioral bug exists.)
  - weightsToArray: [USED] Called 5 times in REEL_WEIGHTS initialization (L24–L28). Converts config to array format. | [UNIQUE] Utility converting config object to array. No similar functions found. | [OK] Returns weights in SYMBOLS array order; no correctness issue. | [ACCEPTABLE] Exists solely because ReelWeightConfig uses named fields instead of a Symbol-keyed map. With `Record<Symbol, number>` this would inline to `SYMBOLS.map(s => cfg[s])`. Harmless but only necessary due to the interface shape choice. | [NONE] No test file. Order of array elements must match SYMBOLS order exactly; this coupling is never verified. | [UNDOCUMENTED] Internal 4-line helper with a clear name; tolerable without JSDoc per private-helper leniency, but the positional coupling to SYMBOLS ordering is an implicit constraint worth noting.
  - REEL_WEIGHTS: [USED] Referenced in spinReel() (L44) and getReelWeights() (L57). Core state for reel mechanics. | [UNIQUE] Array of weight arrays initialized with weightsToArray. No duplicates found. | [OK] Five reels correctly initialized from DEFAULT_WEIGHTS via weightsToArray. | [LEAN] Per-reel weight table array supports future per-reel weight customization (spinReel already accepts reelIndex). All five entries are currently identical but the structure is justified by the design. | [NONE] No test file. Five identical reel weight arrays are assumed; homogeneity and length (5 reels × 8 symbols) are untested. | [UNDOCUMENTED] No JSDoc. Not obvious that all five reels are identical copies of DEFAULT_WEIGHTS or that the outer array index maps to a reel column.
  - pickFromWeighted: [USED] Called in spinReel() at L39. Implements weighted random selection logic. | [DUPLICATE] Weighted random selection with identical logic to weightedPick in src/rng.ts; score 0.819. | [NEEDS_FIX] Uses Math.random() which is not a certifiable RNG; inferred regulated-slot-machine domain from reels/payline/jackpot/RTP vocabulary throughout the project. | [LEAN] Standard O(n) cumulative-weight sampling over 8 symbols. Clean, correct, no unnecessary generalization. | [NONE] No test file. Critical gambling logic: distribution correctness, boundary at r===acc, and fallback return are all untested. Math.random seeding is not mocked anywhere. | [UNDOCUMENTED] No JSDoc. Implements cumulative-weight sampling — a non-trivial algorithm where the wts array must be positionally aligned with items. Neither constraint nor algorithm is documented. (deliberated: confirmed — Confirmed duplicate. src/reels.ts:30-41 is algorithmically identical to src/rng.ts:5-16 (cumulative-weight sampling with Math.random()). Only differences: generic <T> vs Symbol specialization and variable names. The architectural intent (documented in ADR in .anatoly/cache/rag) is that weightedPick in rng.ts is the injectable RNG registered in EngineContainer (engine.ts:30). But spinReel (reels.ts:43-50) calls pickFromWeighted directly (L47), bypassing the container entirely. This means the container-based RNG swap mechanism is dead — reel spins always use the hardcoded local copy. Raising confidence because the duplication causes a real behavioral defect: the injectable RNG architecture is broken.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Used locally in getPayMultiplier function at line 15. | [UNIQUE] Unique static data structure mapping symbols to payout multiplier tuples. | [OK] All six symbol rows match the authoritative pay table in both internal docs and configuration schema exactly. | [LEAN] Flat Record mapping symbol names to fixed 3-tuples. No abstraction beyond what the domain requires. | [NONE] No test file exists. Private constant; coverage only via getPayMultiplier tests, which also don't exist. | [UNDOCUMENTED] No JSDoc comment. Missing explanation that tuple indices correspond to 3-, 4-, and 5-match multipliers applied to lineBet, and that WILD/SCATTER have no entries.

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
