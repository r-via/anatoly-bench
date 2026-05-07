# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 75% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 80% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 90% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 97% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type with 0 runtime importers and 0 type-only importers
- **Duplication [UNIQUE]**: Type alias definition; no semantic logic to duplicate
- **Correction [OK]**: Type alias for number; no correctness issues.
- **Overengineering [LEAN]**: Trivial type alias for number. Zero importers and `spin` uses `bet: any` instead, so it is unused — but a one-line alias is the simplest possible abstraction.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **PARTIAL [PARTIAL]**: No JSDoc. Name conveys intent but valid range (integer 1–100) and unit are not documented.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used internally in computePayout at line 105
- **Duplication [UNIQUE]**: Constant value; no logic to duplicate
- **Correction [OK]**: Value 0.05 is correct for a 5% house edge; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named constant for a magic number. Minimal and correct.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout calculations but is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The value 0.05 and its role in payout inflation (applied on top of wins, not as a deduction) are not explained.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used internally in spin function at line 167
- **Duplication [UNIQUE]**: Constant value; no logic to duplicate
- **Correction [OK]**: Boolean flag, no correctness issues.
- **Overengineering [LEAN]**: Simple boolean flag guarding a single console.log.
- **Tests [NONE]**: No test file exists. Constant is always false so its branch (console.log) is dead and untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private flag with a self-descriptive name, but no comment on what debug output it enables.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to create container instance
- **Duplication [UNIQUE]**: Class with register/resolve methods; no similar implementations found
- **Correction [OK]**: resolve() silently returns undefined cast to T on missing keys, but all three registered keys are resolved in spin with no missing registrations.
- **Overengineering [OVER]**: A hand-rolled service-locator with `register`/`resolve` used exclusively in this one file to wrap three direct module imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). Adds a `Map<string, unknown>` + type-cast indirection with zero benefit over `import` statements. Additionally, two of the three resolved values (`rng`, `reelsModule`) are resolved in `spin` but never actually called, revealing the container provides no real wiring value.
- **Tests [NONE]**: No test file exists. register/resolve behavior, unknown-key resolution, and type-cast safety are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or either method. Purpose as a DI registry and the string-key convention are undocumented.

#### `container` (L29–L29)

