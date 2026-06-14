# Review: `src/jackpot.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts DIAMOND symbols across all cells and returns true when count >= 4, matching the documented contract.
- **Overengineering [LEAN]**: Flat nested loop counting DIAMOND symbols across a 2D array — minimal and appropriate for the task.
- **Tests [NONE]**: No test file found. Critical game logic called by src/engine.ts has zero test coverage — no happy path, no edge cases (empty reels, fewer than 4 diamonds, exactly 4, nested structure variations).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The function name hints at purpose but the threshold (>=4 diamonds), grid assumptions, and return semantics are not documented inline.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | `isJackpotHit` is a public export with no JSDoc. At minimum a `@param` and `@returns` block should describe the jackpot threshold and grid contract. |

### Suggestions

- Add JSDoc to the exported function to document the jackpot threshold and grid contract.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when 4 or more DIAMOND symbols appear anywhere on the reel grid.
   * @param reels - The 5 × 3 reel grid produced by a spin.
   * @returns Whether the jackpot condition is met.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
