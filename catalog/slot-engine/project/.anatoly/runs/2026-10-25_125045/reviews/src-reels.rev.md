# Review: `src/reels.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| SYMBOLS | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| ReelWeightConfig | type | no | OK | LEAN | USED | UNIQUE | - | 88% |
| DEFAULT_WEIGHTS | constant | no | OK | LEAN | USED | UNIQUE | - | 70% |
| weightsToArray | function | no | OK | LEAN | USED | UNIQUE | - | 87% |
| REEL_WEIGHTS | constant | no | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| pickFromWeighted | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| spinReel | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| getReelSymbols | function | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| getReelWeights | function | yes | OK | LEAN | USED | UNIQUE | - | 92% |

### Details

#### `SYMBOLS` (L3–L5)

- **Utility [USED]**: Referenced by pickFromWeighted (via spinReel) and getReelSymbols, both exported and consumed downstream.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Eight symbols defined; order is consistent with weightsToArray and pickFromWeighted usage.
- **Overengineering [LEAN]**: Simple flat array of string literals; minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `ReelWeightConfig` (L7–L10)

- **Utility [USED]**: Used as type annotation for DEFAULT_WEIGHTS constant and weightsToArray parameter.
- **Duplication [UNIQUE]**: No similar interface found in the codebase.
- **Correction [OK]**: Interface keys exactly mirror the SYMBOLS array order; no structural defect.
- **Overengineering [LEAN]**: Auto-resolved: type cannot be over-engineered
- **Tests [-]**: *(not evaluated)*

#### `DEFAULT_WEIGHTS` (L12–L15)

- **Utility [USED]**: Referenced 5 times in REEL_WEIGHTS initialization via weightsToArray.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Weights sum to 120; DIAMOND is the highest-weight symbol at 30/120 = 25%, which is suspicious for a high-value symbol, but without the paytable constants in this file rule 12's self-validation cannot complete — abstaining per the abstention clause.
- **Overengineering [LEAN]**: Straightforward data literal; complexity is inherited from ReelWeightConfig, not introduced here.
- **Tests [-]**: *(not evaluated)*

#### `weightsToArray` (L17–L20)

- **Utility [USED]**: Called 5 times to build REEL_WEIGHTS array from DEFAULT_WEIGHTS.
- **Duplication [UNIQUE]**: No similar function found per RAG results.
- **Correction [OK]**: Projection order matches SYMBOLS declaration exactly; no misalignment.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `REEL_WEIGHTS` (L22–L28)

- **Utility [USED]**: Referenced by spinReel and getReelWeights, both consumed downstream.
- **Duplication [UNIQUE]**: No similar constant found in the codebase.
- **Correction [OK]**: Five independent arrays allocated; each call to weightsToArray returns a new array so reels do not share a reference.
- **Overengineering [ACCEPTABLE]**: Five entries with identical weights is slightly redundant, but per-reel weight differentiation is a legitimate slot-machine requirement. The repetition is low-cost and the structure supports future divergence without refactoring.
- **Tests [-]**: *(not evaluated)*

#### `pickFromWeighted` (L30–L41)

