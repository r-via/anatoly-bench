# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 80% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | NEEDS_FIX | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 70% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 72% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type with zero runtime and zero type-only importers. No external files reference this type.
- **Duplication [UNIQUE]**: Simple type alias with no semantic duplicates found
- **Correction [OK]**: Plain type alias — no logic, no correctness issues.
- **Overengineering [LEAN]**: Trivial type alias for number. Not complex; 0 importers is a dead-code concern, not an overengineering one.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: Public type export with no JSDoc. Name alone does not communicate valid range constraints (e.g., integer 1–100).

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Constant referenced in computePayout at line 107 to adjust payout calculations.
- **Duplication [UNIQUE]**: Module constant with no similar definitions found
- **Correction [OK]**: Value 0.05 is correct; defect is in how computePayout applies it, not in the constant itself.
- **Overengineering [LEAN]**: Single numeric constant, no abstraction.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout calculation but is never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant; name + value (0.05) are self-explanatory. No JSDoc, but internal use warrants leniency.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Constant referenced in spin at line 175 to gate debug logging.
- **Duplication [UNIQUE]**: Module constant with no similar definitions found
- **Correction [OK]**: Boolean flag used correctly in a guarded console.log.
- **Overengineering [LEAN]**: Simple boolean flag. Hardcoded false is a correctness smell, not overengineering.
- **Tests [NONE]**: No test file exists. Constant is always false, dead code branch untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private boolean flag; name is self-explanatory. No JSDoc, tolerated for internal constants.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Class instantiated at line 30 and used to manage dependency registration and resolution.
- **Duplication [UNIQUE]**: Simple service locator class with no semantic duplicates
- **Correction [NEEDS_FIX]**: resolve<T> silently returns undefined (cast to T) when a key is absent — type lie that crashes any caller using the resolved value.
- **Overengineering [OVER]**: Hand-rolled service-locator/IoC container (Map<string,unknown> + register/resolve) wrapping exactly three module-level imports that are already statically available. One instantiation, zero external consumers, type-unsafe resolve<T> cast. Equivalent to three direct function references; the abstraction adds no value and loses type safety.
- **Tests [NONE]**: No test file exists. register/resolve behavior, type-unsafe cast, and missing-key behavior are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported; no JSDoc on class or its methods. Purpose as a DI container is inferrable but register/resolve semantics are undocumented.

#### `container` (L29–L29)

- **Utility [USED]**: Module-level instance registered with rng, paytable, and reels; resolved at lines 128–130 in spin.
- **Duplication [UNIQUE]**: Single instance variable with no duplicates found
- **Correction [OK]**: Container is correctly instantiated; all three keys used in spin are registered before first resolution.
- **Overengineering [LEAN]**: Straightforward instantiation and population of EngineContainer. The over-engineering lives in the class definition; the consumer code here is trivial.
- **Tests [NONE]**: No test file exists. Module-level singleton with side effects at import time; never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Module-level singleton with no JSDoc. The three registrations below it are readable but the variable itself has no comment explaining its role.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Array referenced at line 140 to iterate paylines and at line 158 to extract line symbols.
- **Duplication [UNIQUE]**: Game configuration constant with no similar definitions
- **Correction [OK]**: Matches the canonical 10-payline definition in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md exactly.
- **Overengineering [LEAN]**: Exactly the 10-payline table mandated by .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. No excess abstraction.
- **Tests [NONE]**: No test file exists. Payline definitions drive all win evaluation; correctness never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: Not exported; no JSDoc explaining payline encoding (row-index per column), win direction, or minimum run requirement.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Function called by evaluateLine at line 73 to detect winning symbol runs.
- **Duplication [DUPLICATE]**: Identical algorithm to lineWins in paytable.ts: same symbol-matching logic with consecutive run detection. Only difference is field naming (sym/run vs symbol/count) in return object.
- **Correction [OK]**: WILD substitution logic, SCATTER guard, and left-to-right run count are all correct.
- **Overengineering [LEAN]**: Single-purpose helper: walks a symbol array, finds leading run, returns early. Linear and minimal.
- **Tests [NONE]**: No test file exists. WILD substitution logic, SCATTER short-circuit, run-length counting, and minimum-run threshold are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal helper, clear name, ~17 lines. No JSDoc on WILD/SCATTER exclusion logic or the returned run count semantics.

