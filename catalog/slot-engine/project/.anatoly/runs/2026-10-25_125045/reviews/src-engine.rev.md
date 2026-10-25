# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 90% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 90% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 97% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 93% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Type alias with no RAG matches found.
- **Correction [OK]**: Type alias with no logic.
- **Overengineering [LEAN]**: Simple type alias matching the README contract. No abstraction overhead.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 106: `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-scoped constant with no RAG matches found.
- **Correction [OK]**: Constant value is correct; the defect is in its application inside computePayout.
- **Overengineering [LEAN]**: Named magic number — appropriate.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded to false; the guarded console.log block in spin is permanently dead code at runtime.
- **Duplication [UNIQUE]**: Module-scoped constant with no RAG matches found.
- **Correction [OK]**: Boolean constant, correctly guards debug logging.
- **Overengineering [LEAN]**: Hardcoded false produces dead code in spin(), but as a constant it introduces no abstraction.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to create the module-level container.
- **Duplication [UNIQUE]**: Generic registry class with no RAG matches found.
- **Correction [OK]**: Map-backed registry; the cast in resolve<T> is a type-safety smell but not a runtime logic error.
- **Overengineering [OVER]**: Hand-rolled IoC container (register/resolve Map) wraps three static imports that are already in scope. One instantiation, one consumer (spin). Direct calls to weightedPick, getPayMultiplier, getReelSymbols/getReelWeights would be equivalent with zero indirection.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Resolved in spin for rng, paytable, and reelsModule lookups.
- **Duplication [UNIQUE]**: Module-level singleton instantiation with no RAG matches found.
- **Correction [OK]**: Instantiation and registrations are structurally correct.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin's win-evaluation loop and indexed for wild-multiplier recalculation.
- **Duplication [UNIQUE]**: Payline matrix constant with no RAG matches found.
- **Correction [OK]**: All 10 paylines have 5 entries with row indices in [0,2]; structurally valid for a 5-reel 3-row grid.
- **Overengineering [LEAN]**: Plain data constant for 10 payline patterns. Appropriate representation.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 74.
- **Duplication [DUPLICATE]**: Logic is functionally identical to lineWins in src/paytable.ts: same WILD-resolution (find first non-WILD or fall back to WILD), same SCATTER guard, same counting loop with break, same run-length threshold of 3. Differences are cosmetic only — variable names (lead/run vs first/count) and return-property names (sym/run vs symbol/count). Both functions are interchangeable given a name-mapping shim.
- **Correction [OK]**: WILD substitution logic and left-to-right run counting are correct; null returned for SCATTER-lead and all-WILD lines.
- **Overengineering [LEAN]**: Single-purpose helper: resolve WILD lead, count run, gate on ≥3. No unnecessary generality.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — same WILD resolution, SCATTER guard, counting loop, and ≥3 threshold; only variable and property names differ

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin's payline loop at line 127.
- **Duplication [UNIQUE]**: No RAG matches found; combines payline extraction, checkLine, wild-boost multiplication, and LineWin construction in a way not present elsewhere.
- **Correction [OK]**: Payline symbol extraction via reels[col][row], run detection, and wild-multiplier application are internally consistent.
- **Overengineering [LEAN]**: Computes one payline win including wild boost. Parameterised payFn is justified (injected from call site for testability).
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin at line 130; also exported for direct consumer use.
- **Duplication [UNIQUE]**: No RAG matches found; applies house-edge scaling and minimum-bet floor specific to this module.
- **Correction [NEEDS_FIX]**: Two independent defects: house edge applied in the wrong direction (boosts payout instead of reducing it) and Math.ceil rounds payout up instead of down.
- **Overengineering [LEAN]**: Short aggregation function. Not overengineered; correctness of the house-edge direction is a separate axis. (deliberated: confirmed — Confirmed. engine.ts:105: `total = total * (1 + HOUSE_EDGE)` with HOUSE_EDGE=0.05 (L14) multiplies winnings by 1.05, INCREASING payout by 5%. JSDoc at L98-100 states intent is 'maintain a target RTP of approximately 95%', which requires multiplying by (1 - HOUSE_EDGE) = 0.95, not 1.05. The formula is inverted — the engine overpays instead of taking its edge. Additionally, L108 `total += bet * 0.01` adds 1% of bet to every spin including losses, guaranteeing a minimum return and further inflating RTP beyond the stated 95%. Both are correctness bugs affecting financial outcomes.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG matches found; top-level orchestration function unique to this module.
- **Correction [NEEDS_FIX]**: Upper-bound bet violation (bet > 100) is silently swallowed with console.warn; README documents Bet as 1..100 integer only.
- **Overengineering [LEAN]**: spin's own logic is straightforward: validate, loop paylines, aggregate. The factory/strategy/emitter abstractions it instantiates are defined in other files and flagged there; per the one-source-per-pattern rule, spin is not the site to flag them. (deliberated: confirmed — Confirmed. engine.ts:118: `if (bet > 100) console.warn('bet exceeds maximum')` logs a warning but does NOT reject bets exceeding the maximum. The validation block at L114-116 enforces type/minimum/integer but silently allows bet > 100. The warn message text 'bet exceeds maximum' confirms a max is intended. This is an unenforced upper bound — an arbitrarily large bet is processed with only a console.warn, which constitutes a behavioral bug.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 4.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` for `bet` in both exported functions. `Bet = number` type alias is already defined at L13 and unused for this purpose. [L96, L102] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as `number[][]`, leaving it mutable at runtime. Should use `as const` or `readonly (readonly number[])[]`. [L37] |
| 8 | ESLint compliance | WARN | HIGH | `console.warn` at L106 is outside any debug guard (unlike the L157 `console.log`). Empty arrow function `() => {}` registered as event listener at L163 would trigger `no-empty-function`. [L106, L163] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is a primary public export with no JSDoc. `Bet` type alias also undocumented. Only `computePayout` has JSDoc. [L102, L13] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` at L104 throws a string literal instead of an `Error` instance. Defeats `instanceof Error` checks, drops the stack trace, and breaks any catch site expecting `.message`/`.name`. [L104] |
| 15 | Testability | WARN | MEDIUM | `spin()` hard-instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` with `new` — these cannot be swapped in tests. `container` is a module-level singleton with no reset mechanism. [L113-L115] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies SpinResult` not used for the `result` object literal at L158, which would catch surplus/missing keys without widening. No `const` type params or `using` where applicable. [L158] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two slot-engine-domain issues: (1) `emitter.on(SPIN_DONE, () => {})` registers a no-op listener immediately before `emitter.emit` — dead code suggesting incomplete event wiring. (2) `computePayout` applies house edge as `total * (1 + 0.05)`, which increases payout by 5% (105% RTP), contradicting its own JSDoc claiming a 95% RTP target; correct formula is `total * (1 - HOUSE_EDGE)`. [L96-L100, L163-L164] |

### Suggestions

- Replace `bet: any` with the already-defined `Bet` type alias in both exported functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance instead of a string to preserve stack trace and enable instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix the house edge formula: multiply by (1 - HOUSE_EDGE) to reduce payout to 95% RTP, not increase it
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Make PAYLINES immutable to prevent accidental mutation
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Use satisfies for the SpinResult object literal to catch shape errors without widening
  ```typescript
  // Before
  const result: SpinResult = {
  // After
  const result = {
    reels,
    // ...
  } satisfies SpinResult;
  ```
- Add JSDoc to the spin() public export
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
  // After
  /**
   * Runs one full spin: evaluates ten paylines, wild multipliers, scatters, and jackpot.
   * @param bet - Wager in coins (1..100, integer)
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor: slot payouts must round down so the house keeps fractional remainders, not round up (over-paying the player). [L110]
- **[correction · medium · small]** Add `|| bet > 100` to the existing guard on line 114 so out-of-range bets throw instead of proceeding silently, consistent with the documented Bet = 1..100 contract. [L118]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house retains 5% and effective RTP is reduced toward the documented ~95% target rather than boosted above it. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
