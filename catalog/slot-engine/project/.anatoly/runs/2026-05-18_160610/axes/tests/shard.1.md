[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
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
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout math and is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 55% | No test file exists. register/resolve behavior, including type-unsafe cast in resolve, is untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions are structurally untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 80% | No test file exists. WILD substitution logic, SCATTER short-circuit, run-length threshold (>=3), and leading-WILD resolution are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 80% | No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null propagation from checkLine are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists. HOUSE_EDGE application (only when total>0), flat 1% bet bonus, and Math.ceil rounding are untested. Exported and business-critical. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. This constant defines the full symbol universe; its contents are never validated. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 92% | No test file. Weight values (e.g. sum, individual entries) are never asserted. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file. Order and completeness of the returned array (8 elements, correct mapping) are untested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Shape (5 reels × 8 weights) and per-reel values are never validated. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 90% | No test file. Critical probability logic — boundary conditions (r==0, r at exact boundary, r just below total), fallback return, and distribution skew are all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 85% | No test file. Imported by src/factories.ts making it a critical path; column length (3), valid symbol membership, and out-of-range reelIndex behavior are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Imported by src/engine.ts; returned array identity and contents are never asserted. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 85% | No test file. Imported by src/engine.ts; out-of-range index and correct per-reel weight array are untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant backing getPayMultiplier; correctness of payout values (e.g. DIAMOND 3-of-a-kind=50) is entirely untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Imported by src/engine.ts and src/legacy.ts — a critical payout path. Happy path (count 3/4/5 per symbol), unknown symbol returning 0, and count<3 returning 0 are all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file. No tests verify the contract or polymorphic behavior. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file exists. DefaultStrategy is used by src/engine.ts, making untested pass-through behavior a coverage gap in a critical path. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 78% | No test file exists. Core event emitter used by engine.ts has zero coverage: on/off/emit methods, multi-listener dispatch, handler deduplication, and unknown-event handling are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant imported by engine.ts as a key event signal; its correct usage in emit/on calls is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 70% | No test file found. Used by src/engine.ts, but buildReels — including reel count, row count handling, and spinReel integration — is entirely untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Missing coverage for: empty reels, reels with no SCATTER, single SCATTER, multiple SCATTERs across columns, non-SCATTER symbols mixed in. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 86% | No test file exists. Missing coverage for: initial activation (scatters>=3), re-trigger during active spins, decrement logic, boundary at remaining=1 (deactivation), inactive state with scatters<3. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot payout trigger) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds vs 3), no edge cases (empty reels, all diamonds). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 90% | No test file found. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, boundary roll values (roll === cumulative), and distribution uniformity. Used by src/engine.ts, making untested coverage a real risk. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used internally on line 105 in computePayout to adjust total payout. | [UNIQUE] Standalone numeric constant, no duplicates found | [OK] Value 0.05 is correct; misapplication belongs to computePayout. | [LEAN] Simple named constant for a magic number used in computePayout. | [NONE] No test file exists. HOUSE_EDGE directly affects payout math and is untested. | [UNDOCUMENTED] Unexported constant with no JSDoc. Effect is non-obvious: it inflates payout (adds 5%) rather than reducing it, which contradicts a naive reading of 'house edge'.
  - DEBUG_MODE: [USED] Used internally in spin function (line ~170) for conditional debug logging. | [UNIQUE] Boolean flag constant, no semantic duplicates found | [OK] Boolean flag; no correctness issue. | [ACCEPTABLE] Hardcoded false makes the debug block permanently dead, but the pattern is common enough during development to be acceptable. | [NONE] No test file exists. Constant is untested. | [UNDOCUMENTED] Unexported boolean flag with no JSDoc. Self-descriptive; low documentation priority.
  - EngineContainer: [USED] Instantiated on line 29 to create the dependency container. | [UNIQUE] Dependency injection container class, no similar implementations found | [NEEDS_FIX] resolve() casts undefined to T when key is absent, producing a deferred runtime crash at the call site. | [OVER] DIY IoC container (string-keyed Map<string, unknown> with register/resolve) for three functions already imported at the module top-level. The type-unsafe string keys and unknown casts add friction with zero benefit — callers could invoke weightedPick, getPayMultiplier, and the reels functions directly. | [NONE] No test file exists. register/resolve behavior, including type-unsafe cast in resolve, is untested. | [UNDOCUMENTED] Unexported DI container class. No JSDoc on class, register, or resolve. The unsafe cast in resolve<T> warrants at least a note.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Used in spin function: iteration over length (line ~135), payline selection (line ~136), and symbol lookup (line ~159). | [UNIQUE] Game payline configuration constant, no similar constants found | [OK] 10 paylines with row indices 0–2 consistent with the 3-row reel grid. | [LEAN] Plain data array of ten fixed paylines; matches the documented payline table exactly. | [NONE] No test file exists. Payline definitions are structurally untested. | [UNDOCUMENTED] Unexported constant defining 10 payline row-index patterns. No JSDoc explaining the coordinate system (each element is a row index for that reel column) or payline shapes.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced locally in pickFromWeighted call (line 37) | [UNIQUE] Constant symbol array. No similar definitions found in RAG results. | [OK] Eight symbols defined in the same order used by weightsToArray and pickFromWeighted; no correctness issues. | [LEAN] Simple string-literal array; no abstraction. | [NONE] No test file exists. This constant defines the full symbol universe; its contents are never validated. | [UNDOCUMENTED] No JSDoc comment. Purpose (master symbol list used to index reel weights) is not obvious from the name alone.
  - DEFAULT_WEIGHTS: [USED] Referenced in REEL_WEIGHTS initialization (lines 24-28) | [UNIQUE] Constant with specific weight values. No similar constants found. | [NEEDS_FIX] DIAMOND weight 30 (P=25%) combined with the documented 1000× 5-match payout yields ~97.7% RTP from 5-DIAMOND alone across 10 paylines; total DIAMOND contribution ~230% of bet, violating the arbitrated 95% RTP target. | [LEAN] Flat object literal matching the documented default weights table. | [NONE] No test file. Weight values (e.g. sum, individual entries) are never asserted. | [UNDOCUMENTED] No JSDoc. Relative frequencies and total weight (120) are non-obvious and undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified reels.ts:12-15. Weights sum to 120: CHERRY(25)+LEMON(25)+BELL(15)+BAR(10)+SEVEN(5)+DIAMOND(30)+WILD(5)+SCATTER(5). Internal docs confirm these exact probabilities are intentional (DIAMOND≈25%, SEVEN/WILD/SCATTER≈4.2%). weightsToArray (reels.ts:17-20) creates independent number[] copies, so REEL_WEIGHTS (reels.ts:22-28) is not affected by any hypothetical mutation of DEFAULT_WEIGHTS. The refinement cache itself concludes 'No behavioral bug exists.' Mutability is a best_practices/immutability concern, not a correction defect.)
  - weightsToArray: [USED] Called 5 times during REEL_WEIGHTS initialization | [UNIQUE] Helper to convert weight config to array. No similar functions found. | [OK] Extracts cfg fields in the same order as SYMBOLS; mapping is correct. | [ACCEPTABLE] Bridges ReelWeightConfig to an ordered number[] that must mirror SYMBOLS order — implicit coupling. Could use SYMBOLS.map(s => cfg[s]) to remove the ordering dependency, but the function itself is minimal and not overengineered. | [NONE] No test file. Order and completeness of the returned array (8 elements, correct mapping) are untested. | [UNDOCUMENTED] No JSDoc. Internal helper; ordering contract (must match SYMBOLS index order) is a non-obvious constraint that warrants a comment.
  - REEL_WEIGHTS: [USED] Accessed in spinReel (line 44) and getReelWeights (line 57) | [UNIQUE] Reel weight table constant. No similar constants found. | [OK] Correctly applies DEFAULT_WEIGHTS to all five reels; shape matches the 5-reel architecture. | [ACCEPTABLE] Five identical arrays (all DEFAULT_WEIGHTS) enable future per-reel customization and are explicitly documented in 02-Configuration-Schema.md. spinReel could reference a single array, but the 2D structure is an intentional documented design choice. | [NONE] No test file. Shape (5 reels × 8 weights) and per-reel values are never validated. | [UNDOCUMENTED] No JSDoc. Shape ([5][3] columns × weight arrays) and the fact all five reels share identical weights are undocumented.
  - pickFromWeighted: [USED] Called in spinReel function (line 37) | [DUPLICATE] Weighted random selection algorithm. Identical logic to weightedPick: same total calculation, same random roll, same cumulative accumulation loop, same fallback. | [NEEDS_FIX] Math.random() is not a certifiable RNG source; regulated slot-machine gaming mandates an auditable, certifiable random source. | [LEAN] Standard cumulative-weight sampling loop; no unnecessary abstraction. | [NONE] No test file. Critical probability logic — boundary conditions (r==0, r at exact boundary, r just below total), fallback return, and distribution skew are all untested. | [UNDOCUMENTED] No JSDoc. Algorithm (cumulative-weight sampling), parameter semantics, edge-case fallback on the last element, and the requirement that items.length === wts.length are all undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — Verified reels.ts:30-41. The algorithm is correct: cumulative-weight selection with proper total calculation, uniform random draw, and last-item fallback. The finding's evidence is about duplication with weightedPick (rng.ts:5-16), not about a logic error. Duplication is a code quality concern that belongs on the duplication axis, not the correction axis. The function produces correct weighted random selections every time.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Used locally in getPayMultiplier at line 15 | [UNIQUE] Symbol payout lookup table, no duplicates found. | [OK] All six symbol rows match the documented [3-match, 4-match, 5-match] multipliers exactly. | [LEAN] Flat Record keyed by symbol name with fixed-length tuples — exactly the right data structure for a static six-row pay table. | [NONE] No test file exists. Private constant backing getPayMultiplier; correctness of payout values (e.g. DIAMOND 3-of-a-kind=50) is entirely untested. | [UNDOCUMENTED] No JSDoc. Tuple semantics ([3-match, 4-match, 5-match] multipliers applied to lineBet) are not stated anywhere in the source. Private symbol but non-trivial structure warrants at least a brief comment.

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
