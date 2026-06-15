# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 92% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 90% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 75% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 92% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 75% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Used locally in pickFromWeighted call at line 36 within spinReel function
- **Duplication [UNIQUE]**: Simple array constant with no similar definitions found
- **Correction [OK]**: Eight symbols in correct insertion order; matches ReelWeightConfig keys and weightsToArray output order exactly.
- **Overengineering [LEAN]**: Simple ordered symbol registry used as both iteration target and weighted-pick input.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant with no comment describing its role as the canonical ordered symbol list used for reel weight indexing.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Used locally in REEL_WEIGHTS initialization (lines 23-27), called 5 times
- **Duplication [UNIQUE]**: Specific weight configuration constant with no similar definitions
- **Correction [NEEDS_FIX]**: DIAMOND weight of 30 causes 5-DIAMOND alone to return ~97.7% of total bet, blowing the 95% RTP target before any other symbol pays.
- **Overengineering [LEAN]**: Plain data literal; named fields aid readability. Any complexity is in the type it uses, not here.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Numeric weight values carry non-obvious probability semantics (e.g., DIAMOND=30 is the highest weight); a comment explaining the total and per-symbol probability would be valuable. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug. DEFAULT_WEIGHTS (reels.ts:12-15) sums to 120 — valid relative weights. All values are positive integers, structure matches SYMBOLS array (reels.ts:3-5), used correctly at lines 23-27 via weightsToArray. DIAMOND having the highest weight (30) is a game design decision, not a bug. The mutability concern (no `as const`, getReelWeights returns mutable reference) is a best_practices issue, not a correction issue. Changing these values would alter game RTP — a behavioral change with no evidence it's needed.)

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Used locally in spinReel (line 44) and getReelWeights (line 57)
- **Duplication [UNIQUE]**: Derived constant array initialized from weightsToArray calls
- **Correction [OK]**: Five reels correctly initialized via weightsToArray; structural correctness is independent of the weight values.
- **Overengineering [ACCEPTABLE]**: Five explicit identical rows is slightly verbose but preserves the option for per-reel weight divergence without structural changes.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not obvious that all 5 reels share identical weight distributions; a comment would clarify this design choice.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel function (line 36) to select weighted symbols
- **Duplication [DUPLICATE]**: Identical weighted random selection logic to weightedPick; same accumulation pattern, same fallback, same mathematical behavior
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG for regulated gaming.
- **Overengineering [LEAN]**: Standard O(n) weighted random selection; concise and correct.
- **Tests [NONE]**: No test file exists. This function uses Math.random and has boundary logic (last-element fallback) that warrants dedicated edge-case tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported helper implementing a weighted random selection algorithm. The algorithm logic (cumulative sum scan) is non-trivial enough to warrant at least a brief description, but leniency applies as it is internal. (deliberated: reclassified: correction: NEEDS_FIX → OK — No correctness bug. pickFromWeighted (reels.ts:30-41) correctly implements cumulative-weight selection: accumulates weights via reduce (line 31), draws uniform random (line 32), iterates to find selection (lines 33-38), returns last item as fallback (line 40). It IS algorithmically identical to weightedPick in rng.ts:5-16, but duplication is a duplication-axis concern, not a correction-axis concern. The function produces correct weighted random output. It's the actual RNG used in the live spin path (called at reels.ts:47 via spinReel, which is called by factories.ts:12).)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both implement weighted random selection via accumulation with Math.random(), variable naming differs (total/totalWeight, r/roll, acc/cumulative), weightedPick is generic while this is Symbol-specific, but functions are interchangeable

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Reel-spinning logic using pickFromWeighted, no similar functions found
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; invalid index causes TypeError inside pickFromWeighted.
- **Overengineering [LEAN]**: Straightforward: looks up weight row, samples 3 cells, returns column.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts — a critical caller — yet fully untested including out-of-bounds reelIndex behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), explanation that the returned array contains 3 symbols (one per row), and the independence of each pick.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning constant array
- **Correction [OK]**: Returns SYMBOLS reference; no correctness issue given no documented read-only contract on the symbols array.
- **Overengineering [LEAN]**: Minimal accessor exposing the symbol registry.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of return value as the ordered symbol list used for weight-index alignment.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning indexed array element
- **Correction [NEEDS_FIX]**: Out-of-range reelIndex returns undefined typed as number[], silently propagating a bad value to callers.
- **Overengineering [LEAN]**: Minimal accessor; matches documented API contract.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSymbols(), and that it is read-only at runtime.

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually repeats all 8 symbol keys. Record<Symbol, number> is more idiomatic and stays in sync with the Symbol union automatically. [L7-L11] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable. getReelWeights() and getReelSymbols() return direct internal references, allowing callers to mutate engine state at runtime. [L3-L28] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spinReel, getReelSymbols, and getReelWeights are exported with no JSDoc comments. [L43-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights do not validate reelIndex. REEL_WEIGHTS has 5 entries (indices 0–4); an out-of-bounds index returns undefined, crashing pickFromWeighted at runtime with a TypeError on wts.reduce. [L43-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/SCATTER/WILD/SEVEN/DIAMOND vocabulary and paytable documentation. Math.random() is a non-cryptographic PRNG seeded by the runtime and is not certifiable for regulated gaming RNG. The project already contains src/rng.ts — pickFromWeighted must consume a seeded, auditable RNG, not Math.random(). Using Math.random() for symbol selection in a monetary gambling engine is a compliance-level security violation. [L33] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted hard-wires Math.random(), making deterministic unit tests impossible without monkey-patching. src/rng.ts exists in the project; passing an rng parameter would enable full dependency injection. [L31-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use the satisfies operator for compile-time shape validation while preserving literal types. [L13-L16] |
| 17 | Context-adapted rules | FAIL | MEDIUM | getReelWeights and getReelSymbols expose direct mutable references to internal engine arrays. In a gambling engine, external mutation of symbol weights or reel definitions is a game-integrity violation. Both must return ReadonlyArray views. [L53-L58] |

### Suggestions

- Replace ReelWeightConfig interface with Record<Symbol, number> to avoid manual sync with the Symbol union
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark all module-level constants as readonly and use satisfies for DEFAULT_WEIGHTS
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = {...};
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS: readonly Symbol[] = [...];
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } as const satisfies ReelWeightConfig;
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...]
  ```
- Inject the RNG to satisfy testability and regulated-gaming compliance
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
- Return ReadonlyArray from public accessors and add bounds-check to prevent silent undefined
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
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range [0, ${REEL_WEIGHTS.length - 1}]`);
    }
    return REEL_WEIGHTS[reelIndex];
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add bounds guard in spinReel: throw RangeError (or clamp) when reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length. [L44]
- **[correction · medium · small]** Add bounds guard in getReelWeights and return a shallow copy (spread or slice) to prevent silent undefined propagation and enforce the documented read-only contract. [L57]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight from 30 to approximately 3–5; current value causes 5-DIAMOND combinations alone to return ~97.7% of total bet, violating the 95% RTP target. [L14]
- **[correction · high · large]** Replace Math.random() with crypto.getRandomValues() or equivalent certifiable CSPRNG to satisfy regulated gaming RNG requirements. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
