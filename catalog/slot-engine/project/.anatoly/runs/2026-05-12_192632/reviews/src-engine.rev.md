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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 85% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 88% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used in computePayout on line 107
- **Duplication [UNIQUE]**: Numeric constant with no similar constants found.
- **Correction [OK]**: Constant value 0.05 is numerically correct; the defect is in its application inside computePayout, not in the constant itself.
- **Overengineering [LEAN]**: Named constant for a domain value. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout calculations but is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious semantics: the implementation adds 5% to winning payouts rather than reducing them, which contradicts the conventional house-edge direction — worth documenting.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used in spin function on line 172 for conditional logging
- **Duplication [UNIQUE]**: Boolean constant with no semantic duplicates in codebase.
- **Correction [OK]**: Boolean flag constant; no logic.
- **Overengineering [LEAN]**: Simple boolean flag; dead code (always false) but not overengineering.
- **Tests [NONE]**: No test file exists. Constant is always false so the debug branch is dead and untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal flag; name is clear enough that omission is tolerable, but no comment explains how to enable or what it logs.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated on line 29 to create container object
- **Duplication [UNIQUE]**: Container class with simple service locator pattern — no duplicates detected.
- **Correction [OK]**: resolve() silently casts undefined to T for missing keys, but all three registered keys are consumed before any missing-key scenario arises.
- **Overengineering [OVER]**: Hand-rolled DI container (Map + stringly-typed register/resolve with unsafe cast) used exclusively to re-expose three already-imported module functions. All three registered values are resolvable directly via their imports and consumed in a single call site (spin). No test doubles, no swappable implementations, no multi-consumer scenario — zero benefit from the indirection layer.
- **Tests [NONE]**: No test file exists. register/resolve round-trip, missing-key behavior, and type-cast safety are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its methods. Implements a service-locator / manual DI container pattern that is non-obvious from the name alone.

#### `container` (L29–L29)

