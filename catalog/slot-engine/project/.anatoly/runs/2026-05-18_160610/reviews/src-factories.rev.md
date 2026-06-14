# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 70% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: `rowCount` is silently dropped and never forwarded to `spinReel`, so the factory cannot produce reel grids of any row dimension other than whatever `spinReel` hard-codes internally; any caller that passes a `rowCount` other than 3 will silently receive a grid of the wrong shape.
- **Overengineering [OVER]**: Factory class wrapping a trivial for-loop over spinReel(i). The _rowCount parameter is unused, exposing an abstraction that does not fit even the single implementation. A bare function `buildReels(reelCount: number): Symbol[][]` is sufficient and has 1 importer — no class hierarchy needed.
- **Tests [NONE]**: No test file found. Used by src/engine.ts, but buildReels — including reel count, row count handling, and spinReel integration — is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its buildReels method. The fact that _rowCount is ignored (unused parameter) is a non-obvious behavior that warrants documentation.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | buildReels returns mutable Symbol[][] but the arbitrated contract (README.md) specifies SpinResult.reels as ReadonlyArray<ReadonlyArray<Symbol>>. Returning the readonly shape at the factory boundary would be safer and self-documenting. [L9-L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (AbstractReelBuilderFactory, StandardReelBuilderFactory) lack JSDoc. Purpose and parameter semantics of buildReels are undocumented. [L4-L15] |
| 15 | Testability | WARN | MEDIUM | StandardReelBuilderFactory hard-codes the spinReel dependency via module-level import, making it impossible to inject a stub or deterministic reel provider in tests. A constructor-injected reel function would decouple the factory from the RNG. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract contract declares rowCount as a meaningful parameter, but the concrete implementation ignores it entirely (_rowCount). In a 5×3 slot machine the row count is fixed, but silently dropping a parameter that callers supply creates a leaky abstraction. Either remove rowCount from the signature or enforce it during reel slicing. [L9-L10] |

### Suggestions

- Return readonly arrays from buildReels to match the arbitrated SpinResult.reels type
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][]`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>`
- Inject spinReel as a constructor dependency to enable deterministic testing
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
    constructor(private readonly spin: typeof spinReel = spinReel) { super(); }
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
   * Base factory for constructing reel grids.
   * @param reelCount - number of reels (columns)
   * @param rowCount  - number of visible rows per reel
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Forward `rowCount` to `spinReel` (or assert it equals the hard-coded constant) so the implementation honours the abstract method's contract and does not silently produce grids of the wrong height. [L9]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
