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
- **Correction [OK]**: Counts DIAMOND symbols across reels and returns true at >=4. Logic is internally consistent; docs give no jackpot threshold, so the value cannot be shown wrong.
- **Overengineering [LEAN]**: Simple nested loop counting DIAMOND symbols with a threshold check. Minimal, no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `isJackpotHit` has no JSDoc. The jackpot rule (4 or more DIAMOND symbols across all reels) is undocumented. [L3] |

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
  
  /** Returns true when the reels contain at least JACKPOT_DIAMOND_THRESHOLD DIAMOND symbols. */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    ...
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  }
  ```
