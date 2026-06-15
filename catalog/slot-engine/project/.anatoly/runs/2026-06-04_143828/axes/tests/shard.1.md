[← Back to Tests](./index.md) · [← Back to report](../../public_report.md)

# 🧪 Tests — Shard 1

- [📊 Findings](#-findings)
- [🔍 Symbol Details](#-symbol-details)
- [🧪 Test Improvements](#-test-improvements)

## 📊 Findings

| File | Verdict | Tests | Conf. | Details |
|------|---------|-------|-------|---------|
| `src/engine.ts` | 🟡 NEEDS_REFACTOR | 9 | 95% | [details](#srcenginets) |
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
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists. HOUSE_EDGE affects computePayout output but is never tested. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists. Dead constant (always false); branch it guards is untestable as written. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists. register/resolve behavior, missing-key behavior, and type-cast safety are untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists. Module-level singleton wiring is untested. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists. Payline definitions (shape, row bounds) are untested. |
| `checkLine` | L47–L64 | 🔴 NONE | 80% | No test file exists. WILD-lead resolution, SCATTER early-return, run < 3 cutoff, and mixed WILD/symbol runs are all untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 80% | No test file exists. Wild-boost multiplier formula, zero-win path, and lineBet scaling are untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 88% | No test file exists. HOUSE_EDGE application (only on positive totals), floor bet bonus, and Math.ceil rounding are untested. Exported and critical to RTP correctness. |
| `spin` | L113–L179 | 🔴 NONE | 95% | No test file exists. Only public entry point (imported by src/index.ts). Bet validation, jackpot path, free-spin state mutation, wildMultiplier accumulation, and strategy delegation are all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists for this module. Key edge cases untested: weight order, length, zero-weight entries. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists for this module. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 92% | No test file exists. Critical untested cases: uniform distribution boundary (r === acc), all-equal weights, single-item list, total=0 (division by zero risk). |
| `spinReel` | L43–L50 | 🔴 NONE | 95% | No test file exists. Used by src/factories.ts — a critical call path with no coverage. Out-of-bounds reelIndex (>=5) would return undefined weights silently. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts with no coverage. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 95% | No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists; PAY_TABLE values are indirectly exercised only through getPayMultiplier, which itself has no tests. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 95% | No test file found. Function is imported by engine.ts and legacy.ts — critical business logic (count branching for 3/4/5, unknown symbol returning 0) is entirely untested. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file found. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file found. Used by src/engine.ts but adjustPayout (identity passthrough) is untested. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 88% | No test file exists. on/off/emit methods are untested — missing coverage for multi-handler dispatch, handler removal, duplicate removal, emit with no listeners, and args forwarding. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant used by src/engine.ts as an event key; not validated in any test. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | Abstract base class with no test file. No tests exist for the contract it defines. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 72% | No test file found. buildReels is used by src/engine.ts (critical path) but has zero test coverage — happy path, edge cases (reelCount=0, rowCount boundaries), and spinReel integration are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Missing coverage for: zero scatters, one/two scatters, exactly 3, mixed symbols, empty reels. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Missing coverage for: initial activation (scatters>=3), retrigger while active, decrement, deactivation at remaining<=0, and no-op when inactive+scatters<3. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 92% | No test file found. Critical gaming RNG utility used by src/engine.ts has zero test coverage — edge cases like empty arrays, mismatched array lengths, zero weights, single-item arrays, and distribution uniformity are all untested. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic used by src/engine.ts has zero coverage — happy path (>=4 diamonds), boundary (exactly 4 vs 3), empty reels, and multi-column distribution all untested. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 4 untested, 5 weak
  Improve `src/engine.test.ts` covering: HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout at line 106: `total * (1 + HOUSE_EDGE)`. | [UNIQUE] Module-scoped constant with no RAG matches. | [OK] Constant value 0.05 is correct; the application error lives in computePayout. | [LEAN] Named constant for a domain-significant magic number. Appropriate. | [NONE] No test file exists. HOUSE_EDGE affects computePayout output but is never tested. | [UNDOCUMENTED] Private module-level constant, no JSDoc. Non-exported, so low severity, but value affects all payouts.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded `false`; the guarded `console.log` block in spin() is permanently unreachable dead code. No runtime value. | [UNIQUE] Module-scoped constant with no RAG matches. | [OK] Boolean flag, no correctness issue. | [LEAN] Dead boolean flag gating a single console.log. Simple constant, no extra machinery. | [NONE] No test file exists. Dead constant (always false); branch it guards is untestable as written. | [UNDOCUMENTED] Private flag, no JSDoc. Non-exported; name is self-explanatory.
  - EngineContainer: [USED] Instantiated at line 29 to create `container`. | [UNIQUE] IoC container class with no RAG matches. | [OK] All three keys are registered before any resolve call in this file. | [OVER] Hand-rolled DI container (string-keyed register/resolve) for 3 static module imports that are bound at startup and never change at runtime. Direct imports of weightedPick, getPayMultiplier, getReelSymbols, getReelWeights would eliminate this class entirely with no loss of testability or flexibility. | [NONE] No test file exists. register/resolve behavior, missing-key behavior, and type-cast safety are untested. | [UNDOCUMENTED] Internal DI container class with no JSDoc on the class or its methods. Purpose (service locator pattern) is non-obvious from the name alone.
  - container: [USED] register() called at lines 30–32; resolve() called at lines 118–120 inside spin(). | [UNIQUE] Module singleton instance with no RAG matches. | [OK] Registration is correct; unused rng/reelsModule resolutions in spin() are style concerns, not correctness bugs. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. Module-level singleton wiring is untested. | [UNDOCUMENTED] Module-level singleton, not exported, no JSDoc. Internal detail; low severity.
  - PAYLINES: [USED] Iterated in spin() loop (line 131) and indexed at line 155 for wild multiplier calculation. | [UNIQUE] Payline grid data with no RAG matches. | [OK] Matches reference documentation exactly. | [LEAN] Pure data constant for 10 fixed payline patterns. Matches reference docs exactly. | [NONE] No test file exists. Payline definitions (shape, row bounds) are untested. | [UNDOCUMENTED] 10 payline definitions with no JSDoc explaining row-index semantics, ordering conventions, or shape patterns. Non-obvious without external docs.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls (L46, L33) and returned by getReelSymbols (L53). | [UNIQUE] No similar constant found in RAG results. | [OK] Array order matches weightsToArray and documentation exactly. | [LEAN] Plain array of 8 literal strings. No abstraction needed here. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Internal constant; name is clear but no comment explaining it is the canonical ordered symbol list used for reel indexing.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times in REEL_WEIGHTS initialization (L23–L27). | [UNIQUE] No similar constant found in RAG results. | [OK] All weights match reference docs; sum is 120 as documented. | [LEAN] Straightforward static constant; clarity comes from the field names in ReelWeightConfig. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Non-obvious that all five reels share this single distribution, or that total sums to 120. This context is absent.
  - weightsToArray: [USED] Called five times to populate REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar functions found per RAG. | [OK] Output order matches SYMBOLS array index-for-index. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists for this module. Key edge cases untested: weight order, length, zero-weight entries. | [UNDOCUMENTED] Unexported private helper, <10 lines, clear name. UNDOCUMENTED is tolerated per private-helper leniency rule.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and getReelWeights (L57). | [UNIQUE] No similar constant found in RAG results. | [OK] Five reels, each initialised with DEFAULT_WEIGHTS — consistent with docs. | [ACCEPTABLE] Five identical weight arrays anticipate per-reel customization not currently used, but the overhead is negligible and the structure makes adding reel-specific weights trivial. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc. Non-obvious that all five entries are identical copies of DEFAULT_WEIGHTS and that the array is indexed by reel 0–4.
  - pickFromWeighted: [USED] Called inside spinReel (L46) to select each row symbol. | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: same weighted-random algorithm, same reduce for total, same cumulative loop with early return, same fallback to last element. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative), non-generic Symbol[] type instead of T, and missing export. These are interchangeable implementations. | [NEEDS_FIX] Math.random() is not certifiable for regulated gaming RNG. | [LEAN] Canonical weighted-random-selection algorithm, implemented directly with no unnecessary abstraction. | [NONE] No test file exists. Critical untested cases: uniform distribution boundary (r === acc), all-equal weights, single-item list, total=0 (division by zero risk). | [UNDOCUMENTED] Unexported helper but implements non-trivial weighted-random selection; no comment on algorithm, params, or fallback behavior (returns last item when r equals total). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 is algorithmically correct — standard cumulative-weight sampling with proper fallback on L40. Duplication with weightedPick (src/rng.ts:5-16) is real and confirmed (identical logic, different variable names and type parameter), but duplication is not a correctness defect. Both functions produce correct weighted random selections. The automated evaluator conflated the duplication axis with the correction axis. pickFromWeighted is the one actually used at runtime via spinReel (L47) → factory.buildReels (src/factories.ts:12) → spin (src/engine.ts:128).)

- [ ] `src/paytable.ts` — 1 untested, 1 weak
  Improve `src/paytable.test.ts` covering: PAY_TABLE, getPayMultiplier
  - PAY_TABLE: [USED] Non-exported; referenced in getPayMultiplier (L15) via PAY_TABLE[symbol]. | [UNIQUE] No similar data structure found in RAG results. | [OK] All six entries match the reference paytable exactly (3-of-a-kind, 4-of-a-kind, 5-of-a-kind columns). | [LEAN] Flat module-level lookup table mapping 6 symbols to fixed 3-tuple multipliers. No abstraction beyond what the data requires. | [NONE] No test file exists; PAY_TABLE values are indirectly exercised only through getPayMultiplier, which itself has no tests. | [UNDOCUMENTED] No JSDoc. The tuple structure [number, number, number] does not indicate that the three values correspond to 3-, 4-, and 5-of-a-kind multipliers; that semantics must be inferred from getPayMultiplier.

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
