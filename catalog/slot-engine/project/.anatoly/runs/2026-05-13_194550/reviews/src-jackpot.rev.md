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
- **Correction [OK]**: Logic is internally consistent: iterates all reel positions, counts DIAMOND occurrences, returns true when count ≥ 4. No null-safety, off-by-one, or type issues. The scatter-count approach (total occurrences vs. per-reel presence) is not contradicted by any arbitrated invariant.
- **Overengineering [LEAN]**: Simple nested loop counting DIAMOND symbols across reels, returns boolean threshold check. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical game logic called by src/engine.ts has zero coverage — missing tests for threshold boundary (exactly 4 diamonds), below threshold (3 diamonds), above threshold (5+ diamonds), empty reels, and no-diamond cases.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot logic, param shape of `reels`, return semantics, and the threshold (>=4 DIAMONDs).

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | isJackpotHit is exported with no JSDoc. Should document the jackpot trigger condition (≥4 DIAMOND scatter symbols) and parameter shape. [L3] |

### Suggestions

- Add JSDoc to document the jackpot trigger condition and parameter layout.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the spin contains a progressive jackpot hit.
   * Trigger condition: ≥4 DIAMOND scatter symbols anywhere across all reels.
   *
   * @param reels - Column-major reel window produced by the spin engine.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Optional micro-optimisation: return early once the count satisfies the condition.
  ```typescript
  // Before
    for (const col of reels) {
      for (const sym of col) {
        if (sym === "DIAMOND") diamondCount++;
      }
    }
    return diamondCount >= 4;
  // After
    for (const col of reels) {
      for (const sym of col) {
        if (sym === "DIAMOND" && ++diamondCount >= 4) return true;
      }
    }
    return false;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
