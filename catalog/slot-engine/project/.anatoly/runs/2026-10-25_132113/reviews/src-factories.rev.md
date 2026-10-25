# Review: `src/factories.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| AbstractReelBuilderFactory | class | yes | OK | LEAN | USED | UNIQUE | - | 88% |
| StandardReelBuilderFactory | class | yes | OK | OVER | USED | UNIQUE | - | 88% |

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
- **Correction [OK]**: Builds reelCount reels via spinReel(i), each a Symbol[] of three rows. The unused _rowCount parameter is a style matter, not a correctness defect. No concrete in-tree call path shows wrong output.
- **Overengineering [OVER]**: Class wrapping a loop over spinReel with no state. A plain function would do. It has one importer and ignores the _rowCount parameter. The factory-of-builders pattern adds indirection with no benefit.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | Return type `Symbol[][]` is mutable; `readonly (readonly Symbol[])[]` would express the contract. Local `reels` accumulator is fine. [L4-L15] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Two exported classes (AbstractReelBuilderFactory, StandardReelBuilderFactory) and the abstract method lack JSDoc. [L4-L7] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory` hard-wires `spinReel` import, but the abstract factory is an injection seam for consumers. [L8-L15] |
| 17 | Context-adapted rules | WARN | MEDIUM | `rowCount` is part of the contract but ignored by the standard implementation; `spinReel(i)` is not given the row count, so the reel shape may not match the requested rows. Importing `Symbol` also shadows the global `Symbol`. [L9-L14] |

### Suggestions

- Add JSDoc to the exported factory contract and implementation
  ```typescript
  // Before
  export abstract class AbstractReelBuilderFactory {
  // After
  /** Contract for building the set of reels used in a spin. */
  export abstract class AbstractReelBuilderFactory {
  ```
- Use readonly return type to express immutability
  - Before: `abstract buildReels(reelCount: number, rowCount: number): Symbol[][];`
  - After: `abstract buildReels(reelCount: number, rowCount: number): readonly (readonly Symbol[])[];`
- Avoid shadowing the global Symbol by aliasing the import
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { Symbol as ReelSymbol } from "./types.js";`

## Actions

### Hygiene

- **[overengineering · medium · small]** Simplify: `StandardReelBuilderFactory` is over-engineered (`StandardReelBuilderFactory`) [L8-L16]
