# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 87% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 90% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted call inside spinReel (L46) and returned by getReelSymbols (L53).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Eight symbol names correctly defined; consistent with ReelWeightConfig and weightsToArray ordering.
- **Overengineering [LEAN]**: Flat array of 8 symbols — minimal and appropriate.
- **Tests [NONE]**: No test file found. Array ordering matters because weightsToArray depends on positional alignment with REEL_WEIGHTS.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level constant; not exported but serves as the canonical symbol roster used by all reel logic.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS (L12) and weightsToArray parameter (L17).
- **Duplication [UNIQUE]**: No similar interface found in RAG results.
- **Correction [OK]**: Interface correctly enumerates all 8 symbols with numeric weight fields.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests needed.
- **DOCUMENTED [DOCUMENTED]**: All fields are symbol names mapped to number weights — fully self-descriptive. No JSDoc needed.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times in REEL_WEIGHTS initializer (L23–L27).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [NEEDS_FIX]**: DIAMOND weight 30/120 = 25% makes DIAMOND alone contribute ~229% RTP per line bet, violating the arbitrated 95% RTP target.
- **Overengineering [ACCEPTABLE]**: Named fields provide the only in-code documentation of what each weight value maps to. The verbosity is justified as a self-documenting config record even though the names are discarded afterward.
- **Tests [NONE]**: No test file. Weight values directly affect payout probabilities — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious semantics: weights are relative (sum = 120), and the probability implications of each value are not apparent from the name alone. (deliberated: reclassified: correction: NEEDS_FIX → OK — Weights at src/reels.ts:12-15 are structurally valid: 8 positive integers summing to 120. pickFromWeighted (reels.ts:31) normalizes by total so any positive sum works. DIAMOND at 30 is the highest weight and highest paytable payout (src/paytable.ts:11: [50,250,1000]), which is arguably poor game math, but NOT a code defect — the code correctly implements the specified weights. Whether these weights produce the target 95% RTP (declared as ANCIENT_RTP in paytable.ts:3) requires full mathematical simulation, not static code analysis. Game math tuning is a design concern, not a correction-axis bug.)

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times in REEL_WEIGHTS array literal (L23–L27).
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [OK]**: Correctly maps all 8 ReelWeightConfig fields to array in SYMBOLS order.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file. Positional ordering of the returned array must match SYMBOLS order; no tests verify this invariant.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, <10 lines, name is clear. Tolerated per internal-helper leniency.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel (L44) and getReelWeights (L57).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Five reels correctly initialized from DEFAULT_WEIGHTS; RTP defect is sourced in DEFAULT_WEIGHTS, not here.
- **Overengineering [OVER]**: Five identical arrays produced by five calls to weightsToArray(DEFAULT_WEIGHTS). Docs confirm all reels share the same weight distribution. A single shared weights array referenced by spinReel would eliminate the per-reel matrix entirely.
- **Tests [NONE]**: No test file. Five reels all using DEFAULT_WEIGHTS is untested; any divergence would silently break game math.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious that all five reels share identical weights and that indices 0–4 map to left-to-right reels.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel loop (L46) to select each symbol by weighted random.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: same reduce-total, random-roll, cumulative-accumulator loop, and fallback-to-last-element pattern. Only differences are variable names (total/r/acc vs totalWeight/roll/cumulative) and that weightedPick is generic <T> while this is hardcoded to Symbol[].
- **Correction [NEEDS_FIX]**: Math.random() is not certifiable for regulated gaming RNG in an auditable casino slot engine.
- **Overengineering [LEAN]**: Correct, minimal weighted-random implementation with no excess abstraction.
- **Tests [NONE]**: No test file. Core probabilistic logic (boundary at r < acc, fallback to last item) has no coverage for edge cases like zero-weight entries or single-item lists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, but algorithm is non-trivial (cumulative-sum weighted random selection). No JSDoc on parameters or return value. (deliberated: reclassified: correction: NEEDS_FIX → OK — Function at src/reels.ts:30-41 is algorithmically correct: computes total via reduce (L31), draws uniform random (L32), accumulates weights (L34-38), falls back to last item (L40). The duplication with weightedPick in src/rng.ts:5-16 is real (identical algorithm, variable names differ), but duplication is a maintenance concern for the 'duplication' axis, not a correctness defect. pickFromWeighted is private (not exported), called only in spinReel (reels.ts:47), and produces correct weighted-random results. No crash, data loss, or incorrect behavior.)

