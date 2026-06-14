# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 85% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 95% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 93% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 93% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls (L48, L33) and returned by getReelSymbols.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: 8 symbols enumerated; order matches ReelWeightConfig and weightsToArray output.
- **Overengineering [LEAN]**: Simple array of string literals. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. SYMBOLS array is never directly validated in any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported module constant; name is clear but no comment explains its role as the canonical ordered symbol list used for weight indexing.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as parameter type in weightsToArray (L17) and type annotation for DEFAULT_WEIGHTS (L12).
- **Duplication [UNIQUE]**: No similar interfaces found in RAG results.
- **Correction [OK]**: Interface fields map 1-to-1 to SYMBOLS entries; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior — nothing to test.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface: field names are the symbol literals and values are numeric weights. No complex semantics beyond what the names convey.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Weights sum to 120; values match documented distribution exactly.
- **Overengineering [ACCEPTABLE]**: Named-field object genuinely aids readability — the symbol-to-weight mapping is self-documenting. The over-engineering lives in the interface and adapter, not the constant itself.
- **Tests [NONE]**: No test file exists. Weight values (e.g. WILD/SCATTER both 5, DIAMOND 30) are never asserted.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The raw numbers (25, 25, 15, 10, 5, 30, 5, 5) carry semantic meaning — relative probabilities, total of 120 — none of which is explained.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to populate REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Return order matches SYMBOLS array order; correctly maps all 8 fields.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Ordering correctness (CHERRY→SCATTER) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, <10 lines, name is self-explanatory. Lenient threshold applies; no JSDoc but not a concern for public API.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and returned by getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: 5 reels initialized identically with DEFAULT_WEIGHTS; consistent with documentation.
- **Overengineering [ACCEPTABLE]**: Per-reel `number[][]` layout is idiomatic for slot engines and allows future per-reel weight divergence without restructuring. Five identical entries is slightly redundant, but the structure is justified by the domain.
- **Tests [NONE]**: No test file exists. Five-reel homogeneity and per-reel weight arrays are never validated.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious that all 5 reels share identical weights, or that index 0–4 maps to reels left-to-right. Both facts warrant a comment.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel loop (L48).
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: both reduce weights to a total, roll Math.random() * total, accumulate weights in a loop, return items[i] on first match, and fall back to the last item. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and that pickFromWeighted locks the type to Symbol[] instead of using a generic T. The functions are interchangeable for the Symbol use case.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG source for regulated gaming.
- **Overengineering [LEAN]**: Textbook weighted-random selection. Single responsibility, minimal branching, no unnecessary generalization.
- **Tests [NONE]**: No test file exists. Critical RNG logic (boundary conditions, zero-weight exclusion, fallback to last item) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal unexported function implementing weighted random selection. Name hints at behavior; lenient threshold applies. No JSDoc but acceptable for a private helper. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive on the correction axis. reels.ts:30-41 is algorithmically correct: cumulative-weight sampling with proper fallback to last element. The evaluator flagged NEEDS_FIX because the function is duplicated with weightedPick in rng.ts:5-16, but duplication is a code organization concern — not a correctness defect. The function produces correct weighted random selections. It is actively used at runtime: spinReel (reels.ts:47) calls it in a loop via factory.buildReels → spinReel → pickFromWeighted. No bug exists in this function.)

> **Duplicate of** `src/rng.ts:weightedPick` — ~98% identical logic — same weighted random selection algorithm, same fallback; pickFromWeighted is a non-generic, Symbol-typed copy of the generic weightedPick

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly produces a 3-symbol column via weighted selection for the given reel index.
- **Overengineering [LEAN]**: Straightforward loop producing 3 symbols per reel column.
- **Tests [NONE]**: No test file exists. Exported function used by engine.ts and factories.ts — happy path, out-of-bounds reelIndex, and 3-row output shape are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of what 'spinning' means, valid range of reelIndex (0–4), explanation that it returns a 3-element column, and behavior when reelIndex is out of range.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/factories.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG results.
- **Correction [OK]**: Returns SYMBOLS array; no correctness issues.
- **Overengineering [LEAN]**: Minimal accessor matching the documented public API.
- **Tests [NONE]**: No test file exists. Return value identity and completeness (all 8 symbols) never asserted.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No explanation that the returned array order is significant (it matches weight index positions).

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and src/factories.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG results.
- **Correction [OK]**: Returns mutable reference to internal weight array; no in-tree call site mutates it (see doc_divergence for contract gap).
- **Overengineering [LEAN]**: Minimal indexed accessor matching the documented public API.
- **Tests [NONE]**: No test file exists. Valid and out-of-bounds reelIndex behavior never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally with getReelSymbols(), and that it returns a direct reference (mutable).

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 symbol keys, duplicating the Symbol union. Record<Symbol, number> is idiomatic and self-syncing. [L7-L11] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are fully mutable. getReelSymbols() and getReelWeights() return live array references, enabling callers to silently mutate module-level state. [L3-L26] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all public API surface with no JSDoc. [L43-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel does not guard reelIndex bounds. REEL_WEIGHTS[reelIndex] returns undefined for indices outside [0,4], causing a TypeError inside pickFromWeighted at wts.reduce(). [L43-L49] |
| 13 | Security | FAIL | CRITICAL | Regulated gambling domain inferred from reel/symbol/slot/jackpot vocabulary throughout the project. Math.random() is a non-cryptographic PRNG and is not certifiable for regulated gaming RNG. The project exposes src/rng.ts as a dedicated RNG abstraction, which this file bypasses entirely. All random draws that determine game outcome must route through the certified RNG module. [L33] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted hard-codes Math.random() with no injection point, making deterministic unit testing impossible without mocking globals. [L30-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS would benefit from as const for a readonly literal tuple. DEFAULT_WEIGHTS could use satisfies ReelWeightConfig for type-checked literal inference. [L3-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | Both getReelSymbols() and getReelWeights() return live mutable references to internal module state. For a slot-engine public API, returning ReadonlyArray or spread copies is the standard to prevent accidental state corruption by consumers. [L51-L57] |

### Suggestions

- Replace ReelWeightConfig interface with Record to eliminate manual sync with the Symbol union
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Inject an RNG function to satisfy regulated-gaming RNG requirements and enable deterministic testing
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import { nextFloat } from "./rng.js";
  
  function pickFromWeighted(
    items: readonly Symbol[],
    wts: readonly number[],
    rng: () => number = nextFloat,
  ): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Add reelIndex bounds guard in spinReel to prevent silent TypeError
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
- Return readonly arrays from public getters to prevent caller mutation of module state
  ```typescript
  // Before
  export function getReelSymbols(): Symbol[] {
    return SYMBOLS;
  }
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelSymbols(): readonly Symbol[] {
    return SYMBOLS;
  }
  export function getReelWeights(reelIndex: number): readonly number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Apply as const and satisfies for immutable module constants
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ];
  
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
  // After
  const SYMBOLS = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ] as const satisfies readonly Symbol[];
  
  const DEFAULT_WEIGHTS = {
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with crypto.getRandomValues (or equivalent audited CSPRNG) to satisfy regulated gaming RNG certification requirements. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
