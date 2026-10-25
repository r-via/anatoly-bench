# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | - | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no implementation logic; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: rowCount is silently ignored: spinReel returns a fixed 3-symbol array regardless of rowCount, so callers requesting a different row count get wrong reel dimensions.
- **Overengineering [OVER]**: Wraps a trivial loop over `spinReel` calls in a class that exists solely to satisfy an unnecessary abstract base. The entire body is 5 lines that could be a plain exported function `buildReels(reelCount, rowCount)` with no loss of expressiveness. The factory-class pattern here provides no polymorphism, no DI seam, and no lifecycle — only ceremony.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` could be `readonly Symbol[][]` to signal callers should not mutate the result. The mutable accumulator pattern during construction is fine. [L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has JSDoc. The contract of `rowCount` in `buildReels` is particularly opaque — the abstract signature advertises it, but the standard implementation silently ignores it, which consumers cannot infer without reading both classes. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is imported directly with no injection point. Testing `StandardReelBuilderFactory.buildReels` requires the real `spinReel` implementation. Accepting a `spinFn` via constructor or method parameter would allow unit isolation. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | `AbstractReelBuilderFactory.buildReels` declares `rowCount` as a required parameter, but `StandardReelBuilderFactory` silently ignores it (prefixed `_rowCount`). In a slot-engine context where row count directly affects grid layout, this mismatch between the abstract contract and the concrete implementation is a design smell that should at minimum be documented. [L5-L10] |

### Suggestions

- Mark the return type readonly to prevent accidental mutation by callers
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][]`
  - After: `buildReels(reelCount: number, _rowCount: number): readonly Symbol[][]`
- Inject spinReel to decouple the factory from the concrete reel implementation and enable unit testing
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinFn: (reelIndex: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): readonly Symbol[][] {
  ```
- Add JSDoc to both exported classes documenting the rowCount contract
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Base factory for producing a slot machine reel grid.
   * @param reelCount - Number of vertical reel strips
   * @param rowCount - Number of visible rows per reel (may be ignored by simple implementations)
   */
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): readonly Symbol[][];
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Pass rowCount to spinReel (or slice/extend its output) so buildReels respects the requested row dimension. At minimum, validate that rowCount matches spinReel's fixed output length and throw if they diverge. [L12]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
