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
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 85% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 93% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

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
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists. Critical export with incorrect house-edge logic (adds edge instead of reducing) and an unconditional bet*0.01 bonus — both behaviors go untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 92% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 93% | No test file exists. This stochastic function has critical edge cases (zero-weight items, single-item list, boundary rounding) that need deterministic seeding tests. |
| `spinReel` | L43–L50 | 🔴 NONE | 75% | No test file exists. Imported by src/factories.ts, making it a critical path with no coverage. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 72% | No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists for this module. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file. Used by engine.ts and legacy.ts — critical payout logic with count branching (3/4/5) and unknown-symbol fallback is completely untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 82% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 78% | Auto-resolved: function ≤ 5 lines |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 87% | No test file exists. Core class used by src/engine.ts with on/off/emit methods — none tested. Missing coverage for: multiple handlers, handler removal, emit with no listeners, and args forwarding. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used by src/engine.ts as an event name key; no tests verify its value or integration usage. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. Core factory used by src/engine.ts with no coverage of buildReels output shape, reelCount loop iterations, or spinReel integration. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Called by src/engine.ts — no coverage of empty reels, single scatter, exactly 3 scatters, or multi-reel layouts. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Called by src/engine.ts — all three branches (activate, retrigger, decrement/deactivate) are untested, including boundary at remaining=1. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 93% | No test file exists. Critical edge cases untested: empty arrays, mismatched lengths, zero-weight items, single-item input, weight boundary (roll == cumulative), and distribution uniformity. Called by src/engine.ts, making this a gap in core logic coverage. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic used by src/engine.ts has zero coverage — no happy path, edge cases (empty reels, fewer than 4 diamonds, exactly 4, nested empty arrays), or boundary tests. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Applied to adjust payout in computePayout function at line 105 | [UNIQUE] Numeric constant. No similar definitions found. | [OK] Constant value 0.05 is correct for 5% house edge; the misapplication is in computePayout, not here. | [LEAN] Named constant for a domain magic number. Appropriate. | [NONE] No test file exists. | [UNDOCUMENTED] Internal constant, no JSDoc. Value meaning and RTP impact are implicit.
  - DEBUG_MODE: [USED] Feature flag checked in spin function at line 159 to conditionally log debug output | [UNIQUE] Boolean constant. No similar definitions found. | [OK] Boolean flag, no correctness issue. | [LEAN] Simple boolean flag. Minimal. | [NONE] No test file exists. | [UNDOCUMENTED] Internal flag, no JSDoc. Self-explanatory name; low severity given internal use.
  - EngineContainer: [USED] Class instantiated at line 29 as container for dependency injection | [UNIQUE] Generic DI container class. No similar implementations found. | [OK] resolve() silently returns undefined cast as T for unknown keys, but all three registered keys are consumed correctly in the current call sites. | [OVER] Hand-rolled IoC/service-locator using `Map<string, unknown>` with unsafe `as T` casts to store 3 fixed, file-local dependencies that could be plain imports or a const object. The pattern adds indirection, loses type safety, and has a single instantiation site. No benefit over `const deps = { rng: weightedPick, paytable: getPayMultiplier, reels: { getReelSymbols, getReelWeights } }`. | [NONE] No test file exists. | [UNDOCUMENTED] Internal DI container class, not exported. No JSDoc explaining purpose or the service keys it holds. Leniency applied for internal helper.
  - container: [USED] Service locator instance registered at lines 30-32 and resolved in spin at lines 120-122 | [UNIQUE] Module-scoped instance. No similar instantiations found. | [OK] Registrations are valid. rng and reelsModule are resolved in spin() but never consumed (factory handles reel generation), which is suspicious but not a defect in the container itself. | [LEAN] Instantiation of EngineContainer; overengineering lives in the class definition above, not here. | [NONE] No test file exists. | [UNDOCUMENTED] Module-level singleton, not exported. No JSDoc; low severity given internal use.
  - PAYLINES: [USED] Array iterated in spin loop at line 133 and accessed at lines 134 and 149 | [UNIQUE] Payline configuration array. No similar definitions found. | [OK] All row indices are in [0,2]; matches the documented 10-payline layout exactly. | [LEAN] Fixed data table for 10 paylines. Appropriate representation. | [NONE] No test file exists. | [UNDOCUMENTED] Internal constant with non-obvious semantics (row-index paths). No JSDoc explaining the coordinate system or payline shapes.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Used in pickFromWeighted call (L47) and returned by getReelSymbols (L53) | [UNIQUE] Constant symbol array with no similar declarations found | [OK] Array of 8 slot symbols; order matches ReelWeightConfig fields and weightsToArray output. | [LEAN] Simple constant array of 8 symbol names. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant; name is clear, but no comment explaining the canonical symbol ordering (which matters for index alignment with weight arrays).
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray 5 times in REEL_WEIGHTS initialization (L24–L28) | [UNIQUE] Weight configuration constant with no similar definitions found | [NEEDS_FIX] DIAMOND weight=30 (P=0.25 per cell) produces DIAMOND-alone expected payout of ~229% per line bet, making total RTP >> 100%; directly violates the arbitrated 95% RTP target. | [ACCEPTABLE] Object literal using ReelWeightConfig. Slightly over-structured given the interface issue, but readable as a named config block. Acceptable on its own. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Specific numeric values carry semantics (total=120, relative probabilities) that are non-obvious without comment. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug. DEFAULT_WEIGHTS (reels.ts:12-15) defines valid numeric weights summing to 120. The weighted selection algorithm in pickFromWeighted (reels.ts:31) normalizes by total weight via `wts.reduce((s, w) => s + w, 0)`, so non-100 sums are correct by design. The constant is used exactly 5 times at L23-27 to build REEL_WEIGHTS. The escalation detail itself confirms USED and UNIQUE — no defect evidence was provided. The NEEDS_FIX label on the correction axis is unsupported.)
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Accessed in spinReel (L45) and getReelWeights (L57) | [UNIQUE] Reel weight matrix constant with no similar declarations found | [OK] Correctly builds 5 weight arrays from DEFAULT_WEIGHTS; weight-value bug is in DEFAULT_WEIGHTS (rule 10). | [OVER] Five identical calls to weightsToArray(DEFAULT_WEIGHTS) when all reels share the same weights. `Array.from({length:5}, () => [...DEFAULT_WEIGHTS])` or even a single shared array would be simpler. The indirection through weightsToArray compounds the ReelWeightConfig overengineering. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported, but the design choice (all 5 reels share identical weights) is non-obvious and worth a note.
  - pickFromWeighted: [USED] Called in spinReel loop (L47) to select weighted random symbols | [DUPLICATE] 98% identical weighted selection algorithm — only variable names and type specificity differ | [NEEDS_FIX] Uses Math.random(), which is not a certifiable RNG for regulated gaming; casino/slot domain is unambiguous from symbol vocabulary, paytable, and RTP target. | [LEAN] Standard weighted-random selection. Linear scan is appropriate for 8 items; no unnecessary abstraction. | [NONE] No test file exists. This stochastic function has critical edge cases (zero-weight items, single-item list, boundary rounding) that need deterministic seeding tests. | [UNDOCUMENTED] Private helper ~10 lines. Algorithm (weighted random selection with last-item fallback) has non-trivial edge-case behavior, but private-helper leniency applies. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug. pickFromWeighted (reels.ts:30-41) correctly implements cumulative-weight random selection: sums weights (L31), draws uniform random in [0, total) (L32), iterates with accumulator (L33-38), returns fallback (L40). It IS algorithmically identical to weightedPick in rng.ts:5-16 (confirmed: same reduce→random→accumulate→fallback pattern, only variable names differ), but duplication belongs on the duplication axis, not the correction axis. This is the live RNG path: engine.ts:128 → factories.ts:12 spinReel(i) → reels.ts:47 pickFromWeighted(). Function produces correct weighted random output.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant referenced locally in getPayMultiplier at line 15 | [UNIQUE] Payout lookup table mapping symbols to multiplier arrays. No similar tables found. | [NEEDS_FIX] DIAMOND 5-of-a-kind multiplier (1000×) combined with documented DIAMOND reel weight (30/120 = 25%) contributes ~97.7% RTP from that single combination alone, exceeding the entire 95% budget before any other winning combination is counted; total implied RTP far exceeds 100%. | [LEAN] Flat record mapping symbol names to fixed 3-tuple multipliers. Minimal data structure for a fixed paytable. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported (internal), but the tuple structure [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit — nothing documents what each index represents.

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
