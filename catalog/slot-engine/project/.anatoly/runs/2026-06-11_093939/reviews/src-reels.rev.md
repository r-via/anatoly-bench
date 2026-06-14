# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 82% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 95% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted calls and returned by getReelSymbols.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Array matches the 8-symbol set used throughout the module; ordering is consistent with weightsToArray and the docs.
- **Overengineering [LEAN]**: Simple ordered array of symbol names; serves as the canonical symbol registry.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported, but purpose (canonical ordered symbol list) is non-obvious — it doubles as the index key for weight arrays, which is undocumented.

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as parameter type in weightsToArray and as type for DEFAULT_WEIGHTS.
- **Duplication [UNIQUE]**: No similar interface found in RAG results.
- **Correction [OK]**: Interface correctly enumerates all 8 symbols; used only internally.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [GOOD]**: Interface with no runtime behavior; no tests needed.
- **DOCUMENTED [DOCUMENTED]**: All fields are symbol names mapped to number weights; semantics are fully self-descriptive per the interface name and field names.

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times when building REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Sum = 25+25+15+10+5+30+5+5 = 120; matches the documented weight table exactly.
- **Overengineering [LEAN]**: Straightforward named-field config object. Complexity lives in the interface, not the constant.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The numeric values (e.g. DIAMOND:30 being the highest) and total-weight-of-120 contract are non-obvious from the name alone.

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times in REEL_WEIGHTS initializer.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Emission order (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER) is identical to SYMBOLS declaration; no mismatch.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, <10 lines, name is clear. Tolerated as an internal helper with no docs.

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Indexed in spinReel and getReelWeights.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Five reels, each initialised from DEFAULT_WEIGHTS — consistent with the documented single shared distribution.
- **Overengineering [OVER]**: Five identical calls to `weightsToArray(DEFAULT_WEIGHTS)` building five distinct but equal arrays. Docs confirm all reels share the same distribution and there is no setter — per-reel differentiation is never used. A single shared array (or `Array.from({length:5}, () => weightsToArray(DEFAULT_WEIGHTS))`) paired with a note about immutability would be cleaner; the current form implies per-reel customization that is explicitly out of scope.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 2D structure (one weight array per reel, indices 0–4) and the fact all five reels share identical weights are non-obvious constraints with no documentation.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel's row loop.
- **Duplication [DUPLICATE]**: Logic is identical to weightedPick in src/rng.ts: both sum weights, generate Math.random()*total, accumulate in a loop, return items[i] when roll < cumulative, and fall back to last item. The only differences are variable names and that weightedPick is generic <T> while this is typed to Symbol[]. These are fully interchangeable.
- **Correction [NEEDS_FIX]**: Math.random() is not a certifiable RNG for regulated casino/gambling software. Inferred slot-machine domain from reel/payline/jackpot/RTP vocabulary and arbitrated README contract. Industry convention requires a cryptographically auditable source of randomness (e.g. crypto.getRandomValues or a certified hardware RNG) for compliance.
- **Overengineering [LEAN]**: Standard O(n) weighted-random selection. No unnecessary abstraction; fallback return on last element handles floating-point edge case correctly.
- **Tests [NONE]**: No test file exists. This function has critical edge cases untested: boundary where r == acc, total-weight of zero, mismatched items/wts lengths, and statistical distribution correctness.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported, internal helper. Name conveys intent; algorithm details tolerated undocumented at this visibility level. (deliberated: reclassified: correction: NEEDS_FIX → OK — Compared src/reels.ts:30-41 with src/rng.ts:5-16 line by line: algorithms are identical (cumulative-weight loop, Math.random()*total, fallback to last item). Duplication is factual. However, the correction axis asks whether the code is *incorrect* — it is not. pickFromWeighted correctly implements weighted random selection and is correctly called at reels.ts:47. Duplication is a maintenance concern (duplication axis), not a correctness defect. Reclassifying correction from NEEDS_FIX to OK.)

