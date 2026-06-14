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
- **Correction [OK]**: `_rowCount` is intentionally ignored; `spinReel(i)` is expected to return a fixed 3-row column consistent with the hardcoded 5×3 machine spec. Loop correctly builds exactly `reelCount` reels indexed 0…reelCount-1.
- **Overengineering [OVER]**: Wraps a trivial 5-line loop in a class hierarchy solely to satisfy the abstract factory above. `_rowCount` is ignored, exposing that the abstraction generalizes beyond what the engine actually uses. A plain exported function `buildReels(reelCount: number): Symbol[][]` would be equivalent and far simpler.
- **Tests [NONE]**: No test file exists. buildReels is used by src/engine.ts (critical path) but has zero coverage — reelCount loop behavior, spinReel integration, and rowCount being ignored are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The _rowCount parameter is silently ignored — behavior that warrants explicit documentation. Missing @param descriptions and no explanation of the spinReel delegation.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both the abstract and concrete `buildReels` signatures return `Symbol[][]` (mutable). The arbitrated `SpinResult` contract declares `reels: ReadonlyArray<ReadonlyArray<Symbol>>`, so callers must cast. Returning `ReadonlyArray<ReadonlyArray<Symbol>>` from `buildReels` would enforce immutability at the factory boundary and align with the contract. [L5-L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both exported classes (`AbstractReelBuilderFactory`, `StandardReelBuilderFactory`) lack JSDoc. `buildReels` parameters (`reelCount`, `_rowCount`) are undocumented, leaving callers without contract information. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-imports `spinReel` with no injection seam. Unit tests cannot substitute a deterministic reel spinner without module-level mocking. The abstract base class invites DI but the concrete class does not support it. [L8-L16] |
| 17 | Context-adapted rules | WARN | MEDIUM | `_rowCount` is silently ignored. The slot-engine domain (5-reel × 3-row grid per Public API docs) means row count is a meaningful grid dimension. Ignoring it makes `StandardReelBuilderFactory` inflexible and means callers cannot configure a non-3-row layout. If the row count is a fixed invariant, it should be documented as such; if variable, `spinReel` should accept it. [L9-L15] |

### Suggestions

- Return readonly arrays to match the arbitrated SpinResult contract and enforce immutability at the factory boundary.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Inject the reel-spin function to make StandardReelBuilderFactory unit-testable without module mocking.
  ```typescript
  // Before
  import { spinReel } from "./reels.js";
  
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinReel: (index: number) => Symbol[]) { super(); }
  
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /** Factory contract for building a reel grid used in a single spin. */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
