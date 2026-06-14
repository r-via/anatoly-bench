# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Simple type alias with no RAG matches.
- **Correction [OK]**: Type alias only; runtime enforcement is delegated to spin().
- **Overengineering [LEAN]**: Trivial type alias; minimal and clear even with only one consumer.
- **Tests [NONE]**: Type alias with no test file present.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported public type alias with no JSDoc. No constraint information (valid range, integer requirement) is documented.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (L106): `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-scoped constant with no RAG matches.
- **Correction [OK]**: Value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Single named numeric constant.
- **Tests [NONE]**: No test file exists; transitive coverage via computePayout is also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported, but the 0.05 value and its RTP effect are undocumented inline.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded `false`; the guarded console.log block in spin (L163) is permanently unreachable dead code.
- **Duplication [UNIQUE]**: Module-scoped constant with no RAG matches.
- **Correction [OK]**: Boolean flag correctly guards debug logging in spin().
- **Overengineering [LEAN]**: Single named boolean flag, hardcoded false.
- **Tests [NONE]**: No test file exists; transitive coverage via spin is also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported; name is self-explanatory, but acceptable as internal flag.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as `container` (L29); container.resolve is called in spin to supply `paytable` to evaluateLine.
- **Duplication [UNIQUE]**: IoC container class with no RAG matches.
- **Correction [OK]**: resolve() silently returns undefined for missing keys, but all keys resolved in spin() are pre-registered; no live call path triggers the unsafe case.
- **Overengineering [OVER]**: Hand-rolled IoC/service-locator wrapping three already-imported module-level symbols (weightedPick, getPayMultiplier, getReelSymbols/Weights). The register→resolve indirection adds no value over direct references: the three imports are already in scope at the top of the file. One resolved ref (reelsModule) is dead code — factory.buildReels is used instead. Another (rng) is resolved but never called. Classic premature generalization with a single instantiation and no testability or swap benefit.
- **Tests [NONE]**: No test file present; class is never directly tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its methods. Internal DI container with non-trivial type-erasing resolve pattern warrants at least a brief comment.

#### `container` (L29–L29)

- **Utility [USED]**: Resolved values used in spin: `paytable` passed to evaluateLine (L139). `rng` and `reelsModule` are resolved but unused, yet the container itself is exercised.
- **Duplication [UNIQUE]**: Module-level singleton variable with no RAG matches.
- **Correction [OK]**: Registers the three keys that spin() resolves; no correctness issue.
- **Overengineering [LEAN]**: Plain instantiation of EngineContainer; over-engineering lives in the class definition, not the variable.
- **Tests [NONE]**: No test file exists; transitive coverage via spin is also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton with three registered services; purpose is implicit from usage only.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin (L138) to drive evaluateLine; also indexed in the wildMultiplier loop (L153).
- **Duplication [UNIQUE]**: Static payline configuration array with no RAG matches.
- **Correction [OK]**: Matches the 10-payline definition in the reference documentation exactly.
- **Overengineering [LEAN]**: Fixed data table for 10 payline paths; minimal and appropriate.
- **Tests [NONE]**: No test file exists; transitive coverage via spin is also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc describing what each row-index array represents or how paylines are traversed. Shape semantics are non-obvious without context.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine (L73).
- **Duplication [DUPLICATE]**: Logic is functionally identical to lineWins in src/paytable.ts: both resolve the lead symbol by skipping WILDs, guard against WILD/SCATTER leads, count consecutive matching-or-WILD symbols, and return null when run < 3. Only superficial differences: field names sym/run vs symbol/count and local variable names lead vs first.
- **Correction [OK]**: Lead-symbol resolution (first non-WILD) and consecutive-run counting are correct; all-WILD and SCATTER-lead cases are handled before the loop.
- **Overengineering [LEAN]**: Clean helper computing symbol run with WILD substitution; does one thing well.
- **Tests [NONE]**: No test file present; function is untested directly or transitively.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper with non-trivial WILD-leader substitution logic and SCATTER exclusion that would benefit from a brief comment.

> **Duplicate of** `src/paytable.ts:lineWins` — ~97% identical logic — same algorithm, same guards, same threshold; only return-object field names and local variable names differ

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin (L139) for each payline.
- **Duplication [UNIQUE]**: No RAG matches; combines payline mapping, checkLine, wild-boost multiplier, and payout calculation in a way not seen elsewhere.
- **Correction [OK]**: Column-major grid access (reels[col][row]) is correct per reference docs; the wild-boost formula has no stated contract so its magnitude is not a flaggable defect.
- **Overengineering [LEAN]**: Straightforward payline evaluation with wild-bonus math; complexity is domain-appropriate for slot payout logic.
- **Tests [NONE]**: No test file exists; transitive coverage via spin is also absent.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal but complex — computes wild-count bonus multiplier on top of base payout with a non-obvious formula `(1+wc)*2^wc`.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin (L141); spin is runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG matches; applies house-edge adjustment and minimum bet contribution in a unique combination.
- **Correction [NEEDS_FIX]**: House edge applied in the wrong direction (inflates payout instead of reducing it), and Math.ceil rounds in the player's favour against slot-machine convention.
- **Overengineering [LEAN]**: Simple reduce + adjustment; no unnecessary abstraction layers.
- **Tests [NONE]**: No test file present. Notable: house edge is applied additively (increases payout instead of reducing it), and a flat 1% bet is always added — both are untested bugs.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and mentions house edge, but omits @param descriptions for `lineWins` and `bet`, the return type explanation, and the unconditional floor of `bet * 0.01` which is a notable behavior.

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG matches; orchestrates the full spin lifecycle across reels, paylines, scatters, free spins, jackpot, and event emission.
- **Correction [NEEDS_FIX]**: Bet upper-bound (100) is not enforced: bets > 100 produce only a console.warn and proceed.
- **Overengineering [LEAN]**: Straightforward orchestration: validate, build reels, evaluate paylines, compute payout, detect features, return result. Per rule 8, the over-engineered abstractions (StandardReelBuilderFactory, DefaultStrategy, SpinEventEmitter) are defined in other files and should be flagged there; spin's own code is proportionate to its task.
- **Tests [NONE]**: No test file present. Critical exported entry point with no coverage: invalid-bet validation, win accumulation, free-spin triggering, jackpot detection, and wild multiplier logic are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Primary exported function with no JSDoc. No documentation of the `bet` parameter constraints (must be integer 1–100), thrown string error, or the fields of the returned SpinResult. (deliberated: confirmed — Confirmed. computePayout (engine.ts:101-111) has two real bugs in the spin lifecycle: (1) Line 105: `total * (1 + HOUSE_EDGE)` multiplies by 1.05, increasing payout instead of decreasing it — the JSDoc at line 99 states intent to 'maintain a target RTP of approximately 95%', so it should be `(1 - HOUSE_EDGE)` = 0.95. (2) Line 108: `total += bet * 0.01` unconditionally adds 1% of bet to every spin result, guaranteeing a minimum payout even on losing spins. Both bugs directly affect the game's RTP. spin() calls computePayout at line 138.)

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both exported function signatures: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. Both are public API entry points. The `Bet = number` alias defined in the same file should be used instead. [L94, L102] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` — should be `ReadonlyArray<readonly number[]>` to prevent accidental mutation. `EngineContainer.resolve<T>` casts `unknown` to `T` via `as T` with no runtime guard, bypassing type safety. [L35, L24] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` (L103) violates `no-throw-literal`; only Error instances should be thrown. `bet: any` on two public functions triggers `@typescript-eslint/no-explicit-any`. Empty arrow `() => {}` in `emitter.on` is a no-op side effect registered on every call. [L103, L94, L102, L161] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` (primary public export) has no JSDoc. `Bet` type alias is undocumented. `computePayout` has JSDoc but its description is factually wrong — it claims to apply house edge for 95% RTP while the code does the opposite. [L93, L101, L13] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L103) throws a primitive string. Callers cannot use `instanceof Error`, stack traces are absent, and `catch (e) { e.message }` throws at runtime. No async code or unhandled rejections present. [L103] |
| 14 | Performance | WARN | MEDIUM | `emitter.on(SPIN_DONE, () => {})` (L161) registers a new no-op listener on every `spin()` invocation without removal — listeners accumulate unboundedly across calls (memory leak). PAYLINES are also iterated twice (L116–L119 and L127–L136) to compute wins and then wildMultiplier; a single pass would suffice. [L161] |
| 15 | Testability | FAIL | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are hardcoded `new` instantiations inside `spin()` with no injection point. The module-level `container` singleton is populated at import time, requiring module-level patching to substitute mocks. No pure-function boundary isolates the spin logic for unit testing. [L109-L112] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` and other const arrays could use `as const satisfies ReadonlyArray<readonly number[]>` for narrower literal types. `satisfies` operator unused throughout. `EngineContainer.resolve<T>` could benefit from const type parameters. [L35] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino/slot-machine domain. `computePayout` applies `total * (1 + HOUSE_EDGE)` = `total * 1.05`, which INCREASES payout by 5% and yields RTP > 100%. The arbitrated intent (README.md) specifies 95% RTP with a 5% house edge — the correct factor is `(1 - HOUSE_EDGE) = 0.95`. The JSDoc comment claims the opposite. This is a confirmed arbitrated-intent violation, not a doc_divergence. [L96-L98] |

### Suggestions

- Replace `any` on `bet` with the `Bet` type alias already defined in this file
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix computePayout house-edge direction — current code inflates payout by 5% (RTP > 100%); arbitrated intent requires 95% RTP
  ```typescript
  // Before
  if (total > 0) {
    total = total * (1 + HOUSE_EDGE);
  }
  // After
  if (total > 0) {
    total = total * (1 - HOUSE_EDGE); // 0.95 → ~95% RTP
  }
  ```
- Throw an Error instance to preserve stack traces and enable instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove the accumulating no-op listener; emit directly or let callers register their own handlers
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Make PAYLINES readonly to prevent mutation
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<readonly number[]> = [`
- Accept factory and strategy as defaulted parameters to enable unit-test injection
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    // ...
    const factory = new StandardReelBuilderFactory();
    const strategy = new DefaultStrategy();
    const emitter = new SpinEventEmitter();
  // After
  export function spin(
    bet: Bet,
    factory: ReelBuilderFactory = new StandardReelBuilderFactory(),
    strategy: SpinStrategy = new DefaultStrategy(),
  ): SpinResult {
  ```
- Remove dead container registration and resolution of reelsModule — it is resolved (L105) but never consumed; reels are built via factory.buildReels instead
  ```typescript
  // Before
  container.register("reels", { getReelSymbols, getReelWeights });
  // ...
  const reelsModule = container.resolve<...>("reels");
  // After
  // delete both lines — reelsModule is unused
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor so fractional payout remainders stay with the house, per slot-machine industry convention. [L109]
- **[correction · medium · small]** Add `|| bet > 100` to the throw condition in spin() so bets outside the 1–100 range are rejected, not just warned about. [L116]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` so the 5% house edge reduces payouts rather than inflating them. [L104]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
