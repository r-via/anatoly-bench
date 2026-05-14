# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 95% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

Auto-resolved: function ≤ 5 lines

#### `StandardReelBuilderFactory` (L8–L16)

Auto-resolved: import verified on disk (spinReel found in ./reels.js)

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both `buildReels` signatures return `Symbol[][]` (mutable). The arbitrated README contract specifies `reels: ReadonlyArray<ReadonlyArray<Symbol>>` in `SpinResult`. Returning the readonly form from the factory would enforce the contract at the source and prevent accidental mutation by callers. [L6-L14] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Both `AbstractReelBuilderFactory` and `StandardReelBuilderFactory` are exported with no JSDoc. At minimum `buildReels` params (`reelCount`, `rowCount`) and return type semantics should be documented. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-imports `spinReel` from `reels.js`, creating a concrete coupling that cannot be overridden in unit tests without module mocking. Injecting a `spinFn: (index: number) => Symbol[]` via constructor would make the class fully testable in isolation. [L8-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: `_rowCount` is received but silently dropped — `spinReel(i)` is called with only the reel index. In a regulated slot engine, reel length (symbols per strip) is determined by row count plus the stop window; ignoring it means the factory cannot enforce correct symbol-strip sizing per configuration. This is a design-level smell specific to the gambling domain. [L9-L14] |

### Suggestions

- Return readonly arrays to match the arbitrated SpinResult contract and prevent downstream mutation.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;`
- Inject the spin function to decouple StandardReelBuilderFactory from reels.ts for testability.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spinFn: (index: number) => Symbol[] = spinReel) { super(); }
    buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /**
   * Base factory for constructing reel grids.
   * @param reelCount - number of vertical reel strips
   * @param rowCount  - number of visible symbol rows per strip
   */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Forward `rowCount` to `spinReel` (e.g. `spinReel(i, rowCount)`) so the returned symbol arrays respect the requested row dimension. If `spinReel` does not yet accept a row-count argument, add that parameter to its signature and slice/pad its output accordingly. [L13]

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
