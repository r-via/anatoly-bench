[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 9 | 97% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 85% | [details](#srcfactoriests) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout calculations but is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false so its branch (console.log) is dead and untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior, unknown-key resolution, and type-cast safety are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive all win evaluation; correctness is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 80% | No test file exists. Critical logic (WILD substitution, SCATTER early-return, run-length threshold of 3) is entirely untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 90% | No test file exists. Wild-count bonus multiplier (exponential) and payout calculation paths are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 97% | No test file exists. House-edge application, zero-win flat bonus, and Math.ceil rounding are untested despite being exported. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Array contents and ordering are untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists. Weight values (e.g. sum, individual entries) are untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. Shape (5 reels × 8 weights) and correctness are untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file exists. Critical weighted-random logic — boundary conditions (r==0, r==total-ε, single item, zero-weight entries, fallback last item) all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 92% | No test file exists. Imported by src/factories.ts; return length (3 rows), valid symbol membership, and out-of-range reelIndex are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file exists. Imported by src/engine.ts; identity/content of returned array is untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 62% | No test file exists. Imported by src/engine.ts; correct index lookup and undefined for out-of-range index are untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal constant is untested, though indirectly exercised via getPayMultiplier. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Critical function imported by src/engine.ts and src/legacy.ts; count branching (3/4/5/other), unknown symbol, and zero-return paths are all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, making untested pass-through behavior a coverage gap for the engine's payout logic. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file found. Constant is used as an event key in src/engine.ts but its usage pattern is untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts but no tests cover scatter counting logic, including empty reels, zero scatters, or multiple scatters across columns. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. Four distinct branches (trigger, re-trigger, decrement, deactivate) are all untested despite being critical game state logic used by src/engine.ts. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 82% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 85% | No test file exists. Used by src/engine.ts (critical path), yet buildReels has no tests covering reel count, row count ignored, or spinReel integration. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 93% | No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item input, boundary roll at exact cumulative threshold, and distribution uniformity. Used by src/engine.ts, making lack of coverage a production risk. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot threshold, diamond counting across reels) is entirely untested. Called by src/engine.ts, making this a high-risk gap. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used internally in computePayout at line 105 | [UNIQUE] Constant value; no logic to duplicate | [OK] Value 0.05 is correct for a 5% house edge; the defect is in how computePayout applies it. | [LEAN] Named constant for a magic number. Minimal and correct. | [NONE] No test file exists. HOUSE_EDGE directly affects payout calculations but is never tested. | [UNDOCUMENTED] No JSDoc. The value 0.05 and its role in payout inflation (applied on top of wins, not as a deduction) are not explained.
  - DEBUG_MODE: [USED] Used internally in spin function at line 167 | [UNIQUE] Constant value; no logic to duplicate | [OK] Boolean flag, no correctness issues. | [LEAN] Simple boolean flag guarding a single console.log. | [NONE] No test file exists. Constant is always false so its branch (console.log) is dead and untested. | [UNDOCUMENTED] No JSDoc. Private flag with a self-descriptive name, but no comment on what debug output it enables.
  - EngineContainer: [USED] Instantiated at line 29 to create container instance | [UNIQUE] Class with register/resolve methods; no similar implementations found | [OK] resolve() silently returns undefined cast to T on missing keys, but all three registered keys are resolved in spin with no missing registrations. | [OVER] A hand-rolled service-locator with `register`/`resolve` used exclusively in this one file to wrap three direct module imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). Adds a `Map<string, unknown>` + type-cast indirection with zero benefit over `import` statements. Additionally, two of the three resolved values (`rng`, `reelsModule`) are resolved in `spin` but never actually called, revealing the container provides no real wiring value. | [NONE] No test file exists. register/resolve behavior, unknown-key resolution, and type-cast safety are untested. | [UNDOCUMENTED] No JSDoc on class or either method. Purpose as a DI registry and the string-key convention are undocumented.
  - container: [USED] Used throughout spin: registered with values at lines 30-32, resolved at lines 123-125 | [UNIQUE] Module-level variable instance; no logic to duplicate | [OK] All three registrations are present and typed correctly. | [LEAN] Module-level singleton instantiation of `EngineContainer`. The overengineering lives in the class definition above; the variable itself is a straightforward constant. | [NONE] No test file exists. Module-level singleton wiring is untested. | [UNDOCUMENTED] No JSDoc. Module-level singleton with no explanation of its role or registered keys.
  - PAYLINES: [USED] Used in spin function: length checked at line 129, indexed at lines 130 and 153 | [UNIQUE] Static array constant; no similar patterns found | [OK] Ten 5-element paylines with row indices 0–2, correct for a 5×3 reel grid. | [LEAN] Ten payline patterns as a plain 2-D array. Appropriate data structure for a fixed slot-machine grid. | [NONE] No test file exists. Payline definitions drive all win evaluation; correctness is untested. | [UNDOCUMENTED] No JSDoc. The encoding (each sub-array is a row index per reel column) and the number of supported paylines are not explained.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted call (L38-39) and returned by getReelSymbols (L52) | [UNIQUE] Constant symbol string array. No duplicates found. | [OK] Eight symbols defined; order matches weightsToArray and pickFromWeighted usage. | [LEAN] Simple typed constant array of all symbol names. Appropriate. | [NONE] No test file exists. Array contents and ordering are untested. | [UNDOCUMENTED] No JSDoc comment. Purpose (master symbol registry for all reels) is not self-evident from the declaration alone.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray 5 times to initialize REEL_WEIGHTS (L25-29) | [UNIQUE] Constant weight configuration object. No duplicates. | [OK] Sum = 25+25+15+10+5+30+5+5 = 120; matches documented total of 120 in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md and .anatoly/docs/01-Getting-Started/03-Configuration.md. | [LEAN] Straightforward config object. Values match the documented weights in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. | [NONE] No test file exists. Weight values (e.g. sum, individual entries) are untested. | [UNDOCUMENTED] No JSDoc. Missing explanation that all five reels share this distribution and that weights are relative (sum=120).
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Accessed in spinReel (L44) and getReelWeights (L57) | [UNIQUE] Constant array of weight arrays for each reel. No duplicates. | [OK] Five reels with identical weights; consistent with documentation. | [ACCEPTABLE] Five identical arrays pre-computed to allow per-reel weight differentiation. Docs confirm all reels currently share DEFAULT_WEIGHTS, so the structure is unused capacity, but per-reel weights are a natural extension and the overhead is trivial. | [NONE] No test file exists. Shape (5 reels × 8 weights) and correctness are untested. | [UNDOCUMENTED] No JSDoc. The 5-reel structure and its indexing relationship to spinReel are undocumented.
  - pickFromWeighted: [USED] Called in spinReel loop to select weighted symbols (L38) | [DUPLICATE] Weighted random selection from Symbol array. Identical algorithm to weightedPick in src/rng.ts (reduce weights, random roll, accumulate and check). Only difference is type specialization. | [NEEDS_FIX] Math.random() is non-certifiable for regulated gaming RNG (domain inferred from slot-machine symbol vocabulary: CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER, and spinReel naming). | [LEAN] Standard weighted-random selection. One responsibility, correct linear scan, no unnecessary abstraction. | [NONE] No test file exists. Critical weighted-random logic — boundary conditions (r==0, r==total-ε, single item, zero-weight entries, fallback last item) all untested. | [UNDOCUMENTED] No JSDoc. Missing description of the weighted-random algorithm, parameter semantics, and the fallback-to-last-item behavior. (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at reels.ts:30-41 is algorithmically correct — cumulative-weight selection with proper fallback at line 40. The NEEDS_FIX claim is based solely on duplication with rng.ts:weightedPick, which is a duplication concern, not a correction issue. The function produces correct weighted random results. It is the ONLY weighted picker actually invoked at runtime (via spinReel at reels.ts:47 → factories.ts:12), while weightedPick is registered in the container but never called.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant referenced in getPayMultiplier (line 16) | [UNIQUE] Lookup table for symbol payouts, no similar structures found | [OK] All six symbol tuples exactly match the [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] values documented in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md and .anatoly/docs/02-Architecture/02-Core-Concepts.md. | [LEAN] Flat Record keyed by symbol name, tuple values matching exactly the documented 3/4/5-of-a-kind multipliers. No abstraction layers needed or present. | [NONE] No test file exists. Internal constant is untested, though indirectly exercised via getPayMultiplier. | [UNDOCUMENTED] No JSDoc. Not exported, so leniency applies, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and non-obvious without context. A single comment line would suffice.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/events.ts` — 2 untested
  Improve `src/events.test.ts` covering: SpinEventEmitter, SPIN_DONE

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit
