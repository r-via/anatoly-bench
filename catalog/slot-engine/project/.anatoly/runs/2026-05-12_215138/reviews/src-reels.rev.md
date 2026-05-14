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
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | WEAK | 60% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | NONE | 75% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced in spinReel (line 47) and getReelSymbols (line 53)
- **Duplication [UNIQUE]**: Array of symbol type values. No similar constants found.
- **Correction [OK]**: Eight-element symbol array correctly ordered and consistent with ReelWeightConfig and weightsToArray.
- **Overengineering [LEAN]**: Plain array of symbol names. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Constant defines the full symbol set used by engine and reels logic.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose as the master symbol registry is not self-evident from the constant name alone.

#### `ReelWeightConfig` (L7–L10)

Auto-resolved: type cannot be over-engineered

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray 5 times in REEL_WEIGHTS initialization (lines 23–27)
- **Duplication [UNIQUE]**: Configuration constant for default reel weights. No duplicates found.
- **Correction [OK]**: Weights are valid positive integers; without paytable data, DIAMOND's high weight (30) cannot be confirmed as a correctness defect under rule 12.
- **Overengineering [LEAN]**: Simple object literal assigning weights. No abstraction beyond what's needed.
- **Tests [NONE]**: No test file exists. Weight values directly affect payout odds — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Missing explanation of what these weight values mean (e.g. relative frequency units), how they sum, or that they apply uniformly to all five reels.

#### `weightsToArray` (L17–L20)

Auto-resolved: function ≤ 5 lines

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Accessed in spinReel (line 44) and getReelWeights (line 57)
- **Duplication [UNIQUE]**: 2D array of weight configurations for 5 reels. No similar constants found.
- **Correction [OK]**: Five reels, each built via weightsToArray(DEFAULT_WEIGHTS); structurally correct.
- **Overengineering [ACCEPTABLE]**: Per-reel weight arrays are a standard slot mechanic that enables future per-reel tuning. All 5 entries being identical is redundant right now, but the structure is justified by the domain.
- **Tests [NONE]**: No test file exists. Five-reel weight matrix is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The structure (5 reels × 8 weights, index-aligned with SYMBOLS) and the decision to use identical weights for all reels are both undocumented.

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called in spinReel loop (line 47)
- **Duplication [DUPLICATE]**: Identical weighted random selection logic to weightedPick. Both accumulate weights and return item when threshold exceeded.
- **Correction [OK]**: Algorithm correct per prior tier-3 deliberation; fallback at L40 handles floating-point edge case.
- **Overengineering [LEAN]**: Canonical O(n) weighted random selection. Clean and correct.
- **Tests [NONE]**: No test file exists. Core probability logic — boundary condition where r equals accumulated weight, zero-weight items, and single-item arrays are all uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on an internal but non-trivial weighted random selection algorithm. Missing: parameter descriptions, return semantics, and the fallback behavior on the last item.

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical — both implement weighted random selection via accumulation; differs only in typing (generic vs Symbol-specific) and variable names

#### `spinReel` (L43–L50)

