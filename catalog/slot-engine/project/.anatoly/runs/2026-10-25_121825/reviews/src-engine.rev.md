# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 95% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 95% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 90% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 97% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 78% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Type alias with no similar declarations in provided context.
- **Correction [OK]**: Type alias only; no logic to evaluate.
- **Overengineering [LEAN]**: Simple type alias documenting the valid bet range; matches the README API contract.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 106: total * (1 + HOUSE_EDGE).
- **Duplication [UNIQUE]**: Module-local constant with no similar declarations in provided context.
- **Correction [OK]**: Constant value 0.05 is correct in isolation; the defect is in how computePayout applies it, not in the constant itself.
- **Overengineering [LEAN]**: Single named constant; appropriate use to avoid a magic number.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded false; the guarded block at lines 160-162 can never execute, making the symbol permanently dead at runtime.
- **Duplication [UNIQUE]**: Module-local constant with no similar declarations in provided context.
- **Correction [OK]**: Boolean flag guards a console.log; no correctness issues.
- **Overengineering [LEAN]**: Simple boolean flag; adding a named constant for a feature-flag is standard practice, even when currently false.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as container at line 29; register/resolve methods are called within spin.
- **Duplication [UNIQUE]**: IoC registry class with no similar declarations in provided context.
- **Correction [OK]**: resolve returns undefined cast to T for unregistered keys, but all keys accessed in spin are pre-registered; no missing-key path is triggered.
- **Overengineering [OVER]**: Hand-rolled DI container (register/resolve on a Map) for three symbols that are already statically imported at the top of the file. All three registrations immediately below use the same imported references — the container adds a stringly-typed indirection with no testability or configurability benefit.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Used in spin (lines 127-129) to resolve rng, paytable, and reelsModule.
- **Duplication [UNIQUE]**: Module-level singleton instance with no similar declarations in provided context.
- **Correction [OK]**: All three keys (rng, paytable, reels) are registered before first use.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin at line 139 for payline evaluation and again at line 152 for wildMultiplier computation.
- **Duplication [UNIQUE]**: Payline configuration constant with no similar declarations in provided context.
- **Correction [OK]**: Ten paylines with row indices in [0,2]; valid for a 3-row reel grid.
- **Overengineering [LEAN]**: Plain data table for ten payline patterns; no abstraction layer needed or present.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 71.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts — same WILD-skip lead detection, same sequential run count loop, same run>=3 guard, same return structure. Only differences are local variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count).
- **Correction [OK]**: Leading-wild resolution, run counting, SCATTER guard, and all-WILD guard are all handled correctly.
- **Overengineering [LEAN]**: Focused single-purpose function; WILD/SCATTER handling and run-length logic are inherent to the domain.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — identical WILD-skip algorithm, identical loop structure, identical threshold check; differs only in variable and return-property names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called inside spin's payline loop at line 140.
- **Duplication [UNIQUE]**: No similar functions found in provided context.
- **Correction [OK]**: Symbol-to-column mapping (payline.map((row, col) => reels[col][row])) and wild-multiplier computation are internally consistent.
- **Overengineering [LEAN]**: Wild-count exponential multiplier adds lines of code but the formula is domain logic, not abstraction overhead.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin at line 142; exported and transitively consumed by src/index.ts via spin.
- **Duplication [UNIQUE]**: No similar functions found in provided context.
- **Correction [NEEDS_FIX]**: House edge applied in the wrong direction (inflates payout 5% instead of reducing it); also rounds up instead of down.
- **Overengineering [LEAN]**: Straightforward reduce + adjustment; no unnecessary layers. (deliberated: confirmed — CONFIRMED. Two bugs in src/engine.ts L101-111: (1) HOUSE_EDGE=0.05 at L14, applied as `total * (1 + HOUSE_EDGE)` at L105 — multiplies by 1.05, INCREASING payouts 5% instead of decreasing them. Docstring at L99 says 'target RTP of approximately 95%' but code yields >100% RTP. Should be `(1 - HOUSE_EDGE)`. (2) L108 `total += bet * 0.01` unconditionally adds 1% of bet even on losing spins, guaranteeing a minimum return and further inflating RTP. Both are correctness defects that cause the house to lose money.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Exported, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No similar functions found in provided context.
- **Correction [NEEDS_FIX]**: Bet upper-bound (100) is only warned about, not rejected, violating the documented 1..100 contract.
- **Overengineering [LEAN]**: The function's own logic is straightforward iteration over paylines; complexity comes from abstractions defined in other files (StandardReelBuilderFactory, DefaultStrategy, SpinEventEmitter), which are evaluated separately per their own files. (deliberated: confirmed — CONFIRMED. src/engine.ts L118: `if (bet > 100) console.warn("bet exceeds maximum")` — the upper bound is only warned, not enforced. The bet passes through unconstrained. Additionally, L120 resolves `rng` from container and L122 resolves `reelsModule`, but neither is referenced anywhere in the function body — the factory at L128 calls spinReel directly via reels.ts import, bypassing the container entirely. The soft upper bound is a real behavioral concern for a gambling engine.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 2/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | Explicit `any` on two public export signatures: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. Both should be typed as `Bet` (already exported) or `number`. [L92, L98] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is typed as mutable `number[][]` and could be narrowed with `as const` or `readonly number[][]`. The inner arrays could be mutated accidentally. [L33] |
| 8 | ESLint compliance | FAIL | HIGH | Two no-unused-vars violations: `rng` (L103) and `reelsModule` (L105) are resolved from the container but never referenced in the spin logic. Additionally, `throw "invalid bet"` (L100) violates the `@typescript-eslint/no-throw-literal` rule. [L100, L103, L105] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is a primary public export with no JSDoc comment. `Bet` type alias is also undocumented. Only `computePayout` has JSDoc. [L98] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string literal instead of an `Error` subclass. This defeats `instanceof Error` checks, drops the stack trace, and leaves callers without a `.message` contract. Should be `throw new Error("invalid bet")` or a typed `class InvalidBetError extends Error`. [L100] |
| 14 | Performance | WARN | MEDIUM | `emitter.on(SPIN_DONE, () => {})` registers a new no-op listener on every `spin()` call. In a high-throughput slot engine invoked millions of times, this creates unbounded listener accumulation and a memory leak. The listener should be registered once outside `spin()`, or the emitter should be replaced with a fire-and-forget `emit`. [L159] |
| 15 | Testability | WARN | MEDIUM | `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are instantiated directly inside `spin()` with no injection point, making them impossible to mock in tests. The `EngineContainer` DI pattern exists but is bypassed for these three collaborators. [L107-L110] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` and `result` construction miss the `satisfies` operator: `PAYLINES satisfies readonly (readonly number[])[]` would narrow types without losing the literal shape. No usage of `const` type params or `using` despite opportunities. [L33, L148] |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-engine domain: the `EngineContainer` registry resolves `rng` and `reelsModule` on every spin but neither is used — the factory and paytable function handle those paths directly. The vestigial container resolutions add dead complexity and mask actual data flow. Additionally, `HOUSE_EDGE` applied as `* (1 + HOUSE_EDGE)` increases payout rather than reducing it, which is semantically inverted for a house-edge reduction; in a regulated gambling context this miscalculates RTP. [L93-L96, L103, L105] |

### Suggestions

- Replace `any` on public export parameters with the already-exported `Bet` type
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error subclass instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES immutable with as const
  - Before: `const PAYLINES: number[][] = [ ... ]`
  - After: `const PAYLINES = [ [1,1,1,1,1], [0,0,0,0,0], ... ] as const satisfies readonly (readonly number[])[];`
- Remove unused container resolutions inside spin()
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<...>("reels");
  // After
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  ```
- Register the event listener once at module level, not inside spin()
  ```typescript
  // Before
  // Inside spin():
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  // Module level:
  const emitter = new SpinEventEmitter();
  emitter.on(SPIN_DONE, () => {});
  // Inside spin():
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Inject factory, strategy, and emitter for testability
  ```typescript
  // Before
  export function spin(bet: Bet): SpinResult {
    const factory = new StandardReelBuilderFactory();
    const strategy = new DefaultStrategy();
  // After
  export function spin(
    bet: Bet,
    deps = { factory: new StandardReelBuilderFactory(), strategy: new DefaultStrategy() }
  ): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Change `Math.ceil(total)` to `Math.floor(total)` to round slot payouts down per industry convention. [L110]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house edge reduces payouts by 5% rather than inflating them. [L107]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Add `|| bet > 100` to the existing invalid-bet throw guard so over-limit bets are rejected, not just warned about. [L118]
- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
