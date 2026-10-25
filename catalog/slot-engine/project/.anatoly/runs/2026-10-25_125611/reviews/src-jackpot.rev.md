# Review: `src/jackpot.ts`

**Verdict:** CLEAN

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| isJackpotHit | function | yes | OK | LEAN | USED | UNIQUE | - | 85% |

### Details

#### `isJackpotHit` (L3–L11)

- **Utility [USED]**: Runtime-imported by 1 file: src/engine.ts
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Counts DIAMOND symbols across the grid and returns true when the count is at least 4. The logic is sound. No doc or adjacent constant states a different threshold or a payline/position requirement, so the `>= 4` value cannot be shown to be wrong.
- **Overengineering [LEAN]**: Single nested loop counting DIAMOND symbols against a threshold. Minimal, no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 8 | ESLint compliance | WARN | HIGH | The imported `Symbol` shadows the global `Symbol` (no-shadow / no-redeclare / @typescript-eslint/no-shadow with builtinGlobals). Also, the braceless `if` (curly rule) is a style risk. The `Symbol` name is defined in ./types.ts. [L1, L7] |
| 9 | JSDoc on public exports | WARN | MEDIUM | The exported `isJackpotHit` has no JSDoc. The jackpot threshold (4 diamonds) is an undocumented magic number. [L3-L11] |

### Suggestions

- Add JSDoc and name the threshold constant.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    let diamondCount = 0;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  
  /** Returns true when the grid holds at least JACKPOT_DIAMOND_THRESHOLD DIAMOND symbols. */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
    let diamondCount = 0;
  ```
- Use braces on the if and exit early once the threshold is reached.
  - Before: `if (sym === "DIAMOND") diamondCount++;`
  - After: `if (sym === "DIAMOND" && ++diamondCount >= JACKPOT_DIAMOND_THRESHOLD) return true;`
