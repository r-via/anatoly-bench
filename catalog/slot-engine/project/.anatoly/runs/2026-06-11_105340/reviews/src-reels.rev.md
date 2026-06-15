# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 88% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls (L37, L40) and returned by getReelSymbols (L53).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Eight-symbol array order is consistent with weightsToArray and documented symbol set.
- **Overengineering [LEAN]**: Simple string-literal array; straightforward constant.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose is inferable from name but no comment explains its role as the canonical ordered symbol list used for reel indexing.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as parameter type in weightsToArray (L17) and as type annotation for DEFAULT_WEIGHTS (L12).
- **Duplication [UNIQUE]**: No similar interfaces found in RAG results.
- **Correction [OK]**: Interface fields map one-to-one to all eight symbols; no structural issue.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests required.
- **DOCUMENTED [DOCUMENTED]**: Self-descriptive interface: all fields are symbol names typed as number, name clearly conveys weight configuration. No complex semantics hidden.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Weights sum to 120 and match the documented distribution exactly.
- **Overengineering [ACCEPTABLE]**: Named fields improve readability over a bare array, but the value is only consumed by weightsToArray which discards the names. Slightly over-specified given the pattern, but the documentation benefit is real.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Weight values (e.g. DIAMOND: 30 as highest) and the total-sum baseline are non-obvious and undocumented.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to build REEL_WEIGHTS (L23–L27).
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Emission order [CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER] matches SYMBOLS array order; correctly parallel.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal non-exported helper, <10 lines, name describes behavior. Tolerated per private-helper leniency rule.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constants found in RAG results.
- **Correction [OK]**: Five reels, each initialized from DEFAULT_WEIGHTS; consistent with all five reels sharing the same distribution per docs.
- **Overengineering [ACCEPTABLE]**: Five separate identical arrays allow future per-reel differentiation. Docs confirm all reels share the same weights with no runtime setter, so this is mildly redundant now, but the structure is a one-time declaration and not harmful.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 5-reel structure and the fact that all reels share identical weights are non-obvious without a comment.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel loop (L47).
- **Duplication [DUPLICATE]**: Identical weighted-random-selection algorithm: sum weights, roll Math.random() * total, accumulate until roll < cumulative, return last item as fallback. Only differences are variable names and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol — no behavioral distinction.
- **Correction [NEEDS_FIX]**: Math.random() is non-certifiable for regulated gaming RNG in this slot-machine context.
- **Overengineering [LEAN]**: Standard O(n) weighted random pick; minimal and correct for the task.
- **Tests [NONE]**: No test file exists. This function has critical edge cases worth testing: total=0, single-item array, boundary rounding, and uniform vs skewed weight distributions.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper. Name and signature are clear, but the weighted-random algorithm and edge-case fallback (last item) are undocumented. Slightly over 10 lines; minor concern. (deliberated: reclassified: correction: NEEDS_FIX → OK — False positive. pickFromWeighted (reels.ts:30-41) is algorithmically correct: cumulative-weight sampling with proper fallback at L40. The NEEDS_FIX was based solely on duplication with weightedPick in rng.ts — but duplication is not a correction defect. The function produces correct weighted random selections. The original review itself acknowledged this at src-reels.rev.md: 'Correction [OK]: Correctly iterates 3 rows and delegates to pickFromWeighted with the correct SYMBOLS and per-reel weights.' Duplication belongs on the duplication axis, not correction.)

> **Duplicate of** `src/rng.ts:weightedPick` — ~95% identical logic — same weighted pick algorithm, same loop structure, same fallback; generic T vs Symbol[] is the only meaningful difference

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly iterates 3 rows and delegates to pickFromWeighted with the correct SYMBOLS and per-reel weights.
- **Overengineering [LEAN]**: Straightforward loop producing a 3-row column from weighted picks.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts; untested stochastic behavior and out-of-bounds reelIndex access into REEL_WEIGHTS are unverified.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc describing the reelIndex range (0–4), return shape (3-element column), or behavior when reelIndex is out of bounds.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG results.
- **Correction [OK]**: Simple accessor; no correctness defect.
- **Overengineering [LEAN]**: Minimal accessor; appropriate for encapsulating the module constant.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc; does not document that the returned array is the ordered canonical list used for weight indexing.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; no similar functions found per RAG results.
- **Correction [OK]**: Returns the weight array for the given reel index; no correctness defect.
- **Overengineering [LEAN]**: Minimal accessor; documented in API reference as the intended read-only interface.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc describing the reelIndex range, return value semantics (parallel to getReelSymbols), or read-only nature of the array.

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually repeats all 8 symbol fields. Record<Symbol, number> expresses the same constraint with less boilerplate and stays in sync if Symbol union expands. [L8-L12] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all declared without readonly modifiers. getReelWeights returns a direct reference to the mutable inner array, allowing callers to silently mutate weights (contradicts documented read-only guarantee). getReelSymbols returns the mutable SYMBOLS reference. [L3-L26] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are exported with no JSDoc. At minimum spinReel should document the reelIndex domain (0–4) and the returned column semantics. [L43-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights perform no bounds check on reelIndex. REEL_WEIGHTS[outOfRange] returns undefined; weightsToArray downstream would produce a column of the last symbol silently rather than throwing. The valid range (0–4) is documented externally but not guarded here. [L43-L53] |
| 13 | Security | FAIL | CRITICAL | Slot-machine / regulated gaming domain inferred from reel/payline/WILD/SCATTER/jackpot vocabulary throughout the project. Math.random() (line 33) is a non-cryptographic, seedable PRNG that is not certifiable for regulated gaming RNG under GLI-11 / BMM / eCOGRA standards. The project already contains src/rng.ts — the dedicated RNG module — which should be injected here instead. Using Math.random() for symbol selection in a regulated slot engine is a compliance-critical violation. [L33] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted hard-codes Math.random(), making deterministic unit testing impossible without monkey-patching globals. Accepting an rng parameter (e.g. () => number) would allow pure, reproducible tests. [L29-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | SYMBOLS and DEFAULT_WEIGHTS could use `satisfies` to validate shape while preserving literal types. REEL_WEIGHTS could use `as const satisfies` for full immutability and literal narrowing. [L3-L26] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelSymbols() and getReelWeights() return direct mutable references to module-level arrays. In a gaming engine where results must be reproducible and auditable, exposing live internal state risks silent drift. Both should return defensive copies or typed ReadonlyArray views. [L54-L57] |

### Suggestions

- Replace Math.random() with the project's dedicated RNG module to satisfy regulated gaming requirements
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
- Use Record<Symbol, number> for ReelWeightConfig to eliminate manual field repetition
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Add readonly modifiers to all module-level constants and return copies from getters
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
  const REEL_WEIGHTS: number[][] = [...];
  
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = {...};
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...];
  
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    }
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Add bounds guard to spinReel
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

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with crypto.getRandomValues (or a seeded, auditable CSPRNG) to satisfy regulated gaming RNG certification requirements. Math.random() is non-reproducible and non-auditable. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
