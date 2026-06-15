# Review: `src/factories.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 85% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: `rowCount` is silently ignored; internal docs confirm `spinReel` fixes row height at 3, so any caller passing a different `rowCount` receives a grid with silently wrong row dimensions.
- **Overengineering [LEAN]**: Implementation is a minimal loop over spinReel calls. The factory pattern overhead originates in AbstractReelBuilderFactory (flagged there); this class's own logic is straightforward.
- **Tests [NONE]**: No test file found. `buildReels` is used by `src/engine.ts` (critical path), but zero tests cover reel count, row count ignored behavior, or spinReel integration.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its buildReels override. Key details left undocumented: delegation to spinReel, the unused _rowCount parameter (reel height is implicitly fixed by spinReel), and the class's role as the default RNG-backed implementation. (deliberated: confirmed — Confirmed NEEDS_FIX. At src/factories.ts:9, parameter is explicitly named `_rowCount` (underscore prefix = intentionally unused). The abstract contract at line 5 declares `buildReels(reelCount: number, rowCount: number)`, implying `rowCount` should be respected. The implementation at line 12 calls `spinReel(i)` which hardcodes 3 rows at src/reels.ts:46 (`for (let row = 0; row < 3; row++)`). Current caller at src/engine.ts:128 passes `buildReels(5, 3)` so behavior is accidentally correct, but any caller passing rowCount != 3 would get a silently wrong grid. The abstract interface creates a false contract. Raising confidence to 85 because the silent mismatch is empirically verified.)

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The abstract method signature returns `Symbol[][]` — a fully mutable nested array. For a grid that is constructed once and then consumed read-only by payline evaluation, `readonly (readonly Symbol[])[]` on the return type would prevent accidental mutation downstream. [L4-L5] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Both exported symbols (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. The ADR captures rationale but that is internal tooling, not API documentation. At minimum, the abstract method contract and the meaning of `reelCount`/`rowCount` should be documented. [L4-L16] |

### Suggestions

- Add JSDoc to both exported symbols so API consumers and generated docs capture the contract.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Base factory for constructing the symbol grid before payline evaluation.
   * Subclass to provide deterministic, seeded, or certified-RNG grids.
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * @param reelCount - Number of vertical reel strips to produce.
     * @param rowCount  - Visible row height (implementations may fix this internally).
     * @returns A `reelCount × rowCount` grid of symbols.
     */
    abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  }
  ```
- Strengthen return-type immutability to prevent downstream mutation of the generated grid.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): readonly (readonly Symbol[])[] {`

## Actions

### Quick Wins

- **[correction · medium · small]** Either validate that `rowCount` equals the row count actually produced by `spinReel` and throw if they differ, or restructure `spinReel` to accept `rowCount` so the contract is honoured. [L9]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
