# Review: `src/factories.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | - | 85% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: _rowCount parameter is silently ignored — spinReel returns a fixed 3-symbol reel regardless of rowCount, so callers requesting a different row count get incorrect reel dimensions.
- **Overengineering [OVER]**: Factory class wrapping a 4-line for-loop calling spinReel. `_rowCount` is accepted but unused, revealing the abstraction doesn't even fit its own interface contract. A plain exported function would remove the class, the abstract base, and the dead parameter with no loss of clarity.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The return type `Symbol[][]` is fully mutable. Both the abstract and concrete signatures could use `readonly Symbol[][]` (i.e. `ReadonlyArray<Symbol[]>`) to signal that callers should not mutate the reel grid. [L5-L9] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are exported with no JSDoc. The abstract class especially warrants documentation explaining the factory contract. [L4-L16] |

### Suggestions

- Add readonly to the return type so callers cannot mutate the reel grid after construction.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<readonly Symbol[]>;`
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Base factory contract for building reel grids.
   * Extend to provide alternative reel-generation strategies.
   */
  export abstract class AbstractReelBuilderFactory {
    /** Build a `reelCount × rowCount` grid of symbols. */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<readonly Symbol[]>;
  }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Either pass rowCount to spinReel (and update its signature to respect it), or document and enforce that rowCount must always equal 3 to match spinReel's fixed output. Silently ignoring the parameter hides misconfigurations from callers. [L9]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
