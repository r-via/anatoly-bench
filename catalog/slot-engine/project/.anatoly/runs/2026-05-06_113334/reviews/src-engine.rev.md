# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 85% |
| evaluateLine | function | no | OK | ACCEPTABLE | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Non-exported constant referenced in computePayout at line 107.
- **Duplication [UNIQUE]**: Numeric constant for house edge percentage. No duplicates detected.
- **Correction [OK]**: Value 0.05 correctly encodes the documented 5% house edge; the defect is in how it is applied inside computePayout, not in this constant.
- **Overengineering [LEAN]**: Named constant for a domain-significant magic number (5 % house edge). Appropriate and standard practice.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout calculations and is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private module-level constant with no JSDoc. The value and its effect on payout calculations are non-obvious. Lenient because it is internal and the name is reasonably descriptive.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Non-exported constant used in conditional at line 174 in spin function.
- **Duplication [UNIQUE]**: Boolean flag constant. No similar definitions found.
- **Correction [OK]**: Boolean flag set to false; no correctness issues.
- **Overengineering [LEAN]**: Single boolean flag guarding one console.log. Trivial overhead even though it is hardcoded to false; not worth flagging as overengineered.
- **Tests [NONE]**: No test file exists. Constant is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private boolean flag with no JSDoc. Name is self-descriptive and value is trivially false; tolerated as internal with low severity.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Non-exported class instantiated at line 29 and methods called throughout file.
- **Duplication [UNIQUE]**: Custom DI/registry container class with register and resolve methods. No duplicates detected.
- **Correction [OK]**: resolve() silently returns undefined cast to T for unregistered keys, but every key queried in spin() is registered before first use; no runtime crash in current usage.
- **Overengineering [OVER]**: A hand-rolled IoC / service-locator container (register + resolve with a Map<string, unknown>) built exclusively to inject three values — `weightedPick`, `getPayMultiplier`, and the reels module — that are already imported as named ES module imports in the same file. The container is populated once at module load with fixed, compile-time-known dependencies and has exactly one consumer (`spin`). This is a textbook premature abstraction: all the indirection of a DI container with none of the configurability benefit, since the registrations never change at runtime.
- **Tests [NONE]**: No test file exists. EngineContainer register/resolve logic is untested, including type-unsafe resolve behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal service-locator class with no class-level or method-level JSDoc. Its purpose (dependency injection registry), the contract of register/resolve, and the generic typing of resolve are not documented.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Non-exported constant referenced in evaluateLine and spin at lines 132, 133, 167.
- **Duplication [UNIQUE]**: Constant 2D array defining payline patterns. No similar definitions found.
- **Correction [OK]**: All ten payline arrays match the canonical definitions in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md exactly.
- **Overengineering [LEAN]**: Exactly the 10-payline specification documented verbatim in `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`. Direct, flat data with no abstraction layer.
- **Tests [NONE]**: No test file exists. Payline definitions are critical to win evaluation but have no tests verifying correctness.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant defining ten payline row-index arrays. No JSDoc explains the coordinate system (0=top, 2=bottom), the left-to-right evaluation direction, or the meaning of each shape. The data is non-trivial and benefits from documentation.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Non-exported function called by evaluateLine at line 76.
- **Duplication [DUPLICATE]**: Identical logic to lineWins in paytable.ts (score 0.831). Both match symbols against payline rules, handle WILDs, and return matching symbol with count. Only differ in field naming (sym/run vs symbol/count) and variable naming (lead vs first).
- **Correction [OK]**: WILD-substituted lead resolution, run-length counting, and early-exit for SCATTER/all-WILD leads are logically correct.
- **Overengineering [LEAN]**: Focused helper: resolves the lead symbol accounting for WILDs, then counts the contiguous run. Single responsibility, no unnecessary generics or configuration.
- **Tests [NONE]**: No test file exists. Complex WILD/SCATTER handling logic, run detection, and edge cases (all WILDs, leading WILD, short runs) are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function with no JSDoc. Its WILD-substitution logic, SCATTER exclusion, minimum-run requirement, and nullable return contract are not documented. Over 10 lines and non-trivial.

