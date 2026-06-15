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
- **Correction [OK]**: Correctly counts DIAMOND symbols across the full grid and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Flat double-loop count with a single threshold check. No abstraction layers, no configuration indirection — minimal and appropriate for the task.
- **Tests [NONE]**: No test file exists. Critical game logic used by src/engine.ts has zero coverage — happy path (≥4 diamonds), boundary (exactly 4 vs 3), empty reels, and multi-column distribution all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing parameter description for `reels`, return value explanation, and the hardcoded DIAMOND threshold of 4 — all non-obvious semantics for a public exported function.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is exported with no JSDoc block. The name is self-describing, but the hardcoded threshold (≥ 4) and grid-wide (not payline-restricted) semantics are non-obvious and should be documented. [L3] |

### Suggestions

- Add JSDoc to document the grid-wide scan semantics and the hardcoded ≥ 4 threshold.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the full reel grid contains 4 or more DIAMOND symbols.
   * Counts across all positions (not payline-restricted); threshold is hardcoded at 4.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
