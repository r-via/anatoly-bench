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
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences, returns boolean threshold check. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. No coverage for happy path (≥4 diamonds), edge cases (exactly 4, fewer than 4, empty reels, single reel), or integration with engine.ts call site.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behaviors are undocumented: the hardcoded threshold of 4 DIAMONDs, that counting is grid-wide (not payline-restricted), and what the `reels` parameter structure represents.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | isJackpotHit is a public export with no JSDoc. Given it's the sole API surface of this file, a doc comment describing the threshold and grid assumption would help consumers. [L3] |

### Suggestions

- Add JSDoc to isJackpotHit documenting the threshold and grid assumption
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the 5×3 grid contains 4 or more DIAMOND symbols.
   * The threshold is hardcoded; jackpot is evaluated independently of paylines.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
