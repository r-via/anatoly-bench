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
- **Correction [OK]**: Correctly counts all DIAMOND symbols across the entire grid and returns true when diamondCount >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double loop counting a single symbol type, returns a boolean threshold check. Minimal and appropriate for the documented jackpot rule.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot payout trigger) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds vs 3), no edge cases (empty reels, all diamonds).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols), parameter explanation for `reels` layout, and return value semantics.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. A minimal `@param` / `@returns` block would document the 4-DIAMOND threshold for callers. [L3] |

### Suggestions

- Add JSDoc to document the 4-DIAMOND threshold and parameter shape for callers.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere on the grid.
   * @param reels - Full reel grid (columns × rows of Symbol values).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
