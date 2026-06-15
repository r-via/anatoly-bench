# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: buildReels correctly iterates 0..reelCount-1, calling spinReel(i) per reel and accumulating results. _rowCount is intentionally ignored per internal docs (spinReel always yields 3 rows). Return type Symbol[][] matches the abstract contract.
- **Overengineering [OVER]**: Class/factory wrapper around a 4-line loop that calls spinReel. Only 1 importer, no state, no injection — a top-level function `buildReels(reelCount)` would be identical in capability. The ignored `_rowCount` parameter also signals the abstraction contract is already broken at the sole implementation.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts but buildReels logic (loop calling spinReel per reel index, returning Symbol[][]) has zero test coverage — no happy path, no edge cases (reelCount=0, varying rowCount ignored by _rowCount).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The non-obvious behavior — rowCount is silently ignored; reel height is always fixed by spinReel() — is undocumented.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable, but the rest of the codebase (detectScatters, isJackpotHit, SpinResult.reels) consistently uses `ReadonlyArray<ReadonlyArray<Symbol>>`. The factory output feeds directly into those consumers. [L4-L5] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has JSDoc. Both are public extension-point classes documented in the API reference — consumers need guidance on subclassing and the intentional `rowCount`-ignore behavior. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory.buildReels` hard-couples to `spinReel` with no injection seam. Testing deterministic reel output requires module-level mocking of `reels.js`. The abstract class pattern enables subclassing as a workaround, but the concrete implementation cannot be tested without patching the module. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | `AbstractReelBuilderFactory.buildReels` declares `rowCount` as a required parameter, but `StandardReelBuilderFactory` silently ignores it (renamed `_rowCount`). The parameter is dead in every concrete implementation, creating a misleading contract for library authors who subclass and assume `rowCount` drives output shape. No comment or JSDoc documents this intentional divergence. [L4-L5] |

### Suggestions

- Align return type with codebase-wide reel immutability convention
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  buildReels(reelCount: number, _rowCount: number): Symbol[][]
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>
  ```
- Add JSDoc to both exported classes explaining the extension contract and the rowCount caveat
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /**
   * Extension point for custom reel construction strategies.
   * Subclass and override `buildReels` to provide deterministic or
   * seeded reels (e.g., for testing or alternative RNG sources).
   */
  export abstract class AbstractReelBuilderFactory {
    /**
     * @param reelCount - Number of reels to build.
     * @param rowCount - Number of visible rows per reel.
     *   Note: `StandardReelBuilderFactory` ignores this parameter;
     *   `spinReel()` always produces 3 rows.
     */
    abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  }
  ```
- Inject spinReel as a dependency to enable unit testing without module mocking
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
