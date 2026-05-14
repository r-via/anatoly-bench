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
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in pickFromWeighted function call on line 44
- **Duplication [UNIQUE]**: No similar constants found in RAG search.
- **Correction [OK]**: Array of 8 symbols is correct and consistent with ReelWeightConfig ordering.
- **Overengineering [LEAN]**: Plain array of 8 symbol literals. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. SYMBOLS drives all reel outcomes; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Name and values are clear, but no explanation of role (master symbol pool used for reel picks).

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray in REEL_WEIGHTS initialization on lines 24-28
- **Duplication [UNIQUE]**: No similar constants found in RAG search.
- **Correction [OK]**: Weights sum to 120. Cannot verify RTP=95% claim from weights alone without the paytable (not in scope of this file); no standalone correctness defect identifiable here.
- **Overengineering [LEAN]**: Simple object literal with one value per symbol. Appropriate.
- **Tests [NONE]**: No test file. Weight values directly control payout odds; correctness is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The weight values (e.g. SEVEN: 5 vs DIAMOND: 30) encode non-obvious game design decisions — odds ratios — that warrant documentation.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel and getReelWeights exported functions
- **Duplication [UNIQUE]**: No similar constants found in RAG search.
- **Correction [OK]**: 5 reels, each correctly constructed from DEFAULT_WEIGHTS via weightsToArray.
- **Overengineering [OVER]**: All 5 entries are identical `weightsToArray(DEFAULT_WEIGHTS)` calls. Building a per-reel weight matrix when every reel currently uses the same weights is premature generalization. A single shared weight array (with per-reel lookup deferred until differentiation is actually needed) is sufficient.
- **Tests [NONE]**: No test file. Five-reel weight matrix is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose (per-reel weight matrix, one row per reel) and the implication that all 5 reels share identical weights are non-obvious and undocumented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel function loop on line 44
- **Duplication [DUPLICATE]**: Identical weighted selection algorithm: both compute cumulative weights, apply random value, iterate to match threshold. Variable names differ (total/totalWeight, r/roll, acc/cumulative) but logic and control flow are equivalent.
- **Correction [OK]**: Algorithm is correct: cumulative-weight selection with valid fallback. Previously overturned finding not re-flagged.
- **Overengineering [LEAN]**: Textbook weighted-random selection. Linear scan is appropriate for 8 items.
- **Tests [NONE]**: No test file. Critical weighted-random logic — boundary at r==total, single-item arrays, zero-weight items — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-trivial weighted-random-selection algorithm; missing @param descriptions, @returns, and a note on fallback behavior (last item returned when floating-point rounding causes r >= total).

> **Duplicate of** `src/rng.ts:weightedPick` — 92% identical logic — both implement weighted random selection with same algorithm (cumulative weight matching). pickFromWeighted is specialized variant; weightedPick is generic.

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: No similar functions found in RAG search.
- **Correction [OK]**: Correctly builds 3-row column per reel. Bounds-check concern previously overturned per deliberation.
- **Overengineering [LEAN]**: Straightforward: look up weights, sample 3 rows, return column.
- **Tests [NONE]**: No test file. Imported by src/factories.ts; out-of-range reelIndex would silently pass undefined weights to pickFromWeighted; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: @param reelIndex (valid range 0–4, out-of-bounds yields undefined weights), @returns (3-symbol column), and behavior description.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function. No duplication detected.
- **Correction [OK]**: Returns SYMBOLS reference; no correctness defect (mutation is a best-practices concern, not a correctness bug).
- **Overengineering [LEAN]**: Simple accessor.
- **Tests [NONE]**: No test file. Used by src/engine.ts; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Should document that it returns the shared SYMBOLS reference (mutation risk) and what callers use it for.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter function. No duplication detected.
- **Correction [OK]**: Returns direct array reference; bounds-check concern mirrors the overturned spinReel finding and is not re-flagged.
- **Overengineering [LEAN]**: Simple accessor.
- **Tests [NONE]**: No test file. Used by src/engine.ts; out-of-bounds index returns undefined silently; untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing @param reelIndex (valid range), @returns (live array reference — mutation affects reel behavior), and purpose.

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually lists all 8 Symbol keys. Record<Symbol, number> stays in sync automatically if the Symbol union changes. [L8-L11] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are mutable. getReelSymbols() and getReelWeights() return direct internal array references, allowing callers to mutate module state. [L3-L27] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | All three exports (spinReel, getReelSymbols, getReelWeights) lack JSDoc. spinReel should document the valid reelIndex range (0–4) and the fixed 3-row return value. [L44-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | spinReel and getReelWeights perform no bounds check on reelIndex. REEL_WEIGHTS[reelIndex] returns undefined for indices ≥ 5; pickFromWeighted then calls wts.reduce on undefined, throwing at runtime. The public API surface requires explicit range validation. [L44-L50] |
| 13 | Security | FAIL | CRITICAL | Regulated gambling domain inferred from reel/symbol/jackpot vocabulary, README RTP target of 95%, and project files jackpot.ts, freespin.ts, rng.ts. Math.random() is not a certified PRNG and is not acceptable for regulated gaming software. The project ships a dedicated rng.ts module, which this file bypasses entirely, using Math.random() directly in pickFromWeighted instead. [L36] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted hardcodes Math.random(), making spinReel non-deterministic under test. Injecting an RNG parameter would enable seed-based unit tests and align with the rng.ts module. [L32-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | satisfies operator would validate DEFAULT_WEIGHTS against ReelWeightConfig without widening the inferred type. REEL_WEIGHTS could also use satisfies ReadonlyArray<readonly number[]>. [L13-L27] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/slot-machine context requires: (1) validated reelIndex bounds before array access on a public API, (2) weight sums verified at startup to detect distribution bugs (current sum is 120, intentional for relative weighting, but entirely undocumented). Non-certifiable RNG is covered in rule 13. |

### Suggestions

- Route all randomness through rng.ts to meet regulated gaming RNG compliance.
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  function pickFromWeighted(items: readonly Symbol[], wts: readonly number[], random: () => number): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = random() * total;
  ```
- Add bounds guard to spinReel and getReelWeights to prevent silent undefined array access.
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
- Use Record<Symbol, number> to keep ReelWeightConfig in sync with the Symbol union.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark constants readonly and return copies from accessors to prevent external mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  
  export function getReelSymbols(): Symbol[] {
    return SYMBOLS;
  }
  // After
  const SYMBOLS: readonly Symbol[] = [...];
  
  export function getReelSymbols(): readonly Symbol[] {
    return SYMBOLS;
  }
  ```
- Use satisfies to validate DEFAULT_WEIGHTS at declaration without widening the type.
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
  } satisfies ReelWeightConfig;
  ```

## Actions

### Refactors

- **[duplication · medium · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `ReelWeightConfig` is over-engineered `ReelWeightConfig`, `weightsToArray`, `REEL_WEIGHTS` (`ReelWeightConfig, weightsToArray, REEL_WEIGHTS`) [L7-L10, L17-L20, L22-L28]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
