# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | GOOD | 85% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 65% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| getReelWeights | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 60% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Local usage in spinReel function (line 46) as argument to pickFromWeighted
- **Duplication [UNIQUE]**: Constant symbol array. No similar functions found.
- **Correction [OK]**: Eight symbols correctly defined, matching ReelWeightConfig and weightsToArray order.
- **Overengineering [LEAN]**: Plain array of 8 symbol literals, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant with no comment explaining its role as the master symbol registry or its ordering significance for weight arrays.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Used in REEL_WEIGHTS initialization (lines 24–28), called 5 times
- **Duplication [UNIQUE]**: Constant initialization with no matches found.
- **Correction [OK]**: Excluded per project instructions (previously investigated and overturned).
- **Overengineering [LEAN]**: Simple constant, appropriate use of the config type.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No comment explaining the rationale behind the chosen weight values or that total sums to 120.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Local usage in spinReel (line 44) and getReelWeights (line 57)
- **Duplication [UNIQUE]**: Constant array initialization with no matches.
- **Correction [OK]**: Five reels each initialized with DEFAULT_WEIGHTS via weightsToArray; matches architecture spec.
- **Overengineering [ACCEPTABLE]**: Five explicit identical entries is verbose, but the architecture doc confirms per-reel indexing (`REEL_WEIGHTS[i]`) and the structure is the natural extension point for diverging weights per reel.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. No comment indicating all 5 reels share identical weights or that this can be customised per-reel.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel (line 46) for weighted random symbol selection
- **Duplication [DUPLICATE]**: Identical weighted selection algorithm to weightedPick (score 0.818). Both accumulate weights, generate random threshold, select on match, fallback to last item.
- **Correction [OK]**: Excluded per project instructions (previously investigated and overturned).
- **Overengineering [LEAN]**: Standard O(n) weighted-pick; minimal and correct.
- **Tests [NONE]**: No test file exists; critical weighted-random logic with boundary behavior (r == total edge case, weight=0 symbols) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported but implements a non-trivial weighted-random algorithm. No comment on the cumulative-distribution approach, the fallback on the last item, or the assumption that items and wts are parallel arrays of equal length.

