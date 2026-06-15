# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 80% |
| StandardReelBuilderFactory | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Loop correctly iterates 0..reelCount-1 calling spinReel(i); unused _rowCount is intentional per ADR-002 (reel height fixed at 3 inside spinReel).
- **Overengineering [ACCEPTABLE]**: A simple loop delegating to spinReel(i); the class wrapper is slightly heavier than a plain function, but ADR-002 explicitly justifies making grid construction replaceable in engine.ts without modification. One live importer confirms it is actively used. The unused _rowCount parameter is a known consequence acknowledged in the ADR.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts, making it a critical production path. buildReels loop logic and spinReel integration are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its `buildReels` override. Key omissions: why `_rowCount` is ignored (reel height is implicitly fixed by `spinReel`), what the returned `Symbol[][]` shape represents, and that this is the RNG-backed production implementation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Abstract method and override both return mutable `Symbol[][]`. Callers receive a grid they can mutate. Prefer `ReadonlyArray<ReadonlyArray<Symbol>>` to signal the grid is consumed, not modified. [L5-L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. The rationale and contract exist in `.anatoly/docs/02-Architecture/04-Design-Decisions.md` but are not surfaced at the call site. [L4-L16] |

### Suggestions

- Return readonly grid to prevent callers from mutating the constructed reel state
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;`
- Add JSDoc to both exported classes so the factory contract is visible at the call site without consulting the ADR
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Contract for reel-grid construction. Extend to provide deterministic,
   * seeded, or replay grids without modifying engine or payline logic.
   */
  export abstract class AbstractReelBuilderFactory {
    /** Constructs a reelCount × rowCount grid of symbols. */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
