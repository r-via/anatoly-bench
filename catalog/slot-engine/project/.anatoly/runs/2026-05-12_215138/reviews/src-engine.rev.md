# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 92% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | NEEDS_FIX | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 88% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used in computePayout at line 108 to apply edge adjustment to total payout.
- **Duplication [UNIQUE]**: Simple numeric constant. No similar constants found.
- **Correction [OK]**: Value 0.05 is correct; the defect is in computePayout's misapplication of this constant.
- **Overengineering [LEAN]**: Named constant for a magic number used in payout calculation.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout math but is never verified in isolation or via computePayout tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Purpose and effect on RTP are only inferable from computePayout's comment, not from the constant itself.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Checked at line 177 in spin function to conditionally log debug output.
- **Duplication [UNIQUE]**: Simple boolean constant. No similar constants found.
- **Correction [OK]**: Boolean false constant; no correctness issues.
- **Overengineering [LEAN]**: Single boolean flag guarding a debug log. Trivial even though hardcoded to false.
- **Tests [NONE]**: No test file exists. Flag controls console.log branch in spin(); branch is never exercised by tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private constant — tolerable, but name alone doesn't document what debug output is produced.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated once at line 29; provides service-locator pattern for RNG, paytable, and reels modules.
- **Duplication [UNIQUE]**: Service locator/DI container class with register and resolve methods. No similar classes found.
- **Correction [NEEDS_FIX]**: resolve() silently returns undefined typed as T for unregistered keys instead of throwing.
- **Overengineering [OVER]**: Hand-rolled DI container (`register`/`resolve<T>`) used exclusively in this file to store 3 values that could be referenced directly. Loses all type safety via `Map<string, unknown>` + unsafe cast. Additionally, the registered `reels` module is resolved inside `spin` but never actually used — `factory.buildReels` is called instead.
- **Tests [NONE]**: No test file exists. register/resolve methods, type-cast behavior, and missing-key silent undefined return are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No class-level JSDoc. Purpose (service locator / DI container), lifetime, and type-safety caveats of resolve<T> are undocumented. Neither method has JSDoc.

#### `container` (L29–L29)

