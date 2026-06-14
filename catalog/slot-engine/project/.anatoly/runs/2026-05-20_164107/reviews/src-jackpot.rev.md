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
- **Correction [OK]**: Correctly iterates all cells in the 2D reel array, counts DIAMOND symbols, and returns true when count >= 4. Logic matches the documented threshold exactly.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences, returns boolean threshold check. No unnecessary abstractions, appropriate for a single-purpose predicate.
- **Tests [NONE]**: No test file exists. Function has clear edge cases to cover: exactly 4 diamonds (boundary), fewer than 4, more than 4, empty reels, diamonds spread across columns vs. concentrated. Used by src/engine.ts, making untested coverage a real risk.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of jackpot condition (≥4 DIAMOND symbols across all reels), parameter docs for `reels`, and return value explanation.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. Documents the jackpot rule (≥4 DIAMOND anywhere on grid), expected input shape (5×3), and return semantics. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: the jackpot threshold `4` is a magic number inline at L10. Regulated gambling code requires auditable, named thresholds so compliance reviewers can verify the configured value matches the approved game math spec without reading implementation logic. [L10] |

### Suggestions

- Extract the jackpot threshold to a named constant for compliance auditability.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  
  export function isJackpotHit(...): boolean {
    ...
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  }
  ```
- Add JSDoc to document the jackpot rule, grid assumption, and return contract.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when 4 or more DIAMOND symbols appear anywhere across the
   * full reel grid (typically 5 × 3). Threshold is position-independent.
   *
   * @param reels - Column-major reel grid produced by a spin.
   * @returns Whether the jackpot condition is met.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
