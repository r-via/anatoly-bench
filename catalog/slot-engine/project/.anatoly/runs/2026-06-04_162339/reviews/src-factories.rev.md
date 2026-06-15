# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract class correctly declares the factory contract; no implementation logic to fault.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class used by src/engine.ts as a base type.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract factory contract with non-trivial semantics (reelCount vs rowCount distinction, return shape) warrants documentation.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `_rowCount` is intentionally unused (underscore-prefixed). Without `spinReel`'s implementation in context, no concrete call path can be shown to produce an incorrect result from ignoring rowCount, so the precision guard applies. Loop and return are structurally correct.
- **Overengineering [OVER]**: Concrete class with 1 importer that exists solely to satisfy the unnecessary abstract base. The `buildReels` method is a thin loop over `spinReel` — no state, no injection, no polymorphism. A plain `buildReels` function would be equivalent and simpler. `_rowCount` is also silently ignored, which suggests the interface was designed for anticipated (unrealized) variation.
- **Tests [NONE]**: No test file exists. buildReels is the core factory method used by src/engine.ts — happy path, edge cases (reelCount=0, rowCount ignored), and spinReel integration are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. `_rowCount` is ignored silently — that behavioral deviation from the abstract contract is undocumented and non-obvious.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable. The arbitrated README contract declares `SpinResult.reels` as `ReadonlyArray<ReadonlyArray<Symbol>>`. Returning a mutable type allows callers to mutate reel state before it lands in SpinResult. [L9-L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are public exports with no JSDoc. Contract obligations (e.g. what `reelCount`/`rowCount` must satisfy) are undocumented. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-imports `spinReel` with no injection seam. The abstract class pattern enables polymorphic testing, but the concrete class cannot have its RNG swapped for deterministic test fixtures without module-level mocking. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain (reel/spin/scatter/jackpot vocabulary throughout project). `_rowCount` is declared in the abstract interface but silently ignored in the only concrete implementation. In a regulated gaming engine, a row-count parameter that controls the visible grid being silently discarded risks incorrect pay-line evaluation for non-3-row configurations — should either be used in `spinReel` or removed from the abstract signature. [L9-L15] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` to match the arbitrated SpinResult contract and prevent upstream mutation.
  ```typescript
  // Before
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
    const reels: Symbol[][] = [];
    ...
    return reels;
  }
  // After
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
    const reels: ReadonlyArray<Symbol>[] = [];
    ...
    return reels;
  }
  ```
- Inject a `spinReel`-compatible function to decouple the concrete factory from the live RNG, enabling deterministic tests.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes documenting parameters and slot-machine contract.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Base factory for building a reel grid.
   * @param reelCount Number of vertical reels (columns).
   * @param rowCount Visible symbol rows per reel.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
