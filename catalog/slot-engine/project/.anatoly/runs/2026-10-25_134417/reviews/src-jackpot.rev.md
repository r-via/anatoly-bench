# Review: `src/jackpot.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates all reel positions, counts DIAMOND occurrences, and returns the threshold comparison. No logic errors, type mismatches, or unsafe operations.
- **Overengineering [LEAN]**: Simple nested loop counting a specific symbol across a 2D array with a threshold check. No unnecessary abstraction, generics, or patterns.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is exported with no JSDoc. The threshold of ≥4 DIAMOND symbols is a non-obvious business invariant not communicated by name or signature alone. [L3] |

### Suggestions

- Document the jackpot threshold invariant on the exported function
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the reel matrix contains at least 4 DIAMOND symbols
   * anywhere across all visible positions (jackpot threshold = 4).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
