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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 91% | [details](#srcrngts) |
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
| `checkLine` | L47–L64 | 🔴 NONE | 90% | No test file exists. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 88% | No test file exists. |
| `computePayout` | L101–L111 | 🔴 NONE | 90% | No test file exists. Critical path: applies house edge incorrectly (adds edge instead of reducing) and always adds 1% of bet; untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 90% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 93% | No test file exists. This is the most critical untested symbol — probabilistic selection logic with boundary behavior (r exactly at accumulator boundary, single-item lists, zero-weight items) is untested. Called by spinReel which feeds src/factories.ts. |
| `spinReel` | L43–L50 | 🔴 NONE | 87% | No test file exists. Imported by src/factories.ts — a critical caller path with no coverage for valid reelIndex, out-of-bounds reelIndex, or output shape (3 symbols per column). |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 90% | No test file exists. Imported by src/engine.ts. Out-of-bounds reelIndex returns undefined with no guard — untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 92% | No test file exists. PAY_TABLE is internal but drives all payout calculations — untested indirectly. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file. Imported by src/engine.ts and src/legacy.ts — critical payout path with no coverage for any symbol, count boundary (2, 3, 4, 5, 6), or unknown symbol returning 0. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 82% | Auto-resolved: function ≤ 5 lines |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 85% | No test file found. Used by src/engine.ts — identity payout pass-through is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 88% | No test file exists. Critical class used by src/engine.ts — on/off/emit methods, multiple listeners, handler deduplication on off(), and emit-with-no-listeners path are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant imported by src/engine.ts but never verified in tests. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Auto-resolved: function ≤ 5 lines |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — no happy path, no edge cases (reelCount=0, reelCount>0, spinReel failure). |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic used by engine.ts with no coverage. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file found. State machine with 4 branches (activation, retrigger, decrement, deactivation) — all untested. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 91% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, zero-weight items, single-item input, weight distribution uniformity. Called by src/engine.ts, suggesting it is on a critical path. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Called by src/engine.ts, making it a critical path with no coverage for happy path, edge cases (fewer than 4 diamonds, exactly 4, empty reels, nested empty arrays), or boundary conditions. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Internal constant used in computePayout (line 105) to adjust payout | [UNIQUE] Module constant; no similar definitions found | [OK] Constant value 0.05 is correct; the defect is in how computePayout applies it. | [LEAN] Simple named constant. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Internal constant, but its effect on payout math is non-obvious and undocumented.
  - DEBUG_MODE: [USED] Internal constant checked in spin (line 159) for debug logging | [UNIQUE] Module constant; no similar definitions found | [OK] Boolean flag, no correctness issue. | [LEAN] Simple named constant. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Internal flag; name is self-explanatory but acceptable to leave undocumented.
  - EngineContainer: [USED] Internal class instantiated on line 29 to create service locator | [UNIQUE] Custom DI container class; no semantic duplicates found | [OK] resolve() returns undefined (cast to T) for missing keys, but all keys used in spin() are pre-registered at module load, so no runtime failure in current code. | [OVER] Service-locator container for 3 statically-imported module-level values (weightedPick, getPayMultiplier, {getReelSymbols,getReelWeights}) that never change and are not injected from outside. Adds register/resolve indirection with no substitution, testing, or extension benefit. Direct calls to the imports are sufficient. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc on class or its methods. Internal DI container; purpose and usage pattern are not obvious from the name alone.
  - container: [USED] Internal variable used to register (lines 30-32) and resolve (lines 120-122) services | [UNIQUE] Module singleton instance; no duplicates found | [OK] All three keys registered correspond exactly to what spin() resolves. | [LEAN] Plain variable declaration; over-engineering lives in EngineContainer class above. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Module-level singleton with no comment explaining what it holds or why.
  - PAYLINES: [USED] Internal constant array used in spin to evaluate paylines (lines 133-134, 149) | [UNIQUE] Game payline pattern matrix; no similar constants found | [OK] All 10 paylines match the reference documentation exactly. | [LEAN] Static lookup table, exactly the right representation for 10 fixed payline paths. | [NONE] No test file exists. | [UNDOCUMENTED] No JSDoc. Row-index encoding of 10 payline paths is not self-evident; each entry's shape (straight, V, zigzag) is undocumented.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Non-exported; passed to pickFromWeighted in spinReel (L48) | [UNIQUE] Constant array of symbol strings. No similar constants found in RAG results. | [OK] 8-element array matches ReelWeightConfig field order and weightsToArray mapping exactly. | [LEAN] Simple ordered constant array; single source of truth for symbol set. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant; name is clear but no comment explaining it is the canonical ordered symbol list shared by all reels.
  - DEFAULT_WEIGHTS: [USED] Non-exported; passed to weightsToArray 5 times in REEL_WEIGHTS initialization (L24–L28) | [UNIQUE] Constant object defining default symbol weights. No similar constants found in RAG results. | [NEEDS_FIX] DIAMOND weight 30 (25% per cell) makes 5-DIAMOND alone contribute ~97.7% expected return across 10 paylines, exceeding the arbitrated 95% RTP target before any other symbol is counted. | [LEAN] Straightforward value declaration; complexity lies in its type, not the constant itself. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Numeric weight values carry implicit RTP/probability semantics that are non-obvious without a comment (e.g. total=120, DIAMOND is heaviest at 30). (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. DEFAULT_WEIGHTS at src/reels.ts:12-15 has 8 valid numeric weights summing to 120, correctly consumed by weightsToArray (line 17-19) which extracts values in SYMBOLS order. DIAMOND=30 being the most probable symbol with the highest payout is a game-balance concern, not a code defect. ANCIENT_RTP=0.95 (paytable.ts:3) is an unreferenced constant — no runtime code enforces it. computePayout at engine.ts:105 multiplies by (1+HOUSE_EDGE)=1.05 which increases payouts, showing the entire payout chain has multiple design-level inconsistencies, not an isolated weight bug. No crash, no data loss.)
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Non-exported; used in spinReel (L44) and getReelWeights (L57) | [UNIQUE] 2D array of weights for 5 reels initialized from DEFAULT_WEIGHTS. No similar constants found in RAG results. | [OK] 5 reels each initialized from weightsToArray(DEFAULT_WEIGHTS); structure is correct. | [ACCEPTABLE] Five explicit calls are verbose when all reels share identical weights, but the per-index structure keeps the door open for per-reel tuning without a refactor. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Non-obvious that all five reels share identical weights; a brief comment would clarify the design intent.
  - pickFromWeighted: [USED] Non-exported; called in spinReel loop (L48) for weighted symbol selection | [DUPLICATE] Identical weighted random selection algorithm to weightedPick in rng.ts (RAG score 0.823). Both: compute total weight via reduce, generate random value, iterate with accumulator, return when threshold exceeded, fallback to last item. | [NEEDS_FIX] Uses Math.random() in a certified slot-machine engine; not suitable for regulated gaming RNG. | [LEAN] Textbook weighted random selection — linear scan, no unnecessary abstraction. | [NONE] No test file exists. This is the most critical untested symbol — probabilistic selection logic with boundary behavior (r exactly at accumulator boundary, single-item lists, zero-weight items) is untested. Called by spinReel which feeds src/factories.ts. | [UNDOCUMENTED] Non-trivial algorithm (cumulative weighted random selection) with no JSDoc. Not exported, but complexity warrants at minimum a one-line description. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on correction axis. Algorithm at src/reels.ts:30-41 is a correct cumulative-weight random selection: sums weights via reduce (line 31), generates uniform random in [0, total) (line 32), accumulates and returns on threshold (lines 34-38), fallback to last item (line 40). Called at line 47 with SYMBOLS (8 items) and REEL_WEIGHTS[reelIndex] (8 weights) — always matching lengths. Duplication with rng.ts:weightedPick is real (RAG score 0.823) but belongs on the duplication axis, not correction. Math.random() non-certifiability is a compliance concern, not an algorithmic correctness defect.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Internal const used by getPayMultiplier at line 15 (PAY_TABLE[symbol]). Essential to function logic. | [UNIQUE] Configuration object mapping symbols to payout multipliers; no duplicates found | [NEEDS_FIX] DIAMOND multipliers (50/250/1000) combined with documented reel weight 30/120=0.25 produce ≈229% RTP from DIAMOND alone, violating the arbitrated 95% target. Forward: per payline (lineBet=bet/10) — 5-of-a-kind: 0.25^5×1000/10≈0.0977; 4-of-a-kind: 0.25^4×0.75×250/10≈0.0732; 3-of-a-kind: 0.25^3×0.75×50/10≈0.0586; sum≈0.229/payline × 10 paylines = 2.29× bet. Backward: for DIAMOND to fit within ~30% of the 0.95 budget, mult3 must be ≤7× (not 50×). Sanity: forward(mult3=6)≈0.27× bet ✓ formula consistent. Current mult3=50 is ~7× above that ceiling; cherry/lemon (each ≈0.208 probability) add further surplus. | [LEAN] Flat record mapping 6 symbols to fixed 3-tuple arrays — minimal and appropriate for a static paytable. | [NONE] No test file exists. PAY_TABLE is internal but drives all payout calculations — untested indirectly. | [UNDOCUMENTED] Private constant; leniency applied. Still, the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and a one-line comment would clarify the positional semantics. No JSDoc present. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. PAY_TABLE at src/paytable.ts:5-12 is structurally correct: Record<string, [number, number, number]> with 6 symbol entries, each a valid 3-element tuple. Used correctly at line 15 via PAY_TABLE[symbol]. getPayMultiplier correctly indexes row[0]/row[1]/row[2] for counts 3/4/5 at lines 17-19. No crash path, no data loss. The values themselves are game-design configuration — no enforced constraint validates them against a target RTP. Changing them would be a behavioral change with no evidence of a bug.)

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
