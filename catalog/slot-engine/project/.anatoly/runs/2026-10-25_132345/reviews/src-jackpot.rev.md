# Review: `src/jackpot.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | - | 72% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts DIAMOND across the whole grid and returns true at 4 or more. The README states no jackpot threshold, and no constant or comment in the file contradicts 4, so there is no contract to check it against. The loop and counter logic are correct.
- **Overengineering [LEAN]**: Single nested loop counting DIAMOND symbols against a threshold. Minimal, no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | The imported type `Symbol` shadows the global `Symbol`. This can trigger `no-shadow` or `no-redeclare` (builtinGlobals) and hurts readability. The name is defined in types.ts, so the root fix belongs there. The magic number 4 is also unnamed. [L1, L11] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `isJackpotHit` has no JSDoc. The jackpot threshold (4 diamonds) is undocumented. [L3] |

### Suggestions

- Add JSDoc and name the threshold constant
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    ...
    return diamondCount >= 4;
  }
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  
  /** Returns true when the grid holds at least JACKPOT_DIAMOND_THRESHOLD DIAMOND symbols. */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    ...
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  }
  ```
- Rename the `Symbol` type in types.ts to avoid shadowing the global (for example `ReelSymbol`)
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { ReelSymbol } from "./types.js";`
