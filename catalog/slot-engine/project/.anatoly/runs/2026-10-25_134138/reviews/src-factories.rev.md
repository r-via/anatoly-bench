# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | - | 90% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract class with a single abstract method signature; no logic to be incorrect.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Builds reelCount reels by calling spinReel(i) for each index. spinReel returns a 3-row column, and the unused _rowCount is a style matter, not a bug.
- **Overengineering [OVER]**: Class wraps a trivial loop over spinReel and ignores the rowCount parameter. Only one importer. A simple function, or a map over reelCount, replaces the factory and its abstract base.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable; `readonly (readonly Symbol[])[]` would express intent. Local `reels` is mutated locally only, which is fine. [L4-L15] |
| 8 | ESLint compliance | WARN | HIGH | Imported type `Symbol` shadows the global `Symbol` (no-shadow / no-redeclare for builtin globals). The underscore-prefixed unused `_rowCount` is conventionally allowed, but `rowCount` is ignored in the implementation. [L1, L9] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exports have no JSDoc. The contract of `buildReels` is not documented. The unused `rowCount` and the meaning of `spinReel(i)` (reel index, random) are unclear from the signature. [L4-L15] |
| 15 | Testability | WARN | MEDIUM | `spinReel` is hard-wired, so there is no injection point. The abstract factory partly mitigates this, because consumers can substitute a different factory. [L10-L14] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-engine domain. `rowCount` is ignored, so the factory contract (`reelCount`, `rowCount`) is only partly honored. `StandardReelBuilderFactory` produces reels whose height does not depend on `rowCount`. [L9-L14] |

### Suggestions

- Document the factory contract and the ignored rowCount.
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  /** Builds the reel strips for a slot machine. */
  export abstract class AbstractReelBuilderFactory {
    /** @returns one Symbol array per reel (length === reelCount). */
    abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];
  }
  ```
- Inject the reel-spinning function for testability.
  ```typescript
  // Before
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
  // After
  export class StandardReelBuilderFactory extends AbstractReelBuilderFactory {
    constructor(private readonly spin: (i: number) => Symbol[] = spinReel) { super(); }
  ```
- Rename the imported type to avoid shadowing the global Symbol.
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { Symbol as ReelSymbol } from "./types.js";`

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
