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
- **Correction [OK]**: Counts DIAMOND symbols across all reels and returns true when 4 or more are present. No logic errors, type issues, or unsafe operations.
- **Overengineering [LEAN]**: Simple nested loop counting DIAMOND occurrences across reels. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical game logic used by src/engine.ts has zero coverage — no tests for threshold boundary (exactly 4 diamonds), fewer than 4, more than 4, empty reels, or mixed symbol grids.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of jackpot logic, explanation of the threshold (>=4 DIAMONDs), parameter shape (2D reel grid), and return semantics.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 9 | JSDoc on public exports | FAIL | MEDIUM | `isJackpotHit` is a public export with no JSDoc comment. Should document the jackpot condition (≥4 DIAMOND symbols), parameter shape, and return semantics. [L3] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/casino domain inferred from reel/jackpot/paytable/freespin/wild vocabulary across the project (`jackpot.ts`, `reels.ts`, `paytable.ts`, `freespin.ts`, `wild.ts`). `isJackpotHit` determines jackpot outcomes — its correctness depends directly on RNG quality. If upstream RNG (see `rng.ts`) uses `Math.random()` or any non-CSPRNG, this jackpot logic is not certifiable for regulated gaming. Flag here because jackpot determination is a compliance-critical boundary: feeding non-certifiable randomness into this function constitutes a regulated-gaming security violation at the point of outcome calculation. |
| 14 | Performance | WARN | MEDIUM | Nested `for...of` iterates every symbol in every reel to count diamonds. For standard reel sizes (e.g. 5×3) this is negligible, but early-exit on `diamondCount >= 4` would avoid unnecessary iterations. [L4-L9] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No use of `satisfies` or inferred type predicates where applicable. The `diamondCount` accumulator pattern could be replaced with `Array.prototype.flat().filter(s => s === 'DIAMOND').length >= 4` and a TS 5.5 inferred type predicate, though the current approach is not wrong. [L3-L10] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino/gambling domain: jackpot trigger threshold (≥4 diamonds) is a magic number with no named constant or configuration. Regulated gaming environments require auditable, configurable payout rules — hardcoding `4` in-line makes the rule invisible to compliance review. [L10] |

### Suggestions

- Add JSDoc documenting jackpot condition, parameter, and return value.
  ```typescript
  // Before
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  // After
  /**
   * Returns true when the reel grid contains at least JACKPOT_DIAMOND_THRESHOLD DIAMOND symbols.
   * @param reels - Immutable 2-D grid of symbols (columns × rows).
   */
  export function isJackpotHit(reels: ReadonlyArray<ReadonlyArray<Symbol>>): boolean {
  ```
- Extract the magic threshold into a named constant for compliance auditability.
  ```typescript
  // Before
  return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  // ...
  return diamondCount >= JACKPOT_DIAMOND_THRESHOLD;
  ```
- Early-exit once threshold is reached to avoid scanning remaining symbols.
  ```typescript
  // Before
  for (const col of reels) {
      for (const sym of col) {
        if (sym === "DIAMOND") diamondCount++;
      }
    }
    return diamondCount >= 4;
  // After
  const JACKPOT_DIAMOND_THRESHOLD = 4;
  for (const col of reels) {
    for (const sym of col) {
      if (sym === "DIAMOND" && ++diamondCount >= JACKPOT_DIAMOND_THRESHOLD) return true;
    }
  }
  return false;
  ```

## Actions

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `isJackpotHit` (`isJackpotHit`) [L3-L11]
