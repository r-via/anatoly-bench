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
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 88% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 88% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Internal constant used in computePayout at line 109.
- **Duplication [UNIQUE]**: Numeric constant. No similar symbols found.
- **Correction [OK]**: Constant value 0.05 is correct; the misuse is in computePayout and flagged there.
- **Overengineering [LEAN]**: Named constant for a magic number — correct practice.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE directly affects payout math and its bug (adds edge instead of reducing it) is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious semantic: value is added to winning payouts rather than subtracted, inverting the typical house-edge convention.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Internal constant used in spin at line 172.
- **Duplication [UNIQUE]**: Boolean constant. No similar symbols found.
- **Correction [OK]**: Boolean flag; no correctness issues.
- **Overengineering [LEAN]**: Simple compile-time flag, minimal.
- **Tests [NONE]**: No test file exists. Constant is always false; branch it guards is dead and untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Private constant; tolerable, but purpose and toggle mechanism are undescribed.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Internal class instantiated at line 29 for service container.
- **Duplication [UNIQUE]**: Service locator/registry class with register and resolve methods. No similar symbols found.
- **Correction [OK]**: resolve silently returns undefined cast to T when a key is absent, but all three keys are registered before any resolve call, so no runtime failure in current usage.
- **Overengineering [OVER]**: Hand-rolled IoC container (string-keyed registry with `register`/`resolve`) used exclusively to wrap three directly-imported module-level functions in the same file. Provides zero testability or swappability benefit because it is populated at module load time with the actual imports. The three consumers (`rng`, `paytable`, `reels`) could simply be called directly.
- **Tests [NONE]**: No test file exists. register/resolve mechanics, including unsafe cast and missing-key behavior, are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on the class or either method. Acts as a service-locator/DI container; that role and the type-unsafe cast in resolve() warrant at least a class-level description.

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Internal constant used in spin at lines 127–128 and 161.
- **Duplication [UNIQUE]**: Constant array defining payline patterns. No similar symbols found.
- **Correction [OK]**: All row indices are within the valid range [0, 2] for a 3-row grid.
- **Overengineering [LEAN]**: Standard slot payline configuration data; appropriate representation.
- **Tests [NONE]**: No test file exists. Payline coordinate correctness is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Non-obvious data: each inner array encodes row indices per reel column. Format and count (10 lines) should be documented.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Internal function called by evaluateLine at line 71.
- **Duplication [DUPLICATE]**: RAG similarity 0.834. Identical logic to lineWins: determines lead symbol, validates against WILD/SCATTER, counts consecutive matches including wilds, returns null if count < 3. Differs only in field names (sym/run vs symbol/count).
- **Correction [OK]**: Lead resolution, WILD/SCATTER guards, and consecutive-run counting are correct for all reachable inputs.
- **Overengineering [LEAN]**: Single-purpose function with clear domain logic. Length is justified by the WILD/SCATTER edge cases.
- **Tests [NONE]**: No test file exists. WILD-lead resolution, SCATTER short-circuit, run-length threshold, and mixed WILD/symbol sequences are all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper, but logic is non-trivial: WILD substitution for lead symbol, early-break run detection, and explicit null for SCATTER/all-WILD lines all need description.

