# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 85% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Loop iterates 0..reelCount-1 correctly, pushes each reel, and returns the accumulated grid. The silent discard of _rowCount is an acknowledged design constraint (ADR-002), not a logic error.
- **Overengineering [OVER]**: Wraps a trivial for-loop in a full class hierarchy. The `_rowCount` parameter is silently ignored, leaking an ill-fitting abstraction from the parent. A plain exported function `buildReels(reelCount: number): Symbol[][]` would be cleaner, directly testable, and eliminate the unused parameter without losing any capability.
- **Tests [NONE]**: No test file found. `buildReels` is called by `src/engine.ts` (a critical path), but neither happy path nor edge cases (reelCount=0, rowCount variations, spinReel output shape) are covered.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Key details missing: delegation to spinReel(i), the fact that rowCount is intentionally unused (reel height fixed implicitly at 3), and that this is the default RNG-backed implementation.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | buildReels return type is Symbol[][] (fully mutable). Callers can splice/push into the grid. ReadonlyArray<ReadonlyArray<Symbol>> prevents accidental mutation of generated state. [L10] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both AbstractReelBuilderFactory and StandardReelBuilderFactory are public exports with no JSDoc. The ADR explains the design rationale but that prose lives in docs, not in the source where tooling (TypeScript language server, typedoc) can surface it. [L4-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract contract advertises rowCount as a meaningful parameter, but StandardReelBuilderFactory silently ignores it (_rowCount). Callers have no indication the parameter is a no-op. The ADR acknowledges this as a known limitation, but code-level intent should be expressed: either document it in JSDoc on the abstract method, or remove the parameter from the concrete override signature with an override annotation explaining the constraint. [L5-L10] |

### Suggestions

- Make the return type immutable to prevent callers from mutating the generated grid
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][]`
  - After: `buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>`
- Add JSDoc to both exported classes so tooling and typedoc can surface design intent
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Contract for constructing the reel grid before payline evaluation.
   * Implement this to supply deterministic or seeded grids for replay/testing.
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * @param reelCount Number of reels (columns) in the grid.
     * @param rowCount Number of visible rows per reel.
     */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  }
  ```
- Document the unused rowCount on the concrete override to prevent silent API confusion
  ```typescript
  // Before
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  /**
   * @param _rowCount Ignored — row height is fixed at 3 by spinReel.
   */
  override buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
