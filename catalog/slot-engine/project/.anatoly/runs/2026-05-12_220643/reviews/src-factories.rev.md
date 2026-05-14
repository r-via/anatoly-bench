# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 65% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: `_rowCount` is silently discarded; `spinReel` receives only a reel index, so callers requesting a specific row depth get no guarantee the returned Symbol[] arrays honor that length.
- **Overengineering [OVER]**: Class wrapping a trivial for-loop over spinReel, with only 1 importer. The buildReels logic is a 4-line function; a class hierarchy adds no value. The _rowCount parameter is silently ignored, hinting the abstraction was designed for a flexibility that never materialized.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` (core engine path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, varying rowCount) are verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. `_rowCount` is silently ignored — a critical behavioral detail that must be documented for callers.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | buildReels returns mutable Symbol[][]. The README-mandated SpinResult.reels is ReadonlyArray<ReadonlyArray<Symbol>>; the factory output should match that shape at the type level. [L5-L6] |
| 9 | JSDoc on public exports | WARN | MEDIUM | AbstractReelBuilderFactory and StandardReelBuilderFactory are exported without JSDoc. Purpose, parameter semantics (reelCount, rowCount), and return contract are undocumented. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | spinReel is a statically-imported module-level dependency with no injection point. Unit-testing StandardReelBuilderFactory requires module-level mocking. A constructor parameter for the spin function would decouple it cleanly. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: rowCount (visible symbol rows per reel — typically 3) is accepted by the abstract interface but silently ignored by the concrete implementation. Row count determines the visible grid window and which paylines are evaluated; discarding it without delegating to spinReel or documenting the assumption is a latent correctness risk. [L9-L14] |

### Suggestions

- Return ReadonlyArray to match SpinResult.reels convention from README
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][]`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>`
- Inject the spin function to decouple the factory from its dependency and enable unit testing without module mocking
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (reelIndex: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Abstract factory for building reel grids. Extend to customise spin behaviour.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Forward `rowCount` to `spinReel` (or a windowing helper) so the returned Symbol[][] arrays contain exactly `rowCount` symbols per reel, honouring the contract declared by the abstract method signature. [L9]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