- **Utility [USED]**: Exported and runtime-imported by src/factories.ts
- **Duplication [UNIQUE]**: Generates 3 random symbols for a reel using weighted selection. No similar functions found.
- **Correction [OK]**: Bounds-check absence previously deliberated (NEEDS_FIX tier, no active crash path); not re-flagged per known-false-positive ruling.
- **Overengineering [LEAN]**: Straightforward: reads per-reel weights, samples 3 rows, returns the column.
- **Tests [NONE]**: No test file exists. Imported by src/factories.ts; untested for invalid reelIndex (undefined weights), correct column length of 3, and symbol membership.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: what reelIndex valid range is (0–4), that it returns 3 symbols (one per row), and that sampling is independent per row.

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning SYMBOLS constant. No duplicates.
- **Correction [OK]**: Returns module-scoped constant; no correctness issues.
- **Overengineering [LEAN]**: Simple accessor exposing the symbol list.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; returns shared mutable array reference — mutation side-effects untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Should note it returns the canonical ordered symbol list and whether the returned array is a copy or a mutable reference.

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Exported and runtime-imported by src/engine.ts
- **Duplication [UNIQUE]**: Trivial getter returning reel weights by index. No duplicates.
- **Correction [OK]**: Missing bounds check on reelIndex (returns undefined typed as number[]); identical analysis to spinReel's deliberated ruling applies — no active crash path in current callers.
- **Overengineering [LEAN]**: Simple accessor exposing per-reel weights by index.
- **Tests [NONE]**: No test file exists. Imported by src/engine.ts; out-of-bounds reelIndex returns undefined with no guard — untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public API with no JSDoc. Missing: valid range of reelIndex, units/semantics of returned weights, and whether the array is a direct reference to internal state.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | ReelWeightConfig manually enumerates all 8 symbol properties. Record<Symbol, number> would be DRY and auto-sync if the Symbol union gains or loses members. [L11-L14] |
| 5 | Immutability | WARN | MEDIUM | SYMBOLS, DEFAULT_WEIGHTS, and REEL_WEIGHTS are all mutable. SYMBOLS and REEL_WEIGHTS should be ReadonlyArray; DEFAULT_WEIGHTS should be Readonly<ReelWeightConfig> or use as const. [L3-L27] |
| 6 | Interface vs Type | WARN | MEDIUM | Symbol is almost certainly a type alias (union) in types.ts, but ReelWeightConfig uses interface. Replacing with type ReelWeightConfig = Record<Symbol, number> aligns convention and removes the manual duplication. |
| 8 | ESLint compliance | WARN | HIGH | REEL_WEIGHTS[reelIndex] and wts[i] are accessed without bounds validation. With noUncheckedIndexedAccess these are type errors (number \| undefined). spinReel and getReelWeights accept arbitrary integers with no guard, silently producing undefined-driven runtime crashes. [L46-L57] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | spinReel, getReelSymbols, and getReelWeights all lack JSDoc. spinReel's contract (valid reelIndex range, return shape) is non-obvious to callers. [L46-L57] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from CHERRY/LEMON/BELL/BAR/SEVEN/WILD/SCATTER vocabulary. Math.random() is not cryptographically secure and is not certifiable for regulated gaming RNG (UKGC, MGA, GLI-19 all require certified PRNGs). A dedicated rng.ts module exists in the project but is entirely bypassed — pickFromWeighted calls Math.random() directly. This will fail compliance audits for any licensed jurisdiction. [L35] |
| 15 | Testability | WARN | MEDIUM | pickFromWeighted and spinReel are coupled to global Math.random with no injection point. Deterministic unit tests require mocking the global. Accepting an rng: () => number parameter (defaulting to Math.random) would decouple randomness and also enable the rng.ts certified PRNG to be wired in. [L33-L43] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | DEFAULT_WEIGHTS satisfies ReelWeightConfig would catch typos at definition without widening the inferred literal types. SYMBOLS could use as const satisfies readonly Symbol[] for stronger narrowing. [L12-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | getReelWeights returns a live mutable reference to the internal REEL_WEIGHTS entry — callers can silently corrupt game state. spinReel accepts any integer: reelIndex >= 5 returns undefined weights, crashing inside pickFromWeighted. Both exports need bounds checks and should return readonly / copied arrays. [L53-L57] |

### Suggestions

- Replace ReelWeightConfig interface with Record<Symbol, number> — DRY and auto-syncs with Symbol union
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Add readonly to all module-level constants to prevent mutation
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [...];
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  const REEL_WEIGHTS: number[][] = [...]
  // After
  const SYMBOLS: readonly Symbol[] = [...] as const;
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... };
  const REEL_WEIGHTS: ReadonlyArray<ReadonlyArray<number>> = [...]
  ```
- Inject an RNG function to enable the certified PRNG from rng.ts and allow deterministic testing
  ```typescript
  // Before
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const r = Math.random() * total;
  }
  export function spinReel(reelIndex: number): Symbol[] { ... }
  // After
  function pickFromWeighted(items: Symbol[], wts: number[], rng: () => number): Symbol {
    const r = rng() * total;
  }
  export function spinReel(reelIndex: number, rng: () => number = Math.random): Symbol[] { ... }
  ```
- Add bounds guards to spinReel and getReelWeights; return a copy to prevent state leakage
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
    ...
  }
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length - 1}]`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
    ...
  }
  export function getReelWeights(reelIndex: number): readonly number[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of bounds`);
    }
    return [...REEL_WEIGHTS[reelIndex]];
  }
  ```
- Use satisfies for DEFAULT_WEIGHTS to catch typos at definition site without widening types
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

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `spinReel`, `getReelSymbols`, `getReelWeights` (`spinReel, getReelSymbols, getReelWeights`) [L43-L50, L52-L54, L56-L58]
