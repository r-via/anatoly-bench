# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | - | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class is well-formed; abstract method signature matches the concrete override.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `spinReel(i)` returns `Symbol[]` correctly assigned as a reel column; loop over `reelCount` is correct. `_rowCount` is intentionally unused (spinReel always produces 3 symbols), consistent with the underscore convention — no concrete call site is shown to pass a non-3 rowCount, so precision guard #2 applies.
- **Overengineering [OVER]**: Factory class wraps a trivial loop over `spinReel`. The `_rowCount` parameter is accepted but intentionally unused (underscore prefix), exposing a generalization that was never implemented. With 1 consumer and no polymorphism in play, this is a stateless class whose entire body could be a two-line standalone function.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract and concrete `buildReels` return `Symbol[][]`. The authoritative README interface declares `reels: ReadonlyArray<ReadonlyArray<Symbol>>`. The factory should advertise the readonly shape so callers cannot mutate reels before they reach SpinResult. [L5,L9] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are exported without JSDoc. At minimum the abstract base and its `buildReels` contract should document `reelCount` and `rowCount` semantics. [L4,L8] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-imports `spinReel` — no way to inject a mock spinner in unit tests without module-level patching. Injecting the spin function via constructor enables pure unit testing of the factory logic. [L2,L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract contract declares `rowCount` as a meaningful parameter, but `StandardReelBuilderFactory.buildReels` silently ignores it (`_rowCount`). In a slot-machine engine where row count is a core layout dimension, this creates a misleading API: callers passing `rowCount=3` vs `rowCount=5` get identical reels. Either remove `rowCount` from the abstract signature or use it in the concrete implementation. [L5,L9] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` to match the authoritative `SpinResult.reels` contract and prevent post-factory mutation.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Inject the spin function for testability instead of relying on the static import.
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
    constructor(private readonly spin: (index: number) => Symbol[] = spinReel) {
      super();
    }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      ...
      reels.push(this.spin(i));
    }
  }
  ```
- Add JSDoc to public exports.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Base factory for constructing reel grids. Implement `buildReels` to
   * produce a `reelCount × rowCount` symbol matrix.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
