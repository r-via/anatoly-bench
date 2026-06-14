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
- **Correction [OK]**: Abstract base with a single abstract method; signature and return type are consistent with the rest of the codebase.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: Abstract class with no test file. No tests exist for any subclass behavior contract.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Purpose of the abstract factory, the contract of buildReels, and the meaning of reelCount/rowCount parameters are not described.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Iterates reelCount times, delegates each reel to spinReel(i), and returns the resulting Symbol[][]. The _rowCount parameter is intentionally unused (underscore prefix); whether spinReel internally honours a row dimension is a concern in reels.ts, not here.
- **Overengineering [OVER]**: Factory class pattern wrapping a trivial loop over `spinReel`. 1 importer, no polymorphism needed. A plain function `buildReels(reelCount, rowCount): Symbol[][]` would be cleaner and equally expressive. The class exists solely to satisfy the unnecessary abstract parent.
- **Tests [NONE]**: No test file found. buildReels is imported by src/engine.ts (critical path) but has zero test coverage — happy path, reel count, row count ignored behavior, and spinReel integration are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment on the class or its buildReels override. The _rowCount parameter is silently ignored — a notable behavior with no explanation.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract signature and the concrete `buildReels` return `Symbol[][]` — mutable. The arbitrated `SpinResult` contract uses `ReadonlyArray<ReadonlyArray<Symbol>>`, so the factory return type should be `ReadonlyArray<ReadonlyArray<Symbol>>` (or at minimum `readonly Symbol[][]`) to signal that callers must not mutate the structure after construction. [L5,L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. Public API surface should document the factory contract, expected behaviour of `buildReels`, and the meaning of `reelCount`/`rowCount`. [L4,L8] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory.buildReels` hard-imports `spinReel` from `./reels.js` with no injection point. Unit-testing the factory in isolation requires module-level mocking. Accepting a `spinFn` via constructor or as a parameter would make it purely testable. [L2,L11] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/slot-machine domain inferred from reel/paytable/jackpot/scatter/wild vocabulary across the project. `StandardReelBuilderFactory.buildReels` silently ignores `rowCount` (`_rowCount`), but row count governs the visible window on each reel and directly affects win-line evaluation. A standard slot-machine factory that disregards row count can produce reels that are structurally inconsistent with the game grid, undermining the 95% RTP target. Either the abstract contract should drop the parameter or the concrete implementation must use it. [L9] |

### Suggestions

- Make the return type immutable to match the arbitrated SpinResult contract and prevent accidental mutation downstream.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][]
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>
  ```
- Inject the spin function to decouple the concrete factory from `spinReel` and enable deterministic unit tests.
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
    constructor(private readonly spinFn: (index: number) => Symbol[] = spinReel) {
      super();
    }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spinFn(i));
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
   * Base factory for constructing the reel grid used in each spin.
   * Subclass to provide alternative reel-building strategies (e.g. weighted, seeded).
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
