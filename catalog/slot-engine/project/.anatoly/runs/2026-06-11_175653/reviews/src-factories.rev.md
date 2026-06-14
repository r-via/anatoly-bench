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
- **Correction [OK]**: Pure abstract class defining the factory contract; no implementation logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class with no runtime behavior beyond defining the interface, but still untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its abstract method `buildReels`. Purpose of `reelCount`/`rowCount` params and the shape of the returned `Symbol[][]` are undescribed.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `spinReel` is documented to always return exactly 3 symbols; `_rowCount` is intentionally unused (underscore prefix). No concrete call site passes a `rowCount` ≠ 3, so precision guard #2 applies — the unused parameter is not a runtime defect.
- **Overengineering [OVER]**: Factory class wrapping a trivial `for` loop over `spinReel`. With exactly 1 consumer (`engine.ts::spin`) that instantiates it directly, the factory indirection is premature. The logic fits inline in the engine or as a plain free function `buildReels(reelCount, rowCount)` without the class scaffolding.
- **Tests [NONE]**: No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts (full slot machine spin logic), yet has zero direct tests — no coverage of correct reel count, row count ignored, or `spinReel` delegation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its `buildReels` override. The silent discard of `_rowCount` and the delegation to `spinReel` are undocumented behavioural details that consumers cannot discover without reading the source.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type is `Symbol[][]` (mutable). The README-arbitrated `SpinResult.reels` contract is `ReadonlyArray<ReadonlyArray<Symbol>>`, so the factory interface should produce that type to enforce immutability at the boundary. [L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. At minimum, the abstract contract should document the expected semantics of `reelCount` and `rowCount`. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a hard-coded module-level import inside `StandardReelBuilderFactory`. Unit-testing the factory in isolation requires mocking the entire `./reels` module. Accepting a `spinReel` function via constructor injection would decouple the class and simplify testing. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: `_rowCount` is part of the abstract interface contract but silently ignored in `StandardReelBuilderFactory`. Row count is a fundamental game parameter (visible symbols per reel window). Ignoring it means the factory always produces reels of whatever fixed length `spinReel` returns, regardless of the game configuration passed by the caller. [L9] |

### Suggestions

- Change return type to match the README-arbitrated `SpinResult.reels` contract and enforce immutability at the factory boundary.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;`
- Inject `spinReel` via constructor to decouple `StandardReelBuilderFactory` from the module and enable unit testing without module mocks.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinReel: (reelIndex: number) => Symbol[]) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes documenting the factory contract and parameters.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Factory contract for generating a grid of reel symbols.
   * @param reelCount - Number of vertical reel strips.
   * @param rowCount  - Number of visible rows in the display window.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
