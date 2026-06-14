# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 82% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 80% |
| evaluateLine | function | no | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 55% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout() line 105 to adjust payout multiplier.
- **Duplication [UNIQUE]**: Simple numeric constant; no similar symbols found
- **Correction [OK]**: Constant value 0.05 is correct for a 5% house edge. The bug is in how computePayout applies it, not in the constant itself.
- **Overengineering [LEAN]**: Named constant for a magic number — standard practice.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private module constant.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin() line 159 to conditionally log debug output.
- **Duplication [UNIQUE]**: Boolean constant; no similar symbols found
- **Correction [OK]**: Simple boolean constant, no correctness issues.
- **Overengineering [LEAN]**: Simple flag constant guarding a single debug log.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private module constant.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated on line 29 to serve as dependency container, accessed via container variable in spin().
- **Duplication [UNIQUE]**: DI container class with register/resolve; no similar classes found
- **Correction [OK]**: resolve<T> casts undefined to T when key is missing, but all keys used at runtime are pre-registered in module scope. No runtime failure in current usage.
- **Overengineering [OVER]**: Hand-rolled IoC registry with `register`/`resolve` used solely to store and re-retrieve three functions that are already in scope as top-level imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols`/`getReelWeights`). The indirection buys nothing: the container is module-private, never swapped, never mocked, and has exactly one call site.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported internal DI container class. No JSDoc on class or its methods. Low severity given it is not public API.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Referenced in spin() loops at lines 133 and 149 to evaluate payline patterns.
- **Duplication [UNIQUE]**: Static payline configuration; no similar constants found
- **Correction [OK]**: 10 paylines with valid row indices (0-2) for a 5×3 grid. Matches documentation exactly.
- **Overengineering [LEAN]**: Fixed data table — appropriate representation for 10 static payline definitions.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: 10-element payline array with no JSDoc explaining the row-index encoding, coordinate system, or payline numbering convention.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called in evaluateLine() line 74 to validate symbol patterns.
- **Duplication [DUPLICATE]**: RAG score 0.823 with matching implementation. Both validate symbol arrays: handle WILD first, reject SCATTER, count consecutive matches including WILDs, return null if count < 3
- **Correction [OK]**: Line checking logic is correct for documented behavior. All-WILDs returning null is consistent with WILD having no paytable entry.
- **Overengineering [LEAN]**: Focused helper: resolves lead symbol past WILDs, counts matching run. No excess abstraction.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported helper, under 20 lines. No JSDoc. WILD-substitution and SCATTER-exclusion logic is non-trivial but function is internal only.

> **Duplicate of** `src/paytable.ts:lineWins` — Identical payline evaluation logic; differ only in field names (sym/run vs symbol/count)

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin() line 134 within the payline evaluation loop.
- **Duplication [UNIQUE]**: No similar functions found; combines checkLine with wild multiplier calculation and grid indexing
- **Correction [NEEDS_FIX]**: Wild multiplier formula combines additive and exponential scaling, producing domain-suspicious multipliers that contribute to RTP exceeding 100%.
- **Overengineering [LEAN]**: Handles one payline evaluation with wild-boost computation. Complexity is proportional to the domain logic.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: Unexported helper with non-obvious wild-multiplier formula (basePayout * (1+wc) * 2^wc). No JSDoc. Internal only, but formula warrants explanation.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called in spin() line 138 to calculate total payout.
- **Duplication [UNIQUE]**: No similar functions found; applies house edge to aggregated line wins
- **Correction [ERROR]**: Three independent defects push RTP well above 100%: house edge sign is inverted (increases payout by 5%), unconditional floor pays on losing spins, and Math.ceil rounds in player's favor.
- **Overengineering [LEAN]**: Short aggregation function; structural complexity is minimal.
- **Tests [NONE]**: No test file exists for this module. Critical logic: applies house edge incorrectly (multiplies by 1+HOUSE_EDGE instead of reducing) and adds unconditional 1% bet bonus — untested.
- **PARTIAL [PARTIAL]**: Has JSDoc prose but no @param or @returns tags. Description states house edge 'maintains ~95% RTP' yet implementation multiplies total by 1.05 (increases payout), contradicting standard house-edge semantics. bet parameter typed any with no documentation of valid range or type. (deliberated: confirmed — Confirmed. engine.ts:105 applies HOUSE_EDGE as `total * (1 + 0.05)` = `total * 1.05`, increasing payouts by 5%. The JSDoc at engine.ts:97-100 states intent is '~95% RTP', which requires `total * (1 - HOUSE_EDGE)` = `total * 0.95`, matching ANCIENT_RTP=0.95 in paytable.ts:3. Additionally, engine.ts:108 adds `bet * 0.01` unconditionally, guaranteeing non-zero payout on every spin and further inflating RTP above 100%. The implementation directly contradicts its documented purpose — this is a real arithmetic bug with financial impact.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on `bet` in both public exports: `computePayout(lineWins: LineWin[], bet: any)` (L89) and `spin(bet: any)` (L97). Both are public API surface. `EngineContainer.resolve<T>` casts `unknown` to `T` via `as T` (L24), bypassing type safety. [L24, L89, L97] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` (L38) is mutable at the inner-array level. Should be `as const` or typed `readonly number[][]` to prevent accidental mutation. The arbitrated contract types `SpinResult.reels` as `ReadonlyArray<ReadonlyArray<Symbol>>`, but `reels` inside `spin` is `Symbol[][]` before being assigned to the result. [L38-L49] |
| 8 | ESLint compliance | FAIL | HIGH | Three clear lint violations: (1) `rng` (L104) resolved from container but never used — `factory.buildReels` generates reels directly, bypassing the injected RNG entirely. (2) `reelsModule` (L106–108) resolved but never referenced. (3) `emitter.on(SPIN_DONE, () => {})` (L159) registers a no-op listener immediately before emitting — dead code. `no-unused-vars` and `no-empty-function` would catch all three. [L104, L106-L108, L159] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computePayout` has JSDoc (L85–88). `spin` — the primary public export — has none. `Bet` type alias has none. [L97] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L99) throws a string primitive instead of an `Error` object. This loses stack trace information and breaks `instanceof Error` checks in callers. No async code is present, so promise handling is N/A. [L99] |
| 14 | Performance | WARN | MEDIUM | `wildCount` per winning line is computed twice: once inside `evaluateLine` (L76–79) and again inside `spin` (L141–148) for `wildMultiplier`. `evaluateLine` could return `wildCount` in its result to avoid the second pass. [L76-L79, L141-L148] |
| 15 | Testability | WARN | MEDIUM | Module-level `container` singleton (L35–39) is initialized at import time and not injectable in tests. `factory`, `strategy`, and `emitter` are instantiated directly inside `spin` with no injection point, making unit-level mocking require module patching. The DI container is unused for rng/reels (see rule 8), reducing the value of the abstraction further. |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies number[][]` to keep the literal type while gaining assignability checking. `EngineContainer.resolve` result could benefit from inferred const type parameters (TS 5.4+). Minor missed opportunities, none blocking. [L38, L23] |
| 17 | Context-adapted rules | WARN | MEDIUM | `EngineContainer.resolve<T>` casts `this.registry.get(key) as T` (L24) — since `registry` is `Map<string, unknown>`, this silently returns `undefined` for missing keys and casts it to `T`, producing a runtime crash with no type-level warning. For a slot engine where the container is populated at module load and then read inside `spin`, the missing-key case is latent. A `get` + `null` check returning `T \| undefined` would be safer. [L23-L25] |

