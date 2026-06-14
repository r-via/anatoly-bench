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
- **Correction [OK]**: Abstract base class with a single abstract method; no implementation to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class with no runtime behavior beyond interface contract, but concrete subclasses are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract base class with non-obvious contract (what constitutes a valid reel, what reelCount/rowCount mean) warrants documentation.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `_rowCount` is intentionally suppressed per underscore convention; `spinReel(i)` receives the reel index and returns `Symbol[]`. No concrete call path in the visible code demonstrates a wrong-dimension or incorrect-type result.
- **Overengineering [OVER]**: Concrete factory class with only 1 consumer. Its entire body is a loop over `spinReel` — trivially expressible as a standalone function. The class exists only to satisfy the unnecessary abstract base.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` (core path) but has zero coverage — reel count loop, `spinReel` delegation, and `_rowCount` being unused are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. `_rowCount` is ignored silently — a noteworthy behavioral constraint that should be documented. Neither the class nor `buildReels` carry any doc comment.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type is `Symbol[][]` (mutable). The README-specified `SpinResult.reels` is `ReadonlyArray<ReadonlyArray<Symbol>>`. The factory should declare its return as `ReadonlyArray<ReadonlyArray<Symbol>>` so downstream consumers cannot mutate reel state post-construction. [L5-L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. In a regulated gambling context, documenting the contract of the reel-building abstraction is especially important. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-imports and calls `spinReel` directly with no injection seam. In a certified gaming context, deterministic unit testing of the factory requires the RNG to be injectable. Consider accepting a `spinFn` dependency via constructor. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | `_rowCount` is declared in the abstract contract but silently discarded in the concrete implementation — `spinReel(i)` never receives it. In a slot machine engine, row count determines the visible symbol window per reel. The concrete factory producing reels without respecting rowCount means the abstraction's contract is broken for any factory that actually needs it. [L9-L15] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` to match the `SpinResult.reels` contract and prevent post-construction mutation.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Inject the spin function for deterministic testability.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinFn: (reelIndex: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /** Factory abstraction for constructing reel symbol grids.
   * @param reelCount - number of vertical reels
   * @param rowCount - visible symbol rows per reel
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
