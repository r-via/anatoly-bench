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
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 88% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Non-exported constant used locally in pickFromWeighted (L38) and spinReel (L47)
- **Duplication [UNIQUE]**: Data constant with no similar symbols found
- **Correction [OK]**: Eight distinct symbol literals; order matches weightsToArray and pickFromWeighted iteration order.
- **Overengineering [LEAN]**: Plain array of string literals. Appropriately minimal.
- **Tests [NONE]**: No test file exists. SYMBOLS defines the full symbol universe used by engine and reels; no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master list of all reel symbols) is not self-evident from declaration alone.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Non-exported constant used to initialize REEL_WEIGHTS (L24–L28)
- **Duplication [UNIQUE]**: Configuration constant with no similar symbols found
- **Correction [OK]**: Weight values are internally consistent; no paytable is provided in this file to derive an RTP contradiction, so the DIAMOND:30 value cannot be flagged with sufficient confidence under rule 13.
- **Overengineering [LEAN]**: Simple literal object. Named keys improve readability of the weight values.
- **Tests [NONE]**: No test file. Weight values directly affect payout probabilities; no tests verify correctness.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Does not document what the numeric values represent (probabilities, relative weights, denominators), nor that these weights are shared across all 5 reels.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Non-exported constant used in spinReel (L44) and getReelWeights (L57)
- **Duplication [UNIQUE]**: Constant array initialization with no similar symbols found
- **Correction [OK]**: Five reel weight arrays, each independently produced by weightsToArray; no aliasing or sharing issues.
- **Overengineering [ACCEPTABLE]**: Five identical `weightsToArray(DEFAULT_WEIGHTS)` calls is repetitive (`Array(5).fill(...)` or a loop would be cleaner), but maintaining a per-reel weight array is a reasonable anticipation of per-reel odds, which is standard in slot machine design.
- **Tests [NONE]**: No test file. Five reels all share DEFAULT_WEIGHTS; shape and indexing assumptions are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Does not document that all 5 reels share identical weights or that index corresponds to reel position.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Non-exported function called in spinReel (L47) for weighted random selection
- **Duplication [DUPLICATE]**: Identical weighted selection algorithm with variable renaming; weightedPick is generic version
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG for regulated slot-machine gaming; the domain is unambiguous (CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER symbols, spinReel, paytable weights). Industry rule: certified gaming RNG must be a vetted CSPRNG, not V8's xorshift128+-based Math.random().
- **Overengineering [LEAN]**: Textbook weighted-random selection. Generic enough to be reusable but not over-abstracted; the generics are appropriate (Symbol[] + number[]).
- **Tests [NONE]**: No test file. Core probability logic with boundary condition (r exactly equals cumulative threshold) and fallback return path are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Core weighted-random selection logic with no documentation of parameters, algorithm, or the assumption that items.length === wts.length. (deliberated: reclassified: correction: NEEDS_FIX → OK — The NEEDS_FIX claim rests entirely on Math.random() being non-certifiable for regulated gambling (reels.ts:32). Verified the algorithm at reels.ts:30-41: it correctly computes cumulative weights, generates a uniform draw, iterates and returns the matching item with a valid fallback at L40. Math.random() produces correct random numbers — the certification concern is a security/compliance issue, not a correctness defect. The function is algorithmically correct. Duplication with rng.ts:weightedPick is confirmed (100% identical logic) but that's the duplication axis, not correction.)

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — both implement weighted random selection from items array using accumulation loop; only differences are variable naming and generics

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported, runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Excluded per known false positive: missing bounds check overturned by deliberation (all current callers supply valid indices 0-4).
- **Overengineering [LEAN]**: Straightforward: look up weights, fill a 3-row column. No unnecessary abstraction.
- **Tests [NONE]**: No test file. Imported by src/factories.ts; critical path for game play. Out-of-range reelIndex (e.g. 5) would return undefined weights silently — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing: @param reelIndex (valid range 0–4), @returns (3-element column of symbols), and that results are independent per row.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function with no similar symbols found
- **Correction [OK]**: Returns the module-level array directly; no correctness defect in the function itself.
- **Overengineering [LEAN]**: Simple accessor. Appropriate encapsulation of the module-private constant.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; returns internal SYMBOLS array by reference, mutation risk untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing @returns description and whether the returned array is a copy or a reference to the internal constant.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported, runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function with no similar symbols found
- **Correction [OK]**: No active crash path: same caller pattern as spinReel (deliberation established all callers supply indices 0-4); no independent new evidence to flag.
- **Overengineering [LEAN]**: Simple accessor. Appropriate encapsulation of the module-private constant.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; returns live REEL_WEIGHTS sub-array by reference, out-of-bounds index behavior untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on exported function. Missing @param reelIndex valid range, @returns description, and whether mutation of the returned array affects internal state.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually mirrors every member of the `Symbol` union. `Record<Symbol, number>` is more maintainable and automatically stays in sync when symbols are added. [L9-L12] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are module constants mutated by nothing, but none are `readonly` / `as const`. `getReelWeights` also returns a live mutable reference to an internal array. [L3-L26] |
| 8 | ESLint compliance | WARN | HIGH | `REEL_WEIGHTS[reelIndex]` is accessed without a bounds guard; result is `number[] \| undefined` under `noUncheckedIndexedAccess`. Same for `wts[i]` inside `pickFromWeighted`. `getReelWeights` leaks a mutable internal array. [L42-L49] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spinReel`, `getReelSymbols`, and `getReelWeights` are exported with no JSDoc. Parameters and return semantics are non-obvious (`reelIndex` range, column orientation). [L42-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed by reel vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, WILD, SCATTER), `spinReel`, `jackpot.ts`, `freespin.ts`, `paytable.ts`. `Math.random()` is a non-deterministic, non-auditable PRNG and is not certifiable for regulated gambling. The project ships `rng.ts` — a dedicated RNG module — which `reels.ts` bypasses entirely, using `Math.random()` directly in `pickFromWeighted`. [L31-L39] |
| 15 | Testability | WARN | MEDIUM | `spinReel` calls `Math.random()` (via `pickFromWeighted`) without injection, making deterministic unit tests impossible. `pickFromWeighted` is not exported, preventing direct unit testing of the core algorithm. [L31-L49] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SYMBOLS` would benefit from `as const` for a literal-tuple type. `DEFAULT_WEIGHTS` could use `satisfies ReelWeightConfig` to preserve literal types while still checking the shape. [L3-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: `getReelWeights` exposes the live internal `REEL_WEIGHTS[i]` array — callers can mutate reel probabilities at runtime, a correctness hazard in a game engine. Should return a copy or `ReadonlyArray<number>`. [L55-L57] |

### Suggestions

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to stay in sync automatically
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Use the project's `rng.ts` module instead of `Math.random()` for certifiable gambling RNG
  ```typescript
  // Before
  const r = Math.random() * total;
  // After
  import { randomFloat } from './rng.js';
  // ...
  const r = randomFloat() * total;
  ```
- Mark module constants as readonly to prevent accidental mutation
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...]
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...]
  ```
- Return a copy in `getReelWeights` to avoid exposing mutable internal state
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    const weights = REEL_WEIGHTS[reelIndex];
    if (!weights) throw new RangeError(`reelIndex ${reelIndex} out of range`);
    return [...weights];
  }
  ```
- Inject RNG function for testability
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[]
  // After
  export function spinReel(
    reelIndex: number,
    rng: () => number = randomFloat
  ): Symbol[]
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with a cryptographically secure RNG (e.g. crypto.getRandomValues with a Uint32Array) to satisfy regulated-gaming RNG certification requirements. [L32]

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
