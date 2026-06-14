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
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists; constant's effect on computePayout is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists; register/resolve behavior, missing-key cast, and type-unsafe resolve are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists; module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists; payline shape correctness and index usage in evaluateLine are untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 80% | No test file exists; WILD-lead resolution, SCATTER early-return, run < 3 rejection, and mixed-WILD runs are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 80% | No test file exists; wild-bonus multiplier formula and null propagation from checkLine are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 92% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 90% | No test file exists. This function uses Math.random and has boundary logic (last-element fallback) that warrants dedicated edge-case tests. |
| `spinReel` | L43–L50 | 🔴 NONE | 75% | No test file exists. Imported by src/factories.ts — a critical caller — yet fully untested including out-of-bounds reelIndex behavior. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 92% | No test file exists. Imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 75% | No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists for this module. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Called by engine.ts and legacy.ts — critical payout logic with count boundary conditions (3/4/5) and unknown symbol handling are untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts but adjustPayout (identity pass-through) is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Methods on, off, and emit are untested — including edge cases like removing a non-registered handler, emitting with no listeners, multiple handlers for the same event, and handler argument forwarding. Used by src/engine.ts, making coverage gaps business-critical. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is referenced by src/engine.ts but no tests verify it is used correctly as an event name. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts but buildReels logic (loop calling spinReel per reel index, returning Symbol[][]) has zero test coverage — no happy path, no edge cases (reelCount=0, varying rowCount ignored by _rowCount). |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic used by engine.ts has no coverage for scatter counting across multiple reels, empty reels, or non-scatter symbols. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. State machine with 4 branches (activation, retrigger, decrement, deactivation) is entirely untested despite being core free-spin business logic consumed by engine.ts. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic (jackpot detection) used by src/engine.ts has zero test coverage — no happy path, no edge cases (empty reels, exactly 4 diamonds, fewer than 4, mixed symbols). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 90% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weight boundary (roll == cumulative), and uniform distribution validation. Used by src/engine.ts, making this a gap in core game logic coverage. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Local constant applied to payout calculation on line 109 | [UNIQUE] No similar constants found in RAG results. | [OK] Constant 0.05 is correct; the defect is how computePayout applies it. | [LEAN] Named constant for a domain magic number. Minimal and appropriate. | [NONE] No test file exists; constant's effect on computePayout is untested. | [UNDOCUMENTED] Private constant with no comment. Non-obvious value (0.05 = 5%) and its effect on RTP is undocumented inline.
  - DEBUG_MODE: [USED] Local flag controlling debug logging on line 174 | [UNIQUE] No similar constants found in RAG results. | [OK] Boolean flag; no correctness concern. | [LEAN] Hardcoded-false debug flag. Common practice; no abstraction overhead. | [NONE] No test file exists. | [UNDOCUMENTED] Private flag with no comment. Self-descriptive name; low severity.
  - EngineContainer: [USED] Local class instantiated on line 29 as container; used for dependency injection | [UNIQUE] Simple DI container class. No similar classes found in RAG results. | [OK] resolve() silently returns undefined cast to T for unregistered keys; safe only because all callers in this file use registered keys. | [OVER] Hand-rolled IoC/service-locator for 3 functions that are already imported at the module top. `register`/`resolve` with a stringly-typed `Map<string, unknown>` sacrifices type safety for zero benefit — callers immediately cast via `as T`. The container is never exported, never mocked, and has a single consumer (`spin`). Direct module-level constants would be one line instead of ~15. | [NONE] No test file exists; register/resolve behavior, missing-key cast, and type-unsafe resolve are untested. | [UNDOCUMENTED] Internal DI container class with no JSDoc. Not exported; lenient, but purpose and lifecycle are non-obvious from the name alone.
  - container: [USED] Local instance used to register (lines 30–32) and resolve dependencies (lines 140–142) | [UNIQUE] Single instance variable. No similar instances found in RAG results. | [OK] All three keys consumed in spin() are registered before use. | [LEAN] Straightforward consumer of EngineContainer; the abstraction overhead lives in that class, not here. | [NONE] No test file exists; module-level singleton wiring is untested. | [UNDOCUMENTED] Module-level singleton with no comment explaining why specific services are registered here.
  - PAYLINES: [USED] Local array iterated on line 149 and indexed on lines 150, 169 in spin function | [UNIQUE] Payline configuration array. No similar constants found in RAG results. | [OK] Identical to the reference documentation definition. | [LEAN] Static lookup table matching the documented 10-payline layout. Pure data, no abstraction. | [NONE] No test file exists; payline shape correctness and index usage in evaluateLine are untested. | [UNDOCUMENTED] Complex 2D array encoding payline row-index paths with no JSDoc. Geometric meaning of each row is not explained.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Used locally in pickFromWeighted call at line 36 within spinReel function | [UNIQUE] Simple array constant with no similar definitions found | [OK] Eight symbols in correct insertion order; matches ReelWeightConfig keys and weightsToArray output order exactly. | [LEAN] Simple ordered symbol registry used as both iteration target and weighted-pick input. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant with no comment describing its role as the canonical ordered symbol list used for reel weight indexing.
  - DEFAULT_WEIGHTS: [USED] Used locally in REEL_WEIGHTS initialization (lines 23-27), called 5 times | [UNIQUE] Specific weight configuration constant with no similar definitions | [NEEDS_FIX] DIAMOND weight of 30 causes 5-DIAMOND alone to return ~97.7% of total bet, blowing the 95% RTP target before any other symbol pays. | [LEAN] Plain data literal; named fields aid readability. Any complexity is in the type it uses, not here. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Numeric weight values carry non-obvious probability semantics (e.g., DIAMOND=30 is the highest weight); a comment explaining the total and per-symbol probability would be valuable. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug. DEFAULT_WEIGHTS (reels.ts:12-15) sums to 120 — valid relative weights. All values are positive integers, structure matches SYMBOLS array (reels.ts:3-5), used correctly at lines 23-27 via weightsToArray. DIAMOND having the highest weight (30) is a game design decision, not a bug. The mutability concern (no `as const`, getReelWeights returns mutable reference) is a best_practices issue, not a correction issue. Changing these values would alter game RTP — a behavioral change with no evidence it's needed.)
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Used locally in spinReel (line 44) and getReelWeights (line 57) | [UNIQUE] Derived constant array initialized from weightsToArray calls | [OK] Five reels correctly initialized via weightsToArray; structural correctness is independent of the weight values. | [ACCEPTABLE] Five explicit identical rows is slightly verbose but preserves the option for per-reel weight divergence without structural changes. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not obvious that all 5 reels share identical weight distributions; a comment would clarify this design choice.
  - pickFromWeighted: [USED] Called in spinReel function (line 36) to select weighted symbols | [DUPLICATE] Identical weighted random selection logic to weightedPick; same accumulation pattern, same fallback, same mathematical behavior | [NEEDS_FIX] Math.random() is not a certifiable RNG for regulated gaming. | [LEAN] Standard O(n) weighted random selection; concise and correct. | [NONE] No test file exists. This function uses Math.random and has boundary logic (last-element fallback) that warrants dedicated edge-case tests. | [UNDOCUMENTED] Unexported helper implementing a weighted random selection algorithm. The algorithm logic (cumulative sum scan) is non-trivial enough to warrant at least a brief description, but leniency applies as it is internal. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug. pickFromWeighted (reels.ts:30-41) correctly implements cumulative-weight selection: accumulates weights via reduce (line 31), draws uniform random (line 32), iterates to find selection (lines 33-38), returns last item as fallback (line 40). It IS algorithmically identical to weightedPick in rng.ts:5-16, but duplication is a duplication-axis concern, not a correction-axis concern. The function produces correct weighted random output. It's the actual RNG used in the live spin path (called at reels.ts:47 via spinReel, which is called by factories.ts:12).)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported; referenced locally in getPayMultiplier at line 16 | [UNIQUE] Data lookup table mapping symbols to payout arrays. No duplicates found. | [NEEDS_FIX] DIAMOND multipliers combined with documented reel weight (30/120 = 25%) produce RTP >> 100% from DIAMOND wins alone, violating the arbitrated 95% target. | [LEAN] Fixed lookup table as a Record of tuples. Right data structure for a static 6×3 paytable; no abstraction overhead. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal (non-exported) constant, but tuple semantics [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] are not obvious from the type alone.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/events.ts` — 2 untested
  Improve `src/events.test.ts` covering: SpinEventEmitter, SPIN_DONE

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick
