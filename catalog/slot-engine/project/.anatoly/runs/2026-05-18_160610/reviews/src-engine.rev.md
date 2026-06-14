# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | ACCEPTABLE | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | NEEDS_FIX | OVER | USED | UNIQUE | WEAK | 55% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 80% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type with zero runtime or type-only importers across the codebase.
- **Duplication [UNIQUE]**: Type alias with no semantic duplicates found in codebase
- **Correction [OK]**: Type alias only; runtime constraints enforced in spin().
- **Overengineering [LEAN]**: Minimal type alias that documents intent; matches the README contract.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. Name alone omits valid range, integer constraint, and currency semantics that callers need.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used internally on line 105 in computePayout to adjust total payout.
- **Duplication [UNIQUE]**: Standalone numeric constant, no duplicates found
- **Correction [OK]**: Value 0.05 is correct; misapplication belongs to computePayout.
- **Overengineering [LEAN]**: Simple named constant for a magic number used in computePayout.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout math and is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported constant with no JSDoc. Effect is non-obvious: it inflates payout (adds 5%) rather than reducing it, which contradicts a naive reading of 'house edge'.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used internally in spin function (line ~170) for conditional debug logging.
- **Duplication [UNIQUE]**: Boolean flag constant, no semantic duplicates found
- **Correction [OK]**: Boolean flag; no correctness issue.
- **Overengineering [ACCEPTABLE]**: Hardcoded false makes the debug block permanently dead, but the pattern is common enough during development to be acceptable.
- **Tests [NONE]**: No test file exists. Constant is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported boolean flag with no JSDoc. Self-descriptive; low documentation priority.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated on line 29 to create the dependency container.
- **Duplication [UNIQUE]**: Dependency injection container class, no similar implementations found
- **Correction [NEEDS_FIX]**: resolve() casts undefined to T when key is absent, producing a deferred runtime crash at the call site.
- **Overengineering [OVER]**: DIY IoC container (string-keyed Map<string, unknown> with register/resolve) for three functions already imported at the module top-level. The type-unsafe string keys and unknown casts add friction with zero benefit — callers could invoke weightedPick, getPayMultiplier, and the reels functions directly.
- **Tests [NONE]**: No test file exists. register/resolve behavior, including type-unsafe cast in resolve, is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported DI container class. No JSDoc on class, register, or resolve. The unsafe cast in resolve<T> warrants at least a note.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used in spin function: iteration over length (line ~135), payline selection (line ~136), and symbol lookup (line ~159).
- **Duplication [UNIQUE]**: Game payline configuration constant, no similar constants found
- **Correction [OK]**: 10 paylines with row indices 0–2 consistent with the 3-row reel grid.
- **Overengineering [LEAN]**: Plain data array of ten fixed paylines; matches the documented payline table exactly.
- **Tests [NONE]**: No test file exists. Payline definitions are structurally untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported constant defining 10 payline row-index patterns. No JSDoc explaining the coordinate system (each element is a row index for that reel column) or payline shapes.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called on line 74 within evaluateLine to analyze symbol sequences.
- **Duplication [DUPLICATE]**: Identical logic to lineWins: extracts leading symbol, handles WILD/SCATTER, counts consecutive matches. Semantic contract is equivalent; only variable and field names differ.
- **Correction [OK]**: Lead-symbol detection, WILD substitution, consecutive-run counting, and SCATTER/all-WILD guard are all correct.
- **Overengineering [LEAN]**: Single-responsibility helper: finds the lead symbol and counts the consecutive run. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER short-circuit, run-length threshold (>=3), and leading-WILD resolution are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported 18-line helper. SCATTER exclusion rule and lead-symbol resolution via WILD substitution are non-trivial but undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical — both identify leading symbol and count consecutive matching/WILD symbols using same loop and condition logic

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called on line 136 in spin function within payline evaluation loop.
- **Duplication [UNIQUE]**: Line evaluation with payout computation and wild multiplier application, no similar functions found
- **Correction [OK]**: Wild-bonus formula (1+wildCount)×2^wildCount matches the documented table; payout is baked into LineWin before returning.
- **Overengineering [LEAN]**: Computes a single payline's win record including the wild bonus. Complexity is proportional to the formula documented in the configuration schema.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding formula (basePayout * (1+wc) * 2^wc) and null propagation from checkLine are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported 30-line helper implementing the wild-bonus formula (1 + wildCount) × 2^wildCount. No JSDoc on params, return, or formula rationale.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called on line 139 in spin function to calculate total payout from line wins.
- **Duplication [UNIQUE]**: Payout calculation with house edge adjustment and rounding, no similar functions found
- **Correction [NEEDS_FIX]**: Multiplies wins by (1 + HOUSE_EDGE) = 1.05, boosting payouts by 5% instead of deducting the house edge; contradicts the arbitrated RTP=95% / house-edge-of-5% contract.
- **Overengineering [LEAN]**: Direct implementation of the documented payout formula (Σ lineWin.payout × 1.05 + bet×0.01, ceiling). No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE application (only when total>0), flat 1% bet bonus, and Math.ceil rounding are untested. Exported and business-critical.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and RTP intent, but omits @param and @returns. Description is misleading: HOUSE_EDGE inflates payout rather than applying a house deduction. The flat bet * 0.01 bonus is also undocumented.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Two exported symbols use explicit `any`: `computePayout(lineWins: LineWin[], bet: any)` (L99) and `spin(bet: any)` (L108). The `Bet` type alias exists but is not applied. `EngineContainer.resolve<T>` performs an unchecked `as T` cast from `unknown` (L24), which is an unsafe type erasure. [L24, L99, L108] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as `number[][]`, allowing callers or internal code to mutate rows at runtime. Should be `readonly (readonly number[])[]` or use `as const`. [L35-L46] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` (L111) violates `no-throw-literal` — a string is thrown instead of an `Error` object, losing stack trace and type safety. Additionally, `emitter.on(SPIN_DONE, () => {})` (L163) registers a no-op listener on every `spin()` call; combined with the immediate `emitter.emit`, this accumulates dead listeners indefinitely, a pattern ESLint's `no-empty-function` and event-emitter-specific rules would flag. [L111, L163-L164] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is the primary public export but has no JSDoc. `computePayout` is documented (L93-L97). `Bet` type alias has no JSDoc. [L108] |
| 14 | Performance | WARN | MEDIUM | Two issues: (1) `spin()` re-maps and re-scans payline symbols for wild counting (L148-L161) after `evaluateLine` already computed and applied the wild bonus inline — redundant O(wins × run) work. (2) `emitter.on(SPIN_DONE, () => {})` registers a new listener each invocation; with no cleanup, listener count grows unboundedly across calls. [L148-L161, L163] |
| 15 | Testability | WARN | MEDIUM | `spin()` directly instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` (L121-L123). None are injectable. The module-level `container` singleton shares state across test runs. Unit-testing `spin()` with a mock reel sequence or mock strategy requires monkey-patching the module, not dependency injection. [L121-L123] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` would benefit from `satisfies readonly (readonly number[])[]` to validate shape while preserving the literal tuple type. No use of `satisfies`, const type parameters, or `using` anywhere in the file. [L35-L46] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-engine context: `emitter.on(SPIN_DONE, () => {})` followed immediately by `emitter.emit(SPIN_DONE, finalResult)` (L163-L164) is an anti-pattern — the no-op listener serves no purpose and accumulates. If the intent is to allow external hooks, the emitter should be exposed or injected, not self-subscribed with a no-op. Additionally, the arbitrated contract (README) specifies `bet` is `1..100 coins`, but `spin()` only enforces the lower bound at runtime; bets above 100 are accepted with a `console.warn`, violating the stated API contract. [L111-L113, L163-L164] |

### Suggestions

- Replace `any` on `bet` params with the existing `Bet` alias
  ```typescript
  // Before
  export function spin(bet: any): SpinResult
  export function computePayout(lineWins: LineWin[], bet: any): number
  // After
  export function spin(bet: Bet): SpinResult
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  ```
- Enforce the arbitrated 1..100 upper bound from README contract
  ```typescript
  // Before
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");
  // After
  if (typeof bet !== "number" || !Number.isInteger(bet) || bet < 1 || bet > 100) {
    throw new Error(`bet must be an integer in [1, 100], got ${bet}`);
  }
  ```
- Make PAYLINES immutable with as const
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
- Remove the accumulating no-op emitter listener; expose emitter for real consumers
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  // expose emitter via return or injection if external subscribers are needed
  ```
- Add JSDoc to the primary public export `spin`
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
  // After
  /**
   * Runs one full spin: builds 5 reels, evaluates 10 paylines, applies wild
   * multipliers, detects scatters and jackpot, and returns the structured outcome.
   * @param bet Integer wager in [1, 100] coins.
   * @throws {Error} if bet is out of range or not an integer.
   */
  export function spin(bet: Bet): SpinResult {
  ```
- Inject factory, strategy, and emitter to improve testability
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
    ...
    const factory = new StandardReelBuilderFactory();
    const strategy = new DefaultStrategy();
    const emitter = new SpinEventEmitter();
  // After
  export function spin(
    bet: Bet,
    deps: SpinDeps = defaultDeps
  ): SpinResult {
    const { factory, strategy, emitter } = deps;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Guard EngineContainer.resolve() against absent keys: throw a descriptive Error (or return a typed Result) instead of silently casting undefined to T. [L25]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` in computePayout to correctly deduct 5% from wins and achieve RTP≈95% per the arbitrated contract. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
