# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | NEEDS_FIX | OVER | USED | UNIQUE | WEAK | 55% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type alias with zero runtime and zero type-only importers
- **Duplication [UNIQUE]**: Simple type alias for number. No duplicates found.
- **Correction [OK]**: Type alias only; runtime constraint enforcement delegated to spin().
- **Overengineering [LEAN]**: Trivial type alias over number. Not overengineered — just thin.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias for number with no description of valid range or constraints.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout function at line 108 to adjust total payout
- **Duplication [UNIQUE]**: Constant defining house edge multiplier. No duplicates found.
- **Correction [OK]**: Value 0.05 matches documented 5% house edge; the misuse is in computePayout, not here.
- **Overengineering [LEAN]**: Named constant for a magic number. Appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects RTP calculation in computePayout; its effect is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Value is self-evident but its role in RTP calculation is non-obvious.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded to false; guards console.log code that never executes (line 175)
- **Duplication [UNIQUE]**: Boolean constant for debug logging. No duplicates found.
- **Correction [OK]**: Boolean flag, no correctness issues.
- **Overengineering [LEAN]**: Simple boolean flag; gating a single console.log is minimal.
- **Tests [NONE]**: No test file exists. Constant is always false; branch it guards is dead and untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Private constant, tolerable, but even a brief note on what it enables would help.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to create the dependency container
- **Duplication [UNIQUE]**: Dependency injection container with register/resolve methods. No duplicates found.
- **Correction [NEEDS_FIX]**: resolve() silently casts undefined to T when key is absent, hiding missing-dependency bugs at the call site.
- **Overengineering [OVER]**: Hand-rolled IoC container (string-keyed registry with register/resolve) whose only purpose is to hold three module-level imports — weightedPick, getPayMultiplier, and the reels module — all of which are already available via direct import. Adds type-erasure (Map<string, unknown> with unsafe casts) and a factory/registry pattern for zero runtime benefit. Single consumer (this file). A DI container is justified when resolving implementations at runtime or in tests with swap-out needs; neither applies here.
- **Tests [NONE]**: No test file exists. register/resolve logic (including unsafe cast) has no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its methods. Purpose (service locator / DI container), type-safety trade-offs, and intended usage are not documented.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used in spin function for payline evaluation loop and line symbol lookup
- **Duplication [UNIQUE]**: Static array defining 10 payline configurations. No duplicates found.
- **Correction [OK]**: 10 paylines, all row indices 0–2, consistent with 3-row reel grid.
- **Overengineering [LEAN]**: 10-entry fixed payline matrix is standard slot machine data; no abstraction overhead.
- **Tests [NONE]**: No test file exists. Payline definitions drive all win evaluation; correctness is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The coordinate system (row indices per reel column) and the meaning of each sub-array are not explained.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called from evaluateLine at line 79 to analyze line symbols
- **Duplication [DUPLICATE]**: 95% identical logic to lineWins: same lead-symbol detection, wild-skipping iteration, count >= 3 threshold; differs only in variable names (lead/run vs first/count) and return field names (sym/run vs symbol/count).
- **Correction [OK]**: WILD substitution, lead derivation, and run-length counting are all correct.
- **Overengineering [LEAN]**: Single-responsibility helper: finds leading run of matching/WILD symbols. Clear and minimal.
- **Tests [NONE]**: No test file exists. Critical logic for WILD substitution, SCATTER skip, run counting, and minimum-3 threshold has zero coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. WILD substitution logic and SCATTER exclusion rule are non-trivial and undescribed.

