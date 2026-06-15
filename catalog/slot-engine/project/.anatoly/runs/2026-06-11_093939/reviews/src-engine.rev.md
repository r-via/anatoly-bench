# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | GOOD | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 60% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 75% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 72% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Simple type alias; no similar symbol found.
- **Correction [OK]**: Type alias only; bet-range enforcement is handled in spin().
- **Overengineering [LEAN]**: Single-line type alias for a domain concept. Trivial.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. The name alone does not convey valid range, currency unit, or how it relates to lineBet.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout: `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-level constant; no similar symbol found.
- **Correction [OK]**: Constant value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named constant. No complexity.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects computePayout output but is never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant, no JSDoc. Value (0.05) and its effect on payout math are non-obvious without a comment.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded false; the guarded console.log block never executes. Dead code gate with no runtime effect.
- **Duplication [UNIQUE]**: Module-level constant; no similar symbol found.
- **Correction [OK]**: Boolean flag, no correctness issue.
- **Overengineering [LEAN]**: Named constant. No complexity.
- **Tests [NONE]**: No test file exists. Constant is always false; branch it guards is dead and untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant, no JSDoc. Self-descriptive name but no comment on how to enable or what it gates.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as `container` on L29; resolve() called three times in spin().
- **Duplication [UNIQUE]**: IoC registry class; no similar symbol found.
- **Correction [OK]**: Map-based registry; all registered keys are resolved within the same file, no missing-key risk in practice.
- **Overengineering [OVER]**: Hand-rolled DI container (register/resolve) for exactly 3 values that are already direct imports at the top of the same file. Provides no testability or substitution value: the registrations are hardcoded at module init, the container has a single consumer (spin), and all three resolved values could be used directly from import scope. Classic single-use DIY IoC abstraction.
- **Tests [NONE]**: No test file exists. register/resolve behavior, type-cast safety, and missing-key behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private internal DI container class, no JSDoc. Purpose and key/value contract for register/resolve are undocumented.

#### `container` (L29–L29)

- **Utility [USED]**: resolve() called in spin() for rng, paytable, and reels dependencies.
- **Duplication [UNIQUE]**: Singleton EngineContainer instance; no similar symbol found.
- **Correction [OK]**: Instantiation and registrations are consistent; resolved keys match registered keys.
- **Overengineering [LEAN]**: Simple instantiation of EngineContainer. Over-engineering is in the class definition, not this usage.
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton, no JSDoc. Role as the shared service locator is not documented.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin() loop and indexed for wild-multiplier calculation.
- **Duplication [UNIQUE]**: Payline grid data; no similar symbol found.
- **Correction [OK]**: Matches reference documentation exactly.
- **Overengineering [LEAN]**: Pure domain data constant — 10 fixed payline row-index paths. No abstraction overhead.
- **Tests [NONE]**: No test file exists. Payline coordinate correctness (row/col indexing) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: 10-entry payline matrix with no JSDoc. Row-index semantics and path shapes (straight, V, zigzag) are not explained inline.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine() on L74.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts: same WILD-skip lead detection, same break-on-mismatch count loop, same run>=3 guard, same return shape. Only differences are local variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count).
- **Correction [OK]**: WILD substitution and consecutive-run counting are correct; all-WILD and SCATTER-lead cases return null consistently with the paytable having no WILD/SCATTER entries.
- **Overengineering [LEAN]**: Single-purpose: finds the leading pay symbol and counts its consecutive run, respecting WILDs. Minimal and focused.
- **Tests [NONE]**: No test file exists. WILD-leading resolution, SCATTER early-return, run-length threshold (2 vs 3), and all-WILD edge case are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper, no JSDoc. WILD substitution rule and the null-return conditions are non-trivial enough to warrant a brief comment, but leniency applies given private scope.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve lead symbol skipping WILDs, count a contiguous prefix run, and return null if run < 3

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called inside spin() PAYLINES loop on L142.
- **Duplication [UNIQUE]**: No similar functions found.
- **Correction [OK]**: Core payout logic is correct; the extra WILD multiplier diverges from reference docs (see doc_divergences) but produces internally consistent values.
- **Overengineering [LEAN]**: Single-purpose payline evaluator: extracts symbols, delegates to checkLine, applies wild bonus math. The bonus formula is domain logic, not accidental complexity.
- **Tests [NONE]**: No test file exists. Wild-count multiplier formula, no-win null return, and payout scaling with lineBet are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper with 5 params and a wild-multiplier formula; no JSDoc. The exponential wild-bonus formula (basePayout * (1 + wildCount) * 2^wildCount) warrants documentation even for an internal function.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin() on L145; exported but no direct external importer — internal call is sufficient for USED status.
- **Duplication [UNIQUE]**: No similar functions found.
- **Correction [NEEDS_FIX]**: House-edge multiplier applied in wrong direction (inflates payouts instead of reducing them) and ceiling rounding favors the player over the house.
- **Overengineering [LEAN]**: Simple aggregation: sum line wins, apply multiplier, add floor. No structural complexity.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE application (incorrectly inflates rather than reduces payout), flat bet bonus, Math.ceil rounding, and zero-win path are untested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and mentions house edge / RTP target, but omits @param descriptions for lineWins and bet (bet is typed any, making docs especially important) and has no @returns tag. The unconditional floor addition (bet * 0.01) is also not explained.

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar functions found.
- **Correction [NEEDS_FIX]**: Throws a string instead of an Error instance, and accepts bets above 100 with only a warning, violating the arbitrated 1..100 integer constraint.
- **Overengineering [LEAN]**: Orchestration function: validate, build reels, evaluate paylines, aggregate results. The imported abstractions (StandardReelBuilderFactory, DefaultStrategy, SpinEventEmitter) are over-engineered upstream — per rule 8, spin's own code is straightforward instantiate-and-call and should not be flagged for those upstream architectural choices.
- **Tests [NONE]**: No test file exists. Exported entry point used by src/index.ts. Input validation (non-number, float, negative, >100), free-spin awarding, jackpot detection, wildMultiplier aggregation, and strategy.adjustPayout integration are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Primary exported function with no JSDoc in source. README covers its high-level behavior, but the code itself lacks @param, @returns, @throws, or any inline doc block. (deliberated: confirmed — Confirmed at src/engine.ts:115: `throw "invalid bet"` is a string throw, not an Error instance. This is a public API (re-exported via src/index.ts:1). Any caller using `instanceof Error` in a catch block will silently miss this exception, and no stack trace is captured. The `bet: any` parameter (line 113) also weakens type safety when `Bet = number` is defined on line 12, though runtime validation at line 114 mitigates runtime breakage. The string-throw is a real correctness defect in error handling — confirmed NEEDS_FIX.)

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | `bet: any` in both public exports — `computePayout` (L95) and `spin` (L103). Both accept a typed `Bet = number` alias already defined in this file; using `any` discards all validation at the call site. [L95, L103] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` declared as `number[][]` — should be `readonly number[][]` (or `as const`) to prevent accidental mutation of the module-level constant. [L35] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` (L106) violates `no-throw-literal`. `console.warn` (L108) and `console.log` (L154) in a production code path violate `no-console`. Both `bet: any` parameters would fire `@typescript-eslint/no-explicit-any`. [L106, L108, L154] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (L103) and the `Bet` type alias (L11) are exported without JSDoc. `computePayout` is documented (L91–94). [L11, L103] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L106) throws a string — callers cannot use `instanceof Error` or read `.stack`. `bet > 100` is only `console.warn`'d (L108), not rejected; callers receive no signal that the input violates the documented 1–100 range (arbitrated intent). [L106, L108] |
| 14 | Performance | WARN | MEDIUM | Wild-multiplier computation is duplicated: `evaluateLine` already folds it into `basePayout`; the outer loop in `spin` (L137–146) re-scans the same payline symbols to rebuild `wildMultiplier`. The `emitter.on(SPIN_DONE, () => {})` at L159 registers a no-op listener immediately before emit — dead allocation each call. [L137-L146, L159] |
| 15 | Testability | WARN | MEDIUM | `spin` directly instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` (L120–122) with no injection path. Tests must mock at the module level rather than passing substitutes, making isolated unit testing fragile. [L120-L122] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No `satisfies`, const type parameters, or `using` declarations are used. `PAYLINES` is a prime candidate for `as const satisfies ReadonlyArray<readonly [number, number, number, number, number]>` to narrow element types while preserving the constant literal. [L35] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Gambling domain. (1) HOUSE_EDGE is applied as `total * (1 + 0.05)` (L99), multiplying winning payouts by 1.05 — this inflates payout by 5% rather than reducing it. The JSDoc (L91–94) and the arbitrated intent both state target RTP ~95%; the correct direction is to ensure the paytable or a reduction factor yields 95% long-run return, not an increase. (2) `bet > 100` is not enforced — only `console.warn`'d — violating the arbitrated `1..100 coins` contract. [L97-L101, L108] |

