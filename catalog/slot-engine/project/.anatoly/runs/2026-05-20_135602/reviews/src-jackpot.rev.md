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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all cells and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double-loop counting a single symbol type; minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Critical game logic used by src/engine.ts has no coverage for happy path, edge cases (fewer than 4 diamonds, exactly 4, empty reels, mixed symbols), or boundary conditions.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behavior includes: the hardcoded threshold of 4 DIAMONDs, that counting spans the entire grid (not payline-restricted), and the meaning of the reels parameter shape — none of which are documented inline.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. A one-liner describing the threshold and parameter shape would aid consumers. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from reels/DIAMOND/jackpot vocabulary. The jackpot threshold `4` is a bare magic number. In regulated gambling code, game-logic constants should be named exports so they appear in audit trails and are configurable without touching logic. [L10] |

### Suggestions

- Add JSDoc to the public export.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the grid contains 4 or more DIAMOND symbols.
   * @param reels - Full 5 × 3 reel grid after a spin.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Extract the threshold to a named constant for auditability in regulated gambling context.
  ```typescript
  // Before
    return diamondCount >= 4;
  // After
  export const JACKPOT_DIAMOND_THRESHOLD = 4 as const;
  // …
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
