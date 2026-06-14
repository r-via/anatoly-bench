# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 88% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with correct abstract method signature; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Abstract class with no runtime logic — but its contract (buildReels signature) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose of the abstract factory pattern, expected contract of buildReels (what the returned Symbol[][] represents, how reelCount/rowCount affect output), and intended extension points are not described.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `_rowCount` is intentionally ignored; `spinReel` always returns 3 symbols by contract, which is consistent with a fixed-row slot machine. Loop over `reelCount` is correct, return shape matches `Symbol[][]`.
- **Overengineering [OVER]**: Factory class wrapping a trivial loop over spinReel(). Has only 1 consumer (engine.ts::spin). The entire class could be replaced with a single standalone function `buildReels(reelCount, rowCount): Symbol[][]`, eliminating the factory pattern and its unnecessary abstract base.
- **Tests [NONE]**: No test file exists. buildReels is consumed by the critical spin() function in engine.ts (bet validation, payline evaluation, jackpot detection), yet there are zero tests verifying reelCount iteration, spinReel delegation, or returned Symbol[][] shape.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The concrete implementation's behavior (delegates to spinReel per reel, ignores rowCount) and why _rowCount is unused are undocumented. Consumed by spin() in engine.ts, making this a public API surface that warrants at minimum a summary comment.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Abstract contract and concrete return type are `Symbol[][]` (mutable). The arbitrated SpinResult contract requires `ReadonlyArray<ReadonlyArray<Symbol>>`. Returning mutable arrays from the factory forces every consumer to widen/cast instead of enforcing immutability at the source. [L5-L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has JSDoc. Both are public exported symbols consumed by engine.ts. [L4-L16] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory.buildReels` hard-imports and calls `spinReel` directly. No injection point for a deterministic test double. Tests of engine.ts that use this factory cannot stub reel outcomes without monkey-patching the module. [L9-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | `rowCount` is part of the abstract contract (`buildReels(reelCount, rowCount)`) but silently ignored in the only concrete implementation (`_rowCount`). In a slot-machine engine, row count determines the visible window; ignoring it makes the factory's public API misleading and any future subclass that does use it will behave differently from the default. [L5-L9] |

### Suggestions

- Return immutable arrays to match the arbitrated SpinResult contract and enforce immutability at the factory boundary.
  ```typescript
  // Before
  abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  
  buildReels(reelCount: number, _rowCount: number): Symbol[][] {
  // After
  abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;
  
  buildReels(reelCount: number, _rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>> {
  ```
- Accept spinReel as a constructor-injected dependency so tests can substitute a deterministic stub.
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
      const reels: ReadonlyArray<Symbol>[] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spinFn(i));
      }
      return reels;
    }
  }
  ```
- Add JSDoc to both exported classes.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /** Base factory for building the reel grid for a single spin. */
  export abstract class AbstractReelBuilderFactory {
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
