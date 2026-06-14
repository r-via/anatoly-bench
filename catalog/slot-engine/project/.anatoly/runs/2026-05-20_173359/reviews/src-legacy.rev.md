# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 82% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Payout is returned as a raw float; for bets not divisible by 10 (e.g. bet=1) `multiplier * lineBet` produces fractional coins (e.g. 0.2, 0.5, 2.5). Slot-machine industry convention is to round DOWN — house keeps the remainder. Also, IEEE 754 cannot represent 0.1 exactly, so accumulated errors will appear in downstream totalPayout.
- **Overengineering [LEAN]**: Straightforward sequential logic: resolve wild substitution, count leading matches, apply multiplier. No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Critical edge cases untested: WILD-only lines, SCATTER handling, match count < 3, WILD substitution in prefix counting, bet/lineBet calculation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Missing description of WILD substitution logic, early-return conditions for WILD/SCATTER first symbol, minimum match threshold of 3, and the lineBet = bet/10 derivation.

## Best Practices — 7.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated inside the function but is typed as mutable `Symbol[]`. Should be `readonly Symbol[]`. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. At minimum document parameters (`bet` range, expected `lineSymbols` length) and return semantics. [L4] |
| 13 | Security | FAIL | HIGH | Regulated gaming domain inferred from symbol vocabulary (WILD, SCATTER, lineSymbols, bet, paytable). `bet / 10` uses IEEE 754 floating-point division: for any bet not divisible by a power of two (e.g. bet=1 → lineBet=0.1, which is 0.10000000000000000555…), subsequent multiplication by integer multipliers produces non-exact payouts. In regulated gaming, all payout arithmetic must be deterministic and exact — integer arithmetic (coins × multiplier, divide at display only) or a Decimal library is required. [L20-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | README (arbitrated intent) declares `type Bet = number; // 1..100 coins, integer`. The function accepts any `number` for `bet` with no guard — negative bets, zero, or non-integers silently produce garbage payouts. A gambling engine should validate at the boundary. [L4] |

### Suggestions

- Mark the array parameter readonly since it is never mutated
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Use integer arithmetic for payouts to avoid IEEE 754 drift in regulated gaming
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Keep everything in integer coins; caller divides by 10 for display
  return multiplier * bet; // divide by 10 at display layer only
  ```
- Validate bet bounds per the arbitrated README contract
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) throw new RangeError(`bet must be integer 1–100, got ${bet}`);
  ```
- Add JSDoc documenting parameters, return value, and edge cases
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using the legacy (non-wild-multiplier) algorithm.
   * @param lineSymbols - Symbols on the evaluated payline, left to right (length 1–5).
   * @param bet - Total bet in coins (integer, 1–100). Per-line bet = bet / 10.
   * @returns Payout in coins, or 0 for no win / SCATTER first symbol.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `return multiplier * lineBet` with `return Math.floor(multiplier * lineBet)` to guarantee integer coin payouts and eliminate IEEE 754 fractional accumulation — required by slot-machine industry convention (house keeps the remainder). [L23]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
