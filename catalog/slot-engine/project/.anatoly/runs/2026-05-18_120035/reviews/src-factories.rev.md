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
- **Correction [OK]**: `_rowCount` is intentionally unused (underscore convention); the engine is documented as a fixed 5×3 machine, so `spinReel(i)` returning a fixed-length column is consistent with the spec.
- **Overengineering [OVER]**: Class wrapper around a trivial `for` loop calling `spinReel`. The `_rowCount` parameter is intentionally unused (underscore-prefixed), exposing that the generalized signature was never warranted. A plain exported function `buildReels(reelCount: number): Symbol[][]` would be identical in behavior with no abstraction overhead. The class exists solely to satisfy the unnecessary abstract base above it.
- **Tests [NONE]**: No test file found. buildReels is used by src/engine.ts (critical path) but has zero test coverage — reelCount loop behavior, spinReel integration, and return shape are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. 'buildReels' silently ignores '_rowCount', which is non-obvious behavior that warrants documentation. No description of how spinReel is used per reel index or what the output represents.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type is mutable Symbol[][] but SpinResult.reels is ReadonlyArray<ReadonlyArray<Symbol>> per the arbitrated contract. The factory should signal immutability at the boundary. [L5-L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both AbstractReelBuilderFactory and StandardReelBuilderFactory are exported with no JSDoc. At minimum, the abstract contract and the concrete implementation's reel-count behaviour should be documented. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | StandardReelBuilderFactory directly imports and calls spinReel with no injection point. Unit tests cannot substitute a deterministic reel without mocking the module. A constructor-injectable SpinFn would decouple the factory from the RNG. [L9-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract method declares rowCount but StandardReelBuilderFactory ignores it entirely (_rowCount). If spinReel always returns a fixed 3-row grid, the parameter is a leaky abstraction in the interface. Either enforce rowCount in spinReel or remove it from the abstract signature. [L9-L10] |

### Suggestions

- Return a readonly type to match the SpinResult contract and signal immutability at the factory boundary.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][]`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>`
- Inject the spin function to decouple the factory from the RNG and improve testability.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(spinReel(i));
      }
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spin(i));
      }
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /** Base factory for constructing the reel grid before each spin. */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
