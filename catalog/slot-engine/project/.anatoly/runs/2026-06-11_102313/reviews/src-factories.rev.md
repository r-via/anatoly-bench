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
- **Correction [OK]**: Abstract base class defines the correct contract; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file found.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose of the abstract factory pattern, expected subclass contract, and parameter semantics for buildReels are not explained.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Implementation is structurally sound. `_rowCount` is intentionally unused (underscore prefix); correctness of `spinReel(i)` returning the right row depth cannot be assessed without its implementation (rule 16), and no concrete call path in the visible code demonstrates wrong behavior.
- **Overengineering [OVER]**: Factory class with 1 importer wrapping a trivial loop over `spinReel`. The entire class body is a 5-line loop that could be a standalone function `buildReels(reelCount, rowCount): Symbol[][]`. The class exists only to satisfy the unnecessary abstract base.
- **Tests [NONE]**: No test file found. Used by src/engine.ts — buildReels loop logic and spinReel integration are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or buildReels override. Behavior of _rowCount being ignored and delegation to spinReel is undocumented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | buildReels returns Symbol[][] (mutable). The README SpinResult contract specifies ReadonlyArray<ReadonlyArray<Symbol>> for reels. Both the abstract signature and concrete implementation should declare this readonly return type. [L5-L14] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Neither AbstractReelBuilderFactory nor StandardReelBuilderFactory has JSDoc. Both are exported public API in a regulated gaming engine where contract documentation is important. [L4-L15] |
| 15 | Testability | WARN | MEDIUM | StandardReelBuilderFactory hard-imports spinReel with no injection point. Unit testing requires mocking the reels module rather than passing a substitute. A constructor-injected spin function with spinReel as the default would decouple the two. [L2-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from reel/jackpot/freespin/paytable vocabulary. _rowCount is silently discarded in StandardReelBuilderFactory.buildReels — the concrete implementation accepts a row-count parameter that has no effect on reel construction. In a regulated slot engine the row dimension shapes the visible grid and must influence how symbols are drawn from each reel; silently ignoring it breaks the expected grid contract and can produce incorrect symbol windows. [L9-L15] |

### Suggestions

- Align return type with the README SpinResult.reels contract and enforce immutability at the factory boundary.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes to document the factory contract.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  // After
  /** Abstract factory for constructing the reel grid. Extend to provide custom reel-spin strategies. */
  export abstract class AbstractReelBuilderFactory {
    /** Build a reelCount×rowCount symbol grid. */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  ```
- Inject the spin function to decouple StandardReelBuilderFactory from reels.ts and allow unit-test mocking.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (reelIndex: number) => Symbol[] = spinReel) { super(); }
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
