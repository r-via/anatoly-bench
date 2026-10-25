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
- **Correction [OK]**: Abstract class with a single abstract method; no logic to be incorrect.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Builds one reel per index via spinReel(i). The unused `_rowCount` parameter is not a defect: spinReel is documented to return three symbols per reel, and the caller builds a 5x3 grid.
- **Overengineering [OVER]**: Factory class wraps a loop over spinReel and has one importer. A plain function would do. Unused _rowCount parameter exists only to satisfy the abstract signature.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable; `ReadonlyArray<ReadonlyArray<Symbol>>` would express intent. The local `reels` array is built locally, not a mutated parameter. [L4-L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported abstract class and concrete factory lack JSDoc. `rowCount` is ignored by the standard implementation, and the contract of `spinReel(i)` (reel index as the argument) is not documented. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is hard-wired as a module import, so the factory cannot be tested with a deterministic reel source without module mocking. An injected reel-spinner function would fix this. The abstract class does give a seam at the factory level. [L2-L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Abstract class with a single abstract method could be an interface or function type. The `rowCount` parameter is accepted but ignored, so the contract is misleading for a slot engine. [L4-L11] |

### Suggestions

- Inject the reel spinner and document the factory
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  /** Builds reels by spinning each reel index with the supplied spinner. */
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  ```
- Use an interface for the single-method contract
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  export interface ReelBuilderFactory {
    buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
