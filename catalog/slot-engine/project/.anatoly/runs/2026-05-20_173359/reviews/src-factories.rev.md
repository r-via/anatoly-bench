# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Correctly iterates reelCount times calling spinReel(i). rowCount is intentionally ignored (documented: each reel always produces 3 rows via spinReel).
- **Overengineering [OVER]**: Class exists solely to satisfy the unnecessary abstract hierarchy. The body is a trivial loop over `spinReel(i)` — a standalone function `buildReels(reelCount: number): Symbol[][]` would be identical with no loss of expressiveness. The `rowCount` parameter is accepted but silently ignored, which is a leaky abstraction artifact of the forced interface contract.
- **Tests [NONE]**: No test file exists. Core factory used by src/engine.ts with no coverage of buildReels output shape, reelCount loop iterations, or spinReel integration.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc. Has a subtle, non-obvious behavior: `_rowCount` is silently ignored and row count is always determined by `spinReel()`. This constraint is undocumented and would surprise callers who pass a `rowCount` expecting it to be honored.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` on both `buildReels` signatures is fully mutable. `SpinResult.reels` is `ReadonlyArray<ReadonlyArray<Symbol>>` per the public API contract; the factory should return the same shape to prevent callers from mutating the grid. [L5,L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. The known quirk — `rowCount` is silently ignored in `StandardReelBuilderFactory` — is especially worth documenting. [L4,L8] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a hard-coded module-level import with no injection seam inside `StandardReelBuilderFactory`. Unit-testing `buildReels` in isolation (e.g., with a deterministic reel function) requires either module mocking or subclassing. For a regulated gambling engine, deterministic testability of reel output is important. The abstract class gives consumers an extension point but the concrete class itself is tightly coupled to the live RNG path. [L2,L9-L15] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` to match `SpinResult.reels` and prevent downstream mutation of the reel grid.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes, and document the `rowCount`-ignored quirk explicitly.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  // After
  /** Extension point for reel construction. Subclass and wire into the engine to customise reel layout. */
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  }
  
  /**
   * Default factory. Builds `reelCount` reels by calling `spinReel()` for each index.
   * NOTE: `rowCount` is intentionally ignored — each reel always yields 3 rows.
   */
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  ```
- Accept an optional `spinFn` injector so `buildReels` can be unit-tested with a deterministic reel function without module mocking.
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
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinFn: (index: number) => Symbol[] = spinReel) {
      super();
    }
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spinFn(i));
      }
      return reels;
    }
  }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
