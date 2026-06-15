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
- **Correction [OK]**: Correctly iterates reelCount times, delegates to spinReel(i) per reel. Ignoring _rowCount is explicitly documented as intentional — spinReel always produces 3 rows.
- **Overengineering [OVER]**: Class wrapping a trivial for-loop over `spinReel`. Has only 1 importer and ignores `rowCount` entirely. The factory class indirection adds instantiation overhead and a forced inheritance chain for logic that could be a two-line exported function.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — no happy path, no edge cases (reelCount=0, reelCount>0, spinReel failure).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or `buildReels`. Critical non-obvious behavior — `_rowCount` is silently ignored; each reel always produces a fixed row count via `spinReel()` — is undocumented.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type and local accumulator are `Symbol[][]` (mutable). The rest of the API — `detectScatters`, `isJackpotHit`, `SpinResult.reels` — all use `ReadonlyArray<ReadonlyArray<Symbol>>`. The factory return type should match. [L4-L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are public extension-point exports (documented in Public-API.md) with no JSDoc. At minimum `buildReels` params and the `rowCount`-ignored behavior should be documented. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory.buildReels` calls `spinReel` directly via module import — no way to inject a deterministic reel spinner without module mocking. A constructor-injected `spinReel: (index: number) => Symbol[]` would make the class unit-testable in isolation. [L9-L16] |

### Suggestions

- Use readonly arrays in the return type to align with the rest of the public API
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  // and
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    const reels: Symbol[][] = [];
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  // and
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
    const reels: Symbol[][] = [];
  ```
- Inject the reel-spinner to decouple from the module and enable deterministic tests
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
      return Array.from({ length: reelCount }, (_, i) => this.spinner(i));
    }
  }
  ```
- Add JSDoc to public extension-point exports
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  // After
  /**
   * Base factory for building reel grids. Extend this class to supply
   * custom reel-generation logic to the engine.
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * Build a `reelCount × rowCount` reel grid.
     * @param reelCount - number of reels (columns)
     * @param rowCount  - number of visible rows per reel (ignored by StandardReelBuilderFactory)
     */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
