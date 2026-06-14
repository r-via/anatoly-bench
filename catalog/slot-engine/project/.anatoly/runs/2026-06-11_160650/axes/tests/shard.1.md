[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 10 | 92% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 90% | No test file exists for this module. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE affects computePayout output but is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior, missing-key behavior, and type-cast correctness are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline coordinate correctness is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 92% | No test file exists. WILD-leading, SCATTER early-exit, run < 3 cutoff, and mixed WILD runs are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 85% | No test file exists. Wild multiplier math, no-win path, and payout calculation against lineBet are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists. The house-edge application is inverted (multiplies by 1.05 instead of reducing), the flat +1% bet bonus is undocumented, and Math.ceil rounding are all untested. Critical exported function called via spin. |
| `spin` | L113–L179 | 🔴 NONE | 92% | No test file exists. Primary exported function imported by src/index.ts. Bet validation, payout computation, free-spin triggering, jackpot detection, and wildMultiplier accumulation are all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS array is used by pickFromWeighted and getReelSymbols; no tests verify its contents or ordering. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Weight values directly affect game payout rates; no tests verify correctness or sum. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file. Maps ReelWeightConfig to ordered array; no tests verify field ordering matches SYMBOLS array order. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. No tests verify 5 reels exist or that each has 8 weights aligned to SYMBOLS. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 95% | No test file. Core probability engine; no tests for uniform weights, zero-weight exclusion, single-item input, or boundary where r == acc. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file. Imported by src/factories.ts for critical spin path; no tests verify 3-row output, valid symbol membership, or out-of-bounds reelIndex behavior. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Consumed by spin() in src/engine.ts; no tests verify returned array length, symbol membership, or immutability. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 90% | No test file. Consumed by spin() in src/engine.ts; no tests verify correct weights per reelIndex or out-of-bounds behavior. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists for this module. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Function is consumed by critical spin logic in engine.ts and legacy.ts — missing tests for all count values (3/4/5), unknown symbols returning 0, and boundary counts (0, 1, 2). |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 88% | No test file exists. Used by the critical `spin` function in engine.ts — pass-through behavior is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 88% | No test file exists. Methods on, off, and emit are untested — including edge cases like removing a non-existent handler, emitting with no listeners, multiple handlers for the same event, and handler deregistration mid-emit. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is consumed by the critical spin() function in engine.ts but its integration with SpinEventEmitter.emit is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists for this source file. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts, but neither the factory nor its reel-building logic has any direct tests. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical path in spin engine with no coverage for zero scatters, exactly 3 scatters, or multi-reel scatter distribution. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches (initial activation, retrigger, decrement, deactivation at 0) all untested despite being core free-spin lifecycle logic called by the main spin function. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 95% | No test file exists. Critical gaming RNG function used in slot machine spin logic lacks any coverage: zero distribution validation, no edge case testing (single item, all-zero weights, mismatched array lengths, negative weights), and no seeded randomness verification for the off-by-one boundary where roll == cumulative. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical jackpot logic consumed by spin() with no coverage of: exactly 4 diamonds (boundary true), 3 diamonds (boundary false), 0 diamonds, diamonds spread across multiple reels vs. single reel, or non-DIAMOND symbols being ignored. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout (line 106): `total * (1 + HOUSE_EDGE)`. | [UNIQUE] No similar constant found elsewhere. | [OK] Constant value 0.05 is correct; the defect is in how computePayout applies it. | [LEAN] Named numeric constant. No abstraction overhead. | [NONE] No test file exists. HOUSE_EDGE affects computePayout output but is never tested. | [UNDOCUMENTED] No JSDoc. Internal constant — name and value are legible, but the design decision (why 0.05, relationship to RTP target) is undocumented. Not exported, so severity is low.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded `false`; the guarded `if (DEBUG_MODE)` block in spin can never execute, making the flag permanently dead weight. | [UNIQUE] No similar constant found elsewhere. | [OK] Boolean constant; no correctness defect. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Internal flag; name is self-explanatory. Low severity as it is not exported.
  - EngineContainer: [USED] Instantiated at line 29 to create `container`. | [UNIQUE] No similar class found elsewhere. | [OK] Registry stores and retrieves values via cast correctly; no correctness defect. | [OVER] DIY Map-backed IoC container for 3 statically-imported ES modules. All three dependencies (weightedPick, getPayMultiplier, getReelSymbols/getReelWeights) are already in scope as named imports — the register/resolve indirection adds zero testability or runtime flexibility. In spin(), rng and reelsModule are resolved from the container but never actually consumed (factory.buildReels() replaces reelsModule; rng goes unused). | [NONE] No test file exists. register/resolve behavior, missing-key behavior, and type-cast correctness are untested. | [UNDOCUMENTED] No JSDoc on the class, register, or resolve methods. The class implements a service-locator pattern that is not obvious from the name alone; resolve uses an unsafe cast with no explanation of failure behavior.
  - container: [USED] Populated at lines 30–32 and resolved inside spin for rng, paytable, and reelsModule. | [UNIQUE] No similar variable found elsewhere. | [OK] Module-level DI container initialized correctly. | [LEAN] Plain instantiation of EngineContainer; overengineering lives in the class definition above. | [NONE] No test file exists. Module-level singleton wiring is untested. | [UNDOCUMENTED] No JSDoc. Module-level singleton with no explanation of lifecycle or why it is used as a DI container.
  - PAYLINES: [USED] Iterated in spin (line 139) and indexed again at line 156 for wild multiplier calculation. | [UNIQUE] No similar constant found elsewhere. | [OK] Matches the 10-payline definition in reference documentation exactly. | [LEAN] Fixed data table for 10 paylines. Correct representation for a static config. | [NONE] No test file exists. Payline coordinate correctness is untested. | [UNDOCUMENTED] No JSDoc. The row-index encoding of each payline path is non-obvious (e.g., [0,1,2,1,0] = V-shape). No inline comments label the shapes; consumers reading the constant cannot understand the geometry without external context.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted call inside spinReel (L47) and returned by getReelSymbols (L53). | [UNIQUE] No similar constant found in the codebase. | [OK] Array of 8 symbols matches ReelWeightConfig and weightsToArray order — internally consistent. | [LEAN] Simple tuple of symbol names. No unnecessary abstraction. | [NONE] No test file exists. SYMBOLS array is used by pickFromWeighted and getReelSymbols; no tests verify its contents or ordering. | [UNDOCUMENTED] No JSDoc. Non-exported internal constant; name is self-descriptive but no comment explains the ordering significance or that this array drives all reel symbol selection.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times to initialize REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar constant found in the codebase. | [NEEDS_FIX] DIAMOND weight 30 (p=0.25 per cell) produces an implied RTP far above 100%, violating the arbitrated 95% RTP target. | [LEAN] Named weight object — the named fields are the readable artifact worth keeping. | [NONE] No test file. Weight values directly affect game payout rates; no tests verify correctness or sum. | [UNDOCUMENTED] No JSDoc. Non-exported constant; the numeric values carry semantic meaning (relative frequency per reel cell) that is not explained anywhere inline.
  - weightsToArray: [USED] Called five times in REEL_WEIGHTS initializer (L23–L27). | [UNIQUE] No similar function found. Specific to ReelWeightConfig struct unpacking. | [OK] Maps ReelWeightConfig fields in the same order as SYMBOLS — no logic errors. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file. Maps ReelWeightConfig to ordered array; no tests verify field ordering matches SYMBOLS array order. | [UNDOCUMENTED] Non-exported helper under 10 lines with a clear name. Tolerated per private-helper rule, but the fixed positional ordering it enforces is a silent contract.
  - REEL_WEIGHTS: [USED] Consumed by spinReel (L44) and getReelWeights (L57). | [UNIQUE] No similar constant found in the codebase. | [OK] Correctly initializes 5 reels from DEFAULT_WEIGHTS; the weight-value defect is in DEFAULT_WEIGHTS. | [LEAN] Five identical rows are slightly repetitive (Array(5).fill(...) would be shorter) but this is trivial data initialization, not an abstraction problem. | [NONE] No test file. No tests verify 5 reels exist or that each has 8 weights aligned to SYMBOLS. | [UNDOCUMENTED] No JSDoc. The fact that all five reels share identical weights and that the outer array index maps to reel index 0–4 is not documented.
  - pickFromWeighted: [USED] Called inside spinReel loop (L47) to select each symbol. | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: both reduce weights to total, roll Math.random()*total, iterate with cumulative accumulator, and fall back to last item. The only difference is this function is typed specifically for Symbol[] rather than being generic. It is fully replaceable by weightedPick<Symbol>. | [NEEDS_FIX] Uses Math.random() in a regulated casino/slot-machine context; Math.random() is not a certifiable RNG for regulated gaming (industry rule 11). Domain is unambiguous from reel/payline/jackpot/free-spin vocabulary and file context. Weighted-selection logic itself is correct: r ∈ [0, total), cumulative accumulation terminates correctly, fallback is safe. | [LEAN] Textbook weighted random selection. Linear scan is correct and appropriate for 8 symbols. | [NONE] No test file. Core probability engine; no tests for uniform weights, zero-weight exclusion, single-item input, or boundary where r == acc. | [UNDOCUMENTED] Non-exported, but the algorithm (cumulative-weight selection with fallback to last item) is non-trivial enough to warrant at minimum a one-liner. No param or return docs. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. src/reels.ts:30-41 implements cumulative-weight random selection correctly: computes total via reduce (L31), draws uniform random (L32), accumulates per-index (L34-37), falls back to last item (L40). The algorithm is identical to weightedPick in src/rng.ts — that's a real duplication concern, but duplication is not a correctness defect. The function produces correct weighted-random output. pickFromWeighted is actively used at src/reels.ts:47 in spinReel, which is the actual runtime reel-generation path via factories.ts:12.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported; referenced directly in getPayMultiplier (L15) to look up per-symbol payout rows. | [UNIQUE] No similar lookup tables found in RAG results. | [OK] All six symbol rows match the reference documentation paytable exactly. | [LEAN] Fixed lookup table as a plain Record with tuple values — minimal and appropriate for a static 6-symbol paytable. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc comment. The structure (symbol → [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] multipliers) is inferrable from context but not documented. No note on units, WILD/SCATTER absence, or relationship to lineBet.

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
