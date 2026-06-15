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
- **Correction [OK]**: Abstract base class with correct abstract method signature; no defects.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract base class with no runtime behavior beyond interface contract, but the contract itself is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose, contract, and intended extension pattern are not described.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `_rowCount` is silently dropped and never forwarded to `spinReel`, but `spinReel`'s signature and return shape are not shown — whether that omission produces an incorrect row count cannot be determined from available context (rule 16). Flagging the unused parameter alone is prohibited by precision guard #2.
- **Overengineering [OVER]**: Single-importer factory class wrapping a trivial loop over `spinReel`. A plain function `buildReels(reelCount, rowCount)` achieves the same with no class overhead. Factory pattern is premature with only one implementation and no interface consumers.
- **Tests [NONE]**: No test file exists. Concrete implementation used by src/engine.ts — buildReels loop logic and spinReel delegation are completely untested, including edge cases like reelCount=0 or varying rowCount.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its buildReels method. Parameters reelCount/_rowCount, return value shape, and the ignored _rowCount are unexplained.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract contract and concrete implementation return `Symbol[][]` (mutable). The arbitrated README contract specifies `SpinResult.reels` as `ReadonlyArray<ReadonlyArray<Symbol>>`. The factory should return `ReadonlyArray<ReadonlyArray<Symbol>>` so callers cannot mutate the reel grid post-construction. [L5-L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has JSDoc. At minimum the abstract class and its `buildReels` contract should document parameters and return semantics. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory.buildReels` calls `spinReel` as a hard-coded import. There is no way to inject a deterministic or mock spin function, making unit tests of this factory depend on the real RNG. A spin function dependency should be injected (constructor or parameter). [L9-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | `_rowCount` is silently ignored in `StandardReelBuilderFactory`: `spinReel(i)` receives only the reel index, never the row count. The abstract contract advertises row-count awareness but the standard implementation discards it entirely, meaning reel length is unconditionally determined inside `spinReel` with no configurability. Either remove `rowCount` from the abstract contract or pass it through to `spinReel`. [L9-L14] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` from the factory to match the downstream SpinResult contract and enforce immutability at the boundary.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Inject the spin function to decouple the factory from the live RNG and enable deterministic testing.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinFn: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to the public abstract class and its contract method.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  // After
  /** Factory base for constructing reel grids used in each spin. */
  export abstract class AbstractReelBuilderFactory {
    /**
     * Build a 2-D reel grid.
     * @param reelCount - Number of vertical reels.
     * @param rowCount  - Visible row height per reel.
     */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
