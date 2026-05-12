[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 9 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🔴 CRITICAL | 8 | 90% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 93% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 85% | [details](#srcfactoriests) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 80% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE silently inflates payouts (adds 5% instead of subtracting), which is a logic bug that tests would catch. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false; dead code path is untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 95% | Auto-resolved: import verified on disk (weightedPick found in ./rng.js) |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Ten payline definitions drive all win detection; correctness of each pattern is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 70% | No test file exists. Critical win-detection logic with WILD substitution, SCATTER early-return, leading-WILD fallback, and run-length threshold — all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 70% | No test file exists. WILD multiplier compounding formula (basePayout * (1 + wildCount) * 2^wildCount) and null-return paths are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists. Inverted house-edge application (multiplies by 1.05 instead of reducing), guaranteed 1% base return, and Math.ceil rounding are all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS array defines the universe of valid slot symbols; no coverage. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Weight values directly affect payout probabilities — critical to verify they sum correctly and reflect design intent. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Verifying that all 5 reels are populated and each weight array has the correct length is untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 75% | No test file. Core probability sampling logic — boundary conditions (r exactly at boundary, zero weights, single item) and fallback return are completely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 88% | No test file. Imported by src/factories.ts; should verify returns exactly 3 symbols, all within SYMBOLS, and handles out-of-range reelIndex gracefully. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file. Imported by src/engine.ts; trivial accessor but its return value is relied upon by engine logic. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 88% | No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard, untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant but its correctness (payout values per symbol) is critical game logic with zero test coverage. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 93% | No test file exists. Imported by src/engine.ts and src/legacy.ts — sits on a critical business path (payout calculation). Edge cases like unknown symbol, count < 3, count > 5, and each valid count (3/4/5) for each symbol are untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, so its pass-through behavior is untested directly and likely untested indirectly without engine tests confirmed. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. String constant used as event key in engine.ts; no tests verify correct usage as an event identifier. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Missing coverage for: empty reels, no scatters, mixed symbols, multiple scatters per reel, and full-grid scatter counts. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 75% | No test file exists. Missing coverage for all branches: initial activation (scatters>=3), retrigger while active, decrement while active, deactivation at remaining<=0, and inactive state with scatters<3. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 85% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 85% | No test file found. `buildReels` is used by `src/engine.ts` (critical path), but zero tests cover reel count, row count ignored behavior, or spinReel integration. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot trigger) imported by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), under-threshold, and empty-reel cases all untested. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 80% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, boundary roll at exact cumulative threshold, and negative weights. Used by src/engine.ts, making coverage gaps a production risk. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used in computePayout at line 109 to adjust total payout. | [UNIQUE] Numeric constant, no similar functions found | [OK] Constant value 0.05 is numerically correct; the defect is in computePayout's misuse of it. | [LEAN] Named constant for a magic number used in one place. | [NONE] No test file exists. HOUSE_EDGE silently inflates payouts (adds 5% instead of subtracting), which is a logic bug that tests would catch. | [UNDOCUMENTED] No JSDoc. Not exported; name reveals intent, but the effect on RTP calculation warrants a note.
  - DEBUG_MODE: [USED] Checked at line 176 to conditionally log debug information. | [UNIQUE] Boolean constant, no similar functions found | [OK] Boolean flag only; no logic to evaluate. | [LEAN] Simple boolean flag guarding a log statement. | [NONE] No test file exists. Constant is always false; dead code path is untested. | [UNDOCUMENTED] No JSDoc. Not exported; self-explanatory boolean flag, tolerable.
  - EngineContainer: Auto-resolved: import verified on disk (weightedPick found in ./rng.js)
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Used to iterate paylines at line 126, access specific paylines at lines 127 and 162. | [UNIQUE] Constant array, no similar functions found | [OK] Ten payline row-index arrays match the documented layout exactly. | [LEAN] Plain data table matching the documented 10-payline configuration. No abstraction needed. | [NONE] No test file exists. Ten payline definitions drive all win detection; correctness of each pattern is untested. | [UNDOCUMENTED] No JSDoc explaining row-index encoding, coordinate system (0=top), or payline count. Not exported but semantics are non-obvious.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Used locally: called in pickFromWeighted at line 47 (spinReel) and returned at line 53 (getReelSymbols) | [UNIQUE] Constant array of symbol strings. No similar constants found. | [OK] Eight symbols declared in the same order used by weightsToArray; no issues. | [LEAN] Simple array constant listing all 8 slot symbols. | [NONE] No test file exists. SYMBOLS array defines the universe of valid slot symbols; no coverage. | [UNDOCUMENTED] No JSDoc comment. Purpose (master symbol list used for reel picks) is not obvious from the name alone.
  - DEFAULT_WEIGHTS: [USED] Referenced in REEL_WEIGHTS initialization at lines 23–27 | [UNIQUE] Configuration constant for default reel weights. No duplicates found. | [OK] Sum = 25+25+15+10+5+30+5+5 = 120; matches documented total. | [LEAN] Straightforward named-key weight map; easy to read and maintain. | [NONE] No test file. Weight values directly affect payout probabilities — critical to verify they sum correctly and reflect design intent. | [UNDOCUMENTED] No JSDoc. Missing explanation that these are relative integer weights, how probability is derived, or that all five reels share this config.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Used locally in spinReel (line 44) and getReelWeights (line 57) | [UNIQUE] Precomputed weight arrays for 5 reels. No duplicates found. | [OK] Five reels, each a correctly-derived weight array. | [ACCEPTABLE] Five-element array, one entry per reel, allows per-reel weight divergence in future. All reels currently share `DEFAULT_WEIGHTS`, but the shape is appropriate for a slot machine that may need differentiated reels. | [NONE] No test file. Verifying that all 5 reels are populated and each weight array has the correct length is untested. | [UNDOCUMENTED] No JSDoc. The decision to give all five reels identical weights is a meaningful design choice with no explanation.
  - pickFromWeighted: [USED] Called in spinReel at line 47 to select weighted symbols | [DUPLICATE] Weighted random selection with identical logic to weightedPick from src/rng.ts. Both compute cumulative weights and return item at threshold. | [NEEDS_FIX] Math.random() is not certifiable for regulated gaming RNG. | [LEAN] Minimal weighted-random selection; linear scan is correct and sufficient for 8 items. | [NONE] No test file. Core probability sampling logic — boundary conditions (r exactly at boundary, zero weights, single item) and fallback return are completely untested. | [UNDOCUMENTED] No JSDoc. Weighted-random selection algorithm with a fallback to the last element on floating-point edge cases — neither the algorithm nor the edge-case behavior is explained. (deliberated: confirmed — Confirmed duplicate. src/reels.ts:30-41 is functionally identical to src/rng.ts:5-16. Both implement: (1) sum weights via reduce, (2) Math.random() * total, (3) cumulative accumulation loop, (4) fallback to last item. Only differences: variable names and pickFromWeighted is typed Symbol[] while weightedPick is generic <T>. pickFromWeighted should be replaced with weightedPick. However, this is a duplication/maintainability issue, not a correctness bug — both produce correct weighted random results. The finding is on the correction axis which is a slight mismatch; the defect is real but mis-categorized. Raising confidence to 75 since the duplication is unambiguous, but the correction axis overstates the severity.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced locally in getPayMultiplier function at line 15 | [UNIQUE] Data structure mapping symbols to payout multipliers. No similar structures found in RAG results. | [OK] All six pay-symbol tuples match the documented paytable exactly. | [LEAN] Flat Record with fixed-length tuple values maps directly to the documented (symbol, count) → multiplier structure. No unnecessary indirection. | [NONE] No test file exists. Private constant but its correctness (payout values per symbol) is critical game logic with zero test coverage. | [UNDOCUMENTED] Private constant, so leniency applies, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is nowhere stated. A one-line comment would remove all ambiguity; without it the semantics must be reverse-engineered from getPayMultiplier.

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
