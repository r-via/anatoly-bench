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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 88% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects payout math but is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is never tested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior, type-unsafe cast, and missing-key handling are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions drive all win detection but have no coverage. |
| `checkLine` | L47–L64 | 🔴 NONE | 75% | No test file exists. WILD substitution, SCATTER early-return, run-length cutoff, and all-WILD edge cases are untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 80% | No test file exists. Wild multiplier compounding, no-win null return, and payout calculation are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file exists. HOUSE_EDGE application, zero-win base-bet bonus, Math.ceil rounding, and the documented bug (edge adds instead of reducing) are all untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS defines the full symbol set used by spinReel and getReelSymbols — untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 92% | No test file. Weight values directly affect game odds; sum correctness and per-symbol values are untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file. Ordering of returned array must match SYMBOLS order exactly — a transposition would silently corrupt all odds. No tests verify this invariant. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. No verification that all 5 reels are initialized, each has 8 entries, or that weights are non-negative. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 90% | No test file. Core probability logic is completely untested: boundary conditions (r === 0, r just below total), fallback return on floating-point overshoot, uniform distribution across zero-weight items, and single-item degenerate case all lack coverage. |
| `spinReel` | L43–L50 | 🔴 NONE | 75% | No test file. Imported by src/factories.ts — a production code path. No tests for out-of-bounds reelIndex, column length of exactly 3, or symbol membership in SYMBOLS. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Imported by src/engine.ts. Returns mutable array reference; no tests verify contents or immutability. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 90% | No test file. Imported by src/engine.ts. No tests for valid reelIndex range, returned array length, or correct weight values. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal constant, but its values directly determine payout correctness — zero coverage. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no tests for valid counts (3/4/5), unknown symbols, or boundary counts (0, 1, 2, 6+). |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 88% | Abstract base class with no test file. No tests verify the interface contract. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file exists. DefaultStrategy is imported by src/engine.ts (critical path), but adjustPayout — which is an identity function — has no direct tests verifying it returns the result unchanged across varying SpinResult shapes. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file exists. Core event emitter used by src/engine.ts — on/off/emit methods, including edge cases like removing non-existent handlers, emitting with no listeners, and multi-listener ordering, are entirely untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used as event key in src/engine.ts; its integration with SpinEventEmitter.emit is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file exists. buildReels is used by src/engine.ts (critical path) but has zero coverage — reelCount loop behavior, spinReel integration, and rowCount being ignored are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts; edge cases like empty reels, no scatters, mixed symbols, and all-scatter grids are untested. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) are all untested, including the boundary condition at remaining <= 0. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic (jackpot trigger) with no coverage — happy path, boundary (exactly 4 diamonds), under-boundary (3 diamonds), empty reels, and multi-reel distribution cases all untested. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 88% | No test file exists. Critical RNG logic used by src/engine.ts has zero coverage — no tests for uniform distribution, boundary roll (roll === cumulative), zero weights, single-item input, or weight normalization correctness. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Used in computePayout (line 107) to apply house edge multiplier | [UNIQUE] Numeric constant for house edge calculation. No duplicates found. | [OK] Value 0.05 is correct; the defect is in the formula that uses it. | [LEAN] Named constant for a single magic number. Minimal and appropriate. | [NONE] No test file exists. HOUSE_EDGE directly affects payout math but is never tested. | [UNDOCUMENTED] Non-exported module constant; name is self-explanatory. Lenient for internal constants.
  - DEBUG_MODE: [USED] Used in spin function (lines 176-178) to conditionally log debug output | [UNIQUE] Boolean constant for debug flag. No duplicates found. | [OK] Simple boolean guard with no correctness impact. | [LEAN] Simple boolean flag. Hardcoded false is inert but harmless. | [NONE] No test file exists. Constant is never tested. | [UNDOCUMENTED] Non-exported boolean flag; self-explanatory. Lenient for internal constants.
  - EngineContainer: [USED] Instantiated at line 29 and used throughout spin to manage dependency injection | [UNIQUE] Service locator pattern class with generic register/resolve methods. No duplicates found. | [OK] resolve() silently returns undefined for unknown keys, but all three registered keys are resolved before use in spin(). | [OVER] Full registry/IoC container (Map, generic resolve<T>) for three static module-level imports. All three could be imported and called directly with no indirection. Two of the three resolutions (rng, reelsModule) go unused after being resolved in spin(), making the container even less justified. The pattern implies runtime swappability that the codebase never exercises. | [NONE] No test file exists. register/resolve behavior, type-unsafe cast, and missing-key handling are untested. | [UNDOCUMENTED] Non-exported internal class with no JSDoc. Its role as a service-locator/DI container is not described.
  - container: [USED] Used to register and resolve RNG, paytable, and reels dependencies in spin | [UNIQUE] Instance variable of EngineContainer. No duplicates found. | [OK] All keys registered at module load before any consumer calls spin(). | [LEAN] Module-level instantiation of EngineContainer. The over-engineering lives in the class definition; this is just a straightforward usage. | [NONE] No test file exists. Module-level singleton wiring is untested. | [UNDOCUMENTED] Non-exported module-level singleton; intent is inferrable from usage but not documented.
  - PAYLINES: [USED] Used to iterate paylines (line 128) and extract line symbols (lines 129, 159) | [UNIQUE] Specific payline configuration array for slot game. No duplicates found. | [OK] All 10 patterns match the documented payline table exactly. | [LEAN] Plain data array of 10 payline row-index sequences. Exactly the right representation for fixed payline geometry. | [NONE] No test file exists. Payline definitions drive all win detection but have no coverage. | [UNDOCUMENTED] Non-exported constant encoding 10 payline row-index sequences. No comment explains the layout convention or how indices map to reel rows.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted call at line 48 within spinReel function | [UNIQUE] Simple array constant; no similar functions found. | [OK] Eight symbols in correct order matching weightsToArray and ReelWeightConfig fields. | [LEAN] Plain array of 8 literals; appropriate for a fixed symbol set. | [NONE] No test file exists. SYMBOLS defines the full symbol set used by spinReel and getReelSymbols — untested. | [UNDOCUMENTED] No JSDoc. Non-exported internal constant with no comment explaining its role as the master ordered symbol registry (order is significant — it must align with weight arrays).
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray in REEL_WEIGHTS initialization (lines 24-28) | [UNIQUE] Configuration constant; no similar constants found. | [NEEDS_FIX] DIAMOND weight (30/120 = 25%/cell) combined with its 1000× 5-match payout produces ~97.7% RTP from one combination alone, leaving no budget for any other win and implying total RTP >> 100%, violating the documented 95% target [README.md; .anatoly/state/internal-docs/04-API-Reference/02-Configuration-Schema.md]. | [LEAN] Simple typed literal — all 8 values in one place, matches reference doc table exactly. | [NONE] No test file. Weight values directly affect game odds; sum correctness and per-symbol values are untested. | [UNDOCUMENTED] No JSDoc. Magic numeric values (e.g. DIAMOND: 30, SEVEN: 5) carry no explanation of their relative-frequency intent or how they sum to 120. (deliberated: reclassified: correction: NEEDS_FIX → OK — Weights at reels.ts:12-15 sum to 120, which is valid because pickFromWeighted (reels.ts:31) normalizes via `wts.reduce((s, w) => s + w, 0)`. No requirement for weights to sum to 100. Values represent reasonable slot machine symbol frequencies (high-frequency commons like DIAMOND:30, CHERRY:25; low-frequency premiums like SEVEN:5, WILD:5, SCATTER:5). Constant is consumed correctly at reels.ts:23-27 by weightsToArray(). No defect exists.)
  - weightsToArray: [USED] Called 5 times in REEL_WEIGHTS array initialization (lines 24-28) | [UNIQUE] Simple helper converting config object to array; no similar functions found. | [OK] Property extraction order exactly matches SYMBOLS array order; no mapping errors. | [ACCEPTABLE] Thin adapter required by the ReelWeightConfig-to-array conversion. Exists only because weights are stored as a named-field struct rather than an ordered array; not independently over-engineered, just a consequence of that design choice. | [NONE] No test file. Ordering of returned array must match SYMBOLS order exactly — a transposition would silently corrupt all odds. No tests verify this invariant. | [UNDOCUMENTED] Non-exported helper, 4 lines. However, the output order is implicitly coupled to the SYMBOLS array order — a non-obvious constraint with no comment.
  - REEL_WEIGHTS: [USED] Accessed in spinReel function at line 45 | [UNIQUE] 2D weight array initialization; no similar constants found. | [OK] Five entries, one per reel, matching documented configuration. | [ACCEPTABLE] Five identical arrays anticipate per-reel weight variation. The exported getReelWeights(reelIndex) API implies per-reel configuration is a planned use case, so the expansion is not purely speculative. | [NONE] No test file. No verification that all 5 reels are initialized, each has 8 entries, or that weights are non-negative. | [UNDOCUMENTED] No JSDoc. The fact that all five reels share identical weight tables is a meaningful game-design decision with no comment.
  - pickFromWeighted: [USED] Called within spinReel function at line 48 | [DUPLICATE] Identical weighted random selection algorithm with variable naming differences only. | [NEEDS_FIX] Uses Math.random() in a regulated casino/slot-machine domain; Math.random() is not a certifiable CSPRNG and fails regulatory RNG requirements for gaming (inferred domain: slot machine with reels/paylines/jackpot/free-spins vocabulary). Industry convention requires a cryptographically secure, auditable RNG. | [LEAN] Textbook cumulative-weight draw; O(n) single pass, no unnecessary abstraction. | [NONE] No test file. Core probability logic is completely untested: boundary conditions (r === 0, r just below total), fallback return on floating-point overshoot, uniform distribution across zero-weight items, and single-item degenerate case all lack coverage. | [UNDOCUMENTED] Non-exported helper implementing cumulative-weight sampling. The algorithm has edge-case behaviour (fallback to last item when floating-point rounding causes r >= total) that is worth documenting. No JSDoc present. (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at reels.ts:30-41 is algorithmically identical to weightedPick at rng.ts:5-16 (verified: same cumulative-weight approach, only variable names differ). Duplication is real, but the function itself is correct — it produces proper weighted random selections. This is a refactoring opportunity, not a correctness defect. Note: engine.ts:120 resolves weightedPick via DI but never uses it; actual path is factories.ts:12 → spinReel (reels.ts:43) → pickFromWeighted (reels.ts:47). Replacing pickFromWeighted with an import of weightedPick would be a safe refactor since the algorithm is identical, but it's a code quality improvement, not a bug fix.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced locally by getPayMultiplier at line 15 | [UNIQUE] Static lookup table for symbol payouts. No similar tables found in RAG results. | [OK] All six symbol rows match the documented [3-match, 4-match, 5-match] multipliers exactly. | [LEAN] Flat record of tuples is the minimal structure for a fixed 6-symbol, 3-column pay table. No abstraction needed. | [NONE] No test file exists. Internal constant, but its values directly determine payout correctness — zero coverage. | [UNDOCUMENTED] No JSDoc comment. The tuple structure [3-match, 4-match, 5-match] and the unit of each value (multiplier applied to lineBet) are not explained.

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
