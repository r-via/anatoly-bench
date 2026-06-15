# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | - | LOW_VALUE | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 85% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | OK | LEAN | USED | UNIQUE | NONE | 95% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar type alias found in RAG results.
- **Correction [OK]**: Type alias only; no logic to evaluate.
- **Overengineering [LEAN]**: Single-line type alias. Adds readability at zero cost.
- **Tests [NONE]**: No test file exists. Type alias with no runtime behavior, but its constraints (used in spin validation) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Exported public type alias with no description of valid range, units, or relationship to lineBet.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 106: `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Value 0.05 is correct for a 5% house edge; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named constant for a magic number. Appropriate.
- **Tests [NONE]**: No test file exists. Constant affects computePayout output but is never verified against expected RTP behavior.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported internal constant; value is not obvious from name alone (0.05 = 5% edge applied inverted as a bonus rather than a deduction).

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded false; the guarded console.log block in spin never executes. Dead debug flag with no runtime effect.
- **Duplication [UNIQUE]**: No similar constant found in RAG results.
- **Correction [OK]**: Constant is fine; conditional guard in spin is correct.
- **Overengineering [LEAN]**: Hardcoded false guards a single log statement. Trivial, not over-engineered.
- **Tests [NONE]**: No test file exists.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported boolean flag; name is self-descriptive and value is trivially false, so low severity.

#### `EngineContainer` (L17–L27)

- **Utility [LOW_VALUE]**: Trivial wrapper over Map<string, unknown> with register/resolve. Adds no behavior beyond a plain Map; the container it instantiates also resolves a reelsModule that is never called.
- **Duplication [UNIQUE]**: No similar registry/DI container class found in RAG results.
- **Correction [OK]**: Simple registry; resolve silently returns undefined for missing keys but no in-tree caller passes an unregistered key.
- **Overengineering [OVER]**: Mini IoC container for three static module-level imports that never vary at runtime. `weightedPick`, `getPayMultiplier`, and the reels module are direct imports — wrapping them in a string-keyed registry with type-unsafe `as T` casts adds indirection with no benefit. Direct references would be cleaner, safer, and equally readable.
- **Tests [NONE]**: No test file exists. register/resolve semantics (including type-unsafe cast on resolve) are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or its methods. Acts as a simple IoC/service-locator container; purpose and usage pattern are non-obvious without documentation.

#### `container` (L29–L29)

- **Utility [USED]**: resolve() called three times inside spin to obtain rng, paytable, and reelsModule.
- **Duplication [UNIQUE]**: Module-level singleton instance; no similar variable found in RAG results.
- **Correction [OK]**: Registers three keys; all are resolved in spin. Unused rng/reelsModule resolvees are a utility concern, not a correctness defect.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Module-level singleton instance with non-trivial registration side-effects on lines 30–32.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin's line-evaluation loop and indexed again for wildMultiplier calculation.
- **Duplication [UNIQUE]**: No similar payline definition array found in RAG results.
- **Correction [OK]**: Matches reference documentation exactly.
- **Overengineering [LEAN]**: Fixed 10-entry lookup table matching the documented payline definitions. No abstraction, appropriate representation.
- **Tests [NONE]**: No test file exists. Payline definitions drive all win evaluation; correctness of each pattern is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The encoding convention (row-index per column, 0=top/2=bottom) and shape semantics (zigzag, V-shape, etc.) are not explained.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 72.
- **Duplication [DUPLICATE]**: Logic is functionally identical to `lineWins` in src/paytable.ts: same WILD-skip-to-first logic, same SCATTER guard, same counting loop with WILD substitution, same >= 3 threshold. Only differences are local variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count).
- **Correction [OK]**: WILD substitution, SCATTER exclusion, and consecutive-run counting are all correct.
- **Overengineering [LEAN]**: Single-responsibility helper: resolves WILD lead, counts consecutive matching symbols. Length is justified by the WILD substitution edge case.
- **Tests [NONE]**: No test file exists. Critical logic covering WILD leading, SCATTER short-circuit, run counting, and minimum run of 3 is entirely untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported but 18 lines with non-trivial WILD substitution logic and early-exit for SCATTER; behavior warrants at least param/return documentation.

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve lead symbol skipping WILDs, count consecutive matches, return null for SCATTER or runs < 3; differ only in variable/property naming

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called inside spin's PAYLINES loop at line 130.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [OK]**: Symbol extraction (payline[col] → reels[col][row]) and wild-bonus accumulation are internally consistent with no contradicting contract.
- **Overengineering [LEAN]**: Computes payout for one payline including wild-count bonus. Complexity is proportional to the domain rules it encodes.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding (basePayout * (1 + wildCount) * 2^wildCount) is a complex, bug-prone formula with zero test coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-exported but 30 lines with a compounding wild-multiplier formula `(1+wc) * 2^wc` that is not self-evident from naming alone.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in spin at line 133; transitively reaches src/index.ts via spin.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [NEEDS_FIX]**: Two independent defects: house-edge sign inverts the intended reduction, and Math.ceil violates slot-domain rounding convention.
- **Overengineering [LEAN]**: Simple reduce plus two adjustments. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Exported public API; applies house edge incorrectly (adds edge rather than reducing it) and unconditionally adds bet*0.01 — critical business logic bugs with no tests to catch them.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and mentions house edge, but omits @param for both parameters (including bet typed as `any`), no @returns, and the unconditional floor `bet * 0.01` is undocumented.

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar function found in RAG results.
- **Correction [NEEDS_FIX]**: Bet upper-bound is not enforced: bets > 100 only emit a warning, violating the arbitrated contract 'type Bet = number; // 1..100 coins, integer'.
- **Overengineering [LEAN]**: Own logic is a straightforward payline loop, scatter/jackpot checks, and result assembly. Instantiates over-engineered abstractions from other files (factory, strategy, emitter), but per evaluation rules those are flagged at their definition sites, not here.
- **Tests [NONE]**: No test file exists. Primary exported entry point imported by src/index.ts. Bet validation, reel evaluation, scatter/free-spin integration, jackpot detection, and wildMultiplier aggregation are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the primary exported public API. Missing documentation for the bet parameter constraints, all fields of the returned SpinResult, thrown error string, and side-effects (event emission, free-spin state mutation). (deliberated: reclassified: correction: NEEDS_FIX → OK — Claim says 'bets > 10' but no 10-unit maximum exists anywhere in the code. The only upper-bound check is engine.ts:118 `if (bet > 100) console.warn("bet exceeds maximum")` — deliberate soft enforcement via warning, not an accidentally missing guard. The number 10 appears only as PAYLINES.length and the `lineBet = bet / 10` divisor (engine.ts:130), neither of which constitute a max bet. Lower bound IS enforced via throw at engine.ts:114. No crash, no data corruption, no wrong output results from bet > 100.)

## Best Practices — 5.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both public function signatures: `computePayout(lineWins: LineWin[], bet: any)` (L101) and `spin(bet: any)` (L113). The `Bet` type alias is already defined in this file — there is no justification for `any` here. [L101, L113] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is declared as `number[][]` but never mutated; should be `as const` or `readonly (readonly number[])[]`. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three distinct lint violations: (1) `throw "invalid bet"` (L115) violates `no-throw-literal`; (2) both `bet: any` parameters (L101, L113) trigger `@typescript-eslint/no-explicit-any`; (3) `rng` (L120) and `reelsModule` (L122) are resolved from the container but never consumed, triggering `no-unused-vars`. [L115, L101, L113, L120, L122] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (L113) and the `Bet` type alias (L12) are exported without JSDoc. `computePayout` has JSDoc. [L12, L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L115) throws a string primitive: breaks `instanceof Error` guards in callers and suppresses stack-trace capture. No async paths or unhandled rejections present. [L115] |
| 15 | Testability | WARN | MEDIUM | `spin()` hard-constructs `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` (L124–L126) bypassing the `EngineContainer` DI pattern already present. Unit testing requires module-level monkey-patching rather than injection. [L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` would benefit from `as const satisfies readonly (readonly number[])[]` for narrowed literal types. The `result` object at L163 could use `satisfies SpinResult` for in-place shape validation without widening. [L34, L163] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino/regulated-gaming domain. `computePayout` applies `total * (1 + HOUSE_EDGE)` = ×1.05 (L105), boosting payouts by 5% instead of reducing them. A 5% house edge targeting 95% RTP requires `total * (1 - HOUSE_EDGE)` = ×0.95. This inverts the RTP guarantee confirmed in the arbitrated README invariant and contradicts the function's own JSDoc. This is a correctness bug on the best-practices axis per the arbitrated-intents contract. [L105] |

