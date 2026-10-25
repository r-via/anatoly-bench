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
- **Correction [OK]**: Counts DIAMOND symbols across the grid and compares the count to a threshold of 4. The logic is internally consistent. No contract in the docs or code states the intended threshold, so the value cannot be shown wrong.
- **Overengineering [LEAN]**: Simple nested loop counting DIAMOND symbols against a threshold. Minimal, no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | Imported `Symbol` shadows the global `Symbol` (no-shadow / no-redeclare for builtin globals). Brace-less `if` may violate `curly`. [L1, L7] |
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported isJackpotHit lacks JSDoc; the threshold of 4 diamonds is an undocumented magic number. [L3] |

### Suggestions

- Add JSDoc and name the threshold constant.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  /** Returns true when the grid contains at least 4 DIAMOND symbols. */
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```
- Alias the imported type to avoid shadowing the global Symbol.
  - Before: `import type { Symbol } from "./types.js";`
  - After: `import type { Symbol as ReelSymbol } from "./types.js";`
