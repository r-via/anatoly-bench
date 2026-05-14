# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | ACCEPTABLE | USED | UNIQUE | NONE | 80% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type alias with 0 imports — no external usage
- **Duplication [UNIQUE]**: Type alias. No similar types found in codebase.
- **Correction [OK]**: Type alias only; runtime constraints enforced in spin().
- **Overengineering [LEAN]**: Simple type alias matching the documented contract. 0 importers is a usage concern, not an overengineering concern.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Type alias for number with no description of valid range or semantics.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used at line 105 in computePayout to adjust payout calculation
- **Duplication [UNIQUE]**: House edge constant. No similar constants found.
- **Correction [OK]**: Value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named constant for a magic number. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout calculations but is never verified in tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Value 0.05 is self-evident as a percentage but its role in payout calculation is undescribed.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used at line 159 in spin for conditional debug logging
- **Duplication [UNIQUE]**: Debug flag constant. No similar constants found.
- **Correction [OK]**: Boolean flag, no correctness issue.
- **Overengineering [LEAN]**: Single boolean flag guarding a console.log. Straightforward.
- **Tests [NONE]**: No test file exists. Constant is always false; no tests exercise the debug branch.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc comment. Boolean flag with no description of what debug output it enables.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 as dependency injection container
- **Duplication [UNIQUE]**: Dependency injection container class. No similar classes found.
- **Correction [OK]**: resolve() silently returns undefined for missing keys via unchecked cast, but all keys resolved in spin() are registered at module init.
- **Overengineering [OVER]**: DIY service-locator/IoC container for three values that are already statically imported in the same file. The register/resolve indirection with `Map<string, unknown>` and unsafe generic casts adds ceremony with zero benefit over direct calls to weightedPick, getPayMultiplier, and the reels module. Two of the three resolved values (rng, reelsModule) are never actually used in spin(), making the container pointless for them entirely.
- **Tests [NONE]**: No test file exists. register/resolve behavior, missing-key edge cases, and generic typing are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or its methods. Purpose as a service locator/DI container and the semantics of register/resolve are undocumented.

#### `container` (L29–L29)

