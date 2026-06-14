# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 72% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract factory declaration is correct; interface contract is well-formed.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract base class with no test file. No tests exist for the contract it defines.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract factory with a non-trivial contract (reelCount vs rowCount semantics, return shape) that warrants documentation.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: `rowCount` is silently ignored: `spinReel(i)` is called with only the reel index, so the returned inner arrays have whatever fixed length `spinReel` produces — not the caller-requested `rowCount`. Any caller that passes `rowCount !== spinReel's fixed output length` gets a grid with wrong row dimensions, violating the abstract interface contract.
- **Overengineering [OVER]**: Factory class with 1 importer wrapping a trivial loop over `spinReel`. The factory pattern is unjustified here — a standalone `buildReels(reelCount, rowCount)` function would be simpler and eliminate the need for instantiation. The `_rowCount` parameter is unused, further indicating the abstraction was speculative.
- **Tests [NONE]**: No test file found. buildReels is used by src/engine.ts (critical path) but has zero test coverage — happy path, edge cases (reelCount=0, rowCount boundaries), and spinReel integration are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. `_rowCount` is silently ignored — a notable behavioral detail that should be documented. No description of what 'standard' means relative to other possible factory implementations.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract signature and concrete implementation return mutable Symbol[][]. The arbitrated README contract specifies reels as ReadonlyArray<ReadonlyArray<Symbol>> in SpinResult, so the factory return type should match to prevent silent mutability leaks. [L5, L10] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Neither AbstractReelBuilderFactory nor StandardReelBuilderFactory have JSDoc. Both are exported public API surface. At minimum, the abstract class contract and the concrete class's ignored rowCount parameter warrant documentation. [L4, L8] |
| 15 | Testability | WARN | MEDIUM | StandardReelBuilderFactory hard-wires spinReel with no injection point. Unit-testing requires module-level mocking. Accepting a reel-spin function via constructor or a protected method would allow substituting a deterministic stub without mock frameworks — important in a regulated gaming context. [L8-L15] |

### Suggestions

- Return ReadonlyArray to match the arbitrated SpinResult contract and prevent callers from mutating reel state.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Accept the reel-spin function as a constructor dependency so tests can inject a deterministic stub without module mocking.
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
    constructor(private readonly spin: (index: number) => Symbol[] = spinReel) {
      super();
    }
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spin(i));
      }
      return reels;
    }
  }
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Base factory for constructing reel grids.
   * Extend to supply alternate spin strategies (e.g. weighted, seeded).
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Pass `rowCount` to `spinReel` (or slice/pad its result) so the returned inner arrays have the caller-requested number of rows, honoring the abstract interface contract. [L12]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
