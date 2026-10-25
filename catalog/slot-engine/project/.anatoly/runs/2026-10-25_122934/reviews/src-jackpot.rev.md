# Review: `src/jackpot.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | - | 88% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts DIAMOND symbols across all columns and returns true at >= 4. The loop is correct. No doc or adjacent constant sets the intended threshold, so the value is not provably wrong.
- **Overengineering [LEAN]**: Single nested loop counting DIAMOND symbols and comparing to a threshold. Minimal, no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | The imported type `Symbol` shadows the global `Symbol` (no-shadow / no-redeclare with builtinGlobals). Single-line `if` without braces may violate `curly`. Both are style-level and depend on the project's lint config. [L1, L7] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `isJackpotHit` has no JSDoc. The jackpot threshold (4 diamonds) is undocumented. [L3] |

### Suggestions

- Add JSDoc and extract the magic threshold into a named constant
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    ...
    return diamondCount >= 4;
  }
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  
  /** Returns true when the reel grid contains at least {@link JACKPOT_DIAMOND_THRESHOLD} DIAMOND symbols. */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    ...
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  }
  ```
- Brace the single-line if and avoid shadowing the global Symbol (e.g. alias the import)
  ```typescript
  // Before
  import type { Symbol } from "./types.js";
  ...
  if (sym === "DIAMOND") diamondCount++;
  // After
  import type { Symbol as ReelSymbol } from "./types.js";
  ...
  if (sym === "DIAMOND") {
    diamondCount++;
  }
  ```
