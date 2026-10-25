# Review: `src/engine.ts`

**Verdict:** CRITICAL

## Symbols

| Symbol | Kind | Exported | Correction | Over-eng. | Utility | Duplication | Tests | Confidence |
|--------|------|----------|------------|-----------|---------|-------------|-------|------------|
| Bet | type | yes | OK | LEAN | USED | UNIQUE | - | 90% |
| HOUSE_EDGE | constant | no | OK | LEAN | USED | UNIQUE | - | 92% |
| DEBUG_MODE | constant | no | OK | LEAN | USED | UNIQUE | - | 90% |
| EngineContainer | class | no | OK | OVER | USED | UNIQUE | - | 90% |
| container | variable | no | OK | LEAN | USED | UNIQUE | - | 88% |
| PAYLINES | constant | no | OK | LEAN | USED | UNIQUE | - | 93% |
| checkLine | function | no | OK | LEAN | USED | DUPLICATE | - | 88% |
| evaluateLine | function | no | OK | LEAN | USED | UNIQUE | - | 78% |
| computePayout | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 95% |
| spin | function | yes | NEEDS_FIX | LEAN | USED | UNIQUE | - | 80% |

### Details

#### `Bet` (L12–L12)

- **Utility [USED]**: Runtime-imported by src/index.ts per import analysis.
- **Duplication [UNIQUE]**: Trivial type alias for number; no similar symbol found.
- **Correction [OK]**: Type alias for number. No correctness issue.
- **Overengineering [LEAN]**: Simple type alias documented in README as public API; trivial.
- **Tests [-]**: *(not evaluated)*

#### `HOUSE_EDGE` (L14–L14)

- **Utility [USED]**: Referenced in computePayout to apply house edge.
- **Duplication [UNIQUE]**: Module-specific constant; no similar symbol found.
- **Correction [OK]**: The constant 0.05 is consistent with the documented ~95% RTP. The misuse is in computePayout, which is where the defect belongs.
- **Overengineering [LEAN]**: Plain named constant.
- **Tests [-]**: *(not evaluated)*

#### `DEBUG_MODE` (L15–L15)

- **Utility [USED]**: Referenced in spin as debug guard. Constant false, so the guarded branch is unreachable, but the symbol is referenced.
- **Duplication [UNIQUE]**: Module-specific flag constant; no similar symbol found.
- **Correction [OK]**: Constant flag. No correctness issue.
- **Overengineering [LEAN]**: Plain boolean flag constant.
- **Tests [-]**: *(not evaluated)*

#### `EngineContainer` (L17–L27)

- **Utility [USED]**: Instantiated as `container` at L29 and used for register/resolve.
- **Duplication [UNIQUE]**: Simple registry class; no similar symbol found in RAG results.
- **Correction [OK]**: Simple registry. The unchecked cast in resolve is only exercised with keys registered at module load.
- **Overengineering [OVER]**: DI container with untyped string-keyed registry for three statically imported functions used in one place. Adds indirection and unsafe casts; direct use of imports suffices.
- **Tests [-]**: *(not evaluated)*

#### `container` (L29–L29)

- **Utility [USED]**: Registers dependencies and resolves rng, paytable and reels in spin.
- **Duplication [UNIQUE]**: Module-level instance of EngineContainer; no similar symbol found.
- **Correction [OK]**: Instance holds registrations that spin resolves correctly.
- **Overengineering [LEAN]**: Auto-resolved: function ≤ 5 lines
- **Tests [-]**: *(not evaluated)*

#### `PAYLINES` (L34–L45)

- **Utility [USED]**: Iterated in spin and indexed for wildMultiplier computation.
- **Duplication [UNIQUE]**: Payline layout constant; no similar symbol found.
- **Correction [OK]**: Ten paylines of five columns each, with row indices in 0..2 for a 5x3 grid.
- **Overengineering [LEAN]**: Static data table of ten paylines; minimal and appropriate.
- **Tests [-]**: *(not evaluated)*

#### `checkLine` (L47–L64)

