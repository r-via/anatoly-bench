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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 90% |
| computePayout | function | yes | OK | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type with 0 importers across the codebase
- **Duplication [UNIQUE]**: Type alias for number. No similar type definitions found in codebase.
- **Correction [OK]**: Type alias only; no logic to evaluate.
- **Overengineering [LEAN]**: Simple type alias documented in README as public API surface. 0 importers noted but export is intentional contract.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Type alias for number but valid range constraints (≥1, ≤100, integer) are only enforced in spin() — not captured here.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced on line 105 in computePayout function
- **Duplication [UNIQUE]**: Numeric constant (0.05) for house edge calculation. No duplicates identified.
- **Correction [OK]**: Value 0.05 matches the reference documentation.
- **Overengineering [LEAN]**: Named constant for a magic number used in computePayout. Appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout math and its 0.05 value is never validated by any test.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant with no explanation of how it is applied or its relationship to target RTP.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced on line 159 in spin function
- **Duplication [UNIQUE]**: Boolean constant for debug mode flag. No duplicate constants found.
- **Correction [OK]**: Constant false; gates only a console.log branch.
- **Overengineering [LEAN]**: Single boolean constant; not overengineered even if hardcoded false creates dead code.
- **Tests [NONE]**: No test file exists. Trivial constant but its conditional branch in spin() is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag with no description of what debug output it enables.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated on line 29 to create container instance
- **Duplication [UNIQUE]**: Service locator class with register/resolve methods. No similar classes identified.
- **Correction [OK]**: resolve casts undefined to T for missing keys, but all keys are registered before first use so no runtime defect in the current call graph.
- **Overengineering [OVER]**: DIY service-locator for exactly 3 statically-imported functions. Uses Map<string, unknown> losing type safety, then casts with `as T` on every resolve. No inversion of control is achieved — the same three imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols/getReelWeights`) could be used directly. Single instantiation, single consumer. Textbook premature abstraction.
- **Tests [NONE]**: No test file exists. register/resolve round-trip, missing-key behavior, and type-unsafe cast are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its methods. Purpose as a service-locator/DI container is non-obvious from the name alone; register/resolve semantics are undocumented.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Referenced on lines 133 and 149 in spin function
- **Duplication [UNIQUE]**: 2D array of payline patterns (10 lines). No duplicate payline arrays found.
- **Correction [OK]**: All 10 payline row-index sequences match the data-flow documentation exactly.
- **Overengineering [LEAN]**: Static data array of 10 payline patterns. Matches the documented payline table exactly.
- **Tests [NONE]**: No test file exists. Payline shape (10 lines × 5 columns, values 0–2) is never validated.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The row-index encoding convention and the meaning of each pattern (middle row, V-shape, etc.) are not explained.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called on line 74 in evaluateLine function
- **Duplication [DUPLICATE]**: RAG score 0.823. Identical logic to lineWins: identify lead symbol handling WILD/SCATTER, count consecutive matches, return if count >= 3. Differences are cosmetic (field names sym/run vs symbol/count, variable names lead/run vs first/count).
- **Correction [OK]**: Lead-symbol resolution, SCATTER/WILD guards, and left-to-right run counting are correct per documented payline evaluation rules.
- **Overengineering [LEAN]**: Single-purpose: determine lead symbol and run length for one payline. Logic is minimal for what it does.
- **Tests [NONE]**: No test file exists. WILD-lead resolution, SCATTER short-circuit, run-length counting, and run < 3 rejection are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper — lead-symbol resolution, WILD substitution, minimum run of 3, and SCATTER exclusion rules are all implicit.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical logic. Both identify lead symbol (skipping WILD), reject WILD/SCATTER, count consecutive matches with >= 3 threshold. Semantic behavior identical despite field name differences.

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called on line 134 in spin function
- **Duplication [UNIQUE]**: Evaluates payline wins with wild multiplier calculation. No similar functions found.
- **Correction [OK]**: Wild bonus formula `(1 + wildCount) × 2^wildCount` matches the reference documentation table for all wildCount values.
- **Overengineering [LEAN]**: Payline evaluation with wild multiplier inline — all steps are specified by the architecture doc. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Wild-multiplier exponential bonus, no-win null return, and lineBet scaling are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal function implementing the wild-bonus formula (basePayout × (1+wildCount) × 2^wildCount) with no explanation of parameters or return value.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called on line 138 in spin function; transitively used via exported spin
- **Duplication [UNIQUE]**: Calculates total payout from line wins with house edge adjustment. No duplicates identified.
- **Correction [OK]**: Formula `total × (1 + HOUSE_EDGE)`, floor `bet × 0.01`, and `Math.ceil` all match the authoritative payout formula in the reference documentation verbatim.
- **Overengineering [LEAN]**: Straightforward aggregation matching the documented payout formula exactly.
- **Tests [NONE]**: No test file exists. House-edge application, 1% base-bet floor, Math.ceil rounding, and zero-wins path are all untested. Exported and business-critical.
- **PARTIAL [PARTIAL]**: JSDoc describes the house-edge application and ~95% RTP target, but omits @param for lineWins and bet (bet is typed as any), @returns, and the unconditional bet×0.01 floor added regardless of wins.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 1 | Strict mode | WARN | HIGH | tsconfig not visible from this file. Explicit `any` on public function signatures indicates type discipline that strict mode alone would not prevent, but noImplicitAny enforcement is unverifiable without tsconfig. |
| 2 | No `any` | FAIL | CRITICAL | `bet: any` on both public exports `computePayout` (L101) and `spin` (L113). The file already declares `export type Bet = number` — both parameters should use it. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is declared as mutable `number[][]` (L34). It is never mutated and should be `as const` or typed `readonly (readonly number[])[]`. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | Two violations: (1) `throw "invalid bet"` (L115) violates `no-throw-literal` — callers relying on `.message` or `.stack` receive undefined. (2) `rng` (L120) and `reelsModule` (L122) are resolved from the container but never used in the function body — `no-unused-vars` violations; the reels are built by `factory.buildReels` instead, making the container resolves dead code. [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is the primary public export and has no JSDoc. `computePayout` has documentation (L97-L100); `spin` (L113) does not. [L113] |
| 14 | Performance | WARN | MEDIUM | `spin()` (L148-L157) re-fetches and re-scans payline symbols to recompute wild counts that `evaluateLine` already computed internally. Trivial at 10 paylines but needlessly duplicated logic. [L148-L157] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are unconditionally instantiated inside `spin()` (L124-L126) with no injection point. Unit tests cannot substitute these without module-level mocking. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `result: SpinResult = { ... }` (L163-L171) could use `satisfies SpinResult` for stricter structural checking without widening. `PAYLINES` is a natural candidate for `as const satisfies`. [L163-L171] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two issues: (1) Arbitrated intent (README.md): `Bet = 1..100 coins, integer`. Bets > 100 emit `console.warn` (L118) but are accepted — violates the stated upper bound. (2) `emitter.on(SPIN_DONE, () => {})` (L175) registers a permanent no-op listener on every `spin()` call, leaking listeners across invocations. [L118, L175] |

### Suggestions

- Replace `bet: any` with the declared `Bet` alias on both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the arbitrated maximum bet of 100 (README arbitrated intent)
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error("bet exceeds maximum of 100");`
- Make PAYLINES deeply immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // same content
  ] as const satisfies readonly (readonly number[])[];
  ```
- Remove unused container resolves and the no-op listener
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  ...
  const reelsModule = container.resolve<...>("reels");
  ...
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  // remove rng and reelsModule resolves if unused
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Add JSDoc to `spin` and use `satisfies` on the result object
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    ...
    const result: SpinResult = {
  // After
  /**
   * Runs one full spin: five reels, ten paylines, wild multipliers,
   * scatter/free-spin detection, and jackpot check.
   * @param bet Integer bet (1–100 coins).
   */
  export function spin(bet: Bet): SpinResult {
    ...
    const result = {
      ...
    } satisfies SpinResult;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Add `|| bet > 100` to the existing guard on line 114 (or a separate throw on line 118) so bets above 100 are rejected, matching the arbitrated 1..100 valid-range contract. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to give callers a proper Error instance with a stack trace and `.message` property. [L115]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
