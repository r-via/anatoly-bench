[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 10 | 92% | [details](#srcenginets) |
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
| `Bet` | L12–L12 | 🔴 NONE | 90% | No test file exists for this module. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE affects computePayout output and is untested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior and type-cast safety are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton with registered dependencies is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline coordinate correctness is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 92% | No test file exists. WILD-leading logic, SCATTER early-return, run threshold, and mixed-symbol break are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 88% | No test file exists. Wild multiplier compounding formula and null-return path are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 92% | No test file exists. Comment claims house edge reduces RTP to ~95% but code multiplies by (1 + HOUSE_EDGE) — inflating rather than reducing — plus unconditional bet*0.01 bonus. None of this is tested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | No test file exists. Primary exported function used by src/index.ts has zero coverage: invalid-bet validation, free spin triggering, jackpot path, wild multiplier accumulation, and strategy.adjustPayout integration are all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 85% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists for this module. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 90% | No test file exists. This function has non-trivial weighted-random logic (boundary at r < acc, fallback to last item) that critically needs edge-case coverage: zero-weight entries, single-item list, r exactly at a boundary. |
| `spinReel` | L43–L50 | 🔴 NONE | 95% | No test file exists. Used by src/factories.ts; missing tests for valid reel index, out-of-bounds index (REEL_WEIGHTS[reelIndex] would be undefined), and that exactly 3 symbols are returned. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Used by src/engine.ts; no coverage of returned array identity or contents. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file exists. Used by src/engine.ts; no coverage of valid index, out-of-bounds index, or returned array contents. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Module-private but drives all payout logic — untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout path with zero test coverage. Missing: valid symbol+count combos, unknown symbol returns 0, count < 3 returns 0, count boundary (3/4/5). |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 88% | No test file found. Used by src/engine.ts, so its identity transform (pass-through payout) is untested despite being on a critical path. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 88% | No test file exists. Core class used by src/engine.ts with on/off/emit methods — none are tested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used by src/engine.ts as an event key; not validated in any test. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Abstract class with no test file. No tests exist for any subclass behavior contract. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file found. buildReels is imported by src/engine.ts (critical path) but has zero test coverage — happy path, reel count, row count ignored behavior, and spinReel integration are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Used by engine.ts — needs tests for empty reels, no scatters, partial scatter counts, and full grid scatters. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. Critical state machine with 4 branches (activate, retrigger, decrement, deactivate) — all untested. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic (jackpot detection) used by src/engine.ts has zero coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, single reel), or boundary tests. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical edge cases untested: empty arrays, mismatched weights/items length, all-zero weights, single-item arrays, and boundary roll == cumulative. Called by src/engine.ts, making this a production risk. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout at line 104: total * (1 + HOUSE_EDGE). | [UNIQUE] No similar constant found in RAG results. | [OK] Value 0.05 is correct for a 5% house edge; the misapplication is in computePayout. | [LEAN] Simple named constant, no structural complexity. | [NONE] No test file exists. HOUSE_EDGE affects computePayout output and is untested. | [UNDOCUMENTED] No JSDoc. Internal constant; the JSDoc on computePayout alludes to RTP ~95%, but the constant itself has no comment explaining the value or intent.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded false; the guarded console.log block (lines 162–164) is unreachable dead code at runtime. | [UNIQUE] No similar constant found in RAG results. | [OK] Boolean constant, no correctness issue. | [LEAN] Hardcoded boolean flag — minimal by definition. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Internal flag, self-descriptive name, low severity.
  - EngineContainer: [USED] Instantiated at line 29 to create the module-level container. | [UNIQUE] No similar class found in RAG results. | [OK] Simple registry; all resolved keys are registered before use. | [OVER] Hand-rolled service-locator for 3 statically-imported values (rng, paytable, reels) that are never swapped at runtime. A Map<string, unknown> with untyped resolve<T> adds indirection with zero benefit over direct import calls. Two of the three resolved values (rng, reelsModule) are never even used after resolution. | [NONE] No test file exists. register/resolve behavior and type-cast safety are untested. | [UNDOCUMENTED] No JSDoc on the class or either method. Purpose as a service-locator/DI container is non-obvious from the name alone.
  - container: [USED] Populated at lines 30–32; paytable resolved at line 129 and passed to evaluateLine. | [UNIQUE] No similar variable found in RAG results. | [OK] All three registrations are valid imports. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. Module-level singleton with registered dependencies is untested. | [UNDOCUMENTED] No JSDoc. Module-level singleton with no explanation of registered keys or lifecycle.
  - PAYLINES: [USED] Iterated in spin at lines 143–145 and indexed again at line 165 for wild multiplier calculation. | [UNIQUE] No similar constant found in RAG results. | [OK] Matches the 10-payline layout in the reference docs exactly. | [LEAN] Plain data array matching the documented 10-payline definition exactly. | [NONE] No test file exists. Payline coordinate correctness is untested. | [UNDOCUMENTED] No JSDoc. The row-index encoding convention and which patterns correspond to which payline shapes are not documented inline.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls (L48, L53) and returned by getReelSymbols. | [UNIQUE] No similar constants found in RAG results. | [OK] Eight-symbol array correctly declared and ordered. | [LEAN] Plain constant array; minimal and appropriate. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Non-exported module constant; name is clear but no comment explains it is the canonical ordered symbol list shared by all reels.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27). | [UNIQUE] No similar constant found in RAG results. | [NEEDS_FIX] DIAMOND weight 30 (p = 0.25) produces ~229.5% per-payline EV from DIAMOND alone, making the arbitrated 95% RTP target impossible. | [LEAN] Straightforward config constant; complexity belongs to the type it uses, not to this declaration. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Non-exported constant; no explanation of what the numeric values represent (relative weights summing to 120) or that all five reels share this distribution. (deliberated: confirmed — Confirmed with higher confidence. src/reels.ts:14 sets DIAMOND weight=30, total=120, p=0.25. src/paytable.ts:11 pays DIAMOND 50/250/1000× for 3/4/5-of-a-kind. EV from DIAMOND alone: 0.25^3×0.75×50 + 0.25^4×0.75×250 + 0.25^5×1000 = 2.295× per line bet (229.5%). This single symbol exceeds 100% RTP before counting 7 other symbols, WILDs, or bet*0.01 floor. The 95% RTP target (ANCIENT_RTP=0.95 at src/paytable.ts:3) is mathematically impossible. Raised confidence because the arithmetic is independently verifiable.)
  - weightsToArray: [USED] Called five times to populate REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar functions found per RAG. | [OK] Returns weights in SYMBOLS declaration order with no gaps or misordering. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists for this module. | [UNDOCUMENTED] Private helper, <10 lines, name is self-explanatory. Tolerated per internal-helper leniency rule.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and getReelWeights (L57). | [UNIQUE] No similar constant found in RAG results. | [OK] Five reels correctly initialized from DEFAULT_WEIGHTS; weight defect originates there, not here. | [ACCEPTABLE] Five identical entries signal a per-reel design intent (weights could differ), which aligns with the documented extension path of forking the file to change weights per reel. Slight redundancy (5× same call), but the explicitness is justified. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Non-exported constant; structure (5 reels each carrying 8 weights) and the fact that all reels are identical are not documented.
  - pickFromWeighted: [USED] Called inside spinReel loop (L48). | [DUPLICATE] Logic is 95%+ identical to weightedPick in src/rng.ts: both sum weights, draw Math.random()*total, accumulate in a loop, return items[i] on first exceedance, fall back to last item. Only differences are variable names and that pickFromWeighted is typed Symbol[] instead of generic T[]. pickFromWeighted is interchangeable with weightedPick and should be replaced by it. | [NEEDS_FIX] Uses Math.random(), a non-certifiable PRNG, in a regulated slot-machine engine (domain inferred from reel/payline/jackpot/RTP vocabulary throughout codebase). | [LEAN] Standard weighted-random selection; O(n) linear scan is appropriate for 8 items. | [NONE] No test file exists. This function has non-trivial weighted-random logic (boundary at r < acc, fallback to last item) that critically needs edge-case coverage: zero-weight entries, single-item list, r exactly at a boundary. | [UNDOCUMENTED] Private helper implementing weighted random selection. Not exported; name conveys intent. Tolerated per internal-helper leniency rule. (deliberated: reclassified: correction: NEEDS_FIX → OK — Downgraded. src/reels.ts:30-41 correctly implements weighted random selection: sums weights, draws uniform random, accumulates until threshold, falls back to last item. Algorithm is identical to weightedPick in src/rng.ts:5-16. The Math.random() concern is a regulatory/security best-practice, not a correctness defect — the function produces correctly distributed outputs. Notably, src/rng.ts:7 (weightedPick) also uses Math.random(), so the entire codebase has the same RNG source. No functional incorrectness exists.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant referenced in getPayMultiplier (L15) via PAY_TABLE[symbol]. | [UNIQUE] No similar data structures found in RAG results. | [NEEDS_FIX] DIAMOND 5-of-a-kind multiplier (1000×) combined with documented DIAMOND reel weight (30/120) implies ~211% RTP from this combination alone, consuming the entire arbitrated 95% RTP budget before any other symbol contributes. | [LEAN] Flat record mapping symbol names to fixed three-element tuples. Minimal, appropriate data structure for a static paytable. | [NONE] No test file exists. Module-private but drives all payout logic — untested. | [UNDOCUMENTED] Private constant with no JSDoc. Tuple structure [number,number,number] representing 3/4/5-of-a-kind multipliers is not documented. Lenient given it is non-exported.

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
