[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 9 | 95% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 88% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. |
| `checkLine` | L47–L64 | 🔴 NONE | 80% | No test file exists. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 80% | No test file exists. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists. Critical path: applies house edge incorrectly (adds edge instead of reducing, then adds flat 1% of bet), untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file exists. This is the most critical untested function — probabilistic selection logic with boundary behavior (r exactly at accumulator boundary, zero-weight symbols) and a fallback return that masks silent failures. |
| `spinReel` | L43–L50 | 🔴 NONE | 72% | No test file exists. Imported by src/factories.ts; untested out-of-range reelIndex would silently produce undefined weights. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 68% | No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. PAY_TABLE is internal but drives all payout logic tested indirectly through getPayMultiplier. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout path. Missing tests for all symbols, all count branches (3/4/5), unknown symbol returning 0, and count < 3 edge case. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 88% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Core event emitter used by src/engine.ts — on/off/emit logic, duplicate handler behavior, off with unknown event, emit with no listeners, and multi-arg propagation are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant string used by src/engine.ts as an event name — no tests verify its value or usage. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 55% | No test file exists. Used by src/engine.ts, meaning buildReels() is a critical path: reel count, row count handling, and spinReel delegation are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Used by engine.ts but no coverage for empty reels, single scatter, exactly 3 scatters, or mixed symbol grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. Critical state-mutation logic with 4 distinct branches (activate, retrigger, decrement, deactivate) has zero test coverage. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic called by src/engine.ts has zero test coverage — no happy path, no edge cases (empty reels, fewer than 4 diamonds, exactly 4, nested structure variations). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 90% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, boundary roll exactlyequal to cumulative weight, and non-uniform weight distributions. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used in computePayout at line 106 to apply house edge multiplier. | [UNIQUE] Numeric constant with no duplicates found | [OK] Constant value 0.05 is correct; the misapplication is in computePayout, not here. | [LEAN] Named constant for a domain value used in computePayout. Appropriate. | [NONE] No test file exists. | [UNDOCUMENTED] Unexported internal constant. No comment explaining the 5% value or its effect on RTP.
  - DEBUG_MODE: [USED] Used in spin at line 171 to conditionally log debug information. | [UNIQUE] Boolean constant with no duplicates found | [OK] Boolean flag, no correctness issue. | [LEAN] Simple boolean flag. Hardcoded false is dead code but not overengineering. | [NONE] No test file exists. | [UNDOCUMENTED] Unexported internal flag. No comment; name is clear but leniency applied for private helper.
  - EngineContainer: [USED] Instantiated at line 29; provides dependency registration/resolution. | [UNIQUE] Service container class with registry pattern, no similar implementations found | [OK] resolve silently returns undefined cast to T for unknown keys, but all three keys are registered at module load before any spin() call. | [OVER] DIY IoC container (register/resolve via a string-keyed Map) wrapping three static imports that are already in scope at the top of the file. The only consumer is the module-level `container` instance, which immediately registers `weightedPick`, `getPayMultiplier`, and the reels module — all directly imported — only so `spin()` can resolve them back out. No indirection benefit, no swappable implementations, no testability gain beyond what plain variables provide. Textbook single-use container anti-pattern. | [NONE] No test file exists. | [UNDOCUMENTED] Unexported internal class acting as a service locator. No JSDoc on class or either method.
  - container: [USED] DI container instance; resolves dependencies in spin function. | [UNIQUE] Singleton instance initialization with no duplicates found | [OK] Module-level registration of three known keys; no logic errors. | [LEAN] Straightforward instantiation of EngineContainer. Overengineering lives in the class definition, not here. | [NONE] No test file exists. | [UNDOCUMENTED] Unexported module-level singleton. No comment; tolerated as internal wiring.
  - PAYLINES: [USED] Used in spin to iterate paylines and evaluate wins. | [UNIQUE] Payline configuration array with no similar data structures found | [OK] Ten paylines, each with five valid row indices (0–2) matching a 3-row reel grid. | [LEAN] Static data table for 10 paylines. No abstraction, appropriate representation. | [NONE] No test file exists. | [UNDOCUMENTED] Unexported constant. No comment describing the row-index encoding scheme or how paylines map to the 3×5 grid.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted() call at line 38 | [UNIQUE] No similar symbols found in semantic search | [OK] Eight symbols correctly defined; array order matches ReelWeightConfig and weightsToArray ordering. | [LEAN] Flat array of 8 fixed symbol names. No abstraction needed. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant; leniency applies, but no comment explains its role as the canonical ordered symbol list used for reel indexing.
  - DEFAULT_WEIGHTS: [USED] Referenced 5 times in REEL_WEIGHTS initialization (lines 24–28) | [UNIQUE] Configuration constant, no duplicates found | [OK] Excluded per project instructions (previously overturned false positive). | [LEAN] Simple literal config object. The naming is clear and the values match the documented distribution. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Raw numeric values give no indication of total weight (120), probability implications, or that all five reels share this distribution.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Referenced in spinReel (line 44) and getReelWeights (line 57) | [UNIQUE] Constant array initialization, no duplicates found | [OK] Five reels, each initialized from DEFAULT_WEIGHTS via weightsToArray. Structure is correct. | [LEAN] Five identical rows is verbose but transparent. The repetition is intentional and leaves room for per-reel customisation without structural change. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. No comment explains the 5-reel structure, that all reels share identical weights, or how this array is indexed by reel position.
  - pickFromWeighted: [USED] Called in spinReel at line 39 to select random symbol | [DUPLICATE] Implements identical weighted random selection algorithm as weightedPick from rng.ts | [OK] Excluded per project instructions (previously overturned false positive). | [LEAN] Standard O(n) weighted-pick — correct and minimal for 8 symbols. | [NONE] No test file exists. This is the most critical untested function — probabilistic selection logic with boundary behavior (r exactly at accumulator boundary, zero-weight symbols) and a fallback return that masks silent failures. | [UNDOCUMENTED] Non-exported helper. Name is descriptive enough; leniency applies. A note on the fallback return (last item) would help but is not required.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported internal constant referenced in getPayMultiplier function (line 15) | [UNIQUE] Lookup table constant. No similar data structures found. | [OK] All six rows match the authoritative paytable exactly (reference: .anatoly/state/internal-docs/04-API-Reference/02-Configuration-Schema.md). | [LEAN] Flat Record mapping symbol names to fixed 3-tuple multipliers. Minimal and appropriate for a static 6-symbol pay table. | [NONE] No test file exists. PAY_TABLE is internal but drives all payout logic tested indirectly through getPayMultiplier. | [UNDOCUMENTED] Private constant; table structure is self-descriptive. No JSDoc explaining tuple layout (×3, ×4, ×5 multipliers) or that entries apply to lineBet. Tolerable given internal scope, but tuple semantics are non-obvious.

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