- **Utility [USED]**: Used throughout file: registered on lines 30-32, resolved on lines 118-120
- **Duplication [UNIQUE]**: Instance variable initialized with EngineContainer — unique instantiation.
- **Correction [OK]**: All three keys registered at module load before any resolve() call.
- **Overengineering [LEAN]**: Straightforward instantiation; the over-engineering is in EngineContainer's definition, not this usage.
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton wiring three core dependencies; its role in the spin pipeline is undescribed.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used in spin function: length accessed on line 127, indexed on lines 128 and 153
- **Duplication [UNIQUE]**: Payline pattern array with no duplicates in codebase.
- **Correction [OK]**: Matches the documented 10-payline configuration exactly.
- **Overengineering [LEAN]**: Ten payline definitions as a plain 2D array. Matches the documented configuration schema exactly.
- **Tests [NONE]**: No test file exists. Payline definitions (shape, row bounds) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining the row-index encoding, payline count, or ordering. The data is non-trivial to interpret without context.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called in evaluateLine on line 78
- **Duplication [DUPLICATE]**: Identical logic to lineWins in src/paytable.ts (RAG score 0.834). Both validate symbols, find consecutive runs from first non-WILD, exclude SCATTER, and return run >= 3. Only variable names differ (lead/first, run/count, sym/symbol).
- **Correction [OK]**: Lead resolution, SCATTER guard, and left-anchored consecutive-run counting are all correct.
- **Overengineering [LEAN]**: Single responsibility: resolves WILD-leading symbol and counts the consecutive run. Logic is proportionate to slot-game rules.
- **Tests [NONE]**: No test file exists. WILD-lead resolution, SCATTER early-return, run-length cutoff at <3, and all-WILD cases are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper, but its WILD-substitution logic and early-exit on SCATTER are notable behaviors not described anywhere.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical implementation — same logic flow for detecting consecutive symbol runs with WILD handling and SCATTER filtering

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin function on line 128 for each payline
- **Duplication [UNIQUE]**: RAG found no similar functions. Complex payline evaluation with wild multiplier logic.
- **Correction [OK]**: payout = baseMultiplier × lineBet × (1+wildCount) × 2^wildCount matches the documented formula.
- **Overengineering [LEAN]**: Maps a payline to symbols, delegates to checkLine, applies the wild-boost formula documented in the types spec. Every step is necessary.
- **Tests [NONE]**: No test file exists. Wild-count multiplier formula, null propagation from checkLine, and payout arithmetic are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal function with a non-trivial wild-boost formula applied on top of the base multiplier; parameters and return value are undescribed.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin function on line 131; transitively used via spin which is imported
- **Duplication [UNIQUE]**: RAG found no similar functions. House edge adjustment and rounding logic specific to this payout calculation.
- **Correction [NEEDS_FIX]**: House edge applied in the wrong direction (1+HOUSE_EDGE inflates payout instead of reducing it); Math.ceil rounds payout up, violating slot-domain floor-rounding convention.
- **Overengineering [LEAN]**: Simple reduce over line wins with two arithmetic adjustments. Not overengineered.
- **Tests [NONE]**: No test file exists. House-edge application (note: comment says ~95% RTP but code adds HOUSE_EDGE making payout larger, not smaller), base-bet bonus, Math.ceil rounding, and empty-wins case are all untested.
- **PARTIAL [PARTIAL]**: Has a JSDoc block but omits @param for both lineWins and bet (typed as any), omits @returns, and the description states house edge maintains ~95% RTP while the implementation adds 5% to wins (increasing payout), contradicting the stated intent.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)` both carry explicit `any`. `Bet` (type alias = `number`) is already exported from this file and is the correct annotation for both parameters. [L101,L113] |
| 3 | Discriminated unions | WARN | MEDIUM | `resolve<T>` casts `unknown` to `T` via bare `as T` with no runtime guard (L25). A typed registry interface (`{ rng: typeof weightedPick; paytable: typeof getPayMultiplier; ... }`) keyed with `keyof` would eliminate the assertion entirely. [L25] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is declared as mutable `number[][]` but is never mutated. Should be `readonly (readonly number[])[]` or use `as const`. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | `throw "invalid bet"` (L115) throws a string literal — violates `no-throw-literal`. `emitter.on(SPIN_DONE, () => {})` (L175) registers an empty callback — violates `no-empty-function`. [L115,L175] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (L113) is a public export with no JSDoc. `Bet` type alias (L12) also undocumented. `computePayout` is adequately documented. [L12,L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L115) throws a string, not an `Error` instance — loses stack trace. `emitter.on(SPIN_DONE, () => {})` (L175) registers a no-op listener immediately before `emit`; the handler is effectively dead code and likely reflects a missing implementation. [L115,L175] |
| 15 | Testability | WARN | MEDIUM | `spin` instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` with `new` directly (L124–L126), blocking mock injection. The module-level `container` singleton with hard-coded registrations (L29–L32) cannot be replaced per-test without module patching. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` would benefit from `satisfies readonly (readonly [0\|1\|2, 0\|1\|2, 0\|1\|2, 0\|1\|2, 0\|1\|2])[]` to enforce valid row indices at compile time — especially valuable in a gambling engine where payline correctness is safety-critical. [L34] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Slot-machine domain inferred from reel/payline/WILD/SCATTER/jackpot/free-spin/RTP vocabulary. `computePayout` applies `total * (1 + HOUSE_EDGE)` = ×1.05, increasing payouts 5% above the base paytable. Targeting 95% RTP requires `total * (1 - HOUSE_EDGE)` = ×0.95. The current implementation yields ~105% RTP on wins — a financial integrity violation that would breach licensed RTP compliance in any regulated jurisdiction. [L104-L106] |

### Suggestions

- Replace `bet: any` with the already-exported `Bet` type.
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance to preserve stack traces and satisfy no-throw-literal.
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix house edge direction so payouts are reduced to target 95% RTP.
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Lock PAYLINES as a readonly const and validate row indices with satisfies.
  ```typescript
  // Before
  const PAYLINES: number[][] = [
    [1, 1, 1, 1, 1],
    // ...
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies readonly (readonly [0|1|2, 0|1|2, 0|1|2, 0|1|2, 0|1|2])[];
  ```
- Accept injectable dependencies in spin() for testability.
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    // ...
    const factory = new StandardReelBuilderFactory();
    const strategy = new DefaultStrategy();
    const emitter = new SpinEventEmitter();
  // After
  export interface SpinDeps {
    factory?: StandardReelBuilderFactory;
    strategy?: DefaultStrategy;
    emitter?: SpinEventEmitter;
  }
  export function spin(bet: Bet, deps: SpinDeps = {}): SpinResult {
    const factory = deps.factory ?? new StandardReelBuilderFactory();
    const strategy = deps.strategy ?? new DefaultStrategy();
    const emitter = deps.emitter ?? new SpinEventEmitter();
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil(total) with Math.floor(total) in computePayout; slot-machine convention requires rounding down so the house retains fractional remainders. [L110]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so the house edge reduces the payout and achieves the documented ≈95% RTP. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace throw "invalid bet" with throw new Error("invalid bet") to preserve stack trace and satisfy instanceof Error checks in callers. [L115]
- **[correction · low · trivial]** Either wire the container-resolved rng into factory.buildReels() or remove the unused rng and reelsModule resolves; currently the registered weightedPick RNG is never invoked for reel generation. [L120]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
