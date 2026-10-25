# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | - | 85% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a well-typed abstract method; no correctness issues.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `_rowCount` is intentionally unused (underscore convention); `spinReel` always returns a fixed 3-symbol array per its documented contract, and the return type `Symbol[][]` is satisfied correctly. No concrete call site demonstrates a wrong row-count mismatch.
- **Overengineering [OVER]**: Factory class wrapping a trivial loop over spinReel calls. The `_rowCount` param is silently ignored (prefixed underscore), exposing that the interface contract doesn't even match real usage. This is a plain function disguised as a factory; the class + inheritance ceremony is unjustified for a single consumer.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type of `buildReels` is mutable `Symbol[][]`. Declaring the return as `readonly (readonly Symbol[])[]` would prevent accidental mutation by callers. [L5,L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has a JSDoc comment. Both are public API entry points consumed by engine.ts. [L4,L8] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is a top-level module import with no injection point. `StandardReelBuilderFactory` cannot be unit-tested with a fake reel generator without module mocking. A constructor parameter `(private readonly spinFn = spinReel)` would decouple it. [L8-L16] |

### Suggestions

- Add JSDoc to both exported classes
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /** Base factory for constructing a 2-D reel grid. Extend to supply custom reel-generation strategies. */
  export abstract class AbstractReelBuilderFactory {
    /** Returns a `reelCount × rowCount` grid of symbols for a single spin. */
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  ```
- Inject spinReel for testability instead of relying on the module-level import
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinFn: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  ```
- Mark the return type as readonly to prevent caller mutation
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][] {`
  - After: `buildReels(reelCount: number, _rowCount: number): readonly (readonly Symbol[])[] {`

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