### Suggestions

- Replace `bet: any` with the `Bet` type already defined in this file
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object instead of a string to preserve stack traces
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove unused container resolutions and the no-op listener, or wire them into actual usage
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const reelsModule = container.resolve<...>("reels");
  // ...
  emitter.on(SPIN_DONE, () => {});
  // After
  // Remove rng and reelsModule if factory.buildReels does not use them,
  // or pass rng into factory. Remove the no-op emitter.on entirely.
  ```
- Make PAYLINES deeply immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [...]
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    // ...
  ] as const satisfies readonly number[][];
  ```
- Type EngineContainer.resolve to return T | undefined and guard call sites
  ```typescript
  // Before
  resolve<T>(key: string): T {
    return this.registry.get(key) as T;
  }
  // After
  resolve<T>(key: string): T {
    const value = this.registry.get(key);
    if (value === undefined) throw new Error(`No binding for key: ${key}`);
    return value as T;
  }
  ```
- Add JSDoc to the exported `spin` function
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
  // After
  /**
   * Executes a single slot spin for the given bet amount.
   * @param bet - Integer coin bet in [1, 100].
   * @returns A SpinResult containing reels, line wins, and payout.
   * @throws {Error} When bet is not a positive integer.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or guard the unconditional `total += bet * 0.01` — losing spins in a slot machine must return 0 [L108]
- **[correction · medium · small]** Change Math.ceil to Math.floor — slot machine payouts must round down per industry convention (house keeps remainder) [L110]
- **[correction · medium · small]** Replace `console.warn` with `throw new Error('bet exceeds maximum')` to enforce the documented 1..100 integer range [L118]
- **[correction · medium · small]** Review wild multiplier formula — `(1 + wildCount) * 2^wildCount` combines two scaling factors multiplicatively, producing extreme multipliers (4×/12×/32×) that likely inflate RTP beyond target [L86]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` to correctly reduce payout by the house edge and target 95% RTP [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Change `throw "invalid bet"` to `throw new Error("invalid bet")` for proper error handling and stack traces [L115]
- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
