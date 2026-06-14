[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 92% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 92% | [details](#srcfreespints) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout calculation but is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false; branch it guards is dead code with no tests. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve mechanics, including the unsafe cast in resolve, are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton with registered dependencies is never exercised in isolation. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. The 10 payline definitions drive all win evaluation logic but are never validated for correctness. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. Critical logic covering WILD substitution, SCATTER short-circuit, run counting, and minimum-run threshold is entirely untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 90% | No test file exists. Wild-count bonus multiplier formula (basePayout * (1+wc) * 2^wc) and null-return path are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 90% | No test file exists. Exported function with inverted HOUSE_EDGE application (adds edge instead of reducing it), fixed 1% bet bonus, and Math.ceil rounding — all business-critical, all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 92% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists. Edge cases like zero weights or mismatched config fields are untested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file. Critical weighted-random logic with edge cases (zero total weight, single item, r==total boundary) is entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 70% | No test file. Imported by src/factories.ts; happy path, invalid reelIndex, and column-length invariants are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file. Imported by src/engine.ts; return value identity and immutability are untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 70% | No test file. Imported by src/engine.ts; out-of-range reelIndex and return value correctness are untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Module-private table; correctness of payout values is untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic with zero test coverage across all count branches (3/4/5), unknown symbols, and boundary inputs. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 85% | No test file found. Used by src/engine.ts, but adjustPayout (identity passthrough) is untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts with no coverage for empty reels, mixed symbols, or all-scatter grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 92% | No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) all untested despite being core free-spin business logic. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 78% | No test file exists. Critical class used by src/engine.ts — on/off/emit methods, multi-listener behavior, handler deregistration, and unknown-arg forwarding are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. String constant used as an event key in src/engine.ts; not exercised in any test. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 78% | No test file exists. `buildReels` is used by `src/engine.ts` (core engine path) but has zero test coverage — loop logic, `spinReel` integration, and output shape are all untested. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic with no coverage — missing tests for exactly 4 diamonds (boundary), fewer than 4, zero diamonds, diamonds spread across multiple reels vs. single reel, and empty reels input. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. No coverage for happy path, edge cases (empty arrays, single item, zero weights, negative weights, boundary roll == cumulative), or the fallback return on L15. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used in computePayout at line 108 for RTP calculation. | [UNIQUE] Numeric constant with no similar definitions found | [OK] Constant value 0.05 is correct; defect is in how computePayout uses it, not the constant itself. | [LEAN] Named constant for a magic number used in computePayout. Appropriate. | [NONE] No test file exists. HOUSE_EDGE directly affects payout calculation but is never tested. | [UNDOCUMENTED] Internal constant with no comment explaining its role in RTP calculation or where it is applied.
  - DEBUG_MODE: [USED] Used in spin at line 174 as condition for logging. | [UNIQUE] Boolean constant with no similar definitions found | [OK] Boolean guard; no correctness issue. | [LEAN] Common compile-time debug flag. Hardcoded false is fine for shipping code. | [NONE] No test file exists. Constant is always false; branch it guards is dead code with no tests. | [UNDOCUMENTED] Internal flag with no comment; effect (suppresses console.log in spin) is not stated.
  - EngineContainer: [USED] Instantiated at line 29 to create container variable. | [UNIQUE] Simple service locator pattern with no similar implementations found | [OK] resolve() silently returns undefined for unregistered keys, but all keys resolved in spin() are pre-registered at module load, so no runtime failure in current paths. | [OVER] DIY IoC container (string-keyed registry with generic resolve<T>) built for a single-file module that already imports its dependencies directly. The three registered values are direct module imports that could be used as-is; two of them (rng, reelsModule) are resolved in spin() but never actually called. Adds type-unsafe casting (as T) with zero benefit over plain imports. | [NONE] No test file exists. register/resolve mechanics, including the unsafe cast in resolve, are untested. | [UNDOCUMENTED] Internal DI container class with no JSDoc. Purpose, lifetime, and usage contract are undocumented. Leniency applied as non-exported internal class.
  - container: [USED] Used for registering and resolving dependencies in spin function. | [UNIQUE] Singleton instance of EngineContainer; no similar instances found | [OK] Module-level DI container; three registrations are consistent with what spin() resolves. | [LEAN] Instantiation of EngineContainer; the overengineering lives in the class definition above, not here. | [NONE] No test file exists. Module-level singleton with registered dependencies is never exercised in isolation. | [UNDOCUMENTED] Module-level singleton with no comment explaining why it exists or what it registers.
  - PAYLINES: [USED] Used in spin at line 125-126 for line evaluation and at line 151 for wild count calculation. | [UNIQUE] Payline configuration constant with no similar definitions found | [OK] All 10 row-index sequences match the architecture documentation exactly. | [LEAN] Flat 2D array of ten fixed payline row-index sequences. Correct representation for the domain; no unnecessary abstraction. | [NONE] No test file exists. The 10 payline definitions drive all win evaluation logic but are never validated for correctness. | [UNDOCUMENTED] No comment describing payline semantics (row-index sequences per reel column, left-to-right evaluation direction, or pattern shapes).

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Used in pickFromWeighted call at L39 and returned by getReelSymbols | [UNIQUE] Constant symbol list. No similar constants found. | [OK] Array order matches ReelWeightConfig field order used in weightsToArray; all eight symbols present. | [LEAN] Simple string array of the 8 symbol identifiers. No unnecessary abstraction. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Private module constant; the canonical set of valid symbols has semantic significance (order matters for weight alignment) but is unexplained.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray 5 times in REEL_WEIGHTS initialization | [UNIQUE] Constant weight config object. No similar constants found. | [NEEDS_FIX] DIAMOND weight=30 (P=0.25) makes DIAMOND's per-payline EV ≈2.295× lineBet; ×10 paylines → RTP > 229% from DIAMOND alone, violating the arbitrated RTP=95% target. | [LEAN] Straightforward config object. Named fields make per-symbol weight editing clear. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Numeric values (25, 25, 15, 10, 5, 30, 5, 5) lack any rationale; total weight (120) and relative frequencies are not stated. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. reels.ts:12-15 weights sum to 120 (CHERRY:25+LEMON:25+BELL:15+BAR:10+SEVEN:5+DIAMOND:30+WILD:5+SCATTER:5), matching internal documentation verbatim. The finding provides no evidence of what correct values should be. RTP is a function of the full system (weights x paytable x paylines x HOUSE_EDGE), not weights in isolation. These are intentional design constants.)
  - weightsToArray: [USED] Called 5 times to populate REEL_WEIGHTS array | [UNIQUE] Converts weight config to array. No similar functions found. | [OK] Extracts all eight config fields in the same order as SYMBOLS; no indexing mismatch. | [ACCEPTABLE] Exists solely to bridge ReelWeightConfig's named fields to the number[] format needed internally. Introduces a fragile ordering dependency with SYMBOLS (field extraction order must match array order). Switching ReelWeightConfig to Record<Symbol, number> and using SYMBOLS.map(s => cfg[s]) would eliminate this function and the coupling. Mild design artifact, not severe overengineering. | [NONE] No test file exists. Edge cases like zero weights or mismatched config fields are untested. | [UNDOCUMENTED] Private non-exported helper, <10 lines, clear name. Tolerable absence of JSDoc; however the ordering contract (must match SYMBOLS order) is an implicit constraint worth noting.
  - REEL_WEIGHTS: [USED] Indexed in spinReel and getReelWeights functions | [UNIQUE] Array of reel weight arrays. No similar constants found. | [OK] Five identical weight arrays initialized via weightsToArray; structure matches five-reel game layout. | [ACCEPTABLE] Expanding the same weights 5 times (once per reel) rather than Array(5).fill(...) is verbose, but the structure explicitly supports per-reel weight differentiation, which is a common slot machine requirement. Justified by domain. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The design decision that all five reels share identical weights (rather than per-reel configs) is undocumented and non-obvious.
  - pickFromWeighted: [USED] Called from spinReel to select weighted symbols | [DUPLICATE] Implements weighted random selection. Identical algorithm to weightedPick in src/rng.ts (similarity 0.819). Both compute cumulative weights and return item when random value falls below cumulative sum. | [NEEDS_FIX] Math.random() is not certifiable for regulated gaming RNG; slot-machine domain (CHERRY/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER, paylines, lineBet, jackpot, RTP target) requires a CSPRNG. Industry convention for certified gaming prohibits Math.random(). | [LEAN] Standard cumulative-weight sampling, correctly implemented and general enough to be reused. Nothing extraneous. | [NONE] No test file. Critical weighted-random logic with edge cases (zero total weight, single item, r==total boundary) is entirely untested. | [UNDOCUMENTED] No JSDoc. Implements cumulative-weight sampling; parameters, return value, and the assumption that items.length === wts.length are all undocumented.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced locally in getPayMultiplier at line 15 | [UNIQUE] Payout lookup table. No similar data structures found in RAG results. | [OK] All six symbol rows match the authoritative pay table exactly (3-match, 4-match, 5-match indices). | [LEAN] Flat lookup table mapping six symbols to fixed 3-tuples. No abstraction needed beyond what's here. | [NONE] No test file exists. Module-private table; correctness of payout values is untested. | [UNDOCUMENTED] No JSDoc comment. The tuple layout [3-match, 4-match, 5-match] and the unit (multiplier applied to lineBet) are non-obvious and undocumented.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/events.ts` — 2 untested
  Improve `src/events.test.ts` covering: SpinEventEmitter, SPIN_DONE

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick
