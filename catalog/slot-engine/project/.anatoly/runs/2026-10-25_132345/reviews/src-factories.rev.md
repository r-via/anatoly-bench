# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | - | 88% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract class with a single abstract method signature; no logic to be incorrect.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Builds reelCount reels via spinReel(i). The unused _rowCount is not a bug: spinReel's contract fixes three symbols per reel, and the consumer (spin) builds a 5x3 grid.
- **Overengineering [OVER]**: Class wraps a loop over spinReel with no state. The `_rowCount` parameter is unused. A plain function `buildReels(reelCount)` would do. The only consumer is `spin`, so the factory pattern is premature.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable; `readonly (readonly Symbol[])[]` would express immutability. [L5-L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Two exports (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. |
| 15 | Testability | WARN | MEDIUM | `spinReel` is hard-wired, so the factory abstraction offers no injection seam for RNG or reel strips. The abstract class is the seam for swapping the whole factory, so this is only partial. [L10-L14] |
| 17 | Context-adapted rules | WARN | MEDIUM | Abstract class with a single method could be an interface. `rowCount` is ignored, so the contract is not honored: a caller passing a different row count gets the `spinReel` default. [L4-L14] |

### Suggestions

- Replace the single-method abstract class with an interface, and drop or use the ignored `rowCount`.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /** Builds a grid of reels. */
  export interface ReelBuilderFactory {
    buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  }
  ```
- Alias the imported `Symbol` type to avoid shadowing the global `Symbol`.
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { Symbol as ReelSymbol } from "./types.js";`
- Add JSDoc to the exported classes.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  // After
  /** Builds reels by spinning each reel index with `spinReel`. */
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
