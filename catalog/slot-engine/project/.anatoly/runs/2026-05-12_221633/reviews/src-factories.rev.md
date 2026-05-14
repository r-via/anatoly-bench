# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 78% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: rowCount parameter silently ignored; spinReel(i) receives no row-count constraint, so the returned inner arrays may not have rowCount entries, violating the abstract contract and the caller's dimensional expectations.
- **Overengineering [OVER]**: Concrete class with 1 importer wrapping a trivial loop over spinReel. The factory pattern is unjustified — a standalone function would be simpler. Inherits an abstract base with 0 other consumers, compounding the abstraction overhead.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts (core engine path), yet buildReels loop logic, reelCount/rowCount handling, and spinReel integration are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. buildReels and its parameters (reelCount, _rowCount — notably rowCount is ignored) are undocumented; the ignored parameter is a non-obvious behavioral detail that warrants explanation.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract signature and concrete `buildReels` return `Symbol[][]` (mutable). The README-arbitrated `SpinResult` contract requires `ReadonlyArray<ReadonlyArray<Symbol>>` for the reels field. The factory return type should match that contract. [L7-L15] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has a JSDoc comment. Both are exported public symbols. [L4-L15] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a module-level static import, not injected. `StandardReelBuilderFactory` cannot be unit-tested with a deterministic mock reel without module-level mocking infrastructure. Injecting a `SpinStrategy` or `ReelSpinner` dependency would enable pure-function tests. [L9-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: `buildReels(reelCount, rowCount)` is the abstract contract, but `StandardReelBuilderFactory` silently ignores `rowCount` (prefixed `_rowCount`). In a slot engine where reel geometry (rows) directly affects paylines and RTP, dropping row configuration without documentation or a clear override contract is a behavioural gap. At minimum this warrants a JSDoc note explaining why row count is unused. [L10-L15] |

### Suggestions

- Return ReadonlyArray to match the arbitrated SpinResult contract and prevent accidental mutation downstream.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  buildReels(reelCount: number, _rowCount: number): Symbol[][]
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>
  ```
- Inject the reel-spinning dependency so the factory can be tested without module mocking.
  ```typescript
  // Before
  import { spinReel } from "./reels.js";
  
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (index: number) => ReadonlyArray<Symbol>) {}
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Base factory for constructing reel grids. Extend to provide custom reel-spinning strategies.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Forward rowCount to spinReel (or slice/pad its result) so the returned reels always contain exactly rowCount symbols per reel, honoring the abstract contract. [L9]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
