# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported symbol with 0 importers across the codebase. No consumers found.
- **Duplication [UNIQUE]**: RAG scores (0.718 for evaluateLine, 0.707 for getPayMultiplier) fall below 0.82 threshold. Actual code comparison shows different logic: evaluateLine extracts symbols from reels using payline indexing, calls checkLine, applies complex wild multiplier bonuses (1 + wildCount * 2^wildCount), returns LineWin object; computeLegacyPayout processes lineSymbols directly with simple multiplier lookup. Different semantic contracts and caller expectations.
- **Correction [OK]**: Wild substitution, match counting, and line-bet formula (bet/10) are all correct. Empty-array and all-WILD edge cases handled safely. No rounding applied, consistent with the sample output showing fractional coin values (12.5 coins).
- **Overengineering [LEAN]**: Straightforward payline evaluation: resolve leading WILD, count consecutive matches, gate on minimum 3, delegate multiplier lookup, apply line bet (bet/10 matches documented convention). No unnecessary abstractions.
- **Tests [NONE]**: No test file found. Function has multiple branches (WILD substitution logic, SCATTER early return, match count threshold, multiplier calculation) with zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Non-obvious behavior includes: WILD-as-first-symbol resolution, SCATTER returning 0, left-to-right consecutive match counting, minimum 3-match threshold, and line bet calculation as bet/10. All of this requires documentation.

## Best Practices — 8/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols` is never mutated but typed as `Symbol[]` instead of `readonly Symbol[]`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is an exported function with no JSDoc. Parameters, return semantics, and edge-case behavior (empty array, WILD-only line, SCATTER leading) are undocumented. [L4] |
| 13 | Security | WARN | CRITICAL | Gambling/slot-machine domain confirmed by `.anatoly/docs/`. `bet / 10` produces an IEEE 754 float and `multiplier * lineBet` compounds the precision loss. In regulated gaming, payout arithmetic must be exact and reproducible across platforms. The canonical `computePayout` path ceiling-rounds per `.anatoly/docs/04-API-Reference/01-Public-API.md`, but this legacy path returns a raw float, risking non-deterministic payouts. No hardcoded secrets, eval, or injection present. [L21-L22] |
| 17 | Context-adapted rules | WARN | MEDIUM | No guard against an empty `lineSymbols` array: `lineSymbols[0]` returns `undefined` at runtime but is typed as `Symbol`, silently propagating an invalid value through the match loop and into `getPayMultiplier`. In a gambling engine, edge cases directly affect payout correctness and should be defended explicitly. [L5] |

### Suggestions

- Mark `lineSymbols` as `readonly` since it is never mutated.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add JSDoc covering parameters, return value, and edge-case behavior.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Computes a left-to-right payout for a single payline using the legacy multiplier table.
   * Returns 0 for WILD-only or SCATTER-leading lines, or when fewer than 3 symbols match.
   * @param lineSymbols - Ordered symbols on the payline (left to right).
   * @param bet - Total coin wager; line bet is derived as `bet / 10`.
   * @returns Raw payout in coin units. Caller is responsible for rounding.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```
- Guard against an empty `lineSymbols` array to prevent silent `undefined` propagation.
  ```typescript
  // Before
    const first = lineSymbols[0] === "WILD"
  // After
    if (lineSymbols.length === 0) return 0;
    const first = lineSymbols[0] === "WILD"
  ```
- Avoid floating-point payout arithmetic in regulated gambling code. Require `bet` to be a multiple of 10 and use integer division, or scale to cents and divide only at the API boundary.
  ```typescript
  // Before
    const lineBet = bet / 10;
    return multiplier * lineBet;
  // After
    // Precondition: bet must be a multiple of 10 (enforced by spin() validator)
    const lineBet = Math.trunc(bet / 10);
    return multiplier * lineBet;
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
