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
| `src/paytable.ts` | 🟡 NEEDS_REFACTOR | 4 | 95% | [details](#srcpaytablets) |
| `src/strategy.ts` | 🟡 NEEDS_REFACTOR | 3 | 90% | [details](#srcstrategyts) |
| `src/events.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srceventsts) |
| `src/factories.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfactoriests) |
| `src/freespin.ts` | 🟡 NEEDS_REFACTOR | 2 | 90% | [details](#srcfreespints) |
| `src/rng.ts` | 🟡 NEEDS_REFACTOR | 1 | 95% | [details](#srcrngts) |
| `src/jackpot.ts` | 🟡 NEEDS_REFACTOR | 1 | 90% | [details](#srcjackpotts) |

## 🔍 Symbol Details

### `src/engine.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `Bet` | L12–L12 | 🔴 NONE | 90% | Type alias with no test file present. |
| `HOUSE_EDGE` | L14–L14 | 🟡 WEAK | 60% | No test file exists for this module. |
| `DEBUG_MODE` | L15–L15 | 🟡 WEAK | 60% | No test file exists for this module. |
| `EngineContainer` | L17–L27 | 🟡 WEAK | 60% | No test file exists; register/resolve logic untested. |
| `container` | L29–L29 | 🟡 WEAK | 60% | No test file exists for this module. |
| `PAYLINES` | L34–L45 | 🟡 WEAK | 60% | No test file exists for this module. |
| `checkLine` | L47–L64 | 🔴 NONE | 75% | No test file exists; WILD substitution, SCATTER bail-out, and run-length edge cases untested. |
| `evaluateLine` | L66–L95 | 🔴 NONE | 80% | No test file exists; wild-boost multiplier formula and null-return paths untested. |
| `computePayout` | L101–L111 | 🔴 NONE | 90% | Exported and used by src/index.ts; house-edge application and Math.ceil behavior completely untested. |
| `spin` | L113–L179 | 🔴 NONE | 92% | Primary exported function used by src/index.ts; invalid-bet validation, payout computation, free-spin triggering, and jackpot path all untested. |

### `src/reels.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SYMBOLS` | L3–L5 | 🟡 WEAK | 60% | No test file exists. SYMBOLS array is never directly validated in any test. |
| `DEFAULT_WEIGHTS` | L12–L15 | 🟡 WEAK | 60% | No test file exists. Weight values (e.g. WILD/SCATTER both 5, DIAMOND 30) are never asserted. |
| `weightsToArray` | L17–L20 | 🟡 WEAK | 60% | No test file exists. Ordering correctness (CHERRY→SCATTER) is untested. |
| `REEL_WEIGHTS` | L22–L28 | 🟡 WEAK | 60% | No test file exists. Five-reel homogeneity and per-reel weight arrays are never validated. |
| `pickFromWeighted` | L30–L41 | 🟡 WEAK | 95% | No test file exists. Critical RNG logic (boundary conditions, zero-weight exclusion, fallback to last item) is entirely untested. |
| `spinReel` | L43–L50 | 🔴 NONE | 93% | No test file exists. Exported function used by engine.ts and factories.ts — happy path, out-of-bounds reelIndex, and 3-row output shape are all untested. |
| `getReelSymbols` | L52–L54 | 🔴 NONE | 95% | No test file exists. Return value identity and completeness (all 8 symbols) never asserted. |
| `getReelWeights` | L56–L58 | 🔴 NONE | 93% | No test file exists. Valid and out-of-bounds reelIndex behavior never tested. |

### `src/paytable.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `ANCIENT_RTP` | L3–L3 | 🔴 NONE | 95% | No test file exists. Constant is used by engine.ts and legacy.ts but has no coverage. |
| `PAY_TABLE` | L5–L12 | 🟡 WEAK | 60% | No test file exists. Internal table is exercised indirectly via getPayMultiplier but has zero direct or indirect test coverage. |
| `getPayMultiplier` | L14–L21 | 🔴 NONE | 92% | No test file exists. Function handles unknown symbols (returns 0), count branches 3/4/5, and out-of-range counts — none are tested. Used in critical payout paths in engine.ts and legacy.ts. |
| `lineWins` | L23–L40 | 🔴 NONE | 92% | No test file exists. Complex logic covering WILD substitution, SCATTER early-return, consecutive-match counting, and minimum-count threshold — all untested. Used in engine.ts and legacy.ts payout paths. |

### `src/strategy.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinStrategy` | L3–L5 | 🔴 NONE | 90% | Abstract base class with no test file. Used by src/engine.ts as a polymorphic dependency. |
| `DefaultStrategy` | L7–L11 | 🔴 NONE | 90% | No test file. adjustPayout is an identity function but edge cases (zero payout, negative payout) are untested. Used in src/engine.ts. |
| `ConservativeStrategy` | L13–L20 | 🔴 NONE | 85% | No test file. adjustPayout applies Math.floor(0.8x) — rounding and truncation behavior (e.g. fractional payouts, zero, large values) are entirely untested. Used in src/engine.ts. |

### `src/events.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `SpinEventEmitter` | L3–L25 | 🔴 NONE | 90% | No test file exists. Methods on/off/emit are untested — missing coverage for handler registration, deregistration, multi-listener dispatch, unknown event emit, and args forwarding. |
| `SPIN_DONE` | L27–L27 | 🔴 NONE | 90% | No test file exists. Constant string value used by src/engine.ts is never verified in tests. |

### `src/factories.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `AbstractReelBuilderFactory` | L4–L6 | 🔴 NONE | 90% | No test file exists. Abstract class used by src/engine.ts as a base type. |
| `StandardReelBuilderFactory` | L8–L16 | 🔴 NONE | 90% | No test file exists. buildReels is the core factory method used by src/engine.ts — happy path, edge cases (reelCount=0, rowCount ignored), and spinReel integration are all untested. |

### `src/freespin.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `detectScatters` | L3–L11 | 🔴 NONE | 90% | No test file exists. Used by engine.ts with no coverage for empty reels, single scatter, exactly 3 scatters, or mixed symbol grids. |
| `handleFreeSpins` | L13–L25 | 🔴 NONE | 90% | No test file exists. Critical state machine with 4 branches (activate, retrigger, decrement, deactivate) entirely untested despite being called by engine.ts. |

### `src/rng.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `weightedPick` | L5–L16 | 🔴 NONE | 95% | No test file exists. Critical gaming RNG utility used by src/engine.ts with no coverage of weighted distribution correctness, edge cases (empty arrays, mismatched lengths, zero weights, single item, all-zero weights), or the fallback return on L15. |

### `src/jackpot.ts`

| Symbol | Lines | Tests | Conf. | Detail |
|--------|-------|-------|-------|--------|
| `isJackpotHit` | L3–L11 | 🔴 NONE | 90% | No test file exists. Critical game logic used by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), under-threshold, and empty reel cases all untested. |

## 🧪 Test Improvements

- [ ] `src/engine.ts` — 5 untested, 5 weak
  Improve `src/engine.test.ts` covering: Bet, HOUSE_EDGE, DEBUG_MODE, EngineContainer, container, PAYLINES, checkLine, evaluateLine, computePayout, spin
  - HOUSE_EDGE: [USED] Referenced in computePayout (L106): `total * (1 + HOUSE_EDGE)`. | [UNIQUE] No similar constants found in RAG results. | [OK] Value 0.05 is correct for a 5% house edge; the misapplication is in computePayout. | [LEAN] Named constant for a magic number. Minimal and appropriate. | [NONE] No test file exists for this module. | [UNDOCUMENTED] Private constant with no comment explaining its role in payout calculation or RTP target.
  - DEBUG_MODE: [LOW_VALUE] Hardcoded `false`; the guarded `console.log` block in spin (L168–170) can never execute. Dead branch masquerading as a feature flag. | [UNIQUE] No similar constants found in RAG results. | [OK] Boolean constant with no logic. | [LEAN] Named constant. Dead code (always false) is a quality issue, not an overengineering issue. | [NONE] No test file exists for this module. | [UNDOCUMENTED] Private flag with no comment. Name is self-descriptive but effect on behavior is undocumented.
  - EngineContainer: [USED] Instantiated at L29 to create `container`. However, the abstraction adds no value over direct references — `rng` and `reelsModule` resolved from it are never consumed in `spin`. | [UNIQUE] No similar classes found in RAG results. | [OK] resolve() returns undefined-cast-to-T for unknown keys, but all call sites use keys that were registered. | [OVER] DIY service-locator wrapping three direct module imports behind a Map<string, unknown>. Adds indirection and type-erasure (resolve returns unknown, requiring casts) for zero benefit. The three registered values are already available as named imports; using them directly eliminates the container entirely. | [NONE] No test file exists; register/resolve logic untested. | [UNDOCUMENTED] Private DI container class with no JSDoc. Purpose, register/resolve semantics, and type-erasure risk are undocumented.
  - container: [USED] Referenced in `spin` to resolve `rng`, `paytable`, and `reelsModule`. Only `paytable` is actually consumed (passed to `evaluateLine`); `rng` and `reelsModule` are resolved but unused, making two of three registrations dead. | [UNIQUE] No similar variables found in RAG results. | [OK] All three keys registered match their call-site resolutions. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists for this module. | [UNDOCUMENTED] Module-level singleton with no comment describing its role or what it holds.
  - PAYLINES: [USED] Iterated in `spin` (L137–139) to drive `evaluateLine`, and indexed again for wild multiplier calculation (L150). | [UNIQUE] No similar constants found in RAG results. | [OK] Matches the reference documentation exactly. | [LEAN] Plain data table. Correct representation for a fixed set of payline patterns. | [NONE] No test file exists for this module. | [UNDOCUMENTED] No JSDoc explaining the coordinate scheme (column → row index), payline count, or win evaluation direction.

- [ ] `src/reels.ts` — 3 untested, 5 weak
  Improve `src/reels.test.ts` covering: SYMBOLS, DEFAULT_WEIGHTS, weightsToArray, REEL_WEIGHTS, pickFromWeighted, spinReel, getReelSymbols, getReelWeights
  - SYMBOLS: [USED] Referenced in pickFromWeighted calls (L48, L33) and returned by getReelSymbols. | [UNIQUE] No similar constants found in RAG results. | [OK] 8 symbols enumerated; order matches ReelWeightConfig and weightsToArray output. | [LEAN] Simple array of string literals. No unnecessary abstraction. | [NONE] No test file exists. SYMBOLS array is never directly validated in any test. | [UNDOCUMENTED] No JSDoc. Non-exported module constant; name is clear but no comment explains its role as the canonical ordered symbol list used for weight indexing.
  - DEFAULT_WEIGHTS: [USED] Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27). | [UNIQUE] No similar constants found in RAG results. | [OK] Weights sum to 120; values match documented distribution exactly. | [ACCEPTABLE] Named-field object genuinely aids readability — the symbol-to-weight mapping is self-documenting. The over-engineering lives in the interface and adapter, not the constant itself. | [NONE] No test file exists. Weight values (e.g. WILD/SCATTER both 5, DIAMOND 30) are never asserted. | [UNDOCUMENTED] No JSDoc. The raw numbers (25, 25, 15, 10, 5, 30, 5, 5) carry semantic meaning — relative probabilities, total of 120 — none of which is explained.
  - weightsToArray: [USED] Called five times to populate REEL_WEIGHTS (L23–L27). | [UNIQUE] No similar functions found per RAG results. | [OK] Return order matches SYMBOLS array order; correctly maps all 8 fields. | [LEAN] Auto-resolved: function ≤ 5 lines | [NONE] No test file exists. Ordering correctness (CHERRY→SCATTER) is untested. | [UNDOCUMENTED] Internal helper, <10 lines, name is self-explanatory. Lenient threshold applies; no JSDoc but not a concern for public API.
  - REEL_WEIGHTS: [USED] Indexed in spinReel (L44) and returned by getReelWeights (L57). | [UNIQUE] No similar constants found in RAG results. | [OK] 5 reels initialized identically with DEFAULT_WEIGHTS; consistent with documentation. | [ACCEPTABLE] Per-reel `number[][]` layout is idiomatic for slot engines and allows future per-reel weight divergence without restructuring. Five identical entries is slightly redundant, but the structure is justified by the domain. | [NONE] No test file exists. Five-reel homogeneity and per-reel weight arrays are never validated. | [UNDOCUMENTED] No JSDoc. Non-obvious that all 5 reels share identical weights, or that index 0–4 maps to reels left-to-right. Both facts warrant a comment.
  - pickFromWeighted: [USED] Called inside spinReel loop (L48). | [DUPLICATE] Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random() * total, accumulate weights in a loop, return items[i] on first match, and fall back to the last item. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and that pickFromWeighted locks the type to Symbol[] instead of using a generic T. The functions are interchangeable for the Symbol use case. | [NEEDS_FIX] Math.random() is not a certifiable RNG source for regulated gaming. | [LEAN] Textbook weighted-random selection. Single responsibility, minimal branching, no unnecessary generalization. | [NONE] No test file exists. Critical RNG logic (boundary conditions, zero-weight exclusion, fallback to last item) is entirely untested. | [UNDOCUMENTED] Internal unexported function implementing weighted random selection. Name hints at behavior; lenient threshold applies. No JSDoc but acceptable for a private helper. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. reels.ts:30-41 is algorithmically correct: cumulative-weight sampling with proper fallback to last element. The evaluator flagged NEEDS_FIX because the function is duplicated with weightedPick in rng.ts:5-16, but duplication is a code organization concern — not a correctness defect. The function produces correct weighted random selections. It is actively used at runtime: spinReel (reels.ts:47) calls it in a loop via factory.buildReels → spinReel → pickFromWeighted. No bug exists in this function.)

- [ ] `src/paytable.ts` — 3 untested, 1 weak
  Improve `src/paytable.test.ts` covering: ANCIENT_RTP, PAY_TABLE, getPayMultiplier, lineWins
  - PAY_TABLE: [USED] Non-exported; referenced in getPayMultiplier (L15) on every call. | [UNIQUE] No similar lookup table found in RAG results. | [OK] All multiplier triples match the reference paytable exactly. | [LEAN] Flat lookup table mapping 6 symbols to fixed 3-element tuples. No abstraction beyond what the data requires. | [NONE] No test file exists. Internal table is exercised indirectly via getPayMultiplier but has zero direct or indirect test coverage. | [UNDOCUMENTED] No JSDoc. Non-exported private constant so leniency applies, but the tuple structure [3-of-a-kind, 4-of-a-kind, 5-of-a-kind] is not self-evident from the type alone. An inline comment on the tuple indices would suffice.

- [ ] `src/strategy.ts` — 3 untested
  Create `src/strategy.test.ts` covering: SpinStrategy, DefaultStrategy, ConservativeStrategy

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
