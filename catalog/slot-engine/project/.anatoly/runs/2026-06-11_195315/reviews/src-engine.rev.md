# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | NONE | 80% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 65% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 65% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 80% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar type alias found in provided context.
- **Correction [OK]**: Type alias only; runtime range enforcement is the caller's (spin's) responsibility.
- **Overengineering [LEAN]**: Trivial type alias that documents the domain concept. Single importer is fine for a named export.
- **Tests [NONE]**: No test file exists for this source file.
- **PARTIAL [PARTIAL]**: Type alias name is self-descriptive, but valid constraints (positive integer, max 100) are not documented — callers must infer them from runtime errors in spin().

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout (L106): `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: No similar constant found in provided context.
- **Correction [OK]**: Constant value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named constant for a magic number. Minimal and appropriate.
- **Tests [NONE]**: No test file exists; computePayout (sole caller) has no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant, no JSDoc. Self-explanatory name reduces severity, but the RTP implication (applied as a bonus multiplier rather than a deduction) is non-obvious.

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded to `false`; the guarded `console.log` block in spin never executes at runtime. Symbol is syntactically referenced but permanently dead at runtime.
- **Duplication [UNIQUE]**: No similar constant found in provided context.
- **Correction [OK]**: Boolean flag, correctly guarded before the console.log in spin.
- **Overengineering [LEAN]**: Simple boolean flag guard. No complexity.
- **Tests [NONE]**: No test file exists; spin (sole caller) has no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private boolean flag, self-explanatory name, no JSDoc needed in practice.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at L29 to create `container`, which is used in spin.
- **Duplication [UNIQUE]**: No similar class found in provided context.
- **Correction [OK]**: Simple registry with no incorrect logic; all keys registered in the module are resolved by spin.
- **Overengineering [OVER]**: Mini IoC container defined and used entirely within one module to hold 3 values, only one of which (`paytable`) is actually consumed. A plain object `const deps = { rng: weightedPick, paytable: getPayMultiplier, reels: { getReelSymbols, getReelWeights } }` eliminates the class, the Map, and the string-keyed untyped resolve calls with no loss of capability.
- **Tests [NONE]**: No test file exists for this source file.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private class with no JSDoc. Purpose (service-locator / DI container) is non-obvious from name alone and no description of register/resolve semantics is provided.

#### `container` (L29–L29)

- **Utility [USED]**: Resolved values (`rng`, `paytable`, `reelsModule`) are read inside spin; `paytable` is passed to evaluateLine.
- **Duplication [UNIQUE]**: No similar variable found in provided context.
- **Correction [OK]**: All three keys registered match the three keys resolved in spin.
- **Overengineering [LEAN]**: Module-level singleton instantiation — the overengineering lives in EngineContainer itself, not here.
- **Tests [NONE]**: No test file exists; spin (sole caller) has no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private module-level singleton, no JSDoc. Internal use only; low severity.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin's line-evaluation loop and indexed during wild-multiplier calculation.
- **Duplication [UNIQUE]**: No similar constant found in provided context.
- **Correction [OK]**: Array matches the 10-payline definition in reference documentation exactly.
- **Overengineering [LEAN]**: Static domain data array. Exactly the right representation.
- **Tests [NONE]**: No test file exists; spin (sole caller) has no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private constant with no JSDoc. The geometric meaning of each row-index array (middle-row, V-shape, zigzag, etc.) is not self-evident from the numeric values.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at L76.
- **Duplication [DUPLICATE]**: Logic is ~95% identical to `lineWins` in src/paytable.ts: both resolve the lead symbol by skipping leading WILDs, guard on WILD/SCATTER leads, count consecutive matching-or-WILD symbols, and gate on run >= 3. Only difference is return-field names (`sym`/`run` vs `symbol`/`count`). Functions are interchangeable for all callers that only consume the count/run value.
- **Correction [OK]**: Wild-substitution lead detection and consecutive-run counting are correct; all-WILD case returns null, consistent with WILD having no paytable entry.
- **Overengineering [LEAN]**: Single-responsibility: scans one payline for a winning run, handles WILD substitution. Length is justified by the logic.
- **Tests [NONE]**: No test file exists for this source file.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper, no JSDoc. WILD substitution logic and early-exit for SCATTER are non-trivial behaviors that would benefit from inline docs.

> **Duplicate of** `src/paytable.ts:lineWins` — 95% identical logic — same WILD-resolution, same loop, same threshold; differs only in return property names (sym/run vs symbol/count)

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin's payline loop at L136.
- **Duplication [UNIQUE]**: No similar function found in provided context.
- **Correction [OK]**: Payline symbol extraction (column-major payline.map((row,col)=>reels[col][row])), run detection, and wild-multiplier application are internally consistent. No stated contract prescribes the specific wild-multiplier formula.
- **Overengineering [LEAN]**: Delegates symbol detection to checkLine, applies WILD multiplier bonus, returns a LineWin. Passing payFn as a parameter is appropriate for testability without adding abstraction layers.
- **Tests [NONE]**: No test file exists; spin (sole caller) has no tests.
- **UNDOCUMENTED [UNDOCUMENTED]**: Private helper with five parameters and a non-trivial wild-multiplier formula (basePayout * (1 + wildCount) * 2^wildCount). No JSDoc explaining parameters or the multiplier stacking logic.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called inside spin at L139; no direct importers outside the file, but the export is reachable transitively through spin.
- **Duplication [UNIQUE]**: No similar function found in provided context.
- **Correction [NEEDS_FIX]**: Two independent defects: house edge applied as a bonus (+5%) instead of a reduction (−5%), and Math.ceil rounds payouts up instead of down.
- **Overengineering [LEAN]**: Simple reduce plus two adjustments. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists for this source file.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent, but omits @param descriptions for lineWins and bet (typed as any), no @returns, and the unconditional floor (bet * 0.01) and Math.ceil are undocumented.

#### `spin` (L113–L179)

- **Utility [USED]**: Exported, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar function found in provided context.
- **Correction [NEEDS_FIX]**: Bet > 100 emits only a warning instead of throwing, violating the arbitrated Bet contract of 1..100 integer coins.
- **Overengineering [LEAN]**: The function's own code is straightforward: resolve deps, spin reels, evaluate paylines, aggregate payouts, check scatter/jackpot, build result. The factory, strategy, and emitter it instantiates are defined in other files — per the single-source rule, overengineering there is flagged at those definitions, not here.
- **Tests [NONE]**: No test file exists for this source file.
- **UNDOCUMENTED [UNDOCUMENTED]**: Primary exported function has no JSDoc at all. README covers high-level behavior but in-code documentation for parameters, thrown errors, return shape, and side effects is absent. (deliberated: confirmed — Confirmed at src/engine.ts:118: `if (bet > 100) console.warn('bet exceeds maximum')` — the warning message explicitly acknowledges a maximum bet of 100 but the code does not enforce it (no throw, no clamp). The bet proceeds to full processing at line 130 (`lineBet = bet / 10`) and payouts are computed normally. src/index.ts:1 re-exports `spin` with no additional validation layer. This is a real enforcement gap: the code documents a constraint it doesn't enforce. Confidence not raised to 85+ because external callers could theoretically validate bet ranges before calling spin, though no such validation exists in this codebase.)

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Both exported functions accept bet: any. The Bet type alias is declared on L13 but never applied to either computePayout or spin. Explicit any on public API surface defeats the type contract for all callers. [L91, L98] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is typed number[][] with no readonly modifier. Accidental mutation would silently corrupt evaluateLine for every subsequent call. [L36] |
| 8 | ESLint compliance | FAIL | HIGH | Two violations: (1) throw "invalid bet" violates no-throw-literal — callers cannot instanceof-check and no stack trace is captured (L103). (2) rng and reelsModule are resolved from the container but never consumed, violating no-unused-vars (L113, L115). [L103, L113, L115] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spin() is an exported function with no JSDoc. The Bet type alias is exported undocumented. computePayout has a JSDoc block but omits @param/@returns annotations. [L13, L98] |
| 12 | Async/Promises/Error handling | WARN | HIGH | throw "invalid bet" (L103) throws a string primitive; upstream catch (e instanceof Error) will not match. No async code present so no unhandled rejections. [L103] |
| 15 | Testability | WARN | MEDIUM | spin() hardcodes new StandardReelBuilderFactory(), new DefaultStrategy(), new SpinEventEmitter() with no injection point. The module-level container singleton also prevents test isolation without module-level mocking. [L119-L121] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | No satisfies, const type parameters, or using declarations. PAYLINES is the clearest missed opportunity: satisfies readonly (readonly number[])[] would catch out-of-range row indices (0-2) at compile time. [L36] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine gambling domain inferred from symbol vocabulary (WILD, SCATTER, CHERRY, BELL, BAR, SEVEN, DIAMOND), PAYLINES, jackpot, and freespins. computePayout applies total * (1 + HOUSE_EDGE), multiplying wins by 1.05 instead of reducing them. For 95% RTP the factor must be (1 - HOUSE_EDGE). This directly contradicts the arbitrated intent ('The engine targets a theoretical RTP of 95%') and would produce out-of-compliance payout math in any regulated jurisdiction. [L93] |

### Suggestions

- Apply the declared Bet alias instead of any on both exported functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Fix inverted house-edge: multiply by (1 - HOUSE_EDGE) to reduce payout to 95% RTP, not increase it
  - Before: `total = total * (1 + HOUSE_EDGE);`
  - After: `total = total * (1 - HOUSE_EDGE);`
- Throw an Error object so callers can instanceof-check and capture stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES immutable and use satisfies for row-index type safety
  ```typescript
  // Before
  const PAYLINES: number[][] = [
    [1, 1, 1, 1, 1],
    // ...
  ];
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies readonly (readonly (0 | 1 | 2)[])[];
  ```
- Remove unused container resolutions (rng, reelsModule) or wire them into the spin logic
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: ...; getReelWeights: ... }>("reels");
  // After
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  // rng and reelsModule removed — unused
  ```
- Accept factory, strategy, and emitter as optional parameters to enable test injection
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
    factory: ReelBuilderFactory = new StandardReelBuilderFactory(),
    strategy: SpinStrategy = new DefaultStrategy(),
    emitter: SpinEventEmitter = new SpinEventEmitter(),
  ): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor so fractional credits round down to the house, per slot-machine industry convention. [L110]

### Refactors

- **[correction · high · large]** Change (1 + HOUSE_EDGE) to (1 - HOUSE_EDGE) so winning payouts are reduced by 5%, matching the arbitrated 95% RTP target. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Throw an error (matching the pattern on line 114) when bet > 100 to enforce the documented 1..100 integer range on Bet. [L118]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `Bet` (`Bet`) [L12-L12]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
