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
- **Correction [OK]**: Correctly iterates reelCount reels, delegates each to spinReel(i). Ignoring _rowCount is acknowledged in internal docs as intentional (spinReel always produces 3 rows).
- **Overengineering [OVER]**: Class wrapping a single delegating method with only 1 importer. The entire class reduces to `spinReel(i)` per reel — a plain function like `buildReels(reelCount)` would be leaner. The factory pattern adds ceremony (instantiation, inheritance) with no polymorphic benefit.
- **Tests [NONE]**: No test file exists. `buildReels` is used by `src/engine.ts` (critical game engine path) but has no tests for reel count, row count handling, or `spinReel` integration.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The non-obvious behavior — that _rowCount is silently ignored and row count is fixed by spinReel() — is a critical omission; callers passing rowCount will receive no indication it has no effect.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is fully mutable. The consuming engine types `SpinResult.reels` as `ReadonlyArray<ReadonlyArray<Symbol>>`. The abstract method and its override should return `ReadonlyArray<ReadonlyArray<Symbol>>` to enforce immutability at the boundary. [L5-L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are public extension-point classes documented in the public API reference but carry no JSDoc. The silently-ignored `rowCount` parameter especially warrants a doc note for implementors. [L4-L15] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a hard import with no injection point. Unit-testing `StandardReelBuilderFactory` in isolation requires module-level mocking. Accepting a `reelSpinner` function via constructor or a protected method would decouple the factory from the concrete implementation. [L8-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling-domain factory: `rowCount` is silently ignored (`_rowCount`) — documented in internal docs but not in JSDoc. Custom subclass implementors inheriting `AbstractReelBuilderFactory` receive no signal that `rowCount` is non-operative in the standard implementation, which could produce unexpected grid shapes in regulated play sessions. [L9-L15] |

### Suggestions

- Use readonly return types to match the engine's `SpinResult.reels` contract and prevent downstream mutation.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes, noting the ignored `rowCount` parameter on the concrete implementation.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  /**
   * Concrete reel factory using `spinReel`. Note: `rowCount` is ignored;
   * each reel always produces 3 rows via `spinReel()`.
   */
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Inject the reel-spinning function to decouple the factory from the concrete `spinReel` import, improving unit-test isolation.
  ```typescript
  // Before
  import { spinReel } from "./reels.js";
  
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  type ReelSpinner = (index: number) => Symbol[];
  
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinner: ReelSpinner = spinReel) {}
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