> **Duplicate of** `src/paytable.ts:lineWins` — Both detect winning line patterns using identical algorithm: find lead symbol (first non-WILD if start is WILD), iterate counting lead/WILD matches until mismatch, return symbol+count if >= 3 matches.

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called from spin function in payline evaluation loop at line 128
- **Duplication [UNIQUE]**: Evaluates payline win using checkLine and computes payout with wild multiplier scaling. No similar functions found.
- **Correction [OK]**: Wild-multiplier formula applied once to basePayout; no double-application within this function.
- **Overengineering [LEAN]**: payFn injection is mild abstraction but keeps the function testable without module coupling. Wild-boost math is domain logic, not accidental complexity.
- **Tests [NONE]**: No test file exists. Wild-count bonus formula (exponential multiplier) and null-return paths are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Parameters, wild-multiplier formula, and return semantics are not documented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin at line 131; transitively used via exported spin function
- **Duplication [UNIQUE]**: Aggregates line payouts, applies house edge modifier and bet percentage. No similar functions found.
- **Correction [ERROR]**: Three independent defects collectively invert the house edge and push RTP well above 100%, contradicting the documented 95% RTP target [README.md arbitrated intent].
- **Overengineering [LEAN]**: Simple reduce + scalar adjustments. One function, one responsibility.
- **Tests [NONE]**: No test file exists. Exported function with house-edge application, base-bet bonus, and ceil rounding has no tests despite being a critical financial calculation.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent but omits: parameter types/descriptions, the unexplained `bet * 0.01` floor addition, return value description, and the fact that `bet` is typed `any`. (deliberated: confirmed — Confirmed three correctness defects. (1) src/engine.ts:105 does `total * (1 + HOUSE_EDGE)` where HOUSE_EDGE=0.05 (L14), yielding a 1.05x multiplier that INCREASES payouts. Docstring at L98-99 states target RTP ~95%, requiring `total * (1 - HOUSE_EDGE)` = 0.95x. This is an inverted house edge — the engine pays 105% instead of 95%. (2) L108 `total += bet * 0.01` unconditionally adds 1% of bet to every spin, even zero-win spins, creating a constant money leak. (3) L101 `bet: any` ignores the `Bet` type alias defined at L12. All three are verifiable bugs, not preferences. Raising confidence to 95 given the financial impact in a gambling engine.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on both public API signatures: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The `Bet` alias is already defined in this file — both parameters should use it instead. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is a module-level constant never mutated. Should be typed `readonly number[][]` or declared `as const` to prevent accidental mutation. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` at L115 violates `@typescript-eslint/no-throw-literal` — string throws lose stack traces and cannot be caught with `instanceof Error`. Additionally, `bet > 100` at L118 triggers only `console.warn` rather than throwing, leaving bets outside the documented 1–100 range silently processed. [L115, L118] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` is a public export with no JSDoc; the `Bet` type alias also lacks a doc comment. Only `computePayout` is documented. [L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async code or unhandled rejections. String throw at L115 discards stack trace — a best-practice error-handling violation even in synchronous code. [L115] |
| 14 | Performance | WARN | MEDIUM | spin() allocates a new StandardReelBuilderFactory, DefaultStrategy, and SpinEventEmitter on every call. The empty event listener at L162 is registered then immediately discarded with no effect. Wild multiplier recomputed in a post-spin loop (L149–L158) after already being computed inside evaluateLine. [L124-L126, L149-L158, L162] |
| 15 | Testability | WARN | MEDIUM | factory, strategy, and emitter are hardcoded instantiations inside spin(), not injectable. The DI container pattern already used for rng/paytable/reels should extend to these three dependencies for consistent mockability. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAYLINES could use `satisfies readonly number[][]` to retain literal types while enforcing structural shape. Container.register/resolve overloads could leverage `satisfies` for compile-time key/value type safety. [L34] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Gambling domain confirmed (reel/payline/scatter/jackpot/HOUSE_EDGE vocabulary). Two violations of the arbitrated README RTP invariant: (1) `total * (1 + HOUSE_EDGE)` at L105 increases gross payout by 5% (~105% RTP) instead of applying a 5% house deduction — formula must be `total * (1 - HOUSE_EDGE)` to achieve the documented 95% RTP; (2) `bet > 100` at L118 only warns without rejecting, allowing bets outside the documented 1–100 Bet range to be silently processed. The doc-comment on computePayout (L99) claims 95% RTP, directly contradicting the code's actual behaviour. [L105, L118] |

### Suggestions

- Replace explicit `any` with the already-defined Bet alias on both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix inverted house edge formula to deliver 95% RTP per arbitrated README spec
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw Error objects to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the documented 1–100 Bet upper bound by throwing instead of warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Lock PAYLINES as an immutable const with structural type check
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies readonly number[][];
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or document the unconditional bet * 0.01 consolation payout; it raises RTP on every spin, including full losses. [L108]
- **[correction · medium · small]** Replace Math.ceil with Math.floor so fractional payout remainders stay with the house per slot-machine industry convention. [L110]
- **[correction · medium · small]** Enforce the upper bound: replace console.warn with throw new Error('bet exceeds maximum') when bet > 100 to match the documented 1..100 integer range. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Change total * (1 + HOUSE_EDGE) to total * (1 - HOUSE_EDGE) so the house deducts 5% from wins, targeting the documented 95% RTP. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace throw "invalid bet" with throw new Error("invalid bet") to preserve stack trace and support instanceof checks. [L115]
- **[correction · low · trivial]** Either pass reelsModule into factory.buildReels() so the registered reel config is actually used, or remove the dead container.resolve('reels') call. [L122]
- **[correction · low · trivial]** Add a guard in EngineContainer.resolve() to throw when the key is absent instead of returning undefined cast to T. [L25]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
