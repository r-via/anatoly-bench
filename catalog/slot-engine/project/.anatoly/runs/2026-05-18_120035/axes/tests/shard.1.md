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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE affects every payout calculation and its 0.05 value contradicts the JSDoc comment claiming ~95% RTP (applying 1+0.05 multiplier increases payouts, not decreases them). This logic bug is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is false and its code path is never exercised. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve logic, type-unsafe cast in resolve, and missing-key behavior are all untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline shape correctness (all entries in [0,2], exactly 5 columns) and payline logic are untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. WILD-leading, WILD-only, SCATTER-lead, run < 3, and run >= 3 branches are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 90% | No test file exists. Wild multiplier compounding formula and null-return path are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 75% | No test file exists. The unconditional `bet * 0.01` bonus, the HOUSE_EDGE branch (only triggered when total > 0), Math.ceil rounding, and the `bet: any` type unsafety are all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Array contents and ordering are untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 72% | No test file exists. Weight values (sum, individual fields) are untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists. Ordering and completeness of output array are untested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. Reel count (5) and per-reel weight arrays are untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file exists. Critical probabilistic logic — distribution correctness, boundary (r == acc), single-item, and zero-weight cases all untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 82% | No test file exists. Imported by src/factories.ts; column length (3), valid symbol membership, and out-of-bounds reelIndex are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts; return identity and array contents untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 80% | No test file exists. Imported by src/engine.ts; correct index mapping and returned array contents untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal lookup table is implicitly exercised only through getPayMultiplier, which is also untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by engine.ts and legacy.ts — critical payout logic covering all 6 symbols, counts 3/4/5, unknown symbol fallback (returns 0), and count<3 fallback are all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts but adjustPayout (identity passthrough) is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 85% | No test file exists. Core event emitter used by src/engine.ts — on/off/emit methods and edge cases (duplicate handlers, unknown events, multiple args, handler removal) are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is consumed by src/engine.ts but no test verifies its value or integration usage. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file found. buildReels is used by src/engine.ts (critical path) but has zero test coverage — reelCount loop behavior, spinReel integration, and return shape are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Missing tests for: zero scatters, single scatter, exactly 3 scatters, scatters across multiple reels, non-scatter symbols mixed in. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 78% | No test file exists. Missing tests for all four branches: initial activation (scatters>=3, inactive), retrigger (scatters>=3, active), decrement (active, no scatter), deactivation at remaining<=0. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic (jackpot threshold, diamond counting across reels) used by src/engine.ts has zero test coverage. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical gaming RNG utility used by src/engine.ts has zero coverage — missing tests for uniform distribution, single-item arrays, zero-weight items, mismatched array lengths, and the boundary condition where roll == cumulative. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Internal constant used at line 108 in computePayout to apply house edge multiplier. | [UNIQUE] Configuration constant. No duplicate definitions found. | [OK] Constant value 0.05 matches the documented 5% figure. | [LEAN] Named constant for a magic number; appropriate. | [NONE] No test file exists. HOUSE_EDGE affects every payout calculation and its 0.05 value contradicts the JSDoc comment claiming ~95% RTP (applying 1+0.05 multiplier increases payouts, not decreases them). This logic bug is untested. | [UNDOCUMENTED] No JSDoc. Private constant; name implies purpose but the RTP impact and direction of application are non-obvious.
  - DEBUG_MODE: [USED] Internal constant checked at line 175 to conditionally log debug output. | [UNIQUE] Feature flag constant. No duplicate definitions found. | [OK] Boolean flag used correctly in guarded log. | [LEAN] Simple boolean flag; minimal and direct. | [NONE] No test file exists. Constant is false and its code path is never exercised. | [UNDOCUMENTED] No JSDoc. Private flag; self-explanatory name justifies leniency, but no comment on how to enable or what it logs.
  - EngineContainer: [USED] Internal class instantiated at line 29 and used for service locator pattern. | [UNIQUE] Service locator container class. No similar classes found. | [OK] resolve casts undefined to T on missing keys, but all registered keys are looked up before any unregistered resolve could occur. | [OVER] Hand-rolled service-locator/IoC container for three directly-importable functions. The registry adds indirection with no benefit: values are registered at module load and resolved once inside spin(), where two of the three resolutions (rng, reelsModule) are dead variables never consumed. Direct use of imported functions would be identical in effect and far simpler. | [NONE] No test file exists. register/resolve logic, type-unsafe cast in resolve, and missing-key behavior are all untested. | [UNDOCUMENTED] No JSDoc on class or either method. Purpose as a service-locator/DI container is non-obvious; register/resolve semantics undescribed.
  - container: Auto-resolved: function ≤ 5 lines
  - PAYLINES: [USED] Internal constant defining game paylines; accessed at line 139 in loop and line 165 for line symbol retrieval. | [UNIQUE] Payline configuration matrix. No duplicate definitions found. | [OK] All 10 payline patterns match the internal data-flow doc exactly (indices 0–9 verified). | [LEAN] Ten fixed payline definitions matching the documented grid layout; no abstraction, just data. | [NONE] No test file exists. Payline shape correctness (all entries in [0,2], exactly 5 columns) and payline logic are untested. | [UNDOCUMENTED] No JSDoc explaining the row-index encoding, payline count, or pattern semantics (middle row, zigzag, etc.).

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Passed as argument to pickFromWeighted at line 38 | [UNIQUE] Constant array of symbol names. No similar functions found. | [OK] Eight symbols match ReelWeightConfig and weightsToArray order exactly. | [LEAN] Simple typed constant array listing all 8 symbols. | [NONE] No test file exists. Array contents and ordering are untested. | [UNDOCUMENTED] No JSDoc comment. Not exported; tolerable, but a brief note on ordering (which maps to REEL_WEIGHTS indices) would prevent subtle bugs.
  - DEFAULT_WEIGHTS: [USED] Argument to weightsToArray called 5 times in REEL_WEIGHTS initialization | [UNIQUE] Default weight configuration constant. No similar constants found. | [NEEDS_FIX] DIAMOND weight=30 causes 5-DIAMOND alone to contribute ~97.7% RTP, violating the arbitrated 95% target. Forward: P(DIAMOND/cell)=30/120=0.25; P(5-DIAMOND/payline)=0.25^5≈0.000977; expected payout per payline as fraction of total bet (10×lineBet) = 0.000977×1000/10=9.77%; across 10 paylines = 97.7%. Backward: if 5-DIAMOND were the sole contributor and consumed the full 95% budget, per-payline budget=9.5%; (w/120)^5×100=9.5%→w≈29.6. Sanity: forward(29.6)≈91.6%—consistent, formula sound. At w=30, 5-DIAMOND alone exhausts the entire RTP budget; all other winning combos (3-DIAMOND, 4-DIAMOND, SEVEN, BAR, WILDs) push total RTP well above 100%, contradicting the arbitrated 95% target. | [LEAN] Plain object satisfying ReelWeightConfig; values match documented defaults. | [NONE] No test file exists. Weight values (sum, individual fields) are untested. | [UNDOCUMENTED] No JSDoc. The numeric values carry implicit probability semantics (total=120, share per symbol) that are not explained anywhere inline. (deliberated: confirmed — Verified by cross-referencing reels.ts:12-15 weights with paytable.ts:5-12 payouts. DIAMOND has the highest weight (30/120 = 25% frequency) AND the highest payout multipliers (50/250/1000). For comparison, SEVEN has weight 5/120 = 4.2% but pays only 25/100/500. This inverted frequency-payout relationship violates fundamental slot math — high-paying symbols must be rare to control RTP. The DIAMOND weight appears misconfigured (possibly swapped with a low-value symbol like CHERRY at 25 or should be much lower). Increased confidence from 60→72 because the paytable cross-reference provides concrete mathematical evidence, but kept below 85 because no specification document exists to confirm intended values.)
  - weightsToArray: [USED] Called 5 times at lines 23-27 to populate REEL_WEIGHTS array | [UNIQUE] Converts ReelWeightConfig object to number array. No similar functions found. | [OK] Property extraction order matches SYMBOLS array order exactly. | [ACCEPTABLE] Converts typed config to a positional number[] whose order must manually mirror SYMBOLS. Fragile if SYMBOLS is reordered, but `SYMBOLS.map(s => cfg[s])` would be cleaner. Not overengineered — needed to bridge the typed config to pickFromWeighted's indexed interface. | [NONE] No test file exists. Ordering and completeness of output array are untested. | [UNDOCUMENTED] Not exported, 4-line helper. Name is clear; lenient treatment applies, but the fixed ordering dependency on SYMBOLS is a silent contract worth noting.
  - REEL_WEIGHTS: [USED] Indexed at line 45 in spinReel function | [UNIQUE] 2D array of per-reel weight distributions. No similar constants found. | [OK] Five reels, each initialized from DEFAULT_WEIGHTS, matches documented configuration. | [ACCEPTABLE] Creates 5 identical arrays from DEFAULT_WEIGHTS to support per-reel weight customization. Currently premature (all reels share the same weights), but spinReel(reelIndex) API and the documented architecture explicitly anticipate per-reel differentiation, justifying the structure. | [NONE] No test file exists. Reel count (5) and per-reel weight arrays are untested. | [UNDOCUMENTED] No JSDoc. The fact that all five reels share identical weight tables is a meaningful design decision with no inline explanation.
  - pickFromWeighted: [USED] Called at line 38 within spinReel loop | [DUPLICATE] Identical logic to weightedPick: both use cumulative weight comparison with Math.random() for weighted selection. Only differences are variable naming (total/totalWeight, r/roll, acc/cumulative) and type signature (Symbol-specific vs generic). | [NEEDS_FIX] Math.random() is a non-certifiable PRNG; regulated gambling/casino domain requires a certifiable RNG (inferred from reel/payline/jackpot/paytable vocabulary and arbitrated README context). Math.random() is implementation-defined, non-seedable, and non-auditable — disqualifying for regulated gaming RNG certification (industry convention). | [LEAN] Standard cumulative-weight sampling; matches the documented algorithm exactly. | [NONE] No test file exists. Critical probabilistic logic — distribution correctness, boundary (r == acc), single-item, and zero-weight cases all untested. | [UNDOCUMENTED] Not exported, but the algorithm (cumulative-weight sampling, fallback to last element) has non-obvious edge-case behavior and no JSDoc describing params, return, or invariants. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Compared reels.ts:30-41 with rng.ts:5-16 line-by-line: identical algorithm (cumulative weight accumulation, Math.random() draw, threshold comparison, fallback to last item). Differences are only variable names (total/totalWeight, r/roll, acc/cumulative) and type signature (Symbol-specific vs generic T[]). The function is correct — it produces valid weighted random selections. The real issue is duplication: `weightedPick` is imported at engine.ts:2 and registered in the container at engine.ts:30, but the resolved `rng` at engine.ts:120 is never called. Reel generation flows through factory.buildReels() → spinReel() → pickFromWeighted() (reels.ts:47), bypassing the container entirely. This is a duplication/dead-code concern, not a correctness bug.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported symbol used locally in getPayMultiplier at line 16 | [UNIQUE] Configuration table with no duplicates found in RAG results. | [OK] All six symbol tuples match the documented [3-match, 4-match, 5-match] multipliers exactly. | [LEAN] Flat lookup table mapping symbols to fixed payout tuples. Exactly the right structure for tabular pay data. | [NONE] No test file exists. Internal lookup table is implicitly exercised only through getPayMultiplier, which is also untested. | [UNDOCUMENTED] No JSDoc. Private constant, so lower severity, but the tuple index semantics ([3-match, 4-match, 5-match] multipliers on lineBet) are not obvious from the declaration alone and go unexplained.

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
