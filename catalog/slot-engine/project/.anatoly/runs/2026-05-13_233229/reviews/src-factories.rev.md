# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 72% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: `rowCount` is silently dropped: `spinReel(i)` receives no row-count argument, so callers that request a specific row count silently receive whatever fixed count `spinReel` hardcodes.
- **Overengineering [OVER]**: Concrete factory class extending a vacuous abstract base, with only 1 importer. `buildReels` is a simple loop over `spinReel` calls — this logic needs no class wrapper, no inheritance hierarchy. A plain exported function `buildReels(reelCount, rowCount): Symbol[][]` would be equivalent and cleaner.
- **Tests [NONE]**: No test file exists. buildReels is used by src/engine.ts (a critical path), but zero tests cover reel count, row count behavior, or spinReel integration.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Notable undocumented behavior: _rowCount is ignored entirely, which is a non-obvious deviation from the base class signature that callers need to know about.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type is `Symbol[][]` (fully mutable). The arbitrated README contract specifies `SpinResult.reels` as `ReadonlyArray<ReadonlyArray<Symbol>>`. The factory should return that shape so callers can assign directly without unsafe widening. [L5-L6] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has JSDoc. Both are public API surface. At minimum, the abstract class contract and the `_rowCount` being intentionally ignored in the standard implementation warrant documentation. [L4-L16] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` to match the arbitrated `SpinResult.reels` contract and prevent mutation downstream.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    const reels: Symbol[][] = [];
    ...
    return reels;
  }
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
    const reels: ReadonlyArray<Symbol>[] = [];
    ...
    return reels;
  }
  ```
- Add JSDoc to both public exports, including a note that `_rowCount` is intentionally unused in the standard implementation.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Base factory for constructing reel grids.
   * Subclass to provide alternative layouts (e.g. free-spin expanded reels).
   */
  export abstract class AbstractReelBuilderFactory {
    /** @param rowCount Visible row count; implementations may or may not use it. */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Pass `rowCount` into `spinReel` (or an equivalent parameter) so the returned inner arrays contain exactly `rowCount` symbols, honouring the abstract contract. [L12]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
