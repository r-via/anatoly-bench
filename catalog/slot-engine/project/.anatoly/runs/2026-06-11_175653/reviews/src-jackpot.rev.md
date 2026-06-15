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
- **Correction [OK]**: Correctly counts DIAMOND symbols across the full grid and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences, single return. No unnecessary abstraction for this simple threshold check.
- **Tests [NONE]**: No test file exists. Critical game logic consumed by `spin` with no coverage of: exactly 4 diamonds (boundary true), 3 diamonds (boundary false), 0 diamonds, diamonds spread across multiple reels vs. same reel, or empty reels input.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot condition (4+ DIAMONDs anywhere on grid), parameter shape, and return semantics.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. The hardcoded threshold (4 diamonds) and grid assumption (5×3) are non-obvious contract details that callers cannot infer from the signature alone. [L3] |

### Suggestions

- Add JSDoc to document the non-obvious threshold and grid assumption for `isJackpotHit`.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when 4 or more DIAMOND symbols appear anywhere across
   * the 5 × 3 reel grid in a single spin.
   *
   * @param reels - Full reel grid produced by the spin (outer = columns, inner = rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Optional micro-optimisation: early return once the threshold is reached (negligible on a 5×3 grid, but communicates intent).
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
