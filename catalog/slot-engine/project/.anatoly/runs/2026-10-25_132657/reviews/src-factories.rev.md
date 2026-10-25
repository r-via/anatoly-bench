# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | - | 85% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with no logic — nothing to evaluate for correctness.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: rowCount is silently ignored; spinReel always returns 3 symbols regardless of rowCount, so builds with rowCount != 3 silently produce wrong-sized reels.
- **Overengineering [OVER]**: A class wrapping a trivial loop over `spinReel(i)`. The `_rowCount` parameter is accepted but silently ignored, indicating premature generalization. The whole thing reduces to `Array.from({length: reelCount}, (_, i) => spinReel(i))` — a single-line function needs no factory class or inheritance.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 10/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable. `readonly Symbol[][]` or `ReadonlyArray<ReadonlyArray<Symbol>>` would signal caller intent. [L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Two exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. Under the 3-export threshold for FAIL. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is hard-wired via module import inside `StandardReelBuilderFactory`. The abstract base class provides an injection seam (consumers depend on `AbstractReelBuilderFactory`), so a pure/mock path exists at the type level, but the concrete class itself cannot be unit-tested without module mocking. [L12] |

### Suggestions

- Make return type readonly to communicate immutability intent to callers
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][]`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>`
- Add JSDoc to both exported classes
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /** Base factory for constructing reel layouts. Subclass to provide custom reel-spinning strategies. */
  export abstract class AbstractReelBuilderFactory {
    /** Returns a 2-D grid of symbols: reelCount columns, each populated by the implementing strategy. */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  }
  ```
- Inject the spinReel function to enable unit testing without module mocking
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: typeof spinReel = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Either enforce that rowCount must equal 3 (throw if not) or update spinReel to accept and respect a rowCount parameter, so buildReels honors the rowCount contract it exposes. [L10]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