- **Utility [USED]**: Registered with three dependencies and resolved three times in spin function at lines 116–118.
- **Duplication [UNIQUE]**: Singleton instantiation of EngineContainer. No similar instantiations found.
- **Correction [OK]**: Container registrations are correct; usage bugs are in spin().
- **Overengineering [LEAN]**: Trivial instantiation; overengineering lives in `EngineContainer`.
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is never validated.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no comment explaining its role as the engine's dependency registry.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated at line 159 to evaluate all paylines; accessed at line 167 to compute wild multiplier.
- **Duplication [UNIQUE]**: Constant data structure defining slot machine paylines. No similar constants found.
- **Correction [OK]**: All row indices in [0,2] for a 3-row grid; 10 paylines correctly formed.
- **Overengineering [LEAN]**: Static data table for slot paylines — appropriate for the domain.
- **Tests [NONE]**: No test file exists. The 10 payline definitions and their row-index correctness are never asserted.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The coordinate system (row indices per column, grid dimensions) and payline layout are non-obvious and completely undocumented.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called within evaluateLine at line 78 to check line-win conditions.
- **Duplication [DUPLICATE]**: Identical logic to lineWins in src/paytable.ts. Both extract lead symbol, validate against WILD/SCATTER, count consecutive matches, return null if count<3. Only naming differs (sym/run vs symbol/count).
- **Correction [OK]**: Lead resolution (first non-WILD) and consecutive WILD/lead run count are logically correct.
- **Overengineering [LEAN]**: Focused single-responsibility helper: finds the leading symbol and run length.
- **Tests [NONE]**: No test file exists. Critical logic paths untested: all-WILD sequences, SCATTER early-return, leading WILD resolved to first non-WILD, run < 3 returning null, run == 3 boundary.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. WILD substitution logic, SCATTER exclusion, minimum run of 3, and return semantics are all undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 100% identical logic with different field names (sym→symbol, run→count)

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin loop at line 160 to evaluate each payline for wins.
- **Duplication [UNIQUE]**: Evaluates payline wins with wild multiplier calculations. Depends on checkLine for symbol matching. No similar functions found.
- **Correction [OK]**: Wild multiplier applied once to basePayout inside this function; wildMultiplier in SpinResult is informational only, no double-application.
- **Overengineering [LEAN]**: Wild-multiplier bonus math is domain logic for a slot engine, not gratuitous complexity.
- **Tests [NONE]**: No test file exists. Wild-count multiplier formula (basePayout * (1+wc) * 2^wc) and null propagation from checkLine are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Parameters (reels layout, payline coordinate array, lineBet units), wild-boost formula, and return null convention are undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin at line 163 to compute total payout from line wins and bet.
- **Duplication [UNIQUE]**: Sums line wins, applies house edge multiplier, adds bet percentage. No similar functions found.
- **Correction [ERROR]**: Two defects: house edge applied as ×1.05 (inflates payout) instead of ×0.95, and Math.ceil rounds up. Both contradict the documented ~95% RTP target.
- **Overengineering [LEAN]**: Simple aggregation with two adjustments. Logic is minimal for its purpose.
- **Tests [NONE]**: No test file exists. Exported public function with a doc comment claiming 95% RTP; HOUSE_EDGE application (multiplies on win, not house edge reduction), the +1% floor on bet, and Math.ceil rounding are all untested.
- **PARTIAL [PARTIAL]**: Has a JSDoc block mentioning house edge and ~95% RTP target, but omits: parameter descriptions, the unconditional `bet * 0.01` floor addition, the Math.ceil rounding, and the `bet: any` type issue. Return value is not documented. (deliberated: confirmed — Confirmed three defects. (1) engine.ts:105: `total * (1 + HOUSE_EDGE)` = `total * 1.05` — INCREASES payout by 5% instead of reducing it. The JSDoc at engine.ts:99 states 'maintain a target RTP of approximately 95%' and README.md:42 documents '95% RTP', so the correct formula is `total * (1 - HOUSE_EDGE)` = `total * 0.95`. The house edge is applied in the wrong direction, making the game player-favorable. (2) engine.ts:108: `total += bet * 0.01` unconditionally adds 1% of bet to every spin payout, guaranteeing a minimum return even on zero-win spins — undocumented and financially unsound. (3) engine.ts:101: `bet: any` instead of `number` defeats TypeScript type safety on a financial parameter. Raising confidence because all three defects are unambiguously verified against the documented intent.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | `bet: any` appears on both `computePayout` (L93) and `spin` (L101). `EngineContainer.resolve` returns `T` via an unsafe `as T` cast from `unknown` (L25), effectively laundering `any` through a generic. Three distinct `any`-equivalent violations. [L25, L93, L101] |
| 3 | Discriminated unions | WARN | MEDIUM | `checkLine` returns `{ sym: Symbol; run: number } \| null` — an anonymous inline shape instead of a named discriminated union type. Minor but inconsistent with `SpinResult` / `LineWin` patterns imported from types.ts. [L51] |
| 4 | Utility types | WARN | MEDIUM | `EngineContainer.registry` stores `Map<string, unknown>` but the container's public API could be typed with `Record`-based generics or a typed registry. Minor missed opportunity; no egregious violation. |
| 5 | Immutability | FAIL | MEDIUM | `PAYLINES` is declared `number[][]` — not `readonly number[][]` nor `as const`. `freeSpinState` object is mutated in place by `handleFreeSpins`. `HOUSE_EDGE` and `DEBUG_MODE` are `const` scalars (fine), but the mutable paylines array is the clearest violation. [L37, L130] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` (L104) throws a string literal instead of an `Error` object — flagged by `@typescript-eslint/no-throw-literal`. `emitter.on(SPIN_DONE, () => {})` registers a no-op listener every call (L161), a likely `no-empty-function` / logic bug. `Bet` type alias is exported but never used in any exported signature (`computePayout` and `spin` both use `any`). [L104, L161] |
| 9 | JSDoc on public exports | FAIL | MEDIUM | `spin` (L101) has no JSDoc. `computePayout` has a JSDoc block (L90) but it is misleading — it claims the house edge maintains ~95% RTP, yet the implementation *adds* the house edge multiplier to winning payouts (increasing them), which is economically backwards. Only one of three exported symbols (`computePayout`) has documentation. [L90, L101] |
| 10 | Modern 2026 practices | WARN | MEDIUM | `SpinEventEmitter` with manual `.on`/`.emit` pattern is an older Node EventEmitter idiom. Using `EventTarget` with typed `CustomEvent` is the modern 2026 browser/Node universal approach. Minor; no deprecated API calls detected. |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` (L104) throws a primitive string — callers catching `Error` will miss it. No async operations present, so no unhandled rejections. The no-op `emitter.on` registered every `spin()` call (L161) leaks listeners unboundedly if the emitter retains references. [L104, L161] |
| 13 | Security | FAIL | CRITICAL | Slot-machine/casino domain inferred from reel/payline/jackpot/wild/scatter/freespin vocabulary throughout the file and project structure. `weightedPick` from `rng.ts` is resolved at runtime via an untyped DI container — if it delegates to `Math.random()` (the common default), it is not a cryptographically certifiable RNG. Regulated gaming jurisdictions (GLI, BMM, iTech Labs) require certified PRNG; `Math.random()` is disqualifying. Additionally, `HOUSE_EDGE` is applied incorrectly (multiplies wins upward rather than downward), meaning the actual RTP is uncapped and non-deterministic — a compliance and financial integrity failure. These are not theoretical: both affect every real-money spin outcome. [L14, L93-L98] |
| 14 | Performance | WARN | MEDIUM | `spin()` instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` on every call (L116-L118). These should be singletons or constructed once outside the hot path. Minor for low-frequency calls but wasteful if spin rate is high. [L116-L118] |
| 15 | Testability | WARN | MEDIUM | `EngineContainer` resolves dependencies but its `resolve` method is unsafe (casts `unknown` to `T` with no runtime check). `spin()` hard-codes `new StandardReelBuilderFactory()` and `new DefaultStrategy()` internally rather than injecting them, making unit testing without monkey-patching difficult. The DI container exists but is not consistently used. |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No use of `satisfies`, const type parameters, or `using` declarations where they would apply. `PAYLINES` would benefit from `as const satisfies readonly number[][]`. `EngineContainer.resolve` could leverage inferred type predicates (TS 5.5). These are missed opportunities, not critical gaps. |
| 17 | Context-adapted rules (Casino/Gaming) | FAIL | CRITICAL | Casino/slot-machine domain. (1) House edge logic is inverted: `total * (1 + HOUSE_EDGE)` on winning payouts *inflates* payouts rather than applying the house margin — correct formula is `total * (1 - HOUSE_EDGE)`. (2) A fixed `bet * 0.01` bonus added unconditionally (L97) further corrupts RTP. (3) `wildMultiplier` is computed post-payout and not applied to `totalPayout`, making it a dead value on the result. (4) The `computePayout` JSDoc claim of ~95% RTP is false given the implementation. These are game-logic correctness violations with direct financial impact. [L93-L98, L143-L153] |

### Suggestions

- Replace `any` on `bet` with `number` and throw a proper Error
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    if (typeof bet !== 'number' || bet < 1 || !Number.isInteger(bet)) {
      throw "invalid bet";
    }
  // After
  export function spin(bet: number): SpinResult {
    if (bet < 1 || !Number.isInteger(bet)) {
      throw new Error(`invalid bet: ${bet}`);
    }
  ```
- Fix house-edge direction — house edge must reduce payout, not inflate it
  ```typescript
  // Before
  if (total > 0) {
    total = total * (1 + HOUSE_EDGE);
  }
  // After
  if (total > 0) {
    total = total * (1 - HOUSE_EDGE);
  }
  ```
- Make PAYLINES immutable with `as const satisfies`
  ```typescript
  // Before
  const PAYLINES: number[][] = [...]
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Type-safe EngineContainer to eliminate unsafe `as T` cast
  ```typescript
  // Before
  resolve<T>(key: string): T {
    return this.registry.get(key) as T;
  }
  // After
  resolve<T>(key: string): T {
    const value = this.registry.get(key);
    if (value === undefined) throw new Error(`No binding for key: ${key}`);
    return value as T; // narrowed: at least confirmed present
  }
  ```
- Hoist per-spin allocations out of `spin()` to avoid per-call construction
  ```typescript
  // Before
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  // After
  // module-level singletons
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  ```
- Remove the no-op listener registration that leaks on every spin
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Change Math.ceil(total) to Math.floor(total) so the house retains the fractional remainder per slot-machine industry convention. [L110]
- **[correction · medium · small]** Pass the registered RNG to factory.buildReels, or use reelsModule with the registered weightedPick, so reel generation uses the controlled RNG rather than an independent path. [L128]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Change total * (1 + HOUSE_EDGE) to total * (1 - HOUSE_EDGE) to actually deduct the house edge and approach the documented ~95% RTP target. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace throw "invalid bet" with throw new Error("invalid bet") to preserve stack traces and enable proper instanceof checks in callers. [L115]
- **[correction · low · trivial]** Add a key-existence check in EngineContainer.resolve() and throw a descriptive error when the requested key is not registered, rather than returning undefined cast to T. [L24]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
