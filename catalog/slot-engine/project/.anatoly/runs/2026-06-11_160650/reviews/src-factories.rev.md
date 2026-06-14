# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | NONE | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract base class with a single abstract method; no logic to evaluate.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists for this source file.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Abstract factory pattern with a single abstract method — the contract (why subclasses exist, what buildReels must guarantee) is non-obvious from the name alone.

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: `_rowCount` is intentionally underscore-prefixed; `spinReel` is documented to always return 3 symbols, making the implementation internally consistent. No concrete call site visible that passes a rowCount ≠ 3 that would expose a mismatch.
- **Overengineering [OVER]**: A class wrapping a trivial for-loop over `spinReel`. The factory pattern adds instantiation ceremony for a single consumer (`engine.ts::spin`) with no benefit. `_rowCount` is silently ignored, exposing that the interface was designed for flexibility that never materialized. A standalone `buildReels(reelCount: number): Symbol[][]` function would be cleaner and equally expressive.
- **Tests [NONE]**: No test file exists. `buildReels` is consumed by the critical `spin` function in engine.ts, but neither the factory nor its reel-building logic has any direct tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its buildReels override. Key behavior — that _rowCount is ignored and spinReel is called per reel index — is invisible without docs.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Both abstract and concrete `buildReels` declare `Symbol[][]` as the return type. The arbitrated README contract (`SpinResult.reels: ReadonlyArray<ReadonlyArray<Symbol>>`) implies produced reels should be immutable once built. Prefer `ReadonlyArray<ReadonlyArray<Symbol>>` on the return signature to enforce this at the factory boundary. [L5,L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Neither `AbstractReelBuilderFactory` nor `StandardReelBuilderFactory` has a JSDoc block. Both are public exports consumed by engine.ts. [L4,L8] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is hard-imported and cannot be substituted during unit tests without module mocking. Injecting a reel-spin function (e.g., via constructor parameter `private readonly spinFn: (index: number) => Symbol[] = spinReel`) would decouple the factory from its dependency and enable deterministic testing — critical for a regulated gaming engine. [L2,L9-L13] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain (reel/symbol/spinReel vocabulary). `_rowCount` is accepted by the interface contract but silently ignored — `spinReel(i)` is called without it. If `spinReel` returns a fixed-length strip, the produced `Symbol[][]` may not match the configured row count, causing grid-dimension mismatch downstream. Either pass `rowCount` to `spinReel` or document the invariant (e.g. `spinReel` always returns exactly `rowCount` symbols). [L9,L12] |

### Suggestions

- Return immutable arrays to match the arbitrated SpinResult contract and prevent downstream mutation.
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];`
  - After: `abstract buildReels(reelCount: number, rowCount: number): ReadonlyArray<ReadonlyArray<Symbol>>;`
- Inject the reel-spin function for testability.
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
      const reels: Symbol[][] = [];
      for (let i = 0; i < reelCount; i++) {
        reels.push(this.spinFn(i));
      }
      return reels;
    }
  }
  ```

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `AbstractReelBuilderFactory` (`AbstractReelBuilderFactory`) [L4-L6]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `StandardReelBuilderFactory` (`StandardReelBuilderFactory`) [L8-L16]
