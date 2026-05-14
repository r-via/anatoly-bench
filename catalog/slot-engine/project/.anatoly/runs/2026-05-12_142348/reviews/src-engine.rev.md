# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | DEAD | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | WEAK | 95% |
| container | variable | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | WEAK | 60% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | NONE | 70% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | NONE | 70% |
| computePayout | function | yes | ERROR | ACCEPTABLE | USED | UNIQUE | NONE | 95% |
| spin | function | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | NONE | 90% |

### Details

#### `Bet` (L12–L12)

Auto-resolved: type cannot be over-engineered

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Used in computePayout at line 109 to adjust total payout.
- **Duplication [UNIQUE]**: Numeric constant, no similar functions found
- **Correction [OK]**: Constant value 0.05 is numerically correct; the defect is in computePayout's misuse of it.
- **Overengineering [LEAN]**: Named constant for a magic number used in one place.
- **Tests [NONE]**: No test file exists. HOUSE_EDGE silently inflates payouts (adds 5% instead of subtracting), which is a logic bug that tests would catch.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported; name reveals intent, but the effect on RTP calculation warrants a note.

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Checked at line 176 to conditionally log debug information.
- **Duplication [UNIQUE]**: Boolean constant, no similar functions found
- **Correction [OK]**: Boolean flag only; no logic to evaluate.
- **Overengineering [LEAN]**: Simple boolean flag guarding a log statement.
- **Tests [NONE]**: No test file exists. Constant is always false; dead code path is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported; self-explanatory boolean flag, tolerable.

#### `EngineContainer` (L17–L27)

Auto-resolved: import verified on disk (weightedPick found in ./rng.js)

#### `container` (L29–L29)

Auto-resolved: function ≤ 5 lines

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Used to iterate paylines at line 126, access specific paylines at lines 127 and 162.
- **Duplication [UNIQUE]**: Constant array, no similar functions found
- **Correction [OK]**: Ten payline row-index arrays match the documented layout exactly.
- **Overengineering [LEAN]**: Plain data table matching the documented 10-payline configuration. No abstraction needed.
- **Tests [NONE]**: No test file exists. Ten payline definitions drive all win detection; correctness of each pattern is untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc explaining row-index encoding, coordinate system (0=top), or payline count. Not exported but semantics are non-obvious.

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called from evaluateLine at line 86 to identify matching symbols on a payline.
- **Duplication [DUPLICATE]**: RAG score 0.834 with lineWins; identical logic for detecting consecutive matching symbols, skipping WILD/SCATTER, returning symbol and count if >= 3
- **Correction [OK]**: WILD substitution, run counting, SCATTER guard, and all-WILD early-exit are all handled correctly.
- **Overengineering [LEAN]**: Single-responsibility helper: scans a symbol array for a qualifying run. Straightforward loop, no unnecessary abstraction.
- **Tests [NONE]**: No test file exists. Critical win-detection logic with WILD substitution, SCATTER early-return, leading-WILD fallback, and run-length threshold — all untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported; private helper under 20 lines. WILD-substitution and SCATTER exclusion logic would benefit from brief doc.

