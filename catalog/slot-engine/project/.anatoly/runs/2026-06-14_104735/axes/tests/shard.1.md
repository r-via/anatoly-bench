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
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srceventsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 95% | No test file exists for this module. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. Transitive coverage via computePayout/spin is moot — neither is tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Transitive coverage via spin is moot — spin is not tested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists for this module. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Transitive coverage via spin is moot — spin is not tested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Transitive coverage via spin is moot — spin is not tested. |
| `checkLine` | L47–L64 | 🔴 NONE | 93% | No test file exists for this module. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 90% | No test file exists. Transitive coverage via spin is moot — spin is not tested. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists. Notable gaps include the erroneous house-edge application (adds instead of reduces RTP), the unconditional bet*0.01 bonus, and the Math.ceil behavior — none verified. |
| `spin` | L113–L179 | 🔴 NONE | 85% | No test file exists. Critical exported function with complex behavior (bet validation, reel building, payline evaluation, scatter/freespin/jackpot logic, wild multiplier recalculation) is entirely untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Transitive coverage via spinReel/getReelSymbols is moot since those exported callers are also untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Constant drives all reel probability distributions but is never directly verified. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file. Mapping order is critical (determines per-symbol probability) but untested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Transitive coverage requires spinReel/getReelWeights to be tested, which they are not. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 95% | No test file. Core probability logic with boundary conditions (r exactly at acc boundary, single-item list, zero-weight items) is entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 95% | No test file. Consumed by src/factories.ts for critical spin path; no tests for out-of-range reelIndex, column length, or symbol validity. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Used by spin() in engine.ts for symbol enumeration; return value never asserted. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file. Used by spin() in engine.ts; out-of-range reelIndex returns undefined with no guard, untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file. Transitive coverage via getPayMultiplier is irrelevant because getPayMultiplier itself has no tests. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file found. Imported by src/engine.ts and src/legacy.ts but no test coverage is confirmed for those callers either — no test file is available. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `EventHandler` | L1–L1 | 🟡 WEAK | 60% | No test file exists. Type alias with no runtime behavior, but transitive coverage via SpinEventEmitter is also absent. |
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 90% | No test file found. on/off/emit methods and edge cases (duplicate handlers, unknown events, multi-arg emit, handler removal correctness) are entirely untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file found. Constant is consumed by src/engine.ts but no tests verify it is emitted at the correct point in the spin lifecycle. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 87% | Abstract class with no test file. No tests exist for any subclass or the abstract contract. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. DefaultStrategy is consumed by spin() in engine.ts but its identity-passthrough behavior is untested in isolation. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class with no runtime logic — but its contract (buildReels signature) is untested. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file exists. buildReels is consumed by the critical spin() function in engine.ts (bet validation, payline evaluation, jackpot detection), yet there are zero tests verifying reelCount iteration, spinReel delegation, or returned Symbol[][] shape. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical path: called by spin() in engine.ts to trigger free spin awards. No coverage of zero scatters, partial counts, or full-grid scatter scenarios. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches untested: initial activation (scatters>=3 while inactive), retrigger (scatters>=3 while active), decrement, and deactivation (remaining<=0). All are critical game-logic paths called by spin(). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 95% | No test file exists. Critical RNG utility used by slot machine spin logic with no coverage of edge cases: empty arrays, mismatched lengths, zero-weight items, single-item arrays, or boundary behavior when roll equals cumulative weight boundary. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical jackpot logic consumed by core spin engine has zero test coverage — no happy path (≥4 diamonds), no boundary (exactly 4 vs 3), no edge cases (empty reels, single column). |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout (L107): total * (1 + HOUSE_EDGE). | [UNIQUE] No similar constant found in RAG results. | [OK] Value 0.05 is numerically correct for a 5% house edge; the defect is in how it is applied in computePayout. | [LEAN] Named constant for a magic number used in payout logic. | [NONE] No test file exists. Transitive coverage via computePayout/spin is moot — neither is tested. | [UNDOCUMENTED] Internal constant, no JSDoc. Acceptable leniency as non-exported, but the RTP contract it implies is non-obvious.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded false; the guarded console.log block in spin never executes at runtime. | [UNIQUE] No similar constant found in RAG results. | [OK] Boolean guard constant; no correctness issue. | [LEAN] Simple boolean flag. Hardcoded false is a minor maintainability issue but not overengineering. | [NONE] No test file exists. Transitive coverage via spin is moot — spin is not tested. | [UNDOCUMENTED] Internal flag, no JSDoc. Name is self-explanatory; low concern.
  - EngineContainer: [USED] Instantiated as module-level container (L29), which is consumed in spin. | [UNIQUE] No similar class found in RAG results. | [OK] Simple typed registry; resolve returning undefined for missing keys is a usage concern, not a defect at the definition site. | [OVER] Hand-rolled IoC container (Map-backed register/resolve) for three values that are already direct module imports at the top of the file. The class adds no testability, no lazy init, no lifecycle management — it only obscures `weightedPick`, `getPayMultiplier`, and the reels module behind string keys. Of the three resolved values in `spin`, `rng` and `reelsModule` are never actually used. Single consumer, zero abstraction benefit. | [NONE] No test file exists for this module. | [UNDOCUMENTED] Internal DI container class with no JSDoc. Purpose and usage are non-obvious from the name alone.
  - container: [USED] Resolved three times in spin; paytable resolution is actively used. rng and reelsModule are resolved but never called (factory/strategy used instead), making those registrations dead, but the variable itself is referenced. | [UNIQUE] No similar variable found in RAG results. | [OK] Module-level singleton; all three keys registered match the keys resolved in spin. | [LEAN] Instantiation and registration of EngineContainer. Overengineering is in the class definition, not this usage. | [NONE] No test file exists. Transitive coverage via spin is moot — spin is not tested. | [UNDOCUMENTED] Module-level singleton with no JSDoc. Internal; low severity.
  - PAYLINES: [USED] Drives the payline loop in spin (L136) and wild-multiplier recalculation (L151). | [UNIQUE] No similar constant found in RAG results. | [OK] All 10 payline arrays match the reference documentation exactly. | [LEAN] Fixed lookup table for 10 payline paths. Correct representation for static slot geometry. | [NONE] No test file exists. Transitive coverage via spin is moot — spin is not tested. | [UNDOCUMENTED] 10-element payline matrix with no JSDoc. Row-index semantics and payline shapes are not self-evident from the raw arrays.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced by pickFromWeighted call in spinReel and returned directly by getReelSymbols. | [UNIQUE] No similar constant found in RAG results. | [OK] Eight-element tuple matches ReelWeightConfig and weightsToArray ordering exactly. | [LEAN] Plain array of string literals; minimal and appropriate. | [NONE] No test file exists. Transitive coverage via spinReel/getReelSymbols is moot since those exported callers are also untested. | [UNDOCUMENTED] No JSDoc. Purpose as the master symbol registry for weighted selection is not stated.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times to populate REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar constant found in RAG results. | [OK] Weights sum to 120 and match reference documentation exactly. | [LEAN] Simple data declaration; complexity comes from the surrounding interface, not this constant. | [NONE] No test file. Constant drives all reel probability distributions but is never directly verified. | [UNDOCUMENTED] No JSDoc. Numeric values carry no explanation of what they represent (relative weights summing to 120) or how they affect symbol probability.
  - weightsToArray: [USED] Called five times in REEL_WEIGHTS initializer to convert DEFAULT_WEIGHTS into number arrays. | [UNIQUE] No similar functions found per RAG. | [OK] Extraction order matches SYMBOLS array order; no logic errors. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file. Mapping order is critical (determines per-symbol probability) but untested. | [UNDOCUMENTED] Unexported 4-line helper with a clear name. Tolerable absence, but ordering contract (must match SYMBOLS order) is implicit and undocumented.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and returned by getReelWeights (L57), both of which have external consumers. | [UNIQUE] No similar constant found in RAG results. | [OK] Five reels each correctly initialized from DEFAULT_WEIGHTS via weightsToArray. | [ACCEPTABLE] Five identical entries could be Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)), but per-reel slots are a legitimate slot-machine extensibility point. Minor verbosity, not a design problem. | [NONE] No test file. Transitive coverage requires spinReel/getReelWeights to be tested, which they are not. | [UNDOCUMENTED] No JSDoc. The structure (5 reels sharing identical weights), valid index range (0–4), and immutability at runtime are all undocumented.
  - pickFromWeighted: [USED] Called inside spinReel loop (L47) to select each symbol according to reel weights. | [DUPLICATE] Identical weighted-random-selection algorithm: accumulate total, pick random in [0,total), iterate accumulating per-item weight, return item when roll < cumulative. Only differences are variable names and the type parameter — this is Symbol-typed while weightedPick<T> is generic. Logic is fully interchangeable. | [NEEDS_FIX] Uses Math.random(), which is not a certifiable RNG for regulated gaming software. | [LEAN] Textbook weighted random selection; linear scan with accumulator is appropriate for 8 symbols. | [NONE] No test file. Core probability logic with boundary conditions (r exactly at acc boundary, single-item list, zero-weight items) is entirely untested. | [UNDOCUMENTED] Unexported helper with a descriptive name. Tolerable, but the fallback behavior (returns last item on floating-point edge) is a non-obvious contract. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 correctly implements cumulative-weight sampling. Called at L47 inside spinReel to draw symbols. The algorithm is correct: reduce weights to total, scale Math.random(), accumulate per-item weight, return on threshold cross, fallback to last item. The finding's evidence is about duplication with src/rng.ts:weightedPick — that duplication is real but belongs on the duplication axis, not correction. Duplication is not a correctness defect; the code produces correct results.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced in-file by getPayMultiplier (which is imported by other files) | [UNIQUE] No similar lookup table found in RAG results. | [OK] All multiplier triples exactly match the reference-documented paytable for every pay symbol; no defect. | [LEAN] Static lookup table as Record with tuple values — minimal and appropriate for a fixed 6-symbol paytable. | [NONE] No test file. Transitive coverage via getPayMultiplier is irrelevant because getPayMultiplier itself has no tests. | [UNDOCUMENTED] Private, non-exported constant. Name and structure are self-descriptive (symbol → [3-of, 4-of, 5-of] multipliers), so absence of JSDoc is tolerable for an internal helper. No docs present.

- [ ] `src/events.ts` — 2 untested, 1 weak
  Improve `src/events.test.ts` covering: EventHandler, SpinEventEmitter, SPIN_DONE
  - EventHandler: [USED] Referenced in-file by SpinEventEmitter (which is imported by other files) | [UNIQUE] No RAG data available | [OK] Simple variadic-void function type alias; no correctness issues. | [LEAN] Simple type alias that names a variadic callback signature. Appropriate for reuse across on/off/emit signatures. | [NONE] No test file exists. Type alias with no runtime behavior, but transitive coverage via SpinEventEmitter is also absent. | [UNDOCUMENTED] No JSDoc comment. Type alias for a variadic unknown-args void function — the constraint on argument types is non-obvious and warrants a brief doc.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit
