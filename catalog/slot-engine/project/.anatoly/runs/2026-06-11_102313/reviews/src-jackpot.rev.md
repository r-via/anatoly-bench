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
- **Correction [OK]**: Correctly counts DIAMOND symbols across all reels and returns true when count >= 4, matching the documented threshold.
- **Overengineering [LEAN]**: Simple double-loop counter with a single threshold check. Minimal and appropriate for counting DIAMOND symbols across a 2D grid.
- **Tests [NONE]**: No test file exists. Critical game logic (jackpot detection) imported by src/engine.ts has zero test coverage — no happy path, no edge cases (exactly 4 diamonds, 3 diamonds, empty reels, multi-column distribution).
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported function has no JSDoc. Missing: purpose, @param description for `reels`, @returns explanation, and the jackpot threshold rule (≥4 DIAMOND symbols across the grid).

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | isJackpotHit is a public export with no JSDoc. At minimum a one-liner describing the DIAMOND threshold and grid scope would improve discoverability. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Magic number 4 for the jackpot threshold. In regulated gaming code, domain-critical thresholds should be named constants to aid auditability and change tracking. [L9] |

### Suggestions

- Extract the hardcoded jackpot threshold into a named constant for auditability in regulated gaming code.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```
- Add JSDoc to the public export documenting the grid scope and threshold.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when 4 or more DIAMOND symbols appear anywhere across the 5×3 grid.
   * Evaluated independently of paylines.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
