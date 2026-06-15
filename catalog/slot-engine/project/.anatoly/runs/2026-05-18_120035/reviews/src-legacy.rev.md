# Review: `src/legacy.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| computeLegacyPayout | function | yes | OK | LEAN | DEAD | UNIQUE | - | 75% |

### Details

#### `computeLegacyPayout` (L4–L24)

- **Utility [DEAD]**: Exported but imported by 0 files
- **Duplication [UNIQUE]**: No similar functions found in codebase
- **Correction [NEEDS_FIX]**: Wild multiplier never applied despite WILDs counted in run; return value is a raw float.
- **Overengineering [LEAN]**: Straightforward slot payline logic: resolve WILD lead, count consecutive matches, apply multiplier. No unnecessary abstractions, generics, or patterns.
- **Tests [NONE]**: No test file found. Function has multiple branches (WILD substitution, SCATTER early return, match counting, minimum 3-match threshold) with zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc/TSDoc comment. Exported public function with non-trivial WILD-substitution logic, a lineBet derivation (bet/10), and early-exit conditions for WILD/SCATTER that are not obvious from the signature — all undocumented.

## Best Practices — 7/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 5 | Immutability | WARN | MEDIUM | `lineSymbols: Symbol[]` is mutable but never mutated inside the function. Should be `readonly Symbol[]`. [L4] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computeLegacyPayout` is exported with no JSDoc. Params `lineSymbols` and `bet`, return semantics, and the 10-line constraint should be documented. [L4] |
| 10 | Modern 2026 practices | WARN | MEDIUM | C-style `for (let i = 0; i < ...)` loop; `for...of` with `break` is idiomatic in modern TS. No deprecated APIs, but the loop style is dated. [L11-L16] |
| 13 | Security | WARN | HIGH | Gambling domain inferred from slot-machine vocabulary (WILD, SCATTER, lineSymbols, getPayMultiplier, paytable). `bet / 10` produces a non-exact IEEE-754 float (e.g. bet=1 → 0.1) that is then multiplied by an integer multiplier and returned as a raw `number` without rounding. This legacy path lacks the `Math.ceil` applied in the main engine pipeline, which can cause payout discrepancies in a regulated gambling context. Floating-point arithmetic on monetary values is unsafe in financial/gaming code. [L22-L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | No bounds guard before `lineSymbols[0]`: an empty array produces `undefined`, which propagates past the WILD/SCATTER guard (both comparisons are false) and silently produces `matchCount = 0` → returns 0. With `noUncheckedIndexedAccess` enabled, `first` would be `Symbol \| undefined`, revealing the gap. A length check or explicit guard should precede the first index access. [L5-L7] |

### Suggestions

- Mark input array as readonly to signal non-mutation intent and enable `noUncheckedIndexedAccess` safety.
  - Before: `export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {`
  - After: `export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {`
- Add a length guard before accessing index 0 to handle empty input safely.
  ```typescript
  // Before
  const first = lineSymbols[0] === "WILD"
  // After
  if (lineSymbols.length === 0) return 0;
  const first = lineSymbols[0] === "WILD"
  ```
- Replace C-style for loop with for...of for idiomatic TypeScript.
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
- Apply Math.round or use integer arithmetic to avoid IEEE-754 float drift in payout results.
  ```typescript
  // Before
  const lineBet = bet / 10;
  return multiplier * lineBet;
  // After
  // bet is an integer (1–100); keep arithmetic in integers then divide once at the boundary
  return Math.ceil((multiplier * bet) / 10);
  ```
- Add JSDoc to the exported function documenting params and the legacy (no wild-bonus) contract.
  ```typescript
  // Before
  export function computeLegacyPayout(lineSymbols: Symbol[], bet: number): number {
  // After
  /**
   * Legacy payout calculator — does NOT apply the wild multiplier bonus.
   * @param lineSymbols Resolved symbols for a single payline (left-to-right, length 5).
   * @param bet Total bet in coins (1–100 integer).
   * @returns Payout in credits, 0 if no qualifying run of ≥3.
   */
  export function computeLegacyPayout(lineSymbols: readonly Symbol[], bet: number): number {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Track wildCount as a separate counter during the match loop and multiply the final payout by (1 + wildCount) * Math.pow(2, wildCount) before returning, consistent with Data-Flow.md Stage 3 formula. [L11]

### Refactors

- **[utility · medium · trivial]** Remove dead code: `computeLegacyPayout` is exported but unused (`computeLegacyPayout`) [L4-L24]

### Hygiene

- **[correction · low · trivial]** Apply Math.ceil (consistent with the main engine's computePayout convention) to the return value to prevent fractional credits when bet is not divisible by 10. [L23]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `computeLegacyPayout` (`computeLegacyPayout`) [L4-L24]
