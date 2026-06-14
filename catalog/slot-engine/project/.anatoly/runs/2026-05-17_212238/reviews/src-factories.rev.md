# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 78% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: `rowCount` is silently dropped; `spinReel(i)` is called without it, so the number of rows per reel is controlled solely by `spinReel`'s internal logic rather than by the caller's contract.
- **Overengineering [OVER]**: Factory class wrapping a trivial loop over spinReel(). Has only 1 importer and no configuration surface — a plain function `buildReels(reelCount, rowCount)` would suffice. The factory pattern adds a class instantiation step with no benefit.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` (core engine path) but has zero test coverage — loop logic, `spinReel` integration, and output shape are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or buildReels method. Does not document why _rowCount is ignored, what spinReel does per reel index, or what the returned Symbol[][] represents. (deliberated: confirmed — Confirmed. factories.ts:5 declares buildReels(reelCount, rowCount) in the abstract contract. factories.ts:9 accepts _rowCount but never forwards it. reels.ts:46 hardcodes row < 3. Calling buildReels(5, N) where N!=3 silently produces 3-row reels — a contract violation. Mitigated by: (1) the _ prefix is the project's documented convention for unused params, (2) the sole call site at engine.ts:128 passes buildReels(5, 3) matching the hardcode. Real interface violation with no current runtime impact. Lowered confidence slightly due to mitigations.)

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type is `Symbol[][]` (mutable). The arbitrated contract declares `reels: ReadonlyArray<ReadonlyArray<Symbol>>`. Returning a mutable array lets callers mutate the grid without type error. [L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are exported with no JSDoc. At minimum, the abstract class and `buildReels` contract should document the `reelCount`/`rowCount` semantics. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory.buildReels` hard-codes its dependency on `spinReel` via a top-level import, making it impossible to inject a deterministic reel supplier in unit tests. A constructor-injected `(index: number) => Symbol[]` strategy would decouple it. [L2-L14] |
| 17 | Context-adapted rules | WARN | MEDIUM | `_rowCount` is declared in both the abstract interface and the concrete override but is completely ignored. The concrete factory always produces single-column arrays from `spinReel` regardless of the requested row dimension. If the factory is meant to support configurable row counts, the parameter must be used; if not, it should be removed from the signature to avoid misleading callers. [L5-L13] |

### Suggestions

- Return `ReadonlyArray<ReadonlyArray<Symbol>>` to match the arbitrated `SpinResult.reels` contract and prevent callers from mutating the grid.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Inject the reel-spin function to decouple from the module-level import and enable deterministic testing.
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
- Add JSDoc to document the factory contract and the ignored `rowCount` parameter.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Factory base for constructing reel grids.
   * @param reelCount - number of reels (columns) to build
   * @param rowCount  - number of visible rows per reel (unused in standard impl)
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Pass `rowCount` (or `_rowCount`) through to `spinReel` so the concrete implementation honours the full contract of `AbstractReelBuilderFactory.buildReels`. If `spinReel` does not yet accept a row-count parameter, add one and use it to slice/limit the returned symbol array to exactly `rowCount` rows. [L12]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
