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
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 75% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type but never imported by any file per import analysis.
- **Duplication [UNIQUE]**: Simple type alias for number. No semantic duplicates found.
- **Correction [OK]**: Type alias only; runtime enforcement handled at call sites.
- **Overengineering [LEAN]**: Simple type alias for a domain concept; 0 importers noted but it's part of the documented public API surface.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests required.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported type alias with no description of valid range or semantics (e.g. integer-only, min/max constraints).

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Internal constant used at line 108 in computePayout to apply house edge multiplier.
- **Duplication [UNIQUE]**: Configuration constant. No duplicate definitions found.
- **Correction [OK]**: Constant value 0.05 matches the documented 5% figure.
- **Overengineering [LEAN]**: Named constant for a magic number; appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE affects every payout calculation and its 0.05 value contradicts the JSDoc comment claiming ~95% RTP (applying 1+0.05 multiplier increases payouts, not decreases them). This logic bug is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private constant; name implies purpose but the RTP impact and direction of application are non-obvious.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Internal constant checked at line 175 to conditionally log debug output.
- **Duplication [UNIQUE]**: Feature flag constant. No duplicate definitions found.
- **Correction [OK]**: Boolean flag used correctly in guarded log.
- **Overengineering [LEAN]**: Simple boolean flag; minimal and direct.
- **Tests [NONE]**: No test file exists. Constant is false and its code path is never exercised.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private flag; self-explanatory name justifies leniency, but no comment on how to enable or what it logs.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Internal class instantiated at line 29 and used for service locator pattern.
- **Duplication [UNIQUE]**: Service locator container class. No similar classes found.
- **Correction [OK]**: resolve casts undefined to T on missing keys, but all registered keys are looked up before any unregistered resolve could occur.
- **Overengineering [OVER]**: Hand-rolled service-locator/IoC container for three directly-importable functions. The registry adds indirection with no benefit: values are registered at module load and resolved once inside spin(), where two of the three resolutions (rng, reelsModule) are dead variables never consumed. Direct use of imported functions would be identical in effect and far simpler.
- **Tests [NONE]**: No test file exists. register/resolve logic, type-unsafe cast in resolve, and missing-key behavior are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or either method. Purpose as a service-locator/DI container is non-obvious; register/resolve semantics undescribed.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Internal constant defining game paylines; accessed at line 139 in loop and line 165 for line symbol retrieval.
- **Duplication [UNIQUE]**: Payline configuration matrix. No duplicate definitions found.
- **Correction [OK]**: All 10 payline patterns match the internal data-flow doc exactly (indices 0–9 verified).
- **Overengineering [LEAN]**: Ten fixed payline definitions matching the documented grid layout; no abstraction, just data.
- **Tests [NONE]**: No test file exists. Payline shape correctness (all entries in [0,2], exactly 5 columns) and payline logic are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining the row-index encoding, payline count, or pattern semantics (middle row, zigzag, etc.).

#### `checkLine` (L47–L64)

- **Utility [USED]**: Internal function called at line 80 by evaluateLine to detect winning symbol runs.
- **Duplication [DUPLICATE]**: Identical logic to lineWins (0.823 similarity). Both extract leading symbol, validate non-SCATTER, count consecutive matches, return symbol+count if run≥3, handling WILD cards identically.
- **Correction [OK]**: Lead-finding logic, SCATTER/all-WILD early exits, and left-to-right consecutive run count are all correct per the documented algorithm.
- **Overengineering [LEAN]**: Focused helper: resolves WILD lead, counts consecutive matching symbols, returns run or null. Does one thing.
- **Tests [NONE]**: No test file exists. WILD-leading, WILD-only, SCATTER-lead, run < 3, and run >= 3 branches are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper; WILD substitution logic and SCATTER exclusion rule are non-trivial and undescibed.

