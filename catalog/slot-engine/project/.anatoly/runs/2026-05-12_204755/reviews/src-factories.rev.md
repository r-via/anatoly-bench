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
- **Correction [OK]**: `_rowCount` is ignored when delegating to `spinReel(i)` — if `spinReel` returns a fixed-length strip this is correct; no logic error visible in this file. Flag would belong in `spinReel` if it fails to respect row count.
- **Overengineering [OVER]**: Concrete factory class with 1 importer wrapping a trivial loop over `spinReel`. The factory pattern buys nothing here — a standalone function `buildReels(reelCount, rowCount)` would be equivalent with less ceremony. Paired with the unused abstract base, the entire class hierarchy is premature abstraction.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` (critical path) but has zero coverage — neither happy path nor edge cases (reelCount=0, large values, spinReel integration) are tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Concrete implementation ignores rowCount (_rowCount) without explanation, and delegates to spinReel without documenting the resulting structure or side effects.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 6 | Interface vs Type | WARN | MEDIUM | `AbstractReelBuilderFactory` has zero concrete members — it is a pure abstraction. TypeScript convention prefers `interface` (or a structural type) over an empty abstract class for this pattern. Abstract classes carry runtime overhead (class keyword emitted to JS) and couple subclasses via `extends` rather than structural typing. [L4-L6] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) and the public method `buildReels` lack JSDoc. For a slot-machine engine this is relevant API surface. [L4-L16] |

### Suggestions

- Replace the pure-abstract class with an interface to avoid runtime class emission and allow structural typing.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  export interface ReelBuilderFactory {
    buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  
  export class StandardReelBuilderFactory implements ReelBuilderFactory {
  ```
- Add JSDoc to exported classes and the public method.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  // After
  /**
   * Base contract for all reel-building factories.
   * Implement this to provide custom reel-layout strategies.
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * Builds a 2-D reel grid.
     * @param reelCount - Number of vertical reel strips.
     * @param rowCount  - Number of visible rows per reel.
     * @returns Matrix of symbols indexed [reel][row].
     */
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
