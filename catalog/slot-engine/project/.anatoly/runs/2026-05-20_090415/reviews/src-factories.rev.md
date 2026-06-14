# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |
| StandardReelBuilderFactory | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Implementation is correct; _rowCount is intentionally ignored per internal docs (spinReel always produces 3 rows).
- **Overengineering [ACCEPTABLE]**: Simple loop over `spinReel(i)` — the implementation itself is minimal. The class wrapper adds ceremony over a bare function, but the factory pattern is explicitly documented as an extension point for library authors. Ignoring `_rowCount` is a known limitation, not added complexity.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts (critical path), but buildReels — including loop logic, reelCount/rowCount handling, and spinReel integration — has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its buildReels method. Notable behavior — rowCount is silently ignored, each reel always yields 3 rows via spinReel() — is undocumented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable. Downstream consumers (`detectScatters`, `isJackpotHit`) accept `ReadonlyArray<ReadonlyArray<Symbol>>`. The abstract method and both implementations should return the readonly variant to prevent accidental mutation after construction. [L4-L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are public extension-point exports listed in the API reference but carry no JSDoc. At minimum, the abstract class and its abstract method should document the contract (`reelCount`, `rowCount`, return shape). [L4-L15] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-imports `spinReel` from `./reels.js` with no injection point. Unit-testing the factory in isolation requires module mocking. Accepting a `reelSpinner` callable in the constructor would decouple it cleanly. [L9-L15] |

### Suggestions

- Return readonly arrays to prevent post-construction mutation and align with downstream consumers.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Accept a reel-spinner dependency to improve testability.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly reelSpinner: (index: number) => Symbol[] = spinReel) { super(); }
  
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  ```
- Add JSDoc to the abstract class and its method.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Extension point for reel construction strategies.
   * Subclass and wire into the engine to customise reel generation.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
