# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 92% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 90% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 88% |
| evaluateLine | function | no | OK | ACCEPTABLE | USED | UNIQUE | - | 82% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 96% |
| spin | function | yes | NEEDS_FIX | ACCEPTABLE | USED | UNIQUE | - | 92% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Type exported and imported by src/index.ts.
- **Duplication [UNIQUE]**: Trivial type alias for number; no similar symbol found.
- **Correction [OK]**: Type alias for number; matches the README.
- **Overengineering [LEAN]**: Simple type alias matching README's documented API. Trivial; no abstraction cost.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout to apply house edge.
- **Duplication [UNIQUE]**: Module-specific constant; no similar symbol found.
- **Correction [OK]**: The constant is fine. The misuse is in computePayout.
- **Overengineering [LEAN]**: Plain named constant.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin as a debug-logging guard; constant false makes the branch dead but the symbol is referenced.
- **Duplication [UNIQUE]**: Module-specific debug flag; no similar symbol found.
- **Correction [OK]**: Constant debug flag. No issue.
- **Overengineering [LEAN]**: Simple debug flag constant.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as `container` at L29 and used to resolve dependencies in spin.
- **Duplication [UNIQUE]**: Simple registry/DI container; no similar symbol found in RAG results.
- **Correction [OK]**: Simple registry. Every key that spin resolves is registered.
- **Overengineering [OVER]**: Untyped service-locator DI container for three statically imported functions. Single instance, no swapping, and resolve<T> casts unchecked. Direct use of the imports would be simpler.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Registers and resolves rng, paytable, reels in spin.
- **Duplication [UNIQUE]**: Singleton instance of EngineContainer; no similar symbol found.
- **Correction [OK]**: Registers the rng, paytable and reels entries that spin resolves.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin and indexed for wildMultiplier computation.
- **Duplication [UNIQUE]**: Payline layout data constant; no similar symbol found.
- **Correction [OK]**: 10 paylines of 5 rows each, all within rows 0-2. This matches the README's 10 paylines and the 5x3 grid.
- **Overengineering [LEAN]**: Plain data table of the ten paylines.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine to detect winning runs.
- **Duplication [DUPLICATE]**: Logic identical to lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER, counts run of lead or WILD, returns when run >= 3. Only the return field names differ (sym/run vs symbol/count).
- **Correction [OK]**: Handles a leading wild by taking the first non-wild symbol as lead. It rejects all-wild and scatter leads and counts the run correctly.
- **Overengineering [LEAN]**: Straightforward wild-aware run detection with a single loop.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~99% identical logic; same lead resolution, run counting and threshold of 3, differing only in result property names

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called per payline in spin.
- **Duplication [UNIQUE]**: Builds line symbols, computes payout with wild multipliers and returns LineWin; no similar function found.
- **Correction [OK]**: Line extraction, paytable lookup and wild counting are consistent. The wild multiplier formula is unusual but no contract says it is wrong.
- **Overengineering [ACCEPTABLE]**: The payFn parameter is a mild indirection, since getPayMultiplier is imported directly. The rest is direct payline evaluation and wild counting.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin to compute total payout.
- **Duplication [UNIQUE]**: Sums line wins, applies house edge and bet bonus; no similar function found.
- **Correction [NEEDS_FIX]**: The house edge is applied in the wrong direction, a flat payout is added on every spin, and the result rounds up. All three inflate payouts.
- **Overengineering [LEAN]**: Short reduce plus house edge and a small bet bonus. No unnecessary abstraction. (deliberated: confirmed — Confirmed. The JSDoc at src/engine.ts:97-100 and README.md ('RTP 95%... house edge of 5%') say the house edge should lower the return. Line 105 does `total * (1 + HOUSE_EDGE)` with HOUSE_EDGE=0.05 (line 14), so every win is raised by 5% instead of cut. Line 108 `total += bet * 0.01` adds money on every spin, including losing ones. Line 110 `Math.ceil` then rounds that up to at least 1 coin. Example: a losing spin with bet=1 gives ceil(0.01)=1, so the player gets the full bet back. All three errors raise payouts, and together they break the documented RTP.)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts.
- **Duplication [UNIQUE]**: Orchestrates the whole spin flow; no similar function found.
- **Correction [NEEDS_FIX]**: The documented maximum bet of 100 is not enforced.
- **Overengineering [ACCEPTABLE]**: Orchestration is mostly direct. The wildMultiplier recomputation duplicates evaluateLine logic, and the no-op emitter.on handler is dead weight. The container, factory, strategy and emitter abstractions are defined elsewhere and flagged there, so spin itself stays acceptable. (deliberated: confirmed — Confirmed. README.md documents `type Bet = number; // 1..100 coins, integer`. src/engine.ts:114 rejects bets that are not numbers, are below 1, or are not integers. For the upper bound, line 118 only calls `console.warn("bet exceeds maximum")` and carries on: lineBet = bet/10 (line 130) and the payout uses the oversized bet. spin(1000) is accepted and paid out. spin is the public API (src/index.ts:1), so this is a real contract violation.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 2/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on the `bet` parameter of the exported `computePayout` and `spin`. `bet: Bet` (already declared as `number`) would remove the need for the runtime `typeof` check. [L101, L113] |
| 3 | Discriminated unions | WARN | MEDIUM | `EngineContainer.resolve<T>` is an unchecked `as T` cast over a `Map<string, unknown>`. Callers then re-assert types by string key. Direct imports or a typed registry interface would avoid the assertions. [L17-L27, L120-L122] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is a mutable `number[][]`. The README declares `SpinResult` fields as `ReadonlyArray`. `PAYLINES` should be `as const` or `readonly (readonly number[])[]`. `registry` and `checkLine`/`evaluateLine` params could also be readonly. [L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | Violations: `no-explicit-any`; `no-throw-literal` (`only-throw-error`); `no-unused-vars` for `rng` and `reelsModule` (resolved but never used); `no-empty-function` for `() => {}`; the imported `Symbol` type shadows the global `Symbol` (`no-shadow-restricted-names`/`no-redeclare`). `console.warn`/`console.log` trip `no-console`. [L1, L101, L113, L115, L118, L120, L122, L157] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `spin` and the `Bet` type are exported without JSDoc. Only `computePayout` is documented. |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string. The stack trace is lost and `instanceof Error` checks fail. Use `throw new RangeError(...)` or `TypeError`. Separately, `bet > 100` only logs a warning, although the README defines Bet as 1..100 (see doc_divergences). [L115, L118] |
| 13 | Security | WARN | HIGH | Slot-machine/gambling domain inferred from reels, paylines, jackpot and RTP. Payouts are computed with floating-point arithmetic (`bet / 10`, `* (1 + HOUSE_EDGE)`, `bet * 0.01`) and then rounded with `Math.ceil`. Money should use integer minor units. The bet is validated at runtime, but `computePayout` is exported with an unvalidated `any` bet. No secrets, eval or injection. [L101-L111, L125] |
| 14 | Performance | WARN | MEDIUM | Every spin allocates a new factory, strategy and emitter, and registers a no-op listener. Winning-line symbols are recomputed for the wild multiplier after `evaluateLine` already computed them. [L124-L126, L157-L158] |
| 15 | Testability | WARN | MEDIUM | A module-level singleton container is populated at import time. `spin` hard-instantiates `StandardReelBuilderFactory`, `DefaultStrategy` and `SpinEventEmitter`, so none can be injected. The container does not give real DI, since the resolved `rng` and `reelsModule` are never used. [L29-L32, L120-L126] |
| 17 | Context-adapted rules | WARN | MEDIUM | Dead `DEBUG_MODE` constant gating `console.log`. A no-op `emitter.on` is registered immediately before `emit`. Dead abstractions (`rng`, `reelsModule`) are resolved but unused. [L15, L151-L153, L157-L158] |

### Suggestions

- Type the bet and throw an Error subclass
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
      throw new RangeError(`Invalid bet ${bet}: expected integer in 1..100`);
    }
  ```
- Make paylines immutable
  - Before: `const PAYLINES: number[][] = [`
  - After: `const PAYLINES: readonly (readonly number[])[] = [`
- Remove unused container lookups and the no-op listener
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  ...
  emitter.on(SPIN_DONE, () => {});
  // After
  // drop unused resolves; inject emitter/strategy/factory via a deps parameter
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Apply the house edge as total * (1 - HOUSE_EDGE), or remove it if the paytable already encodes the RTP. [L105]
- **[correction · medium · small]** Remove the unconditional bet * 0.01 addition so a losing spin pays 0. [L108]
- **[correction · medium · small]** Replace Math.ceil with Math.floor so payouts round down. [L110]
- **[correction · medium · small]** Throw on bet > 100 instead of only warning, to enforce the documented 1..100 range. [L118]

### Refactors

- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
