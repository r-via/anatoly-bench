# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| DEBUG_MODE | constant | no | OK | LEAN | LOW_VALUE | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 90% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 95% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 92% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 85% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 97% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 88% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Simple type alias with no RAG matches.
- **Correction [OK]**: Type alias with no logic.
- **Overengineering [LEAN]**: Simple type alias matching the README API contract exactly.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout at line 106: `total * (1 + HOUSE_EDGE)`.
- **Duplication [UNIQUE]**: Module-scoped constant with no RAG matches.
- **Correction [OK]**: Constant value is correctly defined at 0.05; the defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Named numeric constant; appropriate.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [LOW_VALUE]**: Hardcoded `false`; the guarded block at lines 163–165 never executes, making it permanently dead code with no runtime effect.
- **Duplication [UNIQUE]**: Module-scoped constant with no RAG matches.
- **Correction [OK]**: Simple boolean flag, no logic.
- **Overengineering [LEAN]**: Simple boolean flag guarding a single log statement.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated at line 29 to create the module-level `container`.
- **Duplication [UNIQUE]**: Local DI container class with no RAG matches.
- **Correction [OK]**: resolve<T> silently returns undefined for missing keys, but all keys used in spin are registered at module load so no runtime failure occurs.
- **Overengineering [OVER]**: Mini IoC container for 3 values that are already available as module-level imports (`weightedPick`, `getPayMultiplier`, `getReelSymbols/getReelWeights`). The generic `Map<string, unknown>` with a cast-on-resolve API adds indirection with zero benefit; direct references to the imports suffice.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Resolved in `spin` at lines 138–140 to obtain rng, paytable, and reels dependencies.
- **Duplication [UNIQUE]**: Singleton instance variable with no RAG matches.
- **Correction [OK]**: All three keys registered correctly.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in `spin` at lines 148 and 153; also indexed at line 169 for wild multiplier computation.
- **Duplication [UNIQUE]**: Static payline configuration array with no RAG matches.
- **Correction [OK]**: All row indices are in [0,2]; ten paylines are valid for a 5×3 grid.
- **Overengineering [LEAN]**: Static data table for 10 payline patterns; straightforward representation.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by `evaluateLine` at line 76.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins in src/paytable.ts — same WILD substitution (find first non-WILD), same SCATTER guard, same counting loop with WILD continuation, same run>=3 threshold. Only differences are variable names (lead/run vs first/count) and return field names (sym/run vs symbol/count). Fully interchangeable behavior.
- **Correction [OK]**: Correctly resolves lead through leading WILDs, returns null for SCATTER/all-WILD lines, and counts the consecutive matching run.
- **Overengineering [LEAN]**: Single-purpose WILD-aware run detection; appropriately minimal.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~95% identical logic — same WILD/SCATTER handling, same counting algorithm, same threshold; differs only in local variable and return-field names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in `spin` at line 152 for each payline.
- **Duplication [UNIQUE]**: No RAG matches. Combines payline mapping, checkLine delegation, wild-boost multiplication, and LineWin construction — no equivalent elsewhere.
- **Correction [OK]**: Payout and wild-boost logic are internally consistent; no spec constrains the exact wild-multiplier formula.
- **Overengineering [LEAN]**: Evaluates one payline with wild-multiplier boost; logic is proportionate to the task.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called in `spin` at line 155; transitively used by the exported `spin` function imported in src/index.ts.
- **Duplication [UNIQUE]**: No RAG matches. Aggregates line-win payouts, applies HOUSE_EDGE uplift, and adds a minimum-return floor — no equivalent elsewhere.
- **Correction [NEEDS_FIX]**: House edge applied in the wrong direction (amplifies payout instead of reducing it) and Math.ceil rounds up, over-paying fractional coins.
- **Overengineering [LEAN]**: Simple aggregation with two adjustments; no unnecessary abstraction. (deliberated: confirmed — Confirmed. engine.ts:105 computes `total * (1 + HOUSE_EDGE)` = `total * 1.05`, but the JSDoc at line 99 states 'target RTP of approximately 95%', requiring `total * (1 - HOUSE_EDGE)` = `total * 0.95`. The code increases payout by 5% instead of decreasing, yielding RTP > 100%. Additionally, line 108 `total += bet * 0.01` unconditionally adds 1% of bet even on zero-win spins, further distorting RTP. Both are correctness bugs affecting monetary outcomes.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: No RAG matches. Top-level orchestrator resolving DI, building reels, evaluating paylines, handling scatters/free-spins/jackpot, and emitting events.
- **Correction [NEEDS_FIX]**: bet > 100 violates the Bet 1..100 contract but is only warned, not rejected.
- **Overengineering [LEAN]**: The function's own structure is straightforward orchestration (validate, build reels, evaluate lines, check bonuses, return). Over-engineered abstractions it calls (factory, strategy, emitter) are defined in other files and evaluated there; per the single-source rule, this consumer is LEAN. (deliberated: confirmed — Confirmed with higher confidence after full trace. (1) DI container resolves `rng` (line 120) and `reelsModule` (line 122) but neither is used — factory.buildReels at line 128 calls spinReel directly, bypassing DI. (2) Fresh FreeSpinState at line 141 means free spin retrigger/decrement branches in handleFreeSpins (freespin.ts:17-24) are unreachable — free spins never persist across calls. (3) SpinEventEmitter at lines 175-176 registers an empty handler `() => {}` and immediately emits — pure no-op. These are structural bugs, not style issues.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No `any` | FAIL | CRITICAL | `bet: any` appears on both public exported functions `computePayout` and `spin`. These are the primary entry points of the module. The type `Bet = number` is already defined and should be used instead. [L90, L97] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is declared as `number[][]`, making its inner arrays mutable. Should be `readonly (readonly number[])[]` or use `as const satisfies`. [L38-L49] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `bet: any` on both public exports triggers `@typescript-eslint/no-explicit-any`; (2) `throw "invalid bet"` triggers `@typescript-eslint/no-throw-literal`; (3) `emitter.on(SPIN_DONE, () => {})` registers a no-op listener that is never removed, triggering `no-empty-function` and risking a listener leak. [L90, L97, L100, L155] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` (the primary public API) and `Bet` have no JSDoc. `computePayout` is documented. Two missing is below the FAIL threshold of three. [L97, L13] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` at L100 throws a string primitive instead of an `Error`. This drops the stack trace, breaks `instanceof Error` checks, and leaves callers without a `.message`/`.name` contract. This is on the hot path of the public `spin()` function. [L100] |
| 14 | Performance | WARN | MEDIUM | `new StandardReelBuilderFactory()`, `new DefaultStrategy()`, and `new SpinEventEmitter()` are instantiated on every `spin()` call. If these constructors are non-trivial, they should be hoisted to module scope or injected. Additionally, `wildCount` is computed twice: once in `evaluateLine` and again in the loop at L142–L150. [L113-L115, L142-L150] |
| 15 | Testability | WARN | MEDIUM | `EngineContainer` provides a DI mechanism for `rng`/`paytable`/`reels`, but `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are hard-instantiated inside `spin()` with no injection seam. `computePayout` is a pure, fully testable function. Partial seam exists. [L113-L115] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `as const satisfies readonly (readonly number[])[][]` for both immutability and type narrowing. No `satisfies` or const type parameters used anywhere in the file. |
| 17 | Context-adapted rules | WARN | MEDIUM | Gambling domain: `HOUSE_EDGE` is a regulated RTP parameter hardcoded in source rather than injected from a configurable/auditable store. In regulated jurisdictions, static RTP values embedded in code are not independently verifiable by auditors. Additionally, `emitter.on(SPIN_DONE, () => {})` registers a no-op listener on every spin with no corresponding `off`, which will leak listeners over repeated calls. [L14, L155-L156] |

### Suggestions

- Replace `any` with the already-defined `Bet` type on both public exports
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error instance instead of a raw string
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Make PAYLINES fully immutable with `as const`
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ... same values
  ] as const satisfies ReadonlyArray<readonly number[]>;
  ```
- Remove the no-op event listener registration (or remove the emitter entirely if unused)
  ```typescript
  // Before
  emitter.on(SPIN_DONE, () => {});
  emitter.emit(SPIN_DONE, finalResult);
  // After
  emitter.emit(SPIN_DONE, finalResult);
  ```
- Add JSDoc to the primary public export `spin`
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
  // After
  /**
   * Runs one full spin: spins five reels, evaluates ten paylines, applies wild multipliers,
   * detects scatter bonuses and the progressive jackpot.
   * @param bet - Integer coin bet in the range 1..100.
   * @returns Structured outcome including total coin payout.
   */
  export function spin(bet: Bet): SpinResult {
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Replace `Math.ceil(total)` with `Math.floor(total)` to round slot payouts down, retaining fractional coins for the house per standard slot-industry convention. [L110]
- **[correction · medium · small]** Replace `console.warn("bet exceeds maximum")` with `throw "invalid bet"` (or include `bet > 100` in the existing validation condition) so out-of-range bets are rejected per the 1..100 contract. [L119]

### Refactors

- **[correction · high · large]** Change `total * (1 + HOUSE_EDGE)` to `total * (1 - HOUSE_EDGE)` so the house edge reduces the raw win total, bringing RTP toward the documented 95% target instead of exceeding 100%. [L107]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[utility · low · trivial]** Consider removing low-value code: `DEBUG_MODE` (`DEBUG_MODE`) [L15-L15]
- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
