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
- **Correction [OK]**: Abstract base class correctly declares buildReels contract; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class with no runtime behavior beyond defining the interface, but still warrants contract testing via its concrete subclass.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract class purpose, contract, and expected subclass behavior are not described.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Implementation correctly delegates to spinReel per reel index. _rowCount intentionally unused (style convention, not a defect per precision guard rule 2); TypeScript allows assigning Symbol[][] to ReadonlyArray<ReadonlyArray<Symbol>> so no type mismatch with SpinResult.
- **Overengineering [OVER]**: Factory class with 1 importer wrapping a trivial loop over `spinReel`. The factory pattern is unjustified here — a plain function `buildReels(reelCount, rowCount)` would be simpler and sufficient.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts, making this a critical path. buildReels logic (reel count loop, spinReel calls, returned 2D array shape) is completely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its `buildReels` method. Parameters `reelCount` and `_rowCount` (notably unused) are unexplained, and return value semantics are undocumented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Abstract method and concrete implementation return mutable Symbol[][] rather than ReadonlyArray<ReadonlyArray<Symbol>>. The arbitrated SpinResult contract specifies reels as ReadonlyArray<ReadonlyArray<Symbol>>; expressing that intent at the factory boundary avoids accidental post-construction mutation. [L5-L6] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported symbols (AbstractReelBuilderFactory, StandardReelBuilderFactory) lack JSDoc. At minimum the abstract contract and the _rowCount omission rationale should be documented. [L4-L15] |
| 15 | Testability | WARN | MEDIUM | StandardReelBuilderFactory hard-wires spinReel via module-level import; unit-testing with deterministic reel outcomes requires module mocking. Injecting a reel-spin function as a constructor parameter or accepting a strategy object would enable pure-function testing without mocking. [L9-L16] |

### Suggestions

- Return ReadonlyArray to match the arbitrated SpinResult contract and prevent post-construction mutation
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Inject reel-spin function for testability instead of hard-coding the import
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
    constructor(private readonly spin: (index: number) => ReadonlyArray<Symbol> = spinReel) {}
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      ...
      reels.push(this.spin(i));
    }
  }
  ```
- Add JSDoc to both exported classes
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Contract for reel-grid construction. Extend to supply alternative reel sources
   * (e.g. server-seeded, test-fixed).
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
