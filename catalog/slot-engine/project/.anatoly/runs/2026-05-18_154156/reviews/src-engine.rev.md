# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | ACCEPTABLE | DEAD | UNIQUE | - | 85% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 90% |
| computePayout | function | yes | OK | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type alias with 0 runtime importers and 0 type-only importers
- **Duplication [UNIQUE]**: Simple type alias for number. No duplication found.
- **Correction [OK]**: Type alias; runtime range/integer constraints enforced in spin().
- **Overengineering [ACCEPTABLE]**: Trivially aliases `number`, 0 importers at runtime or type level. Justified only because README explicitly documents `type Bet = number` as part of the public API contract.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. No description of valid range or semantics (e.g., integer-only, positive, max 100).

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout on L108 to adjust payout calculation
- **Duplication [UNIQUE]**: Numeric constant with unique purpose in payout calculation.
- **Correction [OK]**: Value 0.05 matches the authoritative reference doc formula (total × 1.05).
- **Overengineering [LEAN]**: Named constant for a single magic number used in computePayout.
- **Tests [NONE]**: No test file exists. Constant directly affects payout calculations but is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant, no JSDoc. The value (0.05) and its role in RTP calculation are not explained.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Conditional guard on L171 for debug logging
- **Duplication [UNIQUE]**: Boolean flag constant. No duplication found.
- **Correction [OK]**: Boolean flag; no correctness issue.
- **Overengineering [LEAN]**: Hardcoded-false guard around a single console.log; minimal overhead.
- **Tests [NONE]**: No test file exists. Trivial constant but still uncovered.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal flag, no JSDoc. Trivial but undocumented.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated on L29 to create dependency container
- **Duplication [UNIQUE]**: Custom container class with register/resolve methods. No duplication found.
- **Correction [OK]**: resolve() silently returns undefined-cast-to-T for unregistered keys, but every key resolved in spin() is registered at module init — no missing-key dereference at runtime.
- **Overengineering [OVER]**: Hand-rolled IoC/DI container (register/resolve over a `Map<string,unknown>`) for exactly 3 values that are already statically imported at the top of the file. `container.resolve<typeof weightedPick>("rng")` just returns the same function registered two lines above. Provides zero decoupling, adds unsafe `as T` casts, and `rng` resolved from the container is never actually called inside `spin`. A direct reference to the imported functions is all that is needed.
- **Tests [NONE]**: No test file exists. register/resolve behavior and type-unsafe cast are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal DI container with no class-level or method-level JSDoc. Purpose, lifetime, and registration contract are not described.

#### `container` (L29–L29)

