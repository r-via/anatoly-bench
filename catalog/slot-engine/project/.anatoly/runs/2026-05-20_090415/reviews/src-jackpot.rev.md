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
- **Correction [OK]**: Counts DIAMOND symbols across all cells and returns true when count >= 4, matching the documented threshold exactly.
- **Overengineering [LEAN]**: Flat double loop counts DIAMOND occurrences; no unnecessary abstraction. ReadonlyArray typing is appropriate for immutable input. Hardcoded threshold matches documented design.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot detection) imported by src/engine.ts has zero coverage — no happy path, edge cases (empty reels, exactly 4 diamonds, 3 diamonds), or boundary tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of jackpot logic, the DIAMOND counting mechanic, the hardcoded threshold of 4, and what the boolean return value signifies.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | Magic number `4` on L10 would be flagged by `no-magic-numbers`. Extract to a named constant. [L10] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is exported but has no JSDoc comment. Add `@param` / `@returns` at minimum. [L3] |

### Suggestions

- Extract the magic number `4` to a named constant to satisfy `no-magic-numbers` and make the threshold self-documenting.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4 as const;
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```
- Add JSDoc to the exported function.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when 4 or more DIAMOND symbols appear anywhere across the reel grid.
   * @param reels - Full 5×3 reel grid snapshot after a spin.
   * @returns Whether the jackpot condition is met.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