- **Utility [USED]**: Called by evaluateLine to detect winning runs.
- **Duplication [DUPLICATE]**: Logic is identical to lineWins: resolves lead symbol (skipping leading WILDs), rejects WILD/SCATTER leads, counts consecutive matching/WILD symbols, and returns a result if the run is >= 3. Only the result field names differ (sym/run vs symbol/count).
- **Correction [OK]**: Handles leading wilds, all-wild and scatter lines. Runs of 3 or more are counted left to right.
- **Overengineering [LEAN]**: Straightforward wild/lead detection and run counting; single purpose.
- **Tests [-]**: *(not evaluated)*

> **Duplicate of** `src/paytable.ts:lineWins` — ~100% identical logic; only the returned property names differ (sym/run vs symbol/count)

#### `evaluateLine` (L66–L95)

- **Utility [USED]**: Called per payline in spin.
- **Duplication [UNIQUE]**: No similar function found. It combines line extraction, payout calculation and wild multiplier logic.
- **Correction [OK]**: The wild multiplier (1+wc)*2^wc is unusual, but no documented contract states the intended value, so it is not flagged.
- **Overengineering [LEAN]**: Maps payline to symbols, computes payout with wild adjustments. Injected payFn is a small, reasonable seam.
- **Tests [-]**: *(not evaluated)*

#### `computePayout` (L101–L111)