> **Duplicate of** `src/rng.ts:weightedPick` — ~98% identical logic — same weighted random selection algorithm; differs only in variable names and generic vs concrete typing

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG.
- **Correction [OK]**: Logic correctly builds a 3-row column by calling pickFromWeighted once per row; independent draws per cell match documented per-cell probability model.
- **Overengineering [LEAN]**: Minimal: index into weight table, fill a 3-row column. Single responsibility, no unnecessary indirection.
- **Tests [NONE]**: No test file exists. Called by src/factories.ts; untested behavior includes out-of-bounds reelIndex (undefined weights), always returning 3 symbols, and distribution correctness.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range of reelIndex (0–4), return shape (3-element column), and that each cell is independently sampled.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; marked UNIQUE per RAG instructions.
- **Correction [OK]**: Returns module-level SYMBOLS array; no mutation risk visible at call sites in the static graph.
- **Overengineering [LEAN]**: Simple accessor exposing the internal SYMBOLS array.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; trivial accessor but zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No description of the returned array's ordering or its role as the index key aligned with getReelWeights output.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts.
- **Duplication [UNIQUE]**: Trivial accessor; marked UNIQUE per RAG instructions.
- **Correction [OK]**: Returns the weight array for the requested reel index; consistent with documented 0–4 contract.
- **Overengineering [LEAN]**: Simple index accessor; matches the documented read-only API contract.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard, untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid reelIndex range (0–4), that the returned array aligns positionally with getReelSymbols(), and that it is read-only at runtime.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates all 8 symbol keys. `Record<Symbol, number>` is more idiomatic and automatically tracks additions to the `Symbol` union. [L7-L11] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are mutable at runtime. `getReelWeights` returns a live mutable reference to an internal array, allowing external callers to silently corrupt reel state. The reference docs state 'weights are read-only at runtime' — the code does not enforce this. [L3-L27] |
| 9 | JSDoc on public exports | WARN | MEDIUM | All three exported functions (`spinReel`, `getReelSymbols`, `getReelWeights`) lack JSDoc. At minimum, `spinReel` and `getReelWeights` should document the valid `reelIndex` range (0–4) and return shape. [L43-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel(reelIndex)` and `getReelWeights(reelIndex)` access `REEL_WEIGHTS[reelIndex]` without bounds validation. An out-of-range index silently returns `undefined`, causing `weightsToArray`/`reduce` to blow up downstream. Valid range 0–4 should be asserted. [L43-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/symbol vocabulary (CHERRY, LEMON, BELL, BAR, SEVEN, DIAMOND, WILD, SCATTER), `spinReel`, and `pickFromWeighted`. `Math.random()` is a non-cryptographic PRNG that is not certifiable for regulated gaming RNG. The project already ships `src/rng.ts`, indicating a dedicated RNG module is available and should be injected into `pickFromWeighted` instead. [L33-L42] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point. Deterministic tests require monkey-patching the global. Accepting an `rng: () => number` parameter would make the function pure and trivially testable. [L31-L42] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS` is a good candidate for `satisfies ReelWeightConfig` to retain the literal types while still being checked against the interface. `REEL_WEIGHTS` and `SYMBOLS` could use `as const` for narrower inferred types. [L12-L27] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-engine context: `src/rng.ts` exists in the project but `spinReel` bypasses it entirely by calling `Math.random()` inline. All randomness in a certifiable RNG-sensitive module should flow through the shared RNG module to ensure auditability and seed control. [L33-L42] |

### Suggestions

- Replace `ReelWeightConfig` interface with `Record<Symbol, number>` to auto-track symbol additions
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Enforce immutability on module-level constants and prevent external mutation via getReelWeights
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
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [...];
  
  export function getReelWeights(reelIndex: number): readonly number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  ```
- Inject an RNG function into pickFromWeighted to replace Math.random() and enable testability + regulatory compliance
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], rng: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Add bounds guard to spinReel and getReelWeights
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
- Use satisfies for DEFAULT_WEIGHTS to retain literal types while enforcing shape
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, ...
  };
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } as const satisfies ReelWeightConfig;
  ```

## Actions

### Refactors

- **[correction · high · large]** Replace Math.random() in pickFromWeighted with a certifiable randomness source (e.g. crypto.getRandomValues to produce a uniform float in [0, total)) so the RNG meets regulated gaming certification requirements. [L32]
- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
