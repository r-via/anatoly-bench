# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | NONE | 55% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: `_rowCount` is silently ignored: `spinReel(i)` receives no row-count argument, so callers cannot control reel height through the factory interface.
- **Overengineering [ACCEPTABLE]**: Implementation is a simple loop over `spinReel(i)` — intrinsically LEAN. Exists as a class only because `AbstractReelBuilderFactory` mandates it. Has 1 importer and is documented as a public extension type, making the class wrapper marginally justified. `_rowCount` is silently ignored, which overpromises on the interface contract but is not itself an overengineering issue.
- **Tests [NONE]**: No test file exists. Used by src/engine.ts, meaning buildReels() is a critical path: reel count, row count handling, and spinReel delegation are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its `buildReels` method. Parameters `reelCount` and `_rowCount` (notably ignored) are undocumented, and the return structure is not explained.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | buildReels returns Symbol[][] — a mutable nested array. The reference docs show SpinResult.reels as ReadonlyArray<ReadonlyArray<Symbol>>; returning ReadonlyArray<ReadonlyArray<Symbol>> here would enforce that contract at the factory boundary. [L9-L16] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Neither AbstractReelBuilderFactory nor StandardReelBuilderFactory (nor their buildReels methods) have JSDoc comments. Both are exported public API surface. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | StandardReelBuilderFactory hard-imports and directly calls spinReel with no injection seam. Unit testing requires overriding the entire concrete class; a reelSpinner: (index: number) => Symbol[] constructor parameter would make the factory trivially testable. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | buildReels accepts rowCount but silently ignores it (_rowCount). In a slot engine, rowCount controls the visible window depth per reel. Accepting the parameter in the abstract contract while discarding it in the only shipped concrete class signals an incomplete contract — either the abstract signature should not require rowCount, or the implementation should use it. [L9] |

### Suggestions

- Return an immutable nested array to match the ReadonlyArray<ReadonlyArray<Symbol>> contract used downstream in SpinResult.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {`
- Inject the reel-spin function so StandardReelBuilderFactory is testable without touching module state.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly reelSpinner: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes and the buildReels method.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /** Base factory for building reel grids. Extend to supply a custom spin strategy. */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Forward `rowCount` to `spinReel` (or slice/pad its result) so callers receive reels of the requested height; remove the `_` suppression prefix once the parameter is used. [L9]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
