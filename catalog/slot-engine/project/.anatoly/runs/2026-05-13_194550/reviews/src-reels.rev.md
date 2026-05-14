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
| pickFromWeighted | function | no | NEEDS_FIX | LEAN | USED | DUPLICATE | WEAK | 50% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 80% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Array used locally in pickFromWeighted at line 38 for weighted random selection
- **Duplication [UNIQUE]**: Constant array defining available reel symbols. No similar constants found.
- **Correction [OK]**: 8-symbol array order matches ReelWeightConfig keys and weightsToArray extraction order.
- **Overengineering [LEAN]**: Simple typed constant, no abstraction overhead.
- **Tests [NONE]**: No test file exists. SYMBOLS drives all reel spin outcomes; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose (master symbol list used for reel picks) is not stated.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Used locally 5 times in REEL_WEIGHTS initialization (L24–L28)
- **Duplication [UNIQUE]**: Default weight configuration for all reels. No similar constants found.
- **Correction [OK]**: All values are valid positive integers. RTP impact of DIAMOND weight=30 (25% of total 120) cannot be verified without paytable constants from another file; abstaining per rule 13.
- **Overengineering [LEAN]**: Plain config object literal, minimal and appropriate.
- **Tests [NONE]**: No test file. Weight values directly affect payout odds — correctness unverified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing explanation that these are relative weights (not probabilities), and no note on which reel(s) they apply to by default.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Array referenced in spinReel (L44) and getReelWeights (L57)
- **Duplication [UNIQUE]**: Multi-dimensional array of reel weight configurations. No similar constants found.
- **Correction [OK]**: Five reels each initialized correctly via weightsToArray(DEFAULT_WEIGHTS).
- **Overengineering [ACCEPTABLE]**: Five separate weight arrays anticipate per-reel customisation, which is standard slot-machine design. Currently identical values, but the structure is justified.
- **Tests [NONE]**: No test file. Five identical weight arrays initialized via weightsToArray; no validation that all five reels are populated correctly.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Does not explain that the outer array is indexed by reel (0–4) or that all five reels share identical weights.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Function called in spinReel loop (L48) for weighted random symbol selection
- **Duplication [DUPLICATE]**: Weighted random selection using cumulative probability. Identical logic to weightedPick.
- **Correction [NEEDS_FIX]**: Uses Math.random(), which is not a certifiable PRNG for regulated gaming.
- **Overengineering [LEAN]**: Correct, minimal weighted-random implementation with no unnecessary abstraction.
- **Tests [NONE]**: No test file. Core probability logic — off-by-one on boundary (r < acc vs r <= acc), zero-weight symbols, and single-item arrays are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Weighted-random selection algorithm with a fallback on the last item is non-trivial; missing @param and @returns descriptions. (deliberated: confirmed — The function at reels.ts:30-41 is algorithmically correct — standard cumulative-weight selection with proper fallback at L40. The finding's actual concern is duplication with rng.ts:weightedPick, not a correctness bug. Both implementations are identical in logic (verified line-by-line: reduce total, random * total, accumulate, compare, fallback to last). The real correction concern is architectural: engine.ts:30 registers weightedPick as 'rng' in DI container, engine.ts:120 resolves it, but the resolved `rng` variable is never passed to factory.buildReels (L128), so pickFromWeighted bypasses the official RNG entirely. Lowering confidence to 50 because the function itself is correct; the issue is duplication/architecture, not a bug in pickFromWeighted's logic.)

> **Duplicate of** `src/rng.ts:weightedPick` — Identical implementation — calculate total, generate random threshold, accumulate weights, return matching item. Differs only in type specialization (Symbol vs generic <T>) and variable names (total/totalWeight, r/roll, acc/cumulative).

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported function runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Generates 3 symbols for a reel using weighted selection. No similar functions found.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; out-of-range value makes weights undefined, causing TypeError inside pickFromWeighted.
- **Overengineering [LEAN]**: Straightforward loop over rows, delegates sampling to pickFromWeighted.
- **Tests [NONE]**: No test file. Imported by src/factories.ts; always returns 3-element column — length guarantee and out-of-bounds reelIndex behavior untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing: valid range for reelIndex (0–4), that the return is a 3-element column (one Symbol per row), and behavior on out-of-range index.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported function runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Simple accessor for symbol array constant. Trivial function.
- **Correction [NEEDS_FIX]**: Returns mutable reference to internal SYMBOLS array; external mutation creates item/weight index misalignment in pickFromWeighted.
- **Overengineering [LEAN]**: Minimal accessor, no complexity.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; returns shared mutable array reference — mutation safety untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Should note it returns the shared SYMBOLS reference (mutation risk) and that order matches weight array indices.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported function runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Simple accessor for reel weights by index. Trivial function.
- **Correction [NEEDS_FIX]**: Two independent defects: returns undefined for out-of-range index (violates number[] return type), and exposes mutable reference enabling external corruption of reel distributions.
- **Overengineering [LEAN]**: Minimal accessor, no complexity.
- **Tests [NONE]**: No test file. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined silently — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing @param reelIndex range constraint and note that the returned array is a direct reference (mutable).

