# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 93% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 90% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar type alias found in RAG results.
- **Correction [OK]**: Type alias only; no logic to evaluate.
- **Overengineering [LEAN]**: Simple type alias for number. Appropriate domain naming.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. The name alone does not communicate valid range or units.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (L107): total * (1 + HOUSE_EDGE).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Value 0.05 is numerically correct for a 5% house edge; the defect is in how it is applied in computePayout.
- **Overengineering [LEAN]**: Named constant for a magic number used in payout logic.
- **Tests [NONE]**: No test file exists. Transitive coverage via computePayout/spin is moot — neither is tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal constant, no JSDoc. Acceptable leniency as non-exported, but the RTP contract it implies is non-obvious.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded false; the guarded console.log block in spin never executes at runtime.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Boolean guard constant; no correctness issue.
- **Overengineering [LEAN]**: Simple boolean flag. Hardcoded false is a minor maintainability issue but not overengineering.
- **Tests [NONE]**: No test file exists. Transitive coverage via spin is moot — spin is not tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal flag, no JSDoc. Name is self-explanatory; low concern.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as module-level container (L29), which is consumed in spin.
- **Duplication [UNIQUE]**: No similar class found in RAG results.
- **Correction [OK]**: Simple typed registry; resolve returning undefined for missing keys is a usage concern, not a defect at the definition site.
- **Overengineering [OVER]**: Hand-rolled IoC container (Map-backed register/resolve) for three values that are already direct module imports at the top of the file. The class adds no testability, no lazy init, no lifecycle management — it only obscures `weightedPick`, `getPayMultiplier`, and the reels module behind string keys. Of the three resolved values in `spin`, `rng` and `reelsModule` are never actually used. Single consumer, zero abstraction benefit.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal DI container class with no JSDoc. Purpose and usage are non-obvious from the name alone.

#### `container` (L29–L29)

- **Utility [USED]**: Resolved three times in spin; paytable resolution is actively used. rng and reelsModule are resolved but never called (factory/strategy used instead), making those registrations dead, but the variable itself is referenced.
- **Duplication [UNIQUE]**: No similar variable found in RAG results.
- **Correction [OK]**: Module-level singleton; all three keys registered match the keys resolved in spin.
- **Overengineering [LEAN]**: Instantiation and registration of EngineContainer. Overengineering is in the class definition, not this usage.
- **Tests [NONE]**: No test file exists. Transitive coverage via spin is moot — spin is not tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no JSDoc. Internal; low severity.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Drives the payline loop in spin (L136) and wild-multiplier recalculation (L151).
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: All 10 payline arrays match the reference documentation exactly.
- **Overengineering [LEAN]**: Fixed lookup table for 10 payline paths. Correct representation for static slot geometry.
- **Tests [NONE]**: No test file exists. Transitive coverage via spin is moot — spin is not tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: 10-element payline matrix with no JSDoc. Row-index semantics and payline shapes are not self-evident from the raw arrays.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine (L73).
- **Duplication [DUPLICATE]**: Identical algorithm to lineWins in src/paytable.ts: same WILD-skip lead detection, same SCATTER guard, same counting loop with WILD matching, same run>=3 threshold. Only differences are variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count). Functions are semantically interchangeable.
- **Correction [OK]**: WILD substitution logic, SCATTER guard, and run-counting are correct for the specified payline win rules.
- **Overengineering [LEAN]**: Single-purpose: find the leading pay symbol and count its consecutive run. Linear scan with an early break — minimal and correct.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, no JSDoc. WILD substitution and SCATTER exclusion rules are non-obvious.

> **Duplicate of** `src/paytable.ts:lineWins` — ~97% identical logic — both resolve the leading non-WILD symbol, guard on SCATTER, count consecutive lead-or-WILD symbols, and return null for runs shorter than 3

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called inside the payline loop in spin (L137).
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [OK]**: Symbol extraction via payline.map((row, col) => reels[col][row]) is correct for the column-major grid. Wild multiplier formula has no documented target contract, so cannot be flagged under Rule 4.
- **Overengineering [LEAN]**: Delegates symbol detection to checkLine, applies wild boost, returns a LineWin. Each step is necessary for payline evaluation.
- **Tests [NONE]**: No test file exists. Transitive coverage via spin is moot — spin is not tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function with non-trivial wild-multiplier formula; no JSDoc on any parameter or return value.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin (L141) to produce totalPayout included in the returned SpinResult.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [NEEDS_FIX]**: Two independent defects: house-edge applied in the wrong direction, and payout rounded up instead of down.
- **Overengineering [LEAN]**: Simple reduce plus two arithmetic adjustments. Not over-structured.
- **Tests [NONE]**: No test file exists. Notable gaps include the erroneous house-edge application (adds instead of reduces RTP), the unconditional bet*0.01 bonus, and the Math.ceil behavior — none verified.
- **PARTIAL [PARTIAL]**: Has a JSDoc block describing purpose and RTP intent, but omits @param descriptions for lineWins and bet (typed as any), and no @returns annotation. The unconditional floor of bet*0.01 is undocumented.

#### `spin` (L113–L179)

