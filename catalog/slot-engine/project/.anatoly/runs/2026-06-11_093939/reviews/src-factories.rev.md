# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 82% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract class defines a single abstract method with no logic; nothing to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class with no runtime behavior beyond contract definition, but the concrete subclass is also untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose of the abstract factory, expected usage, and the semantics of reelCount/rowCount parameters are not described.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `_rowCount` is ignored and `spinReel` receives only the reel index, but without `spinReel`'s implementation the behavior of row-count omission cannot be confirmed as wrong. Per precision guard 2, an underscore-prefixed unused parameter is not a correctness finding absent a concrete failing call path. Loop correctly iterates 0..reelCount-1 and accumulates results.
- **Overengineering [OVER]**: Concrete factory with only 1 importer. The class wraps a trivial loop over `spinReel` — no state, no config, no alternate implementations. A plain function would be sufficient; the factory pattern is premature generalization.
- **Tests [NONE]**: No test file exists. buildReels is used by src/engine.ts (core path) but has zero coverage — reel count iteration, spinReel delegation, and return shape are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. No explanation of how reels are built, why _rowCount is ignored, or what the returned Symbol[][] represents.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type is mutable `Symbol[][]`. The README-arbitrated SpinResult contract requires `ReadonlyArray<ReadonlyArray<Symbol>>`. Returning a mutable array lets callers accidentally mutate reel state before it reaches SpinResult. [L10-L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` (both exported) carries a JSDoc comment. The abstract `buildReels` method contract is undocumented. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-imports `spinReel` with no injection seam. Unit-testing the factory in isolation requires mocking the module. A constructor-injected `spinReelFn` parameter would decouple the factory from the concrete reel implementation. [L9-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract method declares `rowCount: number` as a used parameter, but the only concrete implementation ignores it (`_rowCount`). This breaks Liskov's substitution intent: the abstract contract promises row-aware reel building, yet the standard implementation silently drops the dimension. Either remove `rowCount` from the abstract signature or implement it. [L5-L15] |

### Suggestions

- Return ReadonlyArray to match the arbitrated SpinResult contract and prevent downstream mutation
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Inject spinReel as a constructor dependency to enable unit testing without module-level mocking
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(spinReel(i));
      }
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinReelFn: typeof spinReel = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      const reels: Array<ReadonlyArray<Symbol>> = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spinReelFn(i));
      }
  ```
- Add JSDoc to both exported classes
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /** Base factory for constructing the reel grid at the start of each spin. */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