### Suggestions

- Replace `any` with the already-defined `Bet` type in both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object instead of a string to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the documented max-bet limit instead of silently warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum (1–100)");`
- Fix HOUSE_EDGE application — it currently inflates payouts by 5% (opposite of a house edge)
  ```typescript
  // Before
  if (total > 0) {
    total = total * (1 + HOUSE_EDGE);
  }
  // After
  // Reduce via house edge so long-run return ≈ 95 %
  // (paytable calibration carries most of the weight; this clips any residual)
  if (total > 0) {
    total = total * (1 - HOUSE_EDGE);
  }
  ```
- Mark PAYLINES immutable with as const satisfies
  ```typescript
  // Before
  const PAYLINES: number[][] = [...]
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies ReadonlyArray<readonly [number, number, number, number, number]>;
  ```
- Add JSDoc to the exported spin function
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
  // After
  /**
   * Executes a single slot spin for the given bet amount (1–100 coins).
   * Returns the full spin result including line wins, scatter count, jackpot flag, and total payout.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add `|| bet > 100` to the validation guard so bets above 100 are rejected with an Error rather than silently allowed with a warning. [L118]
- **[correction · medium · small]** Replace Math.ceil with Math.floor to keep fractional credits for the house, consistent with slot-machine rounding conventions. [L110]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the 5% house edge reduces payouts toward the 95% RTP target instead of inflating them. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to produce a proper Error instance with a stack trace. [L115]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
