# Review: `src/jackpot.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Correctly counts DIAMOND symbols across all reel positions and returns true when threshold is reached. No logic errors, type mismatches, or boundary issues.
- **Overengineering [LEAN]**: Simple nested loop counting DIAMOND symbols against a fixed threshold. No unnecessary abstractions or indirection.
- **Tests [NONE]**: No test file found. Critical game logic (jackpot trigger) used by src/engine.ts has zero coverage — happy path, boundary (exactly 4 vs 3 diamonds), empty reels, and mixed-symbol grids all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot logic, explanation of the DIAMOND threshold (>=4), parameter shape (2D reel array), and boolean return semantics.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | isJackpotHit is a public export with no JSDoc. In a regulated gaming engine with a documented RTP contract, the jackpot condition and its relationship to game math should be documented. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine/regulated-gaming domain inferred from reels, jackpot, DIAMOND vocabulary and README's progressive jackpot + 95% RTP contract. The jackpot threshold 4 is a bare magic number. In regulated gaming, jackpot hit conditions directly affect certified RTP math and must be named, documented, and ideally sourced from a game-math configuration object to survive a compliance audit. [L10] |

### Suggestions

- Add JSDoc documenting the jackpot condition and its game-math significance
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when 4 or more DIAMOND scatter symbols appear anywhere on the reel grid,
   * triggering the progressive jackpot payout.
   *
   * @param reels - Full reel window snapshot (columns × visible rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Extract the magic jackpot threshold into a named constant for auditability and game-math configuration traceability
  ```typescript
  // Before
    return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4 as const;
  
  // …inside the function:
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
