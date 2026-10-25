# Review: `src/reels.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 88% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 88% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by pickFromWeighted (via spinReel) and directly returned by getReelSymbols, both exported and consumed downstream.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Array of 8 symbols is correctly ordered and consistent with how it is indexed throughout the file.
- **Overengineering [LEAN]**: Simple typed array of enum-like strings. Appropriate for its use as the canonical symbol list.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Annotates DEFAULT_WEIGHTS and the cfg parameter of weightsToArray; removing it breaks compilation.
- **Duplication [UNIQUE]**: No similar type definition found in the codebase.
- **Correction [OK]**: Interface fields match SYMBOLS ordering; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times when building REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Weights sum to 120 and map consistently to SYMBOLS order. DIAMOND's weight (30) is anomalously high compared to other premium symbols (SEVEN: 5, WILD: 5, SCATTER: 5) and warrants paytable verification, but no paytable constants are present in this file, so rule-12 numerical self-validation cannot be completed — abstaining per rules 12 and 16.
- **Overengineering [LEAN]**: Readable constant declaration. Value is straightforward; named fields are the only benefit of the ReelWeightConfig type.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to populate REEL_WEIGHTS rows from DEFAULT_WEIGHTS.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Field extraction order matches SYMBOLS array order exactly; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed by spinReel and getReelWeights, both of which have live consumers.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Five reels each assigned the same DEFAULT_WEIGHTS array; indexing is consistent with spinReel's 0–4 access pattern.
- **Overengineering [ACCEPTABLE]**: Five identical weightsToArray(DEFAULT_WEIGHTS) calls could be Array(5).fill(...), but the explicit listing makes per-reel tuning obvious. Minor verbosity, not harmful.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Core weighted-random selection logic called inside spinReel's row loop.
- **Duplication [DUPLICATE]**: Logic is functionally identical to weightedPick in src/rng.ts: both reduce weights to total, multiply Math.random() by total, accumulate in a loop with early return, and fall back to last item. The only differences are variable names (r vs roll, acc vs cumulative) and that weightedPick is generic (T) while pickFromWeighted is Symbol-specific. These are interchangeable — pickFromWeighted could be replaced by a call to weightedPick<Symbol>.
- **Correction [OK]**: Standard weighted-random algorithm is correct: r ∈ [0, total), cumulative accumulator guarantees a match before or at the last item, fallback is unreachable for positive weights but harmless.
- **Overengineering [LEAN]**: Standard weighted-random implementation. Correct, minimal, single-purpose.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both implement weighted random selection with identical algorithm structure, differing only in generic type parameter and local variable names

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Correctly generates 3 independent symbol picks per reel using the reel's weight vector.
- **Overengineering [LEAN]**: Simple loop over 3 rows delegating to pickFromWeighted. No unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and called inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns the module-level SYMBOLS reference; no correctness defect.
- **Overengineering [LEAN]**: Trivial accessor. Justified by the consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and called inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns the weight array for the given reel index; no correctness defect.
- **Overengineering [LEAN]**: Trivial accessor. Justified by the consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually lists all 8 `Symbol` keys. `Record<Symbol, number>` would DRY this up and stay in sync automatically. |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are module-level constants but lack `readonly` / `as const`. `getReelWeights` also returns a direct reference to the internal mutable array, allowing callers to corrupt reel state. |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. Three or more undocumented public exports triggers a FAIL. [L45-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/symbol/CHERRY/SEVEN/WILD/SCATTER/jackpot vocabulary in project. `Math.random()` is not a cryptographically secure or certifiable PRNG for regulated gaming RNG. The project already contains `src/rng.ts`, indicating a dedicated RNG module exists but is bypassed here in favor of `Math.random()` directly inside `pickFromWeighted`. [L35] |
| 15 | Testability | FAIL | MEDIUM | `Math.random()` is hard-wired inside `pickFromWeighted` with no RNG injection point. `spinReel` is non-deterministic; there is no pure core, no factory overload, and no seam for supplying a seeded or mock RNG in tests. `src/rng.ts` exists in the project but is ignored here. [L33-L42] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS satisfies ReelWeightConfig` would validate the literal against the interface without widening the type. `SYMBOLS` and `REEL_WEIGHTS` could benefit from `as const satisfies` for immutable inference. |
| 17 | Context-adapted rules | WARN | MEDIUM | `spinReel` and `getReelWeights` perform no bounds check on `reelIndex`: an out-of-range index returns `undefined` for `weights`, causing `pickFromWeighted` to silently loop over `undefined[i]` and always return the last symbol, skewing RNG output undetected. |

### Suggestions

- Inject an RNG function to make `spinReel` deterministic and testable, and use the project's `src/rng.ts` instead of `Math.random()`.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number = Math.random): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Replace the bespoke `ReelWeightConfig` interface with `Record<Symbol, number>` to stay DRY with the `Symbol` union.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants as `readonly` / `as const` and return a copy from `getReelWeights` to prevent external mutation.
  ```typescript
  // Before
  const REEL_WEIGHTS: number[][] = [ ... ];
  
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [ ... ];
  
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
    }
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Add JSDoc to all three exported functions.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spins a single reel column and returns 3 symbols sampled from the weighted distribution.
   * @param reelIndex - Zero-based index of the reel (0–4).
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
