# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 92% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 62% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted call (L38-39) and returned by getReelSymbols (L52)
- **Duplication [UNIQUE]**: Constant symbol string array. No duplicates found.
- **Correction [OK]**: Eight symbols defined; order matches weightsToArray and pickFromWeighted usage.
- **Overengineering [LEAN]**: Simple typed constant array of all symbol names. Appropriate.
- **Tests [NONE]**: No test file exists. Array contents and ordering are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master symbol registry for all reels) is not self-evident from the declaration alone.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times to initialize REEL_WEIGHTS (L25-29)
- **Duplication [UNIQUE]**: Constant weight configuration object. No duplicates.
- **Correction [OK]**: Sum = 25+25+15+10+5+30+5+5 = 120; matches documented total of 120 in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md and .anatoly/docs/01-Getting-Started/03-Configuration.md.
- **Overengineering [LEAN]**: Straightforward config object. Values match the documented weights in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Tests [NONE]**: No test file exists. Weight values (e.g. sum, individual entries) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing explanation that all five reels share this distribution and that weights are relative (sum=120).

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel (L44) and getReelWeights (L57)
- **Duplication [UNIQUE]**: Constant array of weight arrays for each reel. No duplicates.
- **Correction [OK]**: Five reels with identical weights; consistent with documentation.
- **Overengineering [ACCEPTABLE]**: Five identical arrays pre-computed to allow per-reel weight differentiation. Docs confirm all reels currently share DEFAULT_WEIGHTS, so the structure is unused capacity, but per-reel weights are a natural extension and the overhead is trivial.
- **Tests [NONE]**: No test file exists. Shape (5 reels × 8 weights) and correctness are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 5-reel structure and its indexing relationship to spinReel are undocumented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel loop to select weighted symbols (L38)
- **Duplication [DUPLICATE]**: Weighted random selection from Symbol array. Identical algorithm to weightedPick in src/rng.ts (reduce weights, random roll, accumulate and check). Only difference is type specialization.
- **Correction [NEEDS_FIX]**: Math.random() is non-certifiable for regulated gaming RNG (domain inferred from slot-machine symbol vocabulary: CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER, and spinReel naming).
- **Overengineering [LEAN]**: Standard weighted-random selection. One responsibility, correct linear scan, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical weighted-random logic — boundary conditions (r==0, r==total-ε, single item, zero-weight entries, fallback last item) all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing description of the weighted-random algorithm, parameter semantics, and the fallback-to-last-item behavior. (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at reels.ts:30-41 is algorithmically correct — cumulative-weight selection with proper fallback at line 40. The NEEDS_FIX claim is based solely on duplication with rng.ts:weightedPick, which is a duplication concern, not a correction issue. The function produces correct weighted random results. It is the ONLY weighted picker actually invoked at runtime (via spinReel at reels.ts:47 → factories.ts:12), while weightedPick is registered in the container but never called.)

