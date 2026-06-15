# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 80% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Applied to adjust payout in computePayout function at line 105
- **Duplication [UNIQUE]**: Numeric constant. No similar definitions found.
- **Correction [OK]**: Constant value 0.05 is correct for 5% house edge; the misapplication is in computePayout, not here.
- **Overengineering [LEAN]**: Named constant for a domain magic number. Appropriate.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant, no JSDoc. Value meaning and RTP impact are implicit.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Feature flag checked in spin function at line 159 to conditionally log debug output
- **Duplication [UNIQUE]**: Boolean constant. No similar definitions found.
- **Correction [OK]**: Boolean flag, no correctness issue.
- **Overengineering [LEAN]**: Simple boolean flag. Minimal.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal flag, no JSDoc. Self-explanatory name; low severity given internal use.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Class instantiated at line 29 as container for dependency injection
- **Duplication [UNIQUE]**: Generic DI container class. No similar implementations found.
- **Correction [OK]**: resolve() silently returns undefined cast as T for unknown keys, but all three registered keys are consumed correctly in the current call sites.
- **Overengineering [OVER]**: Hand-rolled IoC/service-locator using `Map<string, unknown>` with unsafe `as T` casts to store 3 fixed, file-local dependencies that could be plain imports or a const object. The pattern adds indirection, loses type safety, and has a single instantiation site. No benefit over `const deps = { rng: weightedPick, paytable: getPayMultiplier, reels: { getReelSymbols, getReelWeights } }`.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal DI container class, not exported. No JSDoc explaining purpose or the service keys it holds. Leniency applied for internal helper.

#### `container` (L29–L29)

- **Utility [USED]**: Service locator instance registered at lines 30-32 and resolved in spin at lines 120-122
- **Duplication [UNIQUE]**: Module-scoped instance. No similar instantiations found.
- **Correction [OK]**: Registrations are valid. rng and reelsModule are resolved in spin() but never consumed (factory handles reel generation), which is suspicious but not a defect in the container itself.
- **Overengineering [LEAN]**: Instantiation of EngineContainer; overengineering lives in the class definition above, not here.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton, not exported. No JSDoc; low severity given internal use.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Array iterated in spin loop at line 133 and accessed at lines 134 and 149
- **Duplication [UNIQUE]**: Payline configuration array. No similar definitions found.
- **Correction [OK]**: All row indices are in [0,2]; matches the documented 10-payline layout exactly.
- **Overengineering [LEAN]**: Fixed data table for 10 paylines. Appropriate representation.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant with non-obvious semantics (row-index paths). No JSDoc explaining the coordinate system or payline shapes.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Helper function called by evaluateLine at line 74 to detect winning patterns
- **Duplication [DUPLICATE]**: Identical semantic logic to lineWins in paytable.ts. Both functions identify leading symbol, count consecutive matches/WILDs, return {symbol, count} or null if count < 3. Only naming differs.
- **Correction [OK]**: Lead-symbol resolution, SCATTER guard, and consecutive-run counting are all correct. All-WILD lines return null as expected; WILD+SCATTER and leading-WILD edge cases are handled properly.
- **Overengineering [LEAN]**: Single-responsibility: resolves leading symbol and counts the run. Straightforward.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal unexported function, no JSDoc. Non-trivial behavior (WILD substitution, SCATTER exclusion, leading-symbol resolution) warrants at least a brief comment.