- **Utility [USED]**: Used for dependency registration (lines 30-32) and resolution (lines 120-122)
- **Duplication [UNIQUE]**: Global container instance. No similar variables found.
- **Correction [OK]**: All three keys registered correctly; usage defect is in spin().
- **Overengineering [LEAN]**: Straightforward instantiation and population of EngineContainer. The over-engineering lives in the class definition above.
- **Tests [NONE]**: No test file exists. Module-level singleton with registered dependencies is never tested in isolation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No comment explaining why this module-level singleton exists or what services it holds.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used in spin function to evaluate paylines at lines 133, 134, 149
- **Duplication [UNIQUE]**: Payline row mapping array. No similar constants found.
- **Correction [OK]**: All row indices 0–2 are valid for a 3-row reel grid.
- **Overengineering [LEAN]**: Static data table for 10 payline patterns. Appropriate representation for slot-machine paylines.
- **Tests [NONE]**: No test file exists. The 10 payline definitions drive all win evaluation but are never tested for correctness or completeness.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The structure (array of row-index arrays per reel column) and the meaning of each payline pattern are unexplained.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called at line 74 from evaluateLine to check symbol matches
- **Duplication [DUPLICATE]**: Identifies winning symbol sequences on payline. Matches lineWins in src/paytable.ts with score 0.834. Both implement identical logic: extract lead symbol handling wildcards, reject WILD/SCATTER, count consecutive matches, return if count >= 3.
- **Correction [OK]**: WILD substitution, SCATTER rejection, and minimum-run threshold all handled correctly.
- **Overengineering [LEAN]**: Focused single-responsibility function: resolves WILD substitution and counts the leading run. Length is justified by the logic, not by abstraction layers.
- **Tests [NONE]**: No test file exists. Critical logic for WILD substitution, SCATTER exclusion, run-length counting, and minimum-3-match threshold is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. WILD substitution logic, SCATTER exclusion, and the minimum run length of 3 are all undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — Identical semantic logic. Both functions validate symbol sequences with wildcard support and return matching symbol with count. Differs only in variable names (sym vs symbol, run vs count).

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called at line 134 from spin to evaluate each individual payline
- **Duplication [UNIQUE]**: Computes payline win with wild multiplier adjustments. No similar functions found.
- **Correction [OK]**: Wild multiplier formula is aggressive but not demonstrably incorrect without per-line wild-boost RTP documentation.
- **Overengineering [ACCEPTABLE]**: Injecting payFn as a higher-order parameter is a mild over-abstraction (getPayMultiplier could be called directly), but it keeps the function testable in isolation and is a single, shallow indirection. Wild-boost math is non-trivial but correct for the domain.
- **Tests [NONE]**: No test file exists. Wild-count exponential multiplier formula and payout calculation paths are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Parameters, wild-boost formula ((1 + wildCount) * 2^wildCount), and return semantics are undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called at line 138 from spin to compute total payout amount
- **Duplication [UNIQUE]**: Calculates total payout from wins with house edge adjustment. No similar functions found.
- **Correction [ERROR]**: Three independent defects inflate payouts instead of enforcing the documented 5% house edge.
- **Overengineering [LEAN]**: Simple reduce + arithmetic. No abstraction layers. (See doc_divergence for a semantic correctness issue with the house-edge formula.)
- **Tests [NONE]**: No test file exists. House-edge application (multiplies by 1.05 instead of reducing RTP), the always-added bet*0.01 floor, and Math.ceil rounding are all untested. Comment claims ~95% RTP but implementation adds edge on top of wins rather than reducing them.
- **PARTIAL [PARTIAL]**: JSDoc mentions house-edge application and ~95% RTP target but omits: the +1% flat bet bonus (bet * 0.01), the Math.ceil rounding, the meaning of the `bet` parameter (typed `any`), and the `lineWins` parameter structure. (deliberated: confirmed — Confirmed two correctness bugs. (1) src/engine.ts:105 — `total * (1 + HOUSE_EDGE)` multiplies by 1.05, increasing payout by 5%. The docstring at lines 98-100 states intent is 95% RTP, requiring `(1 - HOUSE_EDGE)`. House edge is inverted. (2) src/engine.ts:108 — `total += bet * 0.01` unconditionally adds 1% of bet on every spin including losses, guaranteeing a minimum payout that undermines the financial model. Additionally, `bet: any` at line 101 bypasses type safety despite the runtime check in `spin()` at line 114. These are real defects affecting monetary calculations.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on `bet` in both public exports. The file even defines `export type Bet = number` but never uses it in the function signatures that need it. [L101,L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as `number[][]` with no `readonly` modifier or `as const`, leaving the module-level array mutably accessible. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `throw "invalid bet"` triggers no-throw-literal (L115). (2) `rng` is resolved from the container but never called — factory.buildReels is used instead (L120). (3) `reelsModule` is resolved but never referenced (L122). [L115,L120,L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (primary public export) has no JSDoc. `Bet` type alias is also undocumented. Only `computePayout` is covered. [L12,L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` throws a string literal instead of an `Error` instance, losing the stack trace and breaking `instanceof Error` checks at call sites. [L115] |
| 15 | Testability | WARN | MEDIUM | `spin` instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` inline rather than accepting them via the container, so unit tests must use module mocking instead of injection. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` would benefit from `satisfies readonly number[][]` combined with `as const`. The container's `resolve<T>` pattern is a candidate for `const` type parameters. No `using` for emitter lifecycle management. |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine engine: `emitter.on(SPIN_DONE, () => {})` registers a no-op listener on every `spin()` call with no corresponding `off()` or `removeAllListeners()`. Each call leaks a listener on a freshly created emitter that is immediately discarded anyway — the pattern is both wasteful and pointless. Additionally `DEBUG_MODE = false` is a dead code path that cannot be toggled at runtime. [L175-L176] |

### Suggestions

- Use the exported `Bet` type instead of `any` in both public function signatures
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Remove unused container-resolved variables or wire them into the factory for testability
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  
  const factory = new StandardReelBuilderFactory();
  // rng and reelsModule never used
  // After
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  
  const factory = container.resolve<StandardReelBuilderFactory>("factory");
  // factory receives rng/reelsModule via constructor injection
  ```
- Remove the no-op listener or replace with a real handler; remove dead DEBUG_MODE branch
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or document the `bet * 0.01` addition; it inflates RTP above the 95% target on every spin. [L108]
- **[correction · medium · small]** Replace Math.ceil with Math.floor so the house retains fractional remainders per slot-game industry convention. [L110]
- **[correction · medium · small]** Throw when bet > 100 rather than warning; spin must be rejected to honour the documented 1..100 valid range. [L116]
- **[correction · medium · small]** Pass `rng` and `reelsModule` into the reel-generation path (or remove the dead container.resolve calls) so the registered weightedPick and reel definitions are actually used. [L120]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to reduce payouts by 5% as the documented house edge requires. [L106]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Throw `new Error("invalid bet")` instead of a string literal to preserve stack trace and allow instanceof checks. [L114]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
