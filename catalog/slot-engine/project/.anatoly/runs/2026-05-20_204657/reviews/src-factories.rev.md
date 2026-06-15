# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 55% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: `rowCount` is silently ignored — `spinReel(i)` always produces a fixed row count, violating the method signature contract. Internal docs acknowledge this but the signature promises `rowCount` is honoured.
- **Overengineering [OVER]**: Stateless class wrapping a simple loop — no fields, no lifecycle, no polymorphic swap-in (1 importer). The `rowCount` parameter is silently ignored, exposing a leaky contract. A plain exported function `buildReels(reelCount: number): Symbol[][]` would be equivalent and clearer.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` (critical path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, rowCount ignored behavior).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Critical undocumented behavior: _rowCount is silently ignored — each reel always produces a fixed row count via spinReel(). This constraint is invisible to callers without a comment.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is fully mutable. Consumers (SpinResult) declare `ReadonlyArray<ReadonlyArray<Symbol>>`. The factory should return the readonly form to prevent callers from mutating reel state. [L4-L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are public extension-point exports documented in the API reference, yet carry no JSDoc. At minimum, the abstract class and its `buildReels` contract should be documented. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a static top-level import with no injection seam. Unit-testing `StandardReelBuilderFactory` in isolation requires module-level mocking. Accepting a `spinReelFn` parameter (or a strategy) would decouple the factory from the concrete reel implementation. [L8-L16] |

### Suggestions

- Return a readonly reel grid to align with SpinResult and prevent mutation by callers.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  // and
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  // and
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Inject `spinReel` to make `StandardReelBuilderFactory` unit-testable without module mocking.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  type SpinReelFn = (index: number) => Symbol[];
  
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinReelFn: SpinReelFn = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to the exported abstract class and its contract method.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  // After
  /**
   * Extension point for reel construction. Subclass and wire into the engine
   * to supply custom reel layouts or weighted symbol distributions.
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * Build a grid of reels.
     * @param reelCount - Number of vertical reels.
     * @param rowCount  - Number of visible rows per reel.
     */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Either pass `rowCount` to `spinReel` so the returned reel respects the requested row count, or explicitly document and enforce that only `rowCount === 3` is valid (throw on other values) to prevent silent misconfiguration. [L10]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
