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
- **Correction [OK]**: Correctly counts DIAMOND symbols across the full grid and returns true when count >= 4, matching the documented threshold in both reference docs and arbitrated intents.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences, single return comparison. No abstraction beyond what the task requires.
- **Tests [NONE]**: No test file exists. Critical jackpot logic consumed by spin() with no coverage of: exactly 4 diamonds (boundary true), 3 diamonds (boundary false), 0 diamonds, diamonds spread across multiple reels vs. single reel, or non-DIAMOND symbols being ignored.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of jackpot trigger logic (≥4 DIAMOND symbols anywhere on the grid), the shape/meaning of the `reels` parameter, and the boolean return value semantics.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | Magic number `4` at L3 should be a named constant. `no-magic-numbers` would flag this; in a gambling domain, jackpot threshold is a business rule that belongs in a named export. [L8] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. A brief description of the threshold and grid dimensions would prevent misuse. [L3] |

### Suggestions

- Extract the jackpot threshold into a named exported constant so it is a single source of truth and avoids ESLint no-magic-numbers violations.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  export const JACKPOT_DIAMOND_THRESHOLD = 4 as const;
  
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    let diamondCount = 0;
    for (const col of reels) {
      for (const sym of col) {
        if (sym === "DIAMOND") diamondCount++;
      }
    }
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  }
  ```
- Add JSDoc to the exported function to document the grid assumption and threshold.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the 5 × 3 reel grid contains 4 or more DIAMOND symbols.
   * @param reels - Column-major grid produced by the reel-spin step.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
