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
- **Correction [OK]**: Abstract class with a single abstract method; no logic to be incorrect.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Builds reelCount reels by calling spinReel(i) for each index. Unused _rowCount is not a defect, because spinReel returns the fixed 3 visible rows. This matches the 5x3 grid the caller builds.
- **Overengineering [OVER]**: Factory class wraps a loop over spinReel and has no state. `_rowCount` is unused. A plain function `buildReels(reelCount)` would do. The only consumer is spin().
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable; `readonly (readonly Symbol[])[]` would express immutability intent. [L4-L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `AbstractReelBuilderFactory`, `buildReels` and `StandardReelBuilderFactory` have no JSDoc. [L4-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | `rowCount` is ignored, so the contract is misleading. `StandardReelBuilderFactory` produces reels from the reel index alone and silently disregards the requested row count. [L8-L14] |

### Suggestions

- Add JSDoc and document that `rowCount` is ignored, or use it.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /** Builds the reel grid for a spin. */
  export abstract class AbstractReelBuilderFactory {
    /** @param reelCount number of reels @param rowCount visible rows per reel */
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  ```
- Rename the imported `Symbol` type to avoid shadowing the global.
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { Symbol as ReelSymbol } from "./types.js";`

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
