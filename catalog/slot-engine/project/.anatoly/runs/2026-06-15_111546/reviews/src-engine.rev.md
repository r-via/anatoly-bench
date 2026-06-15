# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | - | 85% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 90% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 88% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 60% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar type alias found in RAG results.
- **Correction [OK]**: Type alias matches arbitrated intent (number). Runtime enforcement is in spin.
- **Overengineering [LEAN]**: Simple semantic alias over number; adds intent at zero complexity cost.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (L106): `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Constant value 0.05 is correct; misapplication is in computePayout, not here.
- **Overengineering [LEAN]**: Named constant for a magic value. Appropriate.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded `false`; the `if (DEBUG_MODE)` branch in spin() is permanently dead code and can never execute.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Boolean flag correctly guards debug logging in spin.
- **Overengineering [LEAN]**: Single hardcoded-false boolean flag. Dead branch, but one constant is not overengineering.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to create `container`, which is used throughout spin().
- **Duplication [UNIQUE]**: No similar class found in RAG results.
- **Correction [OK]**: resolve returns undefined cast to T for missing keys, but all registered keys are resolved by their registered names in spin.
- **Overengineering [OVER]**: Custom IoC container backed by a Map, used exactly once to register three values (rng, paytable, reels) that are already statically imported at the top of the same file. spin() immediately resolves them back to the same types. The abstraction adds zero value: replacing the three resolve() calls with direct references to the already-imported symbols eliminates this entire class with no loss of flexibility.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Resolved three times inside spin() for rng, paytable, and reels dependencies.
- **Duplication [UNIQUE]**: No similar variable found in RAG results.
- **Correction [OK]**: All three registered keys match the types resolved in spin.
- **Overengineering [LEAN]**: Single instantiation of EngineContainer. The over-engineering lives in the class definition; this line is just a consequence of it.
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin() for line evaluation and wildMultiplier calculation.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Matches reference documentation exactly.
- **Overengineering [LEAN]**: Plain data table of 10 payline row-index paths. Matches the spec exactly.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called inside evaluateLine (L80): `const result = checkLine(symbols)`.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts: same WILD-substitution to find lead symbol, same WILD/SCATTER null-guard, same counting loop with identical break condition, same >= 3 threshold. Only differences are local variable names (lead/run vs first/count) and return field names (sym/run vs symbol/count) — the functions are interchangeable.
- **Correction [OK]**: Lead detection via find(s => s !== 'WILD'), SCATTER/all-WILD rejection, and consecutive run counting are all correct.
- **Overengineering [LEAN]**: Focused helper that resolves WILD substitution and counts the leading symbol run. Complexity reflects slot game rules, not unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve the effective leading symbol by skipping WILDs, guard against WILD/SCATTER leads, count the winning run with WILD substitution, and return null if run < 3; differ only in variable and return-field names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin() loop (L143): `const win = evaluateLine(...)`.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [OK]**: Symbol extraction, checkLine delegation, and wild-bonus multiplier are internally consistent; no reference contract specifies the wild bonus formula.
- **Overengineering [LEAN]**: Computes per-payline payout including wild bonus multiplier. The five parameters are all necessary; complexity tracks game requirements.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called locally in spin() (L147). Export has no direct importers, but the function is actively used in the module's primary export path.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [NEEDS_FIX]**: Three independent defects inflate RTP well above the documented 95% target: wrong house-edge direction, undocumented consolation payout, and ceiling rounding.
- **Overengineering [LEAN]**: Simple reduce-and-adjust aggregation. Not overengineered. (deliberated: confirmed — Confirmed. src/engine.ts:105 applies `total * (1 + HOUSE_EDGE)` where HOUSE_EDGE=0.05 (L14). This multiplies winnings by 1.05, INCREASING payouts by 5% instead of reducing them. The JSDoc at L99 states intent is 'approximately 95% RTP', and src/paytable.ts:3 exports ANCIENT_RTP=0.95, confirming the target. The correct formula is `(1 - HOUSE_EDGE)`. Additionally, L108 `total += bet * 0.01` guarantees a non-zero payout on every spin (even losses), further inflating RTP above 100%. Parameter `bet: any` at L101 bypasses the integer validation enforced in spin() at L114.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Exported function, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [NEEDS_FIX]**: Upper-bound validation not enforced: bets above 100 proceed with only a console.warn, violating the arbitrated contract of 1..100 coins.
- **Overengineering [LEAN]**: The function's own logic is linear: validate bet, draw reels, evaluate paylines, aggregate results. The over-engineered abstractions it instantiates (factory, strategy, emitter) are defined in other files and should be flagged there per source-pattern rule. (deliberated: confirmed — Confirmed. src/engine.ts:118 `if (bet > 100) console.warn(...)` only warns but continues execution, while L114 throws on bet < 1. Inconsistent validation: lower bound is hard-enforced, upper bound is soft-warned. Also: L120 resolves `rng` from container but never uses it; L122 resolves `reelsModule` but never uses it — factory.buildReels() (src/factories.ts:12) calls spinReel() which uses the duplicate pickFromWeighted internally, bypassing the container's rng entirely. L115 `throw "invalid bet"` throws a string literal instead of an Error object. Confidence stays moderate because warn-only upper bound could be intentional soft cap.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | `bet: any` appears on both exported functions. Both should be typed as `Bet` (already exported from this file). `EngineContainer.resolve` uses `unknown` internally which is correct, but the `as T` cast on L23 is unavoidable given the design — that is a testability concern, not a `any` violation. [L91, L97] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` is mutable. Should be `readonly (readonly number[])[]` or declared with `as const` to prevent accidental mutation of payline definitions. [L36] |
| 8 | ESLint compliance | FAIL | HIGH | Two clear ESLint violations: (1) `throw "invalid bet"` violates `no-throw-literal` — only `Error` objects should be thrown. (2) `emitter.on(SPIN_DONE, () => {})` registers an empty no-op listener immediately before `emit`, violating `@typescript-eslint/no-empty-function` and serving no logical purpose. [L99, L165-L166] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is a public export with no JSDoc. `computePayout` has a JSDoc block. `Bet` type has no JSDoc. At minimum `spin()` — the primary engine entry point — warrants documentation. [L97] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` throws a string literal rather than an `Error` instance. This breaks `instanceof Error` checks, loses stack traces, and is universally considered a bad practice. Should be `throw new Error("invalid bet")`. No async code is present; this is the sole error handling concern in this file. [L99] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are instantiated inline inside `spin()` with `new`, making them impossible to mock without module patching. The `EngineContainer` DI pattern already exists in the file — `factory`, `strategy`, and `emitter` should be registered in the container or passed as parameters to enable unit testing. [L116-L118] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies readonly (readonly number[])[]` to gain narrowed literal types while retaining assignability checking. The `result: SpinResult` object literal (L154) could use `satisfies SpinResult` to catch missing properties at the declaration site rather than at assignment. [L36, L154] |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain. Two concerns: (1) `bet > 100` only emits `console.warn` and continues — the arbitrated contract specifies `Bet = 1..100 integer`, so bets above 100 should be rejected with a thrown Error, not silently allowed. (2) The no-op emitter registration `emitter.on(SPIN_DONE, () => {})` suggests the event system is wired but not consumed, which in a regulated gaming engine may mask an unimplemented audit-trail hook. [L101-L102, L165-L166] |

