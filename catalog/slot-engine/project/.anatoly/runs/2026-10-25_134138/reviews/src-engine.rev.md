# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 88% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 88% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 93% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 85% |
| evaluateLine | function | no | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 96% |
| spin | function | yes | OK | ACCEPTABLE | USED | UNIQUE | - | 70% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts per import analysis.
- **Duplication [UNIQUE]**: Simple type alias; no similar symbol found.
- **Correction [OK]**: Plain type alias, no correctness issue.
- **Overengineering [LEAN]**: Trivial type alias documented in README API; not used in signatures here but harmless.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout to apply the house edge.
- **Duplication [UNIQUE]**: Module-level numeric constant; no similar symbol found.
- **Correction [OK]**: The constant value is plausible. The misuse is in computePayout, which is where the defect is reported.
- **Overengineering [LEAN]**: Simple named constant.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin's debug guard. Always false, so the guarded branch is unreachable, but the constant is read.
- **Duplication [UNIQUE]**: Module-level boolean flag; no similar symbol found.
- **Correction [OK]**: Constant flag, no correctness issue.
- **Overengineering [LEAN]**: Simple boolean flag constant.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as `container` at L29.
- **Duplication [UNIQUE]**: Small registry/DI container class; no similar symbol found.
- **Correction [OK]**: Simple registry. The unchecked cast in `resolve` is safe for the keys registered here.
- **Overengineering [OVER]**: Untyped string-keyed DI container for three module-level functions used in one place. Direct imports suffice; adds casts and loses type safety.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Registers rng, paytable and reels, then spin resolves them.
- **Duplication [UNIQUE]**: Singleton instance of EngineContainer; no similar symbol found.
- **Correction [OK]**: Instance created and populated correctly.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin and indexed for wildMultiplier.
- **Duplication [UNIQUE]**: Payline layout data constant; no similar symbol found.
- **Correction [OK]**: There are 10 distinct paylines of 5 columns each, with row indices in 0..2, which fits a 5x3 grid and matches the README.
- **Overengineering [LEAN]**: Plain data table of payline patterns; minimal and necessary.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine.
- **Duplication [DUPLICATE]**: Same logic as lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts run of lead or WILD, returns a result if run >= 3. Only the return field names differ (sym/run vs symbol/count).
- **Correction [OK]**: Left-to-right run counting with wild substitution is consistent. Scatter and all-wild lines return null by design.
- **Overengineering [LEAN]**: Straightforward run-length evaluation with wild handling.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~98% identical logic; same algorithm, differing only in returned property names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin's payline loop.
- **Duplication [UNIQUE]**: Builds line symbols, calls checkLine, applies the pay function and wild multiplier. No similar function found in the RAG results.
- **Correction [OK]**: Wild count is taken over the run, and the multiplier is applied consistently with the wildMultiplier computed in spin. No contract shows the formula to be wrong.
- **Overengineering [ACCEPTABLE]**: Injected payFn adds slight indirection, but the function is otherwise direct and wild counting is reasonable.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin to compute totalPayout. Exported but not directly imported elsewhere.
- **Duplication [UNIQUE]**: Sums line payouts and applies the house edge and a bet rebate. No similar function found in the RAG results.
- **Correction [NEEDS_FIX]**: Payout math is wrong in three independent ways: the house edge raises payouts, every spin gets a bonus, and rounding goes up.
- **Overengineering [LEAN]**: Short reduce plus house-edge adjustment; no unnecessary abstraction. (deliberated: confirmed — Confirmed. The JSDoc at src/engine.ts:97-100 says the function applies the house edge to hold ~95% RTP. The code does the opposite. L105 `total * (1 + HOUSE_EDGE)` raises winning payouts by 5% when it should cut them (the README states 95% RTP). L108 `total += bet * 0.01` pays on every spin, including spins with no line wins. L110 `Math.ceil` rounds up, so every bet of 1 or more returns at least 1 coin. All three errors favor the player and break the RTP contract. Called from spin at L138.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Orchestrates the whole spin flow. No similar function found in the RAG results.
- **Correction [OK]**: No in-file computation bug found. The only issue is `bet > 100` warning instead of rejecting, which contradicts the README range; it is reported as a doc divergence.
- **Overengineering [ACCEPTABLE]**: Orchestration is mostly straightforward. Per-call instantiation of the factory, strategy and emitter, and the no-op emitter subscription, come from abstractions defined elsewhere. The wildMultiplier loop duplicates evaluateLine's wild counting, which is mild redundancy.
- **Tests [-]**: *(not evaluated)*

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | `bet: any` appears on the exported `computePayout` and `spin`. README declares `Bet = number`, and the file already exports `Bet`. In `computePayout`, `any` silences type checking on `bet * 0.01`. [L101, L113] |
| 3 | Discriminated unions | WARN | MEDIUM | `EngineContainer.resolve<T>` casts `unknown` to `T` with `as T`, an unchecked assertion with no tagged or typed registry. [L24-L26] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is a mutable `number[][]` shared constant. It should be `as const` or `ReadonlyArray<ReadonlyArray<number>>`. `lineWins: LineWin[]` and `reels: Symbol[][]` also diverge from the README's ReadonlyArray types. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | Several lint violations. `no-explicit-any` fires on `bet: any`. `no-throw-literal` fires on `throw "invalid bet"`. `no-unused-vars` fires on `rng` and `reelsModule`, which are resolved but never used. `no-empty-function` fires on `() => {}`. The `Symbol` import also shadows the global `Symbol` (`no-shadow-restricted-names` / `no-redeclare` builtinGlobals). [L1, L101, L113, L115, L120, L122, L175] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` has no JSDoc. Its bet range (1..100), its throw behavior, and its side effects (console.warn, event emission) cannot be read from the signature. `computePayout` has JSDoc, but its comment claims about 95% RTP while the code multiplies wins by (1 + HOUSE_EDGE), which increases payouts. [L97-L113] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string. It has no stack trace, no `.message`, and fails `instanceof Error` checks. Throw a `RangeError` or `TypeError` instead. [L115] |
| 14 | Performance | WARN | MEDIUM | Each spin allocates a new factory, strategy, and emitter. It attaches a no-op listener on a throwaway emitter. Wild counts are recomputed in a second pass over the paylines that `evaluateLine` already did. [L124-L126, L147-L157, L175] |
| 15 | Testability | WARN | MEDIUM | The `EngineContainer` is a module-level singleton, and `spin` takes no injected dependencies. `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` are hard-wired. The container resolves `rng` and `reelsModule` but never uses them. `computePayout` and `evaluateLine` are pure and testable. [L29-L32, L120-L126] |
| 17 | Context-adapted rules | WARN | MEDIUM | The README defines Bet as 1..100, but the engine only calls console.warn for bets above 100 and still plays them. A library should not log directly. `DEBUG_MODE` is a hard-coded dead flag. The DI container is unused indirection. [L15, L118, L159-L161] |

### Suggestions

- Type bet as Bet and throw a real Error
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
      throw "invalid bet";
    }
    if (bet > 100) console.warn("bet exceeds maximum");
  // After
  export function spin(bet: Bet): SpinResult {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
      throw new RangeError(`invalid bet: ${bet} (expected integer 1..100)`);
    }
  ```
- Type computePayout's bet parameter
  - Before: `export function computePayout(lineWins: LineWin[], bet: any): number`
  - After: `export function computePayout(lineWins: readonly LineWin[], bet: Bet): number`
- Remove unused container resolutions and make PAYLINES readonly
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const PAYLINES: number[][] = [
  // After
  const PAYLINES: ReadonlyArray<readonly number[]> = [
  ```
- Inject collaborators instead of constructing them in spin
  ```typescript
  // Before
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  // After
  export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult { const { factory, strategy, emitter } = deps; ... }
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Apply the house edge as a reduction, or remove it, so payouts do not exceed the target RTP. `(1 + HOUSE_EDGE)` currently raises every win by 5%. [L105]
- **[correction · medium · small]** Remove the unconditional `bet * 0.01` addition, which pays out on losing spins. If a consolation payout is intended, it needs a documented contract. [L108]
- **[correction · medium · small]** Replace `Math.ceil` with `Math.floor` so fractional payouts round down in the house's favour. [L110]

### Refactors

- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
