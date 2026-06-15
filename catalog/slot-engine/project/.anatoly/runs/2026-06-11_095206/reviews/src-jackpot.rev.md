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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all reels/rows and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double loop counting DIAMONDs then comparing to threshold. Minimal and appropriate for a single-purpose predicate.
- **Tests [NONE]**: No test file exists. Critical game logic called by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), under-threshold, and empty reel cases all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. The function name hints at purpose but non-obvious details are undocumented: the DIAMOND-counting mechanic, the hardcoded threshold of 4, and that detection spans the full grid (not restricted to paylines).

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. Slot-machine library consumers benefit from documenting the threshold (≥4 DIAMONDs) and the grid shape assumption. [L3] |

### Suggestions

- Add JSDoc to document the jackpot threshold and grid assumption for library consumers.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the supplied reel grid contains 4 or more DIAMOND symbols.
   * Designed for a 5 × 3 grid but accepts any rectangular input.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
