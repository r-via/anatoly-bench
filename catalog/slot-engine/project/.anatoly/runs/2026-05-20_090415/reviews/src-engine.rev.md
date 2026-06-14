# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | NEEDS_FIX | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type alias with 0 runtime importers and 0 type-only importers
- **Duplication [UNIQUE]**: Simple type alias with no semantic duplicates in codebase
- **Correction [OK]**: Type alias only; 1..100 constraint is enforced in spin().
- **Overengineering [LEAN]**: Single-line type alias. 0 importers makes it unused but not over-engineered.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported type alias with implicit constraints (positive integer, max 100) that are not captured by the name alone.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Local constant used in computePayout (line 109) to apply house edge to payout
- **Duplication [UNIQUE]**: Constant value with no similar patterns found
- **Correction [OK]**: Value 0.05 is correct; misapplication is in computePayout.
- **Overengineering [LEAN]**: Named constant for a magic number — correct practice.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects computePayout output but is never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; no documentation on how it interacts with RTP or payout math.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Local constant referenced in spin function (line 173) for conditional debug logging
- **Duplication [UNIQUE]**: Boolean constant with no similar patterns found
- **Correction [OK]**: No correctness issue.
- **Overengineering [LEAN]**: Simple boolean flag guarding a single log statement.
- **Tests [NONE]**: No test file exists. Constant is always false; branch it guards is dead in production and untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag; name is clear but no documentation on what it enables or how to toggle it.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Class instantiated at line 29 and used to manage dependency injection for rng, paytable, and reels
- **Duplication [UNIQUE]**: Service locator container class with no semantic duplicates
- **Correction [NEEDS_FIX]**: resolve() returns undefined cast to T when key is absent, producing silent runtime crashes.
- **Overengineering [OVER]**: Hand-rolled service-locator/IoC container with typed `register`/`resolve` for exactly three dependencies that are already available as top-level imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). Adds `Map`, type-erasure via `unknown`, and a cast on every `resolve` call for zero benefit. Direct references to the imports would be clearer, shorter, and fully type-safe.
- **Tests [NONE]**: No test file exists. register/resolve type-casting behavior and missing-key silent undefined return are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its methods (register, resolve). Internal service-locator pattern is non-obvious and warrants at least a brief description.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Array of payline definitions used in spin loop (lines 137-138) and wild multiplier calculation (line 162)
- **Duplication [UNIQUE]**: Game payline configuration array, no duplicates found
- **Correction [OK]**: Matches reference documentation exactly.
- **Overengineering [LEAN]**: Static data table matching the documented 10-payline layout exactly.
- **Tests [NONE]**: No test file exists. Payline definitions are structural inputs to evaluateLine and spin; correctness never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The row-index encoding convention and payline shapes are not self-evident from the raw number arrays.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Helper function called by evaluateLine (line 76) to validate symbol matches on paylines
- **Duplication [DUPLICATE]**: Identical logic to lineWins: finds leading symbol, handles WILDs, counts consecutive matches, applies 3+ threshold. Variable names differ (lead/run vs first/count) but semantic behavior is identical.
- **Correction [OK]**: WILD substitution and consecutive-run counting are correct.
- **Overengineering [LEAN]**: Focused helper: resolves leading symbol through WILDs, counts the run, returns early when under threshold. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical logic: WILD-as-lead substitution, SCATTER early return, run-length cutoff at 3 — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper; WILD substitution logic and SCATTER exclusion rule are non-trivial and undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical logic — both extract leading symbol from array, handle WILD/SCATTER cases, count consecutive symbol matches, return null if count < 3

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Helper function called in spin loop (line 138) to evaluate each payline for winning combinations
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [OK]**: Symbol extraction, run detection, and wild-bonus application are internally consistent.
- **Overengineering [LEAN]**: Single responsibility: map payline positions to symbols, delegate to `checkLine`, compute payout with wild bonus. Complexity tracks domain logic.
- **Tests [NONE]**: No test file exists. Wild-count exponential multiplier formula and null propagation from checkLine are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper; the wild-bonus multiplication formula (basePayout * (1 + wildCount) * 2^wildCount) is complex and undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called by spin (line 142) to calculate total payout with house edge
- **Duplication [UNIQUE]**: No similar functions found in RAG results
- **Correction [ERROR]**: Two independent defects: house edge applied as a boost instead of a deduction, and Math.ceil rounds payouts up in the player's favor.
- **Overengineering [LEAN]**: Straightforward aggregation with two adjustments (house-edge factor, floor). No unnecessary indirection.
- **Tests [NONE]**: No test file exists. Exported public function: house-edge application, minimum bet bonus, Math.ceil rounding, and zero-win path all untested.
- **PARTIAL [PARTIAL]**: Has a JSDoc describing purpose and RTP intent, but omits @param descriptions for lineWins and bet, omits @returns, and does not document the unconditional bet*0.01 floor or the incorrect HOUSE_EDGE direction (multiplies rather than discounts). (deliberated: confirmed — Confirmed. engine.ts:105 applies `total * (1 + HOUSE_EDGE)` = `total * 1.05`, increasing payouts by 5% instead of reducing them. JSDoc at engine.ts:99 explicitly states intent is '~95% RTP', but the code produces ~105% RTP. Additionally, engine.ts:108 `total += bet * 0.01` unconditionally adds to payout on every spin, further inflating RTP. This is a financial logic bug — the house loses money. HOUSE_EDGE constant at engine.ts:14 is correct (0.05); the misapplication is in the arithmetic operator (+ instead of -).)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Both exported functions declare `bet: any` — bypassing all type safety on the engine's primary input. `Bet` is already defined as `number` in this file and should be used instead. [L91, L99] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` — fully mutable. Should be `readonly (readonly number[])[]` or `as const` to prevent accidental mutation of the fixed payline map. [L35] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` at L103 violates `no-throw-literal`. Callers catching `e` get a string with no `.message`, `.stack`, or type narrowing. Must be `throw new Error("invalid bet")`. [L103] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` — the primary public export — has no JSDoc. `computePayout` is documented. `Bet` type alias is also undocumented. [L99] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L103) makes error inspection fragile. `console.warn` for `bet > 100` (L105) is not enforced — callers receive a warning but `spin` proceeds with an over-limit bet. No async code; no unhandled rejections. [L103, L105] |
| 13 | Security | WARN | MEDIUM | Casino/slot-machine domain inferred from reel/payline/jackpot/WILD/SCATTER/free-spins vocabulary. The module-level `EngineContainer` allows replacing the certified RNG via `container.register("rng", ...)` before `spin()` is called. In regulated gaming, certified RNG must be immutable at runtime. The container is unexported so exploitation requires internal code modification (MEDIUM severity). No hardcoded secrets, eval, or command injection. [L16-L30] |
| 14 | Performance | WARN | MEDIUM | L140-152 recomputes wild positions per winning line by re-mapping `PAYLINES[w.lineIndex]` over `reels`, duplicating traversal already done inside `evaluateLine`. Minor at 10 paylines but unnecessary. [L140-L152] |
| 15 | Testability | WARN | MEDIUM | `spin()` constructs `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` internally — no injection points for mocking. Module-level `container` singleton cannot be reset between tests without re-importing the module. Service-locator pattern resists unit isolation. [L117-L120] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies readonly (readonly number[])[]` for narrowed inference. `SpinEventEmitter` instantiated and never disposed — a candidate for the `using` keyword. No `const` type parameters used where applicable. [L35, L119] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino engine domain. `computePayout` at L95 applies `total * (1 + HOUSE_EDGE)` = `total * 1.05`, which INCREASES winning payouts by 5% — achieving ~105% RTP, not 95%. Correct house-edge application requires multiplying by `(1 - HOUSE_EDGE)` = 0.95. This directly contradicts the arbitrated intent ('The engine targets a theoretical Return-to-Player of 95%') and the function's own JSDoc. [L91-L97] |

### Suggestions

- Replace `any` with the already-defined `Bet` type on both exported functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number {
  export function spin(bet: any): SpinResult {
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number {
  export function spin(bet: Bet): SpinResult {
  ```
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix inverted house edge — multiply by (1 - HOUSE_EDGE) to reduce payout to 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Make PAYLINES immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Add JSDoc to the exported spin() function
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
  // After
  /**
   * Executes a single slot spin for the given coin bet.
   * @param bet - Integer coin bet in range 1–100
   * @returns SpinResult with reels, line wins, scatter/jackpot state, and total payout
   * @throws {Error} If bet is not a valid integer in range 1–100
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor in computePayout; regulated slot-machine domain requires rounding payouts down. [L110]
- **[correction · medium · small]** Throw an error (not just warn) when bet > 100 to enforce the arbitrated 1..100 Bet contract. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout to deduct the 5% house edge instead of adding it. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Guard EngineContainer.resolve() against unknown keys to avoid silent undefined-cast crashes. [L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