- **Utility [USED]**: Used throughout spin: registered with values at lines 30-32, resolved at lines 123-125
- **Duplication [UNIQUE]**: Module-level variable instance; no logic to duplicate
- **Correction [OK]**: All three registrations are present and typed correctly.
- **Overengineering [LEAN]**: Module-level singleton instantiation of `EngineContainer`. The overengineering lives in the class definition above; the variable itself is a straightforward constant.
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton with no explanation of its role or registered keys.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used in spin function: length checked at line 129, indexed at lines 130 and 153
- **Duplication [UNIQUE]**: Static array constant; no similar patterns found
- **Correction [OK]**: Ten 5-element paylines with row indices 0–2, correct for a 5×3 reel grid.
- **Overengineering [LEAN]**: Ten payline patterns as a plain 2-D array. Appropriate data structure for a fixed slot-machine grid.
- **Tests [NONE]**: No test file exists. Payline definitions drive all win evaluation; correctness is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The encoding (each sub-array is a row index per reel column) and the number of supported paylines are not explained.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine function at line 73
- **Duplication [DUPLICATE]**: RAG score 0.838 confirms duplication; 95%+ identical logic with lineWins. Both count consecutive matching symbols/WILDs from start with threshold >= 3, differ only in variable naming (lead/run vs first/count vs symbol).
- **Correction [OK]**: Lead-symbol resolution under WILD/SCATTER, run counting, and 3-symbol minimum are all correct per docs.
- **Overengineering [LEAN]**: Single-responsibility: resolves the lead symbol with WILD substitution and counts the consecutive run. Documented behavior in `.anatoly/docs/02-Architecture/02-Core-Concepts.md`.
- **Tests [NONE]**: No test file exists. Critical logic (WILD substitution, SCATTER early-return, run-length threshold of 3) is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private helper, but the WILD substitution logic and minimum run length (3) are non-obvious and undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical logic — both detect consecutive matching symbols or WILDs, reject WILD/SCATTER leads, and return symbol with count when >= 3

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called by spin function at line 130 to evaluate each payline
- **Duplication [UNIQUE]**: No similar functions found; applies line win detection to payline with payout calculation and wild multiplier computation
- **Correction [OK]**: Wild-boost formula `basePayout × (1 + wildCount) × 2^wildCount` matches the documented formula and the table in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md.
- **Overengineering [LEAN]**: Applies `checkLine`, computes base payout, applies the documented wild-multiplier formula (`basePayout × (1+wildCount) × 2^wildCount`) from `.anatoly/docs/04-API-Reference/02-Configuration-Schema.md`. Logic is cohesive and matches spec.
- **Tests [NONE]**: No test file exists. Wild-count bonus multiplier (exponential) and payout calculation paths are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private but complex: wild-multiplier formula, parameter roles (payFn, lineBet, lineIndex), and return semantics are all undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called internally by spin function at line 136
- **Duplication [UNIQUE]**: No similar functions found; sums line wins, applies house edge, adds bet percentage, and rounds result
- **Correction [ERROR]**: Three independent defects: wrong-sign house edge (inflates payout 5% instead of deducting it), undocumented bet×0.01 addend on every spin, and Math.ceil rounding against house.
- **Overengineering [LEAN]**: Short aggregation function: sum line wins, apply house-edge scalar, add flat bet bonus, ceil. Not complex; correctness issues (edge direction, `bet: any`) are bugs, not abstraction problems.
- **Tests [NONE]**: No test file exists. House-edge application, zero-win flat bonus, and Math.ceil rounding are untested despite being exported.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and RTP rationale but omits @param descriptions, does not document the guaranteed minimum payout (bet × 0.01), and the return type is not annotated in the comment. (deliberated: confirmed — Confirmed bug. engine.ts:105 multiplies by (1 + HOUSE_EDGE) = 1.05, increasing payout by 5%. Docstring at engine.ts:99 states 'target RTP of approximately 95%', and paytable.ts:3 exports ANCIENT_RTP = 0.95 confirming intent. Correct formula should be (1 - HOUSE_EDGE) = 0.95. Paytable multipliers (paytable.ts:5-12) are raw values with no pre-baked house edge. Additionally, engine.ts:108 adds bet*0.01 on every spin (including losses), further inflating RTP. The house edge is applied in the wrong direction — this is a financial logic bug causing player overpayment.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on two exported public-API parameters: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The file already exports `type Bet = number` — both params should use it. [L96-L107] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is a module-level constant but typed `number[][]`, leaving it mutable. Should be `readonly (readonly number[])[]` or declared with `as const`. [L35-L46] |
| 8 | ESLint compliance | FAIL | HIGH | Four violations: (1) `throw "invalid bet"` violates no-throw-literal; (2) `console.warn(...)` violates no-console; (3) `console.log(...)` inside DEBUG_MODE block violates no-console; (4) no-op `emitter.on(SPIN_DONE, () => {})` immediately before emit is dead code and violates no-empty-function. [L108-L171] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is the primary public export with no JSDoc. `computePayout` has JSDoc. `Bet` type alias is undocumented. [L107] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` throws a string literal — callers cannot use `instanceof Error`, and no stack trace is captured. No async code present, so no unhandled-rejection risk. [L108] |
| 15 | Testability | WARN | MEDIUM | The DI container exists but `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are hard-instantiated inside `spin()` rather than resolved from the container, preventing test substitution. `container` is also a module-level singleton. [L115-L119] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` would strengthen container.register call-site types. `PAYLINES` could use `as const`. No `using` keyword for emitter lifecycle management. [L29-L32] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino/slot-machine domain. `computePayout` applies `total * (1 + HOUSE_EDGE)` = `total * 1.05`, which INCREASES the payout by 5% — the opposite of a house edge. The JSDoc states 'maintain a target RTP of approximately 95%' but the formula pushes RTP above 100%. Correct formula for 95% RTP: `total * (1 - HOUSE_EDGE)`. Additionally, `total += bet * 0.01` adds a guaranteed 1%-of-bet payout on zero-win spins, further distorting the declared RTP. In regulated gaming, incorrect RTP computation is a compliance violation. (.anatoly/docs/04-API-Reference/02-Configuration-Schema.md confirms HOUSE_EDGE is applied inside this function.) [L97-L102] |

### Suggestions

- Replace explicit `any` with the already-exported `Bet` type on both public functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix HOUSE_EDGE direction — current code multiplies by 1.05 (increases payout); 95% RTP requires multiplying by 0.95
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object instead of a string literal for proper stack traces and instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES deeply readonly to prevent accidental mutation
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ... same values
  ] as const satisfies ReadonlyArray<readonly number[]>;
  ```
- Register and resolve factory/strategy/emitter through the DI container for testability
  ```typescript
  // Before
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  // After
  const factory = container.resolve<StandardReelBuilderFactory>("factory");
  const strategy = container.resolve<DefaultStrategy>("strategy");
  const emitter = container.resolve<SpinEventEmitter>("emitter");
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `Math.ceil` with `Math.floor` to round payouts down, preserving house edge per slot-machine industry convention. [L110]
- **[correction · medium · small]** Pass the container-resolved `rng` function to `StandardReelBuilderFactory` (or confirm the factory already imports `weightedPick` directly), then remove the unused `rng` and `reelsModule` resolutions if injection is handled internally. [L120]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to correctly deduct the 5% house edge and target RTP ≈ 95%. [L105]
- **[correction · high · large]** Remove or document `total += bet * 0.01`; it unconditionally inflates all payouts (including zero-win spins) and is absent from the documented RTP formula. [L108]
- **[utility · medium · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to capture a stack trace and support `instanceof Error` checks. [L115]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
