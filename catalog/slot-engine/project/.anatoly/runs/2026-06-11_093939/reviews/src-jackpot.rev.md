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
- **Correction [OK]**: Logic correctly counts DIAMOND symbols across all reels/rows and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double-loop count with a single threshold check. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file found. Critical game logic (jackpot trigger) imported by src/engine.ts has zero test coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, 3 diamonds).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of purpose, parameter shape (2D reel grid), return semantics, and the hardcoded threshold of 4 DIAMOND symbols.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is an exported public function with no JSDoc. A brief doc comment describing the threshold and parameter shape would satisfy this rule. [L3] |

### Suggestions

- Add JSDoc to the exported function to satisfy rule 9 and clarify the threshold contract.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the grid contains 4 or more DIAMOND symbols.
   * Counts across the entire reel set, not restricted to paylines.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
