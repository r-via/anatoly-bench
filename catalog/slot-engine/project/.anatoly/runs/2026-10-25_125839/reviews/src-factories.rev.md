# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 88% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | - | 85% |

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
- **Correction [OK]**: Builds reelCount reels via spinReel(i), which returns 3 symbols per call. The unused rowCount parameter is not a defect. Consumer engine.ts builds 5x3 reels, which is consistent.
- **Overengineering [OVER]**: Class wraps a loop over spinReel. A plain function buildReels(reelCount) would do. The factory pattern has one use, and the rowCount parameter is unused (_rowCount).
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The return type `Symbol[][]` is mutable. `readonly (readonly Symbol[])[]` would better express an immutable reel layout. [L4-L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `AbstractReelBuilderFactory`, `StandardReelBuilderFactory`, and `buildReels` have no JSDoc. The contract is unclear: `rowCount` is ignored, and `spinReel(i)` decides the row count. |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-couples to the module-level `spinReel` instead of injecting it. The `rowCount` parameter is silently ignored, so the abstraction's contract is not honored. |

### Suggestions

- Add JSDoc, and inject the reel spinner and honor `rowCount` for testability.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(spinReel(i));
      }
      return reels;
    }
  }
  // After
  /** Builds reels using an injected spinner. */
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (index: number, rowCount: number) => Symbol[] = spinReel) {
      super();
    }
    buildReels(reelCount: number, rowCount: number): Symbol[][] {
      return Array.from({ length: reelCount }, (_, i) => this.spin(i, rowCount));
    }
  }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
