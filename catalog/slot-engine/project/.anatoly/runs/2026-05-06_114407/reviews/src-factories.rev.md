# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 72% |
| StandardReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used via StandardReelBuilderFactory (which is imported elsewhere)
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class is structurally correct; contract matches ADR-002 specification.
- **Overengineering [ACCEPTABLE]**: ADR-002 (.anatoly/docs/02-Architecture/04-Design-Decisions.md) explicitly documents this abstract class to enable test-double factories for deterministic grids and future certification. However, the pre-computed importer count is 0 — even the sole consumer (engine.ts) binds to StandardReelBuilderFactory concretely, so the polymorphism is theoretical today and the test-double rationale is currently unrealised.
- **Tests [NONE]**: No test file exists. Abstract class with no runtime behavior beyond defining the interface, but concrete subclass coverage is also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc. As an abstract base defining the grid-construction contract, it warrants at minimum a description of purpose and parameter semantics (reelCount vs rowCount).

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Implementation matches ADR-002: loops over reel indices, delegates to spinReel(i). Unused _rowCount is documented as an intentional known consequence (reel height implicitly fixed at 3 by spinReel). Any RNG-correctness concern belongs to src/reels.ts, not this consumer.
- **Overengineering [LEAN]**: Implementation is a minimal loop delegating to spinReel(i). The class wrapper and _rowCount parameter are explained by the ADR-002 contract. The code itself adds no unnecessary indirection — the overhead is in the abstract layer above it, not here.
- **Tests [NONE]**: No test file exists. buildReels is used by src/engine.ts (critical path) but has zero test coverage — neither happy path nor edge cases (e.g., reelCount=0, rowCount ignored) are verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc on class or buildReels. The silently ignored _rowCount parameter (reel height is implicitly fixed by spinReel) is a non-obvious contract violation that must be documented.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` on both the abstract signature and the concrete implementation is mutable. Callers can mutate the grid post-construction. Prefer `readonly Symbol[][]` (i.e., `ReadonlyArray<Symbol[]>`) to communicate ownership semantics. [L5,L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) and the public `buildReels` method lack JSDoc. ADR-002 documents the rationale, but that knowledge is not surfaced at the API level for tooling consumers. [L4,L8] |

### Suggestions

- Mark return type readonly to prevent external mutation of the generated grid
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<readonly Symbol[]>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<readonly Symbol[]> {
  ```
- Add JSDoc to both exported classes to surface ADR-002 rationale at the API level
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Abstract factory for reel grid construction.
   * Implement this to provide alternative grids (e.g., seeded/deterministic for replay or certification).
   * See ADR-002.
   */
  export abstract class AbstractReelBuilderFactory {
    /** Builds a reelCount × rowCount symbol grid. */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<readonly Symbol[]>;
  }
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
