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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 70% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 70% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar type alias found in RAG results.
- **Correction [OK]**: Type alias for number; range enforcement is correctly deferred to spin().
- **Overengineering [LEAN]**: Single-line alias for number; adds semantic clarity at zero cost.
- **Tests [NONE]**: No test file exists. Type alias with no runtime behavior, but its constraints (used as bet validation input in spin) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported type alias carries implicit semantics (valid range 1–100, integer-only) that are enforced in spin() but invisible at the type declaration.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced at L105 inside computePayout to scale the total payout.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Value 0.05 correctly represents the 5% house edge; the misapplication belongs to computePayout.
- **Overengineering [LEAN]**: Named magic-number constant; minimal and appropriate.
- **Tests [NONE]**: No test file. HOUSE_EDGE=0.05 is applied in computePayout but the effect (inflating wins by 5%) is never verified.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private module constant; its purpose is mentioned only inside computePayout's JSDoc, not at the declaration site.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded false; the guarded branch at L162 can never execute. Functions as a permanent dead-code gate with no runtime effect.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Constant is false; guarded console.log never executes. No correctness issue.
- **Overengineering [LEAN]**: Simple boolean flag. The dead-code path it guards is a code-quality issue, not an abstraction problem.
- **Tests [NONE]**: No test file. Constant is always false; no test verifies the conditional logging branch.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private flag with self-explanatory name; low documentation concern but still bare.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to create the module-level container.
- **Duplication [UNIQUE]**: No similar class found in RAG results.
- **Correction [OK]**: resolve returns undefined-cast-to-T for missing keys, but all three registered keys are consumed correctly in-file.
- **Overengineering [OVER]**: Hand-rolled IoC/DI container (Map-backed register/resolve) for three items that are already directly imported at the top of the same file. Two of the three resolved values (`rng`, `reelsModule`) are never actually used in `spin` — the factory bypasses `reelsModule` entirely. Zero configurability benefit in a single-file scope; direct references would be simpler and type-safe without casting.
- **Tests [NONE]**: No test file. register/resolve round-trip, missing-key behavior, and type-cast safety are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class, register(), or resolve(). Internal DI container; purpose and lifetime are non-obvious without docs.

#### `container` (L29–L29)