## Best Practices — 2.75/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates every Symbol key. Record<Symbol, number> would be more idiomatic and would stay in sync automatically if Symbol is extended. [L8-L11] |
| 5 | Immutability | FAIL | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable. getReelSymbols() and getReelWeights() return live references, letting callers mutate internal state silently. [L3-L26] |
| 6 | Interface vs Type | WARN | MEDIUM | Symbol is imported as a type alias (type Symbol) from types.ts while ReelWeightConfig is declared as an interface. Mixed convention within the file. [L8] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc. Parameter meaning (reelIndex valid range), return shape, and side-effects are undocumented. [L42-L58] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel performs no bounds check on reelIndex. REEL_WEIGHTS[reelIndex] is undefined for reelIndex >= 5, silently propagating NaN through pickFromWeighted and returning the last symbol unconditionally. [L42-L49] |
| 13 | Security | FAIL | CRITICAL | Casino/slot-machine domain inferred from symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER) and project files (jackpot.ts, paytable.ts, freespin.ts). Math.random() is a non-cryptographic PRNG and is not certifiable under GLI-11 or BMM gaming standards. The project ships rng.ts, a strong signal that a compliant RNG module exists, yet pickFromWeighted calls Math.random() directly, bypassing it entirely. [L31] |
| 14 | Performance | WARN | MEDIUM | weightsToArray(DEFAULT_WEIGHTS) is called 5× at module init to produce identical arrays; a single computed array could be reused. pickFromWeighted recomputes the weight total on every call (hot path: 3 rows × 5 reels per spin); precomputing total per reel avoids the repeated reduce. [L18-L26] |
| 15 | Testability | FAIL | MEDIUM | pickFromWeighted captures Math.random() with no injection seam, making deterministic unit tests impossible without monkey-patching globals. spinReel reads module-level REEL_WEIGHTS with no way to substitute test weights. [L29-L39] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS would benefit from satisfies ReelWeightConfig (preserves literal types, enforces shape). SYMBOLS could use as const for a readonly tuple type. [L3-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights() returns a live reference to an internal REEL_WEIGHTS row, allowing callers to mutate live reel weights at runtime — a compliance and integrity risk in regulated gambling. getReelSymbols() similarly exposes the mutable SYMBOLS array. [L54-L58] |

### Suggestions

- Replace Math.random() with the project's rng.ts module to satisfy regulated gaming RNG certification (GLI-11/BMM).
  - Before: `const r = Math.random() * total;`
  - After: `const r = certifiedRng() * total; // inject rng function from rng.ts`
- Inject the RNG function into pickFromWeighted for testability and certified-RNG compliance.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], rand: () => number): Symbol {
    const r = rand() * total;
  ```
- Add a bounds guard in spinReel to prevent silent undefined access.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of range 0–${REEL_WEIGHTS.length - 1}`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```
- Use Record<Symbol, number> for ReelWeightConfig to eliminate the manually mirrored key list.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark SYMBOLS and REEL_WEIGHTS as readonly and return ReadonlyArray from public accessors to prevent external mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  export function getReelSymbols(): Symbol[] { return SYMBOLS; }
  // After
  const SYMBOLS: ReadonlyArray<Symbol> = [...] as const;
  export function getReelSymbols(): ReadonlyArray<Symbol> { return SYMBOLS; }
  ```
- Use satisfies to validate DEFAULT_WEIGHTS shape while preserving numeric literal types.
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, ...
  };
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, ...
  } satisfies ReelWeightConfig;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add bounds check in spinReel: throw a descriptive RangeError when reelIndex < 0 or >= REEL_WEIGHTS.length before accessing the weights array. [L44]
- **[correction · medium · small]** Add bounds check in getReelWeights and return a shallow copy ([...REEL_WEIGHTS[reelIndex]]) instead of the mutable internal array. [L57]

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a cryptographically secure PRNG (e.g., crypto.getRandomValues scaled to [0, total)) to satisfy regulated gaming RNG certification requirements. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Return a copy of SYMBOLS in getReelSymbols (e.g., [...SYMBOLS]) to prevent external callers from mutating the module-level array. [L53]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
