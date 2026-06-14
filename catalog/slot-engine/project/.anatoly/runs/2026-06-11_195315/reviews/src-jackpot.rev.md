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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all cells and returns true when count >= 4, matching documented threshold.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences across a 2D grid, single return condition. Minimal and appropriate for a fixed threshold check.
- **Tests [NONE]**: No test file exists. Critical game logic consumed by the core spin engine with no coverage of the >=4 DIAMOND threshold, boundary cases (exactly 3 vs 4 diamonds), empty reels, or multi-column distribution scenarios.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot trigger condition (≥4 DIAMOND symbols anywhere on the grid), parameter shape (2D reel array), and boolean return semantics.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | Magic number `4` on L9 would trigger `no-magic-numbers`. Extract as a named constant so the threshold is self-documenting and change-safe. |
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is exported but has no JSDoc. A single-sentence doc covering the 5×3 grid, the DIAMOND threshold, and the return value would suffice. [L3] |

### Suggestions

- Extract the jackpot threshold as a named constant to eliminate the magic number and make the threshold change-safe.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  
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
- Add JSDoc to the exported function describing the grid scope, DIAMOND threshold, and return semantics.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the 5 × 3 reel grid contains 4 or more DIAMOND symbols.
   * The jackpot condition is evaluated independently of paylines.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
