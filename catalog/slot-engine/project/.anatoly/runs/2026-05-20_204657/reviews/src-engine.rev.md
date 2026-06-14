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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 60% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 75% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 105
- **Duplication [UNIQUE]**: Numeric constant, no similar patterns found
- **Correction [OK]**: Value 0.05 correctly represents 5%; the defect is in how it is applied inside computePayout, not the constant itself.
- **Overengineering [LEAN]**: Named constant for a magic number. Correct practice.
- **Tests [NONE]**: No test file exists. Constant directly affects computePayout RTP logic but is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private constant; name conveys intent, but the 0.05 value and its effect on RTP are not described.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin at line 159
- **Duplication [UNIQUE]**: Boolean constant, no similar patterns found
- **Correction [OK]**: Constant false; no correctness issue.
- **Overengineering [LEAN]**: Hardcoded false, but a named flag for conditional debug output is standard and costs nothing.
- **Tests [NONE]**: No test file exists. Constant is always false; branch it guards is dead and untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private, self-descriptive boolean flag; no documentation needed beyond what the name provides.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 for dependency injection
- **Duplication [UNIQUE]**: Service locator pattern class, no similar patterns found
- **Correction [OK]**: resolve() silently casts undefined to T for unknown keys, but all three keys are registered at module load before any call to resolve().
- **Overengineering [OVER]**: DIY service-locator for 3 function references already available as direct imports. `resolve<T>` silently casts to `T`, discarding type safety. `spin` bypasses the container entirely for factory/strategy/emitter. Net effect: indirection with no benefit.
- **Tests [NONE]**: No test file exists. register/resolve behavior, type-erasure, and missing-key handling are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class, register, or resolve. Acts as a simple service-locator DI container; purpose and usage not documented.

#### `container` (L29–L29)

- **Utility [USED]**: Used to resolve dependencies in spin at lines 120-122
- **Duplication [UNIQUE]**: Instance variable, no similar patterns found
- **Correction [OK]**: All three keys registered immediately after instantiation; no correctness issue.
- **Overengineering [LEAN]**: Straightforward instantiation and population of EngineContainer; overengineering is in the class definition, not here.
- **Tests [NONE]**: No test file exists. Module-level singleton with three registered dependencies; wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton container wiring; no description of what it registers or why.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used in payline evaluation loop at lines 133-134 and wildMultiplier calculation at line 149
- **Duplication [UNIQUE]**: Slot machine paylines data constant, no similar patterns found
- **Correction [OK]**: Matches reference docs exactly (10 paylines, identical order and values).
- **Overengineering [LEAN]**: Static data table for 10 fixed paylines. Matches spec exactly.
- **Tests [NONE]**: No test file exists. Ten payline definitions that drive all win detection are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The 10 payline patterns are non-obvious (zigzag, V-shapes, diagonals); each row-index meaning is undocumented.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 74
- **Duplication [DUPLICATE]**: RAG score 0.823 with matching logic/behavior. Both functions extract leading symbol (handling WILDs), count consecutive matches, return symbol+count if >= 3, else null. Only difference is field naming (sym/run vs symbol/count).
- **Correction [OK]**: Lead resolution handles all-WILD and WILD-then-SCATTER cases correctly; run counting stops at first non-matching symbol.
- **Overengineering [LEAN]**: Single-responsibility helper: resolves WILD substitution and counts a run. Clear and minimal.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER early-return, run-length threshold (>=3), and all-WILD edge case are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private helper; WILD substitution logic and SCATTER exclusion rule are non-trivial but function is under 20 lines.

> **Duplicate of** `src/paytable.ts:lineWins` — Identical algorithm for detecting winning symbol lines; differs only in return object field names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin at line 134
- **Duplication [UNIQUE]**: No similar functions found
- **Correction [OK]**: Column-major grid access `reels[col][row]` is correct per spec; WILD boost formula is absent from reference docs but not explicitly prohibited and is not flagged here (would require RTP derivation not fully supported by available constants).
- **Overengineering [LEAN]**: Parameterised pay function aids testability without adding unnecessary abstraction layers. Wild-bonus math is game logic, not over-engineering.
- **Tests [NONE]**: No test file exists. Wild-count multiplier formula, null propagation from checkLine, and payout arithmetic are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Complex wild-multiplier formula (basePayout * (1 + wildCount) * 2^wildCount) has no explanation of intent or derivation.

