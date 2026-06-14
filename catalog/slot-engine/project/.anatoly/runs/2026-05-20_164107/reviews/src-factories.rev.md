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
- **Correction [OK]**: Loop iterates reelCount times, delegates to spinReel(i); ignoring rowCount is documented behavior confirmed by internal docs.
- **Overengineering [OVER]**: Factory class wrapping a trivial 4-line loop over `spinReel`. The class exists solely to satisfy the abstract base; `rowCount` is silently ignored, making the interface misleading. With 1 importer and no substitution requirement, this should be a standalone exported function.
- **Tests [NONE]**: No test file exists. `buildReels` is imported by `src/engine.ts` (critical path) but has zero test coverage — happy path, edge cases (reelCount=0, reelCount=1), and `spinReel` integration are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Key behavioral quirk — rowCount parameter is ignored, always producing 3 rows via spinReel() — is invisible without documentation.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type is `Symbol[][]` (mutable). Downstream consumers (`detectScatters`, `isJackpotHit`) accept `ReadonlyArray<ReadonlyArray<Symbol>>` and `SpinResult.reels` is typed as `ReadonlyArray<ReadonlyArray<Symbol>>`. Returning a mutable array when the rest of the engine treats reels as readonly is inconsistent. [L5,L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. Worth noting that `rowCount` is silently ignored in the concrete implementation — a JSDoc `@param` note would surface this to consumers without them needing to read the source. [L4,L8] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a static module-level import with no injection point. Unit-testing `StandardReelBuilderFactory` in isolation requires module mocking. Accepting a `reelSpinner` function via constructor or method parameter would decouple the factory from the concrete RNG-backed implementation. [L2,L8-L15] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` to match the rest of the engine's immutability contract and the type expected by consumers like `detectScatters` and `isJackpotHit`.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Inject the reel-spinning function to decouple the factory from its RNG dependency and improve testability.
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
    constructor(private readonly spinner: (index: number) => Symbol[] = spinReel) {}
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spinner(i));
      }
      return reels;
    }
  }
  ```
- Add JSDoc to both exported classes, calling out the ignored `rowCount` parameter explicitly.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Extension point for custom reel-building strategies.
   * Subclass and override `buildReels` to control symbol distribution.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
