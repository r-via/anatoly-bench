# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Valid abstract class definition; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class with no runtime logic, but its contract is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose, contract, and intended extension points are not described.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Correctly iterates reelCount, calls spinReel(i) per column, and returns Symbol[][]. _rowCount is unused but spinReel's signature takes only reelIndex and returns a fixed-length Symbol[], so rowCount cannot be forwarded — the defect, if any, lives in spinReel, not here (rule 10). Precision guard 2 also applies.
- **Overengineering [OVER]**: Factory pattern for a trivial loop over `spinReel`. Only 1 importer; a plain function would suffice. The Factory wrapping adds a class instantiation ceremony around 4 lines of logic.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts (critical path), yet buildReels loop logic and spinReel integration are completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or `buildReels` method. The `_rowCount` parameter being ignored is a non-obvious behavior that warrants documentation.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | buildReels returns mutable Symbol[][], but the arbitrated SpinResult contract specifies reels: ReadonlyArray<ReadonlyArray<Symbol>>. The factory should emit the readonly shape directly to avoid a silent widening at the call site. [L5,L10] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported classes (AbstractReelBuilderFactory, StandardReelBuilderFactory) and the public buildReels method lack JSDoc. In a regulated gambling engine, documenting the factory contract and the semantics of reelCount/rowCount is especially important. [L4,L9] |
| 15 | Testability | WARN | MEDIUM | spinReel is a hard module-level import with no injection seam. In a regulated gambling context, deterministic unit tests require the ability to substitute the reel-spin function. Accepting a reel-spin callable via constructor or method parameter would decouple the factory from its RNG dependency. [L2,L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | LSP violation: the abstract signature declares rowCount as a meaningful parameter, but StandardReelBuilderFactory silently ignores it (_rowCount). In a slot-machine engine, row count governs the visible window (e.g. 3-row vs 4-row display) and affects payline evaluation. Ignoring it breaks the factory contract and could produce incorrect grids if a subclass consumer passes a non-default rowCount. [L5,L10] |

### Suggestions

- Return readonly reel array to match the arbitrated SpinResult contract and enforce immutability at the boundary.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Inject the reel-spin function to decouple the factory from the RNG module and enable deterministic testing.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
      ...
      reels.push(spinReel(i));
    }
  }
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinFn: (index: number) => Symbol[] = spinReel) {}
  
    buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      return Array.from({ length: reelCount }, (_, i) => this.spinFn(i));
    }
  }
  ```
- Add JSDoc to both exported classes documenting the factory contract.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Base factory for constructing reel grids.
   * Implementations must produce a grid of `reelCount` reels each with `rowCount` visible symbols.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
