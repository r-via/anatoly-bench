# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls (L46, L33) and returned by getReelSymbols (L53).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Array order matches weightsToArray and documentation exactly.
- **Overengineering [LEAN]**: Plain array of 8 literal strings. No abstraction needed here.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; name is clear but no comment explaining it is the canonical ordered symbol list used for reel indexing.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS (L12) and weightsToArray parameter (L17).
- **Duplication [UNIQUE]**: No similar interface found in RAG results.
- **Correction [OK]**: Interface fields match SYMBOLS order and cover all eight symbols.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: Interface with self-descriptive symbol-name fields mapped to numeric weights. Purpose is unambiguous from name and structure.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times in REEL_WEIGHTS initialization (L23–L27).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: All weights match reference docs; sum is 120 as documented.
- **Overengineering [LEAN]**: Straightforward static constant; clarity comes from the field names in ReelWeightConfig.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious that all five reels share this single distribution, or that total sums to 120. This context is absent.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to populate REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Output order matches SYMBOLS array index-for-index.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists for this module. Key edge cases untested: weight order, length, zero-weight entries.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported private helper, <10 lines, clear name. UNDOCUMENTED is tolerated per private-helper leniency rule.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Five reels, each initialised with DEFAULT_WEIGHTS — consistent with docs.
- **Overengineering [ACCEPTABLE]**: Five identical weight arrays anticipate per-reel customization not currently used, but the overhead is negligible and the structure makes adding reel-specific weights trivial.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious that all five entries are identical copies of DEFAULT_WEIGHTS and that the array is indexed by reel 0–4.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel (L46) to select each row symbol.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: same weighted-random algorithm, same reduce for total, same cumulative loop with early return, same fallback to last element. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative), non-generic Symbol[] type instead of T, and missing export. These are interchangeable implementations.
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG.
- **Overengineering [LEAN]**: Canonical weighted-random-selection algorithm, implemented directly with no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical untested cases: uniform distribution boundary (r === acc), all-equal weights, single-item list, total=0 (division by zero risk).
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported helper but implements non-trivial weighted-random selection; no comment on algorithm, params, or fallback behavior (returns last item when r equals total). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 is algorithmically correct — standard cumulative-weight sampling with proper fallback on L40. Duplication with weightedPick (src/rng.ts:5-16) is real and confirmed (identical logic, different variable names and type parameter), but duplication is not a correctness defect. Both functions produce correct weighted random selections. The automated evaluator conflated the duplication axis with the correction axis. pickFromWeighted is the one actually used at runtime via spinReel (L47) → factory.buildReels (src/factories.ts:12) → spin (src/engine.ts:128).)

> **Duplicate of** `src/rng.ts:weightedPick` — ~98% identical logic — both compute a weighted random pick via cumulative sum loop with identical structure and fallback

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Loop and delegation to pickFromWeighted are correct; produces a 3-symbol column per call.
- **Overengineering [LEAN]**: Straightforward: index into REEL_WEIGHTS, collect 3 symbols, return column.
- **Tests [NONE]**: No test file exists. Used by src/factories.ts — a critical call path with no coverage. Out-of-bounds reelIndex (>=5) would return undefined weights silently.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: what reelIndex range is valid (0–4), that it returns 3 symbols (one per row), and that sampling is independent per cell.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG.
- **Correction [OK]**: Returns SYMBOLS as documented; no correctness defect in the function itself.
- **Overengineering [LEAN]**: Minimal accessor; appropriate for encapsulating the module-private constant.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts with no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No description of return value order or that it is the canonical symbol order used for weight array indexing.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG.
- **Correction [OK]**: Returns the correct weight array for the requested reel index.
- **Overengineering [LEAN]**: Minimal accessor matching the documented public API.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally with getReelSymbols(), and that it is read-only at runtime.

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates all 8 fields that exactly mirror the `Symbol` union. `Record<Symbol, number>` would be idiomatic and stay in sync automatically if `Symbol` gains new members. [L9-L12] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are all mutable at runtime. `getReelWeights` returns a direct reference to an internal `number[]`, allowing callers to mutate module-level state. Docs state weights are read-only at runtime. [L3-L22] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. At minimum, `spinReel` should document the `reelIndex` parameter and its valid range (0–4). [L43-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel` does not validate `reelIndex`. An out-of-range index returns `undefined` from `REEL_WEIGHTS[reelIndex]`, causing `wts.reduce` to throw `TypeError: Cannot read properties of undefined`. No guard or early return exists. [L44-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/symbol/payline vocabulary throughout the codebase. `Math.random()` is a non-cryptographic, non-auditable PRNG that is not certifiable under regulated gaming standards (GLI-11, BMM, AGCC, etc.). The project already contains `src/rng.ts`, indicating a proper RNG module exists but is not used here. All randomness in certified gaming engines must be sourced from a seeded, auditable, CSPRNG. [L33] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point. Deterministic unit testing requires either extracting RNG as a parameter or using `src/rng.ts` with a seeded provider. [L29-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` is unused. `DEFAULT_WEIGHTS` would benefit from `satisfies ReelWeightConfig` to retain literal types while still enforcing shape. `SYMBOLS` and `REEL_WEIGHTS` could use `as const` for deep immutability. [L14-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine context: `getReelWeights` returns a live mutable array reference. Caller mutation silently alters per-reel distributions mid-session — a correctness hazard in a gaming engine where weight auditability must be preserved per-spin. [L55-L57] |

### Suggestions

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to stay DRY and in sync with the Symbol union.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Replace `Math.random()` with the project's `src/rng.ts` module and inject the RNG function for testability and regulatory compliance.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import { nextFloat } from "./rng.js";
  
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = nextFloat): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Add `readonly` modifiers and use `as const` to prevent external mutation of internal state.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...];
  
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  const DEFAULT_WEIGHTS = { ... } as const satisfies ReelWeightConfig;
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
  
  export function getReelWeights(reelIndex: number): readonly number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Guard `spinReel` against out-of-bounds `reelIndex` to prevent silent undefined errors.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a seeded, auditable PRNG (e.g. AES-CTR DRBG or a certified Xorshift variant). Math.random() is not reproducible or independently verifiable, which fails regulatory certification requirements for slot-machine RNG. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
