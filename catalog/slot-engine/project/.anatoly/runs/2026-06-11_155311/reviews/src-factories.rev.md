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
- **Correction [OK]**: Abstract base with a single abstract method; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists for this source file.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The abstract factory pattern and the contract of buildReels (what reelCount/rowCount mean, what the returned Symbol[][] represents) are not described.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `spinReel` returns a fixed 3-symbol column; `_rowCount` is correctly underscore-prefixed as intentionally unused given the delegate's fixed output arity. Loop and return are correct.
- **Overengineering [OVER]**: Sole concrete implementation of `AbstractReelBuilderFactory`, consumed by exactly one caller (`engine.ts::spin`). The class wraps a `for` loop over `spinReel`, providing no state, no injection point, and no configurability beyond what a plain function would offer. A free function `buildReels(reelCount, rowCount)` would be equivalent with zero overhead.
- **Tests [NONE]**: No test file exists. buildReels is consumed by the critical spin() function in engine.ts but has zero direct test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or buildReels. Notable behavior — _rowCount is silently ignored — is undocumented, which is a meaningful omission for consumers.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is fully mutable. Per the README-defined SpinResult contract, reels flow into `ReadonlyArray<ReadonlyArray<Symbol>>`. Declaring the return type as `ReadonlyArray<ReadonlyArray<Symbol>>` here enforces the invariant at the factory boundary rather than relying on the consumer to widen it correctly. [L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has a JSDoc block. Both are public exports consumed by engine.ts. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a hardcoded static import with no injection seam. Unit-testing `StandardReelBuilderFactory` requires module-level mocking of `./reels.js`. Accepting a `spinReel` function via constructor parameter (or a protected method) would allow deterministic testing without mocking infrastructure. [L2,L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract interface declares `rowCount` as a meaningful parameter, but `StandardReelBuilderFactory.buildReels` silently ignores it (prefixed `_rowCount`). In a casino slot-machine engine, row count drives the visible grid height and is material to game behaviour. Callers passing different `rowCount` values receive identical output, which is a design smell that should at minimum be documented in JSDoc or enforced via an assertion. [L9] |

### Suggestions

- Enforce immutability at the factory boundary to match the SpinResult contract
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Add an injection seam for spinReel to enable deterministic unit tests
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(spinReel(i));
      }
      return reels;
    }
  }
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: typeof spinReel = spinReel) {}
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spin(i));
      }
      return reels;
    }
  }
  ```
- Add JSDoc to both exported classes
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /** Base factory for constructing reel grids. Extend to provide custom reel-generation strategies. */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
