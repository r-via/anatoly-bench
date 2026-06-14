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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all reels/rows and returns true when count >= 4, matching all reference documentation and arbitrated intent.
- **Overengineering [LEAN]**: Simple nested loop counting DIAMOND symbols with a threshold check. No unnecessary abstractions, generics, or patterns.
- **Tests [NONE]**: No test file found. Called by src/engine.ts, making it a critical path with no coverage for happy path, edge cases (fewer than 4 diamonds, exactly 4, empty reels, nested empty arrays), or boundary conditions.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing: purpose description, @param for reels, @returns explanation, and the hardcoded threshold of 4 DIAMOND symbols.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. Given the gambling domain and non-obvious threshold semantics, a doc comment is warranted. [L3] |

### Suggestions

- Add JSDoc to document the gambling-domain semantics of the threshold and parameter shape.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when 4 or more DIAMOND symbols appear anywhere
   * across the full 5×3 reel grid in a single spin.
   *
   * @param reels - Full grid as a readonly 2-D array; outer = columns, inner = rows.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
