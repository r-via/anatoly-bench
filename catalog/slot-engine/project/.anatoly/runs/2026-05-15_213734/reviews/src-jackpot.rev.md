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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all cells and returns true when diamondCount >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND symbols, single threshold check. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), edge cases (empty reels, fewer than 4 diamonds) all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape (2D reel array), return semantics, and the ≥4 DIAMOND threshold rule.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. A brief description of the threshold (≥4 DIAMOND symbols) and parameter shape would match the level of detail in the project's reference docs. [L3] |

### Suggestions

- Add JSDoc to the public export documenting the jackpot threshold and parameter shape.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere on the grid.
   * @param reels - 2-D grid of symbols (columns × rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
