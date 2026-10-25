# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 72% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Moot — symbol is DEAD (was NEEDS_FIX: All-WILD line returns 0 instead of the expected top-symbol payout.)
- **Overengineering [LEAN]**: Straightforward slot payout calculation: WILD resolution, consecutive match count, multiplier lookup. No unnecessary abstractions, generics, or patterns. Each step maps directly to a business rule.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated; the parameter type should be `readonly Symbol[]` or `ReadonlyArray<Symbol>` to express and enforce that intent. The README itself uses `ReadonlyArray` for array parameters in the public API. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is a public export with no JSDoc. At minimum a one-line description explaining the legacy matching semantics and the `bet / 10` division convention should be present. [L4] |
| 13 | Security | WARN | HIGH | Slot-engine/regulated-gambling domain inferred from WILD/SCATTER symbols, payline vocabulary, and project name. `bet / 10` performs IEEE-754 floating-point division on what the README specifies as an integer coin value (1–100). For integers not divisible by 10 (e.g. bet=1 → lineBet≈0.10000000000000001), `multiplier * lineBet` can drift from the exact expected payout. Regulated gaming requires exact, reproducible payouts. Use integer arithmetic: `Math.round(multiplier * bet) / 10` or operate entirely in integer cents. [L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: the README specifies `Bet = number; // 1..100 coins, integer`, but `computeLegacyPayout` performs no range guard on `bet`. A zero or negative bet would silently return a zero or negative payout rather than failing loudly. Additionally, `lineSymbols[0]` is accessed without a length check; an empty array produces `undefined` which propagates into the WILD comparison without a TypeScript error under most tsconfigs (absent `noUncheckedIndexedAccess`). [L4-L7] |

### Suggestions

- Use `ReadonlyArray<Symbol>` to prevent accidental mutation of the input array
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {`
- Replace floating-point lineBet division with integer-safe arithmetic to comply with regulated gaming payout exactness requirements
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Keep all arithmetic in integer space; divide only once at the boundary
  return Math.round(multiplier * bet) / 10;
  ```
- Add a JSDoc comment and a bet-range guard matching the README contract
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
  // After
  /**
   * Computes the legacy left-to-right consecutive-match payout for one payline.
   * @param lineSymbols - Symbols on the evaluated payline (3–5 entries expected).
   * @param bet - Total bet in coins (1–100, integer).
   * @returns Coin payout for this line, or 0 for no win.
   */
  export function computeLegacyPayout(lineSymbols: ReadonlyArray<Symbol>, bet: number): number {
    if (lineSymbols.length === 0 || bet <= 0 || bet > 100) return 0;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace the `?? 'WILD'` fallback with the highest-value non-WILD, non-SCATTER symbol from the paytable so an all-WILD line receives the correct top payout instead of 0. [L6]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]
