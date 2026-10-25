# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | - | 88% |

### Details

#### `AbstractReelBuilderFactory` (L4–L6)

- **Utility [USED]**: Transitively used by StandardReelBuilderFactory
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Abstract class with a single abstract method; no logic to be incorrect.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `StandardReelBuilderFactory` (L8–L16)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No RAG data available
- **Correction [OK]**: Builds reelCount reels via spinReel(i), each returning 3 symbols. Unused _rowCount is a style matter, not a bug. The hard-coded 3 rows in spinReel matches the 5x3 grid the engine requests.
- **Overengineering [OVER]**: Class wrapper around a loop calling spinReel per reel. Plain function suffices. Single importer. The rowCount parameter is unused (_rowCount), which shows the interface is speculative.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable; `readonly (readonly Symbol[])[]` would express immutability of the built grid. [L4-L12] |
| 8 | ESLint compliance | WARN | HIGH | Imported `Symbol` shadows the global `Symbol` (no-shadow-restricted-names / no-redeclare for builtin globals). `_rowCount` is intentionally unused (underscore-prefixed) so is fine. [L1] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | Exported `AbstractReelBuilderFactory`, its `buildReels`, and `StandardReelBuilderFactory` have no JSDoc. [L4-L16] |
| 13 | Security | WARN | CRITICAL | Slot-machine domain inferred from factory/reel/spin/payout/jackpot vocabulary. Reel construction delegates to `spinReel`/rng.ts; RNG source is not visible here, so regulated-gaming RNG certifiability (no Math.random) cannot be confirmed in this file. Flagged at low confidence; canonical home is reels.ts/rng.ts. |
| 15 | Testability | WARN | MEDIUM | `spinReel` is imported directly rather than injected, coupling the factory to a concrete RNG-backed implementation and making deterministic tests harder. [L2-L12] |
| 17 | Context-adapted rules | WARN | MEDIUM | `rowCount` is part of the `buildReels` contract but ignored by the standard implementation, so callers' row count has no effect (silent contract violation). [L8-L9] |

### Suggestions

- Rename imported `Symbol` type to avoid shadowing the global `Symbol`, and add JSDoc.
  ```typescript
  // Before
  import type { Symbol } from "./types.js";
  
  export abstract class AbstractReelBuilderFactory {
    abstract buildReels(reelCount: number, rowCount: number): Symbol[][];
  }
  // After
  import type { Symbol as ReelSymbol } from "./types.js";
  
  /** Builds a grid of reels for a spin. */
  export abstract class AbstractReelBuilderFactory {
    /** @returns one symbol array per reel. */
    abstract buildReels(reelCount: number, rowCount: number): ReelSymbol[][];
  }
  ```
- Inject the reel spinner for testability and honor rowCount.
  - Before: `reels.push(spinReel(i));`
  - After: `reels.push(this.spin(i, rowCount));`

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