> **Duplicate of** `src/rng.ts:weightedPick` — 100% identical algorithm — weighted random selection via cumulative sum loop with identical structure and fallback

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [OK]**: Correctly samples 3 independent symbols per reel column using the configured weight array.
- **Overengineering [LEAN]**: Straightforward: look up weights, sample 3 symbols, return column.
- **Tests [NONE]**: No test file. Consumed by src/factories.ts; out-of-bounds reelIndex would return undefined weights and crash silently — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc. Missing: valid range for reelIndex (0–4), meaning of the 3-element return array (one Symbol per row), and behavior if reelIndex is out of bounds.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts; consumed by spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found in RAG results.
- **Correction [OK]**: Returns SYMBOLS reference; no correctness issues.
- **Overengineering [LEAN]**: Trivial accessor, appropriate for encapsulation.
- **Tests [NONE]**: No test file. Used by spin() in src/engine.ts to build the grid; returns mutable reference to SYMBOLS — no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc. No description of what it returns or why callers need it (ordering mirrors weight array indices).

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts; consumed by spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found in RAG results.
- **Correction [OK]**: Returns weight array for given reel index; consistent with documented contract.
- **Overengineering [LEAN]**: Trivial accessor, appropriate for encapsulation.
- **Tests [NONE]**: No test file. Used by spin() in src/engine.ts; out-of-bounds reelIndex returns undefined with no guard — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API. No JSDoc. Missing: valid reelIndex range (0–4), that the returned array is parallel to getReelSymbols(), and that weights are read-only at runtime.

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates all 8 symbol fields. Since `Symbol` is already a union type imported from `./types.js`, `Record<Symbol, number>` would express the same constraint more concisely and guarantee exhaustiveness if the union ever grows. [L8-L12] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are all mutable at the module level. `getReelWeights` and `getReelSymbols` return live mutable references to internal arrays, allowing external mutation. All three should be `ReadonlyArray` (or `as const`) and return types should be `readonly number[]` / `readonly Symbol[]`. [L3-L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | None of the three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) have JSDoc comments. Parameter semantics (e.g., valid `reelIndex` range 0–4) and return-value contracts are undocumented. [L44-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel` and `getReelWeights` perform no bounds check on `reelIndex`. An out-of-range index yields `undefined` for `weights`, causing an immediate `TypeError` in `pickFromWeighted` at the `.reduce()` call. A guard (`if (reelIndex < 0 \|\| reelIndex >= REEL_WEIGHTS.length) throw new RangeError(...)`) would make the contract explicit. [L44-L52] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/payline/symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER) and project structure. `Math.random()` drives all symbol selection in `pickFromWeighted` (L33). `Math.random()` is a non-certifiable PRNG: it is not statistically verified, not seeded from a hardware entropy source, and not auditable under GLI-11 / BMM / iTech Labs gaming RNG standards. The project already contains `src/rng.ts`, indicating a dedicated RNG module exists. Using raw `Math.random()` instead of the certified RNG in `rng.ts` is a compliance and security violation for regulated gaming software. [L33] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` hard-codes `Math.random()`, making deterministic unit tests impossible without monkey-patching globals. Accepting an `rng: () => number` parameter (defaulting to the module from `rng.ts`) would allow injection in tests. [L30-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `SYMBOLS` should use `as const` for literal tuple inference. `DEFAULT_WEIGHTS` could use `satisfies ReelWeightConfig` (or `Record<Symbol, number>`) to validate shape at compile time while preserving narrowed literal types. [L3-L14] |
| 17 | Context-adapted rules | WARN | MEDIUM | `getReelWeights` returns the raw internal `REEL_WEIGHTS[reelIndex]` reference (mutable `number[]`), and `getReelSymbols` returns the raw `SYMBOLS` reference. Both allow external mutation of module-level state. Return types should be `readonly number[]` and `readonly Symbol[]`, and the arrays should be frozen or sliced before return. Additionally, bypassing `src/rng.ts` in this slot-machine engine violates the project's own RNG abstraction boundary. [L52-L57] |

### Suggestions

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to guarantee exhaustiveness and eliminate manual field listing.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Apply `as const` and `readonly` to module-level constants and return types to prevent external mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = ["CHERRY", ...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [ ... ];
  
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];
  
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length)
      throw new RangeError(`reelIndex must be 0–${REEL_WEIGHTS.length - 1}, got ${reelIndex}`);
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Inject the certified RNG from `src/rng.ts` instead of `Math.random()` to meet gaming-compliance requirements and enable deterministic testing.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import { nextFloat } from "./rng.js"; // certified PRNG
  
  function pickFromWeighted(
    items: readonly Symbol[],
    wts: readonly number[],
    rng: () => number = nextFloat,
  ): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Add JSDoc to public exports to document the valid `reelIndex` range and return shapes.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spin a single reel and return the 3 visible symbols (top→bottom).
   * @param reelIndex - Reel column index, must be in [0, 4].
   */
  export function spinReel(reelIndex: number): readonly Symbol[] {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.random() in pickFromWeighted with crypto.getRandomValues() (Node.js built-in) to produce auditable, certifiable random draws required for regulated casino gaming RNG. [L32]

### Refactors

- **[correction · high · large]** Reduce DIAMOND weight in DEFAULT_WEIGHTS from 30 to approximately 10–14. At weight 30 (P=25%), DIAMOND alone yields ~229% expected return per line bet. A weight of ~12 (P=10%) constrains DIAMOND's EV to ~7.8% of line bet, leaving the remaining ~87% budget for all other symbols to reach the 95% RTP target. [L14]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
