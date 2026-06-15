[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 10 | 88% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 95% | [details](#srcreelsts) |
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 2 | 95% | [details](#srcpaytablets) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srceventsts) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 2 | 88% | [details](#srcstrategyts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 85% | [details](#srcrngts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 80% | No test file exists for this source file. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists; computePayout (sole caller) has no tests. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists; spin (sole caller) has no tests. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists for this source file. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists; spin (sole caller) has no tests. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists; spin (sole caller) has no tests. |
| `checkLine` | L47–L64 | 🔴 NONE | 65% | No test file exists for this source file. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 65% | No test file exists; spin (sole caller) has no tests. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists for this source file. |
| `spin` | L113–L179 | 🔴 NONE | 80% | No test file exists for this source file. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Transitive coverage via spinReel/getReelSymbols is moot since those exports are also untested. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 92% | No test file exists. Constant feeds REEL_WEIGHTS and ultimately spinReel, but none are tested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists. Private helper with ordering-sensitive logic (symbol-to-weight mapping) that is never directly or transitively tested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. Transitive callers spinReel/getReelWeights are also untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file exists. Critical probabilistic logic (weighted random selection, boundary at total weight) has zero coverage — no seeded-random or distribution tests exist. |
| `spinReel` | L43–L50 | 🔴 NONE | 90% | No test file exists. Imported by src/factories.ts but no tests cover it; edge cases like out-of-range reelIndex are untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file exists. Consumed by engine.ts spin() but neither is tested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file exists. Consumed by engine.ts spin() but neither is tested; undefined behavior for out-of-range reelIndex unverified. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file; sole caller getPayMultiplier also has no tests, so transitive coverage is absent. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file. Used by engine.ts and legacy.ts but neither file's tests are provided or referenced. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `EventHandler` | L1–L1 | 🟡 WEAK | 60% | No test file exists. Transitive coverage via SpinEventEmitter is also absent since no tests cover SpinEventEmitter either. |
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 82% | No test file found. Methods on/off/emit and edge cases (duplicate handlers, removing non-existent handlers, emitting with no listeners, multiple args) are untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file found. Constant is consumed by src/engine.ts but no tests verify correct usage as an event name. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 85% | No test file exists. Used by the critical `spin` function in engine.ts — the identity pass-through behavior is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class with no runtime behavior beyond the interface contract, but still unverified. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 88% | No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts (validates bets, evaluates paylines, awards jackpots), making untested reel generation a significant gap — boundary inputs (reelCount=0, large values) and output shape are entirely unverified. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used in critical spin path; needs coverage for 0 scatters, exactly 3, mixed reel layouts, and nested symbol iteration. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches (activate, retrigger, decrement, deactivate) are all untested. State mutation side-effects and boundary at remaining<=0 are unverified. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic consumed by the core spin engine with no coverage of the >=4 DIAMOND threshold, boundary cases (exactly 3 vs 4 diamonds), empty reels, or multi-column distribution scenarios. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical RNG utility used by slot machine spin logic — missing tests for empty arrays, mismatched array lengths, zero weights, negative weights, single-item arrays, and statistical distribution of picks across many draws. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout (L106): `total * (1 + HOUSE_EDGE)`. | [UNIQUE] No similar constant found in provided context. | [OK] Constant value 0.05 is correct; the defect is in how computePayout applies it. | [LEAN] Named constant for a magic number. Minimal and appropriate. | [NONE] No test file exists; computePayout (sole caller) has no tests. | [UNDOCUMENTED] Private constant, no JSDoc. Self-explanatory name reduces severity, but the RTP implication (applied as a bonus multiplier rather than a deduction) is non-obvious.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded to `false`; the guarded `console.log` block in spin never executes at runtime. Symbol is syntactically referenced but permanently dead at runtime. | [UNIQUE] No similar constant found in provided context. | [OK] Boolean flag, correctly guarded before the console.log in spin. | [LEAN] Simple boolean flag guard. No complexity. | [NONE] No test file exists; spin (sole caller) has no tests. | [UNDOCUMENTED] Private boolean flag, self-explanatory name, no JSDoc needed in practice.
  - EngineContainer: [USED] Instantiated at L29 to create `container`, which is used in spin. | [UNIQUE] No similar class found in provided context. | [OK] Simple registry with no incorrect logic; all keys registered in the module are resolved by spin. | [OVER] Mini IoC container defined and used entirely within one module to hold 3 values, only one of which (`paytable`) is actually consumed. A plain object `const deps = { rng: weightedPick, paytable: getPayMultiplier, reels: { getReelSymbols, getReelWeights } }` eliminates the class, the Map, and the string-keyed untyped resolve calls with no loss of capability. | [NONE] No test file exists for this source file. | [UNDOCUMENTED] Private class with no JSDoc. Purpose (service-locator / DI container) is non-obvious from name alone and no description of register/resolve semantics is provided.
  - container: [USED] Resolved values (`rng`, `paytable`, `reelsModule`) are read inside spin; `paytable` is passed to evaluateLine. | [UNIQUE] No similar variable found in provided context. | [OK] All three keys registered match the three keys resolved in spin. | [LEAN] Module-level singleton instantiation — the overengineering lives in EngineContainer itself, not here. | [NONE] No test file exists; spin (sole caller) has no tests. | [UNDOCUMENTED] Private module-level singleton, no JSDoc. Internal use only; low severity.
  - PAYLINES: [USED] Iterated in spin's line-evaluation loop and indexed during wild-multiplier calculation. | [UNIQUE] No similar constant found in provided context. | [OK] Array matches the 10-payline definition in reference documentation exactly. | [LEAN] Static domain data array. Exactly the right representation. | [NONE] No test file exists; spin (sole caller) has no tests. | [UNDOCUMENTED] Private constant with no JSDoc. The geometric meaning of each row-index array (middle-row, V-shape, zigzag, etc.) is not self-evident from the numeric values.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced locally by pickFromWeighted (via spinReel) and returned directly by getReelSymbols, both of which have runtime importers. | [UNIQUE] No similar constant found in RAG results. | [OK] Symbol list is complete and consistent with the weight config interface and documentation. | [LEAN] Simple static array of 8 symbol names. No abstraction overhead. | [NONE] No test file exists. Transitive coverage via spinReel/getReelSymbols is moot since those exports are also untested. | [UNDOCUMENTED] No JSDoc. Non-exported internal constant with no comment explaining its role as the master symbol registry for all reels.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times when initializing REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar constant found in RAG results. | [NEEDS_FIX] DIAMOND weight of 30 (25% per cell) combined with its paytable (50×/250×/1000×) produces an RTP far above the arbitrated 95% target. | [LEAN] Named-key constant for readability. Appropriate for a fixed 8-symbol config. | [NONE] No test file exists. Constant feeds REEL_WEIGHTS and ultimately spinReel, but none are tested. | [UNDOCUMENTED] No JSDoc. Name implies defaults but no comment explains the weight scale, total sum (120), or probability implications for each symbol. (deliberated: confirmed — Confirmed at src/reels.ts:14: DIAMOND weight is 30 (25% of total 120). At src/paytable.ts:11: DIAMOND pays [50, 250, 1000] — the highest multipliers in the game. SEVEN pays [25, 100, 500] (half of DIAMOND) but has weight 5 (one-sixth the frequency). DIAMOND being 6x more frequent than SEVEN while paying 2x more is mathematically inverted. No compensating mechanism exists — DefaultStrategy.adjustPayout at src/strategy.ts:8-10 is a no-op returning the result unchanged. The weight 30 for DIAMOND is almost certainly a typo for 3, which would place it appropriately between SEVEN (5) and BAR (10). This bug would cause the game's actual RTP to massively exceed the target 95% (ANCIENT_RTP at paytable.ts:3).)
  - weightsToArray: [USED] Called five times in the REEL_WEIGHTS initializer to convert DEFAULT_WEIGHTS into plain number arrays. | [UNIQUE] No similar functions found per RAG results. | [OK] Property extraction order matches SYMBOLS array order exactly; no correctness issue. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. Private helper with ordering-sensitive logic (symbol-to-weight mapping) that is never directly or transitively tested. | [UNDOCUMENTED] Private helper, <10 lines, clear name. Tolerated per internal-helper leniency rule, but no JSDoc.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and returned by getReelWeights (L57), both of which have runtime importers. | [UNIQUE] No similar constant found in RAG results. | [OK] All five reels correctly populated via weightsToArray(DEFAULT_WEIGHTS); index range 0–4 matches spinReel's valid input range. | [ACCEPTABLE] Five identical weight arrays preempt per-reel customization that docs explicitly say doesn't exist (no setter). However, the structure is required by the getReelWeights(reelIndex) public API shape, so the redundancy is partially justified. | [NONE] No test file exists. Transitive callers spinReel/getReelWeights are also untested. | [UNDOCUMENTED] No JSDoc. Non-exported constant. No comment explains that all 5 reels share identical weight arrays or the indexing scheme.
  - pickFromWeighted: [USED] Called inside spinReel (L47) on every spin to perform weighted random symbol selection. | [DUPLICATE] Identical weighted random selection logic: both compute total weight, roll Math.random() * total, accumulate weights in a loop, return items[i] on hit, fall back to last item. Only differences are variable names (total/totalWeight, r/roll, acc/cumulative) and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol. Functionally interchangeable. | [OK] Excluded per project instructions (known false positive — algorithm verified correct in prior deliberation). | [LEAN] Standard weighted random selection over 8 items. Linear scan is appropriate at this scale; no unnecessary abstraction. | [NONE] No test file exists. Critical probabilistic logic (weighted random selection, boundary at total weight) has zero coverage — no seeded-random or distribution tests exist. | [UNDOCUMENTED] Private helper implementing weighted random selection. No JSDoc, but non-exported and name hints at behavior. Tolerated per internal-helper leniency; algorithm details (linear scan, fallback to last item) are undocumented.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced in-file by getPayMultiplier (which is imported by other files) | [UNIQUE] No similar lookup tables found in the codebase. | [OK] All six symbol rows and their three multiplier tiers exactly match the paytable specified in the reference documentation. | [LEAN] Flat Record keyed by symbol name with fixed-length tuples for 3/4/5-of-a-kind multipliers. No unnecessary indirection; tuple type directly matches the three possible run lengths. | [NONE] No test file; sole caller getPayMultiplier also has no tests, so transitive coverage is absent. | [UNDOCUMENTED] Private constant; leniency applied. Still, the tuple index semantics ([3-of-a-kind, 4-of-a-kind, 5-of-a-kind]) are implicit and undocumented.

- [ ] `src/events.ts` — 2 untested, 1 weak
  Improve `src/events.test.ts` covering: EventHandler, SpinEventEmitter, SPIN_DONE
  - EventHandler: [USED] Referenced in-file by SpinEventEmitter (which is imported by other files) | [UNIQUE] No RAG data available | [OK] Simple type alias; no correctness issues. | [LEAN] Minimal type alias for event handler signature. Appropriate for typed event dispatch. | [NONE] No test file exists. Transitive coverage via SpinEventEmitter is also absent since no tests cover SpinEventEmitter either. | [UNDOCUMENTED] No JSDoc comment. Type alias for a variadic callback is non-obvious enough to warrant a brief description.

- [ ] `src/strategy.ts` — 2 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy

- [ ] `src/factories.ts` — 2 untested
  Create `src/factories.test.ts` covering: AbstractReelBuilderFactory, StandardReelBuilderFactory

- [ ] `src/freespin.ts` — 2 untested
  Create `src/freespin.test.ts` covering: detectScatters, handleFreeSpins

- [ ] `src/jackpot.ts` — 1 untested
  Create `src/jackpot.test.ts` covering: isJackpotHit

- [ ] `src/rng.ts` — 1 untested
  Create `src/rng.test.ts` covering: weightedPick
