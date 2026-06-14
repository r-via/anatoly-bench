# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 90% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls (L38, L40) and returned by getReelSymbols (L53).
- **Duplication [UNIQUE]**: No similar constant found in provided context.
- **Correction [OK]**: 8-element constant in correct order matching weightsToArray mapping.
- **Overengineering [LEAN]**: Simple literal array of all symbol names. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported, but purpose (master symbol list) and its role as the source-of-truth for reel picks is non-obvious without a comment.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS (L12) and parameter cfg in weightsToArray (L17).
- **Duplication [UNIQUE]**: No similar interface found in provided context.
- **Correction [OK]**: Interface covers all 8 symbols with numeric weight fields; structurally sound.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests needed.
- **DOCUMENTED [DOCUMENTED]**: All fields are symbol names mapped to numeric weights — fully self-descriptive. No additional JSDoc needed.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27).
- **Duplication [UNIQUE]**: No similar constant found in provided context.
- **Correction [NEEDS_FIX]**: DIAMOND weight=30 makes DIAMOND combinations alone contribute ~229% expected payout per bet, making total RTP far exceed the arbitrated 95% target.
- **Overengineering [ACCEPTABLE]**: Named fields (CHERRY: 25, …) genuinely improve readability over a raw number array. The over-engineering lives in ReelWeightConfig, not in this constant.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The fact that all five reels share these same weights, and that the total sums to 120, is non-obvious and undocumented. (deliberated: reclassified: correction: NEEDS_FIX → OK — Weights at reels.ts:12-15 are structurally valid: all positive integers summing to 120. pickFromWeighted (reels.ts:31) normalizes by total, so any positive sum works correctly. DIAMOND at 30 is the highest weight AND highest paytable payout (paytable.ts:11: [50,250,1000]), which is unusual game design but not a code defect — the weightsToArray function (reels.ts:17-20) correctly maps all 8 symbol weights, and REEL_WEIGHTS (reels.ts:22-28) correctly initializes all 5 reels. No structural or computational error exists.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to populate REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar function found per RAG results.
- **Correction [OK]**: Output order matches SYMBOLS array; correct mapping.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Edge cases like zero weights or mismatched config are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, <10 lines, name is clear. Tolerable absence per internal-helper rule.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constant found in provided context.
- **Correction [OK]**: Five reels with identical weights matches documentation; root weight defect is in DEFAULT_WEIGHTS.
- **Overengineering [OVER]**: Five identical calls to weightsToArray(DEFAULT_WEIGHTS) implies future per-reel variation that doesn't exist. All reels share the same weights; Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS)) or a single shared reference would be cleaner and honest about current intent.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The structure (5 reels × weight-array) and the constraint that indices 0–4 map to specific reels is undocumented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel (L47) to sample a symbol from weighted distribution.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: same reduce-sum, same Math.random() * total roll, same cumulative accumulation loop, same fallback to last element. Only differences are variable names and that this version hardcodes Symbol[] instead of using a generic type parameter — behavior is fully interchangeable.
- **Correction [NEEDS_FIX]**: Uses Math.random() which is not certifiable for regulated gaming RNG. Slot-machine domain inferred from reel/payline/jackpot/RTP/WILD/SCATTER/free-spin vocabulary throughout the project; industry convention requires a CSPRNG or provably-fair RNG for certified gaming.
- **Overengineering [LEAN]**: Standard weighted-random algorithm, cleanly generic (items + weights) without unnecessary indirection.
- **Tests [NONE]**: No test file. Core probabilistic logic — boundary conditions (r exactly at boundary, zero total weight, single item) and distribution correctness are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, but 11 lines of non-trivial weighted-random logic. Missing docs on parameter contracts (items and wts must be same length) and the fallback return on rounding edge cases. (deliberated: reclassified: correction: NEEDS_FIX → OK — reels.ts:30-41 is algorithmically identical to rng.ts:5-16 (same cumulative-weight loop, same fallback to last element). Duplication is real. However, both implementations are individually correct — each produces valid weighted random samples. The finding is misclassified on the correction axis: the function does not produce wrong output, crash, or corrupt data. This is a duplication/refactoring concern, not a correctness bug.)

> **Duplicate of** `src/rng.ts:weightedPick` — ~98% identical logic — both compute weighted random selection via cumulative sum loop; pickFromWeighted is a non-generic, Symbol-typed copy of the generic weightedPick

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar function found per RAG results.
- **Correction [OK]**: Draws 3 independent symbols per reel column via weighted selection; logic is correct.
- **Overengineering [LEAN]**: Single responsibility: build a 3-row column for one reel index. Minimal and direct.
- **Tests [NONE]**: No test file. Imported by src/factories.ts; invalid reelIndex (out of bounds) and return shape (3-element column) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), that it returns exactly 3 symbols (one per visible row), and that sampling is independent per cell.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns the symbols constant; correct per documented contract.
- **Overengineering [LEAN]**: Trivial accessor; exposes module-private constant to callers.
- **Tests [NONE]**: No test file. Used by src/engine.ts; identity and immutability of returned array are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. Name is clear but the return value's role (canonical ordered list used for weight-index alignment) is undocumented.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns weight array for given reel index; correct per documented contract.
- **Overengineering [LEAN]**: Trivial indexed accessor matching the documented API contract.
- **Tests [NONE]**: No test file. Used by src/engine.ts; out-of-bounds reelIndex and correct weight values per reel are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSymbols(), and that it is read-only at runtime.

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates the same eight symbol keys already present in the Symbol union. Record<Symbol, number> is the idiomatic replacement and stays in sync automatically. [L6-L10] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable at runtime. getReelWeights() returns the live inner array of REEL_WEIGHTS — callers can mutate reel odds directly. getReelSymbols() returns the live SYMBOLS array. Both should return ReadonlyArray. [L3,L12,L22,L55,L59] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. At minimum, spinReel's reelIndex range (0–4) and return shape (3-element column) should be documented. [L43,L52,L56] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel does not guard reelIndex bounds. REEL_WEIGHTS[reelIndex] returns undefined for any value outside 0–4, causing pickFromWeighted to crash on wts.reduce at runtime with no diagnostic. A guard or type narrowing would prevent silent corruption. [L44-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed from symbol vocabulary (CHERRY/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER), paytable, free-spin, jackpot, and RTP 95% references in docs. Math.random() is a non-cryptographic PRNG seeded by the JS engine; it is not certifiable for regulated gaming RNG. The project already contains src/rng.ts (visible in project structure), indicating an intentional RNG abstraction that this file bypasses entirely. All randomness in gaming-critical paths must route through the certified RNG module. [L33] |
| 14 | Performance | WARN | MEDIUM | pickFromWeighted recomputes wts.reduce total on every call. Total is constant (120) per reel; it should be precomputed once per reel config rather than recalculated three times per spin. [L31] |
| 15 | Testability | WARN | MEDIUM | Math.random() is hardcoded inside pickFromWeighted, making spinReel non-deterministic in unit tests without global mocking. src/rng.ts already exists as an RNG abstraction; passing an rng parameter (or the rng module) into spinReel/pickFromWeighted would enable seeded, reproducible tests. [L30-L40] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use satisfies ReelWeightConfig to catch typos at the assignment site while preserving the literal type. REEL_WEIGHTS could use a const assertion. Neither is blocking, but both are idiomatic TS 5.x improvements. [L12-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights returns a direct reference to the live inner array of REEL_WEIGHTS. In a casino context, external odds mutation (e.g. getReelWeights(0)[6] = 0 to suppress WILDs) is a game-integrity risk. Return a shallow copy or ReadonlyArray<number> slice. [L56-L58] |

### Suggestions

- Replace manual ReelWeightConfig interface with Record utility type keyed on the Symbol union
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants readonly and return defensive copies from exported accessors
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
  const REEL_WEIGHTS: number[][] = [...];
  
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  export function getReelSymbols(): Symbol[] {
    return SYMBOLS;
  }
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  const DEFAULT_WEIGHTS = {...} satisfies ReelWeightConfig;
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  
  export function getReelWeights(reelIndex: number): ReadonlyArray<number> {
    return REEL_WEIGHTS[reelIndex];
  }
  export function getReelSymbols(): ReadonlyArray<Symbol> {
    return SYMBOLS;
  }
  ```
- Inject an RNG function to enable deterministic testing and route through the certified src/rng.ts module
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Add reelIndex bounds guard to spinReel
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
- Precompute weight totals to avoid recalculating on every pickFromWeighted call
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
  // After
  const REEL_TOTALS: readonly number[] = REEL_WEIGHTS.map(w => w.reduce((s, v) => s + v, 0));
  
  function pickFromWeighted(items: Symbol[], wts: number[], total: number): Symbol {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a certifiable CSPRNG (e.g. crypto.getRandomValues via Node.js crypto module) to comply with regulated gaming RNG requirements. Math.random() is non-deterministically seedable and not auditable for gaming certification. [L32]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to ≤12 (target ≈8) to bring total RTP within the arbitrated 95% ceiling. At weight=30, DIAMOND combinations alone return ~229% of each bet across 10 paylines; a weight of ~8–10 constrains DIAMOND's share to ≈8–15%, leaving budget for other symbols to sum near 95%. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
