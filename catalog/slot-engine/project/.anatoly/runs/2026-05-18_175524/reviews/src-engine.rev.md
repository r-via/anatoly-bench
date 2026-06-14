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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 75% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 80% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 85% |
| spin | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

- **Utility [DEAD]**: Exported type with 0 importers across the codebase
- **Duplication [UNIQUE]**: Simple type alias for primitive number. No similar types found.
- **Correction [OK]**: Type alias only; correctness constraints (1..100, integer) are enforced in spin().
- **Overengineering [LEAN]**: Trivial type alias for number. Zero importers, but type aliases carry no structural overhead.
- **Tests [GOOD]**: Type alias with no runtime behavior; no tests needed.
- **UNDOCUMENTED [UNDOCUMENTED]**: Exported type alias with no JSDoc. Purpose and valid range (e.g. integer ≥ 1, ≤ 100) are not described.

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used in computePayout (line 107) to apply house edge multiplier
- **Duplication [UNIQUE]**: Numeric constant for house edge calculation. No duplicates found.
- **Correction [OK]**: Value 0.05 is correct; the defect is in the formula that uses it.
- **Overengineering [LEAN]**: Named constant for a single magic number. Minimal and appropriate.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout math but is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported module constant; name is self-explanatory. Lenient for internal constants.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Used in spin function (lines 176-178) to conditionally log debug output
- **Duplication [UNIQUE]**: Boolean constant for debug flag. No duplicates found.
- **Correction [OK]**: Simple boolean guard with no correctness impact.
- **Overengineering [LEAN]**: Simple boolean flag. Hardcoded false is inert but harmless.
- **Tests [NONE]**: No test file exists. Constant is never tested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported boolean flag; self-explanatory. Lenient for internal constants.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 and used throughout spin to manage dependency injection
- **Duplication [UNIQUE]**: Service locator pattern class with generic register/resolve methods. No duplicates found.
- **Correction [OK]**: resolve() silently returns undefined for unknown keys, but all three registered keys are resolved before use in spin().
- **Overengineering [OVER]**: Full registry/IoC container (Map, generic resolve<T>) for three static module-level imports. All three could be imported and called directly with no indirection. Two of the three resolutions (rng, reelsModule) go unused after being resolved in spin(), making the container even less justified. The pattern implies runtime swappability that the codebase never exercises.
- **Tests [NONE]**: No test file exists. register/resolve behavior, type-unsafe cast, and missing-key handling are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported internal class with no JSDoc. Its role as a service-locator/DI container is not described.

#### `container` (L29–L29)

- **Utility [USED]**: Used to register and resolve RNG, paytable, and reels dependencies in spin
- **Duplication [UNIQUE]**: Instance variable of EngineContainer. No duplicates found.
- **Correction [OK]**: All keys registered at module load before any consumer calls spin().
- **Overengineering [LEAN]**: Module-level instantiation of EngineContainer. The over-engineering lives in the class definition; this is just a straightforward usage.
- **Tests [NONE]**: No test file exists. Module-level singleton wiring is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported module-level singleton; intent is inferrable from usage but not documented.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used to iterate paylines (line 128) and extract line symbols (lines 129, 159)
- **Duplication [UNIQUE]**: Specific payline configuration array for slot game. No duplicates found.
- **Correction [OK]**: All 10 patterns match the documented payline table exactly.
- **Overengineering [LEAN]**: Plain data array of 10 payline row-index sequences. Exactly the right representation for fixed payline geometry.
- **Tests [NONE]**: No test file exists. Payline definitions drive all win detection but have no coverage.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported constant encoding 10 payline row-index sequences. No comment explains the layout convention or how indices map to reel rows.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine (line 76) to detect matching symbol runs
- **Duplication [DUPLICATE]**: Extracts leading non-wild symbol, counts consecutive matches or wilds, returns symbol with count if >= 3. Matches lineWins semantically.
- **Correction [OK]**: Lead detection (first non-WILD), WILD substitution, left-to-right run counting, and ≥3 threshold are all correct.
- **Overengineering [LEAN]**: Single-responsibility helper: find lead symbol, count consecutive matching run, return null if below threshold. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. WILD substitution, SCATTER early-return, run-length cutoff, and all-WILD edge cases are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported helper. No JSDoc; WILD/SCATTER handling rules and the minimum run of 3 are undocumented.