- **Utility [USED]**: Registered with rng/paytable/reels at L30-32; resolved inside spin at L122-124. paytable resolution is actively used in evaluateLine.
- **Duplication [UNIQUE]**: No similar variable found in RAG results.
- **Correction [OK]**: Container registered with three keys; no correctness issue.
- **Overengineering [LEAN]**: Straightforward instantiation and population of EngineContainer; the abstraction source is flagged on the class itself.
- **Tests [NONE]**: No test file. Module-level singleton wiring of rng, paytable, and reels is never exercised in isolation.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton with non-obvious role as the DI registry for the engine.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin at L137 and indexed at L138 and L165.
- **Duplication [UNIQUE]**: No similar data constant found in RAG results.
- **Correction [OK]**: All ten payline definitions match the reference documentation exactly.
- **Overengineering [LEAN]**: Static data table for 10 fixed paylines; exactly the right representation.
- **Tests [NONE]**: No test file. The 10 payline definitions (shape, row indices, boundary values) are never validated.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The row-index encoding of each payline path is non-trivial; without comments each array entry is opaque.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at L72.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts — same WILD lead resolution, same WILD/SCATTER guard, same consecutive-run counting loop, same >= 3 threshold. Only differences are variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count). Functions are interchangeable.
- **Correction [OK]**: WILD substitution for lead, SCATTER/all-WILD early exit, and run counting from position 0 are all correct.
- **Overengineering [LEAN]**: Focused helper: resolves lead symbol through WILDs, counts consecutive run, returns early on non-starters. Logic is proportional to the task.
- **Tests [NONE]**: No test file. Critical logic paths untested: leading WILD resolution, SCATTER short-circuit, run < 3 rejection, mixed WILD+symbol runs.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper (not exported) but 17 lines with non-obvious WILD/SCATTER early-exit logic. Tolerated but worth documenting.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve WILD lead, guard SCATTER, count consecutive matching symbols, return null below 3; differ only in local variable and return property names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called inside the spin payline loop at L138.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [OK]**: Column-major symbol extraction, checkLine delegation, and wild-boost application are internally consistent. No documented contract for the wild-multiplier formula exists, so its value is not flagged.
- **Overengineering [LEAN]**: Single responsibility: map payline to symbols, delegate to checkLine, apply wild-boost multiplier. Length is justified by the formula complexity.
- **Tests [NONE]**: No test file. Wild multiplier formula (basePayout * (1+wc) * 2^wc) and null-passthrough from checkLine are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper (not exported) but 29 lines; wild-count bonus formula is non-obvious and undescribed.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called at L142 inside spin, which is runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [NEEDS_FIX]**: House edge applied in the wrong direction, and payout rounded up instead of down.
- **Overengineering [LEAN]**: Simple reduce + two adjustments; no unnecessary abstraction.
- **Tests [NONE]**: No test file. Exported and business-critical: house-edge inflation on wins, the flat 1% bet bonus on every spin, and Math.ceil rounding are all untested. The house-edge comment claims ~95% RTP but the formula actually increases payouts, contradicting the stated intent.
- **PARTIAL [PARTIAL]**: Has a JSDoc block describing purpose and house-edge intent, but missing @param descriptions for lineWins and bet (typed any), missing @returns, and does not document the unconditional bet*0.01 floor added to every payout.

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar functions found in RAG results.
- **Correction [NEEDS_FIX]**: Non-Error throw and missing upper-bound rejection both violate the arbitrated bet contract.
- **Overengineering [LEAN]**: The function's own logic is straightforward: validate, build grid, evaluate paylines, aggregate results, return. Overengineering lives in the abstractions it consumes (StandardReelBuilderFactory, DefaultStrategy, SpinEventEmitter — defined in their own files) and in EngineContainer (flagged separately). Per-consumer rule: spin is not the source of those patterns.
- **Tests [NONE]**: No test file. Primary exported entry point imported by src/index.ts. Input validation (non-number, float, <1, >100), reel evaluation, scatter/free-spin wiring, jackpot flag, wildMultiplier accumulation, and strategy.adjustPayout delegation are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc at the function declaration. Primary exported public API; parameter constraints, thrown error form, and SpinResult fields are undocumented inline. (deliberated: confirmed — Both issues confirmed. (1) src/engine.ts:115 — `throw "invalid bet"` throws a string literal instead of an Error object, breaking stack traces and `instanceof Error` checks in callers. (2) src/engine.ts:118 — `if (bet > 100) console.warn("bet exceeds maximum")` warns but does not reject. The validation block at L114 enforces `bet >= 1` and `Number.isInteger(bet)` but has no upper bound, meaning arbitrarily large bets are processed. In a slot engine this is a genuine financial-risk defect.)

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Both exported functions carry explicit `any` on the `bet` parameter: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). A runtime guard exists but the type should be `number` (or `Bet`) so the compiler enforces the contract statically. The public API surface is unnecessarily widened. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed `number[][]` with no `readonly` modifier. As a module-level lookup constant it should be `readonly number[][]` (or `as const`) to prevent accidental element mutation. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `throw "invalid bet"` (L115) is a string literal — violates `no-throw-literal`; must be `throw new Error(...)`. (2) `rng` (L120) is resolved from the container but never called anywhere in `spin()` — `no-unused-vars`. (3) `reelsModule` (L122) is likewise resolved and never used — `no-unused-vars`. [L115, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` is exported without JSDoc. `computePayout` has JSDoc. `Bet` type alias is undocumented. At minimum `spin` needs a JSDoc block describing parameters, return value, and the throw condition. [L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L115) throws a string. Callers catching with `(e: Error) => e.message` receive `undefined`. No async paths, so no promise-rejection risk. Fix: `throw new Error('invalid bet: must be integer in [1, 100]')`. [L115] |
| 13 | Security | WARN | HIGH | Slot-machine domain confirmed by reel/payline/scatter/jackpot/wild vocabulary throughout. The injected `rng` (L120) is resolved from the container but never passed to `factory.buildReels(5, 3)` (L128). Actual randomness is opaque inside `StandardReelBuilderFactory`. If that factory uses `Math.random()`, the engine is not certifiable for regulated gaming RNG audits — and the container injection that was presumably intended to allow a CSPRNG is silently bypassed. Severity would escalate to CRITICAL if `factory.ts` is confirmed to use `Math.random()`. [L120, L128] |
| 15 | Testability | WARN | MEDIUM | `factory` (L124), `strategy` (L125), and `emitter` (L126) are hardcoded `new` instantiations inside `spin()`, bypassing the container that already exists. Tests cannot substitute fakes for these without module-level monkey-patching. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `as const satisfies readonly number[][]` to gain both literal-type narrowing and immutability. No use of `satisfies`, const-typed generics, or `using` anywhere in the file. [L34] |
| 17 | Context-adapted rules | FAIL | HIGH | Casino/slot-machine domain. Two arbitrated-intent violations: (1) House-edge math is inverted — `total * (1 + HOUSE_EDGE)` (L105) multiplies wins by 1.05, yielding ~105% RTP. The contract requires 95% RTP; the correct factor is `(1 - HOUSE_EDGE)` = 0.95. (2) `if (bet > 100) console.warn(...)` (L118) only emits a warning; the arbitrated contract `Bet = number // 1..100 coins` requires the engine to reject out-of-range bets with a throw, matching the guard already in place for `bet < 1`. [L105, L118] |

### Suggestions

- Replace `any` with `number`/`Bet` on both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: number): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix inverted house-edge math to achieve 95% RTP
  ```typescript
  // Before
  if (total > 0) {
    total = total * (1 + HOUSE_EDGE); // yields 105% RTP
  }
  // After
  if (total > 0) {
    total = total * (1 - HOUSE_EDGE); // yields 95% RTP
  }
  ```
- Reject bets outside [1,100] and throw a proper Error
  ```typescript
  // Before
  if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
    throw "invalid bet";
  }
  if (bet > 100) console.warn("bet exceeds maximum");
  // After
  if (typeof bet !== "number" || bet < 1 || bet > 100 || !Number.isInteger(bet)) {
    throw new Error(`Invalid bet: ${bet}. Must be an integer in [1, 100].`);
  }
  ```
- Pass the injected RNG into the factory so the container actually controls randomness
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  // ...
  const reels = factory.buildReels(5, 3); // rng ignored
  // After
  const rng = container.resolve<typeof weightedPick>("rng");
  // ...
  const reels = factory.buildReels(5, 3, rng); // factory uses injected rng
  ```
- Add readonly to PAYLINES and use satisfies for literal-type narrowing
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...entries...
  ] as const satisfies readonly number[][];
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor; slot-machine payouts must round down so the house retains the fractional remainder. [L110]
- **[correction · medium · small]** Add `|| bet > 100` to the existing throw condition (or throw separately after the warn) to reject bets outside the arbitrated 1..100 range. [L118]

### Refactors

- **[correction · high · large]** Replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` so the house edge reduces payouts to the documented 95% RTP target. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace `throw "invalid bet"` with `throw new Error("invalid bet")` to propagate a proper Error with stack trace and instanceof support. [L115]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
