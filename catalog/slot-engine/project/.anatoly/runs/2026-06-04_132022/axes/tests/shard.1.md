[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🔴 CRITICAL | 9 | 95% | [details](#srcenginets) |
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
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists; constant is untested. Its effect on payout is also not verified. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists; register/resolve behavior untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists; payline definitions and their correctness are untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 70% | No test file exists; WILD substitution logic, SCATTER short-circuit, run-length counting, and minimum-3 threshold are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 75% | No test file exists; wild-count bonus multiplier formula and null-propagation from checkLine are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 95% | No test file exists; house-edge application, base-bet bonus, Math.ceil rounding, and zero-win path are all untested. |
| `spin` | L113–L179 | 🔴 NONE | 92% | No test file exists. Exported and called from src/index.ts, making its untested state high-risk. Invalid-bet validation, free-spin triggering, jackpot path, and wildMultiplier accumulation are all uncovered. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. Symbol is referenced by exported functions used in engine and factories. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file. Weight values directly affect game odds; correctness is untested. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file. Ordering of weights array must match SYMBOLS order — silent misalignment is untested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file. Five-reel weight matrix drives all spin probabilities; structure and values are untested. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 88% | No test file. Core probability logic with boundary behavior (r == acc edge, last-item fallback) is entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 92% | No test file. Imported by factories.ts; out-of-bounds reelIndex silently returns undefined weights — untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file. Imported by engine.ts; returns shared mutable array reference — mutation risk untested. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file. Imported by engine.ts; invalid reelIndex returns undefined without error — untested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Pay table values are business-critical multiplier data with zero test coverage. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts and src/legacy.ts — critical payout logic covering count boundaries (3/4/5), unknown symbols returning 0, and count < 3 returning 0 are all untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class, no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | Used by src/engine.ts but no test file exists. Identity payout logic is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 85% | No test file exists. Critical class used by src/engine.ts — on/off/emit methods, multi-listener dispatch, handler deregistration, and unknown-event handling are all untested. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant is consumed by src/engine.ts but no tests verify its value or correct usage as an event name. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class with no runtime behavior beyond defining the interface, but still warrants contract testing via its concrete subclass. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. Used by src/engine.ts, making this a critical path. buildReels logic (reel count loop, spinReel calls, returned 2D array shape) is completely untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Called by src/engine.ts with no test coverage for scatter counting across reels, empty input, or zero-scatter grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. State machine with 3 branches (activate, retrigger, decrement/deactivate) is entirely untested despite being called by core engine logic. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic used by src/engine.ts has zero coverage — happy path (≥4 diamonds), boundary (exactly 4 vs 3), empty reels, and multi-column distribution all untested. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 85% | No test file exists. Symbol is imported by src/engine.ts (critical game engine path) with zero coverage of happy path, edge cases (empty arrays, single item, zero weights, negative weights, mismatched array lengths), or boundary behavior (roll landing exactly on cumulative boundary). |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout (L105): `total * (1 + HOUSE_EDGE)`. | [UNIQUE] Module-level constant, no RAG candidates. | [OK] Value 0.05 is correct for 5% house edge; the misapplication lives in computePayout. | [LEAN] Named constant for a magic number. Appropriate. | [NONE] No test file exists; constant is untested. Its effect on payout is also not verified. | [UNDOCUMENTED] Internal constant, no JSDoc. Name is self-explanatory but the 0.05 value's effect on RTP (additive boost rather than reduction) is non-obvious and undocumented.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded `false`; the guarded block at L160–162 is permanently dead. Zero runtime effect. | [UNIQUE] Module-level constant, no RAG candidates. | [OK] Boolean guard around a console.log; no correctness impact. | [LEAN] Simple boolean flag. The dead-code branch it guards is a quality issue, not overengineering. | [NONE] No test file exists. | [UNDOCUMENTED] Internal flag, no JSDoc. Trivially self-descriptive; leniency applied for internal constant.
  - EngineContainer: [USED] Instantiated at L29 to produce `container`, which is used throughout the file. | [UNIQUE] Registry class with no RAG candidates. | [OK] All three registered keys are resolved by matching names in spin(); no untriggered missing-key path. | [OVER] Hand-rolled service-locator/IoC container for 3 values (`rng`, `paytable`, `reels`) that are already directly imported at the top of the file. Adds a `Map<string, unknown>` + unsafe `as T` cast with no DI benefit, no swappability across call sites, and a single consumer (`spin`). The pattern exists purely to look architectural. | [NONE] No test file exists; register/resolve behavior untested. | [UNDOCUMENTED] Internal class acting as a simple IoC container. No JSDoc on the class or its methods. Leniency applied for unexported internals.
  - container: [USED] Populated at L30–32; resolved in spin() at L130–132 (rng, paytable, reelsModule). | [UNIQUE] Singleton instance variable, no RAG candidates. | [OK] All required keys registered at module initialisation. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. | [UNDOCUMENTED] Module-level singleton with no comment explaining its role as the DI registry. Internal; leniency applied.
  - PAYLINES: [USED] Iterated in spin() at L143 and indexed at L163 to compute line wins. | [UNIQUE] Data constant with no RAG candidates. | [OK] Matches the canonical payline table in the reference documentation exactly. | [LEAN] Plain data constant for 10 fixed payline paths. No abstraction, no complexity. | [NONE] No test file exists; payline definitions and their correctness are untested. | [UNDOCUMENTED] 10-entry payline table with no JSDoc. The row-index semantics and coordinate system are non-obvious from the raw numbers alone; shape descriptions (straight, V-shape, zigzag) would aid maintainability.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls (L44, L34) and returned by getReelSymbols. | [UNIQUE] No similar constant found in RAG results. | [OK] Eight symbols defined in correct order matching ReelWeightConfig and weightsToArray. | [LEAN] Simple constant array, serves as the canonical symbol order for the whole module. | [NONE] No test file exists. Symbol is referenced by exported functions used in engine and factories. | [UNDOCUMENTED] No JSDoc. Internal constant, but a comment noting it is the canonical symbol roster (and that order must match weight arrays) would prevent subtle bugs.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times when building REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar constant found in RAG results. | [OK] Weights sum to 120 (25+25+15+10+5+30+5+5), matching reference docs exactly. | [LEAN] Plain config object — clear, readable, exactly what the docs prescribe for user-facing weight editing. | [NONE] No test file. Weight values directly affect game odds; correctness is untested. | [UNDOCUMENTED] No JSDoc. The raw numbers are non-obvious (e.g. why DIAMOND=30 vs CHERRY=25); a comment on the total sum (120) and design intent would add value.
  - weightsToArray: [USED] Called five times to populate REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar functions found per RAG. | [OK] Returns weights in the same order as SYMBOLS array; mapping is consistent. | [ACCEPTABLE] Exists as a bridge between the named-field config and the positional number[] that pickFromWeighted needs. Four lines, no branching. The indirection is a consequence of ReelWeightConfig's design, not extra complexity here. | [NONE] No test file. Ordering of weights array must match SYMBOLS order — silent misalignment is untested. | [UNDOCUMENTED] Private helper, <10 lines, name is clear. Tolerable per guidelines, but the ordering dependency on SYMBOLS array is a silent contract worth noting.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and getReelWeights (L57). | [UNIQUE] No similar constant found in RAG results. | [OK] Five reels each initialized with DEFAULT_WEIGHTS; matches documented 5-reel configuration. | [ACCEPTABLE] Five separate arrays instead of one shared reference. Redundant given all reels share identical weights now, but enables per-reel divergence via a source edit without API changes — consistent with the docs' 'fork and modify' customization model. | [NONE] No test file. Five-reel weight matrix drives all spin probabilities; structure and values are untested. | [UNDOCUMENTED] No JSDoc. Non-obvious that all 5 reels share identical weights; a one-liner would clarify intent and make per-reel customisation easier to discover.
  - pickFromWeighted: [USED] Called inside spinReel (L47) to select each symbol. | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random()*total, accumulate weights in a loop, and return the item when roll < cumulative, with the same fallback. Only differences are variable names and that pickFromWeighted is typed to Symbol rather than being generic. | [NEEDS_FIX] Uses Math.random() as the RNG source in a regulated slot-machine engine — not certifiable. | [LEAN] Canonical weighted-random-selection loop. Single responsibility, no unnecessary abstraction. | [NONE] No test file. Core probability logic with boundary behavior (r == acc edge, last-item fallback) is entirely untested. | [UNDOCUMENTED] Internal helper implementing weighted random selection. The algorithm is non-trivial (cumulative-sum scan) and has a subtle edge-case fallback on the last element; lacks any JSDoc explaining parameters, return value, or the floating-point edge case. (deliberated: reclassified: correction: NEEDS_FIX → OK — The finding conflates duplication with correction. Verified src/reels.ts:30-41 against src/rng.ts:5-16 — both implement the same cumulative-weight algorithm and both are mathematically correct. pickFromWeighted correctly sums weights (L31), draws Math.random()*total (L32), accumulates in a loop (L34-38), and falls back to the last item (L40). No off-by-one, no boundary error, no incorrect result. The duplication with weightedPick is a valid refactoring concern but not a correctness defect. The Math.random() concern (non-certifiable RNG) is a design/requirements issue, not a code bug. Downgrading correction to OK.)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported constant referenced locally by getPayMultiplier at L15. | [UNIQUE] No similar pay-table structure found in RAG results. | [OK] All six symbol rows match the authoritative reference paytable exactly (CHERRY 2/5/25, LEMON 2/5/25, BELL 5/20/100, BAR 10/40/200, SEVEN 25/100/500, DIAMOND 50/250/1000). | [LEAN] Flat record mapping symbol names to fixed tuples. No abstraction beyond what the data requires. | [NONE] No test file exists. Pay table values are business-critical multiplier data with zero test coverage. | [UNDOCUMENTED] No JSDoc. The tuple type `[number, number, number]` maps to 3-of-a-kind / 4-of-a-kind / 5-of-a-kind multipliers — not inferable from the declaration alone. Non-exported but tuple semantics require explanation.

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
