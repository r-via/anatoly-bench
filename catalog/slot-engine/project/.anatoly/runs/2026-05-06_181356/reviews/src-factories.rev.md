# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 88% |
| StandardReelBuilderFactory | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract contract only; no implementation logic to evaluate.
- **Overengineering [ACCEPTABLE]**: ADR-002 explicitly justifies this abstract base as the seam for test-double and seeded-grid implementations, so the pattern is documented and intentional. However, ADR-002 itself concedes 'adds one layer of indirection for what is currently a trivial loop', and the pre-computed usage analysis shows 0 external importers — the contract exists only on paper today. Justified by design decision (`.anatoly/docs/02-Architecture/04-Design-Decisions.md`), but the payoff is entirely deferred.
- **Tests [NONE]**: No test file exists. Abstract class with no runtime behavior beyond defining the contract.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. The contract for `buildReels` — what `reelCount`/`rowCount` represent, the shape of the returned `Symbol[][]`, and the extension semantics — is entirely undocumented.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Loop bounds are correct (0 to reelCount-1), spinReel(i) result typed as Symbol[] pushed into Symbol[][]. Unused _rowCount is a documented design decision per ADR-002.
- **Overengineering [ACCEPTABLE]**: A straightforward loop over spinReel(i), well within LEAN territory on its own. The unused _rowCount parameter is an acknowledged consequence in ADR-002 (reel height is implicitly fixed by spinReel). Single importer, documented rationale for separating grid construction from evaluation. Complexity is inherited from the factory layer rather than introduced here.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, varying rowCount) are verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Key non-obvious behavior — that `_rowCount` is silently ignored because `spinReel` fixes reel height at 3 — is undocumented, along with the delegation strategy and parameter semantics.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is fully mutable. Callers can mutate the grid in place. `ReadonlyArray<ReadonlyArray<Symbol>>` would prevent accidental mutation at the engine boundary. [L5, L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. ADR-002 documents the design rationale but it lives in `.anatoly/docs/`, not in the code. Public API consumers have no inline contract description. [L4, L8] |

### Suggestions

- Add JSDoc to both exported classes to document the contract inline.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Contract for all reel-grid construction strategies.
   * Implement this to provide deterministic, seeded, or RNG-backed grids.
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * @param reelCount - Number of reels (columns) to generate.
     * @param rowCount  - Number of rows per reel.
     * @returns A 2-D grid of symbols indexed [reelIndex][rowIndex].
     */
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  ```
- Return an immutable grid to prevent callers from mutating reel state after construction.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
