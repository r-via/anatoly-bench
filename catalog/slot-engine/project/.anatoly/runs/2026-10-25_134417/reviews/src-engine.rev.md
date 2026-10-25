# Review: `src/engine.ts`

**Verdict:** NEEDS_REFACTOR

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | - | LOW_VALUE | UNIQUE | - | 85% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 90% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 90% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 90% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 55% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Simple type alias with no RAG matches.
- **Correction [OK]**: Type alias only; no logic to evaluate.
- **Overengineering [LEAN]**: Simple type alias that matches the documented public API in the README.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 105 to scale total payout.
- **Duplication [UNIQUE]**: Module-level constant with no RAG matches.
- **Correction [OK]**: Constant value 0.05 is correct; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named constant replacing a magic number; appropriately scoped.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded to false; the guarded console.log block in spin (lines 163–165) is permanently dead and never executes.
- **Duplication [UNIQUE]**: Module-level constant with no RAG matches.
- **Correction [OK]**: Boolean flag used only for conditional logging; no correctness issue.
- **Overengineering [LEAN]**: Simple boolean flag guarding a single log statement.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [LOW_VALUE]**: Trivial Map wrapper with register/resolve; adds only a type-cast over a raw Map, instantiated exactly once as the module-level container.
- **Duplication [UNIQUE]**: No RAG matches; generic registry container scoped to this module.
- **Correction [OK]**: Simple registry; resolve returns undefined typed as T when key is absent, but all registered keys are populated before use.
- **Overengineering [OVER]**: Hand-rolled DI container for three static module-level references that never change at runtime. register/resolve wrapping Map<string, unknown> adds unsafe casts and indirection with no benefit over direct imports. Single instantiation with fixed keys means zero generalization value.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: resolve("paytable") result is passed as payFn to evaluateLine inside spin; also resolves rng and reelsModule (though those resolutions go unused).
- **Duplication [UNIQUE]**: Module-level singleton instance with no RAG matches.
- **Correction [OK]**: Instantiation and registration are correct; all three keys are populated.
- **Overengineering [LEAN]**: Consumer of EngineContainer; the over-engineering lives in the class definition above.
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin's line-evaluation loop (line 137) and again for wild-multiplier computation (line 152).
- **Duplication [UNIQUE]**: No RAG matches; payline matrix is data, not logic.
- **Correction [OK]**: Ten paylines with valid row indices (0–2) across five columns.
- **Overengineering [LEAN]**: Static configuration data for a fixed 10-line slot layout; appropriate representation.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine at line 75 to detect leading symbol runs.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts: same WILD-substitution for first symbol, same SCATTER/WILD guard, same consecutive-match loop with break, same >= 3 threshold, same return shape. Differences are cosmetic: variable names (lead/run vs first/count) and return property names (sym/run vs symbol/count).
- **Correction [OK]**: Lead resolution and run-length counting are self-consistent; SCATTER and all-WILD short-circuits are correct.
- **Overengineering [LEAN]**: Focused single-responsibility function: WILD leader resolution + run counting.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — both resolve WILD-leading runs, guard on SCATTER/WILD, count consecutive matches, require >= 3, return the matched symbol and run length

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called inside spin's PAYLINES loop at line 138 to produce LineWin objects.
- **Duplication [UNIQUE]**: No RAG matches; combines payline mapping, checkLine, payout calculation, and wild-boost multiplier in one function not found elsewhere.
- **Correction [OK]**: Wild multiplier formula (1+wc)*2^wc has no documented contract to violate; payout arithmetic is internally consistent.
- **Overengineering [LEAN]**: Necessary complexity: symbol extraction, payout multiplication, and wild bonus are all part of a single evaluation step.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin at line 141; also exported, making it available to external consumers.
- **Duplication [UNIQUE]**: No RAG matches; applies house-edge adjustment and minimum-return floor unique to this function.
- **Correction [NEEDS_FIX]**: Two defects: house edge applied in the wrong direction (inflates payout instead of reducing it), and Math.ceil over-pays fractional coins.
- **Overengineering [LEAN]**: Simple aggregation function; the logic is minimal even if its arithmetic is suspect.
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts; primary public entry point of the engine.
- **Duplication [UNIQUE]**: No RAG matches; top-level orchestration function with no counterpart in the provided context.
- **Correction [NEEDS_FIX]**: Bet > 100 only warns but does not reject, violating the documented contract Bet = number // 1..100 coins.
- **Overengineering [LEAN]**: The function itself is straightforward: validate, spin, evaluate, aggregate, return. Per rule 8, the over-engineered abstractions it instantiates (StandardReelBuilderFactory, DefaultStrategy, SpinEventEmitter) are defined in other files and should be flagged there. The rng and reelsModule container resolutions are unused, but that is a correctness issue, not added complexity.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 6/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 1 | Strict mode | WARN | HIGH | tsconfig not provided; explicit `any` on public signatures is permitted by strict mode, but the pattern suggests no `noImplicitAny` enforcement is catching accidental gaps. Cannot confirm strict: true from file alone. |
| 2 | No `any` | FAIL | CRITICAL | Both exported functions use `any` on their primary parameter: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. The type `Bet = number` is already exported; use it. [L93, L101] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES: number[][]` is a module-level constant whose inner arrays are mutable. Declare as `readonly (readonly number[])[]` or append `as const` to prevent accidental mutation. [L37] |
| 8 | ESLint compliance | WARN | HIGH | `emitter.on(SPIN_DONE, () => {})` is a no-op listener that `no-empty-function` would flag. The `any` violations are owned by rule 2. `console.warn` on line 104 would trigger `no-console` in most configs. |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` is the primary public API entry point and has no JSDoc. Its parameter contract (range, integer constraint), side-effects (event emission), and return semantics (coin payout vs bet ratio) are non-obvious from the signature alone. `computePayout` is documented; `spin` is not. [L101] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string literal, not an `Error`. This drops the stack trace, breaks `instanceof Error` checks, and leaves catch sites without `.message`/`.name`. Replace with `throw new Error("invalid bet")`. [L103] |
| 15 | Testability | WARN | MEDIUM | `spin()` hard-wires `new StandardReelBuilderFactory()`, `new DefaultStrategy()`, and `new SpinEventEmitter()` with no injection point. The module-level `container` accepts rng/paytable/reels but not the factory or strategy, making deterministic unit tests of the full spin path impossible without monkey-patching. `computePayout`, `checkLine`, and `evaluateLine` are pure and fully testable. |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | The `result` object on line 156 could use `satisfies SpinResult` to catch shape errors at the assignment site rather than relying on the variable's declared type. `EngineContainer.resolve` could use a const type parameter to avoid the `as T` cast. |
| 17 | Context-adapted rules | WARN | MEDIUM | Slot-machine domain inferred from payline/scatter/jackpot/freespin vocabulary. The declared `Bet = number` constraint (1–100 integer per README) is not enforced at the type level; `bet > 100` issues only a `console.warn` instead of rejecting the call. In a regulated gaming context, bet-ceiling enforcement must be hard, not advisory. [L104] |

### Suggestions

- Replace `any` on both exported functions with the already-exported `Bet` type alias
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Enforce the bet ceiling rather than warning
  - Before: `if (bet > 100) console.warn("bet exceeds maximum");`
  - After: `if (bet > 100) throw new Error(`bet ${bet} exceeds maximum of 100`);`
- Make PAYLINES deeply readonly to prevent accidental mutation
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ... same values
  ] as const satisfies readonly (readonly number[])[];
  ```
- Use satisfies on the result construction to catch shape mismatches early
  ```typescript
  // Before
  const result: SpinResult = {
  // After
  const result = {
    // ... same fields
  } satisfies SpinResult;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `Math.ceil(total)` with `Math.floor(total)` to comply with the slot-machine industry convention of rounding payouts down so the house retains fractional coins. [L110]
- **[correction · medium · small]** Add `bet > 100` to the existing throw condition (or add a separate throw) so bets exceeding the documented maximum are rejected rather than only warned about. [L118]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house edge reduces payout toward the documented ~95% RTP target instead of inflating it above 100%. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[utility · low · trivial]** Consider removing low-value code: `EngineContainer` (`EngineContainer`) [L17-L27]
