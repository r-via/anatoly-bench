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
- **Correction [OK]**: Iterates reelCount times, delegates to spinReel(i); _rowCount underscore prefix confirms intentional non-use consistent with a fixed 3-row engine per the reference docs.
- **Overengineering [OVER]**: Wraps a trivial 3-line loop in a class that extends an abstract factory. `_rowCount` is silently discarded, exposing that the interface was over-generalized — the real signature needed is just `(reelCount: number) => Symbol[][]`. Single importer (per usage analysis). A top-level function `buildReels(reelCount: number): Symbol[][]` eliminates the class, the inheritance, and the dead parameter.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` (a critical path), yet no tests verify reel count, row count handling, or `spinReel` integration behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its `buildReels` method. Missing explanation of why `_rowCount` is ignored, what `spinReel` does per reel index, and what the returned 2-D array represents.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is fully mutable. The arbitrated SpinResult contract specifies `ReadonlyArray<ReadonlyArray<Symbol>>`. Returning a mutable type from the factory means the boundary is unguarded until the caller freezes it. [L4-L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are exported with no JSDoc. Public API surface should document intent, parameters, and return shape. [L4-L14] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a hard-wired import with no injection seam. Unit-testing `StandardReelBuilderFactory` requires module-level mocking. Injecting a `spinReelFn` via constructor or abstract method would decouple the factory from the RNG implementation. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract contract declares `rowCount` as a meaningful parameter, but `StandardReelBuilderFactory` silently ignores it (`_rowCount`). In a 5-reel 3-row slot engine this is a hidden invariant assumption baked into the concrete class rather than enforced at the type level. The factory API implies configurability that the implementation does not provide. [L9] |

### Suggestions

- Return ReadonlyArray to align with the arbitrated SpinResult contract and prevent downstream mutation
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Inject spinReel as a dependency to improve testability
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinReelFn: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Base factory for constructing the reel grid used in a single spin.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
