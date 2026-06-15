# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 85% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 87% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 78% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted call within spinReel (L45)
- **Duplication [UNIQUE]**: Constant symbol array. No similar definitions found.
- **Correction [OK]**: Eight-element array order matches ReelWeightConfig fields and weightsToArray mapping.
- **Overengineering [LEAN]**: Simple typed array of the 8 distinct symbols. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. SYMBOLS drives all reel outcomes; no coverage of its contents or ordering.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master symbol list used for reel picks) is not obvious from name alone.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times in REEL_WEIGHTS initialization (L25-L29)
- **Duplication [UNIQUE]**: Constant weight configuration. No similar definitions found.
- **Correction [NEEDS_FIX]**: DIAMOND carries the single highest weight (30 of 120 total → 25% per cell), higher than low-value symbols CHERRY/LEMON (25 each); contradicts slot-machine design conventions and likely violates the documented 95% RTP target.
- **Overengineering [LEAN]**: Straightforward named configuration object. The named fields are the most readable way to express per-symbol probabilities.
- **Tests [NONE]**: No test file. Weight values directly affect payout math; sum, individual values, and proportions are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Lacks explanation of what the weight values mean (relative probability units) or that they apply to all five reels by default. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. reels.ts:12-15 defines weights summing to 120 (25+25+15+10+5+30+5+5). DIAMOND at 30 is the highest weight, which the automated review flagged as suspicious for a 'premium' symbol. However, without the paytable multipliers (getPayMultiplier in src/paytable.ts), a high frequency + low payout design is a valid slot mechanic. The code works correctly: weights are positive, sum is valid, weightsToArray at L17-19 correctly extracts them in SYMBOLS order (L3-5). No crash, no data corruption, no incorrect probability math. This is a game design choice, not a code defect. Reclassified to OK.)

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel (L44) and exported getReelWeights (L57)
- **Duplication [UNIQUE]**: Constant array of weight arrays. No similar definitions found.
- **Correction [OK]**: Five independent weight arrays created correctly; inherits the DIAMOND weight defect from DEFAULT_WEIGHTS but has no independent structural bug.
- **Overengineering [ACCEPTABLE]**: Five identical calls to `weightsToArray(DEFAULT_WEIGHTS)` is verbose; `Array.from({length: 5}, () => weightsToArray(DEFAULT_WEIGHTS))` would be cleaner. The explicit listing may anticipate future per-reel weight differentiation, which justifies it marginally.
- **Tests [NONE]**: No test file. Five-reel structure and uniform weight application are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The fact that all five reels share identical weights and that index maps to reel column is not documented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel loop to generate weighted random symbols (L45)
- **Duplication [DUPLICATE]**: Identical weighted selection algorithm to weightedPick in src/rng.ts. Both compute total weight, generate random value, iterate with cumulative check, and return last item as fallback.
- **Correction [NEEDS_FIX]**: Uses Math.random() — not a certifiable PRNG for regulated gaming.
- **Overengineering [LEAN]**: Canonical O(n) weighted-random-selection. Correctly handles floating-point edge cases with the fallback return. No unnecessary complexity.
- **Tests [NONE]**: No test file. Critical weighted-random logic — boundary at r===acc, total=0 edge case, and last-item fallback are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Core weighted-random selection algorithm with no description of parameters, return value, or edge-case behavior (fallback to last item). (deliberated: reclassified: correction: NEEDS_FIX → OK — The function at reels.ts:30-41 is algorithmically correct: sums weights (L31), draws Math.random()*total (L32), accumulates with < comparison (L35-36), returns last item as fallback (L40). The finding's NEEDS_FIX is based on duplication with weightedPick in rng.ts:5-16 — confirmed identical algorithm — but duplication is not a correctness defect. The function produces correct weighted random selections. The duplication concern belongs on a duplication axis, not correction. Reclassified correction to OK.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical implementation — same cumulative weight-based selection logic and control flow

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported, runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; out-of-range value yields undefined weights, causing a TypeError crash inside pickFromWeighted.
- **Overengineering [LEAN]**: Minimal: looks up the reel's weight row, samples 3 rows, returns the column. Straightforward.
- **Tests [NONE]**: No test file. Imported by src/factories.ts making it a critical path; 3-row column length, valid symbol membership, and out-of-range reelIndex are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: what reelIndex range is valid, that it returns 3 symbols (one per row), and that results are independently sampled.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function. No duplicates found.
- **Correction [NEEDS_FIX]**: Returns a mutable reference to the module-internal SYMBOLS array; callers can corrupt the shared symbol pool used by spinReel.
- **Overengineering [LEAN]**: Simple accessor exposing the symbol list to consumers without re-exporting the mutable constant directly.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; return identity and length are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No description of what the returned array represents or its ordering significance.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial accessor function. No duplicates found.
- **Correction [NEEDS_FIX]**: No bounds check returns undefined typed as number[] for out-of-range reelIndex; also exposes mutable internal weight array allowing callers to corrupt REEL_WEIGHTS in place.
- **Overengineering [LEAN]**: Simple accessor for per-reel weight arrays; useful for testing and display.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; undefined return for invalid reelIndex and correct weight array identity are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex, what the returned numbers represent (unnormalized weights), and their correspondence to getReelSymbols() ordering.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all Symbol members. Record<Symbol, number> would enforce exhaustiveness and stay in sync if the Symbol union changes. [L7-L10] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS lack readonly/as const. getReelSymbols() and getReelWeights() return live array references — callers can mutate internal module state. [L3-L28] |
| 8 | ESLint compliance | WARN | HIGH | import type { Symbol } shadows the built-in JavaScript Symbol global. @typescript-eslint/no-shadow would flag this. Rename the local type (e.g. SlotSymbol or ReelSymbol) to eliminate the collision. [L1] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. spinReel at minimum needs @param reelIndex and @returns documentation. [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel performs no bounds check on reelIndex. REEL_WEIGHTS[reelIndex] returns undefined for indices >= 5 or < 0, causing wts.reduce() to throw a runtime TypeError. A RangeError guard is needed. [L43-L50] |
| 13 | Security | FAIL | CRITICAL | Slot-machine gambling domain confirmed by reel symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, WILD, SCATTER) and README (jackpot, free spins, 95% RTP target). Math.random() is not cryptographically secure and is not certifiable for regulated gaming RNG. The project already has rng.ts which must be the sole RNG entry point. Additionally, getReelWeights() returns the raw internal array reference — any module can call getReelWeights(0).push(999) to silently skew payout distributions, a game-integrity breach. [L32] |
| 15 | Testability | FAIL | MEDIUM | pickFromWeighted calls Math.random() directly with no injection point. Deterministic unit tests require monkey-patching. An rng: () => number parameter would solve both testability and the rule-13 compliance issue. [L30-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS could use as const for literal-type inference. DEFAULT_WEIGHTS satisfies ReelWeightConfig would validate shape at compile time without widening the inferred type. [L3-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | In a casino slot context, getReelWeights() and getReelSymbols() expose live internal arrays. Return ReadonlyArray or shallow copies to enforce outcome integrity as a module-level invariant. [L52-L58] |

### Suggestions

- Replace ReelWeightConfig interface with Record<Symbol, number> for automatic exhaustiveness
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Apply readonly and as const to module-level constants
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
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... } as const;
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];
  ```
- Inject RNG dependency into pickFromWeighted to eliminate Math.random() and enable deterministic tests
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(
    items: readonly Symbol[],
    wts: readonly number[],
    rng: () => number,
  ): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Guard spinReel against out-of-bounds reelIndex
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length})`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Return readonly references from getters to protect internal state
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

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() with a certifiable PRNG (e.g. crypto.getRandomValues() seeded buffer, or a tested MT19937 implementation) to meet regulated gaming RNG requirements. [L32]
- **[correction · medium · small]** Add a bounds guard in spinReel: throw RangeError (or return []) when reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length to prevent TypeError crash. [L44]
- **[correction · medium · small]** Return a shallow copy in getReelSymbols (return [...SYMBOLS]) to prevent external mutation of the shared symbol pool. [L53]
- **[correction · medium · small]** Add bounds guard and return a copy in getReelWeights (e.g. return [...REEL_WEIGHTS[reelIndex]]) to prevent undefined returns and in-place mutation of internal weight state. [L57]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight to a low single-digit value (e.g. 3–5). At weight 30 of 120 total (25% per cell), DIAMOND appears more often than any other symbol including low-value commons, contradicting slot-machine probability conventions and the documented 95% RTP target. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