### Suggestions

- Replace `any` with the `Bet` alias already defined in this file
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix house-edge direction: multiply by (1 − HOUSE_EDGE) to produce 95% RTP, not 105%
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error instance to preserve stack traces and support instanceof checks
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ... rows ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Remove unused DI resolutions or wire factory/strategy/emitter through the container
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  // rng never called below
  const reelsModule = container.resolve<...>("reels");
  // reelsModule never called below
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  // After
  container.register("factory", new StandardReelBuilderFactory());
  container.register("strategy", new DefaultStrategy());
  container.register("emitter", new SpinEventEmitter());
  // then in spin():
  const factory = container.resolve<StandardReelBuilderFactory>("factory");
  const strategy = container.resolve<DefaultStrategy>("strategy");
  const emitter = container.resolve<SpinEventEmitter>("emitter");
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** In computePayout L110, replace Math.ceil with Math.floor to round slot payouts down per slot-machine industry convention (house retains fractional remainder). [L110]
- **[correction · medium · small]** In spin, add `|| bet > 100` to the existing throw guard (L114) and remove the console.warn at L118 to enforce the full 1..100 integer contract from the arbitrated intent. [L114]

### Refactors

- **[correction · high · large]** In computePayout L105, change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so wins are reduced by 5% (house edge) rather than inflated, restoring the documented 95% RTP target. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[utility · low · trivial]** Consider removing low-value code: `EngineContainer` (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
