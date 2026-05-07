# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 82% |
| StandardReelBuilderFactory | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Loop correctly iterates 0..reelCount-1 calling spinReel(i) per index. Unused _rowCount is documented in ADR-002 as an accepted consequence of spinReel fixing row height implicitly.
- **Overengineering [ACCEPTABLE]**: The implementation is a minimal for-loop over `spinReel(i)` — no unnecessary complexity in the body itself. The class-over-function overhead is the direct consequence of ADR-002's documented factory pattern (.anatoly/docs/02-Architecture/04-Design-Decisions.md), which anticipates test-double and seeded-grid subclasses. Slightly complex relative to a plain function, but justified by the documented design decision.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts (critical path), yet buildReels has no tests covering reel count, row count ignored, or spinReel integration.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or buildReels method. Notable undocumented behavior: _rowCount is silently ignored (reel height fixed implicitly by spinReel), which is a non-obvious contract violation callers cannot discover without reading the source.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is fully mutable. Callers can mutate both the outer array and inner symbol arrays. The abstract contract and concrete implementation should return `readonly (readonly Symbol[])[]`. [L4-L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are exported with no JSDoc. The ADR-002 design rationale (replay, certification, testing) belongs on the abstract class as `@remarks`, and the unused `_rowCount` quirk should be documented on `buildReels`. [L4-L16] |

### Suggestions

- Return readonly arrays to prevent callers from mutating the generated grid.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  
  buildReels(reelCount: number, _rowCount: number): readonly (readonly Symbol[])[] {
  ```
- Add JSDoc to both exported classes; document the unused `_rowCount` param and the certification motivation.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Contract for reel-grid construction. Swap implementations for
   * deterministic replay, certification, or testing (see ADR-002).
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * @param reelCount - Number of reels to generate.
     * @param rowCount - Visible row height (may be unused by some impls).
     */
    abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
