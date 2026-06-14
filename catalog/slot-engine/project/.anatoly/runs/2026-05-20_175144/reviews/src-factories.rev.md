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
- **Correction [OK]**: Implementation is correct for its stated behavior. `_rowCount` is intentionally ignored (underscore prefix convention); internal docs confirm this is known. Loop bounds and `spinReel(i)` call are correct.
- **Overengineering [OVER]**: Stateless class that wraps a 4-line loop. Holds no state, has one importer, and ignores `rowCount` entirely. The factory-class pattern adds nothing a plain exported function wouldn't provide.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts (critical path), yet buildReels has no coverage — neither happy path (correct reel count, spinReel delegation) nor edge cases (reelCount=0, large values).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior — _rowCount is silently ignored and reel row count is fixed by spinReel() — is undocumented, making this a meaningful gap for public API consumers.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract signature and the concrete implementation return `Symbol[][]` (mutable). The rest of the codebase (detectScatters, isJackpotHit, SpinResult.reels) consistently uses `ReadonlyArray<ReadonlyArray<Symbol>>`. Returning a mutable type widens the contract unnecessarily. [L5,L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has JSDoc. The silent `rowCount` omission in particular warrants documentation for library consumers who extend the abstract class. [L4,L8] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-imports and directly calls `spinReel` with no injection point. Unit-testing the factory in isolation requires mocking the module. Accepting a `spinFn` parameter (or constructor injection) would decouple it. [L2,L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | `buildReels(reelCount, _rowCount)` silently ignores `rowCount` — always producing 3 rows via `spinReel`. The abstract contract advertises both parameters as meaningful, misleading implementors. A code comment or JSDoc `@remarks` should document this behavior. [L9] |

### Suggestions

- Return readonly arrays to match the rest of the codebase and prevent accidental mutation by consumers.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;`
- Inject `spinReel` for testability instead of hard-importing it.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinFn: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Document the rowCount omission so abstract-class implementors are not misled.
  ```typescript
  // Before
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  /** @param _rowCount Ignored — row count is fixed at 3 by {@link spinReel}. */
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
