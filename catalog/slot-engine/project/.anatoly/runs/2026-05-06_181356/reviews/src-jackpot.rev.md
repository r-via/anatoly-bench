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
- **Correction [OK]**: Implementation matches documented invariant: counts all DIAMOND symbols across the full grid and returns true when count >= 4, consistent with all three doc pages.
- **Overengineering [LEAN]**: Flat double-loop counting a single symbol type, returning a threshold comparison. Exactly matches the documented 4-or-more DIAMOND rule (.anatoly/docs/02-Architecture/02-Core-Concepts.md). No unnecessary abstraction.
- **Tests [NONE]**: No test file found. Critical game logic (jackpot trigger) used by src/engine.ts has zero test coverage — no happy path, edge cases (exactly 4 diamonds, 3 diamonds, empty reels, single reel), or boundary tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. The function's purpose (4+ DIAMOND triggers jackpot), parameter shape (2D reel grid), and return semantics are non-obvious and undocumented inline.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc comment. The threshold (>=4 DIAMOND), parameter shape, and return semantics are non-obvious from the signature alone. [L3] |

### Suggestions

- Add JSDoc to `isJackpotHit` documenting the threshold, parameter shape, and return semantics.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more `DIAMOND` symbols appear anywhere
   * across the reel grid in a single spin (progressive jackpot condition).
   *
   * @param reels - 5-column × 3-row grid of resolved symbols.
   * @returns `true` if the jackpot threshold (≥ 4 DIAMONDs) is met.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