- **Utility [USED]**: Called inside spinReel to produce each symbol on a column.
- **Duplication [DUPLICATE]**: Identical algorithm: compute total weight, roll Math.random() * total, accumulate until threshold, return last item as fallback. Only differences are variable names (total/totalWeight, r/roll, acc/cumulative) and type constraint (Symbol[] vs generic T[]). Logic is fully interchangeable.
- **Correction [OK]**: Standard weighted-selection: r ∈ [0, total) guarantees the loop always fires; fallback to last element is unreachable but harmless.
- **Overengineering [LEAN]**: Standard O(n) weighted-random selection; correct and minimal for this use case.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/rng.ts:weightedPick` — 95% identical logic — same weighted random selection algorithm with identical structure; weightedPick is generic (T) while pickFromWeighted is typed to Symbol[]

#### `spinReel` (L43–L50)

- **Utility [USED]**: Runtime-imported by src/factories.ts.
- **Duplication [UNIQUE]**: No similar function found per RAG results.
- **Correction [OK]**: Generates 3 independent weighted picks per reel column; no concrete caller passes an out-of-bounds reelIndex (precision guard 1).
- **Overengineering [LEAN]**: Straightforward loop generating 3 symbols per reel column.
- **Tests [-]**: *(not evaluated)*

#### `getReelSymbols` (L52–L54)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns internal array reference; no concrete consumer shown mutating it.
- **Overengineering [LEAN]**: Simple accessor; justified by consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

#### `getReelWeights` (L56–L58)

- **Utility [USED]**: Runtime-imported by src/engine.ts and consumed inside spin().
- **Duplication [UNIQUE]**: Trivial accessor; no similar function found.
- **Correction [OK]**: Returns internal weights reference; no concrete consumer shown mutating it, and no out-of-bounds caller evidenced.
- **Overengineering [LEAN]**: Simple accessor; justified by consumer in engine.ts.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 4 | Utility types | WARN | MEDIUM | `ReelWeightConfig` manually enumerates all 8 symbol keys as `number` properties. `Record<Symbol, number>` eliminates the duplication and keeps the type in sync with the `Symbol` union automatically. [L10-L13] |
| 5 | Immutability | WARN | MEDIUM | `SYMBOLS`, `DEFAULT_WEIGHTS`, and `REEL_WEIGHTS` are module-level constants but are fully mutable. A caller or future maintainer can splice `SYMBOLS` or reassign a `REEL_WEIGHTS` entry and silently corrupt all subsequent spins. [L3-L25] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spinReel`, `getReelSymbols`, and `getReelWeights` are all exported with no JSDoc. Parameter semantics (e.g., valid range of `reelIndex`) are undocumented. [L41-L57] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `spinReel(reelIndex)` and `getReelWeights(reelIndex)` perform no bounds check. When `reelIndex >= 5`, `REEL_WEIGHTS[reelIndex]` is `undefined`; `pickFromWeighted` then calls `undefined.reduce(...)`, throwing a `TypeError` at runtime with no descriptive error. [L41-L51] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain inferred from CHERRY/LEMON/BELL/BAR/SEVEN/DIAMOND/WILD/SCATTER symbol vocabulary and sibling files `jackpot.ts`, `freespin.ts`, `paytable.ts`. `Math.random()` is a non-cryptographic PRNG (Xorshift128+ in V8) that is not certifiable for regulated gaming RNG — it is predictable, seeded from observable entropy, and does not meet GLI/BMM/iTech Labs requirements. The project already has a dedicated `rng.ts` module that is bypassed here. [L34] |
| 15 | Testability | WARN | MEDIUM | `pickFromWeighted` calls `Math.random()` directly with no injection point. Testing deterministic spin outcomes requires `jest.spyOn(Math, 'random')` or equivalent global mutation. The project's `rng.ts` module was likely designed to isolate this dependency but is not used here. [L30-L39] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `DEFAULT_WEIGHTS` could use `satisfies ReelWeightConfig` to catch missing/extra keys at the assignment site while retaining a narrower literal type for `weightsToArray`. `SYMBOLS` could use `as const` to narrow the tuple type. [L16-L19] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot engine context: `spinReel` and `getReelWeights` accept any integer without validating against `REEL_WEIGHTS.length`, silently propagating `undefined` weights. Additionally, the project provides `rng.ts` as the canonical randomness abstraction; bypassing it here fragments RNG governance across the codebase. [L41-L57] |

### Suggestions

- Replace Math.random() with the project's rng.ts module to satisfy regulated gaming RNG requirements and improve testability.
  ```typescript
  // Before
  import type { Symbol } from "./types.js";
  
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = Math.random() * total;
  // After
  import type { Symbol } from "./types.js";
  import { random } from "./rng.js";
  
  function pickFromWeighted(items: Symbol[], wts: number[]): Symbol {
    const total = wts.reduce((s, w) => s + w, 0);
    const r = random() * total;
  ```
- Use Record<Symbol, number> for ReelWeightConfig to eliminate manual key enumeration.
  ```typescript
  // Before
  interface ReelWeightConfig {
    CHERRY: number; LEMON: number; BELL: number; BAR: number;
    SEVEN: number; DIAMOND: number; WILD: number; SCATTER: number;
  }
  // After
  type ReelWeightConfig = Record<Symbol, number>;
  ```
- Mark module-level constants readonly to prevent accidental mutation.
  ```typescript
  // Before
  const SYMBOLS: Symbol[] = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ];
  
  const DEFAULT_WEIGHTS: ReelWeightConfig = { ... };
  
  const REEL_WEIGHTS: number[][] = [ ... ];
  // After
  const SYMBOLS: readonly Symbol[] = [
    "CHERRY", "LEMON", "BELL", "BAR", "SEVEN", "DIAMOND", "WILD", "SCATTER",
  ] as const;
  
  const DEFAULT_WEIGHTS: Readonly<ReelWeightConfig> = { ... } satisfies ReelWeightConfig;
  
  const REEL_WEIGHTS: ReadonlyArray<readonly number[]> = [ ... ];
  ```
- Add bounds guard to spinReel and getReelWeights to surface invalid indices as descriptive errors rather than undefined-propagation crashes.
  ```typescript
  // Before
  export function spinReel(reelIndex: number): Symbol[] {
    const weights = REEL_WEIGHTS[reelIndex];
  // After
  export function spinReel(reelIndex: number): Symbol[] {
    if (reelIndex < 0 || reelIndex >= REEL_WEIGHTS.length) {
      throw new RangeError(`reelIndex ${reelIndex} out of bounds [0, ${REEL_WEIGHTS.length - 1}]`);
    }
    const weights = REEL_WEIGHTS[reelIndex];
  ```

## Actions

### Refactors

- **[duplication · high · small]** Deduplicate: `pickFromWeighted` duplicates `weightedPick` in `src/rng.ts` (`pickFromWeighted`) [L30-L41]
