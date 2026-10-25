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
- **Correction [OK]**: Correctly iterates all reel positions, counts DIAMOND symbols, and returns a threshold comparison. No logic, type, or control-flow defects.
- **Overengineering [LEAN]**: Flat nested loop counting a specific symbol across a 2D array — minimal, direct, no unnecessary abstractions.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | isJackpotHit is a public export with no JSDoc. Should document the jackpot condition (≥4 DIAMOND symbols) and the reels parameter shape. [L3] |

### Suggestions

- Add JSDoc to document the jackpot condition and parameter contract
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the reel grid contains at least four DIAMOND symbols,
   * triggering the progressive jackpot payout.
   *
   * @param reels - Five-column reel snapshot produced by the spin.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
