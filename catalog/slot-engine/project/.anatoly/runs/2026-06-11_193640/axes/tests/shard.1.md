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
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srceventsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 90% | Type alias with no test file present. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists; transitive coverage via computePayout is also absent. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists; transitive coverage via spin is also absent. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file present; class is never directly tested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists; transitive coverage via spin is also absent. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists; transitive coverage via spin is also absent. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file present; function is untested directly or transitively. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file exists; transitive coverage via spin is also absent. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file present. Notable: house edge is applied additively (increases payout instead of reducing it), and a flat 1% bet is always added — both are untested bugs. |
| `spin` | L113–L179 | 🔴 NONE | 90% | No test file present. Critical exported entry point with no coverage: invalid-bet validation, win accumulation, free-spin triggering, jackpot detection, and wild multiplier logic are all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file. Transitive callers spinReel and getReelSymbols are also untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists; constant exercised only through untested callers. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file. Private helper with no tested callers. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Transitive callers spinReel and getReelWeights are untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file. Core weighted-random logic — probability distribution, boundary (r==0, r==total), and fallback to last item are all uncovered. |
| `spinReel` | L43–L50 | 🔴 NONE | 95% | No test file. Used by src/factories.ts but no tests verify column length, symbol membership, or weight application. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Consumed by engine.ts spin() but that path is also untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file. Consumed by engine.ts spin() but that path is also untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists; getPayMultiplier (sole caller) is itself untested, so no transitive coverage applies. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file found. Callers src/engine.ts and src/legacy.ts are listed as importers but no test evidence was provided for those either. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `EventHandler` | L1–L1 | 🟡 WEAK | 60% | No test file exists. Transitive coverage depends on SpinEventEmitter tests, which also have none. |
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file found. on/off/emit methods and multi-handler scenarios, handler removal, missing-event guards are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file found. Constant value and its use as the event key in engine.ts are untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class — no test file exists for this module. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 88% | Identity pass-through used by the critical `spin()` function in engine.ts, but no tests exist for this file. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class with no runtime behavior beyond interface contract, but its concrete subclass is untested. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file found. `buildReels` is consumed by the critical `spin` function in engine.ts (validates bet, evaluates paylines, handles jackpots), but no tests verify reel count, row count ignored behavior, `spinReel` delegation, or returned Symbol[][] shape. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical path: called by spin() in engine.ts to trigger free spin awards. Zero coverage for empty reels, no scatters, exactly 3 scatters, or scatters spread across multiple reels. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches untested: initial activation (scatters>=3, inactive), re-trigger (scatters>=3, active), decrement while active, and deactivation when remaining<=0. All called from spin() in engine.ts. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic consumed by spin() — no coverage of the >=4 DIAMOND threshold, boundary case of exactly 4, fewer than 4, zero, or all-DIAMOND reels. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical gaming RNG utility used by slot machine spin logic — missing tests for uniform distribution, zero-weight items, single-item arrays, negative/NaN weights, and boundary roll at exactly cumulative threshold (the off-by-one at `roll < cumulative` vs `roll <= cumulative`). The fallback `return items[items.length - 1]` on L15 is also untested. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout (L106): `total * (1 + HOUSE_EDGE)`. | [UNIQUE] Module-scoped constant with no RAG matches. | [OK] Value 0.05 is correct; the defect is in how computePayout applies it. | [LEAN] Single named numeric constant. | [NONE] No test file exists; transitive coverage via computePayout is also absent. | [UNDOCUMENTED] No JSDoc. Not exported, but the 0.05 value and its RTP effect are undocumented inline.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded `false`; the guarded console.log block in spin (L163) is permanently unreachable dead code. | [UNIQUE] Module-scoped constant with no RAG matches. | [OK] Boolean flag correctly guards debug logging in spin(). | [LEAN] Single named boolean flag, hardcoded false. | [NONE] No test file exists; transitive coverage via spin is also absent. | [UNDOCUMENTED] No JSDoc. Not exported; name is self-explanatory, but acceptable as internal flag.
  - EngineContainer: [USED] Instantiated as `container` (L29); container.resolve is called in spin to supply `paytable` to evaluateLine. | [UNIQUE] IoC container class with no RAG matches. | [OK] resolve() silently returns undefined for missing keys, but all keys resolved in spin() are pre-registered; no live call path triggers the unsafe case. | [OVER] Hand-rolled IoC/service-locator wrapping three already-imported module-level symbols (weightedPick, getPayMultiplier, getReelSymbols/Weights). The register→resolve indirection adds no value over direct references: the three imports are already in scope at the top of the file. One resolved ref (reelsModule) is dead code — factory.buildReels is used instead. Another (rng) is resolved but never called. Classic premature generalization with a single instantiation and no testability or swap benefit. | [NONE] No test file present; class is never directly tested. | [UNDOCUMENTED] No JSDoc on class or its methods. Internal DI container with non-trivial type-erasing resolve pattern warrants at least a brief comment.
  - container: [USED] Resolved values used in spin: `paytable` passed to evaluateLine (L139). `rng` and `reelsModule` are resolved but unused, yet the container itself is exercised. | [UNIQUE] Module-level singleton variable with no RAG matches. | [OK] Registers the three keys that spin() resolves; no correctness issue. | [LEAN] Plain instantiation of EngineContainer; over-engineering lives in the class definition, not the variable. | [NONE] No test file exists; transitive coverage via spin is also absent. | [UNDOCUMENTED] No JSDoc. Module-level singleton with three registered services; purpose is implicit from usage only.
  - PAYLINES: [USED] Iterated in spin (L138) to drive evaluateLine; also indexed in the wildMultiplier loop (L153). | [UNIQUE] Static payline configuration array with no RAG matches. | [OK] Matches the 10-payline definition in the reference documentation exactly. | [LEAN] Fixed data table for 10 payline paths; minimal and appropriate. | [NONE] No test file exists; transitive coverage via spin is also absent. | [UNDOCUMENTED] No JSDoc describing what each row-index array represents or how paylines are traversed. Shape semantics are non-obvious without context.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced by spinReel and getReelSymbols, both of which have external consumers. | [UNIQUE] No similar constant found in RAG results. | [OK] Array of 8 slot symbols matches documented symbol set exactly. | [LEAN] Simple constant array of the 8 fixed symbol names. Minimal and appropriate. | [NONE] No test file. Transitive callers spinReel and getReelSymbols are also untested. | [UNDOCUMENTED] No JSDoc. Internal constant; name is clear but no comment explains it is the master ordered list that drives reel index mapping used by pickFromWeighted and getReelSymbols.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times when building REEL_WEIGHTS. | [UNIQUE] No similar constant found in RAG results. | [OK] Weights (25+25+15+10+5+30+5+5=120) match reference docs exactly. | [LEAN] Straightforward named-field object. Its verbosity is the cost of ReelWeightConfig, not of itself. | [NONE] No test file exists; constant exercised only through untested callers. | [UNDOCUMENTED] No JSDoc. Raw numeric values lack context — no comment explains what the total sums to (120), how probabilities are derived, or that these weights are applied identically to all five reels.
  - weightsToArray: [USED] Called five times in REEL_WEIGHTS initializer to convert DEFAULT_WEIGHTS to number arrays. | [UNIQUE] No similar function found in RAG results. | [OK] Extraction order matches SYMBOLS declaration order; no logic errors. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file. Private helper with no tested callers. | [UNDOCUMENTED] Internal helper, <5 lines, name is descriptive. Lenient treatment applies; omitting is tolerable, but the fixed ordering assumption (CHERRY→LEMON→BELL→BAR→SEVEN→DIAMOND→WILD→SCATTER) is a non-obvious contract.
  - REEL_WEIGHTS: [USED] Referenced by spinReel and getReelWeights, both consumed externally. | [UNIQUE] No similar constant found in RAG results. | [OK] Five reels each initialized from DEFAULT_WEIGHTS via weightsToArray; correct structure. | [ACCEPTABLE] Five identical calls to weightsToArray(DEFAULT_WEIGHTS) produce five equal arrays, enabling future per-reel differentiation. The docs confirm all reels share one weight set, so a single source array re-used (or Array(5).fill) would be leaner, but keeping 5 separate slots is a defensible forward-looking choice for a game engine where per-reel tuning is common. | [NONE] No test file. Transitive callers spinReel and getReelWeights are untested. | [UNDOCUMENTED] No JSDoc. Non-obvious that all five reels are intentionally identical copies of DEFAULT_WEIGHTS; a comment would clarify the design decision and make per-reel customization obvious.
  - pickFromWeighted: [USED] Called inside spinReel per row to perform weighted random symbol selection. | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, draw Math.random()*total, accumulate per-index, and return the item whose cumulative threshold is first exceeded, falling back to the last item. The only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and that pickFromWeighted constrains items to Symbol[] instead of using a generic T[]. These functions are fully interchangeable; pickFromWeighted should be replaced with weightedPick<Symbol>. | [NEEDS_FIX] Math.random() is not certifiable for regulated gaming RNG in a slot-machine domain. | [LEAN] Textbook O(n) weighted random selection. No unnecessary abstraction; correctly handles floating-point edge cases with the fallback return. | [NONE] No test file. Core weighted-random logic — probability distribution, boundary (r==0, r==total), and fallback to last item are all uncovered. | [UNDOCUMENTED] Internal function with a clear name; however it has a subtle fallback (returns last item when floating-point rounding pushes r == total), which warrants at least an inline note. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. Compared reels.ts:30-41 (pickFromWeighted) with rng.ts:5-16 (weightedPick) line-by-line: the algorithms are logically identical (cumulative-weight uniform draw, fallback to last item). Both implementations are correct — no behavioral bug exists. The duplication is real (maintenance/DRY concern belonging on the duplication axis) but does not constitute a correctness defect. pickFromWeighted is called at reels.ts:47 inside spinReel and produces correct weighted selections.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced in-file by getPayMultiplier (which is imported by other files) | [UNIQUE] No similar lookup tables found in RAG results. | [OK] All multipliers match the documented paytable exactly; index layout (3-of-a-kind→[0], 4-of-a-kind→[1], 5-of-a-kind→[2]) aligns with getPayMultiplier's access pattern. | [LEAN] Fixed data table as a typed Record with tuple values. Flat and direct — no abstraction beyond what the domain requires. | [NONE] No test file exists; getPayMultiplier (sole caller) is itself untested, so no transitive coverage applies. | [UNDOCUMENTED] Non-exported internal constant. The symbol keys are readable, but the three-element tuple structure ([3-of-a-kind, 4-of-a-kind, 5-of-a-kind] multipliers) is undocumented — no inline comments on the tuple indices or overall table purpose.

- [ ] `src/events.ts` — 2 untested, 1 weak
  Improve `src/events.test.ts` covering: EventHandler, SpinEventEmitter, SPIN_DONE
  - EventHandler: [USED] Referenced in-file by SpinEventEmitter (which is imported by other files) | [UNIQUE] No RAG data available | [OK] Type alias is correctly defined; variadic unknown[] args match the emit signature. | [LEAN] Minimal type alias for a variadic callback. No abstraction excess. | [NONE] No test file exists. Transitive coverage depends on SpinEventEmitter tests, which also have none. | [UNDOCUMENTED] No JSDoc comment. The variadic `unknown[]` signature is non-obvious enough to warrant a brief description of the intended contract.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick
