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
- **Correction [OK]**: Logic matches documented invariant: jackpot fires when diamondCount >= 4 anywhere on the grid.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND symbols with a single threshold comparison. Minimal and appropriate for the documented jackpot rule (≥4 DIAMONDs anywhere on the grid).
- **Tests [NONE]**: No test file found. Critical game logic (jackpot threshold, diamond counting across reels) used by src/engine.ts has zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of the jackpot condition (≥4 DIAMOND symbols anywhere on the grid), parameter description for `reels`, and return value semantics.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. A brief comment explaining the 4-diamond threshold and the `reels` shape would aid consumers. [L3] |

### Suggestions

- Add JSDoc to the exported `isJackpotHit` function documenting the 4-diamond threshold and parameter shape.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere on the board.
   * @param reels - Full reel grid produced by a single spin.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