- **Utility [USED]**: Called by spin to compute totalPayout; also exported.
- **Duplication [UNIQUE]**: No similar function found. It sums line payouts and applies the house edge.
- **Correction [NEEDS_FIX]**: The house edge is applied as a bonus, losing spins get a payout, and the result is rounded up. All three break the documented ~95% RTP and the industry rule that payouts round down.
- **Overengineering [LEAN]**: Short reduce plus house edge adjustment; no unnecessary abstraction. (deliberated: confirmed — Confirmed. src/engine.ts:97-99 JSDoc and README say the house edge holds RTP at 95%. Line 105 does `total * (1 + HOUSE_EDGE)` (HOUSE_EDGE=0.05, line 14), so every win grows by 5% instead of shrinking. Line 108 adds `bet * 0.01` on every spin, including losing spins. Line 110 rounds up with `Math.ceil`. All three push payouts in the player's favour. This is a money-calculation defect on the main payout path (called at engine.ts:138).)
- **Tests [-]**: *(not evaluated)*

#### `spin` (L113–L179)

- **Utility [USED]**: Runtime-imported by src/index.ts; main engine entry point.
- **Duplication [UNIQUE]**: No similar function found. It is the main orchestration function for a spin.
- **Correction [NEEDS_FIX]**: Bets above 100 only trigger console.warn. The README defines Bet as 1..100 and the code's own message says 'exceeds maximum', so an out-of-contract bet is processed.
- **Overengineering [LEAN]**: Long orchestration function, but its own code is straightforward. The over-engineered abstractions (factory, strategy, emitter) live in other files and are judged there. The no-op emitter.on/emit and the container lookups are minor wasted work, but not a fault of the function's own structure. (deliberated: confirmed — Confirmed. README documents `Bet = number; // 1..100 coins, integer`. src/engine.ts:114 rejects bets below 1 and non-integers, but line 118 only calls `console.warn` for bet > 100 and then plays the spin, so out-of-contract bets get paid. The payout comes from the faulty computePayout (line 138). The free-spin state is rebuilt fresh on every call (line 141), so free spins only report a count and never carry over. jackpotHit (line 145) is computed but never added to totalPayout.)
- **Tests [-]**: *(not evaluated)*

## Best Practices — 2.5/10

### Rules

| # | Rule | Status | Severity | Detail |
|---|------|--------|----------|--------|
| 2 | No any | FAIL | CRITICAL | Explicit `any` on exported signatures: `computePayout(lineWins, bet: any)` and `spin(bet: any)`. README declares `Bet = number`, and the `Bet` type is exported but unused. [L81, L90] |
| 5 | Immutability | WARN | MEDIUM | `PAYLINES` is a mutable `number[][]`; should be `as const` or `ReadonlyArray<ReadonlyArray<number>>`. README declares `SpinResult` with readonly arrays, but the engine builds mutable ones. `registry` is not `readonly`. [L13-L16, L34-L45] |
| 8 | ESLint compliance | FAIL | HIGH | `no-explicit-any` (2x), `only-throw-error` (string throw), `no-console` (console.warn/console.log), no-empty-function (`() => {}`), and a constant-condition branch on `DEBUG_MODE`. `bet > 100` only warns, while the README says 1..100. [L81, L90, L93, L95, L136-L138, L151] |
| 9 | JSDoc on public exports | WARN | MEDIUM | `computePayout` has JSDoc. `spin` (the main API) has none. The `Bet` type has none. Two exports are undocumented, so WARN. [L90] |
| 12 | Async/Promises/Error handling | FAIL | HIGH | `throw "invalid bet"` throws a string, not an `Error`. This is on the public `spin` entry point, so callers lose the stack and `.message`. [L92-L94] |
| 14 | Performance | WARN | MEDIUM | The wild-multiplier loop recomputes payline symbols and wild counts that `evaluateLine` already computed. A new factory, strategy and emitter are instantiated on every spin. The `emitter.on(SPIN_DONE, () => {})` no-op listener is registered on each spin. [L100-L102, L127-L137, L156-L157] |
| 15 | Testability | WARN | MEDIUM | A module-level DI container exists but is a service locator with untyped `resolve<T>` casts. The factory, strategy and emitter are hard-instantiated in `spin`. The `rng` and `reelsModule` values are resolved but never used; `reels` come from the factory. The `evaluateLine` and `checkLine` functions are pure and take `payFn`, which gives a seam. [L19-L30, L96-L102] |
| 16 | TypeScript 5.5+ features | WARN | MEDIUM | `PAYLINES` and the constants could use `as const` or `satisfies`. `registry` values are `unknown`, so typed keys would help. [L34-L45] |
| 17 | Context-adapted rules | WARN | MEDIUM | Dead code: unused `rng` and `reelsModule` variables, a no-op emitter listener, a constant `DEBUG_MODE` flag, and an over-engineered DI container. The `Bet` alias is not applied to the signatures. The README documents `spin(bet: Bet)`, but the code uses `any`, and a bet over 100 only warns instead of being rejected. [L13-L16, L98-L100, L156] |

### Suggestions

- Type `bet` as `Bet` and throw an `Error` (reject out-of-range values per the README's 1..100 range)
  ```typescript
  // Before
  export function spin(bet: any): SpinResult {
    if (typeof bet !== "number" || bet < 1 || !Number.isInteger(bet)) {
      throw "invalid bet";
    }
    if (bet > 100) console.warn("bet exceeds maximum");
  // After
  /** Runs one full spin for an integer bet of 1..100 coins. */
  export function spin(bet: Bet): SpinResult {
    if (!Number.isInteger(bet) || bet < 1 || bet > 100) {
      throw new RangeError(`invalid bet: ${bet}`);
    }
  ```
- Make paylines immutable
  ```typescript
  // Before
  const PAYLINES: number[][] = [
  // After
  const PAYLINES = [
    // ...
  ] as const satisfies ReadonlyArray<readonly number[]>;
  ```
- Remove the unused service-locator lookups and inject the collaborators instead
  ```typescript
  // Before
  const rng = container.resolve<typeof weightedPick>("rng");
  const factory = new StandardReelBuilderFactory();
  // After
  export function spin(bet: Bet, deps: SpinDeps = defaultDeps): SpinResult {
    const { factory, strategy, emitter, paytable } = deps;
  ```

## Actions

### Quick Wins

- **[correction · medium · small]** Remove the unconditional `total += bet * 0.01` so non-winning spins pay 0. [L108]
- **[correction · medium · small]** Round the payout down with Math.floor, not Math.ceil. [L110]
- **[correction · medium · small]** Throw when bet > 100 instead of only warning, to enforce the documented 1..100 range. [L118]

### Refactors

- **[correction · high · large]** Apply the house edge as a reduction, e.g. total * (1 - HOUSE_EDGE), not an increase. [L105]
- **[duplication · high · small]** Deduplicate: `checkLine` duplicates `lineWins` in `src/paytable.ts` (`checkLine`) [L47-L64]

### Hygiene

- **[overengineering · medium · small]** Simplify: `EngineContainer` is over-engineered (`EngineContainer`) [L17-L27]
