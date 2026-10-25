# Review: `src/jackpot.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | - | 85% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts DIAMOND symbols across the grid and returns true at 4 or more. The loop and types are correct. No doc or adjacent constant sets a different jackpot threshold, so the `>= 4` value cannot be shown wrong.
- **Overengineering [LEAN]**: Simple nested loop counting DIAMOND symbols against a threshold. Minimal, no unnecessary abstraction. Consistent with README's jackpot detection.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | `import type { Symbol }` shadows the global `Symbol` (no-shadow / no-redeclare with builtinGlobals). The name is defined in ./types.js, so the fix belongs there. The single-line `if` without braces violates `curly` under common configs. [L1, L7] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is self-describing by name, but the magic threshold (>= 4 DIAMONDs anywhere on the grid) is undocumented. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | The jackpot threshold `4` and symbol `"DIAMOND"` are hardcoded magic values. The README describes a progressive jackpot without stating the condition, so no divergence is flagged. Named constants would make the rule configurable and testable. [L4-L10] |

### Suggestions

- Extract magic values into named constants, add braces, and document the function
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    let diamondCount = 0;
    ...
    return diamondCount >= 4;
  }
  // After
  const JACKPOT_SYMBOL = "DIAMOND" as const;
  const JACKPOT_MIN_COUNT = 4;
  
  /** Returns true when at least JACKPOT_MIN_COUNT DIAMOND symbols appear anywhere on the grid. */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    let count = 0;
    for (const col of reels) {
      for (const sym of col) {
        if (sym === JACKPOT_SYMBOL && ++count >= JACKPOT_MIN_COUNT) return true;
      }
    }
    return false;
  }
  ```
- Rename the imported type to avoid shadowing the global Symbol (rename in types.ts)
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { ReelSymbol } from "./types.js";`