> **Duplicate of** `src/paytable.ts:lineWins` — Same algorithm with different variable names (lead→first, run→count, sym→symbol) and field names in return object

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called in spin loop at line 127 to evaluate each payline for wins.
- **Duplication [UNIQUE]**: Higher-level function that orchestrates line evaluation with wild multiplier logic, no similar functions found
- **Correction [OK]**: Wild multiplier formula baseMultiplier × lineBet × (1+wildCount) × 2^wildCount matches documented spec.
- **Overengineering [LEAN]**: Computes payout for one payline. Accepts a `payFn` callback which is a reasonable seam for the paytable lookup. Length is justified by the wild-multiplier calculation.
- **Tests [NONE]**: No test file exists. WILD multiplier compounding formula (basePayout * (1 + wildCount) * 2^wildCount) and null-return paths are untested.
- **UNDOCUMENTED [UNDOCUMENTED]**: No JSDoc. Not exported; private helper. Wild-multiplier formula (1+wc)*2^wc applied here is non-trivial and undocumented.

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called from spin at line 129 to compute total payout; exported and transitively used.
- **Duplication [UNIQUE]**: Payout aggregation with house edge adjustment, no similar functions found
- **Correction [ERROR]**: Three independent defects: house edge applied in the wrong direction (boosts payout 5% instead of deducting it), undocumented 1%-of-bet addition on every spin, and Math.ceil rounds payouts up against casino-industry convention.
- **Overengineering [LEAN]**: Simple reducer with two adjustments. Overengineering axis is clean; a doc divergence is filed separately for the inverted house-edge logic.
- **Tests [NONE]**: No test file exists. Inverted house-edge application (multiplies by 1.05 instead of reducing), guaranteed 1% base return, and Math.ceil rounding are all untested.
- **PARTIAL [PARTIAL]**: JSDoc describes purpose and house-edge intent but omits @param for lineWins and bet (typed as any), omits @returns, and does not document the unconditional +1% floor (bet * 0.01). (deliberated: confirmed — Confirmed ERROR. Two defects at src/engine.ts:105 and :108. (1) House edge applied in wrong direction: `total * (1 + HOUSE_EDGE)` = `total * 1.05` INCREASES payout by 5%, contradicting the JSDoc at line 98-99 stating 'maintain a target RTP of approximately 95%'. Correct formula would be `total * (1 - HOUSE_EDGE)`. The constant is named HOUSE_EDGE (line 14), which by convention reduces player returns. The automated review at src-engine.rev.md:193 independently confirms this. The internal RAG docs describe the 1.05 multiplier as intentional, but those docs merely describe WHAT the code does, not validate correctness — the docs themselves say the target is 95% RTP while simultaneously describing a formula that achieves >100% RTP, which is self-contradictory. (2) Phantom payout: `total += bet * 0.01` at line 108 adds a guaranteed return on every spin including losses, further inflating RTP. Additionally, `bet: any` at line 101 is a type safety gap when `Bet = number` is defined at line 12. Raising confidence to 95 due to clear mathematical contradiction.)

#### `spin` (L113–L179)

Auto-resolved: JSDoc block found before symbol

## Best Practices — 6/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on both exported function parameters: `computePayout(lineWins: LineWin[], bet: any)` and `spin(bet: any)`. `Bet` is already declared as `number` on line 12 and should be used here. [L96, L101] |
| 3 | Discriminated unions | WARN | MEDIUM | `EngineContainer.resolve<T>` performs `this.registry.get(key) as T` — an unsafe cast from `unknown` with no runtime guard. A typed registry map keyed to known keys would eliminate the forced cast. [L24-L26] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is `number[][]` — both the outer array and inner arrays are mutable. Should be `as const` or typed `readonly (readonly number[])[]`. [L34] |
| 8 | ESLint compliance | FAIL | HIGH | Three violations: (1) `rng` and `reelsModule` are resolved from the container but never used anywhere in `spin()` — `no-unused-vars`. (2) `throw "invalid bet"` throws a string literal, not an Error — `no-throw-literal`. (3) `emitter.on(SPIN_DONE, () => {})` registers an empty callback — `no-empty-function`. [L103, L110-L111, L157, L159] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin()` and the `Bet` type alias have no JSDoc. `computePayout` has JSDoc but its `bet` parameter is typed `any`, making the documentation misleading. [L101, L12] |
| 12 | Async/Promises/Error handling | WARN | HIGH | No async code or unhandled rejections. `throw "invalid bet"` (string literal) loses the stack trace and prevents `instanceof Error` checks at call sites — prefer `throw new Error("invalid bet")`. [L103] |
| 13 | Security | WARN | HIGH | Slot-machine gambling domain inferred from reels/paylines/jackpot/scatter/wild vocabulary. All intermediate payout calculations use IEEE-754 floating-point (`lineBet = bet / 10`, `basePayout * (1 + wildCount) * 2 ** wildCount`, `total * (1 + HOUSE_EDGE)`). Regulated gambling requires exact integer coin arithmetic; floating-point drift can cause certified RTP to deviate. `Math.ceil` at output partially mitigates but does not eliminate systematic bias in compound multiplications. [L80-L84, L97-L100] |
| 14 | Performance | WARN | MEDIUM | Wild count is computed twice: once inside `evaluateLine` (lines ~80-84) and again in the `spin()` winner loop (lines ~138-146). `rng` and `reelsModule` are resolved from the container on every call but neither is used, adding pointless Map lookups. [L110-L111, L138-L146] |
| 15 | Testability | WARN | MEDIUM | `spin()` instantiates `StandardReelBuilderFactory`, `DefaultStrategy`, and `SpinEventEmitter` inline — none are injectable, forcing tests to use real implementations. The container registers `rng` and `reelsModule` but `factory.buildReels()` is called directly, bypassing the injected dependencies entirely — the DI setup is dead code. |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` could use `satisfies` for stronger inference while preserving the literal tuple types. `EngineContainer` could benefit from `using` if it held disposable resources. [L34] |
| 17 | Context-adapted rules | WARN | MEDIUM | Two issues for a game-engine module: (1) `emitter.on(SPIN_DONE, () => {})` registers a no-op listener and never unsubscribes — potential memory leak on repeated `spin()` calls. (2) `spin()` combines reel-building, line evaluation, free-spin handling, jackpot detection, and event emission in one function, violating SRP and complicating outcome tracing. [L157, L159] |

