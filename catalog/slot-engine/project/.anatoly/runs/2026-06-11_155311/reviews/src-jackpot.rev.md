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
- **Overengineering [LEAN]**: Flat nested loop counting DIAMOND occurrences across a 2D array. Minimal, single-purpose, no unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical jackpot detection logic (threshold: 4 DIAMOND symbols) consumed by core spin engine has zero test coverage — missing edge cases: exactly 3 diamonds (false), exactly 4 diamonds (true boundary), 5+ diamonds, empty reels, no diamonds.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious semantics: threshold of 4 DIAMONDs, grid-wide scan (not payline-restricted), and ReadonlyArray input contract are not documented.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | isJackpotHit is exported with no JSDoc. A brief description of the threshold and grid shape would align with the documented public API. [L3] |

### Suggestions

- Add JSDoc to the exported function describing the threshold and expected grid shape.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the 5×3 reel grid contains 4 or more DIAMOND symbols.
   * Threshold is hardcoded per game specification.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Extract the magic number 4 as a named constant to make the threshold self-documenting and easier to locate.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