> **Duplicate of** `src/paytable.ts:lineWins` — 0.823—identical line-checking logic with WILD/SCATTER handling; only property names differ (sym/run vs symbol/count)

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Internal function called at line 140 in spin to evaluate each payline for wins.
- **Duplication [UNIQUE]**: Evaluates payline against reel grid with wild multiplier computation. No similar functions found.
- **Correction [OK]**: Wild multiplier (1 + wc) × 2^wc matches documented table (wc=1→4, wc=2→12, wc=3→32); payline-to-symbol mapping reels[col][row] is correct.
- **Overengineering [LEAN]**: Orchestrates checkLine, paytable lookup, and wild-bonus multiplication for a single payline. Complexity matches the documented formula.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding formula and null-return path are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal function with complex wild-bonus formula; all five parameters and return value are undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called at line 142 by spin; transitively used via spin which is runtime-imported.
- **Duplication [UNIQUE]**: Aggregates line wins with house edge and bonus. No similar functions found.
- **Correction [NEEDS_FIX]**: total × (1 + HOUSE_EDGE) boosts player payout by 5% instead of deducting the house edge; to apply a 5% house edge the factor must be (1 − HOUSE_EDGE) = 0.95.
- **Overengineering [LEAN]**: Straightforward implementation of the documented payout formula: sum, house-edge scaling, floor addition, ceiling.
- **Tests [NONE]**: No test file exists. The unconditional `bet * 0.01` bonus, the HOUSE_EDGE branch (only triggered when total > 0), Math.ceil rounding, and the `bet: any` type unsafety are all untested.
- **PARTIAL [PARTIAL]**: Has a JSDoc block describing purpose and RTP target, but missing @param tags for lineWins and bet, no @returns tag, and does not note the unconditional +1% base bet addition or the Math.ceil rounding.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both exported functions: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The arbitrated contract specifies `spin(bet: Bet): SpinResult` where `Bet = number`. These defeat type safety on the entire public API surface. [L93, L99] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` declares mutable arrays. Inner rows can be pushed to or overwritten. Should be `readonly (readonly number[])[]` or `as const`. [L41] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `throw "invalid bet"` violates `no-throw-literal` (L104); (2) `reelsModule` is resolved from the container but never read, violating `@typescript-eslint/no-unused-vars` (L116); (3) `bet: any` on two exported functions violates `@typescript-eslint/no-explicit-any`. [L104, L116] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` is a primary exported function with no JSDoc. `Bet` type alias has no doc comment. Only `computePayout` is documented. [L12, L99] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L104) discards stack-trace context; must be `throw new Error("invalid bet")`. No async code paths exist in this file, so no unhandled-rejection risk. [L104] |
| 14 | Performance | WARN | MEDIUM | `reelsModule` is resolved from the container on every `spin()` call but is never used (L116). Additionally, wildMultiplier is iterated over all wins again in `spin` (L141-153) after the same factor is computed per-line inside `evaluateLine`, producing redundant O(wins × count) work. [L116, L141-153] |
| 15 | Testability | WARN | MEDIUM | Module-level singleton `container` is populated at import time; `spin` cannot be unit-tested with alternate RNG/paytable without module-level mocking. `EngineContainer.resolve<T>` uses `return this.registry.get(key) as T` (L25), an unsafe cast that silently returns `undefined` for unregistered keys. [L18-L36] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` would benefit from `as const` to produce a literal readonly tuple type. The `satisfies` operator could validate container registrations against an expected shape without widening. [L41] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine context: (1) `spin(bet: any)` contradicts the arbitrated API contract `spin(bet: Bet): SpinResult`; (2) `emitter.on(SPIN_DONE, () => {})` (L162) registers a no-op listener immediately before `emitter.emit` — the listener never receives real data and the registration is dead code. [L99, L162-163] |

### Suggestions

- Replace `any` with typed `Bet` on both exported functions to satisfy the arbitrated contract
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number {
  export function spin(bet: any): SpinResult {
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number {
  export function spin(bet: Bet): SpinResult {
  ```
- Throw Error instances instead of string literals to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES deeply readonly with as const
  ```typescript
  // Before
  const PAYLINES: number[][] = [
    [1, 1, 1, 1, 1],
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies ReadonlyArray<readonly number[]>;
  ```
- Remove the unused reelsModule resolution or wire it into the factory
  ```typescript
  // Before
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  // Remove entirely if factory.buildReels() is the sole reel source;
  // or pass reelsModule into factory constructor to actually use the DI registration.
  ```
- Remove the no-op event listener or provide a real handler
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  // Register a meaningful listener externally, or remove the on() call:
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Add JSDoc to spin()
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
  // After
  /**
   * Runs one full spin: builds five reels, evaluates ten paylines, applies wild
   * multipliers, detects scatter free-spins, and checks the progressive jackpot.
   * @param bet - Integer coin bet in range 1–100.
   * @throws {Error} When bet is non-integer or < 1.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In computePayout line 105, change (1 + HOUSE_EDGE) to (1 - HOUSE_EDGE) so the house deducts 5% from line wins rather than adding 5%, aligning with the arbitrated 95% RTP / 5% house-edge contract. [L105]
- **[correction · medium · small]** In spin line 118, replace console.warn with throw 'invalid bet' (or an equivalent rejection) when bet > 100 to enforce the documented 1..100 integer constraint. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
