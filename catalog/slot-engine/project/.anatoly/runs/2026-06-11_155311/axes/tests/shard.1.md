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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 92% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 90% | No test file exists. Type alias with no runtime behavior, but still undocumented by tests. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file. HOUSE_EDGE is applied in computePayout and directly affects RTP correctness — critical business logic with zero test coverage. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file. Constant always false; dead code path, but still untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file. register/resolve are core DI primitives used throughout spin(); no tests for missing key, type safety, or overwrite behavior. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file. Module-level singleton with no isolation mechanism; not tested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file. 10 payline definitions directly drive win detection; correctness of each row/col index is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 70% | No test file. WILD-leading resolution, SCATTER early-exit, run counting, and the >=3 threshold are all untested edge cases critical to payout correctness. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 75% | No test file. Wild-boost multiplier formula (1+wc)*2^wc applied on top of base payout is complex and completely untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file. House-edge inflation on wins and unconditional +bet*0.01 offset (which increases effective RTP rather than reducing it) are business-critical bugs with no test coverage. |
| `spin` | L113–L179 | 🔴 NONE | 88% | No test file. Exported entry point imported by src/index.ts; bet validation, free-spin state, jackpot path, wildMultiplier accumulation, and strategy.adjustPayout integration all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file found. Array ordering matters because weightsToArray depends on positional alignment with REEL_WEIGHTS. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 90% | No test file. Weight values directly affect payout probabilities — untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file. Positional ordering of the returned array must match SYMBOLS order; no tests verify this invariant. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Five reels all using DEFAULT_WEIGHTS is untested; any divergence would silently break game math. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file. Core probabilistic logic (boundary at r < acc, fallback to last item) has no coverage for edge cases like zero-weight entries or single-item lists. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file. Consumed by src/factories.ts; out-of-bounds reelIndex would return undefined weights and crash silently — untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Used by spin() in src/engine.ts to build the grid; returns mutable reference to SYMBOLS — no tests. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file. Used by spin() in src/engine.ts; out-of-bounds reelIndex returns undefined with no guard — untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. PAY_TABLE drives all payout calculations but has no coverage. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Used by both src/engine.ts (core spin logic) and src/legacy.ts — critical payout path with zero test coverage. Missing tests for: all pay symbols at counts 3/4/5, unknown symbol returning 0, count <3 returning 0, WILD/SCATTER keys absent from PAY_TABLE. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | Used by the critical `spin` function in engine.ts but no test file exists. Identity transform (returns result unchanged) is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 90% | No test file exists. Critical class used by spin() in engine.ts — on/off/emit methods, listener deduplication via filter, and multi-handler dispatch are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant consumed by spin() in engine.ts but no test verifies it is emitted at spin completion. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists for this source file. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. buildReels is consumed by the critical spin() function in engine.ts but has zero direct test coverage. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical path: called by the main spin engine. Missing coverage for zero scatters, mixed reels, and full scatter grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) are entirely untested despite being core free-spin lifecycle logic consumed by the spin engine. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 92% | No test file exists. Critical gaming RNG utility consumed by spin() — missing tests for uniform distribution, zero-weight items, single-item arrays, last-element fallback, and statistical weight proportionality. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical jackpot detection logic (threshold: 4 DIAMOND symbols) consumed by core spin engine has zero test coverage — missing edge cases: exactly 3 diamonds (false), exactly 4 diamonds (true boundary), 5+ diamonds, empty reels, no diamonds. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout: `total * (1 + HOUSE_EDGE)`. | [UNIQUE] Module-local constant with no RAG match. | [OK] Value 0.05 correctly represents 5% house edge; misapplication is in computePayout. | [LEAN] Named constant for a magic number — appropriate. | [NONE] No test file. HOUSE_EDGE is applied in computePayout and directly affects RTP correctness — critical business logic with zero test coverage. | [UNDOCUMENTED] Private module-level constant, no JSDoc. Internal; low priority, but the value's semantic (edge applied as a multiplier, not a deduction) is non-obvious.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded `false`; the `if (DEBUG_MODE)` branch in spin is permanently dead code and can never execute. | [UNIQUE] Module-local constant with no RAG match. | [OK] Boolean flag used correctly in conditional log branch inside spin. | [LEAN] Hardcoded false; dead code but not an abstraction problem. | [NONE] No test file. Constant always false; dead code path, but still untested. | [UNDOCUMENTED] Private flag, self-descriptive name, no JSDoc needed for internal use.
  - EngineContainer: [USED] Instantiated at L29 to create `container`. | [UNIQUE] IoC registry class with no RAG match. | [OK] Registry pattern is internally consistent; all keys are registered before any resolve call. | [OVER] Hand-rolled DI container (register/resolve Map) used to store three symbols that are already directly imported at the top of the file. The container adds a runtime indirection layer with no benefit: callers in spin() resolve the same functions they could call directly. Single use, no interface, no swappable implementations. | [NONE] No test file. register/resolve are core DI primitives used throughout spin(); no tests for missing key, type safety, or overwrite behavior. | [UNDOCUMENTED] Internal DI registry class with no JSDoc. Not exported; moderate concern only because its purpose (why a custom container instead of direct imports) is non-obvious.
  - container: [USED] Resolved three times inside spin (rng, paytable, reels). | [UNIQUE] Module-level singleton with no RAG match. | [OK] Module-level singleton with all three keys registered before first use in spin. | [LEAN] Module-level instantiation; over-engineering source is EngineContainer, not this binding. | [NONE] No test file. Module-level singleton with no isolation mechanism; not tested. | [UNDOCUMENTED] Module-level singleton, no JSDoc. Internal only; low priority.
  - PAYLINES: [USED] Iterated and indexed in spin for both evaluateLine and wild-multiplier recalculation. | [UNIQUE] Data constant with no RAG match. | [OK] Matches the reference documentation payline table exactly. | [LEAN] Fixed data table — minimal and appropriate for 10 paylines. | [NONE] No test file. 10 payline definitions directly drive win detection; correctness of each row/col index is untested. | [UNDOCUMENTED] No JSDoc explaining the coordinate convention (row index per column, 0=top) or the payline shapes. Each row's geometry is opaque without comments.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted call inside spinReel (L46) and returned by getReelSymbols (L53). | [UNIQUE] No similar constant found in RAG results. | [OK] Eight symbol names correctly defined; consistent with ReelWeightConfig and weightsToArray ordering. | [LEAN] Flat array of 8 symbols — minimal and appropriate. | [NONE] No test file found. Array ordering matters because weightsToArray depends on positional alignment with REEL_WEIGHTS. | [UNDOCUMENTED] No JSDoc. Module-level constant; not exported but serves as the canonical symbol roster used by all reel logic.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27). | [UNIQUE] No similar constant found in RAG results. | [NEEDS_FIX] DIAMOND weight 30/120 = 25% makes DIAMOND alone contribute ~229% RTP per line bet, violating the arbitrated 95% RTP target. | [ACCEPTABLE] Named fields provide the only in-code documentation of what each weight value maps to. The verbosity is justified as a self-documenting config record even though the names are discarded afterward. | [NONE] No test file. Weight values directly affect payout probabilities — untested. | [UNDOCUMENTED] No JSDoc. Non-obvious semantics: weights are relative (sum = 120), and the probability implications of each value are not apparent from the name alone. (deliberated: reclassified: correction: NEEDS_FIX → OK — Weights at src/reels.ts:12-15 are structurally valid: 8 positive integers summing to 120. pickFromWeighted (reels.ts:31) normalizes by total so any positive sum works. DIAMOND at 30 is the highest weight and highest paytable payout (src/paytable.ts:11: [50,250,1000]), which is arguably poor game math, but NOT a code defect — the code correctly implements the specified weights. Whether these weights produce the target 95% RTP (declared as ANCIENT_RTP in paytable.ts:3) requires full mathematical simulation, not static code analysis. Game math tuning is a design concern, not a correction-axis bug.)
  - weightsToArray: [USED] Called five times in REEL_WEIGHTS array literal (L23–L27). | [UNIQUE] No similar function found in RAG results. | [OK] Correctly maps all 8 ReelWeightConfig fields to array in SYMBOLS order. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file. Positional ordering of the returned array must match SYMBOLS order; no tests verify this invariant. | [UNDOCUMENTED] Not exported, <10 lines, name is clear. Tolerated per internal-helper leniency.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and getReelWeights (L57). | [UNIQUE] No similar constant found in RAG results. | [OK] Five reels correctly initialized from DEFAULT_WEIGHTS; RTP defect is sourced in DEFAULT_WEIGHTS, not here. | [OVER] Five identical arrays produced by five calls to weightsToArray(DEFAULT_WEIGHTS). Docs confirm all reels share the same weight distribution. A single shared weights array referenced by spinReel would eliminate the per-reel matrix entirely. | [NONE] No test file. Five reels all using DEFAULT_WEIGHTS is untested; any divergence would silently break game math. | [UNDOCUMENTED] No JSDoc. Non-obvious that all five reels share identical weights and that indices 0–4 map to left-to-right reels.
  - pickFromWeighted: [USED] Called inside spinReel loop (L46) to select each symbol by weighted random. | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: same reduce-total, random-roll, cumulative-accumulator loop, and fallback-to-last-element pattern. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and that weightedPick is generic <T> while this is hardcoded to Symbol[]. | [NEEDS_FIX] Math.random() is not certifiable for regulated gaming RNG in an auditable casino slot engine. | [LEAN] Correct, minimal weighted-random implementation with no excess abstraction. | [NONE] No test file. Core probabilistic logic (boundary at r < acc, fallback to last item) has no coverage for edge cases like zero-weight entries or single-item lists. | [UNDOCUMENTED] Not exported, but algorithm is non-trivial (cumulative-sum weighted random selection). No JSDoc on parameters or return value. (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at src/reels.ts:30-41 is algorithmically correct: computes total via reduce (L31), draws uniform random (L32), accumulates weights (L34-38), falls back to last item (L40). The duplication with weightedPick in src/rng.ts:5-16 is real (identical algorithm, variable names differ), but duplication is a maintenance concern for the 'duplication' axis, not a correctness defect. pickFromWeighted is private (not exported), called only in spinReel (reels.ts:47), and produces correct weighted-random results. No crash, data loss, or incorrect behavior.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported; referenced locally at L16 inside getPayMultiplier for multiplier lookups. | [UNIQUE] No similar lookup tables found in RAG results. | [NEEDS_FIX] DIAMOND multipliers [50, 250, 1000] combined with documented reel weight 30/120=0.25 produce system RTP ~238%, contradicting the arbitrated 95% target. | [LEAN] Flat Record lookup with fixed-length tuples matching the exactly-three pay levels. No unnecessary abstraction. | [NONE] No test file exists. PAY_TABLE drives all payout calculations but has no coverage. | [UNDOCUMENTED] Private constant, no JSDoc. The symbol names are readable but the tuple indices (3-of-a-kind / 4-of-a-kind / 5-of-a-kind) are implicit. Internal helper; reduced confidence penalty.

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
