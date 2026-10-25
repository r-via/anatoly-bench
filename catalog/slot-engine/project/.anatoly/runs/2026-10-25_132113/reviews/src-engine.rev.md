# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 88% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 92% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 85% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 82% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 96% |
| spin | function | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | - | 88% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Exported type, imported by src/index.ts.
- **Duplication [UNIQUE]**: Simple type alias for number; no similar symbol found.
- **Correction [OK]**: Type alias, no correctness issue.
- **Overengineering [LEAN]**: Simple type alias documented in README as public API; mirrors documented contract.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout to apply house edge.
- **Duplication [UNIQUE]**: Module-level numeric constant; no similar symbol found.
- **Correction [OK]**: The constant 0.05 is consistent with a 95% RTP target. The defect is in how computePayout applies it.
- **Overengineering [LEAN]**: Plain named constant.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin's debug branch. Constant false, so the branch is dead code, but the symbol is referenced.
- **Duplication [UNIQUE]**: Module-level boolean flag; no similar symbol found.
- **Correction [OK]**: Plain flag, no issue.
- **Overengineering [LEAN]**: Simple constant flag.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as `container` at L29.
- **Duplication [UNIQUE]**: Simple registry/DI container class; no similar symbol found.
- **Correction [OK]**: Simple registry. The unchecked cast in resolve is a style concern, and every key spin resolves is registered.
- **Overengineering [OVER]**: Untyped DI registry (Map<string, unknown> with unchecked cast) wrapping three statically importable functions. Single use, no swapping or test injection; direct imports suffice.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Used by register calls at module level and by resolve calls in spin.
- **Duplication [UNIQUE]**: Singleton instance of EngineContainer; no similar symbol found.
- **Correction [OK]**: Registers rng, paytable and reels. Every key spin resolves is present.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin and indexed for wildMultiplier.
- **Duplication [UNIQUE]**: Payline definition table; no similar symbol found.
- **Correction [OK]**: 10 paylines of 5 rows each, with rows in 0..2 for a 3-row grid. This matches the README's ten paylines.
- **Overengineering [LEAN]**: Static data table for ten paylines; required by domain.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins: resolves the lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts the run of matching or WILD symbols, and returns a result if run >= 3. Only the return field names differ (sym/run vs symbol/count).
- **Correction [OK]**: Resolves a leading wild to the first non-wild symbol and counts the left-to-right run. It returns null for wild-only or scatter-led lines. No contract says 5 wilds must pay.
- **Overengineering [LEAN]**: Concise wild-aware run detection; proportionate to the task.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~99% identical logic; only the returned property names differ

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called per payline in spin.
- **Duplication [UNIQUE]**: Builds line symbols, calls checkLine, applies pay function and wild multiplier to produce a LineWin. No similar function found.
- **Correction [OK]**: Maps the payline to symbols, looks up the multiplier and applies the wild multiplier. The compounding wild formula is unusual but no contract says it is wrong.
- **Overengineering [LEAN]**: Straightforward line evaluation with injected payFn and wild multiplier; no unnecessary abstraction.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Exported, not directly imported elsewhere, but called by spin.
- **Duplication [UNIQUE]**: Sums line payouts and applies house edge and bet rake. No similar function found.
- **Correction [NEEDS_FIX]**: The house edge is applied as a bonus. A flat bet-based payout is added on losing spins. Math.ceil rounds payouts up.
- **Overengineering [LEAN]**: Simple reduce plus house edge adjustment. (deliberated: confirmed — Confirmed in src/engine.ts:101-111. Line 105 does `total = total * (1 + HOUSE_EDGE)`, which multiplies winning payouts by 1.05. That is a bonus to the player, not a house edge. The JSDoc at L97-99 and the README's RTP section ('targets ... 95%') say the opposite. Line 108 (`total += bet * 0.01`) adds a payout on every spin, losing spins included. Line 110 `Math.ceil` rounds every result up in the player's favour, so a 0-win spin with bet=10 pays ceil(0.1)=1 coin. All three push RTP up, not down to 95%.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Exported, runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Main spin orchestrator; no similar function found.
- **Correction [NEEDS_FIX]**: The README defines Bet as 1..100, but bets above 100 only log a warning and are still played.
- **Overengineering [ACCEPTABLE]**: Main orchestration is mostly straightforward. It does instantiate a per-call factory, strategy and event emitter (with a no-op listener), and recomputes the wild multiplier separately from evaluateLine. The over-engineering lives in those abstractions' own files, so the consumer is not flagged as OVER. (deliberated: confirmed — README API declares `type Bet = number; // 1..100 coins, integer`, and src/engine.ts:12 defines `Bet`. But src/engine.ts:114 only rejects non-number, <1 and non-integer bets. At L118, `if (bet > 100) console.warn(...)` logs and then keeps going, so spin(1000) is played and paid out (lineBet = bet/10 at L130; computePayout(wins, bet) at L138). The documented upper bound is not enforced. spin is the public entry point (src/index.ts:1).)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on public signatures: `computePayout(lineWins, bet: any)` and `spin(bet: any)`. README declares `spin(bet: Bet)`; `Bet` is defined but unused. [L88-L98] |
| 3 | Discriminated unions | WARN | MEDIUM | `container.resolve<T>` uses an unchecked `as T` assertion on `unknown`. Symbols are compared as string literals without a tagged union. [L21-L23] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is a mutable `number[][]`; should be `as const` or `ReadonlyArray<ReadonlyArray<number>>`. `registry` is not `readonly`. `lineWins: LineWin[]` is not readonly. [L13-L45] |
| 8 | ESLint compliance | FAIL | HIGH | `no-explicit-any` violations. `no-throw-literal` violation. The `Symbol` import shadows the global `Symbol` (`no-shadow`/`no-redeclare` of builtins). `DEBUG_MODE` is a constant false, so the `if` is flagged by `no-constant-condition`. Unused `rng` and `reelsModule` locals trigger `no-unused-vars`. A no-op `emitter.on(SPIN_DONE, () => {})` handler. [L1-L1, L89-L93, L121-L123] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computePayout` has JSDoc. `spin` lacks JSDoc. The `Bet` and `SpinResult` type exports also have none. [L98] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string rather than an Error, losing the stack trace and the `.message` contract. The `bet > 100` check only warns via `console.warn` and continues, though the README documents 1..100. [L100-L104] |
| 14 | Performance | WARN | MEDIUM | Builds a new factory, strategy and emitter on every spin. Payline symbols are recomputed for the wild multiplier. The emitter is created per call with a no-op listener. [L108-L112, L145-L155] |
| 15 | Testability | WARN | MEDIUM | `factory`, `strategy` and `emitter` are hard-instantiated inside `spin`. A module-level service-locator container is used with untyped `resolve`. `evaluateLine` and `checkLine` are pure and accept `payFn`. The container makes injection look possible, but `spin` has no parameter to override it. [L19-L33, L108-L112] |
| 17 | Context-adapted rules | WARN | MEDIUM | Library API: `computePayout` takes `bet: any` and mixes responsibilities. Magic numbers are inline (`0.01`, `/ 10`, `5, 3`, `100`). The wild-multiplier logic is duplicated between `evaluateLine` and `spin`. `DEBUG_MODE` is a hardcoded flag. The `console.warn` and `console.log` calls in library code are undesirable. |

### Suggestions

- Type the bet parameter as `Bet` in the public API
  - Before: `export function spin(bet: any): SpinResult {`
  - After: `export function spin(bet: Bet): SpinResult {`
- Throw an Error instead of a string
  - Before: `throw "invalid bet";`
  - After: `throw new RangeError(`invalid bet: ${String(bet)}`);`
- Make PAYLINES immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: ReadonlyArray<ReadonlyArray<number>> = [`
- Inject dependencies into spin via an optional parameter and drop the untyped container
  ```typescript
  // Before
  const factory = new StandardReelBuilderFactory();
  const strategy = new DefaultStrategy();
  // After
  export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult {
    const { factory, strategy, emitter } = deps;
  ```
- Reuse the wild count computed in evaluateLine instead of recomputing it in spin
  - Before: `for (const w of wins) { ... wc ... }`
  - After: `// return wildCount in LineWin and compute wildMultiplier from wins`

## Actions

### Quick Wins

- **[correction · medium · small]** Replace Math.ceil with Math.floor so fractional payout remainders go to the house. [L110]
- **[correction · medium · small]** Reject bets above 100 with a thrown Error instead of only warning, matching the documented 1..100 range. [L118]

### Refactors

- **[correction · high · large]** Apply the house edge as a reduction, e.g. total * (1 - HOUSE_EDGE), to match the documented RTP of about 95%. [L105]
- **[correction · high · large]** Remove the unconditional `total += bet * 0.01`, or move it inside a documented, intended branch, so losing spins pay 0. [L108]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
