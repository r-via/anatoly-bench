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
- **Correction [OK]**: Correctly counts all DIAMOND symbols across the full grid and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double-loop counting a single symbol type, returns a boolean threshold check. Minimal and appropriate for the documented jackpot rule (≥4 DIAMONDs anywhere on board).
- **Tests [NONE]**: No test file found. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, fewer than 4 diamonds).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols), parameter shape (2D array of Symbol), and return value semantics.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported function `isJackpotHit` lacks JSDoc. Given its role in the gambling engine, documenting the jackpot threshold (>=4 DIAMONDs) and parameter shape would improve maintainability. [L3] |

### Suggestions

- Add JSDoc to document the jackpot threshold and parameter semantics for the public export.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere on the board.
   * @param reels - Full reel grid (columns × rows of Symbol values).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
