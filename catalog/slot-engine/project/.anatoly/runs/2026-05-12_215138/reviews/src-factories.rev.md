# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | NEEDS_FIX | OVER | USED | UNIQUE | NONE | 55% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [NEEDS_FIX]**: _rowCount is silently ignored: spinReel(i) receives only the reel index, so row count has no effect on reel construction. If spinReel is supposed to return `rowCount` symbols per reel, callers will receive wrong-length reel arrays.
- **Overengineering [OVER]**: Class wrapping a single loop over `spinReel` calls. No state, no dependency injection, no multiple implementations — a plain function `buildReels(reelCount, rowCount): Symbol[][]` would be simpler. The class exists solely to satisfy the unnecessary abstract factory pattern above.
- **Tests [NONE]**: No test file exists. buildReels is imported by src/engine.ts (production critical path) and has no coverage — reelCount iteration, spinReel delegation, and returned Symbol[][] shape are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Notable behavior — _rowCount is ignored entirely — is undocumented, as are parameter semantics and return shape.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is fully mutable. In a casino/reel domain where outcomes should be fixed after creation, `ReadonlyArray<ReadonlyArray<Symbol>>` would prevent accidental post-construction mutation by callers. [L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. `buildReels` parameters (`reelCount`, `rowCount`) are undocumented — callers cannot infer expected ranges or units. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` statically imports `spinReel`, making it impossible to inject a mock or deterministic reel spinner in tests. Injecting the spin function (constructor or method parameter) would decouple the factory from the live RNG implementation. [L2-L15] |

### Suggestions

- Make the return type immutable to prevent callers from mutating reel outcomes after construction.
  - Before: `buildReels(reelCount: number, _rowCount: number): Symbol[][]`
  - After: `buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>`
- Inject the spin function to decouple from live RNG and allow deterministic unit tests.
  ```typescript
  // Before
  import { spinReel } from "./reels.js";
  
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  type SpinFn = (index: number) => Symbol[];
  
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: SpinFn = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Base factory for constructing the reel grid before each spin.
   * Extend this class to implement alternative reel-building strategies.
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Pass `_rowCount` (rename to `rowCount`) to `spinReel` so each reel contains exactly the requested number of rows, e.g. `spinReel(i, rowCount)` — assuming spinReel supports a length argument. If spinReel does not support it, the slicing/padding must happen here. [L12]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
