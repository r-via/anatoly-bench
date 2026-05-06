# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 75% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | NEEDS_FIX | OVER | USED | UNIQUE | WEAK | 60% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 70% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 75% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | NONE | 90% |
| spin | function | yes | OK | LEAN | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 105
- **Duplication [UNIQUE]**: Numeric constant. No duplicates detected.
- **Correction [OK]**: Value 0.05 correctly represents the documented 5% house edge. Defect lies in its consumer computePayout, not here.
- **Overengineering [LEAN]**: Named constant for a magic number used in computePayout. Minimal and appropriate.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal constant; name conveys meaning but the relation to target RTP is unexplained inline.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Conditional check in spin function at line 174
- **Duplication [UNIQUE]**: Boolean constant. No duplicates detected.
- **Correction [OK]**: Boolean constant; no correctness issues.
- **Overengineering [LEAN]**: Simple boolean flag for a guarded log block. Not overengineered, just hardcoded to false.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal boolean flag; self-descriptive name makes purpose obvious, so severity is low.

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to initialize container
- **Duplication [UNIQUE]**: Simple DI container class. No similar class found.
- **Correction [NEEDS_FIX]**: resolve silently returns undefined cast to T when a key is missing, bypassing TypeScript safety and causing opaque downstream runtime failures.
- **Overengineering [OVER]**: Hand-rolled service-locator for 3 statically-imported functions. `Map<string, unknown>` erases types, forcing `resolve<T>` casts at every call site. No implementation swapping occurs at runtime; direct imports would be simpler and type-safe. The resolved `reelsModule` in `spin` is never actually used, underscoring that the indirection provides no value.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc on class or either method. Internal, unexported DI container; its purpose and lifetime are implicit.

#### `container` (L29–L29)

- **Utility [USED]**: Used in registration calls and resolve calls in spin function
- **Duplication [UNIQUE]**: Module-level instance. Not a candidate for duplication.
- **Correction [OK]**: All three keys registered before first use; no active correctness issue in current code.
- **Overengineering [LEAN]**: Straightforward instantiation and population of EngineContainer. The over-engineering lives in the class definition, not here.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal singleton instance; role is inferrable from surrounding registrations but not documented.

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin function at line 155 and referenced for wild multiplier calculation
- **Duplication [UNIQUE]**: Data constant defining payline patterns. No duplicates detected.
- **Correction [OK]**: All ten payline arrays match the canonical layout in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md exactly.
- **Overengineering [LEAN]**: Canonical payline configuration documented verbatim in .anatoly/docs/04-API-Reference/02-Configuration-Schema.md. Minimal and authoritative.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. The coordinate encoding (column index → row index, 0=top) and win-run semantics are not explained inline.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 74
- **Duplication [DUPLICATE]**: Identical logic to lineWins in paytable.ts: both find leading symbol, validate against WILD/SCATTER, count consecutive matches, return symbol+count if >= 3. Only naming differs (lead vs first, run vs count, sym vs symbol).
- **Correction [OK]**: WILD substitution via find(), SCATTER exclusion, and left-to-right run counting are all correct.
- **Overengineering [LEAN]**: Single-purpose helper: find the leading symbol and count a left-anchored WILD-substituted run. Straightforward loop, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal helper; WILD substitution logic and the null-for-SCATTER shortcut are non-obvious without a doc comment.

