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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 90% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type not imported by any file. Zero runtime and type-only importers.
- **Duplication [UNIQUE]**: Simple type alias, no semantic matches found
- **Correction [OK]**: Type alias only; runtime range constraints are enforced in spin().
- **Overengineering [LEAN]**: Single-line type alias. Trivial, no structural complexity.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Type alias for number with no constraints documented (valid range, integer requirement).

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used in computePayout at line 108 to apply house edge multiplier.
- **Duplication [UNIQUE]**: Numeric constant, no duplicates found
- **Correction [OK]**: Value 0.05 is arithmetically correct for a 5% edge; the defect is in its application inside computePayout, not the constant itself.
- **Overengineering [LEAN]**: Named numeric constant, appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE affects computePayout behavior but is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private module-level constant, no JSDoc. Value and effect on RTP are undocumented.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used in spin function at line 171 to conditionally log debug output.
- **Duplication [UNIQUE]**: Boolean flag, no duplicates found
- **Correction [OK]**: Constant correctly set to false.
- **Overengineering [LEAN]**: Named boolean flag, appropriate.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant, no JSDoc.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 as container; provides registry/resolve pattern for dependency injection.
- **Duplication [UNIQUE]**: Service container class, no semantic matches found
- **Correction [OK]**: resolve() silently returns undefined cast to T for missing keys, but all three keys are registered at module load before any resolve call, so no reachable undefined-dereference path.
- **Overengineering [OVER]**: DIY service-locator wrapping three already-imported module-level references in a string-keyed Map<string, unknown> with unsafe `as T` casts. The resolved values (weightedPick, getPayMultiplier, reels module) are statically imported at the top of the file and never swapped at runtime — direct references are strictly equivalent with zero indirection, zero runtime cost, and full type safety. The abstraction buys nothing.
- **Tests [NONE]**: No test file exists. register/resolve contract and missing-key behavior are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No class-level or method-level JSDoc. Purpose as a service-locator container and generic resolve semantics are not documented.

#### `container` (L29–L29)

- **Utility [USED]**: Registered with RNG, paytable, and reels at lines 30–32; resolved in spin at lines 117–119.
- **Duplication [UNIQUE]**: Instance variable, no duplicates found
- **Correction [OK]**: Module-level init registers all required keys before use.
- **Overengineering [LEAN]**: Single instantiation line; the over-engineering lives in EngineContainer.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal module singleton, no JSDoc. Role and registered keys undocumented.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used to evaluate line wins at line 139 and to extract line symbols at line 160 in spin function.
- **Duplication [UNIQUE]**: Payline array constant, no semantic matches found
- **Correction [OK]**: Matches the 10-payline definition in the authoritative reference docs exactly.
- **Overengineering [LEAN]**: Plain data constant for 10 fixed paylines. Appropriate.
- **Tests [NONE]**: No test file exists. Payline layout correctness is never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining row-index encoding or payline shape semantics.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 74 to check for matching symbols and wilds.
- **Duplication [DUPLICATE]**: Identical logic to lineWins: finds lead symbol, checks sequences with WILD support, returns match or null
- **Correction [OK]**: Lead-resolution (WILD substitution from position 0) and consecutive-run counting are correct; all-WILD and SCATTER short-circuits are consistent with the paytable spec.
- **Overengineering [LEAN]**: Single-responsibility: finds the leading pay symbol and counts its consecutive run. Concise and direct.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER early-exit, run-length threshold (<3), and all-WILD edge cases are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, no JSDoc. WILD substitution logic and null-return conditions are non-trivial and undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical — same symbol-checking logic with different variable/property names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin at line 139 for each payline to evaluate wins and payouts.
- **Duplication [UNIQUE]**: No similar functions found in semantic search
- **Correction [OK]**: Payline-to-grid mapping (reels[col][row]) and wild-count accumulation within the run window are correct; WILD bonus formula has no contradicting documented spec.
- **Overengineering [LEAN]**: Computes per-line payout including wild bonus in one focused function. Complexity is proportional to the rule set.
- **Tests [NONE]**: No test file exists. Wild-count multiplier compounding (basePayout * (1+wc) * 2^wc) is a critical financial calculation with no test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function, no JSDoc. Wild-multiplier amplification formula is complex and undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by exported spin function at line 145; transitively used via spin's external importers.
- **Duplication [UNIQUE]**: No similar functions found in semantic search
- **Correction [NEEDS_FIX]**: Two independent defects: house-edge applied in the wrong direction (boosts payouts above 100% RTP instead of reducing them to 95%), and Math.ceil rounds fractional credits to the player against casino convention.
- **Overengineering [LEAN]**: Short aggregation function; no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. The house-edge application (multiplies instead of reducing), the unconditional +bet*0.01 floor, and Math.ceil rounding are all untested despite being exported and financially significant.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent but omits @param for lineWins and bet, omits @returns, and does not document the unconditional floor addition (bet * 0.01) or the incorrect house-edge direction (multiplies by 1.05, which raises rather than reduces payout).

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Two exported functions carry explicit `any` parameters: `computePayout(lineWins: LineWin[], bet: any)` (L93) and `spin(bet: any)` (L101). The project already exports `Bet = number` — these should use it. [L93, L101] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` is fully mutable. Should be `ReadonlyArray<readonly number[]>` or use `as const` to prevent accidental mutation of payline configuration. [L36] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` (L103) violates `no-throw-literal`. Both `bet: any` parameters violate `@typescript-eslint/no-explicit-any`. Empty function body in `emitter.on(SPIN_DONE, () => {})` (L161) violates `no-empty-function`. [L93, L101, L103, L161] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (L101) and `Bet` (L13) are exported without JSDoc. `computePayout` is documented (L88–L91). [L13, L101] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L103) is a string — callers cannot use `instanceof Error` or access `.message`. `bet > 100` only emits `console.warn` (L105) and proceeds rather than throwing, allowing out-of-range bets to reach full spin logic. [L103, L105] |
| 15 | Testability | WARN | MEDIUM | `spin` directly instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` (L112–L114) with no injection seam. The module-level `container` singleton is unexported, preventing test overrides of registered `rng`/`paytable`/`reels` dependencies. [L112-L114] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies ReadonlyArray<readonly number[]>` for inferred literal types while retaining the annotation. No `using` or const type parameters where applicable. [L36] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino/slot domain — two violations: (1) `bet > 100` is silently allowed (L105), contradicting the arbitrated contract `type Bet = number; // 1..100 coins, integer`. (2) `computePayout` applies `total * (1 + HOUSE_EDGE)` (L96), which inflates payout by 5% instead of reducing it — the operator loses on every winning spin. The arbitrated RTP contract states 95% player return (house keeps 5%), requiring `total * (1 - HOUSE_EDGE)`. [L96, L105] |

