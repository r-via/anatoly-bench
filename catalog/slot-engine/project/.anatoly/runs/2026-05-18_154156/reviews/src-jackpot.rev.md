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
- **Correction [OK]**: Correctly counts all DIAMOND symbols across the full grid and fires when count ≥ 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double-loop counting a single symbol type, returns a boolean threshold check. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Critical business logic (jackpot payout trigger) used by src/engine.ts has zero coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, single reel), or boundary tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols), parameter shape, and return value semantics.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is an exported public function with no JSDoc. A doc comment explaining the jackpot trigger threshold would aid consumers. [L3] |

### Suggestions

- Add JSDoc to the exported `isJackpotHit` function documenting the trigger threshold.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere on the board.
   * @param reels - The full reel grid produced by a spin.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