> **Duplicate of** `src/paytable.ts:lineWins` — 98% identical logic — both detect winning symbol patterns by checking for 3+ consecutive matching symbols or WILDs, handling WILD substitution and excluding SCATTER symbols

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Non-exported function called by spin at line 133 within loop.
- **Duplication [UNIQUE]**: Converts reel coordinates to symbols, calls checkLine, calculates payout via callback, applies wild multiplier, returns structured LineWin object. While score 0.718 with computeLegacyPayout suggests partial similarity, the semantic contracts differ: evaluateLine takes reels+payline+callback and returns structured data; computeLegacyPayout takes only pre-extracted symbols and returns a number. Different responsibilities and return types make them non-interchangeable.
- **Correction [OK]**: Payline symbol extraction via reels[col][row], checkLine delegation, and wild-multiplier application to basePayout are correct; wildCount is bounded to result.run positions only.
- **Overengineering [ACCEPTABLE]**: Accepts `payFn` as a callback instead of calling `getPayMultiplier` directly — a mild generalization since there is only one real caller and one real pay function. The added flexibility is minimal but not harmful; the rest of the function is a straightforward payout calculation.
- **Tests [NONE]**: No test file exists. Wild count multiplier math and payout calculation branches are entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function with no JSDoc. The wild-multiplier formula (basePayout * (1 + wildCount) * 2^wildCount) and the meaning of all five parameters are undocumented. Non-trivial length and logic.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called at line 144 by spin, which is imported by src/index.ts.
- **Duplication [UNIQUE]**: Aggregates line wins, applies house edge adjustment, adds bet bonus, and returns ceiling of total. No similar functions found.
- **Correction [NEEDS_FIX]**: Two independent defects: house edge applied as a +5% boost instead of a −5% deduction, and an undocumented bet*0.01 term inflates every payout including losing spins.
- **Overengineering [LEAN]**: Simple reduce over line wins plus the documented house-edge adjustment and a floor-bet return. Logic is concise and directly matches the spec in `.anatoly/docs/04-API-Reference/01-Public-API.md` step 7.
- **Tests [NONE]**: No test file exists. Exported function with house edge application, minimum bet bonus, and Math.ceil rounding is entirely untested. The comment claims RTP ~95% but the logic actually adds the house edge (inflating payouts), which is a likely bug that tests would catch.
- **PARTIAL [PARTIAL]**: Has a JSDoc block describing general purpose and house-edge intent, but lacks @param tags for lineWins and bet, lacks a @returns description, and the description is misleading — it claims 95% RTP but the code multiplies total by (1 + HOUSE_EDGE), which inflates rather than reduces payout. The bet type is declared as `any`, also undocumented.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Both public exports use explicit `any` for the `bet` parameter: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). The type alias `Bet = number` is already defined on L12 and must be used instead. This is especially egregious on the primary public API entry point. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as `number[][]` with no `readonly` modifier, allowing accidental in-place mutation of payline definitions at runtime. It should be declared with `as const` or typed as `readonly (readonly number[])[]`. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | Three clear ESLint violations: (1) `throw "invalid bet"` on L115 violates `no-throw-literal` — only `Error` instances should be thrown; (2) `const rng` resolved on L120 is declared but never used (`no-unused-vars`); (3) `const reelsModule` resolved on L122 is declared but never used. The container DI wiring for `rng` and `reels` is entirely dead — `factory.buildReels(5, 3)` is called with no dependency injected. [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computePayout` has a JSDoc block (L97-L100). `spin`, the primary public-API entry point and the more complex function, has no JSDoc. The `Bet` type alias (L12) also lacks documentation. [L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` on L115 throws a primitive string instead of an `Error` instance. String throws carry no stack trace, are not instanceof-checkable at catch sites, and are flagged by both ESLint (`no-throw-literal`) and TypeScript strict checks. The public API documentation explicitly perpetuates this behavior, which does not make it correct practice. [L115] |
| 13 | Security | WARN | HIGH | Slot-machine/casino gambling domain confirmed by `.anatoly/docs/04-API-Reference/01-Public-API.md` (paylines, scatter symbols, jackpots, free spins, house edge). Regulated gambling requires a certifiable, auditable RNG. `weightedPick` is registered as the RNG in the DI container (L30) and resolved into `const rng` (L120), but is NEVER passed to `StandardReelBuilderFactory.buildReels(5, 3)` (L128). The factory generates reels independently, completely bypassing the registered certifiable RNG. If the factory falls back to `Math.random()` internally, this is a critical compliance failure for a regulated engine. The resolved `rng` and `reelsModule` variables are dead code. [L120, L122, L128] |
| 15 | Testability | WARN | MEDIUM | `spin()` instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` via bare `new` expressions (L124-L126) with no injection points. The module-level `container` singleton is not externally replaceable. These hardcoded dependencies make unit-testing `spin()` in isolation impossible without module-level mocking hacks. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies readonly (readonly number[])[]` for verified, type-safe immutability. The `EngineContainer.resolve` method relies on `as T` unsafe assertion (L25) which could be eliminated or narrowed. No use of `const` type parameters or `using` declarations where applicable. [L25, L34] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two slot-engine-specific concerns: (1) `emitter.on(SPIN_DONE, () => {})` on L175 registers a no-op listener immediately before emitting — the listener does nothing, is dead code, and could cause a memory leak if `SpinEventEmitter` retains references across spins. (2) Wild multiplier is computed twice with different formulas: applied directly to `basePayout` inside `evaluateLine` (L86) and re-derived from scratch in `spin()` (L147-L157) for the `wildMultiplier` result field. These two computations can diverge, producing an inconsistent `wildMultiplier` value relative to the actual payout. [L86, L147-L157, L175] |

### Suggestions

- Replace `any` with the already-defined `Bet` type on both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object to carry a stack trace and satisfy `no-throw-literal`
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Inject the certifiable RNG into the factory to restore the regulated-gambling compliance guarantee
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  // rng never used...
  const factory = new StandardReelBuilderFactory();
  const reels = factory.buildReels(5, 3);
  // After
  const rng = container.resolve<typeof weightedPick>("rng");
  const factory = new StandardReelBuilderFactory(rng);
  const reels = factory.buildReels(5, 3);
  ```
- Mark PAYLINES as deeply readonly using `as const` to prevent mutation
  ```typescript
  // Before
  const PAYLINES: number[][] = [
    [1, 1, 1, 1, 1],
    ...
  ];
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Remove the dead no-op event listener before the emit call
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Add JSDoc to the `spin` public export to match `computePayout`
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
  // After
  /**
   * Executes one complete slot spin.
   * @param bet - Integer coin wager in the range [1, 100].
   * @returns A fully-populated SpinResult including payout, line wins, and bonus state.
   * @throws {Error} When `bet` is not a positive integer.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or formally document the `total += bet * 0.01` statement on line 108. As written it adds 1% of the bet to every spin result (wins and losses), inflates RTP beyond the 95% target on winning spins, and makes it impossible for a minimum-bet losing spin to return 0 coins. [L108]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace `(1 + HOUSE_EDGE)` with `(1 - HOUSE_EDGE)` on line 105 so the house edge deducts 5% from line-win totals, achieving the documented ~95% RTP instead of paying out >105% of wins. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
