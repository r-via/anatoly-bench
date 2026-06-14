# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 88% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Ignoring `_rowCount` is intentional (underscore prefix) and consistent with the documented fixed 5×3 layout; `spinReel(i)` is expected to return a fixed-length Symbol[] matching 3 rows.
- **Overengineering [OVER]**: Factory class wrapping a trivial 3-line loop. The `_rowCount` parameter is silently ignored (underscore-prefixed), exposing a parameterisation that was never implemented — a sign the abstraction was designed for hypothetical future variants. A free function `buildReels(reelCount: number): Symbol[][]` is sufficient and has 1 real caller. The factory/class pattern adds ceremony with no polymorphic or lifecycle value.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` but has zero test coverage — neither happy path nor edge cases (zero reelCount, large values, reel shape) are tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or buildReels override. Missing explanation of why _rowCount is ignored, what spinReel does per reel index, and the shape of the returned Symbol[][].

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract signature and the concrete override declare `Symbol[][]` as the return type. The arbitrated SpinResult interface uses `ReadonlyArray<ReadonlyArray<Symbol>>` for reels. Marking the return type readonly here would propagate that guarantee earlier and prevent accidental mutation by callers. [L6, L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are public exports with no JSDoc. At minimum, the abstract class and its `buildReels` contract should be documented. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-imports `spinReel` with no injection point. To unit-test `buildReels` in isolation (e.g., deterministic reels), callers must monkey-patch the module. A constructor-injected `spinFn: (index: number) => Symbol[]` would eliminate the coupling. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | The abstract contract exposes `rowCount` as a first-class parameter (engine is documented as 5×3), but `StandardReelBuilderFactory` silently discards it (`_rowCount`), delegating row layout entirely to `spinReel`. This breaks the Liskov expectation that a subclass honours the full parameter contract of its interface — callers cannot rely on `rowCount` being respected. [L6, L10] |

### Suggestions

- Narrow return type to readonly arrays to match the arbitrated SpinResult contract and prevent upstream mutation.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Inject the reel-spin function to decouple StandardReelBuilderFactory from the reels module and allow deterministic testing.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinFn: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Base factory for constructing reel grids.
   * Extend this class to provide alternate reel-building strategies.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
