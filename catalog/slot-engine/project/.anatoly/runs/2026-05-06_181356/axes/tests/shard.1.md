[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 90% | [details](#srcenginets) |
| `src/reels.ts` | 🟡 NEEDS_REFACTOR | 8 | 90% | [details](#srcreelsts) |
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
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists for this module. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists for this module. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists for this module. |
| `checkLine` | L47–L64 | 🔴 NONE | 70% | No test file exists for this module. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 75% | No test file exists for this module. |
| `computePayout` | L101–L111 | 🔴 NONE | 90% | No test file exists for this module. Critical logic (HOUSE_EDGE application, bet bonus, Math.ceil) is entirely untested. |
| `spin` | L113–L179 | 🔴 NONE | 90% | Auto-resolved: JSDoc block found before symbol |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Constant defines the full symbol set used throughout the game engine. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Weights directly influence payout probabilities — critical business logic with zero coverage. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | Auto-resolved: function ≤ 5 lines |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Five-reel weight matrix drives all spin outcomes; no verification that weights are non-empty or correctly shaped. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 60% | No test file. Core probabilistic selection logic with an off-by-one risk at boundary (r == total falls through to last item). Edge cases like all-zero weights or single-item arrays untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 80% | No test file. Imported by src/factories.ts — a factory-level consumer — yet no tests verify it returns exactly 3 symbols, handles valid reelIndex range, or rejects out-of-bounds indices. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 90% | No test file. Imported by src/engine.ts; no tests confirm the returned array matches expected symbols or is immutable. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 78% | No test file. Imported by src/engine.ts; no tests verify correct weights are returned per reelIndex or that invalid indices are handled. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Private constant is untested. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Function is imported by engine.ts and legacy.ts — critical path with no coverage for any count branch (3/4/5), unknown symbol, or zero-return paths. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 85% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts, so payout pass-through behavior is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 80% | Auto-promoted: exported class imported by 1 file — abstraction built for a single client |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. String constant used as event key in engine.ts; its usage as a trigger for done-state logic is untested. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 88% | No test file exists. Abstract class with no runtime behavior beyond defining the contract. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, varying rowCount) are verified. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts, but no coverage of scatter counting across single/multi-reel layouts, empty reels, or zero-scatter cases. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Four distinct branches (initial trigger, retrigger, decrement, deactivation on zero) are all untested. Used by engine.ts, making this a critical gap. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file found. Critical game logic (jackpot trigger) used by src/engine.ts has zero test coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, single reel), or boundary tests. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Critical edge cases untested: empty arrays, mismatched array lengths, all-zero weights, single-item input, boundary roll exactly at cumulative threshold, and distribution correctness. Used by src/engine.ts, making test absence a meaningful gap. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout at line 105 | [UNIQUE] Numeric constant. No duplicates detected. | [OK] Value 0.05 correctly represents the documented 5% house edge. Defect lies in its consumer computePayout, not here. | [LEAN] Named constant for a magic number used in computePayout. Minimal and appropriate. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant; name conveys meaning but the relation to target RTP is unexplained inline.
  - DEBUG_MODE: [USED] Conditional check in spin function at line 174 | [UNIQUE] Boolean constant. No duplicates detected. | [OK] Boolean constant; no correctness issues. | [LEAN] Simple boolean flag for a guarded log block. Not overengineered, just hardcoded to false. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal boolean flag; self-descriptive name makes purpose obvious, so severity is low.
  - EngineContainer: [USED] Instantiated at line 29 to initialize container | [UNIQUE] Simple DI container class. No similar class found. | [NEEDS_FIX] resolve silently returns undefined cast to T when a key is missing, bypassing TypeScript safety and causing opaque downstream runtime failures. | [OVER] Hand-rolled service-locator for 3 statically-imported functions. `Map<string, unknown>` erases types, forcing `resolve<T>` casts at every call site. No implementation swapping occurs at runtime; direct imports would be simpler and type-safe. The resolved `reelsModule` in `spin` is never actually used, underscoring that the indirection provides no value. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc on class or either method. Internal, unexported DI container; its purpose and lifetime are implicit.
  - container: [USED] Used in registration calls and resolve calls in spin function | [UNIQUE] Module-level instance. Not a candidate for duplication. | [OK] All three keys registered before first use; no active correctness issue in current code. | [LEAN] Straightforward instantiation and population of EngineContainer. The over-engineering lives in the class definition, not here. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal singleton instance; role is inferrable from surrounding registrations but not documented.
  - PAYLINES: [USED] Iterated in spin function at line 155 and referenced for wild multiplier calculation | [UNIQUE] Data constant defining payline patterns. No duplicates detected. | [OK] All ten payline arrays match the canonical layout in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md exactly. | [LEAN] Canonical payline configuration documented verbatim in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. Minimal and authoritative. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. The coordinate encoding (column index → row index, 0=top) and win-run semantics are not explained inline.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Used locally in pickFromWeighted function call at line 45 within spinReel | [UNIQUE] Simple constant array of symbol strings. No similar functions found. | [OK] All eight documented symbols present in consistent order. | [LEAN] Simple, flat constant enumerating the eight symbols. No abstraction. | [NONE] No test file exists. Constant defines the full symbol set used throughout the game engine. | [UNDOCUMENTED] No JSDoc. Not exported, so low severity, but no comment explains the role of this master list or whether order matters for weight alignment.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray 5 times in REEL_WEIGHTS initialization at lines 24-28 | [UNIQUE] Configuration constant. No duplicates found. | [OK] Weights match documented values exactly; sum = 120 as specified in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. | [LEAN] Named-key object is the clearest way to author static weights; values match the documented distribution. | [NONE] No test file. Weights directly influence payout probabilities — critical business logic with zero coverage. | [UNDOCUMENTED] No JSDoc. The fact that these are relative (not absolute) weights and that all five reels share this profile is non-obvious and undocumented.
  - weightsToArray: Auto-resolved: function ≤ 5 lines
  - REEL_WEIGHTS: [USED] Accessed in spinReel at line 44 and getReelWeights at line 57 | [UNIQUE] Precomputed weight matrix constant. No duplicates. | [OK] Five reels initialised with DEFAULT_WEIGHTS; matches documented configuration. | [OVER] Per-reel weight matrix implies per-reel customisation that doesn't exist. Docs (.anatoly/docs/02-Architecture/02-Core-Concepts.md, .anatoly/docs/04-API-Reference/02-Configuration-Schema.md) confirm all five reels share identical weights; a single shared array suffices. | [NONE] No test file. Five-reel weight matrix drives all spin outcomes; no verification that weights are non-empty or correctly shaped. | [UNDOCUMENTED] No JSDoc. No indication that index maps to reel position or that all five reels intentionally share identical weights.
  - pickFromWeighted: [USED] Called in spinReel loop at line 45 to select symbols | [DUPLICATE] Weighted random selection using accumulation algorithm. Identical logic to weightedPick in src/rng.ts: same loop structure, accumulation logic, and return behavior. Only difference is non-generic type (Symbol) vs generic. | [OK] Algorithm correct per prior deliberation review (known false positive on correction axis). | [LEAN] Standard O(n) weighted-random algorithm, minimal and correct. | [NONE] No test file. Core probabilistic selection logic with an off-by-one risk at boundary (r == total falls through to last item). Edge cases like all-zero weights or single-item arrays untested. | [UNDOCUMENTED] Non-exported helper under 15 lines. Behavior is inferable, but the fallback on the last element (loop exhaustion guard) is an implicit contract worth noting.

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Referenced in getPayMultiplier at line 15 | [UNIQUE] Constant Record mapping symbols to pay multipliers, no semantic duplicates found | [OK] All six symbol rows match the paytable in .anatoly/docs/02-Architecture/02-Core-Concepts.md exactly. | [LEAN] Flat Record mapping symbol strings to a fixed 3-tuple. Matches the documented paytable exactly (`.anatoly/docs/02-Architecture/02-Core-Concepts.md`). No unnecessary abstraction. | [NONE] No test file exists. Private constant is untested. | [UNDOCUMENTED] Non-exported internal constant; tuple layout [3-match, 4-match, 5-match] is inferrable from data, but no comment confirms it. Lenient due to private scope, but the semantics (multiplier vs. flat payout) are not obvious.

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