> **Duplicate of** `src/paytable.ts:lineWins` — 92% identical logic — both find winning symbol sequences by skipping WILDs, counting matches, and returning result only if count >= 3

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Function called by spin at line 141 to evaluate each payline and compute wins.
- **Duplication [UNIQUE]**: While RAG score 0.718 shows moderate similarity to computeLegacyPayout, the functions have different signatures (reels/payline/lineIndex/payFn vs lineSymbols/bet), different return types (LineWin vs number), and different responsibilities (building full line win object with wild multipliers vs computing simple payout). Different semantic contracts.
- **Correction [OK]**: Symbol extraction via payline mapping, checkLine delegation, and WILD multiplier application are correct.
- **Overengineering [LEAN]**: Focused payline evaluator. Wild-multiplier formula is domain logic required by the slot spec, not gratuitous complexity.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding (exponential formula) and payout arithmetic are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Internal function with 5 parameters and non-trivial wild-multiplier formula. No JSDoc on parameters, return value, or the compounding wild bonus calculation.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called by spin at line 144. Required for payout computation in the spin workflow.
- **Duplication [UNIQUE]**: No semantically similar functions found in codebase
- **Correction [ERROR]**: Two independent defects: house edge applied in wrong direction (player advantage, not house advantage), and an undocumented 1%-of-bet bonus credited on every spin including losses.
- **Overengineering [LEAN]**: Simple reduce + scalar adjustments + Math.ceil. One coherent computation step.
- **Tests [NONE]**: No test file exists. Exported function with a buggy HOUSE_EDGE application (increases rather than reduces payout), minimum bet bonus, and Math.ceil rounding — all untested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent but omits @param descriptions for both lineWins and bet (typed as any), and no @returns describing ceiling-rounding or the unconditional +1% bet addition. (deliberated: confirmed — Confirmed. src/engine.ts:105 applies `total * (1 + HOUSE_EDGE)` where HOUSE_EDGE=0.05 (line 14), yielding a 1.05x multiplier on wins — inflating payouts above 100% RTP. JSDoc at lines 97-100 documents target ~95% RTP, requiring `(1 - HOUSE_EDGE)`. Line 108 adds `bet * 0.01` unconditionally (even on losses), further inflating RTP. `bet: any` at line 101 bypasses type safety. Called at line 138 (not 144 as stated in finding). Critical financial bug in a slot engine.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Two exported public-API symbols carry explicit `any`: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. Both have a well-defined contract (`bet` is `Bet` = `number`) so there is no excuse for `any` here. [L87, L93] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is declared as `number[][]`, leaving the array and its sub-arrays mutable. Should be `readonly (readonly number[])[]` or `as const`. [L35-L47] |
| 8 | ESLint compliance | FAIL | HIGH | Three distinct violations: (1) `throw "invalid bet"` violates `no-throw-literal` — must throw an `Error` object. (2) `rng` and `reelsModule` are resolved from the container but never called — `no-unused-vars`. (3) `emitter.on(SPIN_DONE, () => {})` registers a no-op listener on every `spin()` invocation without ever removing it — both pointless and a growing listener leak. [L97, L101-L104, L156-L157] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (the primary public export) has no JSDoc. `Bet` type alias has no doc comment. `computePayout` has JSDoc but its `bet` parameter is undocumented. Internal Reference Documentation (.anatoly/docs/04-API-Reference/01-Public-API.md) defines the full contract, making omission of inline JSDoc more visible. [L93, L13] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` throws a bare string instead of `new Error("invalid bet")`, losing the stack trace and making type-narrowing in catch blocks (`err instanceof Error`) impossible for callers. [L97] |
| 13 | Security | WARN | CRITICAL | Slot-machine domain inferred from reel/payline/jackpot/scatter/freespin vocabulary and confirmed by .anatoly/docs/04-API-Reference/01-Public-API.md. `weightedPick` is imported from `./rng.js` and registered as the RNG, but `spin()` resolves it and then never calls it — the actual RNG is buried inside `factory.buildReels(5, 3)`. The certified-RNG injection path is completely bypassed; the real RNG in use is unverifiable from this file. Regulated gaming requires auditable, certifiable RNG paths. Rated WARN (not FAIL) because the RNG implementation lives in rng.js/factories.ts, not here. [L100-L110] |
| 14 | Performance | WARN | MEDIUM | `emitter.on(SPIN_DONE, () => {})` appends a new no-op listener on every `spin()` call. Over time this leaks listeners. The listener is never removed and serves no purpose. [L156] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are instantiated with `new` inside `spin()`. They cannot be swapped for test doubles without monkey-patching. The `EngineContainer` exists for DI but is bypassed for these three core dependencies. |
| 17 | Context-adapted rules | FAIL | MEDIUM | `computePayout` multiplies by `(1 + HOUSE_EDGE)` = 1.05, which increases the payout by 5%, giving players ~105% RTP rather than the documented 95% target (.anatoly/docs/04-API-Reference/01-Public-API.md). The correct adjustment is `total * (1 - HOUSE_EDGE)`. The named constant implies the house retains the edge; the code does the opposite. [L88-L91] |

### Suggestions

- Replace `any` with the proper `Bet` alias on both exported functions.
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object instead of a bare string so callers can use instanceof and get stack traces.
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Fix the house-edge direction in computePayout to achieve 95% RTP.
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Make PAYLINES deeply readonly to prevent accidental mutation.
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly (readonly number[])[] = [`
- Remove the no-op listener (or use it) and drop the unused container resolutions.
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<...>("reels");
  // ... (never called)
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  // Remove rng / reelsModule resolves until they are actually wired into buildReels.
  // Remove the no-op listener; emit only:
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Inject factory, strategy, and emitter so spin() can be unit-tested without side effects.
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
    const factory = new StandardReelBuilderFactory();
    const strategy = new DefaultStrategy();
    const emitter = new SpinEventEmitter();
  // After
  export function spin(
    bet: Bet,
    factory: ReelBuilderFactory = new StandardReelBuilderFactory(),
    strategy: Strategy = new DefaultStrategy(),
    emitter: SpinEventEmitter = new SpinEventEmitter(),
  ): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or document the `total += bet * 0.01` expression; it unconditionally inflates every payout (including losses) with no basis in the spec. [L109]
- **[correction · medium · small]** In spin, either pass the container-registered RNG to StandardReelBuilderFactory or remove the unused rng and reelsModule resolutions to avoid silently bypassing DI configuration. [L118]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** In computePayout L106, change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` to correctly deduct 5% and achieve the documented 95% RTP. [L106]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** In EngineContainer.resolve, throw an error (or return an Option type) when the requested key is absent instead of returning undefined cast to T. [L23]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
