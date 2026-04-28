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
- **Correction [NEEDS_FIX]**: Two independent correctness bugs: all-WILD line returns 0 instead of a valid payout, and the return value is an unrounded float in a slot-machine context requiring integer credits.
- **Overengineering [LEAN]**: Straightforward slot payout logic: resolves the effective leading symbol (accounting for WILDs), counts consecutive matching symbols, applies a minimum match threshold, then delegates to getPayMultiplier for the lookup. Each step maps directly to a documented game rule (Core-Concepts.md paytable, WILD substitution). No unnecessary abstractions, generics, or patterns — just a clean, single-responsibility function.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 6.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | The `lineSymbols` parameter is declared as `Symbol[]` but is never mutated inside the function. It should be `readonly Symbol[]` to signal intent and prevent accidental mutation. [L4] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | The exported function `computeLegacyPayout` carries no JSDoc comment. Callers cannot infer the expected shape of `lineSymbols`, the monetary unit of `bet`, the meaning of a 0 return, or how WILD substitution affects the count. [L4] |
| 13 | Security | FAIL | HIGH | Slot-machine/gambling domain inferred from WILD/SCATTER/CHERRY/SEVEN/DIAMOND vocabulary and confirmed by the paytable multiplier table in .anatoly/docs/02-Architecture/02-Core-Concepts.md. `bet / 10` uses IEEE 754 floating-point division: values like 1/10 are not exactly representable, and `multiplier * lineBet` compounds the error. In regulated gambling software, payout calculations must use integer arithmetic (e.g., operate in cents) or a Decimal library to guarantee RTP accuracy and avoid regulatory violations. The RTP target of 95% documented in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md can drift silently under floating-point accumulation. [L21-L22] |
| 15 | Testability | WARN | MEDIUM | `getPayMultiplier` is imported and called directly with no injection point. Unit-testing `computeLegacyPayout` in isolation requires module-level mocking. Accepting the function as an optional parameter with a default would enable pure unit tests without any module mock infrastructure. [L2] |
| 17 | Context-adapted rules | WARN | MEDIUM | The magic number `10` in `bet / 10` hardcodes a 10-payline assumption with no named constant or documentation. In a slot-machine codebase, payline counts are a configurable engine parameter (see project structure in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md). If the line count ever changes, this function will silently produce wrong payouts. A named constant `LINE_COUNT` or an additional parameter is warranted. [L21] |

### Suggestions

- Use integer arithmetic for monetary payout calculations to eliminate IEEE 754 rounding errors in regulated gambling code.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Caller provides `bet` in integer cents across all lines.
  const lineBetCents = Math.floor(bet / LINE_COUNT);
  return multiplier * lineBetCents; // result in integer cents
  ```
- Add readonly modifier to the lineSymbols parameter to communicate immutability and prevent accidental mutation.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number`
- Add JSDoc to the exported function so callers understand parameter units, WILD behaviour, and the meaning of a 0 return.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes the payout for a single payline using the legacy paytable.
   *
   * @param lineSymbols - Ordered symbols on the evaluated payline, left-to-right.
   *   A leading WILD is treated as the first non-WILD symbol for matching purposes.
   * @param bet - Total bet in the smallest monetary unit, spread across all lines.
   * @returns Payout amount in the same unit as `bet`, or 0 for a non-winning line.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Replace the magic number 10 with a named constant to make the payline assumption explicit and maintainable.
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  const LINE_COUNT = 10 as const; // legacy fixed 10-payline configuration
  const lineBet = bet / LINE_COUNT;
  ```
- Accept getPayMultiplier as an injectable parameter with a default to enable pure unit tests without module mocking.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  export function computeLegacyPayout(
    lineSymbols: readonly Symbol[],
    bet: number,
    payMultiplierFn: typeof getPayMultiplier = getPayMultiplier,
  ): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Handle the all-WILD case explicitly before the WILD guard: resolve the line to the maximum-paying or designated top symbol instead of falling through to `first = "WILD"` and returning 0. [L5]
- **[correction · medium · small]** Apply integer rounding (Math.floor or Math.ceil per house-edge convention) to the return value so that callers always receive an integer credit amount, consistent with the engine's documented rounding behaviour. [L22]
- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
