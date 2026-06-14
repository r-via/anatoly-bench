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
- **Overengineering [LEAN]**: Flat nested loop counting a single symbol type. No unnecessary abstractions, generics, or patterns.
- **Tests [NONE]**: No test file exists. Critical game logic used by src/engine.ts has zero coverage — no happy path, edge cases (empty reels, fewer than 4 diamonds, exactly 4, nested empty arrays), or boundary tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public function with no JSDoc/TSDoc comment. Missing: parameter description for `reels`, return value semantics, hardcoded threshold of 4 DIAMONDs, and the fact that matching is grid-wide (not payline-restricted).

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | `isJackpotHit` is a public export with no JSDoc. At minimum, document the threshold semantics and the grid shape assumption. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine/regulated-gaming domain inferred from reel/jackpot/DIAMOND/payline vocabulary. The threshold `4` is a bare magic number inline in the comparison. Regulated gaming code requires auditable, named thresholds — a hardcoded literal makes certification review harder. [L10] |

### Suggestions

- Extract the jackpot threshold into a named constant for auditability in regulated gaming contexts.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4 as const;
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```
- Add JSDoc to the public export documenting the threshold and grid assumptions.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the grid contains 4 or more DIAMOND symbols.
   * Scans the full grid (not payline-restricted).
   * @param reels - 5×3 reel grid produced by a single spin.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