> **Duplicate of** `src/paytable.ts:lineWins` — 91% identical logic — both identify leading symbol, count consecutive matches treating WILD as wildcard, return null if fewer than 3 matches

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Internal function called by spin at line 128.
- **Duplication [UNIQUE]**: Evaluates a single payline using checkLine and applies wild multipliers. No similar symbols found.
- **Correction [OK]**: Symbol extraction via payline mapping, run detection, and per-line wild bonus multiplication are internally consistent.
- **Overengineering [LEAN]**: Computes line payout with wild multiplier. The exponential wild bonus is domain logic, not accidental complexity.
- **Tests [NONE]**: No test file exists. Wild multiplier compounding logic and null-win path are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal but substantial: applies wild-count multiplier formula `(1+wc)*2^wc` on top of base payout. Parameters and the compounding wild bonus are undescribed.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported function called by spin at line 130. Used transitively.
- **Duplication [UNIQUE]**: Aggregates line win payouts and applies house edge plus minimum bet return. No similar symbols found.
- **Correction [NEEDS_FIX]**: House edge applied in wrong direction (boosts wins instead of deducting) and Math.ceil rounds payout up against casino convention.
- **Overengineering [LEAN]**: Simple reduce plus two adjustments. No unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Exported function with inverted house-edge application and unconditional bet bonus are critical business-logic bugs with zero test coverage.
- **PARTIAL [PARTIAL]**: JSDoc exists but is misleading: comment says house edge maintains ~95% RTP, yet the code adds `HOUSE_EDGE` to winning payouts (inflating them) and unconditionally adds `bet*0.01`. Neither behavior matches the stated intent, and `bet` is typed `any`. Parameters and return are undescribed.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 4/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on both exported function signatures: `bet: any` in computePayout (L101) and spin (L113). `Bet = number` is already defined in this file; there is no justification for the any annotation. [L101, L113] |
| 3 | Discriminated unions | WARN | MEDIUM | EngineContainer.resolve<T> uses an unchecked `as T` cast (L25). A misregistered key silently casts unknown to any T at runtime with no type-system guard. [L25] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is declared as mutable `number[][]`. Module-level constants should be `readonly number[][]` or `as const` to prevent accidental mutation. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Four distinct violations: (1) `throw "invalid bet"` violates no-throw-literal (L115); (2) `console.warn` violates no-console (L118); (3) `const rng` and `const reelsModule` are declared but never used — no-unused-vars (L120, L122); (4) empty `() => {}` callback violates no-empty-function (L175). [L115, L118, L120, L122, L175] |
| 9 | JSDoc on public exports | WARN | MEDIUM | spin() (L113) and the exported Bet alias (L12) lack JSDoc. Only computePayout is documented. [L12, L113] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` (L115) throws a string literal. Callers cannot catch with `instanceof Error` and get no stack trace. Should be `throw new Error("invalid bet")`. [L115] |
| 15 | Testability | WARN | MEDIUM | StandardReelBuilderFactory, DefaultStrategy, and SpinEventEmitter are instantiated inline inside spin() (L124-L126) and cannot be replaced in tests. Worse, rng/paytable/reels are resolved from a module-level container (shared mutable state) but then never actually used — the resolved values rng and reelsModule are dead (L120, L122). The DI infrastructure exists but is non-functional. [L120, L122, L124-L126] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | PAYLINES and container registrations could use `satisfies` for narrowed inference without type widening. No `using` for disposable resources (emitter lifecycle). [L34, L29-L32] |
| 17 | Context-adapted rules | WARN | MEDIUM | SpinEventEmitter is created, immediately subscribed with a no-op listener, emitted to, then discarded every spin (L124-L176). This is dead-code overhead with no observable effect. For a slot-machine engine, event emission without real subscribers produces noise and allocation cost per spin call. [L126, L175-L176] |

### Suggestions

- Replace `any` with the already-defined Bet alias on both exported functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object so callers get a stack trace and can use instanceof
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES immutable at the type level
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly number[][] = [`
- Guard EngineContainer.resolve against missing keys to surface misconfiguration at the source instead of at the cast site
  ```typescript
  // Before
  resolve<T>(key: string): T {
    return this.registry.get(key) as T;
  }
  // After
  resolve<T>(key: string): T {
    const val = this.registry.get(key);
    if (val === undefined) throw new Error(`No registration for key: "${key}"`);
    return val as T;
  }
  ```
- Inject factory/strategy/emitter as defaulted parameters to make spin() unit-testable and remove the dead unused DI variables
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
    ...
    const rng = container.resolve<typeof weightedPick>("rng");          // unused
    const reelsModule = container.resolve<...>("reels");                 // unused
    const factory = new StandardReelBuilderFactory();
    const strategy = new DefaultStrategy();
    const emitter = new SpinEventEmitter();
  // After
  export function spin(
    bet: Bet,
    factory: ReelBuilderFactory = new StandardReelBuilderFactory(),
    strategy: PayoutStrategy = new DefaultStrategy(),
    emitter: SpinEventEmitter = new SpinEventEmitter()
  ): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Pass the resolved rng function and reelsModule to the reel builder (or replace factory.buildReels with a path that uses weightedPick, getReelSymbols, and getReelWeights), so the registered certifiable RNG is actually exercised during reel generation. [L120]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Replace total * (1 + HOUSE_EDGE) with total * (1 - HOUSE_EDGE) to deduct the house edge and achieve the documented ~95% RTP target instead of inflating wins. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace Math.ceil with Math.floor so the house retains fractional payout remainders per casino convention. [L110]
- **[correction · low · trivial]** Replace throw "invalid bet" with throw new Error("invalid bet") to preserve stack traces and support instanceof Error checks. [L115]
- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
