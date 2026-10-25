# Review: `src/jackpot.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | - | 80% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts DIAMOND symbols across all reels and returns count >= 4. This is self-consistent. No doc, comment or confident industry convention sets a different threshold or a payline-only rule, so the `>= 4` value is not provably wrong.
- **Overengineering [LEAN]**: Simple nested loop counting DIAMOND symbols with a threshold check. Minimal, no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | `Symbol` is imported and shadows the global `Symbol` (no-shadow / no-redeclare for builtin globals). Single-line `if` without braces may violate `curly`. [L1, L7] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` has no JSDoc. The threshold (>= 4 DIAMOND symbols across all reels) and the 'DIAMOND' symbol dependency cannot be read from the name or signature. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | The jackpot threshold `4` is a magic number and the 'DIAMOND' literal is inline. Named constants would make the rule configurable and self-documenting. [L7, L10] |

### Suggestions

- Document the function and extract named constants for the threshold and symbol
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    ...
    return diamondCount >= 4;
  }
  // After
  const JACKPOT_SYMBOL = "DIAMOND" as const;
  const JACKPOT_MIN_COUNT = 4;
  
  /** Returns true when at least JACKPOT_MIN_COUNT DIAMOND symbols appear anywhere on the reels. */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    ...
    return diamondCount >= JACKPOT_MIN_COUNT;
  }
  ```
- Alias the imported type to avoid shadowing the global Symbol
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { Symbol as ReelSymbol } from "./types.js";`
