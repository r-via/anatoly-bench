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
- **Correction [OK]**: Logic matches all three Internal Reference Documentation pages: count DIAMOND symbols across full grid, return true when count >= 4. No bugs found.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND symbols; exactly matches the documented threshold logic. No unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot threshold, diamond counting across reels) is entirely untested. Called by src/engine.ts, making this a high-risk gap.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter shape (reels dimensions/content), return value semantics, and the ≥4 DIAMOND threshold rule.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. The threshold logic (≥4 DIAMOND → jackpot) is non-obvious and documented in `.anatoly/docs/` but absent from the source. [L3] |

### Suggestions

- Add JSDoc to document the jackpot threshold so callers don't need to consult external docs.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere across the 5×3 grid.
   * `jackpotHit` is informational only — the engine does not apply a prize; the caller must do so.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
