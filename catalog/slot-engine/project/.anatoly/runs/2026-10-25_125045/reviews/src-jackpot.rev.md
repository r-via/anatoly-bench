# Review: `src/jackpot.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly iterates all reel positions, accumulates DIAMOND count, and returns true when count >= 4. No logic errors, type mismatches, or unsafe operations.
- **Overengineering [LEAN]**: Flat nested loop over a 2D array with a single counter — minimal and appropriate for counting diamonds across reels.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | Exported function `isJackpotHit` has no JSDoc. Not a test file; public API consumers (src/engine.ts::spin) benefit from documentation explaining the ≥4 diamond threshold. [L3] |

### Suggestions

- Add JSDoc to the exported `isJackpotHit` function documenting the ≥4 DIAMOND threshold and the return contract.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when four or more DIAMOND symbols appear across all reels,
   * triggering the progressive jackpot.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