### Suggestions

- Replace `bet: any` with the already-exported `Bet` type on both public functions
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
  - After: `throw new RangeError(`Invalid bet: ${bet}. Must be an integer in [1, 100].`);`
- Enforce the upper bound of the bet range — replace warn-and-continue with a throw
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new RangeError(`Bet ${bet} exceeds maximum of 100.`);`
- Fix house edge direction to target 95% RTP — current code inflates payouts by 5% instead of applying a 5% house cut
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Mark PAYLINES as readonly to prevent mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<readonly number[]> = [`
- Inject dependencies into `spin` for testability (factory, strategy, emitter)
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    ...
    const factory = new StandardReelBuilderFactory();
    const strategy = new DefaultStrategy();
    const emitter = new SpinEventEmitter();
  // After
  interface SpinDeps {
    factory?: StandardReelBuilderFactory;
    strategy?: DefaultStrategy;
    emitter?: SpinEventEmitter;
  }
  export function spin(bet: Bet, deps: SpinDeps = {}): SpinResult {
    const factory = deps.factory ?? new StandardReelBuilderFactory();
    const strategy = deps.strategy ?? new DefaultStrategy();
    const emitter = deps.emitter ?? new SpinEventEmitter();
  ```
- Add JSDoc to the exported `spin` function
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
  // After
  /**
   * Executes a single slot spin.
   * @param bet - Integer coin bet in the range [1, 100]
   * @returns SpinResult containing reels, line wins, scatter/jackpot flags, and total payout
   * @throws {RangeError} if bet is not an integer in [1, 100]
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In computePayout L110: replace Math.ceil with Math.floor. Slot machines round payout down; ceil awards fractional credits to the player, further widening the RTP overpayment. [L110]
- **[correction · medium · small]** In spin L118: replace console.warn with a throw (matching the < 1 guard) to enforce the documented upper bound of 100. Current code allows arbitrarily large bets. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** In computePayout L105: replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)`. Current formula amplifies payouts to RTP > 100%; 1 - 0.05 = 0.95 correctly targets the documented 95% RTP. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
