# Review: `src/jackpot.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | - | 90% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Implementation exactly matches the documented invariant: counts DIAMOND symbols across all cells and returns true when count >= 4, consistent with all three reference documentation pages.
- **Overengineering [LEAN]**: Simple double-loop counter with a threshold comparison. Exactly matches the documented jackpot rule (≥4 DIAMONDs anywhere in the 5×3 grid). No unnecessary abstractions, generics, or patterns. Implementation is minimal and appropriate for its single, well-defined responsibility.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | `isJackpotHit` is a public exported function that forms part of the engine's public API (documented in .anatoly/docs/02-Architecture/02-Core-Concepts.md and 03-Guides/02-Advanced-Configuration.md), yet carries no JSDoc comment. Callers cannot discover the ≥4 DIAMOND threshold, the 5×3 grid scope, or that the function is purely informational without reading internal docs. |

### Suggestions

- Add JSDoc to the exported `isJackpotHit` function so callers understand the threshold, grid scope, and informational-only semantics without reading internal docs.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Determines whether the current spin qualifies for a progressive jackpot.
   *
   * Scans all cells in the 5 × 3 reel grid and counts `DIAMOND` symbols.
   * Returns `true` when four or more are found anywhere on the grid.
   *
   * @param reels - The fully resolved reel grid (5 reels × 3 rows) after a spin.
   * @returns `true` if ≥ 4 DIAMOND symbols are present; `false` otherwise.
   * @remarks The engine does **not** apply a jackpot payout — callers must
   *          inspect `SpinResult.jackpotHit` and add the prize themselves.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
