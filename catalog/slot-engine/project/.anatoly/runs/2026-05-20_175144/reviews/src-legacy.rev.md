# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Left-to-right matching with WILD substitution follows standard slot conventions. Edge cases handled: all-WILD line returns 0, SCATTER as effective symbol returns 0, empty array yields matchCount=0. Payout formula `multiplier * (bet / 10)` matches documented contract.
- **Overengineering [LEAN]**: Straightforward linear scan: resolve leading WILD, count matching prefix, look up multiplier, scale by line bet. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical business logic (WILD substitution, match counting, payout calculation, edge cases like all-WILD lines, SCATTER early return, matchCount < 3 threshold) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, SCATTER early-return behavior, minimum match threshold (3), lineBet derivation (bet/10), and return semantics.

## Best Practices — 6.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is never mutated but declared as Symbol[] instead of ReadonlyArray<Symbol>. [L4] |
| 8 | ESLint compliance | WARN | HIGH | Index-based for loop (L11–L16) accesses lineSymbols[i] but never uses i for anything beyond indexing; @typescript-eslint/prefer-for-of would flag this. [L11-L16] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. WILD-substitution semantics and the implied 10-line assumption are non-obvious and should be documented. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine/regulated-gaming domain inferred from symbol vocabulary (WILD, SCATTER, SEVEN, DIAMOND, BAR, paytable multipliers). bet / 10 produces an IEEE 754 non-exact float for most valid integer bets (e.g. bet=1 → lineBet=0.1; bet=3 → lineBet=0.3). Multiplying non-exact floats by integer multipliers yields imprecise payout values. Floating-point monetary arithmetic in regulated gaming payout engines is a known certification failure point — payouts must be deterministically exact. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: no guard on bet range (README arbitrates 1–100 integer coins) or lineSymbols length (conventionally 5 per line). Out-of-range inputs silently produce incorrect or nonsensical payouts. [L4] |

### Suggestions

- Fix float-precision payout by keeping arithmetic in integer coin-units
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Multiply before dividing to minimise IEEE 754 error; both operands are integers when bet∈[1..100]
  return (multiplier * bet) / 10;
  ```
- Use ReadonlyArray for the non-mutated lineSymbols parameter
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number`
- Replace index-based for loop with for...of
  ```typescript
  // Before
  for (let i = 0; i < lineSymbols.length; i++) {
      if (lineSymbols[i] === first || lineSymbols[i] === "WILD") {
        matchCount++;
      } else {
        break;
      }
    }
  // After
  for (const sym of lineSymbols) {
      if (sym === first || sym === "WILD") {
        matchCount++;
      } else {
        break;
      }
    }
  ```
- Add JSDoc to document WILD-substitution semantics and bet contract
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single pay-line using legacy sequential-match rules.
   * Leading WILDs are substituted by the first non-WILD symbol; an all-WILD line pays 0.
   * @param lineSymbols - Symbols on the pay-line, left-to-right.
   * @param bet - Total bet in coins (integer 1–100). Per-line bet is bet/10 (assumes 10 lines).
   * @returns Payout in coins; 0 when fewer than 3 consecutive matches or line resolves to SCATTER.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
