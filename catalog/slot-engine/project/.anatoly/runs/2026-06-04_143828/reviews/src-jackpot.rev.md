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
- **Correction [OK]**: Logic matches the documented contract: counts DIAMOND symbols across the full grid and returns true when count >= 4.
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND symbols; minimal and appropriate for a full-grid scan with no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical game logic used by src/engine.ts has zero coverage — happy path (>=4 diamonds), boundary (exactly 4 vs 3), empty reels, and multi-column distribution all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Exported public API missing description of jackpot trigger condition (≥4 DIAMONDs), parameter semantics (2-D reel grid layout), and return value meaning.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | isJackpotHit is a public export with no JSDoc. Given the gambling domain, documenting the threshold (≥4 DIAMONDs) and grid scope (5×3) aids auditor clarity. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain: the jackpot threshold 4 is a magic number. In regulated gaming, jackpot trigger parameters must be auditable and traceable. Extracting it to a named constant (e.g. JACKPOT_DIAMOND_THRESHOLD) improves regulatory auditability. [L9] |

### Suggestions

- Extract the hardcoded jackpot threshold to a named constant for auditability in a regulated gaming context.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```
- Add JSDoc to document the grid scope and threshold for the public export.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when 4 or more DIAMOND symbols appear anywhere across the 5×3 grid.
   * @param reels - Full reel grid (columns × rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
