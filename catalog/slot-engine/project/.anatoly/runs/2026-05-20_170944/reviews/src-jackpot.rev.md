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
- **Correction [OK]**: Counts DIAMOND occurrences across all cells and returns true when ≥ 4; matches the documented threshold exactly. No off-by-one, no type error, no unsafe operation.
- **Overengineering [LEAN]**: Straightforward nested loop counting a single symbol type; no unnecessary abstractions, generics, or patterns.
- **Tests [NONE]**: No test file found. Critical game logic (jackpot detection) used by src/engine.ts has zero test coverage — no happy path, no edge cases (empty reels, exactly 4 diamonds, fewer than 4, mixed symbols).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The threshold of 4 DIAMOND symbols and the flat grid-wide counting strategy (not payline-restricted) are non-obvious and undocumented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is exported but has no JSDoc comment. At minimum, a `@param` describing the expected 5×3 grid shape and `@returns` noting the ≥4 DIAMOND threshold would help consumers. [L3] |

### Suggestions

- Add JSDoc to the exported function to document the grid shape and threshold contract.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the reels contain 4 or more DIAMOND symbols anywhere on the 5×3 grid.
   * @param reels - Column-major grid: outer array = columns, inner array = row symbols.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Optional micro-optimisation: early return once threshold is met (no functional impact at 5×3).
  ```typescript
  // Before
    for (const col of reels) {
      for (const sym of col) {
        if (sym === "DIAMOND") diamondCount++;
      }
    }
    return diamondCount >= 4;
  // After
    for (const col of reels) {
      for (const sym of col) {
        if (sym === "DIAMOND" && ++diamondCount >= 4) return true;
      }
    }
    return false;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
