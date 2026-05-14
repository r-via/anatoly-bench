# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 72% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 90% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| getReelSymbols | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 72% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Non-exported constant used locally: referenced on line 47 in spinReel() and line 53 in getReelSymbols()
- **Duplication [UNIQUE]**: Constant array of symbol type identifiers. No similar symbols found in RAG results.
- **Correction [OK]**: Array contains exactly 8 symbols in the documented order; used correctly as the item list paired with weightsToArray output.
- **Overengineering [LEAN]**: Simple, flat constant array listing all eight slot symbols. No abstraction needed here.
- **Tests [NONE]**: No test file found for this module. SYMBOLS constant is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The constant holds the master list of slot symbols used across all reels, but there is no inline documentation explaining its role, ordering significance, or relationship to other modules.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Non-exported constant used locally: passed to weightsToArray 5 times in REEL_WEIGHTS initialization (lines 23-27)
- **Duplication [UNIQUE]**: Constant weight configuration object. No similar constants found in RAG results.
- **Correction [OK]**: Sum = 25+25+15+10+5+30+5+5 = 120, matching the documented total of 120 and all per-symbol probabilities in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Overengineering [LEAN]**: A single, readable config object with named fields matching the documented weight table. Appropriately minimal.
- **Tests [NONE]**: No test file exists. DEFAULT_WEIGHTS values (e.g. ensuring weights sum correctly or individual symbol weights) are completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The numeric values (25, 25, 15, 10, 5, 30, 5, 5) are not self-explanatory; a reader cannot deduce that they are relative weights summing to 120, or understand the intended probability distribution, without external context.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Non-exported constant used locally: accessed on line 44 in spinReel() and line 57 in getReelWeights()
- **Duplication [UNIQUE]**: 2D constant array storing pre-computed weight arrays for each reel. No similar constants found in RAG results.
- **Correction [OK]**: Five reels, all with DEFAULT_WEIGHTS, consistent with the documented shared distribution.
- **Overengineering [OVER]**: Creates five separate, identical arrays by calling `weightsToArray(DEFAULT_WEIGHTS)` five times. The Configuration Schema doc (`.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`) explicitly states "All five reels share the same weight distribution", making per-reel array storage premature generalization. A single shared weights array would be correct and sufficient; the current structure implies per-reel differentiation that neither exists nor is planned.
- **Tests [NONE]**: No test file exists. REEL_WEIGHTS structure (5 reels, each with correct weights) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The structure — a parallel array of five identical weight arrays, one per reel — and the design decision that all reels share DEFAULT_WEIGHTS are not documented. This is a key configuration constant whose shape and intent are non-obvious.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Non-exported function used locally: called twice on line 47 within spinReel() loop
- **Duplication [DUPLICATE]**: Implements weighted random selection by accumulating weights and comparing to a random roll. RAG found weightedPick (0.865) with identical algorithm: same weight summation, same random scaling, same accumulation logic, same fallback.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable PRNG for regulated gaming; the weighted-selection logic itself is correct.
- **Overengineering [LEAN]**: Textbook weighted-random selection: accumulate total, pick a random point, walk until it falls in a bucket. Minimal, correct, and generic enough to warrant its own function.
- **Tests [NONE]**: No test file found. This is a core probabilistic selection function with edge cases (boundary r values, single-item lists, total weight computation) — all completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. This implements a weighted random selection algorithm (linear scan over cumulative probabilities). It is non-exported but the algorithm is non-trivial; the absence of documentation for the parameters 'items' and 'wts', the return value, and the edge-case fallback on the last item is notable. (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at src/reels.ts:30-41 is algorithmically correct — it faithfully implements cumulative-weight random selection with proper fallback (L40). It IS used locally at L47 inside spinReel()'s loop (called 3 times per spin, not twice as the finding states). The finding's real substance is about duplication with src/rng.ts:weightedPick, not a correctness bug. Both implementations are identical in logic (reduce total, random roll, accumulate, compare, fallback to last item). Deduplicating by importing weightedPick from rng.ts would be a safe refactor with zero behavioral change, but the existing code has no bug — it produces correct weighted random results. This is a duplication/refactoring concern misclassified on the correction axis.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical weighted selection logic — both accumulate weights and return matching item when cumulative weight exceeds random roll

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported function with 1 runtime importer: src/factories.ts
- **Duplication [UNIQUE]**: Generates 3 random symbols for a reel using weighted selection. RAG found getReelWeights (0.719) but different purpose: spinReel performs weighted sampling, while getReelWeights is a simple accessor.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; out-of-range index yields undefined weights, causing a TypeError crash in pickFromWeighted.
- **Overengineering [LEAN]**: Straightforward: look up the reel's weight array, fill a 3-row column via weighted random draws. Does exactly one thing.
- **Tests [NONE]**: No test file found. spinReel is imported by src/factories.ts (a critical path) but has zero test coverage — happy path, invalid reelIndex, and output length/shape are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. This is a public exported function with no documentation explaining the 'reelIndex' parameter (valid range, what 'reel' means), the hardcoded row count of 3, or the structure and semantics of the returned Symbol[] column.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported function with 1 runtime importer: src/engine.ts
- **Duplication [UNIQUE]**: Trivial function (≤2 lines). Simple accessor returning constant SYMBOLS array. No duplication.
- **Correction [NEEDS_FIX]**: Returns a direct mutable reference to the module-level SYMBOLS array; a caller that mutates the returned array (push, splice, element reassignment) silently corrupts the positional contract relied on by pickFromWeighted and weightsToArray.
- **Overengineering [LEAN]**: Thin accessor exposing the module-private SYMBOLS array. Appropriate encapsulation for a single-line getter.
- **Tests [NONE]**: No test file found. getReelSymbols is imported by src/engine.ts but is entirely untested, including the returned array contents and length.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Public exported getter with no documentation. While simple, it is part of the public API and should at minimum describe what the returned array represents and that it is the canonical symbol list.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported function with 1 runtime importer: src/engine.ts
- **Duplication [UNIQUE]**: Trivial function (≤2 lines). Simple accessor returning weight array by reel index. No duplication.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex (returns undefined typed as number[]) and returns a mutable reference allowing callers to permanently alter live spin weights.
- **Overengineering [LEAN]**: Simple indexed accessor into REEL_WEIGHTS. The function itself is minimal; any over-engineering lives in the REEL_WEIGHTS structure it exposes, not here.
- **Tests [NONE]**: No test file found. getReelWeights is imported by src/engine.ts but is entirely untested, including boundary behavior for invalid reelIndex values.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Public exported function with no documentation for the 'reelIndex' parameter (valid range, zero-based index) or the meaning and structure of the returned number[] (parallel to getReelSymbols() ordering).

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually redeclares all eight Symbol literal keys. Since Symbol is an imported union type from types.ts, Record<Symbol, number> would be more DRY and automatically stay in sync if the Symbol union ever changes. [L8-L13] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are module-level constants but are typed as fully mutable (Symbol[], ReelWeightConfig, number[][]). They should use `as const` or readonly modifiers to prevent accidental mutation from downstream callers. [L3-L29] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported functions — spinReel, getReelSymbols, getReelWeights — lack JSDoc comments. Public API surface in a gambling engine should be documented, including parameter constraints (e.g., valid reelIndex range 0–4). [L44-L57] |
| 13 | Security | FAIL | CRITICAL | REGULATED GAMBLING DOMAIN VIOLATION: The slot-machine vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER, spinReel, REEL_WEIGHTS) unambiguously identifies this as regulated-gaming code. Math.random() is a non-cryptographic PRNG seeded by the runtime and is NOT certifiable for regulated gambling under standards such as GLI-11, BMM, or UKGC technical requirements. Critically, the project already ships src/rng.ts — a dedicated RNG module — but pickFromWeighted() bypasses it entirely and calls Math.random() directly. All randomness in this domain must route through the certified RNG. [L34-L35] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted() hard-codes Math.random() with no injection point, making it non-deterministic and impossible to unit-test without monkey-patching. Accepting an optional rng parameter would allow deterministic seeding in tests. spinReel also depends on the global REEL_WEIGHTS array with no override mechanism. [L32-L43] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS is typed via annotation rather than the `satisfies` operator, which would catch type errors at the definition site while preserving the literal numeric types. SYMBOLS and REEL_WEIGHTS would benefit from `as const` for readonly tuple/literal inference. [L14-L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | The project structure (per .anatoly/docs/04-API-Reference/02-Configuration-Schema.md) includes src/rng.ts as a sibling module, indicating project-level awareness of RNG concerns. Domain convention in gambling engines requires that all randomness is routed through a single auditable RNG entry-point. This file violates that convention by calling Math.random() directly, compounding the rule 13 finding. [L34-L35] |

### Suggestions

- Replace Math.random() with the project's dedicated rng.ts module and inject it as a parameter for testability
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import { nextFloat } from './rng.js'; // certified RNG
  function pickFromWeighted(
    items: Symbol[],
    wts: number[],
    rng: () => number = nextFloat,
  ): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Use Record<Symbol, number> instead of manually enumerating all keys in ReelWeightConfig
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Add readonly modifiers to all module-level constants to prevent accidental mutation
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [ ... ];
  // After
  const SYMBOLS: readonly Symbol[] = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ] as const;
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];
  ```
- Use the `satisfies` operator on DEFAULT_WEIGHTS for type-safe literal inference (TS 5.5+)
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  };
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } satisfies ReelWeightConfig;
  ```
- Add JSDoc to all exported functions documenting parameter constraints
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spins a single reel and returns 3 visible symbols.
   * @param reelIndex - Zero-based reel index (0–4)
   * @returns Ordered array of 3 symbols for the visible rows
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a bounds guard in spinReel (e.g., if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...)) before accessing REEL_WEIGHTS[reelIndex] to prevent a TypeError crash on invalid input. [L44]
- **[correction · medium · small]** Add a bounds guard in getReelWeights and return a shallow copy of the weights array to prevent out-of-range undefined returns and external mutation of live reel weights. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with crypto.getRandomValues (or an equivalent certified PRNG) to satisfy regulated gaming RNG requirements. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Return a copy of SYMBOLS in getReelSymbols (return [...SYMBOLS]) to prevent external callers from corrupting the internal symbol list. [L53]
- **[overengineering · medium · small]** Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
