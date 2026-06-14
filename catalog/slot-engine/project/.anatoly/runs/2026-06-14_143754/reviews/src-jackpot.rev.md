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
- **Overengineering [LEAN]**: Flat double loop counting DIAMOND occurrences across a 2D grid. Minimal, single-purpose, no unnecessary abstractions.
- **Tests [NONE]**: No test file exists. Critical game-logic function consumed by the core spin engine with no coverage of the DIAMOND counting threshold (>=4), boundary cases (exactly 3 vs 4 diamonds), empty reels, or multi-column distribution scenarios.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Non-obvious behavior (counts DIAMOND symbols across entire grid, threshold of 4+) is not documented inline. The parameter type and return semantics are not explained.

## Best Practices — 9/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | WARN | MEDIUM | `isJackpotHit` is a public export with no JSDoc. Callers (e.g. `spin` in engine.ts) have no inline documentation of the 4-DIAMOND threshold or the grid traversal strategy. [L3] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: the threshold `4` is a magic number inline at L10. In regulated slot-machine code, jackpot trigger values should be named constants for auditability (`const JACKPOT_DIAMOND_THRESHOLD = 4 as const`). Hardcoding silently makes the threshold invisible to auditors inspecting the paytable configuration. [L10] |

### Suggestions

- Add JSDoc to the public export documenting the DIAMOND count threshold and grid traversal.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns `true` when the spin grid contains 4 or more DIAMOND symbols.
   * Traverses the full reels grid (5 × 3) — not payline-restricted.
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Extract the magic number to a named constant for auditability in a gambling context.
  ```typescript
  // Before
    return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4 as const;
  
  // inside function:
    return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