> **Duplicate of** `src/paytable.ts:lineWins` — 99% identical logic — both find lead symbol, filter WILD cards, count consecutive matches, return at count >= 3. Only field names differ (sym vs symbol, run vs count).

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin loop (line 129) to evaluate each payline for wins
- **Duplication [UNIQUE]**: Evaluates payline by calling checkLine and computing payout with wild multiplier. No similar functions found.
- **Correction [OK]**: Symbol extraction via reels[col][row], wildCount loop, and wild-bonus formula (1+wc)×2^wc all match the documented spec.
- **Overengineering [LEAN]**: Payline evaluation with wild-count bonus. Accepts a payFn callback for testability. Complexity matches the documented formula; no unnecessary layers.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding, no-win null return, and payout calculation are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: Non-exported but non-trivial function. Wild multiplier formula and parameter semantics are not documented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported and called by spin (line 131); transitively imported via spin
- **Duplication [UNIQUE]**: Sums line wins and applies house edge and bonus calculation. No similar functions found.
- **Correction [NEEDS_FIX]**: House edge applied as a 5% bonus (×1.05) instead of a 5% deduction (×0.95), contradicting the arbitrated RTP=95% target.
- **Overengineering [LEAN]**: Straightforward reduce + house-edge adjustment + floor. Formula matches the reference spec exactly.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE application, zero-win base-bet bonus, Math.ceil rounding, and the documented bug (edge adds instead of reducing) are all untested.
- **PARTIAL [PARTIAL]**: JSDoc describes high-level purpose and RTP intent but omits @param tags for both parameters (including the untyped `bet: any`) and an @returns annotation. The additive `bet * 0.01` term is unexplained.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)` are both public exports using explicit `any`. The `Bet` type alias is defined in the same file and never used as a parameter type. `EngineContainer.resolve<T>` casts `unknown` to `T` unconditionally, bypassing runtime type safety. [L94, L107, L26] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as `number[][]`, allowing in-place mutation that could silently corrupt payline evaluation. Should be `ReadonlyArray<readonly [number,number,number,number,number]>` or use `as const`. [L37] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `throw "invalid bet"` violates no-throw-literal — stack traces are unavailable and instanceof guards are impossible. (2) `rng` is resolved from the container but never used (no-unused-vars). (3) `reelsModule` is resolved but never used — `factory.buildReels(5, 3)` builds reels independently, making both DI registrations inert. [L109, L114, L116] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` is the primary public API entry point and has no JSDoc. `computePayout` has JSDoc. `Bet` type alias has none. [L107] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` throws a string primitive. Callers cannot catch with `instanceof Error`, and V8 does not capture a stack trace for non-Error throws. [L109] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are instantiated inline with `new` inside `spin()`, bypassing the DI container entirely. Unit-testing `spin()` without module-level mocking is impossible. The module-level `container` singleton couples tests to production registrations. [L120-L122] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` could validate PAYLINES as `ReadonlyArray<[number,number,number,number,number]>` for compile-time shape checking. `using` could manage `SpinEventEmitter` disposal. Neither is used. [L37-L49] |
| 17 | Context-adapted rules | FAIL | MEDIUM | Casino/gambling domain: (1) Arbitrated intent confirms `Bet = number // 1..100 coins, integer` as the enforced contract, but `spin` never rejects bets > 100 — it only emits `console.warn` and proceeds (L110-L111). (2) `lineBet = bet / 10` introduces floating-point credit arithmetic throughout payout accumulation; regulated gaming engines should use integer-credit arithmetic to avoid precision drift. [L108-L111] |

### Suggestions

- Use the `Bet` type, enforce the upper bound per the arbitrated contract, and throw an Error instead of a string.
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    if (typeof bet !== 'number' || bet < 1 || !Number.isInteger(bet)) {
      throw 'invalid bet';
    }
    if (bet > 100) console.warn('bet exceeds maximum');
  // After
  export function spin(bet: Bet): SpinResult {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
      throw new Error(`Invalid bet: ${bet}. Must be an integer in [1, 100].`);
    }
  ```
- Make PAYLINES deeply readonly to prevent accidental mutation.
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<readonly [number, number, number, number, number]> = [`
- Inject factory, strategy, and emitter through the container so spin() is unit-testable without module mocking.
  ```typescript
  // Before
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  const emitter = new SpinEventEmitter();
  // After
  const factory = container.resolve<StandardReelBuilderFactory>('factory');
  const strategy = container.resolve<DefaultStrategy>('strategy');
  const emitter = container.resolve<SpinEventEmitter>('emitter');
  ```
- Remove unused `rng` and `reelsModule` container resolutions, or thread `rng` into the factory so the DI registration has effect.
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>('rng');
  // ...
  const reelsModule = container.resolve<{ getReelSymbols: ...; getReelWeights: ... }>('reels');
  // ...
  const reels = factory.buildReels(5, 3);
  // After
  const rng = container.resolve<typeof weightedPick>('rng');
  // ...
  const reels = factory.buildReels(5, 3, rng);
  ```

## Actions

### Quick Wins

- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** In computePayout line 106, replace `total * (1 + HOUSE_EDGE)` with `total * (1 - HOUSE_EDGE)` to correctly deduct the 5% house edge and achieve the documented RTP≈95%. [L106]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
