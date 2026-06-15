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
- **Correction [OK]**: Implementation exactly matches the documented invariant: count all DIAMOND symbols across all cells and return true when count >= 4. Logic, iteration, and threshold are all correct per .anatoly/docs/02-Architecture/02-Core-Concepts.md and .anatoly/docs/03-Guides/02-Advanced-Configuration.md.
- **Overengineering [LEAN]**: Straightforward double loop counting DIAMOND symbols against a documented threshold of 4. The implementation matches exactly what is specified in `.anatoly/docs/02-Architecture/02-Core-Concepts.md` and `.anatoly/docs/03-Guides/02-Advanced-Configuration.md`. No unnecessary abstractions, generics, or patterns — just minimal imperative logic for a well-defined single responsibility.
- **Tests [NONE]**: No test file found for this source file. The function is imported by src/engine.ts indicating it is part of a critical business path (jackpot determination), yet there are no tests covering the happy path (exactly 4 diamonds triggering a jackpot), edge cases (0 diamonds, 3 diamonds, more than 4 diamonds, empty reels, or mixed symbol grids), or boundary conditions (exactly 4 vs 3 diamonds).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment is present above or within the function. The function has non-trivial semantics (counts DIAMOND symbols across a 2D reel array, triggers jackpot at >= 4) that warrant documentation of its parameter shape, return value meaning, and the jackpot threshold. Internal .anatoly/ references document it well, but those do not count toward inline documentation scoring.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc comment. The function's behaviour, parameter shape (5×3 reel grid), and threshold (>=4 DIAMONDs) are non-trivial and documented only in `.anatoly/docs/03-Guides/02-Advanced-Configuration.md`. A JSDoc block would bring that context to the call-site via IDE tooltips. [L3] |

### Suggestions

- Add a JSDoc block to `isJackpotHit` to surface the 4-DIAMOND threshold and grid dimensions at every call-site via IDE hover.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more `DIAMOND` symbols appear anywhere
   * across the 5 × 3 reel grid in a single spin, triggering the progressive jackpot.
   *
   * @param reels - A 5-element array of 3-symbol columns (row-major order).
   * @returns `true` if the jackpot condition is met, `false` otherwise.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
