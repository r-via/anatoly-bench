# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | NEEDS_FIX | LEAN | USED | UNIQUE | WEAK | 85% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 90% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls (L48, L53) and returned by getReelSymbols.
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Eight-symbol array correctly declared and ordered.
- **Overengineering [LEAN]**: Plain constant array; minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported module constant; name is clear but no comment explains it is the canonical ordered symbol list shared by all reels.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as parameter type in weightsToArray (L17) and as type of DEFAULT_WEIGHTS (L12).
- **Duplication [UNIQUE]**: No similar interface found in RAG results.
- **Correction [OK]**: Interface correctly models all eight per-symbol weight fields.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests needed.
- **DOCUMENTED [DOCUMENTED]**: Interface with self-descriptive name and fields matching symbol names. Purpose and structure are unambiguous without a JSDoc block.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30 (p = 0.25) produces ~229.5% per-payline EV from DIAMOND alone, making the arbitrated 95% RTP target impossible.
- **Overengineering [LEAN]**: Straightforward config constant; complexity belongs to the type it uses, not to this declaration.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported constant; no explanation of what the numeric values represent (relative weights summing to 120) or that all five reels share this distribution. (deliberated: confirmed — Confirmed with higher confidence. src/reels.ts:14 sets DIAMOND weight=30, total=120, p=0.25. src/paytable.ts:11 pays DIAMOND 50/250/1000× for 3/4/5-of-a-kind. EV from DIAMOND alone: 0.25^3×0.75×50 + 0.25^4×0.75×250 + 0.25^5×1000 = 2.295× per line bet (229.5%). This single symbol exceeds 100% RTP before counting 7 other symbols, WILDs, or bet*0.01 floor. The 95% RTP target (ANCIENT_RTP=0.95 at src/paytable.ts:3) is mathematically impossible. Raised confidence because the arithmetic is independently verifiable.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to populate REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Returns weights in SYMBOLS declaration order with no gaps or misordering.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper, <10 lines, name is self-explanatory. Tolerated per internal-helper leniency rule.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Five reels correctly initialized from DEFAULT_WEIGHTS; weight defect originates there, not here.
- **Overengineering [ACCEPTABLE]**: Five identical entries signal a per-reel design intent (weights could differ), which aligns with the documented extension path of forking the file to change weights per reel. Slight redundancy (5× same call), but the explicitness is justified.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported constant; structure (5 reels each carrying 8 weights) and the fact that all reels are identical are not documented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel loop (L48).
- **Duplication [DUPLICATE]**: Logic is 95%+ identical to weightedPick in src/rng.ts: both sum weights, draw Math.random()*total, accumulate in a loop, return items[i] on first exceedance, fall back to last item. Only differences are variable names and that pickFromWeighted is typed Symbol[] instead of generic T[]. pickFromWeighted is interchangeable with weightedPick and should be replaced by it.
- **Correction [NEEDS_FIX]**: Uses Math.random(), a non-certifiable PRNG, in a regulated slot-machine engine (domain inferred from reel/payline/jackpot/RTP vocabulary throughout codebase).
- **Overengineering [LEAN]**: Standard weighted-random selection; O(n) linear scan is appropriate for 8 items.
- **Tests [NONE]**: No test file exists. This function has non-trivial weighted-random logic (boundary at r < acc, fallback to last item) that critically needs edge-case coverage: zero-weight entries, single-item list, r exactly at a boundary.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper implementing weighted random selection. Not exported; name conveys intent. Tolerated per internal-helper leniency rule. (deliberated: reclassified: correction: NEEDS_FIX → OK — Downgraded. src/reels.ts:30-41 correctly implements weighted random selection: sums weights, draws uniform random, accumulates until threshold, falls back to last item. Algorithm is identical to weightedPick in src/rng.ts:5-16. The Math.random() concern is a regulatory/security best-practice, not a correctness defect — the function produces correctly distributed outputs. Notably, src/rng.ts:7 (weightedPick) also uses Math.random(), so the entire codebase has the same RNG source. No functional incorrectness exists.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — same weighted random selection algorithm, same fallback, differing only in variable names and type parameter (Symbol[] vs generic T[])

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Correctly draws 3 independent cells per reel using per-reel weights.
- **Overengineering [LEAN]**: Minimal loop over 3 rows; straightforward.
- **Tests [NONE]**: No test file exists. Used by src/factories.ts; missing tests for valid reel index, out-of-bounds index (REEL_WEIGHTS[reelIndex] would be undefined), and that exactly 3 symbols are returned.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), meaning of return value (3-element column of symbols, one per row), and that sampling is independent per cell.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found.
- **Correction [OK]**: Returns SYMBOLS array as documented.
- **Overengineering [LEAN]**: Simple accessor.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts; no coverage of returned array identity or contents.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No explanation of the return value order or that it is the canonical symbol ordering used for weight-array indexing.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found.
- **Correction [OK]**: Returns weight array for the requested reel index as documented.
- **Overengineering [LEAN]**: Simple accessor.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts; no coverage of valid index, out-of-bounds index, or returned array contents.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex (0–4), that the returned array aligns positionally with getReelSymbols(), and that values are read-only.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually mirrors every Symbol literal as a property key. Record<Symbol, number> would eliminate the duplication and automatically stay in sync if the Symbol union grows. [L8-L12] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable. getReelWeights() and getReelSymbols() return direct internal array references, so callers can silently mutate module state. The reference docs explicitly state weights are read-only at runtime. [L3-L26] |
| 8 | ESLint compliance | WARN | HIGH | import type { Symbol } shadows the global Symbol built-in. @typescript-eslint/no-shadow flags type-only imports. Rename to SlotSymbol or GameSymbol in types.ts to avoid collision. [L1] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. spinReel in particular needs documentation of the valid reelIndex range (0–4) and its return shape. [L42-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights perform no bounds check on reelIndex. An out-of-range index yields undefined weights, causing weights.reduce() to throw TypeError at runtime. A guard or assertion would make the failure site explicit. [L42-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain unambiguously inferred from symbol vocabulary (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER), spinReel, and sibling files jackpot.ts/freespin.ts/paytable.ts. Math.random() is a non-seeded PRNG that is not certifiable for regulated gaming RNG requirements (GLI-11, BMM, etc.). The project already contains src/rng.ts, which is not imported here. pickFromWeighted must consume a certified RNG, not Math.random(). [L34] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted calls Math.random() directly, making deterministic unit testing impossible without monkey-patching. An injectable rng parameter (defaulting to Math.random) would allow seeded tests. [L30-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use satisfies ReelWeightConfig to validate shape while preserving the literal type. SYMBOLS would benefit from as const to narrow to a readonly tuple of string literals. [L3-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | For a game-engine utility, getReelWeights and getReelSymbols expose mutable internal arrays. Callers can corrupt game state by writing into the returned references. Return readonly views (ReadonlyArray<number> / ReadonlyArray<Symbol>) or spread copies. [L52-L58] |

### Suggestions

- Replace manual ReelWeightConfig with Record utility type
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<SlotSymbol, number>;
  ```
- Mark SYMBOLS and DEFAULT_WEIGHTS as readonly/const-asserted
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = ["CHERRY", ...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { CHERRY: 25, ... };
  // After
  const SYMBOLS = ["CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER"] as const;
  const DEFAULT_WEIGHTS = { CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10, SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5 } satisfies ReelWeightConfig;
  ```
- Inject RNG into pickFromWeighted instead of calling Math.random() directly
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import { nextRandom } from "./rng.js";
  
  function pickFromWeighted(items: SlotSymbol[], wts: number[], rng: () => number = nextRandom): SlotSymbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Return readonly views from getReelWeights and getReelSymbols
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  export function getReelSymbols(): Symbol[] {
    return SYMBOLS;
  }
  // After
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}`);
    return REEL_WEIGHTS[reelIndex];
  }
  export function getReelSymbols(): ReadonlyArray<SlotSymbol> {
    return SYMBOLS;
  }
  ```
- Add JSDoc to exported functions
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spins a single reel and returns a column of 3 symbols.
   * @param reelIndex - Reel index in range [0, 4].
   * @returns Array of 3 symbols drawn from the weighted distribution.
   */
  export function spinReel(reelIndex: number): SlotSymbol[] {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with a certifiable CSPRNG (e.g., crypto.getRandomValues) to meet regulated gaming RNG certification requirements. [L33]

### Refactors

- **[correction · high · large]** Significantly reduce DIAMOND weight from 30. At weight 30 (p=0.25), DIAMOND alone contributes 2.295× per-line bet in expected value (229.5%), making overall RTP >> 100% and incompatible with the arbitrated 95% target. Backward derivation: weight must be ≤ 24 (p ≤ 0.20) for DIAMOND to stay below 100% EV by itself; typical premium-symbol contribution in a 95% RTP game suggests weight in the 14–20 range, validated against full engine simulation. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
