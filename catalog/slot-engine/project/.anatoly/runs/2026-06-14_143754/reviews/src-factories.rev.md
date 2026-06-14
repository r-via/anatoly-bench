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
- **Correction [OK]**: Well-formed abstract class; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class with no runtime behavior beyond interface contract — but the factory pattern is untested entirely.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Abstract factory contract for building reels is non-obvious: callers need to know what `reelCount`/`rowCount` mean, what the returned `Symbol[][]` shape represents, and why an abstract factory pattern is used here.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `_rowCount` is intentionally unused (underscore prefix); `spinReel` is documented to always return a 3-symbol column, matching a standard 3-row slot machine. Type signatures align throughout: `spinReel(i): Symbol[]` collected into `Symbol[][]` is correct. No concrete call site evidence that ignoring `rowCount` produces wrong output.
- **Overengineering [OVER]**: Factory class pattern for what is effectively a single two-liner loop over spinReel(). One importer (engine.ts::spin) instantiates it to call buildReels once. A standalone function `buildReels(reelCount, rowCount)` would be simpler and equally testable.
- **Tests [NONE]**: No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts (full slot machine spin logic), yet zero tests verify reel count, row count handling, or that `spinReel` is called per reel index.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or `buildReels`. Notable behavior (ignores `_rowCount`, delegates to `spinReel` per reel index) is invisible to callers. Consumed by `spin()` in engine.ts, making its contract part of the public API.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type of `buildReels` is `Symbol[][]` (mutable). The arbitrated README contract declares `SpinResult.reels` as `ReadonlyArray<ReadonlyArray<Symbol>>`. The factory should return `ReadonlyArray<ReadonlyArray<Symbol>>` to enforce immutability at the source and satisfy the downstream contract without requiring silent widening in engine.ts. [L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are public exports with no JSDoc. At minimum the abstract method `buildReels` and the concrete class should document their contract (what a reel array represents, expected lengths). [L4-L17] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract interface declares `rowCount: number` as a required parameter, but `StandardReelBuilderFactory.buildReels` silently discards it (`_rowCount`). In a slot-machine engine, row count determines the visible symbol window and is a meaningful game parameter. Ignoring it in the only concrete factory means all callers pass it in vain. Either remove it from the abstract interface, thread it into `spinReel`, or document why the concrete class intentionally ignores it. [L9] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` from `buildReels` to satisfy the arbitrated SpinResult contract at the source.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both public exports.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Abstract factory for constructing the reel grid used in each spin.
   * Subclass to inject deterministic or test reels.
   */
  export abstract class AbstractReelBuilderFactory {
  ```
- If `rowCount` is intentionally unused in the standard implementation, document why — or thread it into `spinReel` so callers get the expected symbol window.
  ```typescript
  // Before
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  /** @param rowCount visible symbol rows per reel — passed to spinReel to size the strip */
  buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
