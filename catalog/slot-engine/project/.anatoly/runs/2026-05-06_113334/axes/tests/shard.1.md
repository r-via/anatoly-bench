[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 93% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout calculations and is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is never tested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. EngineContainer register/resolve logic is untested, including type-unsafe resolve behavior. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions are critical to win evaluation but have no tests verifying correctness. |
| `checkLine` | L47–L64 | 🔴 NONE | 85% | No test file exists. Complex WILD/SCATTER handling logic, run detection, and edge cases (all WILDs, leading WILD, short runs) are entirely untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file exists. Wild count multiplier math and payout calculation branches are entirely untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file exists. Exported function with house edge application, minimum bet bonus, and Math.ceil rounding is entirely untested. The comment claims RTP ~95% but the logic actually adds the house edge (inflating payouts), which is a likely bug that tests would catch. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file found for this module. SYMBOLS constant is untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists. DEFAULT_WEIGHTS values (e.g. ensuring weights sum correctly or individual symbol weights) are completely untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. REEL_WEIGHTS structure (5 reels, each with correct weights) is untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 90% | No test file found. This is a core probabilistic selection function with edge cases (boundary r values, single-item lists, total weight computation) — all completely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 85% | No test file found. spinReel is imported by src/factories.ts (a critical path) but has zero test coverage — happy path, invalid reelIndex, and output length/shape are all untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 72% | No test file found. getReelSymbols is imported by src/engine.ts but is entirely untested, including the returned array contents and length. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 85% | No test file found. getReelWeights is imported by src/engine.ts but is entirely untested, including boundary behavior for invalid reelIndex values. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file found. PAY_TABLE is a module-private constant but its correctness (payout values for all 6 symbols across 3 count tiers) is never validated by any test. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 90% | No test file exists. This function is imported by two callers (engine.ts, legacy.ts) making it a critical business-logic path. Edge cases like unknown symbols, count < 3, count === 3/4/5, and count > 5 are all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 78% | Abstract base class with no test file found. No tests exist for this symbol or its contract. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. DefaultStrategy is imported by src/engine.ts, making it a critical code path, but there are zero tests verifying that adjustPayout returns the result unchanged (identity behavior). |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file found. While this is a simple string constant, its role as the canonical event name used by src/engine.ts means no test verifies it is correctly passed to emit/on calls in integration scenarios. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 75% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file found. buildReels is imported by src/engine.ts (critical game engine path) and has untested behavior: reel count loop, spinReel delegation per index, and the _rowCount parameter being silently ignored — all edge cases with zero coverage. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. detectScatters is used by the core engine and has no test coverage for happy path (multiple scatters), edge cases (empty reels, no scatters, single scatter), or boundary conditions. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. handleFreeSpins is used by the core engine and has no test coverage for any of its branches: initial activation (scatters >= 3), re-trigger while active, decrement while active, or deactivation when remaining reaches 0. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found for this source file. The function is imported by src/engine.ts indicating it is part of a critical business path (jackpot determination), yet there are no tests covering the happy path (exactly 4 diamonds triggering a jackpot), edge cases (0 diamonds, 3 diamonds, more than 4 diamonds, empty reels, or mixed symbol grids), or boundary conditions (exactly 4 vs 3 diamonds). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 88% | No test file exists for this source file. The function has multiple important behaviors that need coverage: happy path weighted selection, edge cases like single-item arrays, zero-weight items, boundary roll values (roll === 0, roll just below cumulative threshold), and the fallback return on L15. It is used in src/engine.ts making it a critical path with zero test coverage. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Non-exported constant referenced in computePayout at line 107. | [UNIQUE] Numeric constant for house edge percentage. No duplicates detected. | [OK] Value 0.05 correctly encodes the documented 5% house edge; the defect is in how it is applied inside computePayout, not in this constant. | [LEAN] Named constant for a domain-significant magic number (5 % house edge). Appropriate and standard practice. | [NONE] No test file exists. HOUSE_EDGE directly affects payout calculations and is never tested. | [UNDOCUMENTED] Private module-level constant with no JSDoc. The value and its effect on payout calculations are non-obvious. Lenient because it is internal and the name is reasonably descriptive.
  - DEBUG_MODE: [USED] Non-exported constant used in conditional at line 174 in spin function. | [UNIQUE] Boolean flag constant. No similar definitions found. | [OK] Boolean flag set to false; no correctness issues. | [LEAN] Single boolean flag guarding one console.log. Trivial overhead even though it is hardcoded to false; not worth flagging as overengineered. | [NONE] No test file exists. Constant is never tested. | [UNDOCUMENTED] Private boolean flag with no JSDoc. Name is self-descriptive and value is trivially false; tolerated as internal with low severity.
  - EngineContainer: [USED] Non-exported class instantiated at line 29 and methods called throughout file. | [UNIQUE] Custom DI/registry container class with register and resolve methods. No duplicates detected. | [OK] resolve() silently returns undefined cast to T for unregistered keys, but every key queried in spin() is registered before first use; no runtime crash in current usage. | [OVER] A hand-rolled IoC / service-locator container (register + resolve with a Map<string, unknown>) built exclusively to inject three values — `weightedPick`, `getPayMultiplier`, and the reels module — that are already imported as named ES module imports in the same file. The container is populated once at module load with fixed, compile-time-known dependencies and has exactly one consumer (`spin`). This is a textbook premature abstraction: all the indirection of a DI container with none of the configurability benefit, since the registrations never change at runtime. | [NONE] No test file exists. EngineContainer register/resolve logic is untested, including type-unsafe resolve behavior. | [UNDOCUMENTED] Internal service-locator class with no class-level or method-level JSDoc. Its purpose (dependency injection registry), the contract of register/resolve, and the generic typing of resolve are not documented.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Non-exported constant referenced in evaluateLine and spin at lines 132, 133, 167. | [UNIQUE] Constant 2D array defining payline patterns. No similar definitions found. | [OK] All ten payline arrays match the canonical definitions in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md exactly. | [LEAN] Exactly the 10-payline specification documented verbatim in `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`. Direct, flat data with no abstraction layer. | [NONE] No test file exists. Payline definitions are critical to win evaluation but have no tests verifying correctness. | [UNDOCUMENTED] Internal constant defining ten payline row-index arrays. No JSDoc explains the coordinate system (0=top, 2=bottom), the left-to-right evaluation direction, or the meaning of each shape. The data is non-trivial and benefits from documentation.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Non-exported constant used locally: referenced on line 47 in spinReel() and line 53 in getReelSymbols() | [UNIQUE] Constant array of symbol type identifiers. No similar symbols found in RAG results. | [OK] Array contains exactly 8 symbols in the documented order; used correctly as the item list paired with weightsToArray output. | [LEAN] Simple, flat constant array listing all eight slot symbols. No abstraction needed here. | [NONE] No test file found for this module. SYMBOLS constant is untested. | [UNDOCUMENTED] No JSDoc comment. The constant holds the master list of slot symbols used across all reels, but there is no inline documentation explaining its role, ordering significance, or relationship to other modules.
  - DEFAULT_WEIGHTS: [USED] Non-exported constant used locally: passed to weightsToArray 5 times in REEL_WEIGHTS initialization (lines 23-27) | [UNIQUE] Constant weight configuration object. No similar constants found in RAG results. | [OK] Sum = 25+25+15+10+5+30+5+5 = 120, matching the documented total of 120 and all per-symbol probabilities in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. | [LEAN] A single, readable config object with named fields matching the documented weight table. Appropriately minimal. | [NONE] No test file exists. DEFAULT_WEIGHTS values (e.g. ensuring weights sum correctly or individual symbol weights) are completely untested. | [UNDOCUMENTED] No JSDoc comment. The numeric values (25, 25, 15, 10, 5, 30, 5, 5) are not self-explanatory; a reader cannot deduce that they are relative weights summing to 120, or understand the intended probability distribution, without external context.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Non-exported constant used locally: accessed on line 44 in spinReel() and line 57 in getReelWeights() | [UNIQUE] 2D constant array storing pre-computed weight arrays for each reel. No similar constants found in RAG results. | [OK] Five reels, all with DEFAULT_WEIGHTS, consistent with the documented shared distribution. | [OVER] Creates five separate, identical arrays by calling `weightsToArray(DEFAULT_WEIGHTS)` five times. The Configuration Schema doc (`.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`) explicitly states "All five reels share the same weight distribution", making per-reel array storage premature generalization. A single shared weights array would be correct and sufficient; the current structure implies per-reel differentiation that neither exists nor is planned. | [NONE] No test file exists. REEL_WEIGHTS structure (5 reels, each with correct weights) is untested. | [UNDOCUMENTED] No JSDoc comment. The structure — a parallel array of five identical weight arrays, one per reel — and the design decision that all reels share DEFAULT_WEIGHTS are not documented. This is a key configuration constant whose shape and intent are non-obvious.
  - pickFromWeighted: [USED] Non-exported function used locally: called twice on line 47 within spinReel() loop | [DUPLICATE] Implements weighted random selection by accumulating weights and comparing to a random roll. RAG found weightedPick (0.865) with identical algorithm: same weight summation, same random scaling, same accumulation logic, same fallback. | [NEEDS_FIX] Math.random() is not a certifiable PRNG for regulated gaming; the weighted-selection logic itself is correct. | [LEAN] Textbook weighted-random selection: accumulate total, pick a random point, walk until it falls in a bucket. Minimal, correct, and generic enough to warrant its own function. | [NONE] No test file found. This is a core probabilistic selection function with edge cases (boundary r values, single-item lists, total weight computation) — all completely untested. | [UNDOCUMENTED] No JSDoc comment. This implements a weighted random selection algorithm (linear scan over cumulative probabilities). It is non-exported but the algorithm is non-trivial; the absence of documentation for the parameters 'items' and 'wts', the return value, and the edge-case fallback on the last item is notable. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 is algorithmically correct — it faithfully implements cumulative-weight random selection with proper fallback (L40). It IS used locally at L47 inside spinReel()'s loop (called 3 times per spin, not twice as the finding states). The finding's real substance is about duplication with src/rng.ts:weightedPick, not a correctness bug. Both implementations are identical in logic (reduce total, random roll, accumulate, compare, fallback to last item). Deduplicating by importing weightedPick from rng.ts would be a safe refactor with zero behavioral change, but the existing code has no bug — it produces correct weighted random results. This is a duplication/refactoring concern misclassified on the correction axis.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant referenced locally on line 17 within getPayMultiplier function. Used to look up pay multipliers by symbol. | [UNIQUE] Pay table lookup structure mapping symbols to payout multipliers; no similar data structures found in RAG results | [OK] All six symbol rows exactly match the multiplier table in .anatoly/docs/02-Architecture/02-Core-Concepts.md; tuple index order [3-of, 4-of, 5-of] is consistent with getPayMultiplier usage. | [LEAN] A flat Record mapping each symbol name to a fixed 3-tuple. Mirrors the documented paytable in `.anatoly/docs/02-Architecture/02-Core-Concepts.md` exactly. No class, no builder, no dynamic generation — just the data. | [NONE] No test file found. PAY_TABLE is a module-private constant but its correctness (payout values for all 6 symbols across 3 count tiers) is never validated by any test. | [UNDOCUMENTED] Private constant with no JSDoc/TSDoc. The name is self-descriptive but the tuple layout [number, number, number] — representing 3-of-a-kind, 4-of-a-kind, and 5-of-a-kind multipliers respectively — is not obvious and is not documented anywhere inline. Leniency applied for non-exported private data; confidence reduced accordingly.

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
