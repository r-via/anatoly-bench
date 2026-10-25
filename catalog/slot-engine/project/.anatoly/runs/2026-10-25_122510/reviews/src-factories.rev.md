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
- **Correction [OK]**: Abstract contract only; no logic to be incorrect.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Builds reelCount reels via spinReel(i), each returning a 3-symbol column. Unused _rowCount is not a defect per guards; spinReel's fixed row count is a contract of the unseen implementation.
- **Overengineering [OVER]**: Class wraps a simple loop over spinReel. A plain function would do. `rowCount` parameter is unused. Factory pattern for single use.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type Symbol[][] is mutable; could use readonly (ReadonlyArray<ReadonlyArray<Symbol>>). [L4-L12] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither exported class nor buildReels has JSDoc. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | spinReel is imported directly and cannot be injected, so the factory is hard to test with a deterministic RNG. rowCount is ignored. |

### Suggestions

- Add JSDoc and return readonly arrays; consider rowCount usage or injecting the reel spinner
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /** Builds the reel strips for a spin. */
  export abstract class AbstractReelBuilderFactory {
    /** @returns one symbol column per reel. */
    abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