> **Duplicate of** `src/rng.ts:weightedPick` — Identical weighted random selection algorithm with different type specialization

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Generates 3-symbol column via pickFromWeighted loop. No similar functions.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; out-of-range index yields undefined weights, causing a TypeError in pickFromWeighted at wts.reduce().
- **Overengineering [LEAN]**: Delegates to pickFromWeighted for three rows. Minimal and clear.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts; return length (3 rows), valid symbol membership, and out-of-range reelIndex are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: what reelIndex valid range is (0–4), that it returns a 3-symbol column, and sampling-with-replacement semantics.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning SYMBOLS constant. No duplicates.
- **Correction [OK]**: Returns module-level SYMBOLS array; no correctness defect.
- **Overengineering [LEAN]**: Trivial accessor; exposes SYMBOLS without modification.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; identity/content of returned array is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Returns the shared SYMBOLS array by reference — mutation risk and intended use are undocumented.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning REEL_WEIGHTS[index]. No duplicates.
- **Correction [NEEDS_FIX]**: No bounds check; returns undefined (typed as number[]) for reelIndex outside 0–4.
- **Overengineering [LEAN]**: Trivial accessor for per-reel weight array.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; correct index lookup and undefined for out-of-range index are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Valid index range, return-by-reference behavior, and relationship to DEFAULT_WEIGHTS are undocumented. (deliberated: confirmed — Missing bounds check at reels.ts:57 is real — REEL_WEIGHTS has indices 0-4 (reels.ts:22-28), and out-of-bounds access returns undefined typed as number[]. However, blast radius is near zero: the only import is engine.ts:3, registered in container at engine.ts:32, resolved at engine.ts:122 as reelsModule — but reelsModule is NEVER actually called in spin(). The factory (factories.ts:12) calls spinReel directly, which accesses REEL_WEIGHTS[reelIndex] at reels.ts:44 with the same lack of bounds check but always receives indices 0-4 from the for-loop. No current caller passes an invalid index. This is defensive programming, not fixing an active bug. Lowered confidence accordingly.)

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 symbol keys. Since Symbol is an imported union type, Record<Symbol, number> would enforce exhaustiveness automatically and eliminate the manual repetition. [L9-L12] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS lack readonly annotations. getReelSymbols() and getReelWeights() return direct mutable references to module-level constants — callers can corrupt internal state. [L3-L29] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are exported without JSDoc. reelIndex range semantics and column layout (3 rows) are undocumented. [L44-L58] |
| 13 | Security | FAIL | CRITICAL | Math.random() drives reel outcome selection in pickFromWeighted (L36). Slot-machine domain is confirmed by reel/symbol/WILD/SCATTER/weight vocabulary and .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. Math.random() is a non-seeded, non-auditable browser PRNG — not certifiable for regulated gaming RNG. The project already ships src/rng.ts (listed in .anatoly/docs/01-Getting-Started/03-Configuration.md), indicating an approved RNG abstraction exists and must be used here. [L36] |
| 15 | Testability | WARN | MEDIUM | Math.random() is not an injectable dependency — spinReel and pickFromWeighted are non-deterministic and require globalThis monkey-patching for unit tests. Accepting a RandomFn parameter enables deterministic coverage. [L32-L42] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS uses a plain type annotation. The satisfies operator would preserve literal types while enforcing ReelWeightConfig shape. [L15-L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | spinReel and getReelWeights perform no bounds check on reelIndex — an out-of-range value silently produces undefined weights, causing a silent NaN cascade through pickFromWeighted rather than a fast, diagnosable error. In regulated gaming the hot path must be explicit about failure modes. [L44-L54] |

### Suggestions

- Replace Math.random() with the project's rng.ts module to satisfy regulated gaming RNG requirements.
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { random } from './rng.js';
  const r = random() * total;
  ```
- Use Record<Symbol, number> to derive ReelWeightConfig from the Symbol union — exhaustiveness is then compiler-enforced.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module constants readonly and return readonly views from getter functions.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  export function getReelSymbols(): Symbol[] {
    return SYMBOLS;
  }
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  export function getReelSymbols(): readonly Symbol[] {
    return SYMBOLS;
  }
  ```
- Guard spinReel and getReelWeights against out-of-range reelIndex to fail fast.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length})`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Use satisfies for DEFAULT_WEIGHTS to preserve literal types while enforcing shape conformance.
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, ...
  };
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } satisfies ReelWeightConfig;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with crypto.getRandomValues() or an equivalent CSPRNG to satisfy regulated gaming RNG certification requirements. [L32]
- **[correction · medium · small]** Add a bounds guard in spinReel: throw a descriptive RangeError when reelIndex < 0 or >= REEL_WEIGHTS.length before accessing REEL_WEIGHTS[reelIndex]. [L44]

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Add a bounds guard in getReelWeights: throw or return a typed sentinel when reelIndex is out of range instead of silently returning undefined. [L57]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
