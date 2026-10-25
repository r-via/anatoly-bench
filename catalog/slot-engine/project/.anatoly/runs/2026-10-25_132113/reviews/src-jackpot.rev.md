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
- **Correction [OK]**: Counts DIAMOND cells across all reels and returns count >= 4. The threshold is self-consistent, and no doc or convention in context states a different jackpot condition. No crash path or logic error.
- **Overengineering [LEAN]**: Single nested loop counting DIAMOND symbols against a threshold. Minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `isJackpotHit` has no JSDoc. It hides a magic threshold: 4 diamonds. [L3] |

### Suggestions

- Add JSDoc and extract the threshold into a named constant
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    ...
    return diamondCount >= 4;
  }
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  
  /** Returns true when the reels contain at least JACKPOT_DIAMOND_THRESHOLD DIAMOND symbols. */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    ...
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  }
  ```
