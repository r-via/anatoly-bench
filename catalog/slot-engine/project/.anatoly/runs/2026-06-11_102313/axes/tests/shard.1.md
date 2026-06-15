[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 10 | 95% | [details](#srcenginets) |
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
| `Bet` | L12–L12 | 🔴 NONE | 90% | No test file exists. Type alias with no runtime behavior, but its constraints (used in spin validation) are untested. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. Constant affects computePayout output but is never verified against expected RTP behavior. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve semantics (including type-unsafe cast on resolve) are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive all win evaluation; correctness of each pattern is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 85% | No test file exists. Critical logic covering WILD leading, SCATTER short-circuit, run counting, and minimum run of 3 is entirely untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file exists. Wild multiplier compounding (basePayout * (1 + wildCount) * 2^wildCount) is a complex, bug-prone formula with zero test coverage. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file exists. Exported public API; applies house edge incorrectly (adds edge rather than reducing it) and unconditionally adds bet*0.01 — critical business logic bugs with no tests to catch them. |
| `spin` | L113–L179 | 🔴 NONE | 95% | No test file exists. Primary exported entry point imported by src/index.ts. Bet validation, reel evaluation, scatter/free-spin integration, jackpot detection, and wildMultiplier aggregation are all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 90% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists. Edge cases like zero weights or mismatched config are untested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file. Core probabilistic logic — boundary conditions (r exactly at boundary, zero total weight, single item) and distribution correctness are untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 92% | No test file. Imported by src/factories.ts; invalid reelIndex (out of bounds) and return shape (3-element column) are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Used by src/engine.ts; identity and immutability of returned array are untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file. Used by src/engine.ts; out-of-bounds reelIndex and correct weight values per reel are untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal table drives all payout logic; no tests verify correctness of multiplier values. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 93% | No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no coverage for count=3/4/5 branches, unknown symbol, or count<3. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, making untested identity passthrough a gap in engine coverage. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 88% | No test file exists. Critical class used by engine.ts with on/off/emit methods — none are tested. Missing coverage for: handler registration, removal, multi-listener dispatch, unknown event no-op, and argument forwarding. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. String constant used by engine.ts; no tests verify it is emitted or handled correctly. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts — buildReels loop logic and spinReel integration are untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts with no coverage for empty reels, single scatter, exactly 3 scatters, or multiple scatters across multiple reels. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts with no coverage for activation (scatters>=3), re-trigger while active, countdown to zero/deactivation, or no-op when inactive with <3 scatters. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 92% | No test file exists. Called by src/engine.ts, so this RNG utility is part of a critical game path. No coverage of uniform distribution, zero-weight items, single-item arrays, weight proportionality, or the fallback return on floating-point boundary cases. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic (jackpot detection) imported by src/engine.ts has zero test coverage — no happy path, no edge cases (exactly 4 diamonds, 3 diamonds, empty reels, multi-column distribution). |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout at line 106: `total * (1 + HOUSE_EDGE)`. | [UNIQUE] No similar constant found in RAG results. | [OK] Value 0.05 is correct for a 5% house edge; the defect is in how computePayout applies it. | [LEAN] Named constant for a magic number. Appropriate. | [NONE] No test file exists. Constant affects computePayout output but is never verified against expected RTP behavior. | [UNDOCUMENTED] No JSDoc. Non-exported internal constant; value is not obvious from name alone (0.05 = 5% edge applied inverted as a bonus rather than a deduction).
  - DEBUG_MODE: [LOW_VALUE] Hardcoded false; the guarded console.log block in spin never executes. Dead debug flag with no runtime effect. | [UNIQUE] No similar constant found in RAG results. | [OK] Constant is fine; conditional guard in spin is correct. | [LEAN] Hardcoded false guards a single log statement. Trivial, not over-engineered. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Non-exported boolean flag; name is self-descriptive and value is trivially false, so low severity.
  - EngineContainer: [LOW_VALUE] Trivial wrapper over Map<string, unknown> with register/resolve. Adds no behavior beyond a plain Map; the container it instantiates also resolves a reelsModule that is never called. | [UNIQUE] No similar registry/DI container class found in RAG results. | [OK] Simple registry; resolve silently returns undefined for missing keys but no in-tree caller passes an unregistered key. | [OVER] Mini IoC container for three static module-level imports that never vary at runtime. `weightedPick`, `getPayMultiplier`, and the reels module are direct imports — wrapping them in a string-keyed registry with type-unsafe `as T` casts adds indirection with no benefit. Direct references would be cleaner, safer, and equally readable. | [NONE] No test file exists. register/resolve semantics (including type-unsafe cast on resolve) are untested. | [UNDOCUMENTED] No JSDoc on class or its methods. Acts as a simple IoC/service-locator container; purpose and usage pattern are non-obvious without documentation.
  - container: [USED] resolve() called three times inside spin to obtain rng, paytable, and reelsModule. | [UNIQUE] Module-level singleton instance; no similar variable found in RAG results. | [OK] Registers three keys; all are resolved in spin. Unused rng/reelsModule resolvees are a utility concern, not a correctness defect. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. Module-level singleton wiring is untested. | [UNDOCUMENTED] No JSDoc. Module-level singleton instance with non-trivial registration side-effects on lines 30–32.
  - PAYLINES: [USED] Iterated in spin's line-evaluation loop and indexed again for wildMultiplier calculation. | [UNIQUE] No similar payline definition array found in RAG results. | [OK] Matches reference documentation exactly. | [LEAN] Fixed 10-entry lookup table matching the documented payline definitions. No abstraction, appropriate representation. | [NONE] No test file exists. Payline definitions drive all win evaluation; correctness of each pattern is untested. | [UNDOCUMENTED] No JSDoc. The encoding convention (row-index per column, 0=top/2=bottom) and shape semantics (zigzag, V-shape, etc.) are not explained.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls (L38, L40) and returned by getReelSymbols (L53). | [UNIQUE] No similar constant found in provided context. | [OK] 8-element constant in correct order matching weightsToArray mapping. | [LEAN] Simple literal array of all symbol names. No unnecessary abstraction. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported, but purpose (master symbol list) and its role as the source-of-truth for reel picks is non-obvious without a comment.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27). | [UNIQUE] No similar constant found in provided context. | [NEEDS_FIX] DIAMOND weight=30 makes DIAMOND combinations alone contribute ~229% expected payout per bet, making total RTP far exceed the arbitrated 95% target. | [ACCEPTABLE] Named fields (CHERRY: 25, …) genuinely improve readability over a raw number array. The over-engineering lives in ReelWeightConfig, not in this constant. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The fact that all five reels share these same weights, and that the total sums to 120, is non-obvious and undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — Weights at reels.ts:12-15 are structurally valid: all positive integers summing to 120. pickFromWeighted (reels.ts:31) normalizes by total, so any positive sum works correctly. DIAMOND at 30 is the highest weight AND highest paytable payout (paytable.ts:11: [50,250,1000]), which is unusual game design but not a code defect — the weightsToArray function (reels.ts:17-20) correctly maps all 8 symbol weights, and REEL_WEIGHTS (reels.ts:22-28) correctly initializes all 5 reels. No structural or computational error exists.)
  - weightsToArray: [USED] Called five times to populate REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar function found per RAG results. | [OK] Output order matches SYMBOLS array; correct mapping. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. Edge cases like zero weights or mismatched config are untested. | [UNDOCUMENTED] Not exported, <10 lines, name is clear. Tolerable absence per internal-helper rule.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and getReelWeights (L57). | [UNIQUE] No similar constant found in provided context. | [OK] Five reels with identical weights matches documentation; root weight defect is in DEFAULT_WEIGHTS. | [OVER] Five identical calls to weightsToArray(DEFAULT_WEIGHTS) implies future per-reel variation that doesn't exist. All reels share the same weights; Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or a single shared reference would be cleaner and honest about current intent. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The structure (5 reels × weight-array) and the constraint that indices 0–4 map to specific reels is undocumented.
  - pickFromWeighted: [USED] Called inside spinReel (L47) to sample a symbol from weighted distribution. | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: same reduce-sum, same Math.random() * total roll, same cumulative accumulation loop, same fallback to last element. Only differences are variable names and that this version hardcodes Symbol[] instead of using a generic type parameter — behavior is fully interchangeable. | [NEEDS_FIX] Uses Math.random() which is not certifiable for regulated gaming RNG. Slot-machine domain inferred from reel/payline/jackpot/RTP/WILD/SCATTER/free-spin vocabulary throughout the project; industry convention requires a CSPRNG or provably-fair RNG for certified gaming. | [LEAN] Standard weighted-random algorithm, cleanly generic (items + weights) without unnecessary indirection. | [NONE] No test file. Core probabilistic logic — boundary conditions (r exactly at boundary, zero total weight, single item) and distribution correctness are untested. | [UNDOCUMENTED] Not exported, but 11 lines of non-trivial weighted-random logic. Missing docs on parameter contracts (items and wts must be same length) and the fallback return on rounding edge cases. (deliberated: reclassified: correction: NEEDS_FIX → OK — reels.ts:30-41 is algorithmically identical to rng.ts:5-16 (same cumulative-weight loop, same fallback to last element). Duplication is real. However, both implementations are individually correct — each produces valid weighted random samples. The finding is misclassified on the correction axis: the function does not produce wrong output, crash, or corrupt data. This is a duplication/refactoring concern, not a correctness bug.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant referenced in getPayMultiplier (L15) via PAY_TABLE[symbol]. | [UNIQUE] Module-local pay table data record. No similar structure found in RAG results. | [OK] All multiplier entries match the reference documentation exactly. | [LEAN] Fixed lookup table; tuple-per-symbol is minimal and direct for a static paytable. | [NONE] No test file exists. Internal table drives all payout logic; no tests verify correctness of multiplier values. | [UNDOCUMENTED] Non-exported internal constant, so lower severity. The tuple structure [number, number, number] is not labelled — readers must infer that the three positions correspond to 3-, 4-, and 5-of-a-kind multipliers.

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
