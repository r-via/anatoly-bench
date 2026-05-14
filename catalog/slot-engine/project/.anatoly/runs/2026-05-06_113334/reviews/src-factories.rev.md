# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 75% |
| StandardReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Loop iterates correctly from 0 to reelCount-1, passes the reel index to spinReel, and collects results into the correctly typed Symbol[][]. The unused _rowCount parameter is an explicitly documented trade-off in ADR-002 (.anatoly/docs/02-Architecture/04-Design-Decisions.md), not a defect. No bugs found in the factory logic itself.
- **Overengineering [LEAN]**: The implementation is a straightforward loop that calls spinReel(i) for each reel index and collects results — no unnecessary generics, no configuration layers, no secondary abstractions. The overengineering concern lives in the AbstractReelBuilderFactory base class (defined above), not here; per rule 9, the consumer of an over-engineered abstraction should not itself be flagged when its own code is simple.
- **Tests [NONE]**: No test file found. buildReels is imported by src/engine.ts (critical game engine path) and has untested behavior: reel count loop, spinReel delegation per index, and the _rowCount parameter being silently ignored — all edge cases with zero coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment on either the class or its buildReels method. The prefixed _rowCount parameter signals a notable behavioral divergence from the parent contract (rowCount is silently ignored; reel height is implicitly fixed by spinReel), which is a non-obvious side-effect that warrants explicit documentation. Without it, callers have no indication that passing a non-default rowCount has no effect.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The return type of `buildReels` is `Symbol[][]` — a fully mutable nested array. Callers receive a reference they can mutate arbitrarily. In a regulated gaming engine, where grid state drives payline evaluation, returning `readonly (readonly Symbol[])[]` would make the contract explicit and prevent accidental mutation downstream. [L10-L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) and the abstract/concrete `buildReels` method lack JSDoc. ADR-002 documents the design intent, but that lives in an internal doc rather than at the call-site. A brief `/** ... */` on each export would surface the contract to IDE consumers. [L4-L16] |

### Suggestions

- Return a readonly nested array to prevent downstream mutation of the generated reel grid — important in a gaming engine where grid state drives payline evaluation.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  
  buildReels(reelCount: number, _rowCount: number): readonly (readonly Symbol[])[] {
  ```
- Add JSDoc to both public exports so IDE tooling and future implementors understand the factory contract without consulting the ADR.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Abstract factory for reel-grid construction.
   * Implement this class to supply alternative grids (e.g. seeded/deterministic
   * for replay or certification) without modifying the engine.
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * Builds a two-dimensional symbol grid.
     * @param reelCount - Number of reels (columns) to generate.
     * @param rowCount  - Number of rows per reel (may be unused by some implementations).
     * @returns A grid of symbols indexed as [reel][row].
     */
    abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
