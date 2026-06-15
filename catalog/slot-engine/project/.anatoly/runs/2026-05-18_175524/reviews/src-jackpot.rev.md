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
- **Overengineering [LEAN]**: Flat double-loop counting a single symbol type, returns a boolean threshold check. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical game logic (jackpot trigger) with no coverage — happy path, boundary (exactly 4 diamonds), under-boundary (3 diamonds), empty reels, and multi-reel distribution cases all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols anywhere on the grid), parameter docs for `reels`, and return value semantics.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. A one-line doc block covering the 4-diamond threshold and return semantics is missing. [L3] |

### Suggestions

- Add JSDoc to the exported function documenting the jackpot threshold and parameter shape.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere on the reels.
   * @param reels - 2-D grid of symbols (columns × rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