- **Utility [USED]**: Used on L30-31 and L124-126 to register and resolve dependencies
- **Duplication [UNIQUE]**: Instance variable initialization. No duplication found.
- **Correction [OK]**: All three dependencies registered before any resolve() call.
- **Overengineering [LEAN]**: Merely instantiates and populates EngineContainer; over-engineering resides in the class definition above, not here.
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no comment explaining registered keys or intended consumers.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Accessed on L96 (length), L97 (iteration), L166 (mapping)
- **Duplication [UNIQUE]**: Constant array defining payline patterns. No duplication found.
- **Correction [OK]**: Ten payline arrays exactly match the reference doc table (indices 0–9, values within [0,2]).
- **Overengineering [LEAN]**: Static lookup table exactly matching the 10 documented payline patterns.
- **Tests [NONE]**: No test file exists. Payline definitions are untested; incorrect row indices would silently corrupt all win evaluations.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc describing the encoding (column→row-index), payline count, or shape semantics.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called in evaluateLine on L73
- **Duplication [DUPLICATE]**: 98% identical logic to lineWins in src/paytable.ts. Both extract lead symbol (handling WILDs), reject WILD/SCATTER, count consecutive matches, and return symbol+count if >= 3. Only difference is field naming (sym/run vs symbol/count).
- **Correction [OK]**: Lead detection (WILD-skip, SCATTER guard), consecutive-run counting, and ≥3 threshold all match the documented payline scan algorithm.
- **Overengineering [LEAN]**: Single-responsibility: resolves lead symbol and counts the left-to-right run. Straightforward loop.
- **Tests [NONE]**: No test file exists. Critical logic (WILD substitution, leading WILD fallback, SCATTER guard, run counting) has no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, no JSDoc. WILD substitution rule, SCATTER exclusion, and minimum run threshold (3) are undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — Identical semantic logic — both check symbol sequences and count matches accounting for WILDs

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in payline evaluation loop on L97
- **Duplication [UNIQUE]**: Combines line checking with payout calculation and wild multiplier logic. No duplication found.
- **Correction [OK]**: Wild multiplier (1+wildCount)×2^wildCount produces ×1/×4/×12/×32 for wildCount 0/1/2/3, matching the reference doc table. Symbol-row indexing reels[col][row] is correct for a 5-column 3-row grid.
- **Overengineering [LEAN]**: Combines symbol extraction, checkLine, and wild-bonus multiplication in one place. Complexity is proportional to the documented formula.
- **Tests [NONE]**: No test file exists. Wild multiplier formula (exponential bonus) and null-propagation from checkLine are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function with non-trivial wild-bonus formula; no JSDoc on parameters, return type, or the multiplier calculation.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin on L100 to compute total payout from wins
- **Duplication [UNIQUE]**: Applies house edge adjustment to total payout. No duplication found.
- **Correction [OK]**: total×(1+HOUSE_EDGE), unconditional bet×0.01 floor, and Math.ceil all match the authoritative reference doc formula verbatim.
- **Overengineering [LEAN]**: Implements the documented two-step formula (house-edge scaling + floor) in six lines.
- **Tests [NONE]**: No test file exists. House-edge application, minimum-bet floor addition, and Math.ceil rounding are all untested. Exported and business-critical.
- **PARTIAL [PARTIAL]**: Has a JSDoc block describing purpose and house-edge intent, but no @param tags for lineWins or bet, no @returns tag, and the RTP claim ("~95%") is contradicted by the code adding HOUSE_EDGE on top of wins rather than reducing them.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both primary public exports: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The `Bet` type alias is declared on L12 but never applied at the function signatures, eliminating all call-site type safety for the library's core API. [L94-L101] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` — fully mutable. Should be `as const` or `readonly (readonly number[])[]` to prevent accidental mutation during payline evaluation loops. [L37] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` (L105) violates `no-throw-literal` — only Error objects should be thrown. `console.warn` at L106 triggers `no-console` in library contexts. `emitter.on(SPIN_DONE, () => {})` at L158 registers a no-op listener with no obvious purpose. [L105-L106] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is the library's primary entry point with no JSDoc. `Bet` type alias also lacks documentation. `computePayout` has JSDoc but is only partially described (missing @param tags). [L101] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` throws a primitive string — catch clauses that test `instanceof Error` will miss it. No async operations present, so no unhandled rejection risk. The arbitrated intent (`Bet = number; // 1..100 coins, integer`) requires the upper bound to be enforced as an error, but L106 only `console.warn`s for `bet > 100`. [L105-L106] |
| 14 | Performance | WARN | MEDIUM | `emitter.on(SPIN_DONE, () => {})` at L158 registers a new no-op listener on every `spin()` call and never removes it. In a long-running process this causes an unbounded listener leak. [L158] |
| 15 | Testability | WARN | MEDIUM | `spin()` hard-instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` with `new`, and reads from a module-level singleton `container`. There is no injection point, making isolated unit tests impossible without module-level mocking. [L113-L117] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `as const satisfies readonly (readonly number[])[]` for both structural narrowing and immutability. No use of `satisfies` at container registration sites to type-check stored values without widening. [L37] |
| 17 | Context-adapted rules | WARN | MEDIUM | Casino/gambling domain inferred from paylines, jackpot, scatter, free-spin, wild-multiplier vocabulary. `lineBet = bet / 10` (L120) introduces floating-point division on credit values. In regulated gambling engines, all credit arithmetic must remain integer until the display layer — float rounding errors in payouts are a compliance risk. [L120] |

### Suggestions

- Apply the declared `Bet` type alias to both exported function signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw Error objects instead of string literals (fixes no-throw-literal)
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the arbitrated upper bound (1..100) by rejecting bets > 100 rather than warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Make PAYLINES immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Add JSDoc to spin()
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
  // After
  /**
   * Runs one full spin across five reels and ten paylines.
   * Applies wild multipliers, detects scatter free-spin bonuses, and checks the jackpot.
   * @param bet - Integer coin bet in the range 1..100
   * @returns Structured outcome including `totalPayout`, `lineWins`, and `jackpotHit`
   * @throws {Error} when `bet` is not a positive integer ≤ 100
   */
  export function spin(bet: Bet): SpinResult {
  ```
- Remove the no-op listener that leaks on every spin call
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Keep credit arithmetic integer — multiply bet by a base unit, divide only at the display layer
  ```typescript
  // Before
  const lineBet = bet / 10;
  // After
  // Store as deci-coins: 1 coin = 10 units; adjust paytable multipliers accordingly
  const lineBetUnits = bet; // integer, no float division
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Pass the container-resolved rng function and reel-weight data to StandardReelBuilderFactory so the registered RNG and reel weights are actually used during reel generation, making the container injection effective. [L120]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
