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
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects computePayout output but is never verified. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false; branch it guards is dead in production and untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve type-casting behavior and missing-key silent undefined return are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions are structural inputs to evaluateLine and spin; correctness never verified. |
| `checkLine` | L47–L64 | 🔴 NONE | 92% | No test file exists. Critical logic: WILD-as-lead substitution, SCATTER early return, run-length cutoff at 3 — all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file exists. Wild-count exponential multiplier formula and null propagation from checkLine are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists. Exported public function: house-edge application, minimum bet bonus, Math.ceil rounding, and zero-win path all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 88% | No test file. Critical probabilistic logic (weighted random selection, boundary at r==total, fallback last item) is entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 95% | No test file. Imported by src/factories.ts; produces 3-symbol columns driving game state. No coverage of invalid reelIndex or output length guarantees. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file. Imported by src/engine.ts; trivial accessor but untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 90% | No test file. Imported by src/engine.ts; undefined behavior for out-of-range reelIndex is untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists for this module. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Called by src/engine.ts and src/legacy.ts — critical payout logic with no coverage for count boundaries (2, 3, 4, 5, 6), unknown symbols, or WILD/SCATTER inputs. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 75% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts but adjustPayout (identity function) is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 90% | No test file exists. Critical class used by src/engine.ts with on/off/emit methods — none are tested. Missing: multiple listeners, off() deregistration, emit with no listeners, emit argument propagation. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant imported by src/engine.ts but never exercised in any test. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts but zero test coverage for scatter counting logic. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. Critical state machine with 4 branches (activate, retrigger, decrement, deactivate) — all untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 88% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 85% | No test file exists. Used by src/engine.ts (critical path), but buildReels — including loop logic, reelCount/rowCount handling, and spinReel integration — has zero test coverage. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot detection) imported by src/engine.ts has zero coverage — no happy path, edge cases (empty reels, exactly 4 diamonds, 3 diamonds), or boundary tests. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 90% | No test file found. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, and boundary roll values (roll === cumulative). |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Local constant used in computePayout (line 109) to apply house edge to payout | [UNIQUE] Constant value with no similar patterns found | [OK] Value 0.05 is correct; misapplication is in computePayout. | [LEAN] Named constant for a magic number — correct practice. | [NONE] No test file exists. HOUSE_EDGE directly affects computePayout output but is never verified. | [UNDOCUMENTED] No JSDoc. Internal constant; no documentation on how it interacts with RTP or payout math.
  - DEBUG_MODE: [USED] Local constant referenced in spin function (line 173) for conditional debug logging | [UNIQUE] Boolean constant with no similar patterns found | [OK] No correctness issue. | [LEAN] Simple boolean flag guarding a single log statement. | [NONE] No test file exists. Constant is always false; branch it guards is dead in production and untested. | [UNDOCUMENTED] No JSDoc. Internal flag; name is clear but no documentation on what it enables or how to toggle it.
  - EngineContainer: [USED] Class instantiated at line 29 and used to manage dependency injection for rng, paytable, and reels | [UNIQUE] Service locator container class with no semantic duplicates | [NEEDS_FIX] resolve() returns undefined cast to T when key is absent, producing silent runtime crashes. | [OVER] Hand-rolled service-locator/IoC container with typed `register`/`resolve` for exactly three dependencies that are already available as top-level imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). Adds `Map`, type-erasure via `unknown`, and a cast on every `resolve` call for zero benefit. Direct references to the imports would be clearer, shorter, and fully type-safe. | [NONE] No test file exists. register/resolve type-casting behavior and missing-key silent undefined return are untested. | [UNDOCUMENTED] No JSDoc on class or its methods (register, resolve). Internal service-locator pattern is non-obvious and warrants at least a brief description.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Array of payline definitions used in spin loop (lines 137-138) and wild multiplier calculation (line 162) | [UNIQUE] Game payline configuration array, no duplicates found | [OK] Matches reference documentation exactly. | [LEAN] Static data table matching the documented 10-payline layout exactly. | [NONE] No test file exists. Payline definitions are structural inputs to evaluateLine and spin; correctness never verified. | [UNDOCUMENTED] No JSDoc. The row-index encoding convention and payline shapes are not self-evident from the raw number arrays.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls at line 48 and throughout spinReel logic | [UNIQUE] Constant symbol array definition; no similar constants found | [OK] 8-element array matches the 8 keys in ReelWeightConfig and weightsToArray ordering exactly. | [LEAN] Simple static array of 8 symbols. No abstraction needed beyond this. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant; name is clear but no comment explaining the canonical symbol ordering or its role as the master symbol list.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray in REEL_WEIGHTS initialization 5 times (lines 24-28) | [UNIQUE] Constant weight configuration object; no similar constants found | [OK] Excluded per project instructions (known false positive). | [LEAN] Straightforward static constant given the interface it satisfies. Complexity lives in `ReelWeightConfig`, not here. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Numeric values are opaque without context — nothing explains that weights are relative (total=120) or that all five reels share this distribution.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Accessed in spinReel (line 44) and getReelWeights (line 57) to retrieve weight arrays | [UNIQUE] Constant array of weight arrays; no similar constants found | [OK] Five independent arrays constructed via weightsToArray; indices 0–4 match the documented reel count. | [ACCEPTABLE] Five explicit identical calls is verbose; `Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS))` would be DRYer. However, the 2D structure preserves the option to assign distinct weights per reel without refactoring, which is a real design-time concern for a slot engine. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Nothing documents that this is a 5-reel × 8-symbol weight matrix or that all reels are identical by default.
  - pickFromWeighted: [USED] Called in spinReel loop to randomly select symbols based on weights | [DUPLICATE] RAG score 0.823; implements identical weighted random selection algorithm with same control flow and return behavior | [NEEDS_FIX] Uses Math.random() — not certifiable for regulated gaming RNG. Inferred slot-machine domain from symbol vocabulary (CHERRY/SEVEN/DIAMOND/WILD/SCATTER), paytable, and arbitrated RTP=95% target. Industry convention requires a certifiable CSPRNG; Math.random() is a non-deterministic, implementation-defined PRNG that is not auditable by gaming certification labs. | [LEAN] Canonical O(n) weighted random selection. Correct, minimal, no unnecessary abstraction. | [NONE] No test file. Critical probabilistic logic (weighted random selection, boundary at r==total, fallback last item) is entirely untested. | [UNDOCUMENTED] No JSDoc. Internal but algorithmically non-trivial (weighted random selection); missing param descriptions and invariant that wts.length must equal items.length. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. reels.ts:30-41 implements weighted random selection correctly — sum weights, draw uniform random, accumulate until threshold. The algorithm is identical to weightedPick in rng.ts:5-16, but duplication is a refactoring concern, not a correctness bug. pickFromWeighted is the function actually called at runtime (via spinReel at reels.ts:47 → factories.ts:12 → engine.ts:128). No behavioral defect exists. The NEEDS_FIX was based on duplication detection (RAG score 0.823), which belongs on the duplication axis, not correction.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced in getPayMultiplier function at line 15 | [UNIQUE] Symbol-to-payout lookup table. No similar data structures found. | [OK] All six symbol rows match the reference paytable exactly (3-of-a-kind, 4-of-a-kind, 5-of-a-kind columns). | [LEAN] Plain Record mapping symbol names to fixed 3-tuple multipliers. No abstraction beyond what the domain requires. | [NONE] No test file exists for this module. | [UNDOCUMENTED] Private internal constant; leniency applies. Structure is partially inferrable from values and getPayMultiplier usage, but the tuple index semantics (index 0 = 3-of-a-kind, etc.) are implicit and undocumented.

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