#### `computePayout` (L101–L111)

Auto-resolved: JSDoc block found before symbol

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both exported public functions: `bet: any` in computePayout (L101) and spin (L113). `type Bet = number` is defined in this same file and should be used. [L101, L113] |
| 3 | Discriminated unions | WARN | MEDIUM | EngineContainer.resolve<T> returns `this.registry.get(key) as T` — an unchecked cast with no runtime guard. A Map<string, unknown> cannot be made type-safe this way; a tagged/discriminated registry would eliminate the assertion. [L25] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` is mutable. Should be `ReadonlyArray<ReadonlyArray<number>>` to prevent accidental payline mutation. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Two violations: (1) `throw "invalid bet"` throws a string literal (no-throw-literal) — L115. (2) `rng` and `reelsModule` are resolved from the container (L120, L122) but never used; `factory.buildReels` bypasses them entirely (no-unused-vars). [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computePayout` has JSDoc; `spin` — the primary public export — has none. [L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` prevents callers from using `instanceof Error` checks. Should be `throw new Error("invalid bet")`. No async code present; no unhandled rejections. [L115] |
| 15 | Testability | WARN | MEDIUM | spin() resolves rng and reelsModule from the DI container but never uses them — factory builds reels internally. Factory, strategy, and emitter are all newed inside spin() with no injection point, making unit isolation impossible without module-level container mutation. [L120-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No `satisfies` operator used. `PAYLINES satisfies ReadonlyArray<ReadonlyArray<number>>` and `result satisfies SpinResult` would catch shape mismatches without widening. No `using` declarations or `const` type parameters where applicable. |
| 17 | Context-adapted rules | FAIL | MEDIUM | Slot-machine domain. `computePayout` applies `total * (1 + HOUSE_EDGE)` (= ×1.05), which INCREASES the payout by 5% — the inverse of the intended house edge. The arbitrated contract specifies 95% RTP (house takes 5%); the correct formula is `total * (1 - HOUSE_EDGE)`. Additionally, `emitter.on(SPIN_DONE, () => {})` registers a no-op listener on every call to spin() with no cleanup, accumulating listeners on each invocation in long-running processes. [L105, L175] |

### Suggestions

- Replace `any` with the already-defined Bet type on both exported functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house-edge multiplier to achieve 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE); // multiplies by 1.05 — raises payout`
  - After: `total = total * (1 - HOUSE_EDGE); // multiplies by 0.95 — applies 5% house edge`
- Mark PAYLINES as deeply readonly
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<ReadonlyArray<number>> = [`
- Remove unused container resolves or wire them through the factory
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<...>("reels");
  // ... factory.buildReels(5, 3) used instead
  // After
  // Either remove rng/reelsModule resolves, or pass rng to factory:
  const rng = container.resolve<typeof weightedPick>("rng");
  const reels = factory.buildReels(5, 3, rng);
  ```
- Add JSDoc to the primary public export
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
  // After
  /**
   * Executes a single slot spin for the given bet amount.
   * @param bet - Integer coin bet in range [1, 100].
   * @returns SpinResult containing reels, line wins, scatter/jackpot state, and total payout.
   * @throws {Error} When bet is non-integer, < 1, or not a number.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Throw an error when bet > 100 (same path as the existing < 1 / non-integer check); arbitrated contract defines Bet as 1..100 integer. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]
- **[utility · high · trivial]** Remove dead code: `computePayout` is exported but unused (`computePayout`) [L101-L111]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` in computePayout; current code boosts payouts by 5% instead of reducing them, producing RTP > 100% against the documented 95% target. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace Math.ceil with Math.floor in computePayout; slot-machine payouts must round down so the house retains fractional remainder. [L110]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol:  `Bet`, `computePayout`, `spin` (`Bet, computePayout, spin`) [L12-L12, L101-L111, L113-L179]
