# Review: `src/factories.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 88% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: `_rowCount` is accepted but silently discarded — `spinReel(i)` never receives the row count, so callers requesting non-default row depths get silently wrong reel shapes.
- **Overengineering [OVER]**: Factory class wrapping a single call to spinReel in a loop. Has only 1 importer and exists solely to fulfil the unnecessary abstract base class contract. The entire class body is trivially replaceable with a standalone function `buildReels(reelCount, rowCount): Symbol[][]`.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` (critical path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, varying rowCount) are exercised.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of the standard build strategy, why _rowCount is ignored, and what spinReel produces per reel index. (deliberated: confirmed — Confirmed. factories.ts:9 accepts `_rowCount` but never forwards it. `spinReel` at reels.ts:46 hardcodes `row < 3`. The abstract class at factories.ts:5 declares `rowCount` as a meaningful parameter in the contract. Caller at engine.ts:128 passes `buildReels(5, 3)` — coincidentally matches the hardcode, but any other rowCount value is silently ignored, producing wrong reel shapes. The `_` prefix indicates developer awareness of the unused param, but the abstract contract promises usage. This is a genuine interface violation, not a style preference.)

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract signature and the concrete implementation return `Symbol[][]` (mutable). The arbitrated README contract defines `SpinResult.reels` as `ReadonlyArray<ReadonlyArray<Symbol>>`, so the factory's return type should match to prevent accidental mutation before assignment. [L5-L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. In a regulated gaming engine these are public API surface and should document the reel-building contract. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a hard static import with no injection seam inside `StandardReelBuilderFactory`. Unit-testing reel construction in isolation requires module-level mocking rather than a simple constructor or method parameter override. [L9-L15] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` to match the arbitrated `SpinResult.reels` contract and prevent downstream mutation.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    const reels: Symbol[][] = [];
    for (let i = 0; i < reelCount; i++) {
      reels.push(spinReel(i));
    }
    return reels;
  }
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
    const reels: Symbol[][] = [];
    for (let i = 0; i < reelCount; i++) {
      reels.push(spinReel(i));
    }
    return reels; // mutable during build, readonly once returned
  }
  ```
- Add JSDoc to both exported classes to document the factory contract for the regulated gaming context.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Base factory for constructing reel grids used in each spin.
   * Extend to provide custom reel-strip configurations.
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * Builds a `reelCount × rowCount` reel grid.
     * @param reelCount - Number of vertical reel columns.
     * @param rowCount  - Number of symbol rows per reel.
     */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  }
  ```
- Inject `spinReel` as a constructor dependency to enable unit testing without module mocking.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Pass `rowCount` (currently `_rowCount`) to `spinReel` or slice its output to `rowCount` symbols so callers receive reels of the requested depth instead of a silently wrong shape. [L12]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
