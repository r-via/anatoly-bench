# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | OVER | DEAD | UNIQUE | NONE | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | NEEDS_FIX | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 80% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 55% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type alias not imported by any file. Zero runtime and zero type-only importers.
- **Duplication [UNIQUE]**: Simple type alias, no similar definitions found
- **Correction [OK]**: Type alias for number; no correctness issues.
- **Overengineering [OVER]**: Trivial alias `type Bet = number` with 0 importers. Adds no semantic constraint or nominal typing; callers just use `number` directly.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Type alias for `number` with no description of valid range, units, or constraints.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Internal constant referenced in computePayout function at line 105 in the multiplication formula.
- **Duplication [UNIQUE]**: Numeric constant (0.05), no duplicates found
- **Correction [OK]**: Value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named constant for a single magic number. Appropriate.
- **Tests [NONE]**: No test file exists. Constant affects computePayout output but is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant with no comment explaining its role in payout calculation.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Internal constant guarding debug log in spin function at line 159.
- **Duplication [UNIQUE]**: Boolean constant flag, no duplicates found
- **Correction [OK]**: Boolean guard used correctly; no logic issues.
- **Overengineering [LEAN]**: Simple boolean flag guarding a debug log block. Minimal.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Flag with no description of what debug output it enables.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Internal class instantiated at line 29 to create the container object.
- **Duplication [UNIQUE]**: Service locator container with Map-backed registry, no similar implementations found
- **Correction [NEEDS_FIX]**: resolve() silently returns undefined cast to T for unregistered keys, masking the error as a valid typed value.
- **Overengineering [OVER]**: Hand-rolled DI container (register/resolve with a `Map<string, unknown>`) used only to wrap three direct module imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols/getReelWeights`). All three values are static, never swapped at runtime. Erases static types (returns `unknown` cast to `T`) without providing any benefit over a plain import. Classic premature-abstraction DI for a single, fixed configuration.
- **Tests [NONE]**: No test file exists. register/resolve logic is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its `register`/`resolve` methods. Purpose as a service-locator container is not documented.

#### `container` (L29–L29)

- **Utility [USED]**: Internal variable registered with services and resolved three times in spin function (lines 120-122).
- **Duplication [UNIQUE]**: Single module-scoped instance, no duplicates found
- **Correction [OK]**: All three keys registered immediately after construction; resolve calls in spin will find them.
- **Overengineering [LEAN]**: Straightforward instantiation of EngineContainer; over-engineering lives in the class definition above.
- **Tests [NONE]**: No test file exists. Module-level DI container wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton with no description of its registered services.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Internal constant referenced in spin function at line 133 (.length check) and line 149 (line symbol lookup).
- **Duplication [UNIQUE]**: Game configuration array, no similar payline configs found
- **Correction [OK]**: Ten paylines, each five row-indices in [0,2]; valid for a 5×3 reel grid.
- **Overengineering [LEAN]**: Plain data array of ten payline row-index vectors. No abstraction.
- **Tests [NONE]**: No test file exists. Payline definitions drive all win evaluations but are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The row-index encoding scheme (0=top, 1=middle, 2=bottom) and pattern semantics are undocumented.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Internal function called by evaluateLine at line 74 to validate symbol matches.
- **Duplication [DUPLICATE]**: Identical logic to lineWins() — detects lead symbol, excludes WILD/SCATTER, counts consecutive matches including WILD, requires 3+ run; differs only in field names (sym/run vs symbol/count)
- **Correction [OK]**: Lead-symbol resolution and run-counting are correct; all-WILD and SCATTER-lead edge cases return null as designed.
- **Overengineering [LEAN]**: Single-responsibility: finds the leading symbol and run length. Minimal, well-scoped.
- **Tests [NONE]**: No test file exists. WILD substitution, SCATTER exclusion, and run-length logic all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, no JSDoc. WILD substitution logic and SCATTER exclusion behavior are non-obvious and undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical — same symbol detection, WILD substitution, and run-length logic; only return type field names differ

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Internal function called from spin loop at line 134 to evaluate each payline for wins.
- **Duplication [UNIQUE]**: Payline evaluation with multiplier and wild bonus calculation, no similar functions found
- **Correction [OK]**: Wild multiplier formula basePayout × (1 + wildCount) × 2^wildCount matches the documented invariant [.anatoly/docs/04-API-Reference/03-Types-and-Interfaces.md] and the lookup table in [.anatoly/docs/04-API-Reference/02-Configuration-Schema.md].
- **Overengineering [LEAN]**: Maps a payline to symbols, delegates to checkLine, applies the documented wild-multiplier formula (`basePayout × (1 + wildCount) × 2^wildCount`). Straightforward.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding and payout calculation untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper with complex wild-multiplier formula. No JSDoc on parameters or the amplification logic.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called by spin at line 138. Transitively used since spin is imported by src/index.ts.
- **Duplication [UNIQUE]**: House edge and bet bonus payout logic, no similar functions found
- **Correction [NEEDS_FIX]**: Three independent defects: house edge applied in the wrong direction (boosts payout instead of reducing it), undocumented guaranteed return inflates RTP, and Math.ceil rounds payouts up instead of down.
- **Overengineering [LEAN]**: Simple reduce + two arithmetic adjustments. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Exported function with house-edge application and base bet bonus untested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent, but omits `@param` descriptions, `@returns` type/meaning, and the unconditional `bet * 0.01` floor addition is unexplained.

#### `spin` (L113–L179)

- **Utility [USED]**: Exported function with runtime importer: src/index.ts. Main entry point for slot spin execution.
- **Duplication [UNIQUE]**: Main spin orchestration with reel generation and event emission, no similar functions found
- **Correction [NEEDS_FIX]**: Registered rng and reelsModule are resolved then silently discarded; factory.buildReels bypasses the configured RNG entirely.
- **Overengineering [LEAN]**: Sequential slot logic: validate bet, build reels, evaluate paylines, collect scatter/jackpot/wild state, return result. Abstractions consumed here (factory, strategy, emitter) are defined in external files and assessed there per Rule 9. The function's own code is direct.
- **Tests [NONE]**: No test file exists. Primary export consumed by src/index.ts; invalid bet validation, scatter/free-spin integration, jackpot path, and payout aggregation all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Primary exported function with no JSDoc. Bet validation rules, throw behavior, free-spin triggering, and jackpot logic are all undocumented.

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both public function signatures: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. Both are demonstrably `number` — the runtime guard already enforces numeric constraints. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` but is a compile-time constant never mutated. Should be `as const` or typed `readonly (readonly number[])[]` to prevent accidental mutation and enable narrower inference. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `throw "invalid bet"` violates `no-throw-literal`; (2) `rng` resolved from container but never used (`no-unused-vars`) — `factory.buildReels` is called instead, making the registration dead code; (3) `reelsModule` resolved but never referenced anywhere in the function. [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is a primary public export with no JSDoc. `computePayout` is documented. `Bet` type alias has no JSDoc. [L113] |
| 10 | Modern 2026 practices | WARN | MEDIUM | `throw "invalid bet"` throws a string literal — modern TypeScript always throws `Error` instances for `instanceof` guards and error-tracking tool compatibility. [L115] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | Two issues: (1) `throw "invalid bet"` throws a primitive string — any catch clause checking `instanceof Error` silently swallows it. (2) `emitter.on(SPIN_DONE, () => {})` registers a new no-op listener on every `spin()` call with no corresponding `off()` — unbounded listener accumulation in long-running processes. [L115, L176] |
| 14 | Performance | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are instantiated on every `spin()` call. These are stateless or resettable objects that should be module-level singletons. Combined with the growing listener list from `emitter.on` (L176), this creates unnecessary GC pressure per spin. [L125-L127, L176] |
| 15 | Testability | WARN | MEDIUM | `spin()` hard-codes `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` with no injection point. The module-level `container` is populated at load time, yet the resolved `rng` is never passed to `factory.buildReels`, so registering a test RNG in the container has no effect on spin outcomes — the DI container provides false injection confidence. [L125-L127, L120] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies readonly (readonly number[])[]` for structural validation while preserving literal types. `EngineContainer` could leverage `using` for deterministic lifecycle management if it ever holds disposable resources. [L34] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Slot-machine domain confirmed by `.anatoly/docs/02-Architecture/02-Core-Concepts.md` and `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`. `computePayout` applies `total * (1 + HOUSE_EDGE)` which INCREASES payout by 5% — the inverse of a house edge. The JSDoc comment claims 'target RTP of approximately 95%' but the formula produces RTP > 100%. Correct formula: `total * (1 - HOUSE_EDGE)`. Additionally, `total += bet * 0.01` silently adds a 1%-of-bet bonus on every payout with no design reference or documentation. [L104-L108] |

### Suggestions

- Replace `any` with `number` on both public function signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: number): number
  export function spin(bet: number): SpinResult
  ```
- Fix inverted HOUSE_EDGE formula — multiply by (1 − edge) to reduce payout toward 95% RTP
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw Error instances instead of string literals
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES as deeply readonly to prevent mutation and enable narrower inference
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // same values
  ] as const satisfies readonly (readonly number[])[];
  ```
- Hoist emitter to module level and drop the per-spin no-op listener to prevent unbounded growth
  ```typescript
  // Before
  const emitter = new SpinEventEmitter();
  // ...
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  // module level
  const emitter = new SpinEventEmitter();
  // inside spin() — emit only, no new listener
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Either use the resolved `rng` in factory construction or remove the dead container registrations
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  // rng never used — factory ignores it
  const reelsModule = container.resolve<...>("reels"); // also unused
  // After
  const rng = container.resolve<typeof weightedPick>("rng");
  const reels = factory.buildReels(5, 3, rng); // pass rng so container registration has effect
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove `total += bet * 0.01`; this undocumented guaranteed return inflates RTP beyond the documented target. [L108]
- **[correction · medium · small]** Replace `Math.ceil` with `Math.floor` so fractional remainders stay with the house instead of being paid out. [L110]
- **[correction · medium · small]** Pass the resolved `rng` and `reelsModule` into `factory.buildReels` (or replace the factory call with direct weightedPick-based construction) so the registered RNG drives actual spin outcomes. [L128]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so payout is reduced by 5%, targeting ~95% RTP as documented. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Add a missing-key guard in EngineContainer.resolve: throw a descriptive Error when the key is absent instead of silently returning undefined cast to T. [L25]
- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered (`Bet`) [L12-L12]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