> **Duplicate of** `src/paytable.ts:lineWins` — Nearly identical implementation with only variable naming differences

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called by spin function at line 156 for each payline evaluation
- **Duplication [UNIQUE]**: Shares structure with computeLegacyPayout (symbol matching, wild logic) but different semantic contracts: evaluateLine takes reel matrix + payline indices, delegates to checkLine(), applies wild multiplier, returns structured LineWin object; computeLegacyPayout takes raw symbols, inlines matching, omits wild multiplier, returns scalar. Not interchangeable.
- **Correction [OK]**: payline.map((row,col)=>reels[col][row]) correctly extracts symbols; wild multiplier formula applied consistently within the line.
- **Overengineering [LEAN]**: Evaluates one payline: extracts symbols, delegates to checkLine, applies wild multiplier math. Each step is necessary for documented slot mechanics.
- **Tests [NONE]**: No test file exists for this module.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Internal function with five parameters and a non-trivial wild-multiplier formula; parameters and return value are undescribed.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported and called by spin function at line 158
- **Duplication [UNIQUE]**: No similar functions found.
- **Correction [NEEDS_FIX]**: Two independent defects: house edge applied in wrong direction (multiplier >1 inflates payouts instead of reducing them), and an undocumented unconditional 1%-of-bet addition on every spin.
- **Overengineering [LEAN]**: Minimal aggregation function: reduce line wins, apply house-edge factor, add base return, ceil. Matches the documented 5% house-edge and ceiling-rounding contract.
- **Tests [NONE]**: No test file exists for this module. Critical logic (HOUSE_EDGE application, bet bonus, Math.ceil) is entirely untested.
- **PARTIAL [PARTIAL]**: Has a JSDoc block describing purpose and house-edge intent, but no @param tags for lineWins or bet, no @returns, and the 1% base-bet addition is unexplained. bet is typed as any with no rationale.

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 3.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Two public-export signatures use explicit `any`: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The `Bet` type alias exists precisely to type this parameter — it is never used at the declaration site. [L95, L103] |
| 5 | Immutability | WARN | MEDIUM | PAYLINES is declared as `number[][]` — mutable at both array levels. Should be `readonly (readonly number[])[]` or use `as const satisfies readonly number[][]`. [L38-L49] |
| 8 | ESLint compliance | FAIL | HIGH | Two violations: (1) `bet: any` on two public exports triggers `@typescript-eslint/no-explicit-any`; (2) `throw "invalid bet"` triggers `no-throw-literal` — strings thrown as exceptions have no stack trace. [L95, L103, L105] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (the primary public API function) has no JSDoc block. `Bet` type alias has no JSDoc. Only `computePayout` is documented. [L103, L13] |
| 10 | Modern 2026 practices | WARN | MEDIUM | `throw "invalid bet"` is an archaic pattern (string exceptions carry no stack). The no-op `emitter.on(SPIN_DONE, () => {})` registered before `emit` is a stale pattern with no utility. [L105, L166-L167] |
| 12 | Async/Promises/Error handling | WARN | HIGH | `throw "invalid bet"` is documented as intentional (`.anatoly/docs/04-API-Reference/01-Public-API.md`) but string throws lose stack traces and are uncatchable with `instanceof Error`. No async paths present. |
| 14 | Performance | WARN | MEDIUM | `emitter.on(SPIN_DONE, () => {})` registers a new listener on every `spin()` call without ever removing it. In a high-throughput slot engine this accumulates unboundedly. [L166] |
| 15 | Testability | WARN | MEDIUM | `spin()` directly instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` with `new`, bypassing the DI container already used for rng/paytable/reels. These concrete dependencies cannot be mocked without monkey-patching. [L121-L123] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `satisfies` is unused; `PAYLINES as const satisfies readonly number[][]` would give element-level type narrowing while preserving the tuple structure. No `const` type parameters or `using` declarations used. [L38] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from WILD/SCATTER/JACKPOT/DIAMOND vocabulary and payline/house-edge/RTP structure. `computePayout` applies `total * (1 + HOUSE_EDGE)` which multiplies the payout up by 5%, the inverse of a house edge. House edge should reduce expected return to players, not inflate it. Additionally, the no-op listener pattern on every spin suggests an incomplete eventing design. |

### Suggestions

- Replace `any` with the existing `Bet` type alias on both public exports.
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object instead of a string literal to preserve stack traces and support `instanceof` guards.
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Mark PAYLINES deeply readonly to prevent accidental mutation.
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies readonly (readonly number[])[];
  ```
- Register factory, strategy, and emitter in the DI container instead of hard-coding `new` inside `spin()`.
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
- Remove the no-op listener or replace with a meaningful handler; at minimum, clean up the listener after each emit.
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Add JSDoc to the primary public export `spin`.
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
  // After
  /**
   * Executes one complete slot spin.
   * @param bet - Integer coin wager (1–100).
   * @returns Fully-populated SpinResult.
   * @throws {Error} When bet is not a positive integer.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or document the bet*0.01 unconditional payout; it silently inflates RTP above the 95% target on every spin, including losses. [L108]

### Refactors

- **[correction · high · large]** Replace (1 + HOUSE_EDGE) with (1 - HOUSE_EDGE) in computePayout so the house deducts 5% from wins rather than adding 5%, restoring the documented RTP≈95%. [L105]
- **[utility · medium · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Guard EngineContainer.resolve against missing keys by throwing a descriptive error (or returning a typed Result/Option) instead of silently casting undefined to T. [L25]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