> **Duplicate of** `src/paytable.ts:lineWins` — Functionally identical — same input/output contract and logic flow. Property names differ (sym/run vs symbol/count) but functions are interchangeable.

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Function called in spin loop at line 134 to evaluate each payline
- **Duplication [UNIQUE]**: No similar functions found. Combines checkLine logic with payout and wild multiplier calculation.
- **Correction [OK]**: basePayout and wild-bonus multiplier are applied once per line. The wildMultiplier stored in SpinResult via spin() is informational metadata computed with the same formula and is not re-applied to totalPayout.
- **Overengineering [LEAN]**: Parameters are appropriate; wild-multiplier calculation is domain logic, not abstraction bloat.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal unexported function with complex wild-multiplier formula; no JSDoc on any parameter or the compounding payout logic.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called by spin at line 138 to compute total payout
- **Duplication [UNIQUE]**: No similar functions found. Aggregates line payouts with house edge and bonus.
- **Correction [NEEDS_FIX]**: Two independent bugs: HOUSE_EDGE applied in the wrong direction (×1.05 inflates payouts instead of reducing them) and Math.ceil rounds toward the player instead of the house.
- **Overengineering [LEAN]**: Simple reduce with house-edge adjustment. Minimal.
- **Tests [NONE]**: No test file exists. Critical export with incorrect house-edge logic (adds edge instead of reducing) and an unconditional bet*0.01 bonus — both behaviors go untested.
- **PARTIAL [PARTIAL]**: Has a JSDoc block describing purpose and house-edge intent, but omits @param descriptions for lineWins and bet (typed as `any`), the unconditional floor addition (bet * 0.01), and @returns.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 1/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on both public exports: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). The `Bet` type alias is declared on L12 but never applied to these signatures. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as `number[][]`, making it and its inner arrays fully mutable. Should be `readonly (readonly number[])[]` or a `satisfies … as const` pattern. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | `rng` (L120) and `reelsModule` (L122) are resolved from the container and assigned to local variables but never read afterward — clear `no-unused-vars` violations. `paytable` (L121) is used correctly; the other two resolutions are dead code. [L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (L113) is the primary public export but has no JSDoc. `computePayout` has JSDoc (L97-L100). `Bet` type alias (L12) has no doc. [L12, L113] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` (L115) throws a string literal. Callers cannot use `instanceof Error`, stack traces are absent, and `no-throw-literal` ESLint rule fires. Should be `throw new Error("invalid bet")`. [L115] |
| 13 | Security | FAIL | CRITICAL | Slot-machine domain confirmed (PAYLINES, scatter, jackpot, free-spins, WILD/SEVEN/BAR/CHERRY/DIAMOND/BELL vocabulary). `computePayout` applies `total * (1 + HOUSE_EDGE)` = `total * 1.05` (L105), which increases every positive payout by 5% instead of reducing it. The arbitrated README contract states a 95% RTP target; this formula produces RTP > 100% on every non-zero win. In regulated gaming this is a compliance failure on every spin. Correct formula: `total * (1 - HOUSE_EDGE)`. [L104-L106] |
| 14 | Performance | WARN | MEDIUM | `wildMultiplier` is recomputed in `spin()` (L147-L157) by re-walking each win's payline symbols, duplicating the logic already executed inside `evaluateLine`. The result from `evaluateLine` is discarded and re-derived here. [L147-L157] |
| 15 | Testability | WARN | MEDIUM | `spin()` directly instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` (L124-L126) without using the DI container, making them impossible to stub in unit tests. The module-level singleton `container` couples test runs to shared global state. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No use of `satisfies` (e.g. `PAYLINES satisfies readonly (readonly [number,number,number,number,number])[]`), `const` type parameters, or `using`. These would strengthen type inference at zero runtime cost. |
| 17 | Context-adapted rules | WARN | MEDIUM | Two resolved container values (`rng` L120, `reelsModule` L122) are never used — the factory handles RNG/reels internally. `emitter.on(SPIN_DONE, () => {})` (L175) registers a no-op listener every call with no cleanup, signalling an incomplete event integration rather than functional design. [L120, L122, L175] |

### Suggestions

- Apply the declared `Bet` type to both public signatures instead of `any`
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix inverted house-edge formula — critical RTP compliance fix for regulated gaming
  ```typescript
  // Before
  if (total > 0) {
    total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 → RTP > 100%
  }
  // After
  if (total > 0) {
    total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 → RTP ≈ 95%
  }
  ```
- Throw an Error object, not a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove unused container resolutions or route them into the call path
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  // Register and resolve factory/strategy/emitter via container so they are injectable in tests
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  ```
- Make PAYLINES immutable and use satisfies for stronger element typing
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies ReadonlyArray<readonly [number, number, number, number, number]>;
  ```
- Add JSDoc to the primary public export
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
  // After
  /**
   * Executes a single slot spin for the given integer bet (1–100 coins).
   * @throws {Error} If bet is not a positive integer.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add a throwing guard for bet > 100 in spin() to enforce the arbitrated 1..100 coin contract. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so payouts are reduced by 5%, achieving the arbitrated 95% RTP instead of the current >100% RTP. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace Math.ceil with Math.floor in computePayout so fractional remainders are kept by the house per slot-machine convention. [L110]
- **[correction · low · trivial]** Change throw "invalid bet" to throw new Error("invalid bet") so standard Error handling works for callers. [L115]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
