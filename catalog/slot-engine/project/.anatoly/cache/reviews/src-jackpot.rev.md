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
- **Correction [OK]**: Logic matches all three documentation sources: count DIAMOND symbols across entire grid, return true when count >= 4.
- **Overengineering [LEAN]**: Flat double-loop count against a single threshold. Exactly matches the documented 5×3 DIAMOND≥4 rule; no abstraction or generalization needed.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot trigger at ≥4 diamonds) has zero coverage — no happy path, boundary (exactly 4 vs 3 diamonds), or edge cases (empty reels, all diamonds) tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of purpose, parameter shape (reels grid dimensions), return semantics, and the ≥4 DIAMOND threshold rule.

## Best Practices — 9.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc comment. The docs describe its contract well, but the function itself carries no inline documentation. [L3] |

### Suggestions

- Add JSDoc to document the jackpot threshold and the semantics of the return value for API consumers.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when four or more DIAMOND symbols appear anywhere
   * across the 5×3 reel grid in a single spin.
   *
   * @param reels - Column-major reel grid (outer = reels, inner = rows).
   * @returns `true` if jackpot is triggered; caller is responsible for applying the prize.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