### Suggestions

- Replace `any` with the already-exported `Bet` type on both public functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance instead of a string literal to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error(`Invalid bet: ${bet}. Must be an integer between 1 and 100.`);`
- Enforce the bet upper bound (per arbitrated contract: Bet = 1..100)
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`Bet ${bet} exceeds maximum of 100.`);`
- Declare PAYLINES as a readonly const to prevent mutation
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Register factory/strategy/emitter in the DI container so spin() has no hidden dependencies
  ```typescript
  // Before
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  // After
  // At module init:
  container.register("factory", new StandardReelBuilderFactory());
  container.register("strategy", new DefaultStrategy());
  container.register("emitter", new SpinEventEmitter());
  
  // Inside spin():
  const factory = container.resolve<StandardReelBuilderFactory>("factory");
  const strategy = container.resolve<DefaultStrategy>("strategy");
  const emitter = container.resolve<SpinEventEmitter>("emitter");
  ```
- Add JSDoc to the primary public export `spin()`
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
  // After
  /**
   * Executes a single slot spin for the given bet amount.
   * @param bet - Integer coin bet in range [1, 100].
   * @returns Full SpinResult including reel grid, line wins, scatter/jackpot state, and total payout.
   * @throws {Error} If bet is not a positive integer.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or document the unconditional bet * 0.01 addition; it adds ~1% RTP on every spin with no basis in the reference spec and compounds the house-edge direction bug. [L108]
- **[correction · medium · small]** Replace Math.ceil with Math.floor so payout rounding always favors the house, per casino/slot domain convention. [L110]
- **[correction · medium · small]** Throw an error (not just console.warn) when bet > 100 to enforce the arbitrated valid range of 1..100 coins, consistent with the existing throw for bet < 1. [L118]

### Refactors

- **[correction · high · large]** Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout; current code multiplies payout by 1.05 (boosting it) rather than 0.95 (applying the house edge), producing RTP > 100% instead of the documented 95%. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
