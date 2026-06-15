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
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 88% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout calculation but is never verified. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false, dead code branch untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior, type-unsafe cast, and missing-key behavior are all untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton with side effects at import time; never tested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive all win evaluation; correctness never verified. |
| `checkLine` | L47–L64 | 🔴 NONE | 70% | No test file exists. WILD substitution logic, SCATTER short-circuit, run-length counting, and minimum-run threshold are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 72% | No test file exists. Wild multiplier compounding (exponential formula) and payout arithmetic are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists. Exported function with a buggy HOUSE_EDGE application (increases rather than reduces payout), minimum bet bonus, and Math.ceil rounding — all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS drives all reel spin outcomes; zero coverage. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists. Weight values directly affect RTP; untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. All five reels use identical weights; this assumption is untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 90% | No test file exists. Core probability logic with boundary conditions (r==0, r==total, weight=0) and fallback path entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 78% | No test file exists. Imported by src/factories.ts; produces 3-symbol column per reel but output length, valid symbols, and invalid reelIndex behavior are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file exists. Imported by src/engine.ts; returns SYMBOLS reference without defensive copy — mutation risk untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 75% | No test file exists. Imported by src/engine.ts; returns mutable array reference and silently returns undefined for out-of-range reelIndex — untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Module-private table, but correctness of payout values is untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 85% | No test file exists. Imported by engine.ts and legacy.ts — critical business logic for payout calculation with no coverage for valid symbols, unknown symbols (returns 0), and all count branches (3/4/5 and <3). |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, but adjustPayout identity behavior is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used by src/engine.ts as an event name; not verified in any test that it matches expected consumers. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts for a critical game mechanic — scatter counting across all reels — with no coverage of empty reels, single scatter, or multiple scatters per column. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 65% | No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) all untested despite being core free-spin lifecycle logic called by engine.ts. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 72% | No test file exists. Abstract class with no runtime behavior beyond defining the interface, but concrete subclass coverage is also absent. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file exists. buildReels is used by src/engine.ts (critical path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, rowCount ignored) are verified. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic used by src/engine.ts has zero coverage — no tests for threshold boundary (3 vs 4 diamonds), empty reels, mixed symbols, or multi-reel distribution. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 90% | No test file exists. Critical RNG utility used by src/engine.ts has zero coverage — no tests for uniform distribution, boundary rolls (roll === 0, roll approaches totalWeight), single-item arrays, mismatched weights/items lengths, or zero/negative weights. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Constant referenced in computePayout at line 107 to adjust payout calculations. | [UNIQUE] Module constant with no similar definitions found | [OK] Value 0.05 is correct; defect is in how computePayout applies it, not in the constant itself. | [LEAN] Single numeric constant, no abstraction. | [NONE] No test file exists. HOUSE_EDGE directly affects payout calculation but is never verified. | [UNDOCUMENTED] Private constant; name + value (0.05) are self-explanatory. No JSDoc, but internal use warrants leniency.
  - DEBUG_MODE: [USED] Constant referenced in spin at line 175 to gate debug logging. | [UNIQUE] Module constant with no similar definitions found | [OK] Boolean flag used correctly in a guarded console.log. | [LEAN] Simple boolean flag. Hardcoded false is a correctness smell, not overengineering. | [NONE] No test file exists. Constant is always false, dead code branch untested. | [UNDOCUMENTED] Private boolean flag; name is self-explanatory. No JSDoc, tolerated for internal constants.
  - EngineContainer: [USED] Class instantiated at line 30 and used to manage dependency registration and resolution. | [UNIQUE] Simple service locator class with no semantic duplicates | [NEEDS_FIX] resolve<T> silently returns undefined (cast to T) when a key is absent — type lie that crashes any caller using the resolved value. | [OVER] Hand-rolled service-locator/IoC container (Map<string,unknown> + register/resolve) wrapping exactly three module-level imports that are already statically available. One instantiation, zero external consumers, type-unsafe resolve<T> cast. Equivalent to three direct function references; the abstraction adds no value and loses type safety. | [NONE] No test file exists. register/resolve behavior, type-unsafe cast, and missing-key behavior are all untested. | [UNDOCUMENTED] Not exported; no JSDoc on class or its methods. Purpose as a DI container is inferrable but register/resolve semantics are undocumented.
  - container: [USED] Module-level instance registered with rng, paytable, and reels; resolved at lines 128–130 in spin. | [UNIQUE] Single instance variable with no duplicates found | [OK] Container is correctly instantiated; all three keys used in spin are registered before first resolution. | [LEAN] Straightforward instantiation and population of EngineContainer. The over-engineering lives in the class definition; the consumer code here is trivial. | [NONE] No test file exists. Module-level singleton with side effects at import time; never tested. | [UNDOCUMENTED] Module-level singleton with no JSDoc. The three registrations below it are readable but the variable itself has no comment explaining its role.
  - PAYLINES: [USED] Array referenced at line 140 to iterate paylines and at line 158 to extract line symbols. | [UNIQUE] Game configuration constant with no similar definitions | [OK] Matches the canonical 10-payline definition in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md exactly. | [LEAN] Exactly the 10-payline table mandated by .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. No excess abstraction. | [NONE] No test file exists. Payline definitions drive all win evaluation; correctness never verified. | [UNDOCUMENTED] Not exported; no JSDoc explaining payline encoding (row-index per column), win direction, or minimum run requirement.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Non-exported constant used internally in spinReel function at line 39 as the items parameter passed to pickFromWeighted for weighted random selection. | [UNIQUE] Simple array constant. No similar functions found. | [OK] Eight-symbol array matches ReelWeightConfig key order and weightsToArray projection order. | [LEAN] Plain array listing the 8 game symbols. No unnecessary abstraction. | [NONE] No test file exists. SYMBOLS drives all reel spin outcomes; zero coverage. | [UNDOCUMENTED] No JSDoc comment. The array's role as the master symbol registry for all reels is not explained.
  - DEFAULT_WEIGHTS: [USED] Non-exported constant referenced in REEL_WEIGHTS initialization via 5 calls to weightsToArray (lines 23–27). | [UNIQUE] Configuration constant. No similar functions found. | [OK] Sum = 25+25+15+10+5+30+5+5 = 120; every weight matches the documented table in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. | [LEAN] Single authoritative weight constant matching the documented distribution table (.anatoly/docs/04-API-Reference/02-Configuration-Schema.md). | [NONE] No test file exists. Weight values directly affect RTP; untested. | [UNDOCUMENTED] No JSDoc. Missing explanation that these weights are shared by all five reels and that values are relative (not percentages).
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Non-exported constant accessed in spinReel (line 44) and getReelWeights (line 57) to retrieve weight arrays for random symbol selection. | [UNIQUE] Array constant of pre-computed weights. No duplicates. | [OK] Five reels, all sharing DEFAULT_WEIGHTS — matches documented configuration. | [OVER] number[][] storing one weight array per reel implies per-reel customization, but docs confirm all five reels are identical (.anatoly/docs/04-API-Reference/02-Configuration-Schema.md: 'All five reels share the same weight distribution'). A single shared weights array passed directly to pickFromWeighted would eliminate both this structure and weightsToArray. | [NONE] No test file exists. All five reels use identical weights; this assumption is untested. | [UNDOCUMENTED] No JSDoc. The 5-reel structure and the fact that all reels share identical weights are non-obvious design decisions that warrant a comment.
  - pickFromWeighted: [USED] Non-exported function called in spinReel at line 39 to perform weighted random selection of reel symbols. | [DUPLICATE] Identical weighted selection algorithm. RAG score 0.865. Logic matches: calculate total, generate random, accumulate and compare, return item. | [NEEDS_FIX] Math.random() is not a certifiable RNG for regulated slot-machine gaming. | [LEAN] Textbook weighted-random selection: accumulate, compare, return. Generic signature (Symbol[], number[]) is justified as it's reused across 5 reels × 3 rows. | [NONE] No test file exists. Core probability logic with boundary conditions (r==0, r==total, weight=0) and fallback path entirely untested. | [UNDOCUMENTED] No JSDoc. Missing @param descriptions, @returns, and an explanation of the weighted-random algorithm (linear scan with cumulative sum). Non-trivial logic. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. src/reels.ts:30-41 implements weighted random selection correctly: computes total weight (line 31), generates random in [0, total) (line 32), accumulates and returns on threshold (lines 34-38), with valid fallback (line 40). The NEEDS_FIX conflates duplication with weightedPick (src/rng.ts:5-16) as a correction issue — duplication is real but belongs on the duplication axis, not correction. No algorithmic or logical bug exists in the function itself.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant used locally in getPayMultiplier function at line 15. | [UNIQUE] Domain-specific lookup table for slot paytable. No similar structures found. | [OK] All six symbol rows exactly match the multiplier table in .anatoly/docs/02-Architecture/02-Core-Concepts.md. | [LEAN] Flat Record mapping symbol names to fixed-length tuples. Directly mirrors the documented paytable with no unnecessary indirection. | [NONE] No test file exists. Module-private table, but correctness of payout values is untested. | [UNDOCUMENTED] No JSDoc. Not exported and the tuple structure is readable, but the index semantics (3-of-a-kind → index 0, 4 → 1, 5 → 2) are implicit and undocumented.

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
