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
- **Correction [OK]**: Implementation matches all documented invariants: counts DIAMOND symbols across all cells and returns true when count >= 4, consistent with .anatoly/docs/02-Architecture/02-Core-Concepts.md, .anatoly/docs/03-Guides/02-Advanced-Configuration.md, and .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Overengineering [LEAN]**: Minimal nested loop that counts DIAMOND symbols and compares against a threshold. Exactly as documented in .anatoly/docs/02-Architecture/02-Core-Concepts.md and .anatoly/docs/03-Guides/02-Advanced-Configuration.md. No unnecessary abstractions, generics, or patterns — just a straightforward linear scan over a 5×3 grid.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a publicly exported function with no JSDoc comment. While the function name is descriptive, the trigger condition (≥4 DIAMOND symbols across all 15 cells) and the signal-only semantics (no payout applied) are non-obvious domain rules documented only in `.anatoly/docs/`. A JSDoc block would make the contract discoverable without consulting the docs. [L3] |

### Suggestions

- Add a JSDoc block to `isJackpotHit` documenting the trigger threshold and the signal-only semantics, as these are non-obvious domain rules that currently require reading the internal docs.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Detects whether a jackpot has been hit in the current spin.
   *
   * A jackpot is triggered when **4 or more `DIAMOND` symbols** appear
   * anywhere across the 5×3 grid (15 cells total).
   *
   * @remarks
   * This function is **signal-only**: it returns `true` to indicate the event
   * but applies no payout. Callers must read `SpinResult.jackpotHit` and
   * credit the jackpot prize themselves.
   *
   * @param reels - The resolved reel grid for a single spin.
   * @returns `true` if four or more DIAMOND symbols are present, `false` otherwise.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
