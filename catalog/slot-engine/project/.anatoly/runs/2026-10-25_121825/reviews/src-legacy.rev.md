# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 68% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: `bet / 10` produces inexact IEEE-754 results for bets not divisible by 5 (e.g. bet=1 → lineBet≈0.1+ε); in a coin-based slot engine domain, this yields fractionally wrong payout amounts (e.g. multiplier=300, bet=1 → 30.000000000000004 instead of 30).)
- **Overengineering [LEAN]**: Straight-line payout logic: one anchor-resolution conditional, one consecutive-match loop with early break, one multiplier lookup, one arithmetic expression. No unnecessary abstractions.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | lineSymbols is Symbol[] but the function never mutates it. Should be readonly Symbol[] to signal intent and prevent accidental mutation. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | computeLegacyPayout is exported with no JSDoc. The WILD-resolution logic (lines 5–7) and the matchCount < 3 guard are non-obvious; callers benefit from documented semantics. [L4] |
| 13 | Security | WARN | HIGH | Slot-engine gambling domain inferred from project name and payline/wild/scatter/jackpot vocabulary. bet / 10 at L22 applies floating-point division to an integer coin bet. Bets of 1, 2, 3 … coins produce non-exact IEEE 754 fractions (e.g. 1/10 = 0.1 is not representable exactly), propagating rounding error into payout totals. Regulated gaming certifications (GLI-11, BMM) require deterministic, exact payout arithmetic. [L22] |

### Suggestions

- Mark lineSymbols parameter readonly — the function never mutates it
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc to the exported function to document the WILD resolution and match-count semantics
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the legacy coin payout for a single left-to-right payline.
   * WILDs substitute for the first non-WILD symbol; a WILD-only or SCATTER-lead line pays 0.
   * @param lineSymbols - Symbols on the payline, left to right.
   * @param bet - Total bet in coins (1–100 integer, 10 paylines assumed).
   * @returns Coin payout for the line, or 0 if no winning combination.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Avoid floating-point division on monetary coin values in a regulated gambling context — multiply before dividing, or use a Decimal library for exact arithmetic
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Multiply first to keep the intermediate value as exact as possible;
  // for full compliance, represent multipliers as integer hundredths and
  // use integer arithmetic: Math.floor(multiplierCents * bet / 1000).
  return (multiplier * bet) / 10;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `const lineBet = bet / 10; return multiplier * lineBet` with integer-safe math: `return Math.round(multiplier * bet) / 10` (or constrain callers to pass bets that are multiples of 10), so no floating-point imprecision accumulates in the payout. [L22]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
