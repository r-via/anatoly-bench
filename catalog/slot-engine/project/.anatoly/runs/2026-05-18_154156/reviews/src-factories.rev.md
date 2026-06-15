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
- **Correction [OK]**: Correctly iterates reelCount times, delegates each reel to spinReel(i). _rowCount is intentionally unused (underscore prefix), consistent with the fixed 5×3 machine documented in the reference docs — spinReel owns the row dimension.
- **Overengineering [OVER]**: Class wrapping a 4-line loop that calls `spinReel`. `_rowCount` is accepted but ignored, signalling premature generalization. With 1 importer and no interface benefit (the abstract base has 0 importers), this is a factory pattern applied where a standalone function suffices.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` (a critical path), but neither happy path (correct reel count, correct shape) nor edge cases (reelCount=0, rowCount ignored) are tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The concrete implementation silently ignores _rowCount, which is a non-obvious behavioral contract that warrants documentation. buildReels also lacks @param/@returns annotations.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract signature and concrete implementation return mutable `Symbol[][]`. The arbitrated SpinResult contract requires `ReadonlyArray<ReadonlyArray<Symbol>>` for reels; the factory should enforce this at the boundary. [L5-L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are exported without JSDoc. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory.buildReels` calls the module-level `spinReel` directly with no injection seam, so unit-testing it requires mocking the entire `reels` module rather than supplying a stub. [L9-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | `buildReels(reelCount, _rowCount)` accepts `rowCount` in the abstract contract but ignores it in the concrete implementation, passing only the reel index to `spinReel`. The engine targets a fixed 3-row layout per the API docs — if rows are not configurable, the parameter should be dropped from the interface to avoid a misleading contract. [L5-L13] |

### Suggestions

- Match the arbitrated SpinResult contract by returning readonly arrays from the factory.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  // After
  /** Base factory for constructing reel grids. Extend to supply alternative reel-building strategies. */
  export abstract class AbstractReelBuilderFactory {
  /** Default factory: spins each reel independently via `spinReel`. */
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  ```
- If rows are fixed at 3 by design, drop `rowCount` from the abstract interface to eliminate a misleading unused parameter.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number): Symbol[][];
  buildReels(reelCount: number): Symbol[][] {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
