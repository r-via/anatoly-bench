[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/reels.ts` | 🔴 CRITICAL | 8 | 92% | [details](#srcreelsts) |
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 95% | [details](#srcenginets) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 85% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Array contents (order and membership) are never verified. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists. Weight values are never asserted, though they directly affect payout distribution. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. Shape (5 reels × 8 weights) and correct delegation to weightsToArray are never verified. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 88% | No test file exists. Critical probability logic (boundary at r==acc, zero-weight items, single-item list, total-weight edge) is entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 92% | No test file exists. Used by src/factories.ts; return shape (3-element Symbol array), valid reelIndex bounds, and out-of-range index behavior are all untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts; return value identity and immutability are untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts; correct indexing and out-of-bounds behavior are untested. |

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. Constant affects computePayout output but is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 95% | Auto-resolved: import verified on disk (weightedPick found in ./rng.js) |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level DI container wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive all win evaluations but are untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 80% | No test file exists. WILD substitution, SCATTER exclusion, and run-length logic all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 80% | No test file exists. Wild multiplier compounding and payout calculation untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file exists. Exported function with house-edge application and base bet bonus untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal constant backing getPayMultiplier; all six symbol rows and their payout tiers are untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Called by src/engine.ts and src/legacy.ts — a critical payout path — with zero coverage of count=3/4/5 branches, unknown symbol fallback (returns 0), or boundary values like count=2. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, so untested pass-through behavior in a critical path. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used by src/engine.ts as an event key; its correct string value is never asserted in any test. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Function is used in engine.ts for core game logic but has zero test coverage across all paths: empty reels, no scatters, multiple scatters, scatter in multiple columns. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Six distinct branches (initial activation, re-trigger, decrement, deactivation, inactive+<3 scatters, active+<3 scatters approaching zero) are all untested despite being critical game state mutations. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 80% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 85% | No test file exists. Used by src/engine.ts, making it a critical production path. buildReels loop logic and spinReel integration are entirely untested. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot trigger at ≥4 diamonds) has zero coverage — no happy path, boundary (exactly 4 vs 3 diamonds), or edge cases (empty reels, all diamonds) tested. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 90% | No test file found. Critical edge cases untested: empty arrays, single item, zero weights, negative weights, weights summing to zero, boundary rolls at exact cumulative thresholds, and statistical distribution correctness. Used by src/engine.ts, making this a production risk. |

## 🧪 Test Improvements

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Used at line 47 in pickFromWeighted call within spinReel | [UNIQUE] No similar symbol arrays found in semantic search | [OK] Eight symbols declared; order matches weightsToArray and DEFAULT_WEIGHTS. | [LEAN] Simple typed array of the 8 game symbols. No unnecessary abstraction. | [NONE] No test file exists. Array contents (order and membership) are never verified. | [UNDOCUMENTED] No JSDoc comment. Purpose (master list of reel symbols) is not obvious from the name alone.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times in REEL_WEIGHTS initialization (lines 23-27) | [UNIQUE] No similar weight configuration found in semantic search | [OK] Sum = 25+25+15+10+5+30+5+5 = 120; matches documented total in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. | [LEAN] Straightforward config constant. Readability is good; the named fields are its only value. | [NONE] No test file exists. Weight values are never asserted, though they directly affect payout distribution. | [UNDOCUMENTED] No JSDoc. Missing context: what unit the weights are in, that they sum to 120, or that all five reels share this config.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Accessed at line 44 in spinReel function to retrieve weights by reelIndex | [UNIQUE] No similar weight matrices found in semantic search | [OK] Five reels each initialized with DEFAULT_WEIGHTS; consistent with documentation. | [OVER] Five identical arrays allocated by calling weightsToArray(DEFAULT_WEIGHTS) five times. Per .anatoly/docs/04-API-Reference/02-Configuration-Schema.md and .anatoly/docs/01-Getting-Started/03-Configuration.md, all five reels share the same weight distribution. A single shared array (or Array(5).fill(…)) would be semantically accurate; the current structure implies per-reel weight customization that is neither used nor documented. | [NONE] No test file exists. Shape (5 reels × 8 weights) and correct delegation to weightsToArray are never verified. | [UNDOCUMENTED] No JSDoc. The fact that all five reels share identical weights is a significant design decision not conveyed by the name.
  - pickFromWeighted: [USED] Called at line 47 within spinReel to select symbols with weighted probabilities | [DUPLICATE] Identical weighted random selection algorithm as weightedPick in src/rng.ts (RAG score 0.826). Both compute weight sum, generate random roll, accumulate weights in loop, return matching item with identical fallback logic. | [NEEDS_FIX] Uses Math.random(), which is not a certifiable PRNG for regulated casino/slot-machine gaming. | [LEAN] Standard O(n) weighted random selection. Clean, generic, does one thing. | [NONE] No test file exists. Critical probability logic (boundary at r==acc, zero-weight items, single-item list, total-weight edge) is entirely untested. | [UNDOCUMENTED] No JSDoc. Missing: description of the weighted-random algorithm, parameter semantics (items and wts must be same length), and return behavior when weights sum to zero. (deliberated: reclassified: correction: NEEDS_FIX → OK — Duplication confirmed: pickFromWeighted (src/reels.ts:30-41) and weightedPick (src/rng.ts:5-16) implement identical cumulative-weight algorithms — sum weights, draw Math.random()*total, accumulate until roll < cumulative, fallback to last item. However, pickFromWeighted is a private (non-exported) helper scoped to reels.ts; the code is functionally correct. This is a duplication/refactoring concern, not a correctness defect. Notably, weightedPick is imported in engine.ts:2, registered at engine.ts:30, and resolved at engine.ts:120 — but never actually called (grep for 'rng(' in engine.ts returns zero matches). The actual runtime path uses pickFromWeighted via spinReel. Reclassified to OK on correction axis because the code produces correct results despite the duplication.)

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Internal constant referenced in computePayout function at line 105 in the multiplication formula. | [UNIQUE] Numeric constant (0.05), no duplicates found | [OK] Value 0.05 is correct; the defect is in how computePayout applies it. | [LEAN] Named constant for a single magic number. Appropriate. | [NONE] No test file exists. Constant affects computePayout output but is untested. | [UNDOCUMENTED] No JSDoc. Internal constant with no comment explaining its role in payout calculation.
  - DEBUG_MODE: [USED] Internal constant guarding debug log in spin function at line 159. | [UNIQUE] Boolean constant flag, no duplicates found | [OK] Boolean guard used correctly; no logic issues. | [LEAN] Simple boolean flag guarding a debug log block. Minimal. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Flag with no description of what debug output it enables.
  - EngineContainer: Auto-resolved: import verified on disk (weightedPick found in ./rng.js)
  - container: [USED] Internal variable registered with services and resolved three times in spin function (lines 120-122). | [UNIQUE] Single module-scoped instance, no duplicates found | [OK] All three keys registered immediately after construction; resolve calls in spin will find them. | [LEAN] Straightforward instantiation of EngineContainer; over-engineering lives in the class definition above. | [NONE] No test file exists. Module-level DI container wiring is untested. | [UNDOCUMENTED] No JSDoc. Module-level singleton with no description of its registered services.
  - PAYLINES: [USED] Internal constant referenced in spin function at line 133 (.length check) and line 149 (line symbol lookup). | [UNIQUE] Game configuration array, no similar payline configs found | [OK] Ten paylines, each five row-indices in [0,2]; valid for a 5×3 reel grid. | [LEAN] Plain data array of ten payline row-index vectors. No abstraction. | [NONE] No test file exists. Payline definitions drive all win evaluations but are untested. | [UNDOCUMENTED] No JSDoc. The row-index encoding scheme (0=top, 1=middle, 2=bottom) and pattern semantics are undocumented.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Internal constant used locally in getPayMultiplier at line 16 | [UNIQUE] Lookup table mapping symbols to payout multipliers. No similar data structures found. | [OK] All six symbol tuples match the documented [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] multipliers exactly (.anatoly/docs/04-API-Reference/02-Configuration-Schema.md). | [LEAN] Plain Record keyed by symbol name, values are fixed-length tuples matching the documented [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] schema. No unnecessary abstraction. | [NONE] No test file exists. Internal constant backing getPayMultiplier; all six symbol rows and their payout tiers are untested. | [UNDOCUMENTED] No JSDoc. The tuple structure [number, number, number] is opaque without documentation explaining the indices map to 3-, 4-, and 5-of-a-kind multipliers applied to lineBet.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/events.ts` — 2 untested
  Improve `src/events.test.ts` covering: SpinEventEmitter, SPIN_DONE

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick
