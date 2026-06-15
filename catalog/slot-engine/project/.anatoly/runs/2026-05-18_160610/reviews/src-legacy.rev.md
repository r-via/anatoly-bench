# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 88% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [OK]**: Lead-symbol detection, consecutive-run loop, minimum-match guard, and base payout formula are all internally consistent. Edge cases (all-WILD input, SCATTER as lead, empty array) resolve to 0 correctly. Wild-multiplier absence is consistent with explicit 'legacy' labelling; reference docs attribute that multiplier to evaluateLine in src/engine.ts, not this function.
- **Overengineering [LEAN]**: Straightforward left-to-right matching loop with WILD substitution, early exits, and a single payout calculation. No unnecessary abstractions or generics.
- **Tests [NONE]**: No test file found. Function has non-trivial logic: WILD substitution, SCATTER exclusion, match counting with early break, minimum match threshold, and payout calculation — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Missing description of WILD substitution logic, SCATTER early-exit behavior, the 3-match minimum threshold, lineBet derivation (bet/10), and the return value semantics.

## Best Practices — 8.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is never mutated; should be `readonly Symbol[]` to enforce the contract at the call site. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc. Parameters, return value, and the intentional omission of the wild multiplier bonus should be documented. [L4] |
| 13 | Security | WARN | HIGH | Slot-machine/gambling domain inferred from symbol vocabulary (WILD, SCATTER, DIAMOND, pay-multiplier table). `bet / 10` performs IEEE 754 division: `bet = 1` yields `lineBet = 0.1`, which is not exactly representable in binary floating-point. Accumulated across many spins, rounding drift can affect regulatory audits. Industry practice for regulated gaming is to keep all intermediate arithmetic in integer sub-credits and divide only at the final output boundary. [L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: `lineSymbols[0]` is accessed with no bounds check — an empty array yields `undefined`, which passes the `!== 'WILD'` branch and reaches `getPayMultiplier(undefined, matchCount)` unguarded. Additionally, the function intentionally omits the wild multiplier bonus `(1 + wildCount) × 2^wildCount` applied by the current engine; this divergence from production behavior is undocumented in the function, which risks silent misuse by callers. [L5-L7] |

### Suggestions

- Mark the parameter readonly to prevent accidental mutation at call sites
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Guard against empty input to stop undefined leaking past the type system
  ```typescript
  // Before
  const first = lineSymbols[0] === "WILD"
  // After
  if (lineSymbols.length === 0) return 0;
  const first = lineSymbols[0] === "WILD"
  ```
- Avoid floating-point accumulation on credit values; divide once at the output boundary
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // Integer multiply first, then single divide — minimises IEEE 754 drift
  return Math.round(multiplier * bet) / 10;
  ```
- Add JSDoc documenting parameters, return value, and the deliberate omission of the wild-multiplier bonus
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Legacy payline payout — intentionally excludes the wild-multiplier bonus
   * applied by the current engine (`(1 + wildCount) × 2^wildCount`).
   * @param lineSymbols - Left-to-right symbols on the evaluated payline (length 5).
   * @param bet - Total bet in coins (integer, 1–100).
   * @returns Payout in credits, or 0 for no win.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
