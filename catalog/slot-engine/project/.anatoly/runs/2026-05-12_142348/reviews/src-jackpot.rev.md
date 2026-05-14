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
- **Correction [OK]**: Logic matches all three internal doc sources: count DIAMOND symbols across the full grid, return true when count >= 4.
- **Overengineering [LEAN]**: Flat double-loop counting a single symbol type, returns a boolean threshold check. Minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot trigger) imported by src/engine.ts has zero coverage — happy path, boundary (exactly 4 diamonds), under-threshold, and empty-reel cases all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter shape (reels dimensions/content), return value semantics, and the ≥4 DIAMOND threshold rule.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | Exported `isJackpotHit` has no JSDoc. In a regulated gaming context the jackpot trigger condition is a compliance-relevant detail that warrants documentation. [L3] |

### Suggestions

- Add JSDoc to the exported function; in a regulated gaming context the trigger condition is a compliance-relevant invariant.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere on the grid.
   * Jackpot prize application is the caller's responsibility (`SpinResult.jackpotHit` is informational).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Extract the magic threshold into a named constant to make the jackpot condition auditable without reading the implementation.
  ```typescript
  // Before
    return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4 as const;
  // …
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
