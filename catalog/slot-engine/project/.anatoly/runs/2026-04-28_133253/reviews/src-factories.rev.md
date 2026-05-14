# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 85% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | - | 80% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Implementation correctly satisfies the abstract contract: iterates 0..reelCount-1 and delegates each reel to spinReel(i). The ignored _rowCount is an explicitly documented and accepted design consequence (ADR-002). No logic errors or type mismatches visible. Any RNG-correctness concerns live in spinReel (src/reels.ts), not here.
- **Overengineering [OVER]**: A four-line for-loop wrapped in a class that extends an abstract base with 0 importers. With only 1 runtime importer and no consumer ever referencing the abstract type, the class hierarchy delivers no polymorphism in practice. ADR-002 justifies the factory pattern for future test-double scenarios, but since AbstractReelBuilderFactory itself has 0 importers those scenarios have not been acted upon. A standalone function `buildReels(reelCount: number): Symbol[][]` would be equally extensible and easier to swap in tests via module mocking, without the class indirection ADR-002 itself flags as a negative consequence.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The return type of `buildReels` is `Symbol[][]` (mutable). Callers could accidentally mutate the reel grid. Prefer `readonly Symbol[][]` or `ReadonlyArray<ReadonlyArray<Symbol>>` to enforce immutability at the boundary, which is especially important given the gambling domain where grid integrity after construction is a correctness invariant. [L4-L16] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported classes (`AbstractReelBuilderFactory` and `StandardReelBuilderFactory`) lack JSDoc documentation. The abstract class in particular defines the public contract used by the engine and test doubles, and should document the semantics of `reelCount` and `rowCount` (especially since `rowCount` is intentionally ignored per ADR-002, which is non-obvious to consumers). [L4-L16] |

### Suggestions

- Add JSDoc to both exported classes to document the contract, especially the semantics of the unused `rowCount` parameter which is non-obvious to consumers.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Abstract factory for constructing the reel grid prior to payline evaluation.
   * Implement this class to provide alternative generation strategies (e.g. seeded/deterministic grids for replay or certification).
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * Build the reel grid.
     * @param reelCount - Number of reels (columns) to generate.
     * @param rowCount - Number of visible rows per reel. Implementations may ignore this if reel height is fixed internally.
     * @returns A 2-D array of symbols indexed by [reelIndex][rowIndex].
     */
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  ```
- Return a readonly type from `buildReels` to prevent callers from accidentally mutating the generated reel grid, which is important for grid integrity in the gambling engine.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  // ...
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  // ...
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
