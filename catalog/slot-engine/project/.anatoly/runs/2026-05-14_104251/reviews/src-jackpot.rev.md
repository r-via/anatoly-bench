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
- **Correction [OK]**: Scatter-style diamond count across all reel positions is consistent with the documented scatter/jackpot detection intent; threshold ≥ 4 is not contradicted by any arbitrated invariant.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences across a 2D reel structure. Minimal and direct for its single purpose.
- **Tests [NONE]**: No test file exists. Critical game logic with no coverage — missing happy path (≥4 diamonds), boundary (exactly 4 vs 3), empty reels, and mixed-symbol cases. Called by src/engine.ts, making untested behavior high-risk.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot logic, explanation of the 4-diamond threshold, parameter shape (2D reel array), and boolean return semantics.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. In a regulated gambling context, documenting the jackpot trigger condition (≥4 DIAMOND symbols) is important for auditability. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: the jackpot threshold `4` is a bare magic number with no named constant. In regulated gaming, jackpot trigger conditions must be auditable and traceable. Extract to a named export or config constant. [L9] |

### Suggestions

- Add JSDoc to document the jackpot trigger rule for auditability in a regulated gambling context.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the reel grid contains 4 or more DIAMOND scatter symbols,
   * triggering the progressive jackpot payout.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Replace the magic number `4` with a named constant so the jackpot threshold is explicit and auditable.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