### Suggestions

- Replace `bet: any` with the already-declared `Bet` alias in both exported functions
  ```typescript
  // Before
  export function computePayout(lineWins: LineWin[], bet: any): number
  export function spin(bet: any): SpinResult
  // After
  export function computePayout(lineWins: LineWin[], bet: Bet): number
  export function spin(bet: Bet): SpinResult
  ```
- Throw an Error object instead of a string literal
  - Before: `throw "invalid bet";`
  - After: `throw new Error("invalid bet");`
- Remove the two unused container resolutions in spin()
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  const reelsModule = container.resolve<{ getReelSymbols: typeof getReelSymbols; getReelWeights: typeof getReelWeights }>("reels");
  // After
  const paytable = container.resolve<typeof getPayMultiplier>("paytable");
  ```
- Make PAYLINES immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [
    [1, 1, 1, 1, 1],
    ...
  ];
  // After
  const PAYLINES = [
    [1, 1, 1, 1, 1],
    ...
  ] as const;
  ```
- Use integer coin arithmetic throughout payout calculations to avoid floating-point drift in regulated gambling context
  ```typescript
  // Before
  const lineBet = bet / 10;
  // floating-point multiplications accumulate
  return Math.ceil(total);
  // After
  // Work in integer coin units; divide only at the display layer
  const lineBetCoins = Math.floor(bet / 10);
  // ... integer arithmetic throughout ...
  return total; // already integer
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove or document total += bet * 0.01; it silently returns 1% of bet on every spin including losses, inflating RTP beyond the documented target. [L108]
- **[correction · medium · small]** Replace Math.ceil with Math.floor so the house retains fractional remainders per casino-industry convention. [L110]
- **[correction · medium · small]** Add a missing-key guard in EngineContainer.resolve that throws a descriptive Error instead of returning undefined cast to T. [L25]
- **[correction · medium · small]** Either pass the resolved rng and reelsModule into the factory/reel-building logic, or remove the dead container.resolve calls so the DI setup reflects actual runtime behavior. [L120]
- **[utility · high · trivial]** Remove dead code: `Bet` is exported but unused (`Bet`) [L12-L12]

### Refactors

- **[correction · high · large]** Fix house-edge direction in computePayout: change total * (1 + HOUSE_EDGE) to total * (1 - HOUSE_EDGE) to deduct the 5% margin and achieve the documented ~95% RTP. [L105]
- **[duplication · medium · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[correction · low · trivial]** Replace throw "invalid bet" with throw new Error("invalid bet") to produce a proper Error instance with a stack trace. [L115]
- **[overengineering · medium · small]** Simplify: `Bet` is over-engineered `Bet`, `EngineContainer`, `container` (`Bet, EngineContainer, container`) [L12-L12, L17-L27, L29-L29]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `Bet` (`Bet`) [L12-L12]
- **[documentation · medium · trivial]** Add JSDoc documentation for exported symbol: `spin` (`spin`) [L113-L179]
- **[documentation · low · trivial]** Complete JSDoc documentation for: `computePayout` (`computePayout`) [L101-L111]
