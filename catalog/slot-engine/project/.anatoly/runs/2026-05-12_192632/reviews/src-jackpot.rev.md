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
- **Correction [OK]**: Logic matches all three internal doc pages: count DIAMOND across all cells, return true when count >= 4.
- **Overengineering [LEAN]**: Flat double loop counting a single symbol type; no unnecessary abstractions, generics, or patterns. Minimal and correct for its documented purpose.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — no happy path, no boundary (exactly 4 diamonds), no edge cases (empty reels, fewer than 4 diamonds).
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter (`reels`) shape/semantics, return value meaning, and the ≥4 DIAMOND threshold rule.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | isJackpotHit is a public export with no JSDoc. A brief doc explaining the threshold and what counts as a jackpot would help callers. [L3] |

### Suggestions

- Add JSDoc to the exported function documenting the threshold and parameter shape
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when four or more DIAMOND symbols appear anywhere across all reels.
   * @param reels - 2-D array of symbols indexed as [reel][row]
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