- **Utility [USED]**: Exported, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [NEEDS_FIX]**: Upper bound of the Bet range is not enforced: bet > 100 only emits a console.warn instead of throwing, violating the arbitrated contract (1..100 coins, integer).
- **Overengineering [LEAN]**: Top-level orchestration: validate bet, spin reels, evaluate paylines, aggregate results. Length is justified by the number of distinct game outcomes to collect. Upstream abstractions (factory, strategy, emitter) are defined in other files and will be evaluated there; spin's own code is a straightforward sequential flow.
- **Tests [NONE]**: No test file exists. Critical exported function with complex behavior (bet validation, reel building, payline evaluation, scatter/freespin/jackpot logic, wild multiplier recalculation) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Primary exported function with no JSDoc. Behavior described in README but inline documentation is absent; no @param, @returns, or @throws for the string-throw on invalid bet.

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | `bet: any` appears in both `computePayout` (L93) and `spin` (L101). `Bet` is already declared as `number` in this file and could replace both parameter types directly. [L93, L101] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` but is a module-level constant that is never mutated. Should be `readonly (readonly number[])[]` (or equivalently `ReadonlyArray<ReadonlyArray<number>>`). [L33-L45] |
| 8 | ESLint compliance | FAIL | HIGH | Three distinct lint violations: (1) `throw "invalid bet"` violates `no-throw-literal` (L103); (2) `rng` and `reelsModule` are resolved from the container but never referenced, violating `no-unused-vars` (L109-L111); (3) `console.warn` and `console.log` in production paths violate `no-console` (L106, L163). [L103, L106, L109-L111, L163] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` is the primary public export and has no JSDoc. `computePayout` is documented. `Bet` type alias lacks a doc comment. [L101] |
| 13 | Security | WARN | HIGH | Slot-machine / regulated-gaming domain inferred from reel/payline/scatter/jackpot/WILD/SCATTER vocabulary throughout. The injected auditable RNG (`weightedPick`, resolved at L109) is never called — reel generation is entirely delegated to `StandardReelBuilderFactory.buildReels()` (L117) whose randomness source is opaque from this file. In regulated gaming the RNG must be auditable end-to-end; this bypass breaks the audit chain. Cannot confirm `Math.random()` without reading `factories.ts`, so WARN rather than FAIL, but the pattern must be corrected before any compliance submission. [L109, L117] |
| 15 | Testability | WARN | MEDIUM | `spin()` hard-codes `new StandardReelBuilderFactory()`, `new DefaultStrategy()`, and `new SpinEventEmitter()` (L115-L117). These cannot be swapped in tests without monkey-patching the module. The `container` DI abstraction is not used for these, making the DI setup misleading. Accept them via parameters or resolve them from the container. [L115-L117] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` would make the `PAYLINES` constant safer (`as const satisfies ReadonlyArray<readonly number[]>`). `using` is applicable to `SpinEventEmitter` if it implements `Symbol.dispose`. Neither feature is used. [L33] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Two violations specific to this slot-engine domain: (1) Arbitrated contract states Bet is '1..100 coins, integer', but `bet > 100` only calls `console.warn` (L106) — it must throw to enforce the contract. (2) `computePayout` multiplies by `(1 + HOUSE_EDGE)` = 1.05 (L96), which INCREASES payouts by 5% instead of reducing them — the opposite of a house edge. The arbitrated 95% RTP contract requires the paytable-based returns to be the ceiling, not inflated further. The inline JSDoc ('Applies the house edge') is contradicted by the implementation. [L93-L100, L106] |

### Suggestions

- Replace `any` on `bet` with the declared `Bet` alias in both public functions
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
- Enforce the upper bound on bet instead of warning silently
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Fix the house edge direction so payouts decrease toward a 95% RTP
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
- Mark PAYLINES immutable with `as const` and a readonly type
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ... entries unchanged
  ] as const satisfies ReadonlyArray<readonly number[]>;
  ```
- Remove or use the dead DI resolutions inside `spin()`
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  // ...
  const reelsModule = container.resolve<{ ... }>("reels");
  // After
  // Pass rng into factory, or remove the container.register("rng", ...) / container.register("reels", ...) calls if DI is not used.
  ```
- Accept collaborators as parameters to make `spin()` testable
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
    // ...
    const factory = new StandardReelBuilderFactory();
    const strategy = new DefaultStrategy();
    const emitter = new SpinEventEmitter();
  // After
  export function spin(
    bet: Bet,
    factory = new StandardReelBuilderFactory(),
    strategy = new DefaultStrategy(),
    emitter = new SpinEventEmitter()
  ): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In computePayout L110, replace Math.ceil with Math.floor — slot-machine payouts must round down so sub-credit remainders accrue to the house. [L110]
- **[correction · medium · small]** In spin, enforce the upper bound of the Bet range by throwing on bet > 100 (e.g. add `|| bet > 100` to the existing guard condition on L115) instead of only warning. [L117]

### Refactors

- **[correction · high · large]** In computePayout L106, change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house edge reduces the payout to ~95% RTP rather than inflating it to ~105%. [L106]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
