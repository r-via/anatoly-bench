# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 88% |
| DEFAULT_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 85% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 90% |
| REEL_WEIGHTS | constant | no | OK | OVER | USED | UNIQUE | - | 87% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 92% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 92% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by pickFromWeighted (via spinReel) and getReelSymbols, both of which have external consumers.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Array of 8 symbols in consistent order with ReelWeightConfig and weightsToArray.
- **Overengineering [LEAN]**: Flat array of symbol names, minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS parameter in weightsToArray, which feeds REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar interface found in the codebase.
- **Correction [OK]**: Interface keys exactly match SYMBOLS order; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Passed to weightsToArray five times to populate REEL_WEIGHTS.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: All weights are positive integers; no paytable provided to verify RTP, so weight magnitudes cannot be flagged without a documented numerical target.
- **Overengineering [ACCEPTABLE]**: Named fields genuinely aid readability (CHERRY: 25 vs a bare array). Complexity belongs to the ReelWeightConfig/weightsToArray round-trip, not this constant itself.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called five times to build REEL_WEIGHTS array from DEFAULT_WEIGHTS.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Property extraction order matches SYMBOLS declaration order exactly.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Referenced by spinReel and getReelWeights, both consumed externally.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Each weightsToArray call produces a distinct array; 5 independent reel weight arrays constructed correctly.
- **Overengineering [OVER]**: Five identical weightsToArray(DEFAULT_WEIGHTS) calls; all reels share the same weights. Premature per-reel configurability with no actual differentiation. A single shared array referenced by spinReel would express the same behaviour without the false implication of per-reel variation.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel to sample each row using weighted random selection.
- **Duplication [DUPLICATE]**: Identical logic to weightedPick in src/rng.ts: both compute total weight, draw Math.random()*total, accumulate weights in a loop, return items[i] on first match, fall back to last item. The only differences are variable names (total/totalWeight, r/roll, acc/cumulative) and that weightedPick is generic (T) while pickFromWeighted is typed to Symbol. The generic version subsumes this one entirely.
- **Correction [OK]**: Standard weighted-reservoir selection. Math.random() ∈ [0,1) so r < total holds on the final accumulation; fallback on L40 is unreachable but harmless.
- **Overengineering [LEAN]**: Standard O(n) weighted random selection — minimal, correct, no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — ~95% identical logic — same weighted-random selection algorithm, same fallback, differs only in variable names and generic vs Symbol-typed signature

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar functions found per RAG results.
- **Correction [OK]**: Independently samples 3 rows per reel from the correct weight vector; returns correctly typed Symbol[].
- **Overengineering [LEAN]**: Builds a 3-row column by delegating to pickFromWeighted. Single responsibility, no excess.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns internal array reference; no in-tree caller observed mutating it.
- **Overengineering [LEAN]**: Trivial accessor; consumed by engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns weight array for given reel index; callers in engine.ts are the sole consumers and no out-of-range index misuse is visible.
- **Overengineering [LEAN]**: Trivial accessor; consumed by engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 5.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually lists every Symbol key; `Record<Symbol, number>` would be more idiomatic and stay in sync automatically with the `Symbol` union. [L9-L13] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS` and `REEL_WEIGHTS` are mutable; `getReelWeights` returns a live reference to an internal array, allowing external mutation of game state. None are marked `readonly` or returned as copies. [L3, L25-L31, L57] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spinReel`, `getReelSymbols`, and `getReelWeights` have no JSDoc. `spinReel` in particular has an undocumented precondition: `reelIndex` must be in [0, 4]; out-of-bounds silently returns `undefined` weights. [L42, L51, L55] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from reel/payline/jackpot/WILD/SCATTER vocabulary throughout the project. `Math.random()` is a non-cryptographic PRNG seeded by the runtime and is not certifiable for regulated gaming RNG. A dedicated `rng.ts` module exists in the same project but is not used here — `pickFromWeighted` calls `Math.random()` directly, bypassing any auditable RNG source. [L36] |
| 15 | Testability | FAIL | MEDIUM | `pickFromWeighted` hard-wires `Math.random()` with no injection point and no pure overload. `spinReel` is therefore non-deterministic and cannot be unit-tested without monkey-patching. Accepting an `rng: () => number` parameter (defaulting to `Math.random`) would fix both rule 13 and rule 15. [L33-L41] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS` uses an explicit type annotation; `satisfies ReelWeightConfig` would catch key mismatches at the assignment site while preserving the literal type for downstream narrowing. [L15-L18] |
| 17 | Context-adapted rules | WARN | MEDIUM | `getReelWeights` returns a direct reference to the internal `REEL_WEIGHTS` row, enabling callers to alter live game weights without going through any setter. Should return a copy (`return [...REEL_WEIGHTS[reelIndex]]`) or a `readonly` view. [L55-L57] |

### Suggestions

- Accept an injectable RNG to fix both certifiability (rule 13) and testability (rule 15)
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
- Use Record utility type for ReelWeightConfig (rule 4)
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Return a copy from getReelWeights to prevent mutation of internal state (rule 17)
  ```typescript
  // Before
  export function getReelWeights(reelIndex: number): number[] {
    return REEL_WEIGHTS[reelIndex];
  }
  // After
  export function getReelWeights(reelIndex: number): readonly number[] {
    return [...REEL_WEIGHTS[reelIndex]];
  }
  ```
- Use satisfies for DEFAULT_WEIGHTS (rule 16)
  ```typescript
  // Before
  const DEFAULT_WEIGHTS: ReelWeightConfig = {
  // After
  const DEFAULT_WEIGHTS = {
    CHERRY: 25, LEMON: 25, BELL: 15, BAR: 10,
    SEVEN: 5, DIAMOND: 30, WILD: 5, SCATTER: 5,
  } satisfies ReelWeightConfig;
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]

### Hygiene

- **[overengineering · medium · small]** Simplify: `REEL_WEIGHTS` is over-engineered (`REEL_WEIGHTS`) [L22-L28]
