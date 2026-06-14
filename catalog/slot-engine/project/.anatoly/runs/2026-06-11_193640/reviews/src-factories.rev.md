# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 88% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class is correctly defined with a single abstract method; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class with no runtime behavior beyond interface contract, but its concrete subclass is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Abstract factory contract — purpose, expected override behavior, and relationship to the slot machine engine are non-obvious from the name alone.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Correctly implements the abstract contract. `spinReel` is documented to return a fixed three-symbol column; `_rowCount` is intentionally ignored per TypeScript underscore convention and is consistent with spinReel's fixed output. No concrete call site in the visible context passes a rowCount that differs from 3.
- **Overengineering [OVER]**: A class wrapping a single loop over spinReel calls adds no value over a standalone function. The factory pattern is premature here: only one implementation exists, only one consumer (engine.ts::spin) uses it, and the class carries no state. A plain `buildReels(reelCount, rowCount)` function would be simpler.
- **Tests [NONE]**: No test file found. `buildReels` is consumed by the critical `spin` function in engine.ts (validates bet, evaluates paylines, handles jackpots), but no tests verify reel count, row count ignored behavior, `spinReel` delegation, or returned Symbol[][] shape.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or buildReels method. Non-obvious behavior: _rowCount is ignored, spinReel is called per reel index — these constraints and the reason rowCount is unused are undocumented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Abstract method and concrete implementation both declare return type `Symbol[][]` (mutable). The arbitrated SpinResult contract requires `ReadonlyArray<ReadonlyArray<Symbol>>` for `reels`. Declaring the factory return type as `ReadonlyArray<ReadonlyArray<Symbol>>` would propagate immutability from the source and align with the downstream contract. [L4-L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are public exports with no JSDoc. As core factory classes of a casino engine, both warrant at least a one-line summary and `@param`/`@returns` tags on `buildReels`. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a hard-coded static import with no injection point, making it impossible to substitute a deterministic stub in unit tests. Consider accepting a `reelSpinner` function as a constructor parameter or accepting it via the `buildReels` call signature. [L9-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract contract exposes `rowCount` in the signature of `buildReels`, but `StandardReelBuilderFactory` silently ignores it (`_rowCount`). In a configurable slot-machine grid (e.g. 3-row vs 4-row display), ignoring row count in the concrete factory breaks the contract implied by the abstract interface and can produce incorrectly sized reel arrays at runtime. Either the abstract signature should drop `rowCount` if it is truly not used, or `buildReels` should pass it to `spinReel`. [L9-L16] |

### Suggestions

- Align return type with arbitrated `SpinResult.reels: ReadonlyArray<ReadonlyArray<Symbol>>` contract
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Inject `spinReel` for testability instead of hard-coupling the module import
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinner: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /** Base factory for generating a set of slot-machine reels. */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
