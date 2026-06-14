# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 88% |
| StandardReelBuilderFactory | class | yes | OK | ACCEPTABLE | USED | UNIQUE | NONE | 88% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract interface correctly declares the contract for reel construction.
- **Overengineering [ACCEPTABLE]**: ADR-3 (.anatoly/state/internal-docs/02-Architecture/04-Design-Decisions.md) explicitly documents and justifies this abstraction to enable alternative reel configurations without touching engine.ts. However, 0 direct importers and a single concrete implementation currently make it forward-looking rather than actively used, which the ADR itself acknowledges as a trade-off.
- **Tests [NONE]**: Abstract base class with no test file. No tests verify the contract or subclass behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The class name hints at its role, but the non-obvious `rowCount` parameter semantics (accepted by interface, currently ignored by the standard impl) and the factory pattern contract are not documented.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Implementation correctly delegates to spinReel per reel index; _rowCount ignored by documented ADR-3 design decision.
- **Overengineering [ACCEPTABLE]**: ADR-3 justifies the concrete factory for swappable reel construction. The `_rowCount` parameter is accepted but intentionally ignored — the ADR explicitly flags this as a misleading trade-off in v0.1.0, preserving the interface for when row count becomes variable. One importer, straightforward implementation body.
- **Tests [NONE]**: No test file found. `buildReels` is used by `src/engine.ts` (a critical path), but no tests cover reel count, row count handling, or `spinReel` integration. The `_rowCount` parameter being ignored is a notable untested behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its `buildReels` method. The silent `_rowCount` ignore is a meaningful behavioral constraint that callers cannot discover without reading the source.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type is `Symbol[][]` (mutable), but the arbitrated `SpinResult` contract stores reels as `ReadonlyArray<ReadonlyArray<Symbol>>`. The factory should narrow its return type to match the downstream contract. [L5,L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are public exports with no JSDoc. The ADR-3 design intent and the `_rowCount` forward-compatibility trade-off are worth surfacing as inline docs. [L4,L8] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is hard-imported at module level. `StandardReelBuilderFactory` cannot accept an alternative reel-spinner without module mocking, undermining the substitutability ADR-2 establishes via `EngineContainer`. Injecting a reel-spin function through the constructor would align with the project's DI intent. [L2,L9-L14] |

### Suggestions

- Return readonly arrays to match the arbitrated SpinResult contract and prevent callers from mutating reel state.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Accept a reel-spin function via constructor injection to enable deterministic testing without module mocking, consistent with the EngineContainer DI intent from ADR-2.
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
    constructor(private readonly spin: typeof spinReel = spinReel) { super(); }
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spin(i));
      }
      return reels;
    }
  }
  ```
- Add JSDoc to both exports documenting the ADR-3 trade-off around `_rowCount`.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Abstract factory for reel grid construction (ADR-3).
   * Implementations receive `rowCount` for future variable-row support;
   * v0.1.0 implementations may ignore it.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