> **Duplicate of** `src/rng.ts:weightedPick` — Identical algorithm with only generic<T> vs concrete Symbol type difference. Both reduce weights to total, multiply random by total, accumulate and select on threshold.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported; runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; out-of-range value yields undefined weights, causing TypeError in pickFromWeighted at wts.reduce.
- **Overengineering [LEAN]**: Single loop drawing 3 symbols per reel, matches documented Stage 3 behavior exactly.
- **Tests [NONE]**: No test file exists; imported by src/factories.ts making this a critical untested path.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: description of reelIndex valid range (0–4), the fixed 3-row output size, and return type semantics.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function.
- **Correction [OK]**: Returns module-level SYMBOLS array; no correctness issues.
- **Overengineering [LEAN]**: Trivial accessor; required by the service-locator contract in the architecture doc.
- **Tests [NONE]**: No test file exists; imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. No comment on whether the returned array is a copy or the live reference, nor its ordering significance.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported; runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function.
- **Correction [NEEDS_FIX]**: No bounds check on reelIndex; returns undefined for out-of-range index, violating the number[] return type contract and crashing downstream callers.
- **Overengineering [LEAN]**: Trivial accessor; required by the service-locator contract in the architecture doc.
- **Tests [NONE]**: No test file exists; imported by src/engine.ts.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range for reelIndex, whether the returned array is a live reference (mutations would affect behaviour), and weight ordering relative to SYMBOLS.

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all declared as mutable. getReelSymbols() and getReelWeights() return live mutable references, allowing callers to silently corrupt module-level state. [L3-L25] |
| 8 | ESLint compliance | WARN | HIGH | REEL_WEIGHTS[reelIndex] and items[i] / items[items.length - 1] access arrays without bounds validation. TypeScript's default index signature returns T, not T \| undefined, so this is invisible to the compiler but would throw at runtime for an out-of-range reelIndex. @typescript-eslint/no-unsafe-member-access or noUncheckedIndexedAccess would flag this. [L46-L50] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights are all exported with no JSDoc — no parameter descriptions, return types, or invariant documentation. [L44-L58] |
| 13 | Security | FAIL | CRITICAL | Math.random() is used as the RNG source for slot-machine reel generation (L34). Slot-machine domain is unambiguously inferred from CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER symbols, spinReel mechanics, REEL_WEIGHTS, and the README's '95% RTP' and 'progressive jackpot' language. All regulated gaming jurisdictions (GLI-11, BMM, iTech Labs) require an auditable, certifiable PRNG — Math.random() is implementation-defined, non-auditable, and disqualifying for a certified RNG. A seeded, auditable PRNG (e.g., from src/rng.ts which appears to exist but is bypassed here) must replace Math.random(). [L34] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted hardwires Math.random() with no injectable RNG parameter. The architecture doc registers weightedPick from src/rng.ts as the container's 'rng' dependency, but spinReel never consults it — the injectable RNG is bypassed entirely. Deterministic testing requires mocking the global Math.random, rather than supplying an alternative implementation. [L31-L42] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS could use satisfies ReelWeightConfig to retain literal types while still enforcing the interface shape. REEL_WEIGHTS and SYMBOLS could use as const satisfies for stronger inference. [L15-L24] |
| 17 | Context-adapted rules | WARN | MEDIUM | Three slot-machine-specific concerns: (1) getReelSymbols() and getReelWeights() expose mutable module internals — callers can mutate SYMBOLS or REEL_WEIGHTS[i] in place, silently skewing the house edge. (2) spinReel does not validate reelIndex is in [0, 4], so an out-of-range call passes undefined weights to pickFromWeighted and throws at runtime. (3) The total weight in DEFAULT_WEIGHTS sums to 120, not 100 — not a bug, but undocumented and easy to misread as percentages. [L44-L58] |

### Suggestions

- Make module-level constants readonly and return safe copies from accessors
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = ["CHERRY", ...];
  const REEL_WEIGHTS: number[][] = [...];
  export function getReelSymbols(): Symbol[] { return SYMBOLS; }
  export function getReelWeights(reelIndex: number): number[] { return REEL_WEIGHTS[reelIndex]; }
  // After
  const SYMBOLS: readonly Symbol[] = ["CHERRY", ...] as const;
  const REEL_WEIGHTS: readonly (readonly number[])[] = [...];
  export function getReelSymbols(): readonly Symbol[] { return SYMBOLS; }
  export function getReelWeights(reelIndex: number): readonly number[] {
    const w = REEL_WEIGHTS[reelIndex];
    if (!w) throw new RangeError(`reelIndex ${reelIndex} out of range`);
    return w;
  }
  ```
- Inject the RNG function to enable deterministic testing and use certifiable PRNG in production
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(
    items: readonly Symbol[],
    wts: readonly number[],
    rng: () => number = Math.random   // replace with weightedPick from src/rng.ts in production
  ): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = rng() * total;
  ```
- Use satisfies for DEFAULT_WEIGHTS to retain literal types
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  };
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } as const satisfies ReelWeightConfig;
  ```
- Add JSDoc to all public exports
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
  // After
  /**
   * Spins a single reel column and returns 3 symbols drawn from the weighted distribution.
   * @param reelIndex – column index in [0, 4]
   * @returns Array of 3 Symbol values (top → bottom rows)
   */
  export function spinReel(reelIndex: number): Symbol[] {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add bounds check in spinReel: if reelIndex < 0 or reelIndex >= REEL_WEIGHTS.length, throw RangeError before accessing REEL_WEIGHTS[reelIndex]. [L44]

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[correction · low · trivial]** Add bounds check in getReelWeights: if reelIndex < 0 or reelIndex >= REEL_WEIGHTS.length, throw RangeError to match the declared number[] return type. [L57]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
