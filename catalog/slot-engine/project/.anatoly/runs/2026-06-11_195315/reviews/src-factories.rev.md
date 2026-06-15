# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 88% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Well-formed abstract base class; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class with no runtime behavior beyond the interface contract, but still unverified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract factory contract for building reel grids — the abstract method signature alone does not convey what implementations are expected to guarantee (e.g. reel length, valid symbols, randomness contract).

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `_rowCount` is intentionally unused (underscore convention); `spinReel` always returns 3 symbols and the abstract contract does not enforce that `rowCount` rows are materialized. No visible call site passes a `rowCount` value other than what `spinReel` delivers, so no concrete wrong result is demonstrable from context available.
- **Overengineering [OVER]**: A class wrapping a single call to spinReel in a loop. The factory pattern is unjustified: there is only one implementation, the method holds no state, and the consumer (engine.ts::spin) instantiates it just to call buildReels once. A plain exported function would eliminate the class, the abstract base, and the instantiation overhead with no loss of capability.
- **Tests [NONE]**: No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts (validates bets, evaluates paylines, awards jackpots), making untested reel generation a significant gap — boundary inputs (reelCount=0, large values) and output shape are entirely unverified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its `buildReels` method. Missing documentation for the ignored `_rowCount` parameter (why is it unused?), the return shape, and the relationship to `spinReel`.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | buildReels returns Symbol[][] (mutable), but the arbitrated SpinResult contract declares reels as ReadonlyArray<ReadonlyArray<Symbol>>. The factory should declare its return type as ReadonlyArray<ReadonlyArray<Symbol>> to enforce immutability at the boundary and align with the downstream contract. [L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither AbstractReelBuilderFactory nor StandardReelBuilderFactory has JSDoc. Both are public exports consumed downstream. [L4-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain. _rowCount is accepted in the abstract contract and the concrete implementation but silently ignored — spinReel(i) receives no row dimension. If the game supports configurable row counts (e.g. 3-row vs 4-row grids), the factory cannot produce correctly sized reel strips, making AbstractReelBuilderFactory's contract misleading. [L9-L10] |

### Suggestions

- Return ReadonlyArray<ReadonlyArray<Symbol>> to match the arbitrated SpinResult.reels contract and prevent callers from mutating reel data before it is sealed into SpinResult.
  ```typescript
  // Before
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    const reels: Symbol[][] = [];
    for (let i = 0; i < reelCount; i++) {
      reels.push(spinReel(i));
    }
    return reels;
  }
  // After
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
    const reels: ReadonlyArray<Symbol>[] = [];
    for (let i = 0; i < reelCount; i++) {
      reels.push(Object.freeze(spinReel(i)));
    }
    return Object.freeze(reels);
  }
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /** Factory contract for building a reel grid for a single spin. */
  export abstract class AbstractReelBuilderFactory {
    /**
     * Produces a reelCount × rowCount grid of symbols.
     * @param reelCount - Number of vertical reels.
     * @param rowCount  - Visible rows per reel.
     */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  }
  ```
- Pass rowCount to spinReel so reel strips respect the configured grid height, making the factory contract non-misleading.
  - Before: `reels.push(spinReel(i));`
  - After: `reels.push(spinReel(i, rowCount));`

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
