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
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 82% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE directly affects computePayout output but is never verified. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Constant is always false; branch it guards is dead and untested. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior, type-cast safety, and missing-key behavior are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline coordinate correctness (row/col indexing) is untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 60% | No test file exists. WILD-leading resolution, SCATTER early-return, run-length threshold (2 vs 3), and all-WILD edge case are untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 75% | No test file exists. Wild-count multiplier formula, no-win null return, and payout scaling with lineBet are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 85% | No test file exists. HOUSE_EDGE application (incorrectly inflates rather than reduces payout), flat bet bonus, Math.ceil rounding, and zero-win path are untested. |
| `spin` | L113–L179 | 🔴 NONE | 72% | No test file exists. Exported entry point used by src/index.ts. Input validation (non-number, float, negative, >100), free-spin awarding, jackpot detection, wildMultiplier aggregation, and strategy.adjustPayout integration are all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists for this module. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 95% | No test file exists. This function has critical edge cases untested: boundary where r == acc, total-weight of zero, mismatched items/wts lengths, and statistical distribution correctness. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file exists. Called by src/factories.ts; untested behavior includes out-of-bounds reelIndex (undefined weights), always returning 3 symbols, and distribution correctness. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts; trivial accessor but zero test coverage. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard, untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant but drives all payout logic; untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by engine.ts and legacy.ts — critical payout path with no coverage for valid symbols, unknown symbols, or all count branches (3/4/5/<3). |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file. No tests exist for any strategy classes. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, making untested pass-through behavior a gap in engine-level coverage. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 90% | No test file exists. Methods on, off, and emit are untested — including edge cases like emitting with no listeners, removing a non-existent handler, multiple handlers for the same event, and argument forwarding. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is imported by src/engine.ts but has no dedicated or integration-level tests confirming correct usage as an event name. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class with no runtime behavior beyond contract definition, but the concrete subclass is also untested. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 82% | No test file exists. buildReels is used by src/engine.ts (core path) but has zero coverage — reel count iteration, spinReel delegation, and return shape are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts but no coverage for empty reels, single scatter, exactly 3 scatters, or mixed symbol grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Critical state-machine logic (activation at 3 scatters, re-trigger, decrement, deactivation at 0) has zero test coverage. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic (jackpot trigger) imported by src/engine.ts has zero test coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, 3 diamonds). |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 82% | No test file exists. Critical gaming RNG logic — uniform distribution, boundary roll (roll === cumulative), zero weights, single-item arrays, mismatched array lengths, and negative weights are all untested. Called by src/engine.ts, making this a high-risk gap. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout: `total * (1 + HOUSE_EDGE)`. | [UNIQUE] Module-level constant; no similar symbol found. | [OK] Constant value 0.05 is correct; the defect is in how computePayout applies it. | [LEAN] Named constant. No complexity. | [NONE] No test file exists. HOUSE_EDGE directly affects computePayout output but is never verified. | [UNDOCUMENTED] Private constant, no JSDoc. Value (0.05) and its effect on payout math are non-obvious without a comment.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded false; the guarded console.log block never executes. Dead code gate with no runtime effect. | [UNIQUE] Module-level constant; no similar symbol found. | [OK] Boolean flag, no correctness issue. | [LEAN] Named constant. No complexity. | [NONE] No test file exists. Constant is always false; branch it guards is dead and untested. | [UNDOCUMENTED] Private constant, no JSDoc. Self-descriptive name but no comment on how to enable or what it gates.
  - EngineContainer: [USED] Instantiated as `container` on L29; resolve() called three times in spin(). | [UNIQUE] IoC registry class; no similar symbol found. | [OK] Map-based registry; all registered keys are resolved within the same file, no missing-key risk in practice. | [OVER] Hand-rolled DI container (register/resolve) for exactly 3 values that are already direct imports at the top of the same file. Provides no testability or substitution value: the registrations are hardcoded at module init, the container has a single consumer (spin), and all three resolved values could be used directly from import scope. Classic single-use DIY IoC abstraction. | [NONE] No test file exists. register/resolve behavior, type-cast safety, and missing-key behavior are untested. | [UNDOCUMENTED] Private internal DI container class, no JSDoc. Purpose and key/value contract for register/resolve are undocumented.
  - container: [USED] resolve() called in spin() for rng, paytable, and reels dependencies. | [UNIQUE] Singleton EngineContainer instance; no similar symbol found. | [OK] Instantiation and registrations are consistent; resolved keys match registered keys. | [LEAN] Simple instantiation of EngineContainer. Over-engineering is in the class definition, not this usage. | [NONE] No test file exists. Module-level singleton wiring is untested. | [UNDOCUMENTED] Module-level singleton, no JSDoc. Role as the shared service locator is not documented.
  - PAYLINES: [USED] Iterated in spin() loop and indexed for wild-multiplier calculation. | [UNIQUE] Payline grid data; no similar symbol found. | [OK] Matches reference documentation exactly. | [LEAN] Pure domain data constant — 10 fixed payline row-index paths. No abstraction overhead. | [NONE] No test file exists. Payline coordinate correctness (row/col indexing) is untested. | [UNDOCUMENTED] 10-entry payline matrix with no JSDoc. Row-index semantics and path shapes (straight, V, zigzag) are not explained inline.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls and returned by getReelSymbols. | [UNIQUE] No similar constant found in RAG results. | [OK] Array matches the 8-symbol set used throughout the module; ordering is consistent with weightsToArray and the docs. | [LEAN] Simple ordered array of symbol names; serves as the canonical symbol registry. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Not exported, but purpose (canonical ordered symbol list) is non-obvious — it doubles as the index key for weight arrays, which is undocumented.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray 5 times when building REEL_WEIGHTS. | [UNIQUE] No similar constant found in RAG results. | [OK] Sum = 25+25+15+10+5+30+5+5 = 120; matches the documented weight table exactly. | [LEAN] Straightforward named-field config object. Complexity lives in the interface, not the constant. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The numeric values (e.g. DIAMOND:30 being the highest) and total-weight-of-120 contract are non-obvious from the name alone.
  - weightsToArray: [USED] Called 5 times in REEL_WEIGHTS initializer. | [UNIQUE] No similar functions found per RAG. | [OK] Emission order (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER) is identical to SYMBOLS declaration; no mismatch. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists for this module. | [UNDOCUMENTED] Not exported, <10 lines, name is clear. Tolerated as an internal helper with no docs.
  - REEL_WEIGHTS: [USED] Indexed in spinReel and getReelWeights. | [UNIQUE] No similar constant found in RAG results. | [OK] Five reels, each initialised from DEFAULT_WEIGHTS — consistent with the documented single shared distribution. | [OVER] Five identical calls to `weightsToArray(DEFAULT_WEIGHTS)` building five distinct but equal arrays. Docs confirm all reels share the same distribution and there is no setter — per-reel differentiation is never used. A single shared array (or `Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS))`) paired with a note about immutability would be cleaner; the current form implies per-reel customization that is explicitly out of scope. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The 2D structure (one weight array per reel, indices 0–4) and the fact all five reels share identical weights are non-obvious constraints with no documentation.
  - pickFromWeighted: [USED] Called in spinReel's row loop. | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: both sum weights, generate Math.random()*total, accumulate in a loop, return items[i] when roll < cumulative, and fall back to last item. The only differences are variable names and that weightedPick is generic <T> while this is typed to Symbol[]. These are fully interchangeable. | [NEEDS_FIX] Math.random() is not a certifiable RNG for regulated casino/gambling software. Inferred slot-machine domain from reel/payline/jackpot/RTP vocabulary and arbitrated README contract. Industry convention requires a cryptographically auditable source of randomness (e.g. crypto.getRandomValues or a certified hardware RNG) for compliance. | [LEAN] Standard O(n) weighted-random selection. No unnecessary abstraction; fallback return on last element handles floating-point edge case correctly. | [NONE] No test file exists. This function has critical edge cases untested: boundary where r == acc, total-weight of zero, mismatched items/wts lengths, and statistical distribution correctness. | [UNDOCUMENTED] Not exported, internal helper. Name conveys intent; algorithm details tolerated undocumented at this visibility level. (deliberated: reclassified: correction: NEEDS_FIX → OK — Compared src/reels.ts:30-41 with src/rng.ts:5-16 line by line: algorithms are identical (cumulative-weight loop, Math.random()*total, fallback to last item). Duplication is factual. However, the correction axis asks whether the code is *incorrect* — it is not. pickFromWeighted correctly implements weighted random selection and is correctly called at reels.ts:47. Duplication is a maintenance concern (duplication axis), not a correctness defect. Reclassifying correction from NEEDS_FIX to OK.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported; referenced locally at L15 inside getPayMultiplier. | [UNIQUE] No similar lookup tables found in RAG results. | [OK] Multipliers match the reference-doc paytable exactly (CHERRY through DIAMOND, all three run-length tiers). RTP balance depends on reel weights defined in reels.ts; flagging that interaction here would violate precision guard 3 (paytable is not the canonical home of the reel-weight constant). | [LEAN] Flat record of fixed tuples. Correct data structure for a static lookup table; no abstraction needed. | [NONE] No test file exists. Private constant but drives all payout logic; untested. | [UNDOCUMENTED] Non-exported internal constant; name is clear, but the tuple layout [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is implicit and not annotated. Lenient given private scope.

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
